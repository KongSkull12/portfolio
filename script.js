/* ============================================================
   DOM REFERENCES
   ============================================================ */
const menuBtn         = document.querySelector("#menu-btn");
const nav             = document.querySelector("#site-nav");
const navLinks        = document.querySelectorAll("#site-nav a");
const sections        = document.querySelectorAll("main section[id]");
const header          = document.querySelector("#site-header");
const year            = document.querySelector("#year");
const revealItems     = document.querySelectorAll(".reveal");
const topBtn          = document.querySelector("#scroll-top");
const form            = document.querySelector("#contact-form");
const statusEl        = document.querySelector("#form-status");
const sendBtn         = document.querySelector("#send-btn");
const certToggle      = document.querySelector("#cert-toggle");
const certModal       = document.querySelector("#cert-modal");
const certModalClose  = document.querySelector("#cert-modal-close");
const lightbox        = document.querySelector("#certificate-lightbox");
const lightboxImage   = document.querySelector("#lightbox-image");
const lightboxClose   = document.querySelector("#lightbox-close");
const progressBar     = document.querySelector("#page-progress");
const typedText       = document.querySelector("#typed-text");

/* ============================================================
   MOBILE MENU
   ============================================================ */
const closeMenu = () => {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
};

menuBtn?.addEventListener("click", () => {
    const opened = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(opened));
    menuBtn.innerHTML = opened
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("resize", () => {
    if (window.innerWidth > 920) closeMenu();
});

/* ============================================================
   ACTIVE NAV ON SCROLL
   ============================================================ */
const setActiveNav = () => {
    const position = window.scrollY + 150;
    let active = "home";

    sections.forEach((section) => {
        if (position >= section.offsetTop) active = section.id;
    });

    navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${active}`);
    });
};

/* ============================================================
   HEADER SCROLL STATE + SCROLL-TO-TOP + PROGRESS BAR
   ============================================================ */
const handleWindowUI = () => {
    const scrolled = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    header.classList.toggle("scrolled", scrolled > 10);
    topBtn.classList.toggle("show", scrolled > 450);

    if (progressBar && docHeight > 0) {
        progressBar.style.width = ((scrolled / docHeight) * 100).toFixed(2) + "%";
    }
};

window.addEventListener("scroll", () => {
    setActiveNav();
    handleWindowUI();
}, { passive: true });

/* ============================================================
   SCROLL-TO-TOP BUTTON
   ============================================================ */
topBtn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ============================================================
   REVEAL ON SCROLL (IntersectionObserver)
   Also triggers skill bar animations when skill cards are revealed
   ============================================================ */
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");

                // Animate skill bars inside the revealed card
                const bars = entry.target.querySelectorAll(".bar-fill[data-width]");
                bars.forEach((bar, i) => {
                    setTimeout(() => {
                        bar.style.width = bar.dataset.width + "%";
                    }, i * 160);
                });

                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

/* ============================================================
   CERTIFICATE MODAL — OPEN / CLOSE
   ============================================================ */
const openCertModal = () => {
    certModal.classList.add("open");
    certModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    certModalClose?.focus();
};

const closeCertModal = () => {
    certModal.classList.remove("open");
    certModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    certToggle?.focus();
};

certToggle?.addEventListener("click", openCertModal);
certModalClose?.addEventListener("click", closeCertModal);

// Click backdrop (outside the panel) to close
certModal?.addEventListener("click", (event) => {
    if (event.target === certModal) closeCertModal();
});

// Open lightbox when clicking cert image OR "View full image" button inside the modal
const openLightboxFrom = (src, alt) => {
    if (!src) return;
    lightboxImage.src = src;
    lightboxImage.alt = alt || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
};

certModal?.addEventListener("click", (event) => {
    // "View full image" button
    const btn = event.target.closest(".btn-view-full");
    if (btn) {
        openLightboxFrom(btn.dataset.src, btn.dataset.alt);
        return;
    }

    // Clicking the certificate image itself
    const img = event.target.closest(".cert-card-img img");
    if (img) {
        // Find the corresponding btn-view-full in the same card to get the data
        const card = img.closest(".cert-card");
        const viewBtn = card?.querySelector(".btn-view-full");
        openLightboxFrom(
            viewBtn?.dataset.src || img.src,
            viewBtn?.dataset.alt || img.alt
        );
    }
});

/* ============================================================
   CERTIFICATE LIGHTBOX
   ============================================================ */
const closeLightbox = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    lightboxImage.alt = "";
    // If cert modal is open, keep body scroll locked
    if (!certModal?.classList.contains("open")) {
        document.body.style.overflow = "";
    }
};

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
});

/* ============================================================
   KEYBOARD SHORTCUTS
   ============================================================ */
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        if (lightbox?.classList.contains("open")) {
            closeLightbox();
            return;
        }
        if (certModal?.classList.contains("open")) {
            closeCertModal();
            return;
        }
        closeMenu();
    }
});

/* ============================================================
   TYPING ANIMATION (hero)
   ============================================================ */
if (typedText) {
    const roles = [
        "Full-Stack Developer",
        "Web Developer",
        "PHP Developer",
        "Mobile Developer",
    ];
    let roleIndex  = 0;
    let charIndex  = 0;
    let isDeleting = false;

    const typeLoop = () => {
        const current = roles[roleIndex];

        if (isDeleting) {
            typedText.textContent = current.slice(0, charIndex - 1);
            charIndex--;
        } else {
            typedText.textContent = current.slice(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === current.length) {
            isDeleting = true;
            setTimeout(typeLoop, 1800);
            return;
        }

        if (isDeleting && charIndex === 0) {
            isDeleting  = false;
            roleIndex   = (roleIndex + 1) % roles.length;
            setTimeout(typeLoop, 400);
            return;
        }

        setTimeout(typeLoop, isDeleting ? 55 : 95);
    };

    setTimeout(typeLoop, 800);
}

/* ============================================================
   PROJECT CAROUSEL
   ============================================================ */
(function () {
    const track    = document.getElementById("carousel-track");
    const prevBtn  = document.getElementById("proj-prev");
    const nextBtn  = document.getElementById("proj-next");
    const dotsWrap = document.getElementById("carousel-dots");

    if (!track || !prevBtn || !nextBtn || !dotsWrap) return;

    const slides = Array.from(track.querySelectorAll(".carousel-slide"));
    let current  = 0;
    let autoTimer;

    // Build dots
    slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.className = "carousel-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", "Project " + (i + 1));
        dot.addEventListener("click", () => goTo(i));
        dotsWrap.appendChild(dot);
    });

    const dots = Array.from(dotsWrap.querySelectorAll(".carousel-dot"));

    const goTo = (index) => {
        current = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle("active", i === current));
        prevBtn.disabled = false;
        nextBtn.disabled = false;
        resetAuto();
    };

    prevBtn.addEventListener("click", () => goTo(current - 1));
    nextBtn.addEventListener("click", () => goTo(current + 1));

    // Keyboard arrow support when focused on the carousel
    document.getElementById("project-carousel")?.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft")  goTo(current - 1);
        if (e.key === "ArrowRight") goTo(current + 1);
    });

    // Touch / swipe support
    let touchStartX = 0;
    track.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend",   (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    }, { passive: true });

    // Auto-advance every 5 s
    const resetAuto = () => {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => goTo(current + 1), 5000);
    };
    resetAuto();
})();

/* ============================================================
   CONTACT FORM SUBMISSION
   ============================================================ */
form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    statusEl.className = "status";
    statusEl.textContent = "Sending your message…";
    sendBtn.disabled = true;

    try {
        const response = await fetch(form.action, {
            method: "POST",
            body: new FormData(form),
        });

        if (!response.ok) throw new Error("Request failed");

        form.reset();
        statusEl.classList.add("ok");
        statusEl.textContent = "Message sent successfully. Thank you!";
    } catch {
        statusEl.classList.add("err");
        statusEl.textContent = "Failed to send message. Please try again.";
    } finally {
        sendBtn.disabled = false;
    }
});

/* ============================================================
   INIT
   ============================================================ */
year.textContent = new Date().getFullYear();
setActiveNav();
handleWindowUI();
