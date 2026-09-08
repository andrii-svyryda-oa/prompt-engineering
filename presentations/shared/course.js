(function () {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const progress = document.querySelector(".progress");
  const counter = document.querySelector("[data-counter]");
  const overview = document.querySelector(".overview");
  const overviewGrid = document.querySelector(".overview-grid");
  let index = 0;

  function titleOf(slide) {
    const heading = slide.querySelector("h1, h2, h3");
    return heading ? heading.textContent.trim() : "Slide";
  }

  function renderOverview() {
    if (!overviewGrid) return;
    overviewGrid.innerHTML = slides
      .map(
        (slide, i) =>
          `<button data-go="${i}" class="${i === index ? "current" : ""}">
            <strong>${String(i + 1).padStart(2, "0")}</strong>
            <span>${titleOf(slide)}</span>
          </button>`
      )
      .join("");
  }

  function show(i) {
    index = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach((slide, n) => slide.classList.toggle("active", n === index));
    if (progress) progress.style.width = `${((index + 1) / slides.length) * 100}%`;
    if (counter) counter.textContent = `${index + 1} / ${slides.length}`;
    location.hash = String(index + 1);
    renderOverview();
  }

  function next() { show(index + 1); }
  function prev() { show(index - 1); }

  document.addEventListener("keydown", (event) => {
    if (event.key === "d") {
      document.body.classList.toggle("dark");
      return;
    }
    if (event.key === "Escape") {
      overview?.classList.toggle("open");
      renderOverview();
      return;
    }
    if (overview?.classList.contains("open")) return;
    if (["ArrowRight", "PageDown", " ", "Enter"].includes(event.key)) {
      event.preventDefault();
      next();
    }
    if (["ArrowLeft", "PageUp", "Backspace"].includes(event.key)) {
      event.preventDefault();
      prev();
    }
    if (event.key === "Home") show(0);
    if (event.key === "End") show(slides.length - 1);
  });

  document.addEventListener("click", (event) => {
    const go = event.target.closest("[data-go]");
    if (go) {
      show(Number(go.dataset.go));
      overview?.classList.remove("open");
      return;
    }
    if (overview?.classList.contains("open")) return;
    if (event.target.closest("a, button, pre, code")) return;
    if (event.clientX > window.innerWidth * 0.18) next();
    else prev();
  });

  overviewGrid?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-go]");
    if (!button) return;
    show(Number(button.dataset.go));
    overview.classList.remove("open");
  });

  const fromHash = Number(location.hash.replace("#", ""));
  show(Number.isFinite(fromHash) && fromHash > 0 ? fromHash - 1 : 0);
})();
