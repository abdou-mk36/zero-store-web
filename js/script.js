window.skipAutoSliders = new URLSearchParams(location.search).has('id');
/* =========================================================
   GOOGLE SHEETS — إعدادات
========================================================= */
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwx2Tb1ntk35MmnhfCGDBXGlg8jjHGHdJIA9Pu_J93bWyjndp6jahop9H4wR-5Xr3EK/exec";

/* =========================================================
   DELIVERY PRICES — أسعار التوصيل
========================================================= */

// ✅ أسعار التوصيل للمنزل
const DELIVERY_HOME = {
    "01": 1650, "02": 950,  "03": 950,  "04": 700,  "05": 750,
    "06": 800,  "07": 800,  "08": 1150, "09": 900,  "10": 800,
    "11": 1650, "12": 700,  "13": 950,  "14": 950,  "15": 850,
    "16": 850,  "17": 900,  "18": 750,  "19": 750,  "20": 950,
    "21": 700,  "22": 1100, "23": 650,  "24": 650,  "25": 700,
    "26": 850,  "27": 950,  "28": 850,  "29": 950,  "30": 1000,
    "31": 1050, "32": 1000, "33": 0,    "34": 850,  "35": 850,
    "36": 500,  "37": 0,    "38": 950,  "39": 950,  "40": 750,
    "41": 650,  "42": 850,  "43": 800,  "44": 850,  "45": 1200,
    "46": 950,  "47": 950,  "48": 950,  "49": 1650, "50": 0,
    "51": 950,  "52": 1200, "53": 2000, "54": 0,    "55": 950,
    "56": 0,    "57": 850,  "58": 1150, "59": 0,    "60": 0,
    "61": 0,    "62": 0,    "63": 0,    "64": 0,    "65": 0,
    "66": 0,    "67": 0,    "68": 0,    "69": 0
};

// ✅ أسعار التوصيل للمكتب
const DELIVERY_OFFICE = {
    "01": 800, "02": 450, "03": 450, "04": 400, "05": 400,
    "06": 450, "07": 450, "08": 550, "09": 450, "10": 450,
    "11": 800, "12": 400, "13": 550, "14": 500, "15": 450,
    "16": 450, "17": 450, "18": 400, "19": 400, "20": 50,
    "21": 400, "22": 550, "23": 400, "24": 400, "25": 400,
    "26": 450, "27": 500, "28": 450, "29": 500, "30": 500,
    "31": 500, "32": 500, "33": 0,   "34": 400, "35": 450,
    "36": 400, "37": 0,   "38": 450, "39": 450, "40": 400,
    "41": 400, "42": 450, "43": 400, "44": 450, "45": 550,
    "46": 550, "47": 500, "48": 500, "49": 600, "50": 0,
    "51": 450, "52": 600, "53": 600, "54": 0,   "55": 450,
    "56": 0,   "57": 450, "58": 550, "59": 0,   "60": 0,
    "61": 0,   "62": 0,   "63": 0,   "64": 0,   "65": 0,
    "66": 0,   "67": 0,   "68": 0,   "69": 0
};


/* =========================================================

   NAVBAR MOBILE MENU
========================================================= */
const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
        document.body.style.overflow = 'hidden';  // ✅ منع التمرير
    });
}
if (close) {
    close.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        nav.classList.remove('active');
        document.body.style.overflow = '';  // ✅ إعادة التمرير
    });
}


