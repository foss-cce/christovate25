const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav-toggle");
const menu = document.querySelector(".nav-menu");
let open = false;

function setNavHeightVar() {
  const h = nav.getBoundingClientRect().height;
  document.documentElement.style.setProperty("--nav-height", h + "px");
}

function applyScrollState() {
  const scrolled = window.scrollY > 6;
  if (scrolled) {
    nav.classList.add("nav--scrolled");
  } else {
    nav.classList.remove("nav--scrolled");
  }
  document.documentElement.style.setProperty(
    "--nav-offset",
    scrolled ? "6px" : "0px"
  );
  setNavHeightVar();
}

window.addEventListener(
  "scroll",
  function () {
    window.requestAnimationFrame(applyScrollState);
  },
  { passive: true }
);
window.addEventListener("resize", function () {
  window.requestAnimationFrame(setNavHeightVar);
});
applyScrollState();

toggle.addEventListener("click", function () {
  open = !open;
  menu.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
});

document.addEventListener("click", function (e) {
  if (!menu.contains(e.target) && !toggle.contains(e.target)) {
    if (open) {
      open = false;
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && open) {
    open = false;
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  }
});

// about page script

document.addEventListener("DOMContentLoaded", function () {
  const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running";

        if (entry.target.classList.contains("stat-item")) {
          animateCounter(entry.target.querySelector(".stat-number"));
        }
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(
    ".fade-in, .slide-up, .stat-item"
  );
  animatedElements.forEach((el) => {
    el.style.animationPlayState = "paused";
    observer.observe(el);
  });

  function animateCounter(element) {
    const target = parseInt(element.getAttribute("data-target"));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target + "+";
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  }

  const featureCards = document.querySelectorAll(".feature-card");
  featureCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-12px) rotateX(5deg) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) rotateX(0deg) scale(1)";
    });
  });

  const jigsawPieces = document.querySelectorAll(".jigsaw-piece");
  let hoverInterval;

  document
    .querySelector(".jigsaw-container")
    ?.addEventListener("mouseenter", function () {
      let index = 0;
      hoverInterval = setInterval(() => {
        jigsawPieces.forEach((piece) => {
          piece.style.transition = "transform 0.3s ease, opacity 0.3s ease";
          piece.style.transform = "scale(1)";
          piece.style.opacity = "1";
        });

        const currentPiece = jigsawPieces[index % jigsawPieces.length];
        currentPiece.style.transform = "scale(1.15) rotate(10deg)";
        currentPiece.style.opacity = "0.7";

        index++;
      }, 300);
    });

  document
    .querySelector(".jigsaw-container")
    ?.addEventListener("mouseleave", function () {
      clearInterval(hoverInterval);
      jigsawPieces.forEach((piece) => {
        piece.style.transform = "scale(1)";
        piece.style.opacity = "1";
      });
    });

  setupAdvancedParallax();

  function setupAdvancedParallax() {
    const parallaxElements = document.querySelectorAll(
      ".about-hero-section, .about-intro, .mission-section, .features-section, .stats-section,"
    );

    const updateParallax = () => {
      const scrolled = window.pageYOffset;

      parallaxElements.forEach((element) => {
        const elementTop = element.offsetTop;
        const elementHeight = element.offsetHeight;
        const windowHeight = window.innerHeight;
        const viewportStart = scrolled;
        const viewportEnd = scrolled + windowHeight;

        if (
          viewportEnd > elementTop &&
          viewportStart < elementTop + elementHeight
        ) {
          const elementVisible = Math.min(windowHeight, elementHeight);
          const elementProgress =
            (viewportEnd - elementTop) / (elementHeight + windowHeight);

          const parallaxEffect = (elementProgress - 0.5) * 30;

          element.style.transform = `translateY(${parallaxEffect}px)`;
        }
      });
    };

    window.addEventListener("scroll", updateParallax, { passive: true });
    updateParallax();
  }

  setupMouseParallax3D();

  function setupMouseParallax3D() {
    const jigsaw = document.querySelector(".jigsaw");
    const jigsawContainer = document.querySelector(".jigsaw-container");

    if (jigsaw && jigsawContainer) {
      let mouseX = 0;
      let mouseY = 0;

      document.addEventListener("mousemove", (e) => {
        const containerRect = jigsawContainer.getBoundingClientRect();
        const containerCenterX = containerRect.left + containerRect.width / 2;
        const containerCenterY = containerRect.top + containerRect.height / 2;

        mouseX = (e.clientX - containerCenterX) * 0.015;
        mouseY = (e.clientY - containerCenterY) * 0.015;

        jigsaw.style.transform = `rotateX(${-mouseY}deg) rotateY(${mouseX}deg) perspective(1000px)`;
      });
    }
  }

  initScrollRevealAnimations();

  function initScrollRevealAnimations() {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );

    document
      .querySelectorAll(".feature-card, .stat-item, .intro-text")
      .forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "all 0.8s ease-out";
        revealObserver.observe(el);
      });
  }

  setupTextAnimations();

  function setupTextAnimations() {
    const headings = document.querySelectorAll("h1, h2, h3");

    headings.forEach((heading) => {
      const text = heading.textContent;
      heading.innerHTML = "";

      text.split("").forEach((char, index) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.cssText = `
                    display: inline-block;
                    opacity: 0;
                    animation: charReveal 0.6s ease-out forwards;
                    animation-delay: ${index * 0.05}s;
                `;
        heading.appendChild(span);
      });
    });

    const charRevealStyle = document.createElement("style");
    charRevealStyle.textContent = `
            @keyframes charReveal {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
    document.head.appendChild(charRevealStyle);
  }

  setupSectionParallax();

  function setupSectionParallax() {
    const sections = document.querySelectorAll('[class$="-section"]');
    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  setupDynamicGradient();

  function setupDynamicGradient() {
    const gradientStyle = document.createElement("style");
    gradientStyle.textContent = `
            .in-view {
                animation: sectionSlideIn 0.8s ease-out;
            }
            @keyframes sectionSlideIn {
                from {
                    opacity: 0.95;
                }
                to {
                    opacity: 1;
                }
            }
        `;
    document.head.appendChild(gradientStyle);
  }

  setupScrollPercentageTracker();

  function setupScrollPercentageTracker() {
    window.addEventListener(
      "scroll",
      () => {
        const scrollTop = window.pageYOffset;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        document.documentElement.style.setProperty(
          "--scroll-percent",
          scrollPercent + "%"
        );
      },
      { passive: true }
    );
  }

  setupParticleBackground();

  function setupParticleBackground() {
    const heroSection = document.querySelector(".about-hero-section");
    if (!heroSection) return;

    const particleCount = 20;
    const particleContainer = document.createElement("div");
    particleContainer.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 0;
        `;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      const size = Math.random() * 3 + 1;
      const duration = Math.random() * 10 + 5;
      const delay = Math.random() * 2;

      particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatParticle ${duration}s infinite ease-in-out;
                animation-delay: ${delay}s;
            `;

      particleContainer.appendChild(particle);
    }

    heroSection.insertBefore(particleContainer, heroSection.firstChild);

    const floatStyle = document.createElement("style");
    floatStyle.textContent = `
            @keyframes floatParticle {
                0%, 100% {
                    transform: translateY(0) translateX(0);
                    opacity: 0.3;
                }
                25% {
                    transform: translateY(-30px) translateX(20px);
                    opacity: 0.8;
                }
                50% {
                    transform: translateY(-60px) translateX(-20px);
                    opacity: 0.5;
                }
                75% {
                    transform: translateY(-30px) translateX(30px);
                    opacity: 0.7;
                }
            }
        `;
    document.head.appendChild(floatStyle);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = "none";
          setTimeout(() => {
            entry.target.style.animation = "";
          }, 10);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document
    .querySelectorAll(
      ".info-box, .included-item, .registration-status-card, .selected-teams-box"
    )
    .forEach((el) => {
      observer.observe(el);
    });
});

// document.addEventListener("DOMContentLoaded", () => {
//     gsap.registerPlugin(ScrollTrigger);

//     const lenis = new Lenis();
//     lenis.on("scroll", ScrollTrigger.update);
//     gsap.ticker.add((time) => {
//         lenis.raf(time * 1000);

//     });
//     gsap.ticker.lagSmoothing(0);

const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
const getNavHeight = () => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(
    "--nav-height"
  );
  const h = parseFloat(v) || 0;
  return h;
};
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    const target = href;
    e.preventDefault();
    const offset = -getNavHeight();
    lenis.scrollTo(target, { offset });
    if (open) {
      open = false;
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
});

//event struture

//     const stickySection = document.querySelector(".steps");
//     const cards = document.querySelectorAll(".card");
//     const countContainer = document.querySelector(".count-container");
//     const totalCards = cards.length;

//     const enableDesktopSticky = () => window.innerWidth >= 900 && !!stickySection;

//     if (enableDesktopSticky()) {
//       const stickyHeight = window.innerHeight * 5.5;
//       ScrollTrigger.create({
//           trigger: stickySection,
//           start: "top top",
//           end: `+=${stickyHeight}px`,
//           pin: true,
//           pinSpacing: true,
//           onUpdate: (self) => {
//               positionCards(self.progress);
//           },
//       });
//     }

//     const getRadius = () => {
//         return window.innerWidth < 900
//         ? window.innerWidth * 7.5
//         : window.innerWidth * 2.5;
//     };

//     const arcAngle = Math.PI * 0.4;
//     const startAngle = Math.PI / 2 - arcAngle / 2;

//     function positionCards(progress = 0) {
//         const radius = getRadius();
//         const totalTravel = 1 + totalCards / 7.5;
//         const adjustedProgress = (progress * totalTravel - 1) * 0.75;

//         cards.forEach((card, i) => {
//             const normalizedProgress = (totalCards - 1 - i) / totalCards;
//             const cardProgress = normalizedProgress + adjustedProgress;
//             const angle = startAngle + arcAngle * cardProgress;

//             const x = Math.cos(angle) * radius;
//             const y = Math.sin(angle) * radius;
//             const rotation = (angle - Math.PI / 2) * (180 / Math.PI);

//             gsap.set(card, {
//                 x: x,
//                 y: -y + radius,
//                 rotation: -rotation,
//                 transformOrigin: "center center",
//             });
//         });
//     };

//     if (enableDesktopSticky()) {
//       positionCards(0);
//     }

//     let currentCardIndex = 0;

//     const options = {
//         root: null,
//         rootMargin: "0% 0%",
//         threshold: 0.25,
//     };

//     if (enableDesktopSticky()) {
//       const observer = new IntersectionObserver((entries) => {
//           entries.forEach((entry) => {
//               if(entry.isIntersecting) {
//                   lastScrollY = window.scrollY;

//                   let cardIndex = Array.from(cards).indexOf(entry.target);

//                   currentCardIndex = cardIndex;

//                   const targetY =  - currentCardIndex * 150;
//                   gsap.to(countContainer, {
//                       y: targetY,
//                       duration: 0.3,
//                       ease: "power1.out",
//                       overwrite: true,
//                   });

//               }
//           });
//       }, options);

//       cards.forEach((card) => {
//           observer.observe(card);
//       });

//       window.addEventListener("resize", () => {
//         if (enableDesktopSticky()) {
//           positionCards(0);
//         }
//       });
//     }
// });

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const stickySection = document.querySelector(".steps");
  const stickyHeight = window.innerHeight * 5.5;
  const cards = document.querySelectorAll(".card");
  const countContainer = document.querySelector(".count-container");
  const totalCards = cards.length;

  ScrollTrigger.create({
    trigger: stickySection,
    start: "top top",
    end: `+=${stickyHeight}px`,
    pin: true,
    pinSpacing: true,
    onUpdate: (self) => {
      positionCards(self.progress);
    },
  });

  const getRadius = () => {
    return window.innerWidth < 900
      ? window.innerWidth * 7.5
      : window.innerWidth * 2.5;
  };

  const arcAngle = Math.PI * 0.4;
  const startAngle = Math.PI / 2 - arcAngle / 2;

  function positionCards(progress = 0) {
    const radius = getRadius();
    const totalTravel = 1 + totalCards / 7.5;
    const adjustedProgress = (progress * totalTravel - 1) * 0.75;

    cards.forEach((card, i) => {
      const normalizedProgress = (totalCards - 1 - i) / totalCards;
      const cardProgress = normalizedProgress + adjustedProgress;
      const angle = startAngle + arcAngle * cardProgress;

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const rotation = (angle - Math.PI / 2) * (180 / Math.PI);

      gsap.set(card, {
        x: x,
        y: -y + radius,
        rotation: -rotation,
        transformOrigin: "center center",
      });
    });
  }

  positionCards(0);

  let currentCardIndex = 0;

  const options = {
    root: null,
    rootMargin: "0% 0%",
    threshold: 0.25,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        lastScrollY = window.scrollY;

        let cardIndex = Array.from(cards).indexOf(entry.target);

        currentCardIndex = cardIndex;

        const targetY = -currentCardIndex * 150;
        gsap.to(countContainer, {
          y: targetY,
          duration: 0.3,
          ease: "power1.out",
          overwrite: true,
        });
      }
    });
  }, options);

  cards.forEach((card) => {
    observer.observe(card);
  });

  window.addEventListener("resize", () => positionCards(0));
});

// domains

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".domain-card").forEach((card, i) => {
    setTimeout(() => card.classList.add("loaded"), i * 120);
  });
});

// Contact modal
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("contactModalOverlay");
  const triggers = [
    ...document.querySelectorAll(".contact-modal-trigger"),
    ...document.querySelectorAll(".contact-btn"),
  ];
  const closeBtn = overlay
    ? overlay.querySelector(".contact-modal-close")
    : null;

  const open = () => {
    if (overlay) overlay.classList.add("open");
  };
  const close = () => {
    if (overlay) overlay.classList.remove("open");
  };

  triggers.forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      open();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      close();
    });
  }

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        close();
      }
    });
  }
});




// guitar string in the upper side of domain gsap

var path = `M 10 200 Q 700 200 1390 200`

var finalPath = `M 10 200 Q 700 200 1390 200`

var string = document.querySelector('.line-wrapper')



string.addEventListener("mousemove", (dets) =>{
  var rect = string.getBoundingClientRect();
  console.log(dets.y);
  path = `M 10 200 Q ${dets.x - rect.x} ${dets.y - rect.y} 1390 200`
  console.log(rect.x, rect.y);

  gsap.to(".line-wrapper svg path", {
    attr : {d:path},
    duration: 0.3,
    ease: "power3.out"
  })
})

string.addEventListener("mouseleave", ()=>{
  gsap.to(".line-wrapper svg path", {
    attr:{d:finalPath},
    duration: 1.2,
    ease: "elastic.out(1,0.2)"
  })
})


gsap.from(".upper-section", {
  opacity: 0,
  y: 50,
  duration: 1,
  delay: .3
})
gsap.from(".lower-section", {
  opacity: 0,
  y: 50,
  duration: 1,
  delay: .3
})