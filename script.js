const menuBtn = document.querySelector("#menu-btn");
const nav = document.querySelector("#site-nav");
const navLinks = document.querySelectorAll("#site-nav a");
const sections = document.querySelectorAll("main section[id]");
const header = document.querySelector("#site-header");
const year = document.querySelector("#year");
const revealItems = document.querySelectorAll(".reveal");
const topBtn = document.querySelector("#scroll-top");
const form = document.querySelector("#contact-form");
const statusEl = document.querySelector("#form-status");
const sendBtn = document.querySelector("#send-btn");
const certToggle = document.querySelector("#cert-toggle");
const certificateGrid = document.querySelector("#certificate-grid");
const lightbox = document.querySelector("#certificate-lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxClose = document.querySelector("#lightbox-close");

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

navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
});

const setActiveNav = () => {
    const position = window.scrollY + 140;
    let active = "home";

    sections.forEach((section) => {
        if (position >= section.offsetTop) {
            active = section.id;
        }
    });

    navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${active}`);
    });
};

const handleWindowUI = () => {
    header.classList.toggle("scrolled", window.scrollY > 10);
    topBtn.classList.toggle("show", window.scrollY > 450);
};

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.2 }
);

revealItems.forEach((item) => revealObserver.observe(item));

window.addEventListener("scroll", () => {
    setActiveNav();
    handleWindowUI();
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 920) {
        closeMenu();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        if (lightbox?.classList.contains("open")) {
            closeLightbox();
            return;
        }
        closeMenu();
    }
});

topBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

certToggle?.addEventListener("click", () => {
    const open = certificateGrid.classList.toggle("open");
    certToggle.setAttribute("aria-expanded", String(open));
    certToggle.textContent = open ? "Hide Certificates" : "View Certificates";

    if (open) {
        certificateGrid.querySelectorAll(".reveal").forEach((item) => {
            revealObserver.observe(item);
        });
    }
});

const closeLightbox = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    lightboxImage.alt = "";
    document.body.style.overflow = "";
};

certificateGrid?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLImageElement)) {
        return;
    }

    lightboxImage.src = target.src;
    lightboxImage.alt = target.alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
});

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    statusEl.className = "status";
    statusEl.textContent = "Sending your message...";
    sendBtn.disabled = true;

    try {
        const response = await fetch(form.action, {
            method: "POST",
            body: new FormData(form)
        });

        if (!response.ok) {
            throw new Error("Request failed");
        }

        form.reset();
        statusEl.classList.add("ok");
        statusEl.textContent = "Message sent successfully. Thank you!";
    } catch (error) {
        statusEl.classList.add("err");
        statusEl.textContent = "Failed to send message. Please try again.";
    } finally {
        sendBtn.disabled = false;
    }
});

year.textContent = new Date().getFullYear();
setActiveNav();
handleWindowUI();
