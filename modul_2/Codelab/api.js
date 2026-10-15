// Ambil data user dari API

const API_URL = "https://jsonplaceholder.typicode.com/users";

const loadingMessage = document.querySelector("#loading-message");
const errorMessage = document.querySelector("#error-message");
const userList = document.querySelector("#user-list");

function renderUsers(users) {
    userList.innerHTML = users.map(function (user) {
        return `
            <article class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg">
                <h3 class="text-xl font-bold text-primary-dark mb-3">${user.name}</h3>
                <p class="text-gray-600 text-sm mb-1">📧 ${user.email}</p>
                <p class="text-gray-600 text-sm mb-1">🏢 ${user.company.name}</p>
                <p class="text-gray-600 text-sm">📍 ${user.address.city}</p>
            </article>
        `;
    }).join("");
}

// Ambil data async
async function getUsers() {
    loadingMessage.textContent = "Loading data...";
    errorMessage.textContent = "";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Gagal mengambil data (status ${response.status})`);
        }

        const users = await response.json();
        renderUsers(users);

    } catch (error) {
        errorMessage.textContent = "Data gagal dimuat. Coba lagi nanti.";
        userList.innerHTML = "";

    } finally {
        loadingMessage.textContent = "";
    }
}

// Jalan saat halaman siap
getUsers();
