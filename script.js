// ========== TOGGLE MENU UNTUK MOBILE ==========
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Ganti icon hamburger menjadi close saat terbuka
    const icon = menuToggle.querySelector('i');
    if (navMenu.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });
  
  // Tutup menu saat klik link di dalam menu (mobile)
  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      const icon = menuToggle.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    });
  });
  
  // Tutup menu saat klik di luar menu
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('active');
      const icon = menuToggle.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });
}

// ========== TOAST NOTIFICATION SYSTEM ==========
function showToast(title, message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = '';
  if (type === 'success') icon = '<i class="fas fa-check-circle"></i>';
  else if (type === 'error') icon = '<i class="fas fa-times-circle"></i>';
  else if (type === 'warning') icon = '<i class="fas fa-exclamation-triangle"></i>';
  else icon = '<i class="fas fa-info-circle"></i>';
  
  toast.innerHTML = `
    ${icon}
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <i class="fas fa-times toast-close"></i>
  `;
  
  container.appendChild(toast);
  
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  });
  
  setTimeout(() => {
    if (toast.parentElement) {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 300);
    }
  }, 3500);
}

// ========== VALIDASI EMAIL (MUDAH DIBACA) ==========
function validateEmail(email) {
  if (!email || email.trim() === '') return false;
  
  const atSymbolCount = (email.match(/@/g) || []).length;
  if (atSymbolCount !== 1) return false;
  
  const [localPart, domainPart] = email.split('@');
  
  if (localPart.length === 0 || localPart.includes(' ')) return false;
  if (domainPart.length === 0 || domainPart.includes(' ')) return false;
  if (!domainPart.includes('.')) return false;
  if (domainPart.startsWith('.') || domainPart.endsWith('.')) return false;
  
  return true;
}

// ========== 1. VALIDASI FORM PEMESANAN ==========
const form = document.getElementById('purchaseForm');
const fullnameInput = document.getElementById('fullname');
const emailInput = document.getElementById('email');
const amountInput = document.getElementById('amount');
const phoneInput = document.getElementById('phone');
const productSelect = document.getElementById('productSelect');
const sizeRadios = document.querySelectorAll('input[name="size"]');
const shippingChecks = document.querySelectorAll('input[name="shipping"]');
const addressInput = document.getElementById('address');

const errorFullname = document.getElementById('error-fullname');
const errorEmail = document.getElementById('error-email');
const errorAmount = document.getElementById('error-amount');
const errorPhone = document.getElementById('error-phone');
const errorProduct = document.getElementById('error-product');
const errorSize = document.getElementById('error-size');
const errorShipping = document.getElementById('error-shipping');
const errorAddress = document.getElementById('error-address');
const successDiv = document.getElementById('formSuccessMessage');

function clearErrors() {
  const allErrors = document.querySelectorAll('.error-message');
  allErrors.forEach(err => err.textContent = '');
  if (successDiv) successDiv.style.display = 'none';
}

function validateForm() {
  let isValid = true;
  clearErrors();

  if (!fullnameInput.value.trim()) {
    errorFullname.textContent = 'Nama lengkap wajib diisi';
    isValid = false;
  }

  const emailVal = emailInput.value.trim();
  if (!emailVal) {
    errorEmail.textContent = 'Email tidak boleh kosong';
    isValid = false;
  } else if (!validateEmail(emailVal)) {
    errorEmail.textContent = 'Format email tidak valid (contoh: nama@domain.com)';
    isValid = false;
  }

  const amountVal = parseFloat(amountInput.value);
  if (isNaN(amountVal) || amountVal <= 0) {
    errorAmount.textContent = 'Nominal harus diisi angka positif (minimal Rp 1)';
    isValid = false;
  }

  if (!phoneInput.value.trim()) {
    errorPhone.textContent = 'Nomor telepon wajib diisi';
    isValid = false;
  }

  if (!productSelect.value) {
    errorProduct.textContent = 'Silakan pilih produk';
    isValid = false;
  }

  let sizeSelected = false;
  sizeRadios.forEach(radio => {
    if (radio.checked) sizeSelected = true;
  });
  if (!sizeSelected) {
    errorSize.textContent = 'Pilih ukuran (S/M/L/XL)';
    isValid = false;
  }

  let shippingSelected = false;
  shippingChecks.forEach(ch => {
    if (ch.checked) shippingSelected = true;
  });
  if (!shippingSelected) {
    errorShipping.textContent = 'Pilih minimal satu metode pengiriman';
    isValid = false;
  }

  if (!addressInput.value.trim()) {
    errorAddress.textContent = 'Alamat lengkap wajib diisi';
    isValid = false;
  }

  return isValid;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (validateForm()) {
    successDiv.style.display = 'block';
    successDiv.innerHTML = '✅ Pesanan berhasil! Terima kasih sudah berbelanja di UrbanFashion.';
    form.reset();
    sizeRadios.forEach(r => r.checked = false);
    shippingChecks.forEach(c => c.checked = false);
    setTimeout(() => {
      successDiv.style.display = 'none';
    }, 4000);
  }
});

// ========== 2. ARRAY OF OBJECT & MANIPULASI DOM DINAMIS ==========
let fashionItems = [
  { id: 1, name: 'Hoodie Cyber', price: 329000, image: null },
  { id: 2, name: 'Cargo Pants', price: 249000, image: null },
  { id: 3, name: 'Varsity Jacket', price: 459000, image: null },
  { id: 4, name: 'Graphic Tee', price: 129000, image: null }
];

