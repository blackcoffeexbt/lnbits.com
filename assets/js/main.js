(function () {
  "use strict";

  // ======= Sticky
  window.onscroll = function () {
    const ud_header = document.querySelector(".ud-header");
    if (!ud_header) {
      return;
    }
    const sticky = ud_header.offsetTop;
    const logo = document.querySelector(".navbar-brand img");

    if (window.pageYOffset > sticky) {
      ud_header.classList.add("sticky");
    } else {
      ud_header.classList.remove("sticky");
    }

    // === logo change
    if (logo && ud_header.classList.contains("sticky")) {
      logo.src = "assets/images/logo/logo-2.svg";
    } else if (logo) {
      logo.src = "assets/images/logo/logo.svg";
    }

    // show or hide the back-top-top button
    const backToTop = document.querySelector(".back-to-top");
    if (!backToTop) {
      return;
    }
    if (
      document.body.scrollTop > 50 ||
      document.documentElement.scrollTop > 50
    ) {
      backToTop.style.display = "flex";
    } else {
      backToTop.style.display = "none";
    }
  };

  //===== mobile menu
  function getNavbarElements() {
    return {
      navbarToggler: document.querySelector(".navbar-toggler"),
      navbarCollapse: document.querySelector(".navbar-collapse"),
    };
  }

  function setNavbarState(isOpen) {
    const { navbarToggler, navbarCollapse } = getNavbarElements();

    if (navbarToggler) {
      if (isOpen) {
        navbarToggler.classList.add("active");
      } else {
        navbarToggler.classList.remove("active");
      }
      navbarToggler.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
    if (navbarCollapse) {
      if (isOpen) {
        navbarCollapse.classList.add("show");
      } else {
        navbarCollapse.classList.remove("show");
      }
    }
    if (isOpen) {
      document.body.classList.add("ln-menu-open");
    } else {
      document.body.classList.remove("ln-menu-open");
    }
  }

  window.toggleLnbitsMenu = function (event) {
    const { navbarCollapse } = getNavbarElements();

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (!navbarCollapse) {
      return;
    }
    const isOpen = !navbarCollapse.classList.contains("show");
    setNavbarState(isOpen);
  };

  window.closeLnbitsMenu = function () {
    setNavbarState(false);
  };

  document.querySelectorAll(".ud-menu-scroll").forEach((link) =>
    link.addEventListener("click", () => {
      setNavbarState(false);
    })
  );

  document.addEventListener("click", (event) => {
    const { navbarToggler, navbarCollapse } = getNavbarElements();

    if (!navbarToggler || !navbarCollapse) {
      return;
    }

    if (event.target.closest(".navbar-toggler")) {
      return;
    }

    if (
      navbarCollapse.classList.contains("show") &&
      !navbarToggler.contains(event.target) &&
      !navbarCollapse.contains(event.target)
    ) {
      setNavbarState(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    const { navbarCollapse } = getNavbarElements();

    if (event.key === "Escape" && navbarCollapse?.classList.contains("show")) {
      setNavbarState(false);
    }
  });

  // ===== submenu
  const submenuButton = document.querySelectorAll(".nav-item-has-children");
  submenuButton.forEach((elem) => {
    elem.querySelector("a").addEventListener("click", () => {
      elem.querySelector(".ud-submenu").classList.toggle("show");
    });
  });

  // ====== scroll top js
  function scrollTo(element, to = 0, duration = 500) {
    const start = element.scrollTop;
    const change = to - start;
    const increment = 20;
    let currentTime = 0;

    const animateScroll = () => {
      currentTime += increment;

      const val = Math.easeInOutQuad(currentTime, start, change, duration);

      element.scrollTop = val;

      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };

    animateScroll();
  }

  Math.easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  const backToTopButton = document.querySelector(".back-to-top");
  if (backToTopButton) {
    backToTopButton.onclick = () => {
      scrollTo(document.documentElement);
    };
  }

})();

  /// Lightning stuff
const width = 2000;
const height = 600;

const maxTimeBetweenLightning = 30;
const maxLightningPaths = 200;
const maxLightningThickness = 5;
const startingDistance = 50;
const maxBranches = 7;

function makeLightning(ctx, startingX, startingY, branches) {
    ctx.beginPath();
    const amntOfPaths = getRandomInt(maxLightningPaths);
    let lightningThickness = maxLightningThickness;
    let distance = startingDistance;
    let timeout = 80;
    let speed = timeout;
    let totalTime = 0;
    for (let i = 0; i < amntOfPaths; i++) {
        ctx.strokeStyle = `rgb(255, 30, 230)`;
        ctx.lineWidth = getRandomInt(lightningThickness);
        lightningThickness /= 1.2;
        setTimeout(() => {
            ctx.moveTo(startingX, startingY);
            let endingX = getRandomInt(distance) * negOrPos() + startingX;
            let endingY =  startingY + getRandomInt(distance * 2);
            distance /= 1.1;
            ctx.lineTo(endingX, endingY);
            startingX = endingX;
            startingY = endingY;
            ctx.stroke();
            if (branches < maxBranches && getRandomInt(maxLightningPaths / 6) == 1) {
                let time = makeLightning(ctx, startingX, startingY, branches + 1);
                totalTime += time;
            }
        }, timeout);
        speed /= 1.4;
        timeout += speed;
    }
    return timeout + totalTime;
}

function negOrPos() {
    return Math.round(Math.random()) == 0 ? -1 : 1;
}

function getRandomInt(max) {
    return Math.ceil(Math.random() * max);
}

let prevHighestId = 0;

function createCanvasAndLightning() {
    const canvas = document.createElement('canvas');
    const body = document.getElementById("home");
    canvas.setAttribute('width', '5000px');
    canvas.setAttribute('height', '2000px');
    canvas.className = 'myCanvas';
    ctx = canvas.getContext("2d");
    body.appendChild(canvas);
    const time = makeLightning(ctx, getRandomInt(width), getRandomInt(height / 3), 0);
   // canvas.style.animationName = 'flash';
    canvas.style.animationDuration = time + "ms";
    setTimeout(() => {
        canvas.style.animationName = 'fadeOut';
    }, time);
    setTimeout(() => {
        canvas.remove();
        const highestId = window.setTimeout(() => {
            for (let i = highestId; i >= prevHighestId; i--) {
              window.clearTimeout(i);
            }
            prevHighestId = highestId;
            setTimeout(createCanvasAndLightning, 2000);
        }, 0);
    }, time * 2);
}
// turned off lightning bolts as its breaking saas
//createCanvasAndLightning();
