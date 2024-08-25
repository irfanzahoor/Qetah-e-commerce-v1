function sidebarState() {
  return {
    isStatic: false,
    isHovered: false,
    toggleSidebar() {
      this.isStatic = !this.isStatic;
    },
    expandSidebar() {
      this.isHovered = true;
    },
    collapseSidebar() {
      this.isHovered = false;
    },
  };
}
// main js

function toggleMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  mobileMenu.classList.toggle("show");
}
document
  .querySelector(".navbar-toggler")
  .addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });
function closeMenuOnClickOutside(event) {
  const mobileMenu = document.getElementById("mobileMenu");
  const menuButton = document.querySelector(".navbar-toggler");
  if (
    !mobileMenu.contains(event.target) &&
    !menuButton.contains(event.target)
  ) {
    mobileMenu.classList.remove("show");
  }
}
document.addEventListener("click", closeMenuOnClickOutside);

// sidebar js

document.addEventListener("DOMContentLoaded", () => {
  function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("open");
    sidebar.style.display = sidebar.classList.contains("open")
      ? "block"
      : "none";
  }

  function closeSidebarOnClickOutside(event) {
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("toggleButton");

    if (
      !sidebar.contains(event.target) &&
      !toggleButton.contains(event.target)
    ) {
      sidebar.classList.remove("open");
      sidebar.style.display = "none";
    }
  }

  function updateSidebarBehavior() {
    const toggleButton = document.getElementById("toggleButton");
    const mediaQuery = window.matchMedia("(max-width: 1024px)");

    if (mediaQuery.matches) {
      toggleButton.addEventListener("click", handleSidebarToggle);
      document.addEventListener("click", closeSidebarOnClickOutside);
    } else {
      toggleButton.removeEventListener("click", handleSidebarToggle);
      document.removeEventListener("click", closeSidebarOnClickOutside);
      const sidebar = document.getElementById("sidebar");
      sidebar.style.display = "block";
      sidebar.classList.remove("open");
    }
  }
  function handleSidebarToggle(event) {
    event.stopPropagation();
    toggleSidebar();
  }
  updateSidebarBehavior();
  window.addEventListener("resize", updateSidebarBehavior);
});

// sideebar content js
document.addEventListener("DOMContentLoaded", function () {
  const toggler = document.querySelector(".sidebar-toggler");
  const sidebar = document.getElementById("sidebar");
  const contentArea = document.querySelector(".content-area");

  toggler.addEventListener("click", function (event) {
    event.stopPropagation();
    contentArea.classList.toggle("sidebar-area-content");
  });

  document.addEventListener("click", function (event) {
    if (
      !sidebar.contains(event.target) &&
      !toggler.contains(event.target)
    ) {
      contentArea.classList.remove("sidebar-area-content");
    }
  });
});
// ripple
function createRipple(event) {
  const button = event.target;
  const ripple = document.createElement("span");
  ripple.classList.add("ripple-effect");

  const rippleX = event.offsetX;
  const rippleY = event.offsetY;
  const rippleDiameter = Math.sqrt(
    button.offsetWidth * button.offsetWidth +
      button.offsetHeight * button.offsetHeight
  );

  ripple.style.top = `${rippleY - rippleDiameter / 2}px`;
  ripple.style.left = `${rippleX - rippleDiameter / 2}px`;
  ripple.style.width = `${rippleDiameter}px`;
  ripple.style.height = `${rippleDiameter}px`;

  button.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 500);
}

window.Alpine = {
  createRipple: createRipple,
};
      document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.btn.ripple').forEach(button => {
          button.addEventListener('click', function (e) {
            // Remove any existing ripple effect
            const existingRipple = this.querySelector('.ripple-effect');
            if (existingRipple) {
              existingRipple.remove();
            }

            const rect = button.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            this.appendChild(ripple);

            ripple.addEventListener('animationend', () => {
              ripple.remove();
            });
          });
        });
      });