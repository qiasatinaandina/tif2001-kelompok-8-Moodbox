
const packageCards = document.querySelectorAll(".package-card");
const themeCards = document.querySelectorAll(".theme-card");
const templateCards = document.querySelectorAll(".template-card");
const categoryButtons = document.querySelectorAll(".chip");

const summaryPackage = document.getElementById("summary-package");
const summaryCategory = document.getElementById("summary-category");
const summaryTheme = document.getElementById("summary-theme");
const summaryTemplate = document.getElementById("summary-template");
const summaryPrice = document.getElementById("summary-price");
const statusMessage = document.getElementById("status-message");

let selectedPackage = {
    name: "The Duo Pod",
    price: 150000,
    category: "Solo / Personal"
};

let selectedTheme = "Warm Sunset";
let selectedTemplate = "Retro Film Strip";
let selectedCategory = "Semua";

function formatRupiah(price) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(price);
}

function updateSummary() {
    summaryPackage.textContent = selectedPackage.name;
    summaryCategory.textContent =
        selectedCategory === "Semua"
            ? selectedPackage.category
            : selectedCategory;

    summaryTheme.textContent = selectedTheme;
    summaryTemplate.textContent = selectedTemplate;
    summaryPrice.textContent = formatRupiah(selectedPackage.price);
}

packageCards.forEach((card) => {
    card.querySelector(".choose-button").addEventListener("click", () => {
        packageCards.forEach((item) => {
            item.classList.remove("chosen");
            item.querySelector(".choose-button").textContent = "Pilih Paket";
        });

        card.classList.add("chosen");
        card.querySelector(".choose-button").textContent = "Dipilih ✓";

        selectedPackage = {
            name: card.dataset.name,
            price: Number(card.dataset.price),
            category: card.dataset.category.split(" ")[0]
        };

        statusMessage.textContent = "";
        updateSummary();
    });
});

themeCards.forEach((card) => {
    card.addEventListener("click", () => {
        themeCards.forEach((item) => item.classList.remove("selected"));
        card.classList.add("selected");

        selectedTheme = card.dataset.theme;
        statusMessage.textContent = "";
        updateSummary();
    });
});

templateCards.forEach((card) => {
    card.addEventListener("click", () => {
        templateCards.forEach((item) => item.classList.remove("selected"));
        card.classList.add("selected");

        selectedTemplate = card.dataset.template;
        statusMessage.textContent = "";
        updateSummary();
    });
});

categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        categoryButtons.forEach((item) => item.classList.remove("selected"));
        button.classList.add("selected");

        selectedCategory = button.dataset.category;

        packageCards.forEach((card) => {
            const categories = card.dataset.category.split(" ");
            const visible =
                selectedCategory === "Semua" ||
                categories.includes(selectedCategory);

            card.hidden = !visible;
        });

        // Jika paket terpilih tersembunyi, pilih paket pertama yang tampil.
        const chosenVisible = Array.from(packageCards).find(
            (card) => !card.hidden && card.classList.contains("chosen")
        );

        if (!chosenVisible) {
            const firstVisible = Array.from(packageCards).find(
                (card) => !card.hidden
            );

            if (firstVisible) {
                firstVisible.querySelector(".choose-button").click();
            }
        }

        updateSummary();
    });
});

document.getElementById("continue-button").addEventListener("click", () => {
    statusMessage.textContent =
        "Pilihan tersimpan sementara di halaman ini. Tahap jadwal dan pembayaran belum dihubungkan.";
});

updateSummary();
