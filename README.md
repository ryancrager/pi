# RyanOS v1.0

## What this is
RyanOS v1.0 is a modular dashboard system.

- `index.html` is the main dashboard frame.
- The dashboard is built automatically from the true/false configuration at the top of `index.html`.
- Each module lives in its own standalone file inside `tiles/`.
- Shared styling lives in `css/ryanos.css`.
- Shared logic lives in `scripts/`.

## Show or hide modules
Edit only `index.html`.

At the top, change any module from `true` to `false`:

```js
window.RYANOS_MODULES = {
  "weather-a": true,
  "weather-b": true,
  "weather-c": true,
  "flights": true,
  "retirement": true,
  "chester": true,
  "seven": false,
  "eight": false,
  "nine": false
};
```

Disabled modules leave no blank space. The grid rebuilds around the enabled modules.

## Change a weather city
Do not edit `index.html`.

Open the weather tile file you want:

- `tiles/weather-a.html`
- `tiles/weather-b.html`
- `tiles/weather-c.html`

Change only the `window.RYANOS_WEATHER_TILE` block near the bottom of that file.

## Tile filenames
These names are intentionally stable:

- `weather-a.html`
- `weather-b.html`
- `weather-c.html`
- `flights.html`
- `retirement.html`
- `chester.html`
- `seven.html`
- `eight.html`
- `nine.html`

If the purpose of a tile changes later, keep the filename and edit the tile contents.
