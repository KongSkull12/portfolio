const menuButton = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".navbar a");
const header = document.querySelector("#header");
const sections = document.querySelectorAll("main section[id]");
const yearElement = document.querySelector("#year");
const revealElements = document.querySelectorAll(".reveal");
const form = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const sendBtn = document.querySelector("#send-btn");
const scrollTopButton = document.querySelector("#scroll-top");

const closeMenu = () => {
    if (!navbar || !menuButton) {
        return;
    }

    navbar.classList.remove("active");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';
};

menuButton?.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    navbar?.classList.toggle("active");
    menuButton.innerHTML = expanded
        ? '<i class="fa-solid fa-bars"></i>'
        : '<i class="fa-solid fa-xmark"></i>';
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        closeMenu();
    });
});

const setActiveLink = () => {
    const scrollOffset = window.scrollY + 140;
    let activeId = "";

    sections.forEach((section) => {
        if (scrollOffset >= section.offsetTop) {
            activeId = section.id;
        }
    });

    navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        link.classList.toggle("active", href === `#${activeId}`);
    });
};

const handleHeaderStyle = () => {
    header?.classList.toggle("scrolled", window.scrollY > 8);
    scrollTopButton?.classList.toggle("show", window.scrollY > 450);
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

revealElements.forEach((el) => revealObserver.observe(el));

window.addEventListener("scroll", () => {
    setActiveLink();
    handleHeaderStyle();
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
        closeMenu();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

scrollTopButton?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

yearElement.textContent = new Date().getFullYear();
setActiveLink();
handleHeaderStyle();

form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    formStatus.className = "form-status";
    formStatus.textContent = "Sending your message...";
    sendBtn.disabled = true;

    try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Failed to send");
        }

        form.reset();
        formStatus.classList.add("success");
        formStatus.textContent = "Message sent successfully. Thank you!";
    } catch (error) {
        formStatus.classList.add("error");
        formStatus.textContent = "Message failed to send. Please try again.";
    } finally {
        sendBtn.disabled = false;
    }
});
