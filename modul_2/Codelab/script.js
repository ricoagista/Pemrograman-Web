// Toggle navbar mobile

const menuToggle = document.querySelector("#menu-toggle");
const navMenuMobile = document.querySelector("#nav-menu-mobile");

menuToggle.addEventListener("click", function () {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";

    navMenuMobile.classList.toggle("hidden");

    menuToggle.setAttribute("aria-expanded", !isExpanded);

    if (!isExpanded) {
        menuToggle.setAttribute("aria-label", "Tutup menu navigasi");
    } else {
        menuToggle.setAttribute("aria-label", "Buka menu navigasi");
    }
});

const navLinks = navMenuMobile.querySelectorAll("a");
navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        navMenuMobile.classList.add("hidden");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Buka menu navigasi");
    });
});


// Validasi form kontak

const form = document.querySelector("#contact-form");

if (form) {

const inputName = document.querySelector("#name");
const inputEmail = document.querySelector("#email");
const inputMessage = document.querySelector("#message");
const errorName = document.querySelector("#error-name");
const errorEmail = document.querySelector("#error-email");
const errorMessage = document.querySelector("#error-message");
const successMsg = document.querySelector("#success-msg");

const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function tampilkanError(input, elError, pesan) {
    elError.textContent = pesan;
    input.classList.add("border-red-500");
    input.classList.remove("border-gray-300");
}

function hapusError(input, elError) {
    elError.textContent = "";
    input.classList.remove("border-red-500");
    input.classList.add("border-gray-300");
}

inputName.addEventListener("input", function () {
    hapusError(inputName, errorName);
});

inputEmail.addEventListener("input", function () {
    hapusError(inputEmail, errorEmail);
});

inputMessage.addEventListener("input", function () {
    hapusError(inputMessage, errorMessage);
});

// Validasi saat submit
form.addEventListener("submit", function (event) {
    event.preventDefault();

    let valid = true;

    successMsg.classList.add("hidden");
    successMsg.textContent = "";

    const nilaiName = inputName.value.trim();
    if (nilaiName === "") {
        tampilkanError(inputName, errorName, "Nama wajib diisi.");
        valid = false;
    } else if (nilaiName.length < 3) {
        tampilkanError(inputName, errorName, "Nama minimal 3 karakter.");
        valid = false;
    } else {
        hapusError(inputName, errorName);
    }

    const nilaiEmail = inputEmail.value.trim();
    if (nilaiEmail === "") {
        tampilkanError(inputEmail, errorEmail, "Email wajib diisi.");
        valid = false;
    } else if (!regexEmail.test(nilaiEmail)) {
        tampilkanError(inputEmail, errorEmail, "Format email tidak valid.");
        valid = false;
    } else {
        hapusError(inputEmail, errorEmail);
    }

    const nilaiMessage = inputMessage.value.trim();
    if (nilaiMessage === "") {
        tampilkanError(inputMessage, errorMessage, "Pesan wajib diisi.");
        valid = false;
    } else if (nilaiMessage.length < 10) {
        tampilkanError(inputMessage, errorMessage, "Pesan minimal 10 karakter.");
        valid = false;
    } else {
        hapusError(inputMessage, errorMessage);
    }

    if (valid) {
        successMsg.textContent = "Pesan berhasil dikirim!";
        successMsg.classList.remove("hidden");
        form.reset();
    }
});

} // selesai cek form