/* =========================================================
   SHIPPING BAR
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector('.shipping-track');
    if (track) track.innerHTML += track.innerHTML + track.innerHTML;
});

/* =========================================================
   SMOOTH SLIDER ENGINE
========================================================= */
function initSmoothSlider(config) {

    const track  = document.querySelector(config.trackSelector);
    const slides = document.querySelectorAll(config.slideSelector);
    const dots   = document.querySelectorAll(config.dotSelector);

    if (!track || slides.length === 0) return null;

    const AUTO_PLAY_MS       = config.autoPlayMs    || 5000;
    const RESUME_AFTER_MS    = config.resumeAfterMs || 10000;
    const SWIPE_THRESHOLD    = 40;
    const VELOCITY_THRESHOLD = 0.3;
    const RESISTANCE         = 0.35;

    let index = 0;
    let autoPlay = null;
    let resumeTimer = null;

    let startX = 0, startY = 0;
    let lastX = 0, lastTime = 0;
    let velocity = 0;
    let dragOffset = 0;
    let isDragging = false;
    let swipeDir = null;
    let startTime = 0;
    let hasMoved = false;
    let inputType = null;
    let lastWidth = window.innerWidth;

    function getStep() {
        const slideWidth = slides[0].getBoundingClientRect().width;
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        return slideWidth + gap;
    }

    function goTo(newIndex, animate = true) {
        index = Math.max(0, Math.min(newIndex, slides.length - 1));

        if (!animate) track.classList.add('no-transition');

        const x = index * getStep();
        track.style.transform = `translate3d(${x}px, 0, 0)`;

        if (!animate) {
            void track.offsetWidth;
            track.classList.remove('no-transition');
        }

        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));

        if (config.hasFillDot) {
            dots.forEach(dot => dot.classList.remove('running'));
            const activeDot = dots[index];
            if (activeDot) {
                void activeDot.offsetWidth;
                activeDot.classList.add('running');
            }
        }
    }

    function resetFills() {
        if (!config.hasFillDot) return;
        dots.forEach(dot => {
            dot.classList.remove('running');
            const fill = dot.querySelector('.fill');
            if (fill) {
                fill.style.animation = '';
                fill.style.width = '';
            }
        });
    }

    function startAutoPlay(forceReset = false) {
        stopAutoPlay();

        if (config.hasFillDot) {
            const activeDot = dots[index];
            const isRunning = activeDot && activeDot.classList.contains('running');

            if (forceReset || !isRunning) {
                resetFills();
                if (activeDot) {
                    void activeDot.offsetWidth;
                    activeDot.classList.add('running');
                }
            }
        }

        autoPlay = setInterval(() => {
            const next = index === slides.length - 1 ? 0 : index + 1;
            goTo(next);
        }, AUTO_PLAY_MS);
    }

    function stopAutoPlay() {
        clearInterval(autoPlay);
        autoPlay = null;
    }

    function pauseTemporarily() {
        stopAutoPlay();

        if (config.hasFillDot) {
            dots.forEach(dot => {
                dot.classList.remove('running');
                const fill = dot.querySelector('.fill');
                if (fill) {
                    fill.style.animation = 'none';
                    fill.style.width = '0%';
                }
            });

            const activeDot = dots[index];
            if (activeDot) {
                const fill = activeDot.querySelector('.fill');
                if (fill) {
                    fill.style.animation = 'none';
                    fill.style.width = '100%';
                }
            }
        }

        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => {
            resetFills();
            startAutoPlay(true);
        }, RESUME_AFTER_MS);
    }

    function handleStart(x, y, type) {
        if (isDragging) return;
        inputType = type;
        hasMoved = false;
        swipeDir = null;
        dragOffset = 0;
        velocity = 0;
        startTime = lastTime = Date.now();
        startX = lastX = x;
        startY = y;
        isDragging = true;
    }

    function handleMove(x, y, e) {
        if (!isDragging) return;

        const MIN_DIR  = inputType === 'touch' ? 25 : 10;
        const MIN_DRAG = inputType === 'touch' ? 30 : 5;

        const dx = x - startX;
        const dy = y - startY;

        if (swipeDir === null) {
            if (Math.abs(dx) > MIN_DIR || Math.abs(dy) > MIN_DIR) {
                swipeDir = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
            }
        }
        if (swipeDir !== 'h') return;
        if (Math.abs(dx) < MIN_DRAG) return;

        hasMoved = true;

        if (!track.classList.contains('dragging')) {
            track.classList.add('dragging');
        }

        if (e && e.cancelable) e.preventDefault();

        let offset = dx;
        if (index === 0 && offset < 0) offset *= RESISTANCE;
        if (index === slides.length - 1 && offset > 0) offset *= RESISTANCE;

        dragOffset = offset;
        const baseX = index * getStep();
        track.style.transform = `translate3d(${baseX + offset}px, 0, 0)`;

        const now = Date.now();
        if (now - lastTime > 0) {
            velocity = (x - lastX) / (now - lastTime);
        }
        lastX = x;
        lastTime = now;
    }

    function handleEnd() {
        if (!isDragging) return;
        isDragging = false;

        if (swipeDir !== 'h' || !hasMoved || Math.abs(dragOffset) < 20) {
            track.classList.remove('dragging');
            const baseX = index * getStep();
            track.style.transform = `translate3d(${baseX}px, 0, 0)`;
            return;
        }

        const step     = getStep();
        const duration = Date.now() - startTime;
        const absVel   = Math.abs(velocity);
        const absOff   = Math.abs(dragOffset);

        let move = 0;

        if (absVel > VELOCITY_THRESHOLD && duration < 300) {
            move = velocity > 0 ? 1 : -1;
        }
        else if (absOff > step * 0.25 || absOff > SWIPE_THRESHOLD) {
            move = dragOffset > 0 ? 1 : -1;
        }

        const targetIndex = Math.max(0, Math.min(index + move, slides.length - 1));
        track.classList.remove('dragging');

        const isRealSwipe =
            absOff > SWIPE_THRESHOLD ||
            (absVel > VELOCITY_THRESHOLD && duration < 300);

        if (!isRealSwipe) {
            const baseX = index * getStep();
            track.style.transform = `translate3d(${baseX}px, 0, 0)`;
            return;
        }

        goTo(targetIndex);
        pauseTemporarily();
    }

    function handleCancel() {
        if (!isDragging) return;
        isDragging = false;
        track.classList.remove('dragging');
        const baseX = index * getStep();
        track.style.transform = `translate3d(${baseX}px, 0, 0)`;
    }

    track.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        handleStart(e.touches[0].clientX, e.touches[0].clientY, 'touch');
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        if (e.touches.length !== 1) return;
        handleMove(e.touches[0].clientX, e.touches[0].clientY, e);
    }, { passive: false });

    track.addEventListener('touchend', () => handleEnd(), { passive: true });
    track.addEventListener('touchcancel', () => handleCancel(), { passive: true });

    track.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        handleStart(e.clientX, e.clientY, 'mouse');
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (inputType !== 'mouse') return;
        handleMove(e.clientX, e.clientY, e);
    });

    document.addEventListener('mouseup', () => {
        if (inputType !== 'mouse') return;
        handleEnd();
    });

    track.addEventListener('dragstart', (e) => e.preventDefault());

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            goTo(i);
            pauseTemporarily();
        });
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        const newWidth = window.innerWidth;
        if (newWidth === lastWidth) return;
        lastWidth = newWidth;

        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const x = index * getStep();
            track.classList.add('no-transition');
            track.style.transform = `translate3d(${x}px, 0, 0)`;
            void track.offsetWidth;
            track.classList.remove('no-transition');
        }, 150);
    });

    goTo(0, false);

    return {
        goTo,
        startAutoPlay,
        stopAutoPlay,
        getIndex: () => index,
        element: track
    };
}

/* =========================================================
   PRODUCT SLIDER
========================================================= */
let productSlider = null;
if (!window.skipAutoSliders) {
    productSlider = initSmoothSlider({
        trackSelector: '.product-track',
        slideSelector: '.product-slide',
        dotSelector: '.dot',
        autoPlayMs: 3000,
        resumeAfterMs: 10000,
        hasFillDot: true
    });
    if (productSlider) productSlider.startAutoPlay();
}

// ✅ اجعله عاماً لإعادة التهيئة
window.productSlider = productSlider;
window.initSmoothSlider = initSmoothSlider;

