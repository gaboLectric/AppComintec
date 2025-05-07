document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent default form submission

            const emailInput = document.getElementById('floatingInput');
            const passwordInput = document.getElementById('floatingPassword');

            const email = emailInput.value;
            const password = passwordInput.value;

            // Hardcoded credentials for testing
            const validEmail = 'gabriel';
            const validPassword = '123456789';

            if (email === validEmail && password === validPassword) {
                // Redirect to index.html
                window.location.href = 'index.html';
            } else {
                alert('Correo electrónico o contraseña incorrectos.');
            }
        });
    }
});
