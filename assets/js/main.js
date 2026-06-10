document.addEventListener('DOMContentLoaded', () => {
  // --- ACTIVATE NAV LINK BASED ON CURRENT PAGE ---
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  const navLinks = document.querySelectorAll('.nav-link');
  
  let matchFound = false;
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (pageName === href || (pageName === '' && href === 'trangchu.html')) {
      link.classList.add('active');
      matchFound = true;
    } else {
      link.classList.remove('active');
    }
  });

  // Fallback to Trang Chu active if path is empty/root
  if (!matchFound && navLinks.length > 0) {
    // If it's index or home page in general
    if (pageName.includes('index') || pageName === '') {
      const homeLink = Array.from(navLinks).find(link => link.getAttribute('href') === 'trangchu.html');
      if (homeLink) homeLink.classList.add('active');
    }
  }

  // --- HEADER SCROLL EFFECT ---
  const header = document.querySelector('header');
  const checkScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Run once in case page loads scrolled

  // --- HAMBURGER MENU TOGGLE ---
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  // --- INTERSECTION OBSERVER FOR FADE-IN ON SCROLL ---
  const fadeElements = document.querySelectorAll('.scroll-fade');
  if (fadeElements.length > 0) {
    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    }, observerOptions);

    fadeElements.forEach(el => {
      observer.observe(el);
    });
  }

  // --- BOOKING FORM SUBMISSION (MOCK) ---
  const bookingForm = document.getElementById('nesta-booking-form');
  if (bookingForm) {
    // Pre-select service from URL query parameter if available
    const urlParams = new URLSearchParams(window.location.search);
    const serviceQuery = urlParams.get('service');
    if (serviceQuery) {
      const serviceSelect = document.getElementById('service');
      if (serviceSelect) {
        serviceSelect.value = serviceQuery;
      }
    }

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const service = document.getElementById('service').value;
      const date = document.getElementById('date').value;
      const time = document.getElementById('time').value;
      const address = document.getElementById('address').value;
      
      // Basic validation
      if (!name || !phone || !service || !date || !time || !address) {
        alert('Vui lòng điền đầy đủ các thông tin bắt buộc.');
        return;
      }

      // Show luxury success modal
      showBookingSuccessModal({
        name,
        phone,
        service,
        date,
        time,
        address
      });
      
      bookingForm.reset();
    });
  }
});

// --- ELEGANT BOOKING SUCCESS MODAL ---
function showBookingSuccessModal(details) {
  // Create modal markup
  const modal = document.createElement('div');
  modal.className = 'nesta-modal-overlay';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    opacity: 0;
    transition: opacity 0.4s ease;
  `;
  
  // Convert service value to readable text
  let serviceText = details.service;
  const serviceOptions = {
    'swedish': 'Mát-xa Thụy Điển (Swedish)',
    'deeptissue': 'Mát-xa Trị Liệu Sâu (Deep Tissue)',
    'hotstone': 'Trị Liệu Đá Nóng (Hot Stone)',
    'aromatherapy': 'Liệu Pháp Hương Thơm (Aromatherapy)',
    'foot': 'Bấm Huyệt Bàn Chân (Foot Reflexology)'
  };
  if (serviceOptions[details.service]) {
    serviceText = serviceOptions[details.service];
  }

  const modalContent = document.createElement('div');
  modalContent.className = 'nesta-modal-content';
  modalContent.style.cssText = `
    background-color: #ffffff;
    color: #000000;
    padding: 40px;
    max-width: 500px;
    width: 90%;
    border: 1px solid #000000;
    text-align: center;
    transform: translateY(30px);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    font-family: 'Montserrat', sans-serif;
  `;
  
  modalContent.innerHTML = `
    <h3 style="font-family: 'Playfair Display', serif; font-size: 1.8rem; margin-bottom: 20px; font-weight: 400; text-transform: uppercase;">Đặt Lịch Thành Công</h3>
    <p style="font-size: 0.95rem; color: #555555; margin-bottom: 24px; line-height: 1.6;">
      Cảm ơn Quý khách <strong>${details.name}</strong> đã lựa chọn NESTA In-Room Spa. Nhân viên CSKH sẽ liên hệ với Quý khách qua số điện thoại <strong>${details.phone}</strong> trong vòng 10 phút để xác nhận kỹ thuật viên.
    </p>
    <div style="border-top: 1px solid #eaeaea; border-bottom: 1px solid #eaeaea; padding: 16px 0; margin-bottom: 24px; text-align: left; font-size: 0.85rem; color: #333333;">
      <div style="margin-bottom: 8px;"><strong>Dịch vụ:</strong> ${serviceText}</div>
      <div style="margin-bottom: 8px;"><strong>Thời gian:</strong> ${details.time} - Ngày ${details.date}</div>
      <div><strong>Địa điểm:</strong> ${details.address}</div>
    </div>
    <button id="close-nesta-modal" class="btn btn-primary" style="width: 100%; border: 1px solid #000000;">Hoàn thành</button>
  `;
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  // Fade in animation
  setTimeout(() => {
    modal.style.opacity = '1';
    modalContent.style.transform = 'translateY(0)';
  }, 10);
  
  // Close handler
  const closeBtn = modalContent.querySelector('#close-nesta-modal');
  const closeModal = () => {
    modal.style.opacity = '0';
    modalContent.style.transform = 'translateY(30px)';
    setTimeout(() => {
      modal.remove();
    }, 400);
  };
  
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

// Carousel Looping Logic
window.scrollCarousel = function(direction, sliderId = 'review-slider') {
  const slider = document.getElementById(sliderId);
  if (!slider) return;
  
  const scrollAmount = 350;
  const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
  
  if (direction === 'next') {
    if (slider.scrollLeft >= maxScrollLeft - 10) {
      slider.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  } else if (direction === 'prev') {
    if (slider.scrollLeft <= 10) {
      slider.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
    } else {
      slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  }
};
