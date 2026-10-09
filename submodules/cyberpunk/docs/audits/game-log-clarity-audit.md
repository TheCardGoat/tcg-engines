# Cyberpunk game log clarity audit

Date: 2026-09-24

Scope: current Cyberpunk engine logs, command synthesis, viewer filtering, simulator projection, and activity-panel rendering. This includes the recent effect-failure and private-search improvements already in the checkout.

The main gap is that the log often describes an instruction or a selected target without recording what actually happened. More entries alone will not solve this. Each resolved action needs a clear outcome, in the correct order, with the correct visibility.

## Evidence and limits

- Read the effect handlers, choice moves, command log synthesis, log templates, viewer projection, and shared activity panel.
- Ran deterministic commands through `CyberpunkTestEngine` for Panam Palmer: Nomad Cavalry, Offduty Malfini, Dexter DeShawn: Off the Grid, Sketchy Ripper, and All is Lost. Compared returned move logs with emitted events and resulting state.
- The preceding search change was also checked in the Docker simulator: owner names were visible and rival names were hidden. The wider findings below are engine reproductions or source inspections, as labelled.
- This audit changes documentation only. It does not claim full browser or hosted-match coverage for every effect.

## Prioritized findings

### 1. High: successful effects often omit the result

**Reproduced:** Panam pays 2 Eddies, spends herself, moves Kiroshi Optics to Swordwise Huscle, and readies that Unit. The two commands produce only:

> Panam Palmer: Nomad Cavalry activated its ability.
> Selected Kiroshi Optics for Panam Palmer: Nomad Cavalry.

The `cardMoved` and `cardReadied` events confirm the changes, but the player log does not name the receiving Unit or say it readied. Offduty Malfini similarly spends Corpo Security but logs only “Selected Corpo Security for Offduty Malfini.”

**Recommendation:** log the completed action: “Panam moved Kiroshi Optics to Swordwise Huscle and readied Swordwise Huscle.” For Malfini: “Offduty Malfini spent itself and rival Corpo Security.” Include the payment in the activation entry.

**Owning paths:** `packages/engine/src/effects/handlers/index.ts:117` (`spend`), `:129` (`returnToHand`), `:219` (`modifyGig`), `:328` (`multiplyPower`), `:357` (`grantRule`), `:618` (`ready`). The central successful-effect logger in `packages/engine/src/ability-executor.ts:1371` only covers `draw`. Record semantic outcomes in the engine; do not infer success from a target-selection message.

### 2. High: log order and completion wording can misrepresent the action

**Reproduced:** Sketchy Ripper's structured search entry comes before the attack declaration that caused it. Dexter's Call logs “Auto-resolved … Choose one effect …” while the mode choice is still pending. After choosing the buff and its target, the power result appears before “Selected Field Operator.”

**Cause:** `packages/engine/src/command/synthesize-move-logs.ts:94` appends all explicit logs first, generic action logs next, and defeats/system logs later. This does not preserve the order of events. `packages/engine/src/ability-executor.ts:469` emits “resolved” before calling `resumeCurrentTrigger`.

**Recommendation:** preserve one sequence for action, decision, outcome, and completion. Use “Ability triggered” or “Waiting for your choice” while pending. Reserve “resolved” for completion. Group the source and its outcomes so players can follow: attack → search → choice → destination → next combat step.

### 3. High: some effects that change nothing still bypass failure logging

**Source-confirmed:** `handleReady` skips targets with `cantReady`, then returns `resolved`. The generic no-action logger only runs on `noAction`. A selected Unit can therefore remain spent without a clear explanation. Other handlers return `resolved` after an empty loop or after an instruction has no effective change.

**Recommendation:** distinguish `changed`, `unchanged`, `prevented`, `declined`, and `failed`, with a concrete reason where applicable. For example: “Swordwise Huscle stayed spent because [source] prevents it from readying.” “Already ready” is a valid unchanged result, not an error. Keep partial results: “Readied 2 Units; 1 stayed spent because …”.

