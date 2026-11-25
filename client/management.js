(() => {
  "use strict";

  // Dummy data untuk prototipe. Ganti sumber data ini saat API backend tersedia.
  let packages = [
    {
      id: 1,
      name: "Solo Classic",
      category: "Individual",
      price: 75000,
      description: "Sesi foto personal dengan pilihan pose klasik.",
      image: "",
      status: "Aktif",
    },
    {
      id: 2,
      name: "Couple Signature",
      category: "Couple",
      price: 135000,
      description: "Sesi foto berdua dengan beberapa pilihan frame.",
      image: "",
      status: "Aktif",
    },
    {
      id: 3,
      name: "Family Moments",
      category: "Family",
      price: 185000,
      description: "Abadikan momen bersama keluarga.",
      image: "",
      status: "Aktif",
    },
    {
      id: 4,
      name: "Bestie Time",
      category: "Group",
      price: 160000,
      description: "Paket seru untuk foto bersama teman.",
      image: "",
      status: "Aktif",
    },
    {
      id: 5,
      name: "Solo Premium",
      category: "Individual",
      price: 110000,
      description: "Paket personal dengan tambahan cetak foto.",
      image: "",
      status: "Aktif",
    },
    {
      id: 6,
      name: "Couple Mini",
      category: "Couple",
      price: 95000,
      description: "Sesi singkat untuk dua orang.",
      image: "",
      status: "Aktif",
    },
    {
      id: 7,
      name: "Family Celebration",
      category: "Family",
      price: 225000,
      description: "Paket keluarga untuk momen spesial.",
      image: "",
      status: "Aktif",
    },
  ];

  const $ = (id) => document.getElementById(id);
  const tableBody = $("packageTableBody");
  const dialog = $("packageDialog");
  const form = $("packageForm");
  let currentPage = 1;
  let pageSize = 5;
  let searchTerm = "";
  let category = "all";
  let selectedImage = "";
  let toastTimer;

  const rupiah = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);

  function filteredPackages() {
    return packages.filter((item) => {
      const searchable = `${item.name} ${item.description}`.toLowerCase();
      return searchable.includes(searchTerm) && (category === "all" || item.category === category);
    });
  }

  function updateCategoryOptions() {
    const select = $("categoryFilter");
    const current = category;
    const categories = [...new Set(packages.map((item) => item.category))].sort();
    select.innerHTML =
      '<option value="all">Semua kategori</option>' +
      categories
        .map((item) => `<option value="${escapeHTML(item)}">${escapeHTML(item)}</option>`)
        .join("");
    select.value = categories.includes(current) ? current : "all";
    category = select.value;
  }

  function escapeHTML(value) {
    return String(value).replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char]
    );
  }

  function render() {
    const results = filteredPackages();
    const totalPages = Math.max(1, Math.ceil(results.length / pageSize));
    currentPage = Math.min(currentPage, totalPages);
    const start = (currentPage - 1) * pageSize;
    const visible = results.slice(start, start + pageSize);

    $("totalPackages").textContent = packages.length;
    $("totalCategories").textContent = new Set(packages.map((item) => item.category)).size;
    $("visiblePackages").textContent = results.length;
    $("emptyState").hidden = results.length !== 0;
    tableBody.innerHTML = visible
      .map(
        (item) => `
      <tr>
        <td><div class="package-cell"><div class="package-thumb">${item.image ? `<img src="${item.image}" alt="">` : "▧"}</div>
          <div><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.description || "Tidak ada deskripsi")}</small></div></div></td>
        <td><span class="category-pill">${escapeHTML(item.category)}</span></td>
        <td class="price">${rupiah(item.price)}</td>
        <td><span class="status-pill">${escapeHTML(item.status)}</span></td>
        <td class="actions"><button class="icon-btn" type="button" data-action="edit" data-id="${item.id}" aria-label="Edit ${escapeHTML(item.name)}" title="Edit">✎</button>
          <button class="icon-btn delete" type="button" data-action="delete" data-id="${item.id}" aria-label="Hapus ${escapeHTML(item.name)}" title="Hapus">⌫</button></td>
      </tr>`
      )
      .join("");

    $("paginationInfo").textContent = results.length
      ? `Menampilkan ${start + 1}–${Math.min(start + pageSize, results.length)} dari ${results.length} data`
      : "Menampilkan 0 data";
    const nav = $("pagination");
    nav.innerHTML = "";
    const prev = makePageButton("‹", currentPage - 1, currentPage === 1, false);
    nav.append(prev);
    for (let page = 1; page <= totalPages; page++) {
      nav.append(makePageButton(String(page), page, false, page === currentPage));
    }
    nav.append(makePageButton("›", currentPage + 1, currentPage === totalPages, false));
  }

  function makePageButton(label, page, disabled, active) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `page-btn${active ? " active" : ""}`;
    button.textContent = label;
    button.disabled = disabled;
    button.setAttribute(
      "aria-label",
      label === "‹"
        ? "Halaman sebelumnya"
        : label === "›"
          ? "Halaman berikutnya"
          : `Halaman ${label}`
    );
    button.addEventListener("click", () => {
      currentPage = page;
      render();
    });
    return button;
  }

  function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
  }

  function openForm(item = null) {
    form.reset();
    $("formError").textContent = "";
    $("packageId").value = item ? item.id : "";
    $("dialogTitle").textContent = item ? "Edit Paket" : "Tambah Paket";
    $("savePackageBtn").textContent = item ? "Simpan Perubahan" : "Simpan Paket";
    $("packageName").value = item?.name || "";
    $("packageCategory").value = item?.category || "";
    $("packagePrice").value = item?.price || "";
    $("packageDescription").value = item?.description || "";
    selectedImage = item?.image || "";
    updateImagePreview();
    dialog.showModal();
    $("packageName").focus();
  }

  function updateImagePreview() {
    const preview = $("imagePreview");
    const area = $("uploadArea");
    if (selectedImage) {
      preview.src = selectedImage;
      preview.hidden = false;
      area.querySelector(".upload-symbol").hidden = true;
      area.querySelector("strong").textContent = "Gambar dipilih";
      area.querySelector("small").textContent = "Klik untuk mengganti gambar";
    } else {
      preview.removeAttribute("src");
      preview.hidden = true;
      area.querySelector(".upload-symbol").hidden = false;
      area.querySelector("strong").textContent = "Pilih gambar untuk diunggah";
      area.querySelector("small").textContent = "JPG, PNG, WEBP · Maksimal 2 MB";
    }
  }

  $("packageImageInput").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      $("formError").textContent = "Format gambar harus JPG, PNG, atau WEBP.";
      event.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      $("formError").textContent = "Ukuran gambar maksimal 2 MB.";
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      selectedImage = String(reader.result);
      $("formError").textContent = "";
      updateImagePreview();
    };
    reader.onerror = () => {
      $("formError").textContent = "Gambar gagal dibaca. Coba pilih file lain.";
    };
    reader.readAsDataURL(file);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("packageName").value.trim();
    const itemCategory = $("packageCategory").value;
    const price = Number($("packagePrice").value);
    const description = $("packageDescription").value.trim();
    const id = $("packageId").value;
    if (!name || !itemCategory || !Number.isFinite(price) || price <= 0) {
      $("formError").textContent = "Lengkapi nama, kategori, dan harga dengan benar.";
      return;
    }
    const oldItem = id ? packages.find((item) => item.id === Number(id)) : null;
    const record = {
      id: id ? Number(id) : Math.max(0, ...packages.map((item) => item.id)) + 1,
      name,
      category: itemCategory,
      price,
      description,
      image: selectedImage || oldItem?.image || "",
      status: "Aktif",
    };
    if (id) {
      packages = packages.map((item) => (item.id === Number(id) ? record : item));
      showToast("Perubahan paket berhasil diterapkan (demo).");
    } else {
      packages.unshift(record);
      showToast("Paket baru berhasil ditambahkan (demo).");
    }
    category = "all";
    $("categoryFilter").value = "all";
    currentPage = 1;
    updateCategoryOptions();
    dialog.close();
    render();
  });

  tableBody.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const id = Number(button.dataset.id);
    const item = packages.find((entry) => entry.id === id);
    if (!item) return;
    if (button.dataset.action === "edit") openForm(item);
    if (
      button.dataset.action === "delete" &&
      window.confirm(`Hapus paket "${item.name}" dari data demo?`)
    ) {
      packages = packages.filter((entry) => entry.id !== id);
      updateCategoryOptions();
      render();
      showToast("Paket dihapus dari data demo.");
    }
  });

  // Debounce: render pencarian dilakukan 300 ms setelah pengguna berhenti mengetik.
  let searchTimer;
  $("searchInput").addEventListener("input", (event) => {
    clearTimeout(searchTimer);
    const value = event.target.value.trim().toLowerCase();
    searchTimer = setTimeout(() => {
      searchTerm = value;
      currentPage = 1;
      render();
    }, 300);
  });

  $("categoryFilter").addEventListener("change", (event) => {
    category = event.target.value;
    currentPage = 1;
    render();
  });
  $("pageSize").addEventListener("change", (event) => {
    pageSize = Number(event.target.value);
    currentPage = 1;
    render();
  });
  $("addPackageBtn").addEventListener("click", () => openForm());
  $("closeDialogBtn").addEventListener("click", () => dialog.close());
  $("cancelDialogBtn").addEventListener("click", () => dialog.close());
  $("resetFiltersBtn").addEventListener("click", () => {
    $("searchInput").value = "";
    searchTerm = "";
    category = "all";
    $("categoryFilter").value = "all";
    currentPage = 1;
    render();
  });
  $("searchInput").addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      $("searchInput").focus();
    }
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  updateCategoryOptions();
  render();
})();
