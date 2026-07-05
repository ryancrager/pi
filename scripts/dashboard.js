(function () {
  function updateMainClock() {
    const now = new Date();
    const day = document.getElementById("mainDay");
    const date = document.getElementById("mainDate");
    const time = document.getElementById("mainTime");

    if (day) {
      day.textContent = now.toLocaleDateString("en-US", { weekday: "long" });
    }

    if (date) {
      date.textContent = now.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      });
    }

    if (time) {
      time.textContent = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
      });
    }
  }

  function buildDashboard() {
    const grid = document.getElementById("tileGrid");
    const modules = window.RYANOS_MODULES || {};
    const tiles = window.RYANOS_TILES || [];

    if (!grid) return;

    grid.innerHTML = "";

    const enabledTiles = tiles.filter(tile => modules[tile.id] === true);

    enabledTiles.forEach(tile => {
      const slot = document.createElement("section");
      slot.className = "tile-slot";
      slot.dataset.tile = tile.id;

      const frame = document.createElement("iframe");
      frame.src = tile.file;
      frame.title = tile.title;
      frame.loading = "eager";
      frame.setAttribute("aria-label", tile.title);

      frame.addEventListener("error", () => {
        slot.innerHTML = `
          <div class="tile simple-tile">
            <div class="tile-label">${tile.title}</div>
            <div class="tile-status">Module unavailable</div>
            <div class="tile-note">Check ${tile.file}</div>
          </div>
        `;
      });

      slot.appendChild(frame);
      grid.appendChild(slot);
    });

    updateTileCountClass(enabledTiles.length);
  }

  function updateTileCountClass(tileCount) {
    const grid = document.getElementById("tileGrid");
    if (!grid) return;

    Array.from(grid.classList).forEach(className => {
      if (className.startsWith("tile-count-")) {
        grid.classList.remove(className);
      }
    });

    const safeCount = Math.max(1, Math.min(tileCount, 9));
    grid.classList.add(`tile-count-${safeCount}`);
  }

  buildDashboard();
  updateMainClock();

  setInterval(updateMainClock, 1000);
})();
