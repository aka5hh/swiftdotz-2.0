const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", (e) => {
  navLinks.classList.toggle("open");

  const isopen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isopen ? "ri-close-line" : "ri-menu-line")
});

navLinks.addEventListener("click", (e) => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line")
})

const scrollRevealOption = {
  origin: "bottom",
  distance: "50px",
  duration: 1000,
};

// Correct way to use ScrollReveal:
ScrollReveal().reveal(".header__image img", {
  ...scrollRevealOption,
  origin: "right",
});

ScrollReveal().reveal(".header__content p", {
  ...scrollRevealOption,
  delay: 500,
});

ScrollReveal().reveal(".header__content h1", {
  ...scrollRevealOption,
  delay: 1000,
});

ScrollReveal().reveal(".header__btns", {
  ...scrollRevealOption,
  delay: 1500,
});

ScrollReveal().reveal(".destination__card", {
  ...scrollRevealOption,
  interval: 500,
});

ScrollReveal().reveal(".showcase__image img", {
  ...scrollRevealOption,
  origin: "left",
});

ScrollReveal().reveal(".showcase__content h4", {
  ...scrollRevealOption,
  delay: 500,
});

ScrollReveal().reveal(".showcase__content p", {
  ...scrollRevealOption,
  delay: 1000,
});

ScrollReveal().reveal(".showcase__btn", {
  ...scrollRevealOption,
  delay: 1500,
});

ScrollReveal().reveal(".banner__card", {
  ...scrollRevealOption,
  interval: 500,
});

ScrollReveal().reveal(".discover__card", {
  ...scrollRevealOption,
  interval: 500,
});


const swiper = new Swiper(".swiper", {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

// ── Who We Are animated button ───────────────────────────────
document.querySelectorAll(".button").forEach((button) => {
  let duration = 3000,
    svg = button.querySelector("svg"),
    svgPath = new Proxy(
      { y: null, smoothing: null },
      {
        set(target, key, value) {
          target[key] = value;
          if (target.y !== null && target.smoothing !== null) {
            svg.innerHTML = getPath(target.y, target.smoothing, null);
          }
          return true;
        },
        get(target, key) { return target[key]; },
      }
    );

  button.style.setProperty("--duration", duration);
  svgPath.y = 20;
  svgPath.smoothing = 0;

  button.addEventListener("click", (e) => {
    e.preventDefault();
    if (!button.classList.contains("loading")) {
      button.classList.add("loading");

      gsap.to(svgPath, {
        smoothing: 0.3,
        duration: (duration * 0.065) / 1000,
      });
      gsap.to(svgPath, {
        y: 12,
        duration: (duration * 0.265) / 1000,
        delay: (duration * 0.065) / 1000,
        ease: "elastic.out(1.12, 0.4)",
      });

      setTimeout(() => {
        svg.innerHTML = getPath(0, 0, [[3, 14], [8, 19], [21, 6]]);
        // navigate after checkmark
        setTimeout(() => {
          window.location.hash = "#contact";
          button.classList.remove("loading");
          svgPath.y = 20;
          svgPath.smoothing = 0;
        }, 800);
      }, duration / 2);
    }
  });
});

function getPoint(point, i, a, smoothing) {
  let cp = (current, previous, next, reverse) => {
    let p = previous || current,
      n = next || current,
      o = {
        length: Math.sqrt(Math.pow(n[0] - p[0], 2) + Math.pow(n[1] - p[1], 2)),
        angle: Math.atan2(n[1] - p[1], n[0] - p[0]),
      },
      angle = o.angle + (reverse ? Math.PI : 0),
      length = o.length * smoothing;
    return [current[0] + Math.cos(angle) * length, current[1] + Math.sin(angle) * length];
  },
    cps = cp(a[i - 1], a[i - 2], point, false),
    cpe = cp(point, a[i - 1], a[i + 1], true);
  return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`;
}

function getPath(update, smoothing, pointsNew) {
  let points = pointsNew
    ? pointsNew
    : [[4, 12], [12, update], [20, 12]],
    d = points.reduce(
      (acc, point, i, a) =>
        i === 0 ? `M ${point[0]},${point[1]}` : `${acc} ${getPoint(point, i, a, smoothing)}`,
      ""
    );
  return `<path d="${d}" />`;
}