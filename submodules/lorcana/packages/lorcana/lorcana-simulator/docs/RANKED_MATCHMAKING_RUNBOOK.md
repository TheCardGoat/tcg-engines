# Ranked Matchmaking — Launch Runbook

**Audience:** the on-call engineer running the Ranked launch, the eng lead,
and anyone authorised to flip the kill switch.

**Source of truth for backend contract:**
[RANKED_MATCHMAKING_BACKEND_SPEC.md](./RANKED_MATCHMAKING_BACKEND_SPEC.md).
**Source of truth for QA validation:**
[RANKED_MATCHMAKING_QA.md](./RANKED_MATCHMAKING_QA.md).

---

## 0. Pre-launch readiness gate

The launch is **GO** only when _every_ item below is checked:

- [ ] All BLOCKER items in the backend spec §7 sign-off checklist are green.
- [ ] All BLOCKER QA cases (TC-1.1, TC-2.1, TC-2.2, TC-3.1, TC-3.2, TC-4.5,
      TC-6.1) pass on staging in the last 24 h.
- [ ] §2 SQL query 4a returns exactly one active season for `lorcana`.
- [ ] Dashboards listed in §5 below are wired and show non-zero baseline
      data from staging.
- [ ] On-call rotation is staffed for the launch window + 24 h after.
- [ ] Customer-facing comms are queued (changelog, in-app notice).

If any item is amber or red, postpone. Do not partial-launch.

## 1. Rollout shape

**Selected approach:** dark launch → 10 % → 100 %.

| Stage | Audience                                               | Flag                                                                       | Duration |
| ----- | ------------------------------------------------------ | -------------------------------------------------------------------------- | -------- |
| Dark  | Internal employees only (allowlist by `gameProfileId`) | Server-side allowlist, `PUBLIC_RANKED_ENABLED=false` for the public bundle | ≥ 24 h   |
| 10 %  | Random 10 % of authenticated accounts                  | Edge-routed flag, `PUBLIC_RANKED_ENABLED=true` for the bucket              | ≥ 4 h    |
| 100 % | All authenticated accounts                             | `PUBLIC_RANKED_ENABLED=true` for the public bundle                         | —        |

If the simulator deploy uses a single env var (`PUBLIC_RANKED_ENABLED`), the
"10 %" stage is implemented as a server-side gate that filters the
`getFeatureFlags()` response per-request. If that infrastructure isn't
ready, fall back to **dark → 100 %** with no middle stage.

## 2. The flip — exact steps

> Each step has a single owner and a verification criterion. Don't move on
> until the verification is green.

### 2.1 Pre-flip (T −15 min)

- **Owner:** on-call eng.
- Re-run §0 readiness gate. Any new amber items → ABORT.
- Open dashboards from §5. Capture baseline screenshots (queue depth, error
  rate, MMR write rate). These are your "before" reference.
