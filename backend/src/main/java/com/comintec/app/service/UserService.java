package com.comintec.app.service;

import com.comintec.app.dto.request.UserRequest;
import com.comintec.app.dto.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    UserResponse createUser(UserRequest request);
    UserResponse updateUser(Long id, UserRequest request);
    void deleteUser(Long id);
    UserResponse getUserById(Long id);
    Page<UserResponse> getAllUsers(Pageable pageable);
}
