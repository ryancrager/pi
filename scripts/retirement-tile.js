(function () {
  const RETIREMENT_DATE = new Date("2028-09-17T00:00:00");

  function updateRetirementCountdown() {
    const now = new Date();
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const difference = RETIREMENT_DATE - now;
    const daysRemaining = Math.max(0, Math.ceil(difference / millisecondsPerDay));
    const element = document.getElementById("retirementCountdown");

    if (element) {
      element.textContent = `${daysRemaining} DAYS`;
    }
  }

  updateRetirementCountdown();
  setInterval(updateRetirementCountdown, 60 * 60 * 1000);
})();
