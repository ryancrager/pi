# RyanOS v0.6 Modular

## Main idea
- `index.html` is the frame and tile grid.
- Each tile lives in `tiles/` and can be edited independently.
- Shared styling lives in `css/ryanos.css`.
- Shared logic lives in `scripts/`.

## Change Omaha to Phoenix
Edit only:

`tiles/weather-a.html`

Find the block near the bottom:

```js
window.RYANOS_WEATHER_TILE = {
  main: "Omaha",
  sub: "Nebraska",
  weatherLat: 41.2565,
  weatherLon: -95.9345,
  airport: "KOMA",
  timeZone: "America/Chicago"
};
```

## Remove a tile from the main page
Edit only `index.html`.
Delete the full `<section class="tile-slot">...</section>` block for that tile.

## Hide a tile without deleting it
Add `hidden` to the section:

```html
<section class="tile-slot" data-tile="TBD 1" hidden>
```

## Reorder tiles
Cut and paste the full tile-slot section blocks in `index.html`.