/* =========================================================
   HIGHLIGHTS SLIDER
========================================================= */
let highlightsSlider = null;
if (!window.skipAutoSliders) {
    highlightsSlider = initSmoothSlider({
        trackSelector: '.highlights-track',
        slideSelector: '.highlight-slide',
        dotSelector: '.highlight-dot',
        autoPlayMs: 5000,
        resumeAfterMs: 10000,
        hasFillDot: true
    });

    if (highlightsSlider) {
        const highlightSection = document.querySelector('.product-highlights');
        if (highlightSection) {
            let isVisible = false;
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !isVisible) {
                        isVisible = true;
                        highlightsSlider.startAutoPlay(true);
                    } else if (!entry.isIntersecting && isVisible) {
                        isVisible = false;
                        highlightsSlider.stopAutoPlay();
                    }
                });
            }, { threshold: 0.1, rootMargin: '100px 0px' });
            observer.observe(highlightSection);
        }
    }
}

// ✅ اجعله عاماً لإعادة التهيئة
window.highlightsSlider = highlightsSlider;
/* =========================================================
   ORDER BUTTON
========================================================= */
document.addEventListener("DOMContentLoaded", function () {
    const orderNowBtn = document.getElementById("orderNowBtn");
    const orderForm   = document.getElementById("order-form");

    if (!orderNowBtn || !orderForm) return;

    orderNowBtn.addEventListener("click", function () {
        const headerHeight = document.getElementById('header').offsetHeight;
        const formTop = orderForm.getBoundingClientRect().top + window.scrollY;
    
        // ✅ إزاحة إضافية (كل ما زادت → الاستمارة تنزل أكثر)
        const EXTRA_OFFSET = -131;   // ← عدّل هذا فقط
    
        const targetPosition = formTop - headerHeight - EXTRA_OFFSET;
    
        window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                orderNowBtn.parentElement.classList.add("hide-order-btn");
            } else {
                orderNowBtn.parentElement.classList.remove("hide-order-btn");
            }
        });
    }, { threshold: 0.15 });

    observer.observe(orderForm);
});

/* =========================================================
   TESTIMONIALS WHEEL — Snap هادئ جداً
========================================================= */
window.initTestimonialsWheel = function() {

    const section = document.querySelector('.testimonials-wheel');
    const stage   = document.querySelector('.wheel-stage');
    const track   = document.getElementById('wheelTrack');

    if (!section || !stage || !track) return;

    const cards = Array.from(track.querySelectorAll('.wheel-card'));
    const total = cards.length;
    if (total === 0) return;

    const OPEN_GAP   = 30;
    const STACK_PEEK = 6;
    const EDGE_ZONE  = 0.15;

    // ✅ Snap هادئ جداً — يشتغل فقط عند الحاجة
    const SNAP_DELAY        = 800;    // ← 800ms انتظار (طويل)
    const SNAP_THRESHOLD    = 0.03;   // ← 3% (لا يزعج)
    const SNAP_STRENGTH     = 0.04;   // ← قوة ناعمة
    const LERP_BASE         = 0.07;   // قوة lerp الأساسية
    const LERP_FAR_BOOST    = 2.5;    // تسريع عند البعد
    const LERP_NEAR_DAMPEN  = 0.5;    // تبطيء عند القرب
    const MAX_DELTA_TIME    = 50;     // حد أقصى للـ delta

    let currentProgress = 0;
    let targetProgress  = 0;
    let lastTime        = 0;
    let lastScrollTime  = 0;
    let scrollVelocity  = 0;
    let isSnapping      = false;
    let snapTimer       = null;
    let rafId           = null;

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function getCardHeight() {
        return cards[0] ? cards[0].getBoundingClientRect().height : 0;
    }

    function getOpacity(positionFromTop) {
        const map = [1, 0.85, 0.7, 0.55];
        return map[positionFromTop] || 0.4;
    }

    function render(progress) {
        let stackFactor = 0;

        if (progress < EDGE_ZONE) {
            stackFactor = 1 - easeInOutCubic(progress / EDGE_ZONE);
        } else if (progress > 1 - EDGE_ZONE) {
            stackFactor = easeInOutCubic((progress - (1 - EDGE_ZONE)) / EDGE_ZONE);
        }
        stackFactor = Math.max(0, Math.min(1, stackFactor));

        const currentGap = OPEN_GAP - (OPEN_GAP - STACK_PEEK) * stackFactor;
        const continuousIndex = progress * (total - 1);
        const cardHeight = getCardHeight();
        const step = cardHeight + currentGap;
        const stageHeight = stage.getBoundingClientRect().height;
        const centerOffset = (stageHeight - cardHeight) / 2 - continuousIndex * step;

        cards.forEach((card, i) => {
            const cardTop = i * step;
            const translateY = cardTop + centerOffset;
            const dist = Math.abs(i - continuousIndex);

            let opacity;
            if (stackFactor < 0.5) {
                opacity = Math.max(0.15, 1 - dist * 0.4);
            } else {
                opacity = progress < 0.5 ? getOpacity(i) : getOpacity(total - 1 - i);
            }

            let zIndex;
            if (stackFactor < 0.5) {
                zIndex = 1000 - Math.round(dist * 10);
            } else {
                zIndex = progress < 0.5 ? total - i : i + 1;
            }

            const scale = 1 - Math.min(dist * 0.03, 0.08);

            card.classList.remove('active');
            if (stackFactor < 0.5) {
                if (dist < 0.5) card.classList.add('active');
            } else {
                if ((progress < 0.5 && i === 0) || (progress >= 0.5 && i === total - 1)) {
                    card.classList.add('active');
                }
            }

            card.style.transform = `translate(-50%, ${translateY}px) scale(${scale})`;
            card.style.opacity = opacity;
            card.style.zIndex = zIndex;
        });
    }

    function animate(timestamp) {
        if (!lastTime) lastTime = timestamp;

        const deltaTime = Math.min(timestamp - lastTime, MAX_DELTA_TIME);
        lastTime = timestamp;

        const diff = targetProgress - currentProgress;
        const absDiff = Math.abs(diff);

        if (absDiff < 0.0001) {
            currentProgress = targetProgress;
            render(currentProgress);
            rafId = null;
            lastTime = 0;
            isSnapping = false;
            return;
        }

        let baseStrength = isSnapping ? SNAP_STRENGTH : LERP_BASE;

        if (absDiff > 0.15) {
            baseStrength *= LERP_FAR_BOOST;
        } else if (absDiff < 0.03) {
            baseStrength *= LERP_NEAR_DAMPEN;
        }

        const timeFactor = deltaTime / 16.67;
        const factor = 1 - Math.pow(1 - baseStrength, timeFactor);

        currentProgress += diff * factor;
        render(currentProgress);

        rafId = requestAnimationFrame(animate);
    }

    function startAnimation() {
        if (rafId === null) {
            lastTime = 0;
            rafId = requestAnimationFrame(animate);
        }
    }

    // ✅ onScroll — Snap هادئ جداً
    function onScroll() {
        const rect = section.getBoundingClientRect();
        const scrollableDistance = section.offsetHeight - window.innerHeight;
        if (scrollableDistance <= 0) return;

        const newProgress = Math.max(0, Math.min(1, -rect.top / scrollableDistance));

        const now = performance.now();
        if (lastScrollTime > 0) {
            const timeDiff = now - lastScrollTime;
            if (timeDiff > 0) {
                scrollVelocity = Math.abs(newProgress - targetProgress) / timeDiff;
            }
        }
        lastScrollTime = now;

        targetProgress = newProgress;

        // ✅ إذا كان السكرول سريعاً → لا Snap
        if (scrollVelocity > 0.0005) {
            isSnapping = false;
            clearTimeout(snapTimer);
        }

        startAnimation();

        // ✅ Snap هادئ جداً — يشتغل فقط عند البطء والابتعاد
        clearTimeout(snapTimer);
        snapTimer = setTimeout(() => {
            const nearestIndex = Math.round(targetProgress * (total - 1));
            const snapTarget = nearestIndex / (total - 1);

            // ✅ فقط إذا كنت بعيداً بأكثر من 3%
            if (Math.abs(targetProgress - snapTarget) > SNAP_THRESHOLD) {
                targetProgress = snapTarget;
                isSnapping = true;
                startAnimation();
            }
        }, SNAP_DELAY);
    }

    render(0);

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                onScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    window.addEventListener('resize', () => {
        render(currentProgress);
    });

    onScroll();
};
// تشغيل تلقائي في الصفحات التي لا تحتوي على Firebase
if (document.getElementById('wheelTrack') && !new URLSearchParams(location.search).get('id')) {
    window.initTestimonialsWheel();
}

