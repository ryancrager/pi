function updateMainClock() {
  const now = new Date();
  const day = document.getElementById("mainDay");
  const date = document.getElementById("mainDate");
  const time = document.getElementById("mainTime");
  if (day) day.textContent = now.toLocaleDateString("en-US", { weekday: "long" });
  if (date) date.textContent = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  if (time) time.textContent = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function updateTileCountClass() {
  const grid = document.getElementById("tileGrid");
  if (!grid) return;
  const visibleTiles = Array.from(grid.querySelectorAll(".tile-slot"))
    .filter(tile => tile.style.display !== "none" && !tile.hidden);
  grid.classList.forEach(cls => {
    if (cls.startsWith("tile-count-")) grid.classList.remove(cls);
  });
  grid.classList.add(`tile-count-${Math.max(1, Math.min(9, visibleTiles.length))}`);
}

updateMainClock();
updateTileCountClass();
setInterval(updateMainClock, 1000);
