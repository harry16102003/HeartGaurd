const revealCards = document.querySelectorAll(".reveal-card");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (!entry.isIntersecting) {
        return;
      }

      const delay = Math.min(index * 80, 320);
      window.setTimeout(() => {
        entry.target.classList.add("is-visible");
      }, delay);

      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.15
  }
);

revealCards.forEach((card) => observer.observe(card));
