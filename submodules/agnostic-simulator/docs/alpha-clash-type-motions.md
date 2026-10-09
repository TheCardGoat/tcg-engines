# Alpha Clash card motion studies

Open `/alpha-clash/simulator/tests/card-motions` in the existing multi-game simulator service, or follow Card motions and play from the simulator index.
Use the selector and Replay motion, or Play all 14. Sound and reduced motion
are supported. These are presentation fixtures, not engine commands or full
printed-effect demonstrations. Payment and priority are represented by a held
Standby beat.

Source: [official Comprehensive Rulebook v8.0](https://alphaclashtcg.com/s/Alpha_Clash_TCG_Comprehensive-Rulebook-80.pdf),
effective September 21, 2026. The rules skill now has the v8.0 extraction
(refreshed October 8, 2026). This does not certify engine coverage. Rules
306.5/306.5a and 504.2d-e leave the Clash Buff quantity unclear; see the
[local source review](../../alpha-clash/.agents/skills/alpha-clash-rules/references/source-review-v8.0.md).

| Study | Rule | Motion contract |
| --- | --- | --- |
| Contender | 103, 301 | Reveal and dock; never played from hand |
| Clash | 303, 601 | Hand → Standby → ready in Clash Zone |
| Clashground | 302.6 | Old ground leaves before replacement enters |
| Trap | 304 | Hidden set, later activation, reveal, resolution, discard |
| Weapon | 305 | Play first; separate attach cost/action second |
| Contender Weapon | 310 | Attach to eligible Contender |
| Relic | 309 | Remains in Accessory Zone |
| Basic / Quick / Clash Buff | 306–308 | Legal timing → Standby → resolution → Oblivion |
| Empowerment | 311 | Stays attached; leaves with host |
| Omen | 312 | Stays until controller's next turn starts |
| Resource | 408 | Face up, inverted, ready; engage separately to pay |
| Ambush | 704.17 | Hidden set; later reveal into the zone specified by its ability (Clash Zone in this fixture) |

Resources and Ambush are not additional card types. Neutral schematic faces
are explicit for Contender Weapon, Clash Buff, Empowerment and Omen. They
avoid inventing printed cards or ignoring card-specific target restrictions.
Other artwork uses existing printed catalog product IDs. Individual printed
effects are omitted from these type studies.

`@tcg/simulator-presentation/sequence` supplies `CardSequence`: one R3F clock
and game-owned target poses, using shared `DomCardMotion`, card faces, shadows,
selection tokens and audio. The Alpha Clash adapter owns type names, zones,
sequence order and rule notes. No per-frame React state updates. Demand
rendering while idle; hidden tabs stop the clock; bounded deltas avoid jumps.

Validation: seven lifecycle contract tests and eleven opening tests passed;
package type check, focused lint and standalone build passed. Browser playlist
completed all fourteen cases in normal and reduced motion. Local normal motion
reported about 60 FPS. Recording frame rate may be lower than render frame rate.

## Drag, play and targeted resolution

Open `/alpha-clash/simulator/tests/play-preview` for interactive Clash, Basic Action (Deliverance),
and Quick Action (Piercing Strike) examples. Drag anywhere within the marked
play area; outside drops return to hand without a play confirmation. This is
a presentation fixture with legal engine decisions assumed, not a rules validator.

The shared pointer adapter preserves the grab offset in scaled board coordinates.
`DomCardMotion` consumes the actual release pose, emits launch once, and emits
landing only when the rendered motion reaches its destination. Audio uses these
events: movement, Standby arrival, card-in-play arrival, resolution, impact and
Oblivion arrival are distinct. Idle audio resumes on the next play gesture.

Actions remain visible in Standby through resolution. The shared target outline,
scale and lift show the source and chosen target. A brief shared R3F trail and
impact replace the original arrow. Hover/focus reveals a quiet pending connection.
See [the four-game research and validation](card-resolution-research.md). Deliverance
sends the chosen Clash to Oblivion before discarding itself. Piercing Strike uses
the Counter–Attack window and deals two damage to the attacking Pestilence; that
target survives. Selection adds no caption under the card.

Browser checks covered far-left and far-right releases, invalid drops, alternate
Basic targets and the Quick target, plus reduced motion. Coordinate tests cover
100 release positions across four board scales. Local normal motion measured
about 60 FPS; exported videos are 30 FPS. This does not guarantee all hardware
or integrate these examples into live engine commands.
