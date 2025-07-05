/*==================== MAIN WEBSITE JAVASCRIPT ====================*/

/*==================== SHOW MENU ====================*/
const navMenu = document.querySelector("#nav-menu"),
  navToggle = document.querySelector("#nav-toggle"),
  navClose = document.querySelector("#nav-close");

/*===== MENU SHOW =====*/
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
  })
}

/*===== MENU HIDDEN =====*/
if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  })
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll(".nav__link");

function linkAction() {
  const navMenu = document.querySelector("#nav-menu");
  navMenu.classList.remove("show-menu");
}
navLink.forEach((n) => n.addEventListener("click", linkAction));

/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader() {
  const nav = document.querySelector("#header");
  if (window.scrollY >= 80) nav.classList.add("scroll-header");
  else nav.classList.remove("scroll-header");
}
window.addEventListener("scroll", scrollHeader);

/*==================== SHOW SCROLL UP ====================*/
function scrollUp() {
  const scrollUp = document.querySelector("#scroll-up");
  if (window.scrollY >= 560) scrollUp.classList.add("show-scroll");
  else scrollUp.classList.remove("show-scroll");
}
window.addEventListener("scroll", scrollUp);

// Scroll to top when clicked
const scrollUpBtn = document.querySelector("#scroll-up")
if (scrollUpBtn) {
  scrollUpBtn.addEventListener("click", (e) => {
    e.preventDefault()
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })
}

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll("section[id]");

function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 50;
    const sectionId = current.getAttribute("id");

    const navLinkElement = document.querySelector(".nav__menu a[href*=" + sectionId + "]");

    if (navLinkElement) {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinkElement.classList.add("active-link");
      } else {
        navLinkElement.classList.remove("active-link");
      }
    }
  })
}
window.addEventListener("scroll", scrollActive);

/*==================== SMOOTH SCROLLING ====================*/
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  })
})

/*==================== SCROLL REVEAL ANIMATION ====================*/
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  })
}, observerOptions)

// Observe elements for animation
document.querySelectorAll(".service__card, .stat__card, .about__feature").forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(30px)";
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(el);
})

/*==================== INITIALIZE APP ====================*/
document.addEventListener("DOMContentLoaded", () => {
//   Initialize scroll effects
  scrollHeader();
  scrollUp();
  scrollActive();

  // Add loading class to body initially
  document.body.classList.add("loaded");

  console.log("MediMind website initialized successfully!");
})

/*==================== UTILITY FUNCTIONS ====================*/
// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    }
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  }
}

// Use debounced scroll functions for better performance
window.addEventListener(
  "scroll",
  debounce(() => {
    scrollHeader();
    scrollUp();
    scrollActive();
  }, 10),
)

