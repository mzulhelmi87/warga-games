# Warga Games

The games of [Arked Warga](https://nullifye.github.io/arcade/), the game hub in UiTM's
AppsWarga app (hub repo: `nullifye/arcade`). Static site on GitHub Pages, no build step.

| Game | Path | Live |
|---|---|---|
| Teka Kata (cryptogram) | [`teka-kata/`](teka-kata/) | https://nullifye.github.io/warga-games/teka-kata/ |
| Ular (snake) | [`ular/`](ular/) | https://nullifye.github.io/warga-games/ular/ |
| Duga Kata (5-letter word guess) | [`duga-kata/`](duga-kata/) | https://nullifye.github.io/warga-games/duga-kata/ |
| Kejar Lapan (3D voxel runner) | [`kejar-lapan/`](kejar-lapan/) | https://nullifye.github.io/warga-games/kejar-lapan/ |
| 2048 | [`2048/`](2048/) | https://nullifye.github.io/warga-games/2048/ |
| Teka Blok | [`blok/`](blok/) | https://nullifye.github.io/warga-games/blok/ |
| Memori | [`memori/`](memori/) | https://nullifye.github.io/warga-games/memori/ |

The site root redirects to the hub.

## Run locally

```sh
npm run serve   # http://localhost:8080/warga-games/ular/  (the hub at /arcade/ from ../arked)
npm test        # node --test: shared/, teka-kata/, ular/, duga-kata/, kejar-lapan/
```

## Shared code (`shared/`)

One copy for every game; games import it with `../../shared/…`.

| File | What |
|---|---|
| `appswarga.js` | AppsWarga bridge: theme, close button, `ready`, haptic, share, user-type lock |
| `shared-store.js` | Profile and progress shared with the hub, across hosts (AppsWarga bridge storage). Keep identical to the hub's copy |
| `arked-link.js` | `?dari=arked`: the ‹ back-to-Arked button, and share links without it |
| `profile.js` | The profile chip and dialog (shared `arked.profile`) |
| `leaderboard.js` | `arked_record` / `arked_top` / `arked_campus_rank` and the board lists |
| `rng.js` | Seeded PRNG, shuffle and Malaysia-time dates, for daily puzzles everyone shares |
| `base.css` | Tokens, buttons, header, top bar, leaderboard, dialogs, dropdown, toast |
| `select.js`, `profile-options.js`, `config.js`, `uuid.js`, `reload.js` | Dropdown, user types and campuses, Supabase settings, ids, fresh reload |

The hub keeps its own copies of `appswarga.js`, `select.js`, `profile-options.js`,
`config.js` and `shared-store.js`; change both when they change.

## Adding a game

1. Make a folder (e.g. `kuiz/`) with `index.html` linking `../shared/base.css`; see `ular/` for
   the profile chip, dialog, ‹ button and board markup.
2. In its script: `initFromArked()`, `initAppsWarga()`, `initProfile()`; write
   `arked.game.<id>` when a round starts; send each round with `recordRound()`; show boards
   with `topPlayers()` / `topCampuses()`.
3. Supabase (hub repo `supabase/arked.sql`): add the game to `arked_games` with its point bounds.
4. Hub: add it to `js/games.js` with `url: 'https://nullifye.github.io/warga-games/<folder>/'`.

The three PlayZone game ports use one shared static page shell and rules in `shared/puzzle-page.js`,
`shared/puzzle-page.css` and `shared/puzzle-engines.js`. Their hub and leaderboard setup is
documented in [`docs/arcade-integration.md`](docs/arcade-integration.md).

## Ular

- 20×20 board; the snake speeds up from 140 ms to 75 ms a step as it eats.
- **Dinding** on: hitting the edge ends the game, 15 points a food. Off: the snake wraps
  around, 10 points a food. Hitting itself always ends it.
- **Butang arah** (on-screen D-pad) on or off; swiping on the board and arrow keys / WASD always work.
- Pauses when the page is hidden or AppsWarga goes to the background.
- Rules in `ular/js/snake.js` (unit-tested); every round with points goes to `arked_record`.

## Duga Kata

- Guess a 5-letter Malay word in 6 tries. Each guess is marked tile by tile: **hijau** (right
  letter, right place), **kuning** (in the word, elsewhere), **kelabu** (not in the word).
  Repeated letters are marked only as often as the answer has them.
- **Cabaran Harian**: the same word for everyone, new at midnight Malaysia time (`dk.daily`
  resumes it after a reload; the clock keeps running). **Main Bebas**: random words, no limit.
- A guess must be in `duga-kata/js/words.js` (`ANSWERS` + `GUESSES`); a word not in the lists
  shakes the row and doesn't use a try. **The lists are a hand-written draft: have them reviewed
  before launch.** Changing `ANSWERS` reshuffles which word falls on which day.
- Score: 1,000 / 800 / 600 / 450 / 300 / 200 for a win in 1–6 guesses, plus 2 a second under
  3 minutes; a loss is 0 and still counts as a play. Every round goes to `arked_record`.
- Rules in `duga-kata/js/logic.js`, score in `score.js` (both unit-tested).

## Kejar Lapan

- Each of the nine campus scenery types has an original 90-second retro game score
  with its own tempo (64–160 BPM), key, groove and instrumentation. Songs loop and crossfade, follow
  the sound toggle, and stop on pause, results or navigation. Listen to all tracks at
  [`kejar-lapan/music.html`](kejar-lapan/music.html).
  Boost plays music at 1.35× speed with pitch preserved. Shield adds short stereo
  room reverb and softens high frequencies on music and sound effects; both effects
  clear when the corresponding power-up ends, and reset on pause or mute.
  Regenerate the MP3s and catalog with `python3 tools/compose-kejar-music.py`
  (requires NumPy and FFmpeg; no build step is needed to play the game). Tracks are 72 kbps
  MP3s (about 0.7 MB each), and only the current area's track is loaded. The shield room
  reverb is only connected while the shield is active.

- HUD, touch controls and overlays respect both browser safe areas and AppsWarga's native
  inset variables, including the legacy `--appswarga-safe-top`. This keeps the timer below
  iPhone notches/Dynamic Island and controls clear of the home indicator and landscape cutouts.
  Insets are combined with `max()`, so they are not counted twice. The 3D scene stays edge to edge.

- A three-lane voxel runner through UiTM Shah Alam (Three.js 0.170.0, vendored in
  `kejar-lapan/vendor/` with its licence; no CDN, no build step).
- The campus clock runs from 07:55 to 8:00. After the starting gate, the fourteen campus
  landmarks repeat as checkpoints that add time: +16 s, one
  less each time, at least +8 s. Crash or reach 8:00 and the run ends.
- **Harian** (default): Pelajar, Staf, Alumni and Awam each receive a different daily
  checkpoint destination. Each day picks four neighbouring checkpoints from PTAR onwards
  (1.44–7.84 km) and shuffles them between the roles, so the longest route that day is at most
  about twice the shortest while route length still varies from day to day. Destinations and seeded courses stay fixed for that user type all day and refresh at
  midnight Malaysia time. Arrive before 8:00 to win; the finish awards checkpoint points
  but no extra clock time. Saved Tepat Masa selections now open Harian.
- **Larian Jauh**: run as far as possible on a random course before crashing or running
  out of time; there is no fixed destination or distance cap.
- **Bayang rekod**: optional translucent replay of the best attempt on the same route, stored
  locally on this device. Completed runs rank by fastest finish, then score; unfinished runs
  rank by furthest distance, then score. Sparse inputs replay at fixed simulation ticks; pauses
  do not advance the ghost, which cannot collide with the player or take their items. Only the
  latest daily record for each user type is retained separately. Course identities are
  versioned in `js/modes.js`; bump `COURSE_VERSION` after physics, tuning or generation changes.
  The existing leaderboards continue to aggregate scores from all modes.
- **Almari Gaya**: eighteen local milestone rewards across backpacks, outfits, running trails,
  and accessories. Single-run distance goals are 12 km (robe), 5 km (glasses) and 10 km (stars),
  verified against actual simulated runs. Game-count rewards require 100/150/300/500 completed games; arrival rewards require 50/100 successful arrivals. Earn rewards through completed games, best single-run distance, cumulative distance, active
  play time (60/120/240 minutes), checkpoints, successful arrivals and collected items;
  existing run counts and distance records count too. Equip one unlocked item per body position (head, face, body, back, hand, foot effects),
  or keep the original look. All roles and modes share progress on this device; selections
  survive reloads and new unlocks appear on the result screen. The rotating live wardrobe preview
  shows the same models as the game: pink round and cat-face bags; fire, stars, rainbow and
  flying-frost trails; glasses, floating golden halo, helmet, brimmed hat, full-face mask, handheld star wand, briefcase, trident, jetpack and crossed back
  katanas. Body rewards are a wide-sleeved shinigami-style robe and a pocketed expedition vest,
  with distinct torso and sleeve geometry in both the avatar and isolated cards. Saved beard
  selections become the full-face mask; old body item IDs remain valid with the new milestone thresholds. Headwear replaces default hats, the wand replaces default handheld props, and katanas
  share the back slot with bags, so only one back item is equipped. Existing cosmetic IDs are preserved; removed sling-bag selections fall back to the original look. Cosmetics only reach the renderer:
  speed, jumps, collision bounds, power-ups, scores and replay rules remain identical. Trails
  use the same fixed mesh emitter in-game and in the wardrobe (geometry, lifetime and animation).
  The wardrobe keeps its avatar on a round pedestal and views equipped trails from behind,
  at the same world size and spacing as the game, with no compression or cropping of emitter samples; reduced motion hides effects in both views. Option cards show isolated cosmetic
  models with no character in compact 48 px thumbnails, using one shared thumbnail renderer rather than a WebGL context per card.
  Rotation buttons show arrow icons and retain accessible labels.
  The role mission and item labels sit between the role choices and avatar preview, which remains visible while switching
  between **Mod Permainan** and **Almari Gaya** tabs. New players start with all 18 rewards locked;
  locked cards show only a generic question-mark image and milestone progress, revealing the item
  name and model after earning it. Previously saved test equipment cannot bypass these requirements.
  Folder-shaped tabs and beveled inventory cards use a bare pixel question mark; equipped cards
  show a corner checkmark. The wardrobe displays totals for games, distance, minutes, checkpoints,
  arrivals and pickups. New cumulative counters start from zero for existing profiles, since older
  saves did not record them; existing game counts and best distances are retained. Completed runs
  record simulation seconds, so pause time, menus and background time do not count.
  A hidden rotation code (left, right, right, left, left, left, right within ten seconds) unlocks
  all cosmetics for the current page session only, without changing stats or scores. Reloading
  or closing the page restores normal milestone access; old persistent cheat flags are ignored.
  Backgrounding or leaving home resets partial input. `COSMETICS_TEST_UNLOCK` remains `false`; milestones live in `js/cosmetics.js`.
- Lompat (jump) kon, lubang, monyet; tunduk (slide) under palang; go round bas and kereta.
  Swipe, arrow keys / WASD / Space, or the on-screen buttons (a setting).
- The character comes from the profile (Pelajar, Staf, Alumni, Awam) and can be switched; items
  only change look: points (+25), boost (5 s, smashes obstacles), shield (10 active seconds or one hit; refreshes on pickup, blinks and fades during the final 3 seconds), jam (+5 s).
  Every 12 obstacle rows, one guaranteed +5 s clock appears in a seeded random lane.
  It must be collected in that lane; missing it grants no time. A minimum 60 m support gap
  leaves room to steer in and back out, even while boosted. This replaces that gap's random items,
  while other gaps retain their usual pickups. The clock start/cap and checkpoint bonuses are
  unchanged. A clock-seeking test player clears 12 km on all 30 audited endless seeds using real pickups
  and ordinary controls; ignoring clocks runs out of time before the goal.
  Course identity is now `kl-5`, so earlier ghost recordings are ignored after the route change;
  achievement progress and best-distance stats remain intact.
- The avatar card also has an image-share icon in its top-right corner. It exports the
  current role, equipped cosmetics, player name and personal totals (best score, best distance,
  active play time, completed games), without requiring a run. Images refresh after equipment,
  role, profile or progress changes; rapid changes are coalesced and stale renders discarded.
- **Kongsi** exports a vertical 1080×1350 PNG game card with a chamfered gold frame and single action-figure portrait with the run's captured player name,
  equipped avatar in one three-quarter action pose, outcome, mode, campus clock, score, distance, duration and
  checkpoints. The image is prepared before the button tap for native file sharing; browsers
  without image sharing download the PNG. Cancelling the share sheet does not download anything.
  Inside AppsWarga, sharing uses the native `share` handler with pre-encoded PNG `image` and
  `imageType`, including Android WebViews without browser file sharing. Outside the app, it uses
  Web Share files or a PNG download fallback. `js/share-card.js` owns
  rendering and delivery, and temporary portrait rendering releases its WebGL resources.
  Both card footers use the player's saved campus, omitted for public/non-UiTM or missing-campus
  profiles. Both share buttons show a spinner and busy state while preparing the PNG or awaiting
  the native share promise, then reset after success, cancellation or failure.
  UI buttons activate once on a touch/pen release and suppress the delayed compatibility click;
  scrolling, cancelled gestures and the game D-pad are excluded, with normal mouse/keyboard input retained.
- Score: a point a metre, plus items, plus 200 a checkpoint; every run with points goes to
  `arked_record` (at most 100,000 points and 300 a second). Distance shows in m, then km.
- `js/sim.js` (fixed 60 Hz steps, swept collision) and `js/course.js` (seeded rows that always
  leave a way through) are pure and unit-tested, including a bot that clears 4 km of 30 courses.
  `js/render.js` draws the sim's state with merged voxel models and pools, so memory stays flat.
- Tuning lives in `js/config.js`. `?debug` exposes `window.__kl` for browser tests.