/* =========================================================
   ADD REVIEW — EmailJS
========================================================= */


(function initAddReview() {
    const toggle      = document.getElementById('addReviewToggle');
    const modal       = document.getElementById('addReviewModal');
    const backdrop    = document.getElementById('modalBackdrop');
    const closeBtn    = document.getElementById('modalClose');
    const form        = document.getElementById('reviewForm');
    const starBtns    = document.querySelectorAll('.star-btn');
    const ratingInput = document.getElementById('reviewRating');
    const message     = document.getElementById('formMessage');
    const charCount   = document.getElementById('charCount');
    const reviewText  = document.getElementById('reviewText');
    const phoneInput  = document.getElementById('reviewPhone');

    if (!toggle || !modal || !form) return;

    function openModal() {
        modal.classList.add('open');
        toggle.classList.add('active');
        document.body.style.overflow = 'hidden';
        const text = toggle.querySelector('.toggle-text');
        if (text) text.textContent = 'إغلاق النموذج';
    }

    function closeModal() {
        modal.classList.remove('open');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
        const text = toggle.querySelector('.toggle-text');
        if (text) text.textContent = 'أضف تعليقك';
        clearMessage();
    }

    toggle.addEventListener('click', () => {
        if (modal.classList.contains('open')) closeModal();
        else openModal();
    });

    if (backdrop) backdrop.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    starBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const value = parseInt(btn.dataset.value, 10);
            ratingInput.value = value;
            updateStars(value);
        });
        btn.addEventListener('mouseenter', () => {
            highlightStars(parseInt(btn.dataset.value, 10));
        });
    });

    const starContainer = document.getElementById('starSelector');
    if (starContainer) {
        starContainer.addEventListener('mouseleave', () => {
            updateStars(parseInt(ratingInput.value, 10) || 5);
        });
    }

    function updateStars(value) {
        starBtns.forEach(btn => {
            const v = parseInt(btn.dataset.value, 10);
            btn.classList.toggle('active', v <= value);
            btn.classList.remove('hover');
        });
    }

    function highlightStars(value) {
        starBtns.forEach(btn => {
            const v = parseInt(btn.dataset.value, 10);
            btn.classList.toggle('hover', v <= value);
        });
    }

    updateStars(5);

    if (reviewText && charCount) {
        reviewText.addEventListener('input', () => {
            charCount.textContent = reviewText.value.length;
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) value = value.slice(0, 10);
            let formatted = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 2 === 0) formatted += ' ';
                formatted += value[i];
            }
            e.target.value = formatted;
        });
    }

    function showMessage(text, type = 'error') {
        message.textContent = text;
        message.className = 'form-message ' + type;
    }

    function clearMessage() {
        message.textContent = '';
        message.className = 'form-message';
    }

    function validateField(input, condition) {
        if (condition) { input.classList.remove('error'); return true; }
        input.classList.add('error');
        return false;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearMessage();

        const name   = document.getElementById('reviewName').value.trim();
        const phone  = phoneInput.value.trim();
        const text   = reviewText.value.trim();
        const rating = ratingInput.value;

        let isValid = true;
        isValid = validateField(document.getElementById('reviewName'), name.length >= 3) && isValid;
        isValid = validateField(phoneInput, phone.replace(/\D/g, '').length === 10) && isValid;
        isValid = validateField(reviewText, text.length >= 2) && isValid;

        if (!isValid) {
            showMessage('❌ يرجى تعبئة جميع الحقول بشكل صحيح', 'error');
            return;
        }

        const submitBtn = form.querySelector('.submit-review-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'جارٍ الإرسال...';

        setTimeout(() => {
            showMessage('✅ شكراً لك! تم إرسال تعليقك.', 'success');
            form.reset();
            updateStars(5);
            if (charCount) charCount.textContent = '0';
            submitBtn.disabled = false;
            submitBtn.textContent = 'إرسال التعليق';
            setTimeout(() => closeModal(), 3000);
        }, 500);
            });

    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => input.classList.remove('error'));
    });

})();

