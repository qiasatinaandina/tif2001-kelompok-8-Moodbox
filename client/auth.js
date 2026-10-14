javascript
/* =========================================
   MOODBOX STUDIO
   Frontend Login & Register
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
    // Tampilkan/sembunyikan kata sandi
    document.querySelectorAll("[data-toggle-password]").forEach((button) => {
        button.addEventListener("click", () => {
            const inputId = button.dataset.togglePassword;
            const passwordInput = document.getElementById(inputId);

            if (!passwordInput) return;

            const isPassword = passwordInput.type === "password";

            passwordInput.type = isPassword ? "text" : "password";
            button.textContent = isPassword ? "Sembunyikan" : "Lihat";
            button.setAttribute("aria-pressed", String(isPassword));
            button.setAttribute(
                "aria-label",
                isPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
            );
        });
    });

    // Elemen formulir Login
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        setupLoginForm(loginForm);
    }

    // Elemen formulir Register
    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        setupRegisterForm(registerForm);
    }

    // Fitur lupa kata sandi masih berupa pemberitahuan
    const forgotPassword = document.getElementById("forgotPassword");

    if (forgotPassword) {
        forgotPassword.addEventListener("click", (event) => {
            event.preventDefault();

            showNotice(
                "loginNotice",
                "Fitur pemulihan kata sandi belum tersedia pada versi frontend ini.",
                "error"
            );
        });
    }

    // Tautan contoh yang belum terhubung ke halaman kebijakan atau WhatsApp
    document.querySelectorAll('a[href="#"]').forEach((link) => {
        if (
            link.id === "forgotPassword" ||
            link.closest(".terms-option")
        ) {
            return;
        }

        link.addEventListener("click", (event) => {
            event.preventDefault();
        });
    });
});

/* =========================================
   LOGIN
   ========================================= */

function setupLoginForm(form) {
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        clearErrors(form);

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        let isValid = true;

        if (!email) {
            setError(
                "loginEmail",
                "loginEmailError",
                "Email atau nomor WhatsApp wajib diisi."
            );
            isValid = false;
        } else if (!isValidEmailOrPhone(email)) {
            setError(
                "loginEmail",
                "loginEmailError",
                "Masukkan email yang valid atau nomor WhatsApp yang benar."
            );
            isValid = false;
        }

        if (!password) {
            setError(
                "loginPassword",
                "loginPasswordError",
                "Kata sandi wajib diisi."
            );
            isValid = false;
        }

        if (!isValid) {
            showNotice(
                "loginNotice",
                "Periksa kembali data yang kamu masukkan.",
                "error"
            );
            return;
        }

        showNotice(
            "loginNotice",
            "Validasi berhasil. Login sungguhan memerlukan backend autentikasi.",
            "success"
        );
    });
}

/* =========================================
   REGISTER
   ========================================= */

function setupRegisterForm(form) {
    const nameInput = document.getElementById("registerName");
    const emailInput = document.getElementById("registerEmail");
    const passwordInput = document.getElementById("registerPassword");
    const confirmInput = document.getElementById("confirmPassword");
    const termsCheckbox = document.getElementById("agreeTerms");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        clearErrors(form);

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmInput.value;

        let isValid = true;

        // Validasi nama lengkap
        if (!name) {
            setError(
                "registerName",
                "registerNameError",
                "Nama lengkap wajib diisi."
            );
            isValid = false;
        } else if (name.length < 2) {
            setError(
                "registerName",
                "registerNameError",
                "Nama minimal terdiri dari 2 karakter."
            );
            isValid = false;
        }

        // Validasi email
        if (!email) {
            setError(
                "registerEmail",
                "registerEmailError",
                "Alamat email wajib diisi."
            );
            isValid = false;
        } else if (!isValidEmail(email)) {
            setError(
                "registerEmail",
                "registerEmailError",
                "Format email belum benar."
            );
            isValid = false;
        }

        // Validasi kata sandi
        if (!password) {
            setError(
                "registerPassword",
                "registerPasswordError",
                "Kata sandi wajib diisi."
            );
            isValid = false;
        } else if (password.length < 8) {
            setError(
                "registerPassword",
                "registerPasswordError",
                "Kata sandi harus terdiri dari minimal 8 karakter."
            );
            isValid = false;
        }

        // Validasi konfirmasi kata sandi
        if (!confirmPassword) {
            setError(
                "confirmPassword",
                "confirmPasswordError",
                "Konfirmasi kata sandi wajib diisi."
            );
            isValid = false;
        } else if (password !== confirmPassword) {
            setError(
                "confirmPassword",
                "confirmPasswordError",
                "Konfirmasi kata sandi tidak sama."
            );
            isValid = false;
        }

        // Persetujuan syarat dan ketentuan
        if (!termsCheckbox.checked) {
            setError(
                "agreeTerms",
                "agreeTermsError",
                "Kamu harus menyetujui syarat dan ketentuan."
            );
            isValid = false;
        }

        if (!isValid) {
            showNotice(
                "registerNotice",
                "Masih ada data yang perlu diperbaiki.",
                "error"
            );
            return;
        }

        showNotice(
            "registerNotice",
            "Semua data lolos validasi frontend. Akun belum dibuat karena backend belum tersedia.",
            "success"
        );
    });
}

/* =========================================
   HELPER VALIDASI
   ========================================= */

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidEmailOrPhone(value) {
    if (isValidEmail(value)) {
        return true;
    }

    // Mendukung nomor Indonesia yang diawali 08 atau +62.
    const normalized = value.replace(/[\s()-]/g, "");
    return /^(?:\+62|62|0)8\d{7,12}$/.test(normalized);
}

function setError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    if (input) {
        input.setAttribute("aria-invalid", "true");
    }

    if (error) {
        error.textContent = message;
    }
}

function clearErrors(form) {
    form.querySelectorAll(".error-message").forEach((element) => {
        element.textContent = "";
    });

    form.querySelectorAll('[aria-invalid="true"]').forEach((input) => {
        input.removeAttribute("aria-invalid");
    });

    const notice = form.querySelector(".auth-notice");

    if (notice) {
        notice.textContent = "";
        notice.className = "auth-notice";
    }
}

function showNotice(elementId, message, type) {
    const element = document.getElementById(elementId);

    if (!element) return;

    element.textContent = message;
    element.className = `auth - notice ${type} `;
}