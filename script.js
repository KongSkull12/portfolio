<<<<<<< HEAD
const menuButton = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".navbar a");
const header = document.querySelector("#header");
const sections = document.querySelectorAll("main section[id]");
const yearElement = document.querySelector("#year");
const revealElements = document.querySelectorAll(".reveal");
const form = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

const closeMenu = () => {
    navbar.classList.remove("active");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';
};

menuButton?.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    navbar.classList.toggle("active");
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
    header.classList.toggle("scrolled", window.scrollY > 8);
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

yearElement.textContent = new Date().getFullYear();
setActiveLink();
handleHeaderStyle();

form?.addEventListener("submit", () => {
    formStatus.textContent = "Sending your message...";
});
=======
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}
>>>>>>> 24527ad30b33c964ab4a24879ada9285a0eecbc1
