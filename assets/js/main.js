// ================================================
// مدرسة الفيوم الثانوية للبنات - ملف الجافاسكريبت الرئيسي
// Fayoum Secondary School for Girls - Main JavaScript File
// ================================================

// ===== تهيئة التطبيق - App Initialization =====
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    // تهيئة المكونات - Initialize components
    initMobileMenu();
    initCarousel();
    initContactForm();
    initDepartmentFilter();
    initTeacherSearch();
    initScrollAnimations();

    // إضافة تأثيرات البداية - Add entrance effects
    addEntranceEffects();
}
// إضافة Tooltips
initTooltips();

// إخفاء Loader بعد تحميل الصفحة
hidePageLoader();

// ===== القائمة المتنقلة - Mobile Menu =====
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');

            // تغيير أيقونة الزر - Change button icon
            const icon = mobileToggle.querySelector('i') || mobileToggle;
            if (navMenu.classList.contains('active')) {
                icon.textContent = '✕';
            } else {
                icon.textContent = '☰';
            }
        });

        // إغلاق القائمة عند النقر على رابط - Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i') || mobileToggle;
                icon.textContent = '☰';
            });
        });
    }
}

// ===== شريط تمرير الصور - Image Carousel =====
function initCarousel() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;

    const carouselInner = carousel.querySelector('.carousel-inner');
    const carouselItems = carousel.querySelectorAll('.carousel-item');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');

    if (!carouselInner || !carouselItems.length) return;

    let currentIndex = 0;
    const itemCount = carouselItems.length;

    console.log('Carousel items:', itemCount);

    function updateCarouselDisplay() {
        console.log('Showing item:', currentIndex);
        const offset = currentIndex * -100;
        carouselInner.style.transform = `translateX(${offset}%)`;
    }

    // تهيئة العرض - Initialize display
    updateCarouselDisplay();

    // أزرار التحكم - Control buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + itemCount) % itemCount;
            updateCarouselDisplay();
            console.log('Previous clicked, now at:', currentIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % itemCount;
            updateCarouselDisplay();
            console.log('Next clicked, now at:', currentIndex);
        });
    }

    // التشغيل التلقائي - Auto-play
    let autoPlayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % itemCount;
        updateCarouselDisplay();
    }, 5000);

    // إيقاف التشغيل التلقائي عند التفاعل - Stop auto-play on interaction
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });

    carousel.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % itemCount;
            updateCarouselDisplay();
        }, 5000);
    });
}

// ===== نموذج الاتصال - Contact Form =====
function initContactForm() {
    const contactForm = document.querySelector('#contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // الحصول على بيانات النموذج - Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // التحقق من صحة البيانات - Validate data
        if (validateContactForm(data)) {
            // عرض رسالة نجاح - Show success message
            showMessage('تم إرسال رسالتك بنجاح! سنقوم بالرد عليك قريباً.', 'success');
            contactForm.reset();
        } else {
            // عرض رسالة خطأ - Show error message
            showMessage('يرجى تعبئة جميع الحقول المطلوبة بشكل صحيح.', 'error');
        }
    });

    // التحقق من صحة الحقول أثناء الكتابة - Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            validateField(this);
        });
    });
}

function validateContactForm(data) {
    // التحقق من الحقول المطلوبة - Required field validation
    if (!data.name || data.name.trim().length < 2) return false;
    if (!data.email || !isValidEmail(data.email)) return false;
    if (!data.subject || data.subject.trim().length < 3) return false;
    if (!data.message || data.message.trim().length < 10) return false;

    return true;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';

    switch (field.type) {
        case 'text':
            if (field.name === 'name') {
                if (value.length < 2) {
                    isValid = false;
                    message = 'الاسم يجب أن يحتوي على حرفين على الأقل';
                }
            } else if (field.name === 'subject') {
                if (value.length < 3) {
                    isValid = false;
                    message = 'الموضوع يجب أن يحتوي على 3 أحرف على الأقل';
                }
            }
            break;

        case 'email':
            if (!isValidEmail(value)) {
                isValid = false;
                message = 'يرجى إدخال بريد إلكتروني صحيح';
            }
            break;

        case 'textarea':
            if (value.length < 10) {
                isValid = false;
                message = 'الرسالة يجب أن تحتوي على 10 أحرف على الأقل';
            }
            break;
    }

    // عرض/إخفاء رسالة الخطأ - Show/hide error message
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = '#ef4444';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        field.parentNode.appendChild(errorElement);
    }

    if (!isValid) {
        errorElement.textContent = message;
        field.style.borderColor = '#ef4444';
    } else {
        errorElement.textContent = '';
        field.style.borderColor = '#d1d5db';
    }

    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(message, type = 'info') {
    // إنشاء عنصر الرسالة - Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type}`;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 500;
        z-index: 1000;
        max-width: 400px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    // تعيين لون الخلفية حسب النوع - Set background color based on type
    switch (type) {
        case 'success':
            messageDiv.style.backgroundColor = '#10b981';
            break;
        case 'error':
            messageDiv.style.backgroundColor = '#ef4444';
            break;
        default:
            messageDiv.style.backgroundColor = '#3b82f6';
    }

    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    // عرض الرسالة - Show message
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(0)';
    }, 100);

    // إخفاء الرسالة بعد 5 ثواني - Hide message after 5 seconds
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, 5000);
}