/* =========================================================
   PRODUCT DETAILS
========================================================= */
(function initProductDetails() {
    const btn = document.getElementById('showMoreBtn');
    const hidden = document.getElementById('detailsHidden');
    if (!btn || !hidden) return;

    let isOpen = false;

    btn.addEventListener('click', function() {
        isOpen = !isOpen;

        if (isOpen) {
            hidden.classList.add('open');
            btn.classList.add('open');
            btn.querySelector('.btn-text').textContent = 'عرض أقل';
        } else {
            hidden.classList.remove('open');
            btn.classList.remove('open');
            btn.querySelector('.btn-text').textContent = 'عرض المزيد من التفاصيل';

            const section = document.getElementById('product-details');
            if (section) {
                const top = section.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }
    });
})();

/* =========================================================
   TELEGRAM — إعدادات
========================================================= */
const TELEGRAM_BOT_TOKEN    = "8837412883:AAEWdgFNZ221Ja2BPyilV5y1X5EQ8yXpMWk";
const TELEGRAM_CHAT_ORDERS  = "-1004491843696";
const TELEGRAM_CHAT_REVIEWS = "-1004316332526";

function sendToTelegram(chatId, message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            chat_id: chatId, 
            text: message, 
            parse_mode: 'Markdown' 
        })
    }).then(res => res.json());
}


/* =========================================================
   ORDER FORM — إرسال الطلب إلى Sheets + Telegram
========================================================= */
(function initOrderToTelegram() {

    const orderForm = document.querySelector('.order-form');
    if (!orderForm) return;
               // ✅ تتبع بدء الطلب (TikTok + Meta)
               let checkoutTracked = false;
               orderForm.addEventListener('focusin', () => {
                   if (!checkoutTracked) {
                       checkoutTracked = true;
                       const name = window.currentProductName || 'منتج';
                       const qty = document.querySelector('input[name="quantity"]:checked');
                       const price = qty ? parseInt(qty.dataset.price) : 0;
       
                       // TikTok
                       if (typeof ttq === 'object') {
                           ttq.track('InitiateCheckout', {
                               content_name: name,
                               currency: 'DZD',
                               value: price
                           });
                       }
       
                       // Meta
                       if (typeof fbq === 'function') {
                           fbq('track', 'InitiateCheckout', {
                               content_name: name,
                               currency: 'DZD',
                               value: price
                           });
                       }
                   }
               }, { once: false });

       // ✅ التحقق من الهاتف + إخفاء الخطأ عند الكتابة
       const phoneInput = document.getElementById('phone');
       const phoneError = document.getElementById('phoneError');
   
       if (phoneInput && phoneError) {
           phoneInput.addEventListener('input', () => {
               phoneError.style.display = 'none';
               phoneInput.classList.remove('error');
           });
       }
   
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
        
            const name = document.getElementById('full-name').value.trim();
            const phone = phoneInput.value.trim();
            const wilaya = document.getElementById('wilaya');
            const wilayaText = wilaya.options[wilaya.selectedIndex].text;
            const wilayaCode = wilaya.value;
            const address = document.getElementById('address').value.trim();
        
            // ✅ التحقق من 10 أرقام على الأقل
            if (phone.replace(/\D/g, '').length < 10) {
                phoneError.textContent = '❌ يرجى إدخال رقم هاتف صحيح (10 أرقام)';
                phoneError.style.display = 'block';
                phoneInput.classList.add('error');
                phoneInput.focus();
                return;
            }
            phoneError.style.display = 'none';
            phoneInput.classList.remove('error');
        
            if (!name || !address || !wilaya.value) {
                alert('❌ يرجى تعبئة جميع الحقول');
                return;
            }
 

        const deliveryTypeEl = document.querySelector('input[name="deliveryType"]:checked');
        const deliveryType = deliveryTypeEl ? deliveryTypeEl.value : 'home';
        const deliveryLabel = deliveryType === 'home' ? 'المنزل' : 'المكتب';

        const qtySelected = document.querySelector('input[name="quantity"]:checked');
        const quantity = qtySelected ? qtySelected.value : '1';
        const productPrice = qtySelected ? parseInt(qtySelected.dataset.price, 10) : 2900;

        let deliveryPrice = 0;
        if (deliveryType === 'office') {
            deliveryPrice = DELIVERY_OFFICE[wilayaCode] || 0;
        } else {
            deliveryPrice = DELIVERY_HOME[wilayaCode] || 0;
        }
            // ✅ اسم المنتج
        const productName = window.currentProductName || 'منتج';
        const total = productPrice + deliveryPrice;

        // ✅ تفعيل حالة التحميل
        const submitBtn = orderForm.querySelector('.confirm-order-btn');
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            submitBtn.innerHTML = `
                <span class="btn-spinner"></span>
                <span>جارٍ تأكيد طلبك...</span>
            `;
        }

        // ✅ 1. Google Sheets
        const params = new URLSearchParams({
            productName: productName,    // ← جديد
            name: name,
            phone: phone,
            wilaya: wilayaText,
            deliveryType: deliveryLabel,
            address: address,
            quantity: quantity,
            productPrice: productPrice,
            deliveryPrice: deliveryPrice,
            total: total
        });

        const sheetURL = GOOGLE_SCRIPT_URL + '?' + params.toString();

        fetch(sheetURL, {
            method: 'GET',
            mode: 'no-cors',
            keepalive: true
        }).catch(err => console.warn('Sheet error:', err));

        // ✅ 2. Telegram
        sendToTelegram(TELEGRAM_CHAT_ORDERS,
            `📦 *طلب جديد — Zero Store*\n` +
            `━━━━━━━━━━━━━━━━━━━━\n\n` +
            `🛍️ *المنتج:* ${productName}\n\n` +
            `👤 *الاسم:* ${name}\n\n` +
            `📞 *الهاتف:* ${phone}\n\n` +
            `📍 *الولاية:* ${wilayaText}\n\n` +
            `🚚 *نوع التوصيل:* ${deliveryLabel}\n\n` +
            `🔢 *الكمية:* ${quantity} قطعة\n\n` +
            `💰 *سعر المنتج:* ${productPrice.toLocaleString('ar-DZ')} دج\n\n` +
            `🚛 *سعر التوصيل:* ${deliveryPrice.toLocaleString('ar-DZ')} دج\n\n` +
            `💵 *الإجمالي:* ${total.toLocaleString('ar-DZ')} دج\n\n` +
            `🏠 *العنوان:* ${address}\n\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `📅 ${new Date().toLocaleString('ar-DZ')}`
        )
        .then(() => {
            // ✅ انتقال مع ID المنتج
            setTimeout(() => {
                const pid = window.currentProductId || '';
                window.location.href = 'thank-you.html' + (pid ? '?id=' + pid : '');
            }, 500);
        })
        .catch(err => {
            console.warn('Telegram error:', err);
            const pid = window.currentProductId || '';
            window.location.href = 'thank-you.html' + (pid ? '?id=' + pid : '');
        });
    });

})();

/* إرسال التعليقات */
/* إرسال التعليقات */
(function initReviewToTelegram() {
    const form       = document.getElementById('reviewForm');
    const phoneInput = document.getElementById('reviewPhone');
    const reviewText = document.getElementById('reviewText');
    const ratingInput = document.getElementById('reviewRating');

    if (!form || !phoneInput || !reviewText || !ratingInput) return;

    form.addEventListener('submit', () => {
        const name   = document.getElementById('reviewName').value.trim();
        const phone  = phoneInput.value.trim();
        const text   = reviewText.value.trim();
        const rating = ratingInput.value;

        if (!name || !phone || !text) return;

        // ✅ اسم المنتج
        const productName = window.currentProductName || 'غير محدد';

        const stars = "⭐".repeat(parseInt(rating, 10));

        // ✅ 1. Telegram
        const message =
            `💬 *تعليق جديد — Zero Store*\n` +
            `━━━━━━━━━━━━━━━━━━━━\n\n` +
            `🛍️ *المنتج:* ${productName}\n\n` +
            `👤 *الاسم:* ${name}\n\n` +
            `📞 *الهاتف:* ${phone}\n\n` +
            `⭐ *التقييم:* ${stars} (${rating}/5)\n\n` +
            `💬 *التعليق:*\n${text}\n\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `📅 ${new Date().toLocaleString('ar-DZ')}`;

        sendToTelegram(TELEGRAM_CHAT_REVIEWS, message)
            .catch(err => console.warn('Telegram review error:', err));

       
    });
})();


