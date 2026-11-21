# Adding the three games to Arked Warga

The games in this branch are static pages in `2048/`, `blok/` and `memori/`. They use Warga Games' shared AppsWarga bridge, profile, theme, progress key, and `arked_record` / `arked_top` / `arked_campus_rank` leaderboard functions. No PlayZone backend or Supabase functions are copied.

These game pages work locally without the hub. Online leaderboard writes require the three IDs to be present in the hub's `public.arked_games` table. The hub catalogue must also list the URLs before the games appear in Arked Warga. Those changes belong in `nullifye/arcade`, which is a separate repository.

## Supabase registration

Add these rows to the `insert into public.arked_games ... values` section of `supabase/arked.sql` in the hub repo, before its `on conflict` clause. `arked_record` rejects a round above `max_points`, or above `max_points_per_sec` times its seconds, so the per-second limit is what stops a short fake round from posting the maximum. Each limit is derived from the rules, and `tests/puzzle-engines.test.mjs` checks the per-action bounds.

```sql
  -- 2048: points come only from merges. Strong play averages under 30 points a move (a greedy
  -- player stays under 15), so even 10 moves a second stays under 500 a second.
  ('2048',   '2048',      100000, 500),
  -- Teka Blok: 1 a cell, 10 a line, +10 per extra line at once and up to +50 for a streak of
  -- clears. Big clears need many placements to set up: a greedy player averages about 7 points
  -- a placement (tested under 20), so three placements a second stays well under 200.
  ('blok',   'Teka Blok', 100000, 200),
  -- Memori: a perfect level 1 is 450 points (4 pairs × 100 + 50). A lucky clear in under 1.5 s
  -- rounds to 1 second, so allow 500 a second.
  ('memori', 'Memori',    100000, 500),
```

## Hub catalogue

Add three `live` entries to `js/games.js`, with IDs `2048`, `blok`, `memori` and URLs ending in `/warga-games/2048/`, `/warga-games/blok/`, `/warga-games/memori/`. Give each an `icons/<id>.svg` asset in the hub repository. The hub's local dev server maps these URLs to local pages.

The pages call `recordRound` only when a round ends, always as a free round. Their daily board displays all free rounds played today, matching the other Warga Games. Player profile and AppsWarga user-type restrictions remain shared with the existing games.