// ===== فلتر الأقسام - Department Filter =====
function initDepartmentFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const departmentCards = document.querySelectorAll('.department-card');

    if (!filterButtons.length || !departmentCards.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');

            // تحديث حالة الأزرار - Update button states
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // تصفية البطاقات - Filter cards
            departmentCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (filter === 'all' || cardCategory === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ===== بحث المعلمين - Teacher Search =====
function initTeacherSearch() {
    const searchInput = document.querySelector('.search-input');
    const teacherCards = document.querySelectorAll('.teacher-card');

    if (!searchInput || !teacherCards.length) return;

    searchInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();

        teacherCards.forEach(card => {
            const teacherName = card.querySelector('.teacher-name').textContent.toLowerCase();
            const teacherSubject = card.querySelector('.teacher-subject').textContent.toLowerCase();

            if (teacherName.includes(searchTerm) || teacherSubject.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.3s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// ===== تأثيرات التمرير - Scroll Animations =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // مراقبة العناصر - Observe elements
    const animateElements = document.querySelectorAll('.card, .announcement, .department-card, .teacher-card');
    animateElements.forEach(el => observer.observe(el));
}

// ===== تأثيرات البداية - Entrance Effects =====
function addEntranceEffects() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';

        setTimeout(() => {
            heroContent.style.transition = 'all 0.8s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 200);
    }
}

// ===== أدوات مساعدة - Utility Functions =====

// التمرير إلى الأعلى - Scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
// ===== Page Loader =====
function hidePageLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        setTimeout(() => {
            loader.classList.remove('active');
        }, 500);
    }
}

function showPageLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.classList.add('active');
    }
}

// ===== Tooltips =====
function initTooltips() {
    // إضافة tooltips للبطاقات
    const cards = document.querySelectorAll('.card');

    if (cards.length === 0) return;

    // إضافة tooltips للأقسام
    const departmentCards = document.querySelectorAll('.department-card');
    departmentCards.forEach((card, index) => {
        card.setAttribute('data-tooltip', `اضغط لمعرفة المزيد عن هذا القسم`);
    });

    // إضافة tooltips للمعلمين
    const teacherCards = document.querySelectorAll('.teacher-card');
    teacherCards.forEach((card) => {
        card.setAttribute('data-tooltip', `معلومات المعلم`);
    });

    // إضافة tooltips للأزرار
    const buttons = document.querySelectorAll('.btn, .carousel-btn, .filter-btn');
    buttons.forEach((btn) => {
        if (btn.title) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.innerHTML = `${btn.textContent}<span class="tooltip-text">${btn.title}</span>`;
            btn.parentNode.replaceChild(tooltip, btn);
        }
    });
}

// إظهار زر التمرير إلى الأعلى - Show scroll to top button
window.addEventListener('scroll', function () {
    const scrollBtn = document.querySelector('.scroll-to-top');
    if (scrollBtn) {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    }
});

// طباعة الصفحة - Print page
function printPage() {
    window.print();
}

// مشاركة الصفحة - Share page
function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            url: window.location.href
        }).catch(console.error);
    } else {
        // نسخ الرابط إلى الحافظة - Copy link to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showMessage('تم نسخ الرابط إلى الحافظة', 'success');
        });
    }
}

// ===== معالجة الأخطاء - Error Handling =====
window.addEventListener('error', function (e) {
    console.error('JavaScript Error:', e.error);
    // يمكن إضافة إرسال تقارير الأخطاء إلى الخادم هنا
});

// ===== التوافق مع المتصفحات القديمة - Browser Compatibility =====
// polyfill لـ IntersectionObserver
if (!window.IntersectionObserver) {
    // يمكن إضافة polyfill هنا إذا لزم الأمر
    console.warn('IntersectionObserver not supported');
}

// polyfill لـ smooth scroll
if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothScrollPolyfill = () => {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    };
    smoothScrollPolyfill();
}