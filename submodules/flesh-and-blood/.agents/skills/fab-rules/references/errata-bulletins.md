# Official Flesh and Blood Errata Bulletins

Errata is the highest-priority source in this skill. If an erratum applies,
use the errata'd behavior for every printing of that card. Do not let an older
release note, card printing, or Comprehensive Rules wording override it.

The official index distinguishes functional errata from major non-functional
templating/syntax corrections and excludes minor text changes. Both types are
authoritative for the card text they publish.

## Source and citation

- Official index: <https://fabtcg.com/rules-and-policy-center/errata-bulletins/>
- Legacy official index: <https://legacy.fabtcg.com/en/resources/rules-and-policy-center/errata-bulletins/>
- Citation form: `Errata Bulletin #N` plus the direct URL below.

## Local archive

The full source text is stored one bulletin per file in
`official-updates/errata/`, with provenance and a source-content hash in each
file's front matter. Bulletin #2 is a legacy-source summary because its
official host is no longer locally resolvable. Search this index first, then
open just the matching bulletin. Normalize the local documents with:

```sh
node .agents/skills/fab-rules/scripts/format-official-updates.ts
```

## Resolution procedure

1. Search this file for the card name, relevant keyword, or mechanic.
2. Read the linked bulletin before relying on a physical printing or release
   note. It contains the exact current wording and any important scope note.
3. Apply the most recent applicable bulletin. A newer clarification about the
   same card takes precedence over an older one.
4. If no listed erratum applies, continue with the current Comprehensive Rules
   and only then a release note.

## Complete bulletin index

| Bulletin | Date                   | Official URL                                                                                         | Affected topics/cards                                                                                                                                                                                                                                                                      |
| -------- | ---------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| #10      | 9 Mar 2026 (effective) | <https://fabtcg.com/articles/errata-bulletin-10/>                                                    | Cheating Scoundrel; Snarky Prick; Helm of Sharp Eye; Merciless Battleaxe; Zephyr Needle; Current Funnel; Earthlore Bounty; Murky Water; Northern Winds; Pummel; Shifting Tides; Thaw.                                                                                                      |
| #9       | 23 May 2024            | <https://legacy.fabtcg.com/en/resources/rules-and-policy-center/errata-bulletins/errata-bulletin-9/> | Bonds of Attraction; Bonds of Memory; Endless Arrow; Gaze the Ages; weapon attacks and go again (Harmonized Kodachi, Mandible Claw, Quicksilver Dagger, Searing Emberblade, Blood on Her Hands, Ironsong Determination). Explicitly **no errata** for Enchanting Melody or Down and Dirty. |
| #8       | 2 Feb 2024             | <https://fabtcg.com/articles/errata-bulletin-8/>                                                     | Heavy Hitters-era bulletin; consult its local archive file for the complete card list and exact wording.                                                                                                                                                                                   |
| #7       | 14 Jul 2023            | <https://legacy.fabtcg.com/en/resources/rules-and-policy-center/errata-bulletins/errata-bulletin-7/> | Lost in Thought; Charge of the Light Brigade; Decimator Great Axe.                                                                                                                                                                                                                         |
| #6       | 15 Mar 2023            | <https://legacy.fabtcg.com/en/resources/rules-and-policy-center/errata-bulletins/errata-bulletin-6/> | Give and Take; Back Heel Kick.                                                                                                                                                                                                                                                             |
| #5       | 3 Oct 2022             | <https://legacy.fabtcg.com/en/resources/rules-and-policy-center/errata-bulletins/errata-bulletin-5/> | Runechant; Quicken; Zephyr Needle; Phantasmal Footsteps; Blossoming Spellblade; Cognition Nodes; Evergreen; Over Loop; Salvage Shot; Timekeeper's Whim; Warmonger's Recital; Fractal Replication; Forked Lightning; Gambler's Gloves; Metacarpus Node; Mordred Tide; four Monarch mentors. |
| #4       | 12 Jan 2022            | <https://legacy.fabtcg.com/en/resources/rules-and-policy-center/errata-bulletins/errata-bulletin-4/> | Briar, Warden of Thorns; Briar.                                                                                                                                                                                                                                                            |
| #3       | 5 Nov 2021             | <https://legacy.fabtcg.com/en/resources/rules-and-policy-center/errata-bulletins/errata-bulletin-3/> | Blizzard.                                                                                                                                                                                                                                                                                  |
| #2       | 4 Jun 2021             | <https://legacy.fabtcg.com/en/resources/rules-and-policy-center/errata-bulletins/functional-errata/> | Seeds of Agony; Vestige of Sol; non-functional Become the Arknight.                                                                                                                                                                                                                        |
| #1       | 1 Sep 2020             | <https://legacy.fabtcg.com/en/resources/rules-and-policy-center/errata-bulletins/errata-bulletin/>   | Ira, Crimson Haze; Gambler's Gloves.                                                                                                                                                                                                                                                       |