const dynamicContainer = document.getElementById('dynamicItemList');
const addItemBtn = document.getElementById('addItemBtn');
const newItemName = document.getElementById('newItemName');
const newItemPrice = document.getElementById('newItemPrice');
const itemImageInput = document.getElementById('itemImage');
let currentImageData = null;

itemImageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    if (!file.type.startsWith('image/')) {
      showToast('Gagal Upload', 'File harus berupa gambar (JPG, PNG, GIF)', 'error');
      itemImageInput.value = '';
      currentImageData = null;
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast('Gagal Upload', 'Ukuran gambar maksimal 2MB', 'error');
      itemImageInput.value = '';
      currentImageData = null;
      return;
    }
    const reader = new FileReader();
    reader.onload = function(ev) {
      currentImageData = ev.target.result;
      showToast('Berhasil!', 'Gambar berhasil diupload', 'success');
    };
    reader.readAsDataURL(file);
  } else {
    currentImageData = null;
  }
});

function editItemImage(itemId) {
  const item = fashionItems.find(i => i.id === itemId);
  if (!item) return;
  
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);
  
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Gagal', 'File harus berupa gambar', 'error');
        document.body.removeChild(fileInput);
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        showToast('Gagal', 'Ukuran gambar maksimal 2MB', 'error');
        document.body.removeChild(fileInput);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = function(ev) {
        item.image = ev.target.result;
        renderDynamicItems();
        showToast('Berhasil!', `Gambar "${item.name}" diperbarui`, 'success');
      };
      reader.readAsDataURL(file);
    }
    document.body.removeChild(fileInput);
  });
  
  fileInput.click();
}

function renderDynamicItems() {
  if (!dynamicContainer) return;
  dynamicContainer.innerHTML = '';
  fashionItems.forEach(item => {
    const itemCard = document.createElement('div');
    itemCard.className = 'item-card';
    itemCard.innerHTML = `
      ${item.image ? `<img src="${item.image}" class="item-img" alt="${item.name}">` : `<div class="item-img" style="display:flex;align-items:center;justify-content:center;background:#eef2ff;"><i class="fas fa-tshirt" style="font-size:3rem;color:#f97316;"></i></div>`}
      <div class="item-info">
        <h4>${escapeHtml(item.name)}</h4>
        <p>Rp ${item.price.toLocaleString('id-ID')}</p>
      </div>
      <div style="display: flex; gap: 5px; padding: 0 10px 10px 10px;">
        <button class="edit-image-btn" data-id="${item.id}" style="flex:1; background:#eef2ff; border:none; padding:8px; border-radius:12px; cursor:pointer; font-weight:500; display:flex; align-items:center; justify-content:center; gap:5px;"><i class="fas fa-image"></i> Ganti</button>
        <button class="delete-item" data-id="${item.id}" style="flex:1; background:#fee2e2; border:none; padding:8px; border-radius:12px; cursor:pointer; font-weight:500; color:#b91c1c; display:flex; align-items:center; justify-content:center; gap:5px;"><i class="fas fa-trash-alt"></i> Hapus</button>
      </div>
    `;
    dynamicContainer.appendChild(itemCard);
  });
  
  document.querySelectorAll('.edit-image-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(btn.getAttribute('data-id'));
      editItemImage(id);
    });
  });
  
  document.querySelectorAll('.delete-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(btn.getAttribute('data-id'));
      fashionItems = fashionItems.filter(i => i.id !== id);
      renderDynamicItems();
      showToast('Item Dihapus', 'Item berhasil dihapus dari gallery', 'warning');
    });
  });
}

function addNewItem() {
  let name = newItemName.value.trim();
  let price = parseFloat(newItemPrice.value);
  
  if (name === '') {
    showToast('Gagal', 'Nama item tidak boleh kosong', 'error');
    return;
  }
  if (isNaN(price) || price <= 0) {
    showToast('Gagal', 'Harga harus berupa angka positif', 'error');
    return;
  }
  
  const newId = fashionItems.length > 0 ? Math.max(...fashionItems.map(i => i.id)) + 1 : 5;
  fashionItems.push({
    id: newId,
    name: name,
    price: price,
    image: currentImageData || null
  });
  renderDynamicItems();
  
  newItemName.value = '';
  newItemPrice.value = '';
  itemImageInput.value = '';
  currentImageData = null;
  
  showToast('Berhasil!', `"${name}" berhasil ditambahkan`, 'success');
}

addItemBtn.addEventListener('click', addNewItem);

function escapeHtml(str) {
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

renderDynamicItems();

// ========== 3. NAVIGASI ==========
const navLinksAll = document.querySelectorAll('.nav-link');
const sectionsAll = document.querySelectorAll('section');
const navbar = document.querySelector('.navbar');
const header = document.querySelector('.main-header');

function scrollToSection(sectionId) {
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    const headerHeight = header.offsetHeight;
    const navbarHeight = navbar.offsetHeight;
    const totalOffset = headerHeight + navbarHeight;
    const elementPosition = targetSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - totalOffset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

navLinksAll.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    scrollToSection(targetId);
  });
});

document.querySelectorAll('a[href="#order-form"]').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    scrollToSection('order-form');
  });
});

function updateActiveLink() {
  const headerHeight = header.offsetHeight;
  const navbarHeight = navbar.offsetHeight;
  const totalOffset = headerHeight + navbarHeight;
  const scrollPosition = window.scrollY + totalOffset + 50;
  
  let currentSection = '';
  
  sectionsAll.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      currentSection = section.getAttribute('id');
    }
  });
  
  navLinksAll.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href').substring(1);
    if (href === currentSection) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink);
window.addEventListener('load', updateActiveLink);