/* =============================================
   SCRIPT.JS - MEREMPAH WEBSITE V2.0
   File Lengkap & Diperbaiki
   ============================================= */

// Menjalankan script setelah seluruh konten HTML dimuat
document.addEventListener('DOMContentLoaded', function() {

    /* ------------------------------------------
       1. Fungsionalitas Menu Hamburger
       ------------------------------------------ */
    const hamburger = document.querySelector('.navbar__hamburger');
    const navMenu = document.querySelector('.navbar__menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('navbar__menu--active');
        });
    }

    /* ------------------------------------------
       2. Fungsionalitas Accordion FAQ
       ------------------------------------------ */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-item__question');
        if (question) {
            question.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        }
    });

    /* ------------------------------------------
       3. Fungsionalitas Filter Menu (menu.html)
       ------------------------------------------ */
    const filterContainer = document.querySelector('.menu-filter__wrapper');
    
    if (filterContainer) {
        const filterButtons = filterContainer.querySelectorAll('.menu-filter__button');
        const menuItems = document.querySelectorAll('.menu-item-card--visual');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filterValue = button.getAttribute('data-filter');
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                menuItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    if (filterValue === 'all' || filterValue === itemCategory) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    /* -----------------------------------------------------------------
       4. Fungsionalitas Halaman Kemitraan (peluang-kemitraan.html)
       ----------------------------------------------------------------- */
    const counterElements = document.querySelectorAll('.infographic-card__value');
    if (counterElements.length > 0) {
        counterElements.forEach(counter => {
            const target = +counter.getAttribute('data-value');
            const duration = 2000;
            const suffix = counter.innerText.replace(/[0-9.]/g, '').trim(); // Handles decimals
            let start = 0;
            const increment = target / (duration / 16); // ~60fps

            const updateCount = () => {
                start += increment;
                if (start < target) {
                    counter.innerText = Math.ceil(start).toLocaleString('id-ID') + (target % 1 !== 0 ? '.' + String(target).split('.')[1] : '') + " " + suffix;
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target.toLocaleString('id-ID') + " " + suffix;
                }
            };
            requestAnimationFrame(updateCount);
        });
    }

    const ctx = document.getElementById('profitabilityChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Struktur Biaya & Profit'],
                datasets: [{
                    label: 'Biaya Operasional',
                    data: [35],
                    backgroundColor: '#cdc77e',
                    borderWidth: 1
                }, {
                    label: 'Harga Pokok Penjualan (HPP)',
                    data: [36],
                    backgroundColor: '#143720',
                    borderWidth: 1
                }, {
                    label: 'Target Laba Bersih',
                    data: [29],
                    backgroundColor: '#a9a472',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y', responsive: true, scales: { x: { stacked: true, ticks: { callback: function(value) { return value + '%' } } }, y: { stacked: true } },
                plugins: { tooltip: { callbacks: { label: function(context) { return context.dataset.label + ': ' + context.raw + '%'; } } } }
            }
        });
    }

    /* -----------------------------------------------------------------
       5. Fungsionalitas Halaman Produk Retail (other-product.html)
       ------------------------------------------  ----------------------- */
    if (typeof Swiper !== 'undefined') {
        const swipers = document.querySelectorAll('.retail-product__gallery .swiper-container');
        if (swipers.length > 0) {
            swipers.forEach((swiperEl, index) => {
                const nextEl = swiperEl.querySelector('.swiper-button-next');
                const prevEl = swiperEl.querySelector('.swiper-button-prev');
                const paginationEl = swiperEl.querySelector('.swiper-pagination');

                if (nextEl && prevEl && paginationEl) {
                    nextEl.classList.add(`swiper-button-next-${index}`);
                    prevEl.classList.add(`swiper-button-prev-${index}`);
                    paginationEl.classList.add(`swiper-pagination-${index}`);
                    
                    new Swiper(swiperEl, {
                        loop: true,
                        pagination: { el: `.swiper-pagination-${index}`, clickable: true },
                        navigation: { nextEl: `.swiper-button-next-${index}`, prevEl: `.swiper-button-prev-${index}` },
                    });
                }
            });
        }
    }
	
	    /* -----------------------------------------------------------------
       6. Fungsionalitas Halaman Order & Reservasi (order-reservasi.html)
       ----------------------------------------------------------------- */
    const orderForm = document.getElementById('order-stepper-form');
    if (orderForm) {
        // --- Variabel Global & Inisialisasi ---
        let menuData = []; 
        const orderItemsWrapper = document.getElementById('order-items-wrapper');

        // --- Fungsi Utama untuk Memulai Form Pemesanan ---
        async function initializeOrderForm() {
            try {
                const response = await fetch('data/menu.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                menuData = await response.json();
                
                populateMenuDropdowns(orderItemsWrapper.querySelector('.order-item__select'));
                populateVisualPicker();

            } catch (error) {
                console.error("Gagal memuat data menu:", error);
                orderItemsWrapper.innerHTML = '<p style="color: red;">Maaf, gagal memuat menu. Silakan coba muat ulang halaman.</p>';
            }
        }

        // --- Fungsi untuk Mengisi Dropdown Menu ---
        function populateMenuDropdowns(selectElement) {
            if (!selectElement) return;
            
            let optionsHTML = '<option value="" disabled selected>-- Pilih Menu --</option>';
            menuData.forEach(item => {
                const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price);
                optionsHTML += `<option value="${item.id}">${item.name} (${formattedPrice})</option>`;
            });
            selectElement.innerHTML = optionsHTML;
        }

        // --- Fungsi untuk Mengisi Modal Menu Visual ---
        function populateVisualPicker() {
            const visualPickerGrid = document.getElementById('visual-picker-grid');
            if (!visualPickerGrid) return;

            let cardsHTML = '';
            menuData.forEach(item => {
                cardsHTML += `
                    <div class="package-card" data-item-id="${item.id}" style="cursor: pointer;">
                        <img src="assets/images/menu-items/${item.image}" alt="${item.name}" style="width:100%; height: 150px; object-fit: cover; border-radius: 6px; margin-bottom: 1rem;">
                        <h4 class="package-card__title">${item.name}</h4>
                    </div>
                `;
            });
            visualPickerGrid.innerHTML = cardsHTML;
        }

        // --- Logika Navigasi Wizard ---
        const steps = orderForm.querySelectorAll('.step');
        const nextButtons = orderForm.querySelectorAll('.next-step-btn');
        const prevButtons = orderForm.querySelectorAll('.prev-step-btn');
        let currentStep = 0;

        const updateStepVisibility = () => {
            steps.forEach((step, index) => {
                step.classList.toggle('active', index === currentStep);
            });
            const stepperItems = document.querySelectorAll('.stepper .step-item');
            stepperItems.forEach((item, index) => {
                item.classList.toggle('active', index <= currentStep);
            });
        };

        nextButtons.forEach(button => button.addEventListener('click', () => {
            if (currentStep < steps.length - 1) { currentStep++; updateStepVisibility(); }
        }));

        prevButtons.forEach(button => button.addEventListener('click', () => {
            if (currentStep > 0) { currentStep--; updateStepVisibility(); }
        }));
        
        // --- FUNGSI KALKULATOR REAL-TIME ---
        const updateOrderSummary = () => {
            const serviceType = orderForm.querySelector('input[name="service_type"]:checked').value;
            const orderItems = orderItemsWrapper.querySelectorAll('.order-item');

            let totalPacks = 0;
            let grandTotal = 0;
            let pricePerPack = 0;
            let notes = "";

            orderItems.forEach(itemRow => {
                const select = itemRow.querySelector('select');
                const quantityInput = itemRow.querySelector('input');
                const selectedId = select.value;
                const quantity = parseInt(quantityInput.value) || 0;

                if (selectedId && quantity > 0) {
                    totalPacks += quantity;
                    const menuItem = menuData.find(item => item.id === selectedId);
                    if (menuItem) {
                        grandTotal += menuItem.price * quantity;
                    }
                }
            });

            // PERBAIKAN: Logika Harga untuk Reservasi
            if (serviceType === 'reservasi') {
                if (totalPacks >= 300) {
                    pricePerPack = 12000;
                } else if (totalPacks >= 200) {
                    pricePerPack = 14000;
                } else if (totalPacks >= 100) {
                    pricePerPack = 15000;
                } else {
                    pricePerPack = 0;
                }
                grandTotal = totalPacks * pricePerPack;

                if (totalPacks >= 200) {
                    notes = "Termasuk Free Booth & SDM.";
                } else if (totalPacks >= 100) {
                    notes = "Harga spesial reservasi berlaku.";
                } else {
                    notes = "Min. 100 pack untuk harga spesial reservasi.";
                }
            }

            const formatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
            document.getElementById('summary-total-packs').innerText = totalPacks;
            document.getElementById('summary-price-per-pack').innerText = (serviceType === 'reservasi') ? formatter.format(pricePerPack) : 'Bervariasi';
            document.getElementById('summary-grand-total').innerText = formatter.format(grandTotal);
            document.getElementById('summary-notes').innerText = notes;
        };

        // --- Logika Pilihan Layanan & Harga Reservasi ---
        const serviceTypeRadios = document.querySelectorAll('input[name="service_type"]');
        // PERBAIKAN: Menggunakan ID baru dari HTML
        const reservasiPriceInfo = document.getElementById('reservasi-price-info');
        const reservasiFields = document.getElementById('reservasi-fields');

        serviceTypeRadios.forEach(radio => radio.addEventListener('change', (event) => {
            // PERBAIKAN: Mengecek value "reservasi"
            const isReservasi = event.target.value === 'reservasi';
            if (reservasiPriceInfo) reservasiPriceInfo.style.display = isReservasi ? 'block' : 'none';
            if (reservasiFields) reservasiFields.style.display = isReservasi ? 'block' : 'none';
            updateOrderSummary();
        }));
        
        // --- Logika Tambah/Hapus Item ---
        const addItemBtn = document.getElementById('add-item-btn');
        if (addItemBtn) {
            addItemBtn.addEventListener('click', () => {
                const newItemRow = orderItemsWrapper.querySelector('.order-item').cloneNode(true);
                const newSelect = newItemRow.querySelector('select');
                populateMenuDropdowns(newSelect);
                newSelect.selectedIndex = 0;
                newItemRow.querySelector('input').value = 10;
                orderItemsWrapper.appendChild(newItemRow);
                updateOrderSummary();
            });
        }
        
        orderItemsWrapper.addEventListener('click', (event) => {
            if (event.target.classList.contains('order-item__remove-btn')) {
                if (orderItemsWrapper.children.length > 1) {
                    event.target.closest('.order-item').remove();
                    updateOrderSummary();
                }
            }
        });
        
        orderItemsWrapper.addEventListener('change', updateOrderSummary);

        // --- Logika Modal Menu Visual ---
        const openModalBtn = document.getElementById('open-visual-picker');
        const closeModalBtn = document.getElementById('close-visual-picker');
        const modal = document.getElementById('visual-picker-modal');
        const visualPickerGrid = document.getElementById('visual-picker-grid');

        if (openModalBtn && closeModalBtn && modal && visualPickerGrid) {
            openModalBtn.addEventListener('click', (e) => { e.preventDefault(); modal.style.display = 'flex'; });
            closeModalBtn.addEventListener('click', () => { modal.style.display = 'none'; });
            modal.addEventListener('click', (e) => { if (e.target === modal) { modal.style.display = 'none'; } });

            visualPickerGrid.addEventListener('click', (e) => {
                const selectedCard = e.target.closest('.package-card');
                if (selectedCard) {
                    const itemId = selectedCard.dataset.itemId;
                    const allRows = orderItemsWrapper.querySelectorAll('.order-item');
                    let targetSelect = null;
                    allRows.forEach(row => {
                        if (row.querySelector('select').value === '') targetSelect = row.querySelector('select');
                    });

                    if (targetSelect) {
                        targetSelect.value = itemId;
                    } else {
                        addItemBtn.click();
                        orderItemsWrapper.lastChild.querySelector('select').value = itemId;
                    }
                    modal.style.display = 'none';
                    updateOrderSummary();
                }
            });
        }

        // --- Panggil Fungsi Inisialisasi Utama ---
        initializeOrderForm();
        updateStepVisibility();
        updateOrderSummary();
    }

}); // Penutup dari DOMContentLoaded