## High-value behavior constraints

These compact entries make common conflicts searchable; cite and consult the
linked bulletin for exact wording before implementing card behavior.

- **All errata:** treat every printing as having the errata'd text.
- **#10 — weapon-attack wording:** Helm of Sharp Eye, Merciless Battleaxe, and
  Zephyr Needle refer to the weapon _attack's_ power, not the weapon object's
  power. The bulletin also updates timing/ownership wording for Current Funnel,
  Earthlore Bounty, Murky Water, Northern Winds, Pummel, Shifting Tides, and
  Thaw; load Bulletin #10 for the card-specific constraint.
- **#9 — Bonds of Attraction / Bonds of Memory:** the same color/name
  condition is part of the banish trigger, so the first banish does not gain
  life merely because another banish occurs before resolving triggers.
- **#9 — weapon go again:** the _attack_, not merely the original weapon/card,
  must have go again for the attacker to gain the action point. The named
  weapon effects are worded as their attacks getting go again.
- **#9 — ownership:** Endless Arrow and Gaze the Ages go to their **owner's**
  hand.
- **#7 — Lost in Thought:** the selected attack action is revealed; this
  preserves opponent verifiability even when targeting yourself.
- **#7 — Decimator Great Axe:** the target defending card's halved base defense
  lasts only until end of turn.
- **#6 — Give and Take:** it triggers whenever an action card _defends_, i.e.
  each event of becoming a defending card, not once for a continuing
  `defended` state.
- **#6 — Back Heel Kick:** its Combo power-replacement ability functions while
  the card is face up in any zone, including while it is on the stack.
- **#5 — Runechant / Quicken:** trigger when an attack action is played **or**
  a weapon attack is activated.
- **#5 — Zephyr Needle / Phantasmal Footsteps:** their destruction condition
  triggers while defending, then destroys at combat-chain close; do not defer
  the initial trigger to chain close.
- **#5 — owner-zone principle:** cards returned to a deck by the named effects
  go to their **owner's** deck, not a controller's deck.
- **#5 — Forked Lightning:** its two target assignments are one simultaneous
  damage package; the same hero may be targeted twice.
- **#5 — Fractal Replication:** gains base abilities, base power, and base
  defense from the relevant Illusionist attack action cards, not granted or
  currently-applied abilities.
- **#4 — Briar:** Embodiment of Earth is the first qualifying attack-action
  damage each turn; Embodiment of Lightning is the second non-attack action
  played each turn.
- **#3 — Blizzard:** target the **attack**; its controller pays to avoid losing
  and being unable to gain go again.
- **#2 — Seeds of Agony:** each granted "When you attack" effect is a separate
  triggered effect; prevention can apply to each separate arcane-damage event.
- **#2 — Vestige of Sol:** the Light-pitch resource boost is a replacement
  effect, not a trigger that waits for a later resolution.
- **#1 — Ira, Crimson Haze:** has the Young subtype.
- **#1 / #5 — Gambler's Gloves:** use the newest applicable #5 wording and
  timing, rather than the older #1 wording.