/* =========================================================
   BACK TO TOP BUTTON
========================================================= */
(function initBackToTop() {

    const btn = document.getElementById('backToTop');
    if (!btn) return;

    function checkScroll() {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    
    // ✅ تحقق أولي (في حالة كانت الصفحة مفتوحة في الأسفل)
    checkScroll();

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

})();


/* =========================================================
   CONTACT FORM
========================================================= */
(function initContactForm() {

    const form = document.getElementById('contactForm');
    if (!form) return;

    const phoneInput = document.getElementById('contactPhone');
    const messageInput = document.getElementById('contactMessage');
    const charCount = document.getElementById('contactCharCount');
    const messageEl = document.getElementById('contactFormMessage');

    // ✅ تنسيق الهاتف
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) value = value.slice(0, 10);
            let formatted = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 2 === 0) formatted += ' ';
                formatted += value[i];
            }
            e.target.value = formatted;
        });
    }

    // ✅ عدّاد الأحرف
    if (messageInput && charCount) {
        messageInput.addEventListener('input', () => {
            charCount.textContent = messageInput.value.length;
        });
    }

    function showMessage(text, type = 'error') {
        messageEl.textContent = text;
        messageEl.className = 'form-message ' + type;
    }

    function clearMessage() {
        messageEl.textContent = '';
        messageEl.className = 'form-message';
    }

    function validateField(input, condition) {
        if (condition) {
            input.classList.remove('error');
            return true;
        }
        input.classList.add('error');
        return false;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearMessage();

        const name = document.getElementById('contactName').value.trim();
        const phone = phoneInput.value.trim();
        const subject = document.getElementById('contactSubject').value;
        const message = messageInput.value.trim();

        let isValid = true;
        isValid = validateField(document.getElementById('contactName'), name.length >= 3) && isValid;
        isValid = validateField(phoneInput, phone.replace(/\D/g, '').length === 10) && isValid;
        isValid = validateField(document.getElementById('contactSubject'), subject !== '') && isValid;
        isValid = validateField(messageInput, message.length >= 2) && isValid;

        if (!isValid) {
            showMessage('❌ يرجى تعبئة جميع الحقول بشكل صحيح', 'error');
            return;
        }

        const submitBtn = form.querySelector('.contact-submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'جارٍ الإرسال...';

        // ✅ إرسال إلى تيليجرام
        sendToTelegram(TELEGRAM_CHAT_REVIEWS,
            `📩 *رسالة جديدة — Zero Store*\n` +
            `━━━━━━━━━━━━━━━━━━━━\n\n` +
            `👤 *الاسم:* ${name}\n\n` +
            `📞 *الهاتف:* ${phone}\n\n` +
            `📌 *الموضوع:* ${subject}\n\n` +
            `💬 *الرسالة:*\n${message}\n\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `📅 ${new Date().toLocaleString('ar-DZ')}`
        )
        .then(() => {
            showMessage('✅ شكراً لك! تم إرسال رسالتك وسنرد عليك قريباً.', 'success');
            form.reset();
            if (charCount) charCount.textContent = '0';
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
                إرسال الرسالة
            `;
        })
        .catch((err) => {
            console.error('Contact error:', err);
            showMessage('❌ حدث خطأ. يرجى المحاولة مرة أخرى.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'إرسال الرسالة';
        });
    });

    // ✅ إزالة الخطأ عند الكتابة
    form.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('input', () => input.classList.remove('error'));
    });

})();


