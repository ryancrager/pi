(function () {
  const CHRISTMAS_DATE = new Date("2026-12-19T00:00:00");

  function updateChristmasCountdown() {
    const now = new Date();
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const difference = CHRISTMAS_DATE - now;
    const daysRemaining = Math.max(0, Math.ceil(difference / millisecondsPerDay));
    const element = document.getElementById("christmasCountdown");

    if (element) {
      element.textContent = `${daysRemaining} DAYS`;
    }
  }

  updateChristmasCountdown();
  setInterval(updateChristmasCountdown, 60 * 60 * 1000);
})();