**Owning paths:** `packages/engine/src/effects/handlers/index.ts:618`; `packages/engine/src/ability-executor.ts:1349`; `packages/engine/src/logging/index.ts:169`. Do not log every inactive conditional ability on every event. Log outcomes for actions and abilities that actually started resolving.

### 4. High: visibility and vocabulary need to distinguish search, reveal, and trash

**Source-confirmed:** `handleScry` describes private inspection as “Revealed the top …”. The rules define Search as looking at cards (11.13.1), and Reveal as showing them to the Rival (11.14.1). The same wording obscures why one viewer can see names and the other cannot.

**Reproduced:** All is Lost trashes Mantis Blades, Floor It, and Kiroshi Optics. Its owner receives their names in the log; its rival receives only the count because `handleTrashFromDeck` marks those names private. These are public Trash actions: rule 11.7.2 requires revealing each card before moving it to Trash.

**Recommendation:** say “Looked at the top 3 cards” for private search inspection, and “Revealed …” for an actual public reveal. Keep searched candidates private to the allowed viewer. Show publicly trashed/revealed identities to the rival when the rules allow it. Derive visibility from the game action rather than from who owns the deck.

**Owning paths:** `packages/engine/src/effects/handlers/index.ts:713`, `:1642`; simulator `src/games/cyberpunk/engine/moveLogProjection.ts:619`. Rules source: `.agents/skills/cyberpunk-tcg-rules/references/comprehensive-rules.md`, rules 5.3.2.4, 11.7.2, 11.13, 11.14. Preserve the user's requested private search history. Do not automatically extend persistent identity previews to face-down Legend peeks; rule 5.7.4.3 treats those separately.

### 5. Medium: decisions and search destinations are incomplete

**Reproduced:** Dexter's `buff` mode selection returns an empty log array. Sketchy Ripper can inspect a legal Gear, choose none, and report “found 0.” That wording does not distinguish choosing none from having no qualifying cards.

**Source-confirmed:** optional target and play declines can return without a dedicated decision entry. `ResolveCardToMoveLog` says only “Moved [card]” or “Skipped the optional move”; it lacks the source and destination. Search resolution stores counts and adds selected names only when the selected destination explicitly reveals them. River Ward and Tetratronic Rippler can send cards to Trash and keep the rest on top, but the generic result does not describe those destinations.

**Recommendation:** record the chosen mode, deliberate decline, selected cards visible to that viewer, and actual destinations. Examples: “Chose +2 power for Dexter's Call”; “Chose no Gear; bottom-decked 3 cards”; “Trashed Floor It; left the other card on top.” Never tell the rival whether a private search had eligible cards that the owner declined.

**Owning paths:** `packages/engine/src/moves/resolve-choose-effect.ts:56`, `resolve-effect-target.ts:134`, `resolve-card-to-play.ts:120`, `resolve-scry.ts:200`; `packages/engine/src/logging/move-log.ts` (`ResolveCardToMoveLog`, `ResolveSearchDeckLog`).

### 6. Medium: effect changes need duration, totals, and precise reasons

**Reproduced:** Dexter logs “gave Field Operator +2 power,” with no “this turn” or resulting power. The current Dum Dum result has the same limitation. The player must inspect the card and remember when the modifier ends.

**Source-confirmed:** failure wording includes “requirements were not met,” “the required target does not exist,” and “the target was unavailable or its defeat was prevented.” These merge different causes. All is Lost with no Unit among its three trashed cards reports a “move card” effect with no valid targets.

**Recommendation:** name the failed requirement and the visible facts. Examples: “Field Operator gained +2 power this turn (2 → 4)”; “No Unit among the 3 trashed cards; nothing returned to hand”; “Did not draw: no friendly Gig has value 8 or more.” For prevention, name the preventing source. For a changed target, say what became invalid. Include expiration/consumption when it matters, with routine expirations summarized at the turn boundary.

**Owning paths:** `packages/engine/src/logging/index.ts:169`, `:172`, `:198`; `packages/engine/src/ability-executor.ts:1473`; `packages/engine/src/logging/effect-name.ts` currently turns internal effect names into spaced words.

### 7. Medium: each result should carry its own evidence