/* =========================================================
   CART MODAL — سلة بسيطة
========================================================= */
(function initCartModal() {

    const modal = document.getElementById('cartModal');
    const backdrop = document.getElementById('cartBackdrop');
    const closeBtn = document.getElementById('cartClose');
    const continueBtn = document.getElementById('cartContinue');
    const checkoutBtn = document.getElementById('cartCheckout');
    const cartTotal = document.getElementById('cartTotal');
    const qtyOptions = document.querySelectorAll('input[name="cartQuantity"]');

    if (!modal) return;

    // ✅ دالة لحساب الإجمالي
    function updateTotal() {
        const selected = document.querySelector('input[name="cartQuantity"]:checked');
        if (!selected) return;

        const price = parseInt(selected.dataset.price, 10);
        const formatted = price.toLocaleString('ar-DZ');

        if (cartTotal) {
            cartTotal.textContent = formatted + ' دج';
        }
    }

    // ✅ الاستماع لتغيير الكمية
    qtyOptions.forEach(option => {
        option.addEventListener('change', updateTotal);
    });

    // ✅ فتح السلة (عام — لأي زر)
    window.openCart = function() {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        updateTotal();
    };

    // ✅ إغلاق السلة
    function closeCart() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    // ✅ ربط الأحداث
    if (closeBtn) closeBtn.addEventListener('click', closeCart);
    if (backdrop) backdrop.addEventListener('click', closeCart);
    if (continueBtn) continueBtn.addEventListener('click', closeCart);

    // ✅ Escape للإغلاق
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeCart();
        }
    });

    // ✅ زر "إتمام الطلب"
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const selected = document.querySelector('input[name="cartQuantity"]:checked');
            if (!selected) return;

            const quantity = selected.value;
            const price = selected.dataset.price;

            // ✅ احفظ في localStorage
            try {
                localStorage.setItem('cartQuantity', quantity);
                localStorage.setItem('cartPrice', price);
            } catch (err) {
                console.warn('Storage error:', err);
            }

            // ✅ انتقل لصفحة المنتج
            window.location.href = `sproduct.html?quantity=${quantity}`;
        });
    }

    // ✅ ربط أزرار السلة في بطاقات المنتجات
    document.querySelectorAll('.pro-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            window.openCart();
        });
    });

    // ✅ تحديث أولي
    updateTotal();

})();



