package com.comintec.app.security;

import com.comintec.app.config.IpFilterConfig;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.List;

@Component
@Order(1) // Run before Spring Security's filters
public class IpAuthenticationFilter extends OncePerRequestFilter {

    private final List<String> allowedIps;
    private static final String[] IP_HEADER_CANDIDATES = {
        "X-Forwarded-For",
        "Proxy-Client-IP",
        "WL-Proxy-Client-IP",
        "HTTP_X_FORWARDED_FOR",
        "HTTP_X_FORWARDED",
        "HTTP_X_CLUSTER_CLIENT_IP",
        "HTTP_CLIENT_IP",
        "HTTP_FORWARDED_FOR",
        "HTTP_FORWARDED",
        "HTTP_VIA",
        "REMOTE_ADDR"
    };

    @Autowired
    public IpAuthenticationFilter(IpFilterConfig ipFilterConfig) {
        this.allowedIps = ipFilterConfig.getAllowedIps();
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, 
                                 @NonNull HttpServletResponse response, 
                                 @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        
        String clientIp = getClientIpAddress(request);
        
        // Allow health check endpoint
        if (request.getRequestURI().contains("/actuator/health")) {
            filterChain.doFilter(request, response);
            return;
        }

        if (isAllowed(clientIp)) {
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.getWriter().write("Access Denied: Your IP address is not allowed to access this resource.");
        }
    }

    private boolean isAllowed(String ipAddress) {
        if (ipAddress == null) {
            return false;
        }
        
        // Check if the IP is in the allowed list
        return allowedIps.stream().anyMatch(ip -> {
            if (ip.contains("/")) {
                // Handle CIDR notation
                try {
                    return isInRange(ipAddress, ip);
                } catch (UnknownHostException e) {
                    return false;
                }
            } else {
                // Direct IP match
                return ip.equals(ipAddress);
            }
        });
    }

    private boolean isInRange(String ipAddress, String cidr) throws UnknownHostException {
        String[] parts = cidr.split("/");
        String network = parts[0];
        int prefixLength = Integer.parseInt(parts[1]);
        
        byte[] ipBytes = InetAddress.getByName(ipAddress).getAddress();
        byte[] networkBytes = InetAddress.getByName(network).getAddress();
        
        if (ipBytes.length != networkBytes.length) {
            return false;
        }
        
        int numOfFullBytes = prefixLength / 8;
        byte finalByte = (byte) (0xFF << (8 - (prefixLength % 8)));
        
        for (int i = 0; i < numOfFullBytes; i++) {
            if (ipBytes[i] != networkBytes[i]) {
                return false;
            }
        }
        
        if (finalByte != 0) {
            return (ipBytes[numOfFullBytes] & finalByte) == (networkBytes[numOfFullBytes] & finalByte);
        }
        
        return true;
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String ip = null;
        
        // Try all possible headers first
        for (String header : IP_HEADER_CANDIDATES) {
            ip = request.getHeader(header);
            if (StringUtils.isNotBlank(ip) && !"unknown".equalsIgnoreCase(ip)) {
                // Get first IP in case of multiple IPs in header
                ip = ip.split(",")[0].trim();
                break;
            }
        }
        
        // If no IP found in headers, use remote address
        if (StringUtils.isBlank(ip) || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        
        // Handle IPv6 localhost
        if ("0:0:0:0:0:0:0:1".equals(ip) || "::1".equals(ip)) {
            return "127.0.0.1";
        }
        
        return ip;
    }
}