**Source-confirmed:** the improved search result sentence still obtains inspected names from earlier logs, keyed by player and turn. A loaded pending-choice fixture with no earlier log produces the original count-only result. The result row also lacks those card references, so the names in its sentence are plain text even when the reveal row has preview buttons.

**Recommendation:** each outcome should carry the source, relevant names/IDs with their visibility, chosen destinations, and an action/resolution identifier. This makes the result understandable after reconnect, partial history loading, or export, without reconstructing it from later board state or another row. Keep historical names distinct from current hidden locations.

**Owning paths:** simulator `src/games/cyberpunk/engine/moveLogProjection.ts:31`, `:60`, `:683`; engine `packages/engine/src/moves/resolve-scry.ts:221`.

### 8. Medium: actor, owner, and exact card identity are easily lost

**Source-confirmed:** “rival passed” is hard-coded in the `reactPass` sentence. Reveal-destination wording hard-codes “Rival” and attributes the row to the deck owner, although the chooser is another player. Generic log synthesis copies `params` but drops the action event's `cardIds`; many card references then retain names only.

**Recommendation:** distinguish who chose, who controls the affected object, and whose card/deck changed. Prefer “Your rival chose Trash for your 2 revealed cards.” Keep stable card IDs with names for public objects so two copies of the same card remain distinguishable. Resolve “you/rival” from the viewing seat.

**Owning paths:** `packages/engine/src/moves/resolve-reveal-destination.ts:64`; `packages/engine/src/command/synthesize-move-logs.ts:119`; simulator `src/games/cyberpunk/engine/moveLogProjection.ts:555`, `:425`.

### 9. Medium: card previews are reconstructed from punctuation

**Source-confirmed:** `namesFromDelimitedString` splits names on commas. A real card such as “Three Mouths, One Desire” becomes two references. The message renderer then uses word-boundary matching to turn those fragments back into card tokens. This is fragile for punctuation and repeated names.

**Recommendation:** carry arrays of card references separately from prose. Generate the visible list from those references; do not parse card names back out of a sentence. The exact card selected or affected should have the same preview behavior in all log entries.

**Owning paths:** simulator `src/games/cyberpunk/engine/moveLogProjection.ts:499`; `src/games/cyberpunk/components/EventLog/CyberpunkEventLogMessage.tsx:20`.

### 10. Lower: filtering and verbosity hide useful entries

**Source-confirmed:** generic `action` entries—including `effect.*` and `trigger.*`—receive the `move` tag. Only the typed `activateAbility` variant receives `ability`. The Ability filter therefore misses much of the ability history. Full ability text plus target-selection and outcome rows can repeat the same information several times.

**Recommendation:** classify logs by their semantic action, not only their storage type. Show one concise source/outcome group by default, with printed ability text and calculation details available on expansion. Keep failures and unresolved decisions visible. Preserve existing Attack/React/Fight/Steal sections.

**Owning paths:** simulator `src/games/cyberpunk/engine/moveLogProjection.ts:213`; shared `packages/simulator-ui/src/components/EventLogPanel.tsx`.

## Recommended implementation order

1. Establish ordered, typed outcome records in the Cyberpunk engine. Preserve the source, acting player, affected objects, result, reason, and visibility. Cover spend, ready, Gear movement, power changes, and prevented changes first.
2. Complete choice and search results, including declines, actual destinations, and private/public wording. Add before/after values and durations where useful.
3. Make simulator projection consume those records directly. Preserve references and viewer-relative roles, then remove obsolete sentence-parsing and broad deduplication paths.
4. Improve activity grouping and filtering after the underlying facts are complete.

The engine owns game meaning and visibility. The Cyberpunk adapter/projection owns native wording and viewer-relative presentation. Shared simulator UI should render supplied facts without knowing Cyberpunk rules. A change to the common log contract or cross-workspace event ordering needs an explicit design review before implementation.

Acceptance should cover both player views, automatic and chosen targets, declined choices, no-op/prevented/partial results, multiple effects in one command, repeated same-turn searches, duplicate card copies, punctuation in names, and a result loaded without earlier history. Use the five reproduced cards above as the initial behavior cases, then verify the rendered activity panel and hosted viewer filtering.