/* =========================================================
   READ QUANTITY FROM URL — sproduct.html
========================================================= */
(function readQuantityFromURL() {

    const urlParams = new URLSearchParams(window.location.search);
    const quantity = urlParams.get('quantity');

    if (!quantity) return;

    // ✅ ابحث عن حقل الكمية في الاستمارة
    const qtyInputs = document.querySelectorAll('input[name="quantity"]');
    if (qtyInputs.length === 0) return;

    // ✅ اختر الكمية المناسبة
    qtyInputs.forEach(input => {
        if (input.value === quantity) {
            input.checked = true;
        }
    });

    // ✅ سكرول لاستمارة الطلب بعد ثانية
    setTimeout(() => {
        const orderForm = document.getElementById('order-form');
        if (orderForm) {
            orderForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 500);

})();




/* =========================================================
   ORDER SUMMARY — حساب الإجمالي + التحقق من المكتب
========================================================= */
(function initOrderSummary() {

    const wilayaSelect = document.getElementById('wilaya');
    const productPriceEl = document.getElementById('summaryProduct');
    const deliveryPriceEl = document.getElementById('summaryDelivery');
    const totalEl = document.getElementById('summaryTotal');

    if (!wilayaSelect || !totalEl) return;

    // ✅ الولايات التي لا يوجد فيها مكتب
    const NO_OFFICE_WILAYAS = [
        "33", "37", "50", "54", "56", "59", "60",
        "61", "62", "63", "64", "65", "66", "67", "68", "69"
    ];

    function updateSummary() {
        // 1) سعر المنتج
        const qtySelected = document.querySelector('input[name="quantity"]:checked');
        const productPrice = qtySelected ? parseInt(qtySelected.dataset.price, 10) : 2900;

        // 2) نوع التوصيل
        const deliveryTypeEl = document.querySelector('input[name="deliveryType"]:checked');
        const deliveryType = deliveryTypeEl ? deliveryTypeEl.value : 'home';

        // 3) سعر التوصيل
        const wilayaCode = wilayaSelect.value;
        let deliveryPrice = 0;

        if (wilayaCode) {
            if (deliveryType === 'office') {
                deliveryPrice = DELIVERY_OFFICE[wilayaCode] || 0;
            } else {
                deliveryPrice = DELIVERY_HOME[wilayaCode] || 0;
            }
        }

        // 4) الإجمالي
        const total = productPrice + deliveryPrice;

        // 5) تحديث العرض
        if (productPriceEl) {
            productPriceEl.textContent = productPrice.toLocaleString('ar-DZ') + ' دج';
        }

        if (deliveryPriceEl) {
            if (wilayaCode) {
                deliveryPriceEl.textContent = deliveryPrice.toLocaleString('ar-DZ') + ' دج';
                deliveryPriceEl.style.color = '#00A878';
            } else {
                deliveryPriceEl.textContent = 'اختر الولاية';
                deliveryPriceEl.style.color = '#999';
            }
        }

        if (totalEl) {
            if (wilayaCode) {
                totalEl.textContent = total.toLocaleString('ar-DZ') + ' دج';
            } else {
                totalEl.textContent = '-- دج';
            }
        }
    }

    // ✅ دالة التحقق من المكتب
   // ✅ دالة التحقق من المكتب
function checkOfficeAvailability() {
    const wilayaCode = wilayaSelect.value;
    const officeOption = document.querySelector('input[name="deliveryType"][value="office"]');
    const homeOption = document.querySelector('input[name="deliveryType"][value="home"]');
    
    if (!officeOption || !homeOption) return;

    const officeLabel = officeOption.closest('.delivery-text-option');
    const homeLabel = homeOption.closest('.delivery-text-option');

    if (!wilayaCode) {
        // لم تُختر ولاية بعد — إظهار الكل + المكتب افتراضي
        if (officeLabel) officeLabel.style.display = '';
        officeOption.checked = true;
        return;
    }

    // ✅ إذا كانت الولاية بدون مكتب
    if (NO_OFFICE_WILAYAS.includes(wilayaCode)) {
        // إخفاء خيار المكتب
        if (officeLabel) {
            officeLabel.style.display = 'none';
        }
        
        // ✅ إجبار "المنزل" (الوحيد المتاح)
        homeOption.checked = true;
    } else {
        // ✅ إظهار خيار المكتب
        if (officeLabel) {
            officeLabel.style.display = '';
        }
        
        // ✅ إجبار "المكتب" كافتراضي
        officeOption.checked = true;
    }
}

    // ✅ الاستماع للتغييرات
    wilayaSelect.addEventListener('change', () => {
        checkOfficeAvailability();
        updateSummary();
    });

   // ✅ Event Delegation — يعمل مع الكميات المُضافة من Firebase
document.addEventListener('change', (e) => {
    if (e.target.name === 'quantity') {
        updateSummary();
    }
});

// ✅ اجعل الدالة عامة ليستدعيها Firebase
window.updateOrderSummary = updateSummary;

    document.querySelectorAll('input[name="deliveryType"]').forEach(input => {
        input.addEventListener('change', updateSummary);
    });

    // ✅ أول تحديث
    checkOfficeAvailability();
    updateSummary();
})();


/* =========================================================
   HEADER COMPACT — عند الاستمارة
========================================================= */
(function initHeaderCompact() {

    const header = document.getElementById('header');
    const orderForm = document.getElementById('order-form');

    if (!header || !orderForm) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                header.classList.add('compact');
            } else {
                header.classList.remove('compact');
            }
        });
    }, {
        threshold: 0.1
    });

    observer.observe(orderForm);

})();

/* =========================================================
   PREVENT ENTER SUBMIT — منع Enter من إرسال النموذج
========================================================= */
(function preventEnterSubmit() {

    const orderForm = document.querySelector('.order-form');
    if (!orderForm) return;

    orderForm.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    });

})();

/* =========================================================
   KEYBOARD DISMISS + SCROLL TO BUTTON
========================================================= */
(function keyboardDismiss() {

    const orderForm = document.querySelector('.order-form');
    if (!orderForm) return;

    // ✅ دالة موحّدة: إخفاء الكيبورد + سكرول للزر
    function dismissAndScroll() {
        // 1) أغلق الكيبورد
        if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
        }

        // 2) انتظر ثم اسكرول للزر
        setTimeout(() => {
            const submitBtn = document.querySelector('.confirm-order-btn');
            if (!submitBtn) return;
        
            const btnRect = submitBtn.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
        
            if (btnRect.bottom > viewportHeight - 100) {
                const scrollAmount = btnRect.bottom - viewportHeight + 40;
                window.scrollBy({
                    top: scrollAmount,
                    behavior: 'smooth'
                });
            }
        }, 300);
    }

    // ✅ 1. عند Enter في أي حقل
    orderForm.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            dismissAndScroll();
        }
    });

    // ✅ 2. Event Delegation — يعمل مع الكميات المُضافة من Firebase
    orderForm.addEventListener('click', (e) => {
        // الكمية
        if (e.target.closest('.qty-option')) {
            dismissAndScroll();
        }
        // التوصيل
        if (e.target.closest('.delivery-text-option')) {
            dismissAndScroll();
        }
    });

})();

/* =========================================================
   RESET BUTTON ON BACK — إعادة تعيين الزر عند الرجوع
========================================================= */
(function resetButtonOnBack() {

    // ✅ عند استعادة الصفحة (زر الرجوع / bfcache)
    window.addEventListener('pageshow', (e) => {

        // إذا كانت الصفحة مستعادة من الكاش
        if (e.persisted) {
            
            // ✅ 1. إعادة الزر لحالته الطبيعية
            const submitBtn = document.querySelector('.confirm-order-btn');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                submitBtn.innerHTML = 'تأكيد الطلب';
            }

            // ✅ 2. تفريغ النموذج (اختياري)
            // const orderForm = document.querySelector('.order-form');
            // if (orderForm) orderForm.reset();
        }
    });

    // ✅ أيضاً عند تحميل الصفحة من الصفر (احتياط)
    window.addEventListener('load', () => {
        const submitBtn = document.querySelector('.confirm-order-btn');
        if (submitBtn && submitBtn.classList.contains('loading')) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = 'تأكيد الطلب';
        }
    });

})();


/* =========================================================
   حماية بسيطة — تمنع المبتدئين من DevTools
========================================================= */
(function basicDevToolsBlock() {

    // ✅ منع كليك يمين
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    // ✅ منع F12 و Ctrl+Shift+I و Ctrl+U
    document.addEventListener('keydown', (e) => {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
            (e.ctrlKey && e.key === 'U')
        ) {
            e.preventDefault();
            return false;
        }
    });

})();