- Announce in #launches: `Starting ranked launch in 15 min. Channel is
on-call until announced clear.`
- Kick off a final live smoke (TC-2.1 + TC-3.1) on staging.

### 2.2 The flip (T 0)

- **Owner:** on-call eng (single person).
- Update the prod simulator deploy env: `PUBLIC_RANKED_ENABLED=true`.
- Trigger the deploy. Wait for the new build to be served.
- **Verify:** open `/matchmaking` in an incognito window. Ranked tab is
  enabled, no "Soon" badge.
- Run TC-2.1 against prod with two test accounts. Both must pair, match
  must complete, both must see `mmrAfter` populated within 30 s.
- Announce in #launches: `Ranked is live in prod.`

### 2.3 Watch window (T 0 → T +60 min)

- Stay on the dashboards. Targets:
  - p50 ranked queue wait < 90 s.
  - join 5xx rate < 0.5 % over rolling 5 min.
  - `queue_match_ready_expired` rate < 5 % of `queue_match_found`.
  - MMR write rate ≥ 1 per completed ranked game.
- Tail server logs for `matchmaking` errors. Any spike → §4 rollback
  decision.

### 2.4 Post-watch (T +60 min)

- Capture "after" dashboard screenshots. File in the launch retro doc.
- Update changelog and in-app bulletin to "Ranked is live".
- Hand over to next on-call shift.

## 3. Rollback criteria — automatic ABORT signals

Flip the kill switch immediately if **any** of:

- Ranked join 5xx rate > 5 % over 5 min.
- p95 ranked queue wait > 5 min for two consecutive 5-min windows.
- `queue_match_ready_expired` rate > 30 % of `queue_match_found` over 5 min
  (matchmaking pairing instability).
- Any MMR-related write reports negative MMR or writes that decrease the
  _winner's_ rating (rating algorithm bug).
- Customer reports of "I won but lost MMR" or "MMR didn't update" within
  10 min of game end, ≥ 3 distinct reports.
- Any data-loss or duplicate-match symptom.

## 4. Rollback procedure — kill switch

- **Owner:** on-call eng.
- Set `PUBLIC_RANKED_ENABLED=false` and redeploy the simulator.
- Verify on a fresh incognito window that the Ranked tab returns to
  disabled. _In-flight ranked queue tickets and matches are honoured by the
  backend_ — do **not** force-cancel them. They drain naturally.
- Announce in #launches and post the public-facing notice
  ("Ranked temporarily paused while we investigate; in-progress matches
  will complete and rated as normal").
- Open an incident doc within 30 min of rollback.

If the issue is _backend_ rather than frontend (e.g. MMR algorithm bug),
the kill switch alone is insufficient — coordinate with the backend
on-call to also gate the join endpoint server-side.

## 5. Dashboards & alerts to keep open

> File these in the on-call dashboard collection before T −15 min.

- **Queue health**: `queue_join` rate per `matchType`,
  `queue_join_blocked` reasons (alert on `ranked_disabled` > 0 in prod —
  someone's bypassing the UI).
- **Pairing latency**: histogram of `wait_seconds` from `queue_match_found`
  with `matchType: "ranked"` filter.
- **Acceptance funnel**: ratio of `queue_match_found` →
  `queue_match_ready_expired { reason: "declined" | "timeout" }`.
- **Match outcome**: rate of `match_forfeit { matchType: "ranked" }`.
  Should be < 5 % of completed ranked games long-run.
- **MMR pipeline**: writes to the rating table per minute, segmented by
  win/loss/draw. Alert on stalls > 60 s when ranked games are completing.
- **Leaderboard freshness**: lag between match completion and leaderboard
  reflection. Alert > 120 s.
- **Server errors**: 5xx on `/v1/games/lorcana/play/matchmaking/*` and
  `/v1/leaderboards/*`.

## 6. Comms templates

### 6.1 Pre-launch in-app banner (deploy at T −60 min)

> "Ranked is rolling out today! BO1 Infinity to start. Watch the lobby."

### 6.2 Launch announcement (post at T 0)

> "Ranked matchmaking is live. Compete for MMR and the _Wilds Unknown_
> season ladder. Conceding a ranked match counts as a loss — choose your
> queues wisely."

### 6.3 Rollback announcement (post if §3 fires)

> "Ranked is temporarily paused while we investigate an issue. Matches
> already in progress will complete and rate as normal. We'll post when
> Ranked is back open."

## 7. Post-launch follow-ups (T +24 h)

- [ ] Retro: what worked, what didn't, action items for the next launch.
- [ ] Confirm leaderboard data 24 h after launch is realistic
      (no obvious smurf-floods or rating distribution clipping).
- [ ] Review the §5 anti-abuse signals. If quick-concede cooldown is
      under-tuned, file a backend ticket.
- [ ] If the launch was flag-driven, plan removal of the dead-code branch
      (the disabled tooltip can stay for ranked-maintenance windows).

---

## Appendix A — known limitations of the launch state

- The `[seasonSlug]/+page.svelte` page is static marketing HTML keyed to
  the slug `wilds-unknown`. If you ship a season with a different slug,
  update the page guard.
- The post-game screen does **not** yet show MMR delta in real time — the
  player sees the new rating on the next match-history fetch / lobby
  refresh. Tracked as a follow-up (§3 STRONG in the readiness checklist).
- Smurf / placement logic is delegated to backend. The simulator surfaces
  whatever MMR the server provides without special-casing new accounts.
