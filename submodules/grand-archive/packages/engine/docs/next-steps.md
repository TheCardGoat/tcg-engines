# Grand Archive Engine Next Steps

## Engine and Card Checkpoint — 2026-10-08

The nine abilities in the three recorded blocked families now have runtime evidence. The fixes
scope targets for multiple selected modes, allow an omitted optional player target to resolve
without a selection, keep linked-object effects on the correct source, and remove Jovian Hilt X
Ultra's invented entry target. Fatestone tests earn quest counters through card activations and
use the printed transform ability to verify reverse-face keywords.

The continuous-effect pass added evidence for 39 more abilities, including linked bonuses,
class Boons, recovery counters, variable attack power, domain durability, and multiplayer
influence. It also fixed two compiler errors: cost filters now preserve "or more", and
Crystal Accretion affects every qualifying unit without inventing a target. Cost comparisons
are scoped to their own phrase, so an exact memory cost does not inherit a reserve-cost limit.

The Ranged pass added evidence for 26 more abilities. Combat checks cover distant and
non-distant units, matching and non-matching champion classes, and Horse Archer's additive
Equestrian bonus. All 396 tests using the shared Ranged helper pass, as do card types and the
coverage consistency check. This pass did not change production rules or generated definitions.

The Pride pass added evidence for 20 more abilities, including the transformed Windstalker Wolf
and Fabricator Slime's entry replacement. The checks distinguish attack and ability restrictions
from static effects that remain active while disobedient. The 127 affected card tests and 144
focused engine tests pass, along with card types and coverage consistency.

The Class Bonus continuous-effect pass added evidence for 18 abilities. Checks cover power and
life, linked hosts, level scaling, earned static counters, and durability gained from Craft cards
and spent on hits. Matching and non-matching classes are exercised. The 132 affected tests,
card types, and coverage consistency pass.

The Brew pass added evidence for 20 abilities: 16 printed recipes and four brewed entry effects.
Checks reject incomplete, wrong, opposing, or duplicate ingredients and compare Brew with normal
reserve payment. Named ingredients, identical-name Herbs, actions, and allies are included. All
182 tests using the Brew helper pass, as do card types and coverage consistency.

The draw-effect pass added evidence for 24 abilities, including additional payments, opponent
recollection timing, preservation before drawing, and Innervate Knowledge's exact recovery cost.
It fixed Broken Promises' omitted Fatebound ally payment option in the compiler. A public
Cyclonic Fatestone transformation now supplies a valid payment in the regression test.

The Fast Activation pass added evidence for 15 Class Bonus abilities across 90 timing cases.
It fixed an engine precedence error where an action's printed slow speed hid its active Fast
Activation keyword. Card tests check legal-command discovery and direct activation in normal
main-phase, nonempty-stack, and opponent-turn windows. The engine regression also checks that
an action with printed slow speed resolves correctly after Fast Activation admission.

The damage-effect pass added evidence for eight abilities across seven cards. It fixed two
compiler errors: Demolition omitted Siegeable domains from its legal targets, and Cosmic Bolt
omitted bonus damage for named copies in graveyard and banishment. Tests also cover all-unit
damage, phantasia counts, influence changes before resolution, and Flamewreath Call's optional
targets and conditional discount.

The prevention pass added evidence for 17 abilities across 13 cards. The 112 public-action
cases cover buffers versus repeated prevention, combat-only limits, per-ally instances, turn
expiration, static-counter snapshots, damage thresholds, and opposing-source restrictions.
Penumbral Waltz pays earned preparation counters and checks its Tristan token bonus. Aenean
Spark Alight checks class and level gates and bypasses a buffer without consuming it. Card
types and coverage consistency pass. No production rules or definitions changed in this pass.

The first Prepare pass added evidence for 11 abilities across five cards. It fixes Obelith
Escort's prepared summon: the compiler previously included "additional" in the token name.
Public-action tests pay earned preparation counters, reject missing counters, and compare
prepared and declined effects. They check token sheen, damage, banishment-based sheen, on-hit
draw, and Striking Illuminance's memory reveal and power triggers during combat.

The Prepare combat pass added evidence for four abilities and fixed two engine defects.
Unblockable now checks participating attack cards as well as attacking units, so prepared
Find the Lost ignores Taunt and cannot be redirected by Intercept. Explicitly effect-granted
champion attacks do not require base power or a weapon, so Slice and Dice can start its extra
attack before adding its copy. Tests check declined preparation, optional refusal, new targets,
six-power copies, and no repeated copy trigger. The official
[Mercurial Heart release notes](https://www.gatcg.com/article/mercurial-heart-release-notes)
explicitly cover Unblockable on attack cards and Slice and Dice's declaration sequence.

The next Prepare pass added evidence for seven abilities across Final Stroke, Stillshard Strike,
and Spirit Blade: Terminus. It fixes the compiler's Fractured Memories counter amount lookup:
mastery counters live on the player function, not on a named field object. Tests gain the mastery
by materializing Merlin and earn sheen through Spalling Cleanse before checking Terminus's
power, doubling, and memory return. Other tests check Final Stroke's post-hit destruction at
20 damage and Stillshard Strike's recovery using only defending units' sheen.

The final Prepare and mastery-reference pass added evidence for nine abilities across six cards.
Exploit Vulnerability and Silvergale Monstrosity's Call now have public-action evidence for their
prepared effects. The compiler now directs Quiet Refraction, Molten Echo, and Crystallized Anthem
counter awards to the mastery, and reads that mastery for Flickering Afterglow's cost reduction.
Regression tests reproduced all four defects before correction. No generated field-name filter
for Fractured Memories remains; this search does not replace behavior checks for other effects.

The summon-action pass added evidence for 12 abilities across 11 cards. It fixes the compiler's
token-name lists: Floral Arrangement now summons both Herbs, and Apothecary's Harvest summons
all six printed Herbs. The 22 public-action tests check counts, existing tokens, rested entry,
entry counters, reserve payment, and Cryogenic Ritual's required ally sacrifice.

The On Enter summon pass added evidence for 14 abilities across 11 cards. Public activation and
materialization tests distinguish source entry from trigger resolution and check token counts,
rested entry, entry counters, and existing tokens. Two compiler filter defects also had failing
regressions: token status incorrectly required a TOKEN subtype, and card names supplied invented
subtype requirements. Cordelia's Reservable grant, Atmos Armor Type-Ares's power bonus, and Gemini
Starbearer's damage now have public payment and combat/ability evidence for those corrections.

The activated and On Leave summon pass added evidence for four abilities. Cellforger Droid pays
four reserve and rests; Vacuous Call requires Ciel, an ally discard, reserve, and sacrifice.
Glassgale Flock checks earned mastery sheen and the presence of its named ally before summoning.
Deployment Beacon's leave trigger respects Class Bonus and source control. The 30 affected tests,
card types, and coverage consistency pass. No production code changed in this pass.

The level-discount pass added evidence for 15 abilities across 14 cards. Cost tests exercise the
level below, at, and above each threshold with matching and nonmatching classes, verify cards
paid into memory, and reject underpayment without state changes. They exposed Engulf's impossible
attack-and-non-attack filter. The compiler now excludes negated type words from positive type
requirements. Engulf also has resolution tests for ally, Spell, and Skill activations and rejects
attack activations.

The graveyard and field-condition discount pass added evidence for all seven abilities on Tomb
Sweep, Aenean Cyclic Winds, and Rescue the Heir. Tests check level and class gates, own versus
opposing graveyards, Spell-only return, unique-ally control, and zero-cost payment. Cyclic Winds
also checks zero, one, or two wind cards returned from memory and measures Empower on the next
Spell only. All 36 focused tests, card types, and coverage consistency pass. No production code
changed in this pass.

The named-champion discount pass added evidence for ten abilities across nine cards. Tests compare
the named champion with another champion of the same class. Potion Infusion: Animate exposed a
compiler error that interpreted non-regalia Potion as Regalia alone. The target filter now requires
Potion and excludes Regalia. Its regression rejects unrelated targets, animates Potion of Healing,
measures three combat damage, blocks the former activated ability, and measures five recovery from
the new death trigger. Both matching and nonmatching champion names are exercised.

The wither pass added evidence for four abilities across Season's End, Frostlorn Caress, and
Frostnip Pirouette. It fixes Season's End's cost reduction, which incorrectly counted only the
controller's counters. Tests earn counters on both players' objects, check exact payment and a
zero-cost floor, and verify destruction of only marked objects. Other checks cover four counters
on a targeted non-champion object, empty and multiple choices, and duplicate-choice rejection.

Lucia's cost and entry pass added evidence for two abilities across 28 cases. A blank named
champion carrying Dante's reserve-and-rest ability isolates the name gate, zero-cost floor,
source zone, and exclusion of Spell-card and ally-ability payments. Entry tests cover Class Bonus,
short and full decks, optional Spell selection, revealed identities, and ordered remainders.
Tests read the fixture's actual shuffled deck order rather than assuming input-array positions.
No production code changed in this pass.

The banish-to-draw item pass added evidence for ten abilities. Tests verify reserve payment,
banishment before resolution, exact top-card identity, hand versus memory destination, and refusal
to reuse a banished item even with sufficient reserve. Leporine Masque earns omens through Flowing
Oubli, excludes opposing omens and unmarked banished cards, and checks the zero-cost floor. All 23
focused tests, card types, and coverage consistency pass. No production code changed in this pass.

The next-entry pass verifies Collapsing Trap and Freezing Steel across both players, simultaneous
entry batches, unrelated entries, and end-of-turn expiry. It also fixes memory activation for
Collapsing Trap and Scorching Trap: their preparation payment is now a conditional activation
permission and replacement cost, rather than a resolution effect. Twenty focused tests verify
class, turn, counter payment, attacking-unit targets, and damage on resolution. The full CI check
passes with 7,115 card tests and 892 engine tests; three existing engine tests remain skipped.

The next-damage pass adds six covered abilities: Martial Guard, Luster's Shroud, Gearshift
Block, Fortified Mana Shield, Rainwoven Crysalis, and Return to the Depths. Tests check damage
below and above prevention limits, second events, unrelated recipients, expiry, both players'
units, and rejected non-unit targets. Gearshift Block rejects opposing allies and champions;
Fortified Mana Shield does not consume its prevention on combat damage. All 90 affected tests,
card types, and coverage consistency pass. Return to the Depths' separate Ciel bonus remains
outside this pass and still needs timing evidence.

The prevention follow-up pass verifies Hailstorm Guard's exact mill and Spellshield: Exia's
recovery, including expiry, other recipients, second events, and recovery capped by existing
damage. Return to the Depths exposed a compiler defect: its separate Ciel paragraph attempted
to read prevented damage during card resolution. The compiler now links that paragraph to its
prevention effect. A typed `create-reflexive-trigger` effect queues the optional omen as a separate
trigger after prevention, preserving a response window. The card tests cover spell and combat
damage, the threshold, lineage, accepting/declining, and opposing graveyard rejection.
Rules basis: [Reflexive Trigger, rules 1–2](../../../.agents/skills/grand-archive-rules/references/grand-archive-comprehensive-rules/glossary/game-terms.md#reflexive-trigger)
and [Triggered Abilities, rule 11](../../../.agents/skills/grand-archive-rules/references/grand-archive-comprehensive-rules/game-mechanics/game-mechanics-abilities/abilities-triggered-abilities.md).
The linked paragraphs now form one executable ability, so the catalog total decreases by one.
The full CI check passes with 7,231 card tests and 892 engine tests; three existing engine tests
remain skipped.

The Class Locked boon pass adds ten covered abilities across 22 Pantheon tests. Each printed
class is tested separately, including either class of dual-class boons. Non-matching Spirit
champions cannot bestow the boon or discover it as a legal command. Matching champions pay
the exact reserve cost, resolve the bestowment, and gain the face-up boon without changing an
opponent's boon. The focused tests, card types, and coverage consistency pass.
Rules basis: [Class Locked, rules 1–4](../../../.agents/skills/grand-archive-rules/references/grand-archive-comprehensive-rules/glossary/keywords-and-abilities.md#class-locked)
and [Bestowing Boons, checking legality and paying costs](../../../.agents/skills/grand-archive-rules/references/grand-archive-comprehensive-rules/game-mechanics/game-mechanics-playing-cards/playing-cards-bestowing-boons.md).

The Command pass adds thirteen covered abilities across ten cards. Forty-five focused tests
cover eligible allies, wrong types and zones, opposing and rested allies, zero-power attackers,
removed attackers, champion readiness, and combined attack power. En Passant now resolves
without an attacker outside combat and grants its kill trigger only to Chessman Pawns. Two
kills verify that existing buff counters prevent a second grant. Sacrifice Play now accepts only
up to two awake Chessman allies as an activation cost. Its intent-entry replacement applies
+2 power per recorded sacrifice, including tokens that have already ceased to exist, without
inventing another sacrifice during resolution. The full CI check passes with 7,298 card tests and
892 engine tests; three existing engine tests remain skipped.
Rules basis: [Command, rules 1–3 and the damage note](../../../.agents/skills/grand-archive-rules/references/grand-archive-comprehensive-rules/glossary/keywords-and-abilities.md#command).

The destruction pass adds ten covered abilities across nine cards and 52 focused tests. Checks
cover own and opposing targets, Regalia and main-deck equipment, rejected card types and zones,
zero through three targets, duplicate/excess target rejection, and mass destruction with and
without eligible objects. Non-targeted objects remain on the field. Break Apart's additional
Regalia payment is checked against non-Regalia items and weapons. All focused tests, card types,
and coverage consistency pass; this pass changes tests only.

The Level Locked pass adds nine covered boon abilities across 54 tests. Printed levels below,
at, and above the threshold are reached through public materialization of fixture champions.
A continuous +3 level bonus is tested separately and cannot bypass the base-level restriction.
Provocation is tested in the opponent's recollection window with valid targets. This exposed two
engine gaps: player candidate lists now enumerate all eligible opponents in multiplayer, and
bounded reserve-payment enumeration tries a representative at every payment size before
identity alternatives. Affordable high-cost boons such as Enki and Kanaloa remain discoverable.
The full CI check passes with 7,404 card tests and 892 engine tests; three existing engine tests
remain skipped.
Rules basis: [Level Locked, rules 1–4](../../../.agents/skills/grand-archive-rules/references/grand-archive-comprehensive-rules/glossary/keywords-and-abilities.md#level-locked-n).

The Class Bonus materialization pass adds eight covered abilities and 55 new tests. The tests
check insufficient, exact, and excess memory, each printed class separately, and an opposing
matching champion that must not enable the discount. Linked items use valid hosts. All 59 tests
in the eight affected files pass, as do card types and coverage consistency. This pass changes
tests only; the full CI result above belongs to the preceding engine change.

The replacement pass adds eight covered abilities and 53 new tests. Entry counters are checked
before entry triggers resolve, with same-name existing and opposing copies, class independence,
and unrelated later entries. Crusader of Aesa enters rested and wakes on its next turn. Tome of
Abyssal Heaven uses damage dealt after announcement when it enters. Total Whiteout affects
repeated opposing card and token entries while its controller's entries stay awake. Infernal
Vessel checks recovery below, at, and above three, both players, full health, and an inactive
source. All 57 tests in the eight affected files pass, as do card types and coverage consistency.
No production rules or generated definitions changed in this pass.

The Efficiency pass adds nine covered abilities across eight cards. The shared helper now checks
each printed class separately, an opposing matching champion, continuous level bonuses, exact
payment, underpayment, and reduction to zero at and above the printed cost. Incarnate Majesty
also checks the independent banished Regalia weapon discount and its combination with Efficiency;
non-Regalia weapons, non-weapon Regalia, opposing cards, and other zones do not count. The 137
affected tests pass, as do card types and coverage consistency. This pass changes tests only.
Rules basis: [Efficiency, rules 1–2](../../../.agents/skills/grand-archive-rules/references/grand-archive-comprehensive-rules/glossary/keywords-and-abilities.md#efficiency).

The Class Bonus Stealth pass adds eight covered abilities and expands the six existing users of
the shared helper. Each printed class is checked separately. Ordinary attacks are rejected only
when Class Bonus applies; True Sight attacks and targeted spells remain legal. Resolution checks
exact damage or destruction. All 94 tests in the 14 affected files pass, as do card types and
coverage consistency. No production rules or generated definitions changed.
Rules basis: [Stealth 1 and True Sight 1](../../../.agents/skills/grand-archive-rules/references/grand-archive-comprehensive-rules/glossary/keywords-and-abilities.md#stealth).

The Class Bonus entry-draw pass adds nine covered abilities across eight cards. Draws use the
actual deck order and occur only when the separate entry trigger resolves. Each printed class,
the non-matching case, hand and memory destinations, and both deck-size cases are checked.
Vernal Talisman earns preserved cards through combat, rejects missing, duplicate, excess, and
non-preserved payment, and banishes exactly two before its entry draw. All 110 affected tests,
card types, and coverage consistency pass. This pass changes tests only.

The first Radiant Origin pass adds four covered abilities on Cleric and Tamer. The 24 tests earn
training counters through repeated recovery at full health or non-Human ally attacks, while a
Human ally attack does not train Tamer. Checks cover below, at, and above each threshold, class
restrictions, underpayment, exact payment, immediate sacrifice, deferred level-up, no available
successor, and unaffected opposing Origins. Focused tests, card types, and coverage consistency
pass. The remaining five Radiant Origin level-up abilities still need public-action evidence.
Rules basis: [Level Up 1–3](../../../.agents/skills/grand-archive-rules/references/grand-archive-comprehensive-rules/glossary/game-terms.md#level-up).

The next Radiant Origin pass adds six covered abilities on Mage, Guardian, and Ranger. Mage
trains through Empower activations. Guardian trains through four-damage unit hits and ignores a
three-damage hit. Ranger trains when a Ranger becomes distant, while non-Rangers and repeated
distant applications do not add counters. The shared payment and level-up boundary checks pass
for all five covered Origins: 60 tests total, plus card types and coverage consistency. Warrior
and Assassin remain untested. This pass changes tests only.

The final Radiant Origin pass adds Warrior and Assassin's training and level-up abilities.
Warrior earns counters through champion weapon attacks across public turn transitions; ally
attacks do not train it. Assassin earns preparation through Accepted Contract, spends it on
prepared Soultrace Tessellation activations, and gains no training for an unprepared activation.
All seven Origins now have public-action evidence for these two abilities: 84 tests pass, along
with card types and coverage consistency. No production rules or definitions changed.

The Bullet loading pass adds seven covered abilities and extends the shared invalid-target
checks to non-weapons and Guns in the graveyard. Tests verify rest payment, deferred loading,
repeat-activation rejection, loaded-Gun rejection, own-versus-opposing ownership, and movement
into intent when the Gun attacks. All 123 tests across 14 affected card files pass, together with
card types and coverage consistency. This pass changes tests only.

The Ephemerate pass adds eight covered abilities across seven cards. Normal hand activation is
compared with exact-cost graveyard activation, including invalid methods and underpayment.
Actions become ephemeral on the stack, allies on entry, and Classical Opening in intent; each
uses the correct departure destination. Visceral Inversion checks power reduction normally and
life reduction when ephemeral. All 20 affected tests, card types, and coverage consistency pass.
No production definitions or engine code changed.
Rules basis: [Ephemerate 1.1–1.5](../../../.agents/skills/grand-archive-rules/references/grand-archive-comprehensive-rules/glossary/keywords-and-abilities.md#ephemerate).

The entry-counter pass adds seven covered abilities. Tests run each card for both players and
check that preparation, enlighten, buff, or glimmer counters are added to the correct recipient
only when the separate entry trigger resolves. Diao Chan is materialized onto a legal champion
lineage. All 16 affected tests, card types, and coverage consistency pass. This pass changes tests
only.

The starting Glimpse pass adds seven covered champion abilities across 45 tests using real
pre-game completion. Checks cover top, bottom, and split ordering, actual shuffled object IDs,
invalid foreign and duplicate selections, exact hand or memory draws, and unaffected opposing
zones. Mordred draws before Glimpse and is also tested with fewer than four cards remaining;
the Serene and Fortuitous spirits Glimpse before drawing. Focused tests, card types, and coverage
consistency pass. No production rules or definitions changed.

The targeted stat pass adds five covered abilities across four cards and 20 public-action tests.
Bolstering Tempest now restricts targets to Human allies and charges two additional reserve for
each target beyond the first. The compiler recognizes plural target descriptions, and the engine
uses declared targets when evaluating activation costs before the stack item is committed.
Checks cover zero through four targets, either controller, invalid and duplicate targets,
insufficient payment, combat power, and turn expiration. The rules basis is Card Activation
1.5–1.8: declare legal targets before calculating and paying the reserve cost.
The full CI check passes with 7,935 card tests and 892 engine tests; three existing engine tests
remain skipped. Generation reproducibility, rule audit, types, and coverage consistency pass.

The next damage pass adds four covered abilities across Molten Impact, Shock Therapy, and
Unstable Voltage, with 48 public-action tests. Molten Impact previously failed at resolution
because its generated definition used an undeclared X. The compiler now reads the sacrificed
weapon's last-known counter count. Tests repair and use weapons before paying the sacrifice,
reject invalid payments, and verify damage after the weapon's counters have been cleared.
Shock Therapy reads only its controller's enlighten counters at resolution, including counters
gained in response. Unstable Voltage records two six-sided rolls at resolution and deals their
sum to the selected ally; tests cover either controller and destruction at lethal damage.
The durability basis follows Parts of a Card — Stats, Durability 1–4.
The full CI check passes with 7,983 card tests and 892 engine tests; three existing engine tests
remain skipped. Generation reproducibility, rule audit, types, and coverage consistency pass.

The additional-cost damage pass adds four covered abilities across Expunge and Decaying Reproach,
with 26 public-action tests. Expunge now preserves the discarded lineage Curse for its reserve-cost
damage calculation; previously it dealt zero after discarding a nonzero-cost Curse. Tests cover
either card owner and either champion host. Decaying Reproach now rejects the controller's own
wither counters and binds the paid counter selections for its damage calculation. Tests cover
zero through four counters, repeated selections from one object, split payments across opposing
objects, and either champion as the damage target. Its separate Diao Chan ability remains untested.
The full CI check passes with 8,009 card tests and 892 engine tests; three existing engine tests
remain skipped. Generation reproducibility, rule audit, types, and coverage consistency pass.

Flourishing Qi adds two covered abilities across 18 tests. Public Usurp the Winds activations
change Shifting Currents before and during Qi's activation. Checks cover no charge outside the
stack, no charge when changing away from North, repeated four-charge gains when returning to
North, level-plus-charge damage, lethal ally damage, and counter cleanup after resolution.
Copies in hand and graveyard remain unaffected. All 40 tests using the Shifting Currents fixture,
card types, and coverage consistency pass. This pass changes tests only.

The phantasia continuous-effect pass adds three covered abilities across 22 tests. Miasmic Fog
stacks across both players, affects new allies, causes zero-life deaths, and stops applying after
destruction. Maiden of Primal Virtue counts itself and only controlled field phantasias, updates
both stats as sources enter and leave, and deals the resulting combat damage. Acerbica lowers
only its controller's champion level, including negative LV, and its removal restores one level.
Fireball checks the resulting damage before and after removal. Negative LV follows Game Terms,
LV 3; negative damage follows Damage 15. This pass changes tests only.
All 22 focused tests, card types, and coverage consistency pass.

Submerged Fatestone and Fellowship's Gale add five covered abilities across 18 tests. Fatestone
reduces only opposing champions' levels on both faces and stops on removal. Its public
transformation checks Guo Jia, valid Floating Memory payment, invalid selections, and declining
the option. Fellowship's Gale loads only into a controlled Aetherwing, applies its power bonus
on the stack and in intent, and updates combat damage when an ally dies before or during combat.
The loaded card retains printed power outside its functional zone (Abilities 7 and Object-Specific
Zones, Loaded Cards 2–3). Focused tests, card types, and coverage consistency pass; no production
rules or definitions changed.

The Elysian Aura pass adds seven covered abilities across six cards, with 66 new tests. Exact
Efficiency payments and Level 3+/5+ effects verify the non-stacking two-level bonus, while
ordinary Fireball damage and actual champion level remain unchanged. Suppressing the last Aura
source after activation removes the resolution bonus without changing paid costs; another source
keeps it active. This follows Keywords and Abilities, Elysian Aura 1–3. The tests also exposed
Elysian Aspirant applying its damage bonus to ordinary Spells. The compiler now retains both
Aenean and Spell subtype requirements. Positive Aenean damage and ordinary-Spell exclusion are
tested with one and two Aspirants, including public replacement-order choices.
The full CI check passes with 8,133 card tests and 892 engine tests; three existing engine tests
remain skipped. Generation reproducibility, rule audit, types, and coverage consistency pass.

The Gun and Kindle pass adds 13 covered abilities across 12 cards, with 56 new tests. Six Guns
reject unloaded attacks and attack-card combinations, transfer ammunition to intent, deal combined
power, and consume durability. Surviving Guns cannot attack again without a new load. Six Kindle
cards cover every payment count from zero to their limit, invalid fire-card selections, exact
reserve payments, and unchanged printed reserve costs. The Kindle tests exposed Tinderflare Pivot
requiring an already-distant target and omitting its state change. The compiler now makes a legal
Ranger target distant and grants Ranged separately. Combat tests verify additive Ranged and the
different expiration times of the keyword bonus and distant state on an opponent-turn cast.
Rules basis: Functional Weapons 1, Loaded Cards 3, Kindle 1–2, and Ranged 1–2.
The full CI check passes with 8,189 card tests and 892 engine tests; three existing engine tests
remain skipped. Generation reproducibility, rule audit, types, and coverage consistency pass.

The optional Aetherwing loading pass adds five covered abilities and 30 new tests. Checks cover
accepted and declined loading, absent hosts, already-loaded weapons, invalid host ownership,
type and zone, and duplicate selections. Public attacks transfer all loaded cards to intent
and deal combined power before sending the cards to the graveyard. Calibration's Glimpse and
Guided Starlight's opponent payment decision resolve before the loading choice. All 102 tests
across 15 files using the shared helper pass, together with card types and coverage consistency.
This pass changes tests only; it does not change production rules or generated definitions.

The draw-and-discard pass adds five covered abilities and 40 new public-action tests. Tests
verify exact draw order, old and newly drawn discard choices, mixed two-card discards, invalid
zones and ownership, duplicate selections, exact reserve payment, and drawing the last card.
Every shorter-deck boundary now resolves a loss instead of leaving a discard choice or failing
the command. The engine skips private-zone selection operations for players already marked lost
and passes post-resolution Opportunity to a surviving player before state-based checks finish.
Rules basis: Drawing Cards 1–3 and 6; Game Terms, Discard 1–3; Ending the Game 2, 5, and 8.
Full CI passes with 8,259 card tests and 892 engine tests; three existing engine tests remain
skipped. Generation reproducibility, rule audit, all workspace types, and coverage consistency pass.

Gleaming Smolder's Merlin paragraph now has 32 additional public-action tests. The choice accepts
both players' allies and champions, rejects non-units and invalid cardinality, and checks both
old and newly drawn fire discards. Non-fire discards and non-Merlin champions do not qualify;
a previous activation's fire discard cannot satisfy a later activation. The tests exposed an
incorrect own-unit restriction. The compiler now leaves ownership unrestricted, and the stale
maintained override was removed so regeneration uses that compiler branch. All 39 card tests
pass. Rules basis: Objects and Targeting, choice rule 4 (choices during resolution).
Full CI passes with 8,291 card tests and 892 engine tests; three existing engine tests remain
skipped. Generation reproducibility, rule audit, types, and coverage consistency pass.

The suppression and Scavenge pass adds five covered abilities and 101 tests. Suppression checks
cover both players' objects, permitted ally/item/weapon types, all zero-to-three target counts,
Squallsnare's equal-reserve-cost pair, invalid zones, and duplicate targets. Casting during an
end phase returns objects at the following end phase, not the current one. Returned objects
have new incarnations, are awake, and are controlled by their owners. Rondo of the Wind checks
the first ally among six revealed cards, preserves untouched deck order, places the rest at
the bottom through a randomization event, and does not lose on an empty deck. All 103 affected
tests pass, together with card types and coverage consistency. Production code is unchanged.
Rules basis: Game Terms, Suppress 1–3 and Scavenge N 1.

The mill pass adds six covered abilities across five cards and 33 public-action tests. Checks
cover self and opposing player targets, exact top-card order, untouched deck order, empty and
short decks without a draw loss, exact reserve payment, and rejection of invalid player targets.
Primordial Ritual also proves its ally sacrifice occurs as an activation cost and rejects wrong
ownership, type, and count. Dynastic Whirlpool has a three-player Pantheon case: both opponents
mill independently, including one with fewer than fifteen cards, while its controller's deck
stays unchanged. All 33 tests, card types, and coverage consistency pass. Production code is
unchanged. Drawing Cards 4–6 distinguish deck movement from draws and their empty-deck loss.

The awake/distant Stealth pass adds three covered abilities and 24 tests for Proto Archive
Scout, Lurking Assailant, and Hidden Longbowman. Public rest, wake, and Reposition effects establish
the conditions. Ordinary attacks are rejected only while Stealth is active; True Sight attacks
and spells remain legal. Gaining Stealth during combat invalidates an ordinary attack but keeps
a True Sight attack valid, including its damage bonus. All 28 affected tests, card types, and
coverage consistency pass. Production code is unchanged. Rules basis: Stealth 1 and 3, True Sight 1.
The following pass supplies the remaining ephemeral Stealth evidence.

The ephemeral Stealth pass adds three covered abilities and 14 tests for Treacle and Haunting
Apparition. Normal and Ephemerate activations establish the state through public payment actions.
Checks compare ordinary attacks, True Sight, and spells; the state persists into the opponent's
turn and lethal damage banishes an ephemeral ally. Treacle's Alice restriction, reserve cost,
separate hand discard, invalid discard zones and ownership, duplicate selections, and payment-card
reuse are covered. All 16 affected tests, card types, and coverage consistency pass. Production
code is unchanged. Rules basis: Stealth 1, True Sight 1, Ephemerate, and Game Terms, Ephemeral.

The filtered-cost scope pass adds three covered abilities and 38 tests. VelTech Presidential
Card incorrectly discounted the opponent's activations because the compiler omitted the player
subject from "you activate". The compiler now preserves that scope for activation and
materialization; generated Wayfinder's Map and Academy Guide definitions also gain the missing
controller restriction. Unqualified global text remains global: Pendant of Apsis Restraint taxes
Ultimate cards from both players, with additive copies. Tests cover own/opposing sources, inactive
graveyard copies, nonmatching card types (including a VelTech-named non-VelTech ally), exact
payments, and Academy Guide's zero-cost boundary. Full CI passes with 8,489 card tests and
892 engine tests (three existing skips). The 12 additional Academy Guide tests pass separately,
as do updated card types and coverage consistency. Generation reproducibility and rule audit pass.

Ticket to the Afterlife's two discounts now have 21 public-action tests. Maledictum Vitae's
graveyard ability and Haunting Apparition's Ephemerate activation each receive one applicable
discount per controlled Ticket, with a zero-cost boundary for the ability. Hand activations and
Specter abilities on the field retain their full cost. Opposing Tickets and graveyard copies
contribute no discount. Tests reject underpayment and overpayment and verify the remaining
banishment/rest costs. All 21 tests, card types, and coverage consistency pass. Production code
is unchanged; two additional abilities now have behavior evidence.

Nox, Final Release now has 14 cost tests spanning zero through six Curses in its controller's
champion lineage, with both self-owned and opposing-owned Curses placed by public Maledictum Vitae
activations. They exposed a compiler error: the discount counted owned cards in inner-lineage
zones rather than cards hosted by the controller's champion. The compiler now binds "your
champion's lineage" to that champion. Tests exclude a self-owned Curse hosted by the opponent,
graveyard and banishment copies, and hand cards; exact payment rejects both underpayment and
overpayment, including the zero-cost boundary. All 14 focused tests pass. Full CI passes with
8,536 card tests and 892 engine tests (three existing skips), generation reproducibility, rule
audit, all workspace types, and coverage consistency.

Powerforged Burst now has eight tests for X from zero through three against allies and champions.
They exposed a missing maximum in the generated additional cost. The compiler now preserves the
chosen-variable bound with the sacrifice cost. Tests reject negative, fractional, and excessive X,
wrong counts, duplicate selections, opposing Powercells, and non-Powercell objects without changing
state. Valid activations sacrifice before resolution, deal X separate two-damage hits, and draw into
memory only at X = 3. All eight focused tests pass. Full CI passes with 8,544 card tests and 892 engine tests
(three existing skips), generation reproducibility, rule audit, all workspace types, and coverage
consistency.

Queen's Gambit now has four public-activation tests using Queen and Pawn cards and tokens. The
Queen Piece case exposed missing last-known information in the sacrificed-object condition after
the token ceased to exist. The condition type and evaluator now support an explicit last-known
basis; the compiler emits it for "the sacrificed ally/object was". Queen cards and tokens summon
three Pawns, while Pawn sacrifices do not. The tests also check memory draws and Golden Pawn's
separate death draw. Five additional tests cover Freezing Gambit, Veiled Gambit, and Fling Food
costs, including invalid owners, zones, types, counts, duplicate choices, insufficient reserve,
and sacrifice before resolution. All 13 focused tests (nine new), card types, and coverage writing
pass. Full CI passes with 8,553 card tests and 892 engine tests (three existing skips),
generation reproducibility, rule audit, all workspace types, and coverage consistency.
The sacrifice check follows
[Last-Known Information 1](https://rules.gatcg.com/game-mechanics/game-mechanics-card-and-object-information).

Veiled Gambit now has 17 additional prevention tests. They exposed two compiler errors: the
optional "other" target could be the already-protected champion, and both recipients shared one
four-point capacity. The compiler now excludes the controller's champion from that target and
uses a per-object buffer. Tests cover no optional target, own and opposing allies, the opposing
champion, both damage orders, unpreventable damage, repeated hits, unaffected units, and expiry
at turn end. All 19 card tests pass. Full CI passes with 8,570 card tests and 892 engine tests
(three existing skips), generation reproducibility, rule audit, all workspace types, and coverage
consistency. Rules basis:
[Damage Prevention](https://rules.gatcg.com/game-mechanics/game-mechanics-damage-prevention).

Freezing Gambit now has eight additional tests across its modes. They exposed a compiler error:
"target unit's attacks" created a future attack trigger and missed an attack already in progress.
The compiler now creates a continuous attacks-by modifier for the turn; explicit next-attack
wording retains its one-use trigger. Tests cover one- and four-power allies, casting before and
during combat, a second attack after waking the ally, expiry, payment or refusal of the negate
mode, combined modes, and invalid mode/payment declarations. All ten focused card tests and card
types pass. Full CI passes with 8,578 card tests and 892 engine tests (three existing skips),
generation reproducibility, rule audit, all workspace types, and coverage consistency.
The five related cards now have direct attack-reduction tests: Black Ice Spellweaver, Dissuading
Aether, Dissuading Halt, Wand of Frost, and Corhazi Trapper. Thirty new combat tests cover low-
and higher-power allies, champions attacking with a weapon, current and later attacks, other
unaffected attackers, expiry, invalid targets, and each printed cost. Corhazi Trapper's preparation
is obtained through a public card activation; a missing counter and repeat activation fail
without changing state. Six additional Dissuading Aether cases verify optional loading with no
host, acceptance/refusal, and preloaded weapons. All 46 affected tests, card types, and coverage
consistency pass. No production changes were needed in this follow-up.

The continuous player-state group now has 17 public-action tests. Nine three-player Pantheon
tests verify that Lesser Boons of Agni, Notus, and Poseidon enable only their named element,
only after bestowal, and only for their controller. Four Sanctuary tests verify enabling fire,
water, and wind, excluding Umbra and opponents, and losing the permission after upkeep sacrifices
the domain. Four Void's Cloak tests cover either controller, one or two sources, Spell player
target rejection, legal Skill player targets and Spell champion targets, and removal of all
active sources. All 17 focused tests, card types, and coverage consistency pass. No production
changes were needed; Sanctuary's other upkeep cases remain unverified.

Spirit of Slime and Spirit of Chess exposed a missing base-champion inheritance path. The engine
stores the original champion definition on the persistent field object, while only later level
cards have separate inner-lineage instances. Reading only the current face omitted the original
Spirit's inherited abilities. The shared ability reader now includes only inherited abilities
from that base card when a real level-up lineage exists, executed by the field champion. It drops
them again after deleveling and preserves ordinary current-face abilities. Rule and continuous
ability readers use that common path. Sixty-six new tests cover both Spirits across zero, one,
and three levels; matching basic subtypes, nonmatching types and advanced exclusions; opponent
isolation; exact reserve costs; public level-up and delevel transitions; and Silvie, Slime
Sovereign's advanced Slime permission only while she is current. All 71 focused tests pass.
Full CI passes with 8,697 card tests and 892 engine tests (three existing skips), generation
reproducibility, rule audit, all workspace types, and coverage consistency.

Lesser Boons of Flock and Rosen now have 15 three-player Pantheon tests. They cover concealed
and bestowed states, exact bestowal costs, basic and advanced subtype limits, and controller
scope. Flock summons one Fledgling. Rosen's Powercell ability pays exactly three reserve,
summons a rested token on resolution, and rejects repeat use both before resolution and on a
later turn. All focused tests, card types, and coverage consistency pass. No production changes
were needed.

The Phantasmagoria pass fixes three compiler errors: Alice, Distorted Queen's entry counters
now go to the gained mastery; Drown in Sorrow targets the mastery rather than a field object;
and Remnant of Will splits its counter and recovery clauses instead of treating the recovery
text as part of an object name. Nine new public-action tests cover materialization, starting haunt,
normal and Ephemerate activation, exact reserve costs, recovery from six damage, controller
scope, and action banishment. Non-Alice controllers cannot use these Ephemerate abilities.
The shared mastery fix also corrects Oneiric Key and Drifting Abysshell, whose entry effects
have focused tests. Full CI passes with 8,718 card tests and 892 engine tests (three existing
skips), generation reproducibility, rule audit, all workspace types, and coverage consistency.
The three tests added after that suite started pass separately, as do final card types and
coverage consistency. The rules basis is Mastery, General Rules 1–3
and Phantasmagoria 1, plus Keywords and Abilities, Ephemerate 1.1–1.4.

The remaining champion-dependent Ephemerate pass found an engine defect in whole-deck milling:
the generic amount evaluator treated "all" as an event amount and failed outside an event.
The mill executor now takes each affected player's current deck size for that instruction.
Fifteen new tests cover Grave Gateau, Molten Echo, and Distort Reality: matching versus opposing
champion identity, normal and graveyard activation, exact reserve payments, action and item
ephemeral lifetimes, Gateau's rested entry and sacrifice, whole-deck movement, and Distort
Reality's optional selection with the thirty-reserve aggregate limit. Duplicate, opposing,
non-Specter, and over-budget selections are rejected. All 19 focused tests pass. Full CI also
passes with 8,736 card tests, 892 engine tests (three existing skips), generation reproducibility,
rule audit, all workspace types, and coverage consistency.

The Starcalling pass adds fifteen public-action tests for Meteor Strike, Cosmic Focus, Lunar
Seer, Cosmic Bolt, and Dwarf Star's Glow. They compare normal activation with Starcalling on
either player's turn, reject direct deck activation outside Glimpse, enforce exact alternative
costs including zero, and validate looked-at cards, bottom piles, and targets. Tests check the
resulting deck order and stack state, Meteor Strike's two distinct effects, damage, ally entry,
and Dwarf Star's Glow moving to memory only when starcalled. All 33 affected tests, card types,
and coverage consistency pass. No production change was needed. Rules basis: Keywords and
Abilities, Starcalling 1–6. Cosmic Focus's Ranged branch and optional deck return remain untested.

The Retort pass adds fifteen public-action tests for Two, Three, and Four of Diamonds, Fluvial
Fatestone, and Companion Fatestone. They check normal attack power, bonus retaliation damage,
declined retaliation, and a later normal attack without the bonus. Fluvial transforms through
its paid ability. Companion transforms after the transformed Fluvial ally dies to Spark Alight;
no test sets the reverse face directly. All fifteen tests, card types, and coverage consistency
pass. No production change was needed. Rules basis: Keywords and Abilities, Retort 1.

The class-dependent entry keyword pass adds 32 tests for Tidestone Seeker, Winbless Lookout,
Pleiades, Celestial Genesis, Magus Initiate, and Devoted Bloomweaver. Glimpse tests compare
matching and non-matching classes, short decks, and top versus bottom placement. The shared
helper now submits public trigger-order choices when two entry abilities trigger. Empower tests
verify that a non-Spell does not consume the effect, only the next Spell gets the level bonus,
and the effect expires at turn end. All 34 focused tests and 87 tests using the Glimpse helper
pass, along with card types and coverage consistency. No production change was needed.

Blight's Ring now has four public-action tests covering either player's champion as host,
exact reserve payment, champion-only unique targets, rest payment, memory draw, and insertion
into lineage. Its inherited damage follows the host's recollection, repeats on later turns,
and ignores an unassigned Ring left on the field. Penumbral Waltz does not prevent the damage
or lose buffer capacity: three later Fireballs are prevented and the fourth deals damage.
All four tests, card types, and coverage consistency pass. No production change was needed.

Ten new phase-damage tests cover Lycoria, Blast Shield, and Blood Dragon's Pact. They verify
recollection versus end-phase timing, no opponent-phase trigger, repeated own-turn triggers,
and controller scope with own or opposing linked allies. Penumbral Waltz prevents Blast Shield's
damage but cannot prevent the other two effects; subsequent Fireballs prove the remaining
buffer capacity. Blast Shield is materialized and Pact is activated with public Link targets.
All 20 affected tests, card types, and coverage consistency pass. No production change was needed.

Haunting Demise now has eight public-action tests comparing matching classes, champion versus
ally hits, and fully prevented champion damage. Only a successful champion hit with Class Bonus
places the card in the hit champion's lineage. Tests follow the host's recollection twice and
verify no damage during the original controller's recollection. Penumbral Waltz cannot prevent
the inherited damage and retains its buffer for three later Fireballs. All eight tests, card
types, and coverage consistency pass. No production change was needed.

The Aenean damage-level pass adds 64 tests for Scorching Comet and Frostlance. Nine Frostlance
cases exposed early evaluation of an ability modifier's target-dependent condition before
target bindings existed. Modifier composition now retains a conditional instruction with the
previous effect as its fallback, so the condition uses the target's state at resolution.
Tests cover both classes, levels two, three, five, and six, champion and ally targets, lethal
damage, and targets rested or awakened in response. Each effect deals one damage event with
the correct replacement amount rather than combining tiers. All 72 focused tests pass. Full CI
passes with 8,884 card tests, 892 engine tests (three existing skips), generation reproducibility,
rule audit, all workspace types, and coverage consistency.

The four Fabled Fatestone transform abilities now have 32 payment-boundary tests. They earn
quest counters through Whirlwind Threads, compare zero, insufficient, exact, and excess counters,
and accept or decline the optional payment. Rest is paid before resolution and prevents repeat
activation. Successful payment removes only the printed number, transforms the same object,
wakes it, and permits an immediate attack with its printed reverse-face power. All 42 affected
tests, card types, and coverage consistency pass. No production change was needed.

The Serene Fire, Wind, and Water spirits now have 12 release tests using actual public level-up.
The original champion card was implicit in the persistent field object, which hid its Lineage
Release ability after level-up. Activation now separates that original card before paying its
banish cost, while preserving the current champion. Inherited abilities, element access, lineage
counts, delevel rules, projection, and snapshots recognize the separated base card. Tests verify
zero, partial, and excess recovery; immediate cost payment; legal-command discovery; opponent
and repeat-use rejection; element loss; lineage count changes; and snapshot round trips.
All 30 focused Spirit tests pass. Full CI passes with 8,928 card tests and 892 engine tests
(three existing skips), generation reproducibility, rule audit, workspace types, and coverage
consistency.

Alice, Distorted Queen now has eight release tests using public level-up, attacks, and responses.
Two initial cases recovered only three regardless of remaining lineage size. The compiler now
resolves the source champion's named lineage in a Lineage Release instruction through the
controller's champion, rather than through the released card. Tests cover two lineage sizes,
zero and partial recovery, banish payment, opponent and repeat-use rejection, and a Serene Spirit
released in response. The response cases prove Alice counts the remaining lineage at resolution.
All nine Alice tests, card types, and coverage consistency pass. Full CI passes with 8,936
card tests and 892 engine tests (three existing skips), generation reproducibility, rule audit,
workspace types, and coverage consistency. The six subsequently added Nameless Champion tests
also pass separately.
Rules basis: Keywords and Abilities, Lineage Release 1–3; Game Terms, Lineage 1;
and Resolving Triggered and Activated Abilities, General Rules 1.

The three PRD Nameless Champion variants now use the existing public-action contract. Six tests
verify rejected level-up, rejected underpayment, exact six-card payment, delayed draw and level
counter effects, and rejected repeat activation. Focused tests, card types, and coverage pass.
Merlin, Amethyst's Glow now has four public-action discount tests. They gain Fractured Memories
through Memorite Vassal, level into Amethyst's Glow, and earn zero, two, eight, or ten mastery
sheen counters through Rainwoven Crysalis. Tests verify costs of nine, seven, one, and zero;
wrong-payment and opponent rejection; delayed draw and preparation; unspent sheen; and the
once-only limit on the same and a later turn. Sheen on the opposing champion does not discount
the ability. All 27 tests using the extended mastery fixture pass, along with card types and
coverage consistency. No production change was needed.

Eight new champion-bonus tests cover Rainwoven Crysalis, Journey's Beginning, Searing Truth,
and Broken Promises. Guo Jia tests compare matching and non-matching controllers, with the
opponent using the opposite lineage, and cast twice to verify cumulative own-champion quest
counters. Rainwoven tests gain a mastery and publicly level into Merlin or a different lineage;
only current Merlin gains mastery sheen, even though Memorite Vassal remains beneath either
champion. They also verify delayed counter placement and no counter placement on the champion.
All 23 affected tests, card types, and coverage consistency pass. No production change was needed.

Thirty new tests cover the class-and-level draw bonuses on Stabilizing Capacitance, Aenean
Reclaim, Aenean Frozen Shunt, and Aenean Swelling Gusts. They compare matching and non-matching
classes at the level immediately below, at, and above each threshold, then verify the exact
card and destination while leaving the opponent's deck unchanged. Frozen Shunt is also played
during a declared attack, above a pending Spark Alight. It ends combat and banishes the pending
spell without damage, while still drawing into memory if both bonus requirements hold. All 36
affected tests, card types, and coverage consistency pass. No production change was needed.

Cone of Frost now has 42 tests covering levels zero through six, both class states, omitted
targets, distinct targets across both sides, and repeated-target rejection. The engine already
correctly enforces unique targets across the activation (Objects and Targeting, Targeting 1.1);
the initial repeated-target expectation was corrected against that rule. Active clauses each
deal two damage, and inactive clauses add no target requirement or damage.

Unruled Bereavement now has 12 tests at levels six, seven, and eight with both class states and
same-turn versus expired effects. Its damage reaches both players' allies, kills small allies,
and leaves champions unharmed. The two deaths each grant Empower 2 to the next Spell; a second
Spell gets no bonus. After turn end, the prior Empower effects expire and a new ally death does
not grant another bonus. All 56 affected tests, card types, and coverage consistency pass.
No production change was needed.

Otherworldly Possessions exposed a shared distinct-count defect: objects without a reserve cost
contributed an extra stringified undefined value. The evaluator now skips missing reserve costs
while retaining actual zero costs. Four public-action tests cover no reserve-cost objects,
memory-only objects, duplicate costs across field and graveyard, and mixed costs. They exclude
opponent zones, hand, memory, banishment, and deck, and show that the first copy contributes its
cost only after resolving into the graveyard before the second copy is cast.

Twelve further tests cover Elucidate Plans, Guerrilla Advantage, and Develop Mana. They verify
counter placement only on resolution, repeated-cast accumulation, controller scope, wrong-payment
rejection, and Guerrilla's class-dependent discount at one through four opposing units. Develop
Mana's two level counters also increase a subsequent Fireball's damage without being consumed.
All 23 tests using the counter helper or distinct-cost card pass. The existing counter helper
interface is preserved; the repeated-cast contract is a separate exported function. Full CI
passes with 9,056 card tests and 892 engine tests (three existing skips), generation reproducibility,
rule audit, workspace types, and coverage consistency.

Eight new draw-and-preparation tests cover Ethereal Absorption, Sinister Composure, Undeniable
Truth, and Surveil the Winds. They verify exact draw identity and order, delayed counter placement,
repeated-cast accumulation, and controller scope across matching and non-matching classes.
The additional-cost cases reject missing, wrong-type, and opposing payments; successful regalia
return or ally sacrifice occurs before draw and counter effects. All 14 affected tests, card
types, and coverage consistency pass. These additions require no further production change.

Forty-two recovery tests cover Aenean Swelling Tides, Bandage Wound, Auspicious Feast, and
Petalfall Embrace. Champions take damage through public attacks before recovery; a separate
same-turn Spark Alight marks ally damage so the tests can verify that recovery leaves allies
unchanged. Cases cover zero, partial, and excess champion damage, both class states, and levels
around Tides' bonus threshold. Both-player effects recover the opposing champion too, and
Petalfall uses the caster's level for both players despite the opponent having a different level.
All 44 affected tests, card types, and coverage consistency pass. No production change was needed.
Rules basis: Game Terms, Recover 1–2, including the limit on removable damage counters.

The Greater Boons of Horses, Detachment, Inari, and Isis now have 48 class-and-level lock tests
in three-player Pantheon games. Champions level through public materializations before bestowal.
Cases compare matching and non-matching classes at printed levels one, two, and three, with and
without a continuous +3 level bonus. Legal-command discovery agrees with direct admission;
rejected attempts leave state and face-down boons unchanged, and successful bestowals pay reserve
and turn the boon face up. Level Locked uses printed level, so continuous bonuses do not bypass it.
All 102 tests across the 13 files using the helper pass, along with card types and coverage
consistency. No production change was needed.
Rules basis: Keywords and Abilities, Class Locked 1 and Level Locked 1.

Twenty-four new tests cover the activation-phase restrictions on Peer the Depths, Stand Fast,
Slime Calling, and Orchestrated Seizure. Public passes reach each player's main, recollection,
and end phases with the acting player holding opportunity. Legal-command discovery agrees with
direct admission in all six timing cases per card. Rejected attempts preserve state; allowed
attempts pay the exact reserve cost and place the card and activation on the Effects Stack.
These tests cover activation restrictions, not the remaining resolution paragraphs. All 24
focused tests, card types, and coverage consistency pass. No production change was needed.

Golden Rook exposed a compiler defect: the described-card filter discarded an even-life
qualification and retained only the unit type. The compiler now preserves even/odd life, power,
and level stat qualifications as typed parity filters. Regeneration corrects Golden Rook,
Weiss Bishop, Schwartz Castler, and Lily, Marine Castellan.

Forty new tests cover those four cards plus Siege Mauler, Epochal Conqueror, and Piccarda,
Night Rider. Attack tests compare champions, allies, and Siegeable domains; assert actual damage
or durability loss; and verify power returns to its base value after combat. Golden Rook also
uses current life after one or two public buff-counter additions. Weiss tests compare Alice and
non-Alice lineages, Schwartz tests require an opposing even-life unit, and Lily tests accept or
decline its memory return only when the life condition is met. All 41 affected tests, card types,
and coverage consistency pass. Full CI passes with 9,198 card tests and 892 engine tests
(three existing skips), generation reproducibility, rule audit, workspace types, and coverage
consistency. The later-added cases for the three related cards also pass in the focused run.

The Deluge pass adds evidence for Current Groover, Fountain Bladehand, Floodborne Warrior,
and Soaked Slash. Tests cover below, at, and above the WATER graveyard threshold, exclude
opposing graveyards and other zones, and change the threshold through public card activations.
Combat damage follows the current bonus. Damaged allies die when a lost life bonus makes
their damage lethal. All 22 focused tests, card types, and coverage consistency pass. This
pass changes no production rules or definitions.

The entry-choice pass adds evidence for Optical Control, Business Card, Stifling Gyre,
and Jianyu, Fate's Premonition. Public activations pause before field entry for the controller's
choice. Invalid names, non-ally names where restricted, wrong characteristic values, and
opponent answers are rejected without state changes. The selected value is retained for the
new field incarnation. Optical Control and Jianyu tests then pay real activation costs to
check matching versus other choices, both players, and Jianyu's own phantasia count. The
24 affected tests (20 new), card types, and coverage consistency pass. No production changes
were needed in this pass. Business Card's scavenge and Stifling Gyre's trigger tax remain
separate behaviors to verify.

The Business Card pass fixes a runtime loss of its chosen ally name when sacrifice pays its
activated ability cost. Activated abilities now capture the source incarnation's tracked
choices before payment. Scavenge can use that name after the source leaves the field. Six
ordered-deck cases fail without the capture and pass with it. The 14 focused card tests cover
first-match stopping, wrong ally names, exact 8/20 limits, no match, an opponent's Phone,
upfront sacrifice/payment, and bottoming only the revealed remainder. The fixture now offers
an opt-in main-deck order; two engine tests check order and distinct copies across deck/hand.
Full workspace CI passes for this pass, including generation reproducibility, types, coverage,
and all card and engine tests (three existing engine skips).

The entry-choice follow-up verifies Stifling Gyre's tax on both players' matching ally entry
triggers. Declining negates only the trigger, paying four allows it to resolve, and a partial
payment is rejected without changes. Other ally names are not taxed. Optical Control stays
through the opponent's recollection, then sacrifices and draws at its controller's recollection;
an opposing action can then activate at its normal cost. All 19 affected tests (nine new),
card types, and coverage consistency pass. No production changes were needed.

The subtype-selection pass fixes dropped qualifiers in adjacent subtype descriptions, such
as DisCorp Automaton and Suited Spell. Both qualifications now remain in generated filters.
Subtype alternatives retain both options after a trailing "card" is removed; words such as
"Other" do not become invented subtypes. Selection parsing also recognizes hand and/or memory.
Tower of Dis tests check both subtypes, controller scope, combat damage, and bonus removal
when attacks destroy the domain. Hoarfrost Hold tests check class gates, empty/hand/memory/mixed
choices, wrong subtypes, opponent cards, and frost counters. All 12 focused tests pass. The
compiler changes update 26 card definitions. Full workspace CI passes, including generation
reproducibility, rule audit, types, coverage, and all card and engine tests (three existing
engine skips).

The linked-count and base-power pass adds evidence for VelTech Gear Hoarder and Cheshire Cat,
Impish Grin. Six Hoarder cases link zero, one, or two VelTech items to an own or opposing
Hoarder, exclude non-VelTech links and items on other hosts, attack, and remove a linked item.
Six Cheshire cases compare no/one/two Distortion weapons, ignore opposing and off-field
weapons, distinguish base power from Inert Sword's current class bonus, materialize another
weapon, attack, and destroy a weapon. All 13 affected tests (12 new), card types, and coverage
consistency pass. No production rules or definitions changed.

The Class Bonus Ephemerate pass adds evidence for seven abilities across Vantage Point,
Singeing Leap, Ghastly Slime, and Indissoluble Fractal. Tests compare normal hand activation
with graveyard Ephemerate for matching and nonmatching classes, reject underpayment and the
wrong activation method, and check exact memory payment. Actions become ephemeral on the
stack; allies and phantasias do so on field entry. Combat or destruction sends ephemeral
objects to banishment and clears that state, while ordinary copies go to the graveyard.
The tests also verify distant, Singeing Leap's damage, and Ghastly Slime's power bonus. All
16 focused tests, card types, and coverage consistency pass. No production changes were needed.

The Class Bonus Taunt pass adds evidence for Bandersnatch, Frumious Foe; Vigilant Sentry;
Sworn Windhand; and Verdant Slime. Each card has 16 cases for matching/nonmatching champion
classes, awake/rested status, and attacks against its champion, another ally, a domain, or the
Taunt unit itself. Public Glacial Guidance activations rest the unit. Legal-command discovery
and direct attack validation agree; rejected attacks preserve state, and allowed attacks deal
damage or remove domain durability. All 66 affected tests (64 new), card types, and coverage
consistency pass. No production changes were needed.

The level-restricted Floating Memory pass adds evidence for Spark Link, Kingdom's Divide,
Dredging Streams, and Calming Breeze. Tests use levels below, at, and above each threshold,
with either champion lineage levels or continuous level bonuses. They reject hand, opposing,
non-keyword, and duplicate sources without state changes. Valid payment banishes one own
graveyard card immediately and preserves memory; below-threshold rejection still permits
ordinary memory payment. Later-turn checks reject reuse of the banished card. All 27 affected
tests (24 new), card types, and coverage consistency pass. No production changes were needed.

The Commanded Will pass adds evidence for Rowland, Schwartz Knight; Weiss Knight; Lily,
Marine Castellan; and Schwartz Castler. Tests compare normal attacks, the unit's own Command
attack, and another unit's Command attack, with matching and nonmatching champion classes.
They found that combat added the bonus to damage while numeric queries returned unchanged
unit power. The engine now applies Commanded Will in continuous power derivation and removes
the duplicate damage addition. All 32 affected tests (24 new) pass, including power before,
during, and after combat, opposing-unit isolation, and exact combat damage. Full workspace CI
passes: generation reproducibility, rule audit, types, coverage consistency, 9,431 card tests,
and 894 engine tests; three existing engine tests remain skipped.

The Class Bonus Foster pass adds evidence for Recruitment Officer, Tidebreaker Sentinel,
Sunglory Sentinel, and Rilewind Sentinel. Each card has six cases for matching/nonmatching
champion classes and no damage, damage to the source, or damage to another ally. Public
combat damage prevents Foster even after cleanup removes its damage marks. A later turn
without damage permits Foster; the opponent's recollection does not trigger it. The tests
resolve Foster itself and leave separate On Foster rewards outside this coverage claim.
All 24 tests, card types, and coverage consistency pass. No production changes were needed.
The Recruitment Officer follow-up confirms and fixes its On Foster selection defect. The
compiler missed the phrase "the rest of the cards" and produced a hand reveal without moving
an ally from the looked-at cards. The existing top-card selection parser now accepts that
wording. Only Recruitment Officer's generated definition changes. Eight new cases cover
matching/nonmatching classes, taking an ally, declining, no eligible ally, short decks, invalid
sources, exact bottom ordering, and reveal events. All 14 Recruitment Officer tests pass.
Full workspace CI passes: generation reproducibility, rule audit, types, coverage consistency,
9,463 card tests, and 894 engine tests; three existing engine tests remain skipped.

The Class Bonus Intercept pass adds evidence for Crusader of Aesa, Esteemed Knight, Imperial
Sentry, and Mistsworn Magister. Each card has ten cases for matching/nonmatching champion
classes and accepting, declining, being rested, or attacks targeting another ally or the
Intercept source itself. Glacial Guidance rests the source through public activation. Tests
check trigger creation, the defender's optional choice, exact combat targets, unchanged rested
status after redirection, and damage on the final target. All 41 affected tests (40 new), card
types, and coverage consistency pass. No production changes were needed.

The entry-counter pass adds evidence for Floodward Steed, Golden Measure Patisserie, Merlin,
Amethyst's Glow, and Companion Fatestone. Public activations and Merlin materialization check
own/opposing recipients, unit versus ally limits, nonfield rejection, exact counter counts,
buff stat changes, and bulwark consumption followed by an unprevented second attack.
Companion Fatestone had an invented announcement target that excluded itself and accepted
ordinary allies. The compiler now creates a resolution choice between the source and an own
Fatebound ally. Tests transform Fluvial Fatestone through its printed ability and reject another
Companion copy, ordinary allies, opposing allies, and a champion. Only Companion's generated
definition changes. All 21 affected tests (11 new) pass. Full workspace CI passes: generation
reproducibility, rule audit, types, coverage consistency, 9,514 card tests, and 894 engine tests;
three existing engine tests remain skipped.

The Boon draw pass adds evidence for Greater Boons of Enki, Parvati, Shou, and Astraeus.
Enki, Parvati, and Shou extend existing three-player Level Locked tests with exact hand and
deck deltas, opponent-deck isolation, and rejection of a second bestow. Astraeus has six new
public-action cases for zero through three suppressed objects, two objects from one Scattering
Gusts activation, an opponent's suppression in the same turn, and an earlier turn's suppression.
It draws at most two cards and counts only its controller's actions this turn. All 102 tests
using the shared Boon helper pass, as do the six Astraeus cases, card types, and coverage
consistency. No production changes were needed.

The entry-mill pass adds evidence for Ardus, Floodborne Deacon; Deep Sea Fractal; Plage aux
Homards; and Tidal Fractal. Nineteen fixture cases check exact top-card identities, preserved
graveyard contents, empty/short/full decks, own/opposing player selection, invalid nonplayer
targets, and no deck-out loss from milling an empty deck. A separate three-player Pantheon
case proves Deep Sea Fractal mills one card for every player. All 20 tests, card types, and
coverage consistency pass. No production changes were needed.

The Avatar sacrifice pass adds evidence for Genbu, Suzaku, and Byakko. Each card has eight
cases for Guo Jia versus a different champion and material-deck, banishment, decline, or absent
Fatestone outcomes. Tests reject underpayment and opposing activation, prove sacrifice and
reserve payment happen before resolution, award exactly two quest counters only to the own
champion, and reject another activation after sacrifice. Named-card selection rejects wrong
names, hand/graveyard copies, and opposing cards. The chosen Fatestone enters on its default
face while the other eligible copy stays in place. All 24 tests, card types, and coverage
consistency pass. No production changes were needed.

The reserve-transform pass adds evidence for Lavaplume Fatestone, Fatestone of Progress, and
Fatestone of Revelations. Twelve cases verify Guo Jia identity, opposing activation rejection,
underpayment and overpayment, and Revelations' current-level discount at levels zero, three,
six, and eight, including a zero-cost floor. Payment precedes transformation; the source stays
on the field with the same incarnation and remains awake. The new ally has its reverse-face
power/life, deals that power in combat, and cannot reuse the front-face transform ability.
All 12 tests, card types, and coverage consistency pass. No production changes were needed.

The Bloom discard pass adds evidence for Summer's Glow, Winter's Chill, and Autumn's Fall.
All nine valid activations initially failed because the compiler omitted the hand functional
zone. Abilities that require discarding their source now compile with an explicit hand zone,
unless they already declare a zone. This updates the three Blooms, Auspicious Manifestation,
Decaying Reproach, and Regulus Blitz. Eighteen Bloom cases verify element identity independently
of enabled elements, wrong-zone/opponent rejection, reserve payment plus discard before
resolution, exact draw, additive Empower, end-of-turn expiration, non-Spell preservation,
and consumption by only the next Spell. Fireball damage proves the effective level bonus
without changing the champion's actual level. All 18 focused tests pass. Full workspace CI
passes: generation reproducibility, rule audit, types, coverage consistency, 9,594 card tests,
and 894 engine tests; three existing engine tests remain skipped.

The banishment-keyword pass adds evidence for Necklace of Foresight, Shard of Empowerment,
and both Seed of Empowerment abilities. Seed earns zero, one, or three refinement counters
through normal recollection phases; after banishment clears its counters, the next Fireball
still uses the previous count. Tests also prove expiration, non-Spell preservation, and
single-Spell consumption. Necklace checks Glimpse 4 with zero, two, four, or six cards and
top, bottom, or split ordering, rejecting opposing cards and cards outside the looked-at set.
All cases reject opposing activation and reuse after the source is banished. All 26 affected
tests (20 new), card types, and coverage consistency pass. No production changes were needed.

The sacrifice-recovery follow-up adds evidence for Exquisite Dessert, Delicious Pastry, and
both Extinguishing Synchron abilities. Dessert and Pastry recover after sacrifice, bounded at
zero damage. Synchron earns zero, one, or three refinement counters from own or opposing fire
actions damaging its champion, while damage to another champion or ally and the tested combat
damage do not add counters. Its Regalia sacrifice banishes it before recovery; the old counter
count still produces Recover 2+X after the source's counters clear. Opposing champion and ally
damage remain unchanged. All 12 new tests, card types, and coverage consistency pass. No
production changes were needed.

The Tristan summon pass adds evidence for Grim Foreboding, Shifting Mirage, and both Curtain
of Shadows abilities. Tests check matching and non-matching champions, zero/one/three preparation
counters, exact token counts, existing tokens, and opposing tokens. Curtain exposed recursive
characteristic scans caused by its granted On Hit ability. Static-effect collection now skips
grants with no static effects, including composite grants containing only non-static components;
static grants, ability removal, and copies retain their prior path. The 12 focused tests pass,
including Curtain's +1 power on existing and new Shadows and an On Hit preparation counter.
The rules basis is Continuous Effects, Layers 2.4-2.5: ability grants and numeric modifiers
remain distinct layer operations. The full CI check passes: reproducible generation, rules audit,
coverage consistency, all workspace types, 9,642 card tests, and 894 engine tests (three skipped).
The card suite loaded six of the later Class Bonus cases; their separate focused run covers
all 14 new cases.

The targeted Class Bonus counter pass adds evidence for Displace, Sharpen Blade, and Sage
Protection. Two successive casts check exact reserve payment, no early counter, accumulation
only for matching classes, and no counter on the target or opposing champion. Own and opposing
targets are tested; Sage Protection also resolves with zero targets. All 22 affected tests
(14 new), card types, and coverage consistency pass. No further production changes were needed.

The Bloom replacement pass adds evidence for Summer's Glow, Winter's Chill, and Autumn's Fall.
The 36 two-player cases check matching/non-matching classes, zero/one/three opposing Flowerbuds,
both flower choices, mixed choices, and existing own/opposing flowers. Only the caster chooses;
wrong-player and invalid-token answers are rejected without changing state. Three real Pantheon
cases use Blossoming Denial to summon two Flowerbuds for each of two opponents, then verify
four caster choices and two correctly controlled replacement tokens for each opponent.

That setup exposed an engine error in Blossoming Denial with no target selected. An unless-paid
clause whose referenced object has no controller now skips its payment request and continues
the remaining effects. Direct tests check zero targets, accepted payment, and declined payment:
all summon two opposing Flowerbuds, and only declining payment negates the selected activation.
All 60 affected card tests (42 new), nine engine payment tests, and card types pass. The rules
basis is Card Activation 1.5 and Checking Resolution 1.3 for optional targets, plus Sacrifice 2 and
Summon 1-3 for the Flowerbud transition. The full CI check passes: reproducible generated output,
rules audit, coverage consistency, all workspace types, 9,692 card tests, and 894 engine tests
(three skipped).

The ally-condition pass adds evidence for Tune Up, Rearing Rebound, and Clear Pastures. Tests
compare absent, own, opposing, and graveyard allies, then remove the qualifying ally with a
fast response before resolution. Tune Up recovers two or four with zero, two, or six damage,
bounded at zero and without changing opposing damage. Rearing Rebound also suppresses its
controller's only Horse and correctly omits the subsequent memory draw. Clear Pastures checks
Glimpse 3 with one, two, or four deck cards, then draws from the chosen order into memory.
All 41 affected tests (36 new), card types, and coverage consistency pass. No production
changes were needed.

The influence/threshold pass adds evidence for Fast Cure, Gentle Respite, and Curse
Amplification. Influence cases check below/equal/above values across hand, memory, and split
zones, including a fast response that reduces opposing influence to equality. Invalid self and
object targets are rejected without changing state. Four real Pantheon cases remove the barrier
through combat, then distinguish a selected low-influence opponent from a different higher-influence
opponent. Recovery and memory draws use only the selected player's current influence.
Curse Amplification checks 19/20/21 damage with and without Diana, and a fast response that changes
damage before resolution; damage is earned through combat on a fixture champion with 30 life.
All 58 affected tests (56 new), card types, and coverage consistency pass. No production changes
were needed.

The target-state damage pass adds evidence for Frost Shard, Glacial Evocation, and Merciless
Toss. Own and opposing allies are tested with no qualifying state, an existing qualifying state,
the state on another ally, and a state applied by a fast response. Rest-based damage also checks
a wake response. Merciless Toss deals six rather than two to its damaged target; existing damage
is preserved. Frost Shard additionally checks awake/rested champions under slow activation timing.
Illegal item, graveyard, and ally-only champion targets are rejected without changing state.
All 34 affected tests (32 new), card types, and coverage consistency pass. No production changes
were needed.

The targeted-counter pass exercises Fortification, Belted Tune, and Sparkling Adornment's cost
and resolution. Fortification's target compiler omitted Siegeable domains; it now accepts allies
or domains with Siegeable, while still rejecting champions and other domains. Two bulwark counters
prevent two combat damage events and preserve domain durability; noncombat ally damage does not
consume them. Belted Tune's two buff counters add two power/life and persist through combat.

Sparkling Adornment previously failed with undeclared X and allowed costs spread across objects.
The compiler now binds its X to the recorded additional-cost counter count, preserves the field
zone restriction, and marks singular-object counter costs. The engine enforces that single-object
constraint. Tests pay one or three sheen counters from own/opposing objects, transfer to champions,
other allies, or the paying object, and reject zero, excess, mixed-source, and invalid-target
selections. Only Fortification and Sparkling Adornment generated definitions changed. All 21
affected card tests (19 new) pass, including Fortification's preserved Floating Memory cases.
The full CI run passed reproducible generation, rules audit, coverage consistency, all workspace
types, 9,833 card tests, and 894 engine tests (three skipped). The two restored Floating Memory
cases passed in the subsequent 21-test focused run; refreshed coverage consistency also passes.

The Empower/Glimpse pass adds evidence for Scorching Knowledge, Heighten Spellcraft, and
Celestial Navigation. Empower checks cover matching/nonmatching classes, turn expiry, opposing
spells, non-spell activations, spells activated before Empower resolves, stacked effects, and
level-dependent activation costs. Heighten Spellcraft is a Skill, so repeated copies stack;
Scorching Knowledge is a Spell, so its activation consumes the previous Empower before granting
a new instance. Glimpse 5 checks empty, short, exact, and longer decks; top/bottom/split ordering;
and rejection of opposing, source, and unseen card selections without state changes.
All 42 affected tests (40 new), card types, and coverage consistency pass. No production change
was needed. Rules basis: Keywords and Abilities, Empower 1–3; Game Terms, Glimpse 1–2.

The opponent-count discount pass found a multiplayer compiler defect: "an opponent controls
N or more" counted the combined fields of all opponents. The compiler now uses the existing
per-player zone-count condition with an "any" quantifier and removes the duplicate unit-cost
branch. Nine generated definitions changed: Mob Vantage, Besieged Slash, Rally the Peasants,
Guerrilla Advantage, Apostle of the Woods, Battlefield Benediction, Crowdguard's Slash, Eventide
Spear, and Tricky Chimps. The existing engine evaluator already checks each player's field.

The four discount cards have 72 new public-activation cases covering matching/nonmatching
classes, units versus allies, own-field and non-field exclusions, exact payment, and three-player
split counts. Before the fix, all three newly covered cards failed when only the combined count
met the threshold; all 80 affected tests now pass. Rules basis: Card Activation 1.6–1.8; each
card's printed singular-opponent condition. Full CI passes reproducible generation, rules audit,
coverage consistency, workspace types, 9,947 card tests, and 894 engine tests (three skipped).
The final helper extension also passes a separate card type check.

The Class Bonus/level ally pass covers six abilities on Beguiling Bandit, Limitless Slime,
and Lancelot, Goliath of Aesa. Stat checks cross levels 0–3 with matching/nonmatching classes;
Cram Session crosses the Level 2 threshold and its expiry removes the bonus without changing
opposing allies. Repeated one-damage attacks verify exact life and lethal damage. Beguiling
Bandit rejects unpaid attacks and charges one reserve for each attack against it, without
charging attacks against the champion.

Limitless Slime's Floating Memory checks both current-level modifiers and printed lineage
levels, matching/nonmatching classes, invalid payment sources, and one-use banishment. Its
Level 3 On Attack checks levels 1–4, ignores another ally's attack, adds a buff only when the
trigger resolves, increases actual combat damage, and preserves/accumulates counters over turns.
All 83 affected tests (56 new), card types, and coverage consistency pass. No production change
was needed. Rules basis: Class Bonus 1–4; Level Restriction 1–2; each card's printed effects.

The capped/maximum discount pass covers Hefty Hammering, Dorumegian Foundry, and Maiden of
Glimmer's Dusk. Domain discounts stop at three domains and multiply by two; phantasia discounts
stop at two, including multi-type ally/phantasia objects. Matching/nonmatching classes, no
qualifying objects, counts beyond the cap, own-field scope, other zones, and the activated
source's exclusion from field counts are checked through exact payment and resolution.

Hefty Hammering uses the greatest own weapon durability count, not a sum or the durability on
a domain or opposing weapon. Tempered Steel earns counters for tied maxima and counts of seven
and eight. Combat spends a counter before a later activation. Underpayment and overpayment are
rejected without state changes; the seven-cost reduction floors at zero and its resolved attack
deals four damage. All 63 affected tests (38 new), card types, and coverage consistency pass.
No production change was needed. Rules basis: Card Activation 1.6–1.8 and each printed discount.

The continuous group-bonus pass covers Lumen Borealis, Sun Ce, Weaponsmaster, and Courtside
Beastkeeper. Tests distinguish Animals from Beasts, Warrior weapons from other weapons, own
objects from opposing objects, and field objects from graveyard cards. Matching/nonmatching
classes, cumulative non-Unique sources, newly entered allies, and removal of each source are
checked. Actual attacks use the increased power; removing a source reduces the derived stats
immediately. Sun Ce remains one Unique copy per player.

Sun Ce's entry trigger is also covered: only a matching class may add durability to an own field
Warrior weapon. Wrong types, opposing weapons, and banished weapons are rejected without state
changes. The counter is added at trigger resolution and later spent on a two-damage weapon
attack. All 14 new tests, card types, and coverage consistency pass. No production change was
needed. Rules basis: Class Bonus 1–4 and Types of Effects / Continuous Effects.

The Chessman discount pass covers all five abilities on Castling and Surging Obstruction.
Castling's Rook and King discounts apply independently and combine to zero; multiple Rooks do
not multiply the discount. Surging Obstruction's Bishop discount applies once. Both cards check
own field objects, ignore opposing/graveyard pieces and wrong Chessman types, and do not require
Class Bonus. Exact reserve payments reject underpayment and excess payment without mutation.

Surging Obstruction checks zero/even/odd target reserve costs, acceptance and refusal of the
one/three-reserve tax, payment rejection, and the resulting field/graveyard destination. Castling
checks zero/one/two targets across both controllers, invalid or duplicate targets, Spellshroud,
awake Taunt attack priority, exact +2 life, and expiry of all three effects at end of turn.
All 97 new tests, card types, and coverage consistency pass. No production change was needed.
Rules basis: Card Activation 1.6–1.8; Spellshroud 1–3; Taunt 1–4.

The supported-Stealth pass covers Lacunarity Guide, Weiss Bishop, and Noire, Ace of Spades.
The tests distinguish own field support from absent, opposing, graveyard, or banished support;
remove the sole support or one of two supports; reject ordinary attacks only while Stealth is
active; allow True Sight attacks and spells; and verify actual damage or lethal results.
Weiss Bishop's existing odd-life attack tests are preserved.

Noire exposed a compiler defect: "you control another" did not exclude the source. Five cases
incorrectly retained Stealth without another own Suited ally. The shared condition compiler now
sets excludingSource. Eight definitions changed: Noire, Sirocco Operative, Acheron Express Officer,
Coy Bouclier, Charged Hunter, Golden Pawn, Bedivere, Woodland Overseer, and Baby Silver Slime.
All 73 affected tests (63 new) pass. Full CI passes reproducible generation, rules audit, coverage
consistency, workspace types, 10,215 card tests, and 894 engine tests (three skipped). Rules basis:
Stealth 1–4 and each card's printed requirement for another object.

The arcane Shenju permission pass covers Harbinger of Lightning, Harness Lightning, and
Seiryuu's Command. Tests use a champion with Wind/Norm only or native Arcane, earn quest counters
with Whirlwind Threads, and publicly transform Azurite/Sapphire Fatestones. Only an own arcane
Shenju ally supplies the exception: untransformed Arcane items, water Shenju allies, opposing
Shenju allies, graveyard cards, and Arcane non-Shenju allies do not. The exception cannot enable
an unrelated Arcane Blast. Rejections check the element error and unchanged state; successful
activations still require exact reserve payment and reach the expected field/graveyard/banishment
zone. All 42 new tests, card types, and coverage consistency pass. No production change was needed.
Rules basis: Card Activation 1.2 and 1.6–1.8; Double-faced Cards 2–4 and 9.

The player-state stat pass covers Formidable Youxia, Ritai Berserker, and Hexbound Blade.
Shifting Currents tests cover all four directions, the same object through a complete direction
cycle, no effect on opposing copies, actual North attack damage, and East's exact lethal-damage
threshold. Hexbound Blade tests absent/own/opposing agility, agility gained during combat,
cleanup expiry, and multiple agility instances granting only one +4 power bonus. All 16 new
tests, card types, and coverage consistency pass. No production change was needed. Rules basis:
Agility 1 and its cleanup rule; Continuous Effects / General Rules 1–3; printed direction text.

The additional-card-payment pass covers Plutus, Fortune's Favor, Devotion's Price, and Obscured
Offering. Checks reject missing, short, excess, duplicate, opposing, wrong-zone, source-card,
and overlapping reserve/discard selections without state changes. Valid payments discard or
banish the exact cards before resolution. Negating the activation leaves all costs paid. Matching
and nonmatching classes pay the same printed additional costs.

Obscured Offering's resolution also checks own/opposing Regalia targets, rejection of a
non-Regalia target, protection of only the selected weapon, and expiry. Spirit Blade Infusion
cannot target the protected weapon but can target an unprotected weapon and the former target
on a later turn. All 14 new tests, card types, and coverage consistency pass. No production change
was needed. Rules basis: Card Activation 1.6–1.8; Spellshroud 1–3.

The additional-sacrifice pass covers Shield Fragmentation, Kindling Flare, and Atmos Armor
Type-Hermes. Checks reject missing, excess, duplicate, opposing, wrong-kind, and wrong-zone
payments without state changes. Kindling Flare tests zero, one, two, and four Herb tokens,
exact reserve payment, payment before resolution, and exact single/split damage totals after
the sacrificed tokens cease to exist. The compiler now recognizes any-number sacrifice costs
before its generic sacrifice branch and counts paid identities instead of surviving objects.
Only Kindling Flare's generated definition changes. All 49 affected tests pass (11 new tests).
The full workspace CI check passes: generated-file verification, rules audit, coverage, types,
10,298 card tests across 1,691 files, and 894 engine tests (three skipped).
Rules basis: Card Activation 1.6–1.8; Sacrifice 2.1–2.4.

The following split-damage pass closes that target-timing gap for Kindling Flare and Innervate
Fury. Both now declare targets during activation. Their distribution choices use the retained
legal target identities and require a positive allocation to every remaining target. Empty
optional sets and sets whose targets all became illegal finish without a decision. Typed field
object bindings keep field recipients distinct from cards in other zones. A target declaration
can carry a distributed amount, whose target-count limit is checked after cost payment supplies
bindings such as the number of sacrificed Herbs; failed admission rolls back the whole payment.

All 24 focused tests and workspace types pass (16 new tests). They cover wrong object kinds,
own/opposing Spellshroud, zero targets, too many targets, refusal to redirect or omit allocations,
partial/all target protection with Coronation Ceremony, partial/all returns with Reclaim, and
Innervate Fury's exact recovery and delevel costs before damage. Only these two generated card
definitions change. Rules basis: Card Activation 1.3 and its Innervate Fury example, 1.5–1.8;
Resolution / Checking Resolution 1.3; Spellshroud 1–3. Full workspace CI passes: generated-file verification, rules audit, coverage, types,
10,314 card tests across 1,692 files, and 894 engine tests (three skipped).

The ally-sacrifice pass covers both paragraphs of Decompose, Primeval Ritual, and Umbilical
Ritual. Cost checks use ordinary and token allies with matching/nonmatching champions, rejecting
missing, excess, duplicate, opposing, wrong-zone, wrong-kind, and incorrect reserve payments.
The selected ally leaves before resolution and other allies remain on the field.

Decompose gathers exactly the sacrificed ally's last life stat, including a Training Session
buff counter and excluding marked damage. Tests cover 1/2/6 life, token allies that cease to
exist, two random seeds, six legal Herb definitions, and the controller of the resulting tokens.
Primeval Ritual accepts existing own Wind action/ally cards in the graveyard, rejects using the
not-yet-sacrificed ally as its target, and resolves with no return if Tomb Sweep removes the
chosen card. Umbilical Ritual caps recovery at existing damage and grants next-Spell Empower 4;
checks cover prior/other-player Spells, intervening Skills, expiry, a second Ritual consuming
the first grant, and no permanent champion level change. All 76 new tests, card types, and
coverage consistency pass. This pass changes tests only. Rules basis: Card Activation 1.5–1.8;
Sacrifice 2; Gather 1–3; Empower 1–3; Card and Object Information / Last-known Information 1.

The untargeted-counter pass fixes Anthem of Vitality's Harmonize paragraph. The generic plural
counter instruction now distinguishes "an ally" from "target ally" and emits a resolution
choice for the former. It also corrects Greater Boon of the Underdog's gain trigger. These are
the only two generated definitions changed by this fix.

Anthem tests cover no Melody, own prior Melody, a Melody activated in response, an opponent's
Melody, a previous turn's Melody, an intervening non-Melody Skill, no eligible controlled ally,
and a would-be recipient returned to hand in response. Only its declared Animal/Beast target
gets temporary +3 LIFE and Spellshroud; the controller chooses the separate buff recipient at
resolution. Buff counters persist after the temporary bonus and protection expire. Spell checks
reject the protected unit, accept another target, then accept the former target on a later turn.
The boon checks two cards drawn and two buff counters on the chosen own ally, with opposing
allies unchanged. Decompose now additionally proves a temporary +3 life modifier survives in
last-known information after sacrifice. All 42 affected tests pass (12 new tests).
Rules basis: Labels / Harmonize; Card Activation 1.5; Objects and Targeting; Spellshroud 1–3;
Card and Object Information / Last-known Information 1. Full workspace CI passes: generated-file verification, rules audit, coverage, types,
10,402 card tests across 1,696 files, and 894 engine tests (three skipped).

The graveyard alternate-cost pass fixes Song of Frost and Glacial Binding. A qualified graveyard
banish "rather than pay" instruction now compiles to an optional replacement reserve cost,
with printed Class Bonus restrictions retained. It no longer produces an optional banish from
hand during resolution. These are the only two changed generated definitions. Normal reserve
payment remains available even when the alternative is enabled.

Tests reject absent/excess/duplicate/opposing/wrong-zone payments and cards whose Floating
Memory is disabled by class. Song of Frost's alternate requires its matching Tamer class, while
Glacial Binding's does not require a class match. Costs are paid before resolution. Song of
Frost ends either player's active combat, cancels combat damage, banishes an unresolved Fireball,
returns to the active player's main phase, and goes to the graveyard itself. Outside combat,
the pending Fireball resolves normally. Glacial Binding tests own/opposing card activations,
accepting/refusing the exact three-reserve tax, and banishment only on successful negation.
Anthem of Vitality's full timing/protection tests now also run with matching Tamer champions.
All 52 affected tests pass (44 new tests). Rules basis: Card Activation 1.3 and 1.8; Floating
Memory's active restriction; Turn Order / Ending Phases 1–2; printed conditional negation text.
Full workspace CI passes: generated-file verification, rules audit, coverage, types,
10,446 card tests across 1,698 files, and 894 engine tests (three skipped).

The linked-Vigor pass covers Mark of Fervor, GustTech Shield, and Winbless Kiteshield. Tests
exercise own/opposing hosts, matching/nonmatching classes, actual attacks, source removal before
the end step, and an unlinked rested ally that must stay rested. Opposing linked allies are
also rested during the source controller's turn and checked at that end step: they remain
rested until their own controller's end step. Winbless Kiteshield is tested on champions as well
as allies; Vigor's current rules apply to both unit types.

Mark of Fervor checks actual power/life changes, attack damage, and loss of both stats on removal.
Two linked Marks stack to +2 power/+2 life and create two separately ordered Vigor triggers.
All 45 affected tests pass (33 new tests), as do card types and coverage consistency. This pass
changes tests only. Rules basis: Vigor 1–2; Link; Continuous Effects / General Rules 1–3.

The champion-bonus Floating Memory pass covers Diablerie, Spring Cleaning, and Sparkling
Adornment. The 48 new cases exercise matching/nonmatching class, matching/nonmatching current
champion, a matching name buried under a different champion, invalid zones/owners, duplicate
payment, normal memory fallback, and payment before materialization resolves. Public leveling
then checks both gaining and losing the bonus. The successor cannot enable payment for its own
materialization; the current champion can still enable that payment before being replaced.
All 61 affected tests pass, as do card types and coverage consistency. This pass changes tests
only. Rules basis: Champion Bonus 1–3; Floating Memory 1–2; Champion / Leveling Up 7.4.

The Divine Relic qualifier pass fixes the shared compiler filter for “with divine relic.”
Diablerie previously stole ordinary Regalia such as Training Sword. Unmake Duality previously
accepted ordinary Regalia for its additional sacrifice. Generated definitions now require both
Regalia and the active Divine Relic keyword. These are the only two changed definitions.

Twelve new tests cover both fixes. Diablerie checks own/opposing entries, with/without Vanitas
Bonus, ownership preservation, control of the relic's activated ability, consumption on the
qualifying entry, ordinary entry followed by a Divine Relic in the same turn, and expiry before
the next turn. Unmake Duality rejects ordinary Regalia transactionally, sacrifices the Divine
Relic before resolution, and then draws exactly two cards. All 29 affected tests pass.
The existing engine replacement test now uses a Divine Relic, keeps ordinary Regalia as a
negative case, and verifies snapshot restore and single-use consumption. Full workspace CI passes:
generated-file verification, rules audit, coverage consistency, all types, 10,539 card tests in
1,700 files, and 894 engine tests (three skipped).
Rules basis: Replacement Effects / General Rules 1–5; Divine Relic 1; printed additional cost.

The Quicksilver Grail / Sacramental Rite pass fixes both maintained ability overrides whose
On Enter filters required CHAMPION and NOT CHAMPION simultaneously. Both generated definitions
now select a non-champion card from the controller's material deck. The 24 card tests cover
selection, invalid owner/zone/champion/duplicate choices, face-down viewer privacy, source
banishment as a cost, optional decline, linked-card identity, and paid/free materialization.
Sacramental Rite adds Ascendant without removing other subtypes even when the play is declined.
The tests also preserve Invoke Dominance through public activation, banish it with each artifact,
and activate it using reserve payment or decline its final declaration.

The insufficient-memory tests exposed an engine gap: accepting an optional play could leave an
unpayable declaration with no decline path. Accepted direct optional play, activation, and
materialization effects now carry mayDecline through their resolution frames, pending state,
decisions, and legal-command enumeration. A rejected payment preserves state; declining resumes
the parent effect without refunding earlier costs. Mandatory declarations still reject decline.
Sixteen new engine cases cover both play routes plus explicit activation/materialization, valid
payment, rejection, decline, continued parent resolution, legal commands, and snapshot restore.
All 24 card cases and 26 focused engine tests pass. Full workspace CI also passes:
generated-file verification, rules audit, coverage consistency, all types, 10,563 card tests
in 1,702 files, and 910 engine tests (three skipped).
Rules basis: Banishment / General Rules 2–3.3; Preserve 2–4; printed optional play and costs.

The Element Bonus Aethercalling pass covers Guided Starlight, Constellation's Blessing, and
Sidereal Spellshot. The 54 new cases independently vary class and element matching, weapon
availability, and accepting/declining the load while resolving Strategic Planning's Glimpse.
Wrong owners, zones, non-Aetherwing weapons, unseen cards, and duplicate load assignments are
rejected without changing state. Public loading bypasses activation and reserve payment, keeps
unseen cards in place, and creates no extra stack item. Actual attacks verify printed Aethercharge
power and disposal, including two charges on one weapon or separate weapon assignments.
All 60 affected tests pass, as do card types and coverage consistency. This pass changes tests
only. Rules basis: Aethercalling 1–2; Element Bonus 1–2; Aetherwing loaded-card use.

The Class Bonus Kindle pass covers Glowering Conflagration, Burning Aethercharge, and Silent
Firebrand. The shared Kindle helper now supports conditional class bonuses and champion targets.
Thirteen new cases check disabled/enabled bonuses, every legal Kindle count, wrong zones/owners,
non-Fire cards, duplicate cards, exceeding the printed limit, and insufficient/excess reserve.
Invalid declarations preserve state. Successful activation banishes the selected graveyard cards
and pays the exact reserve remainder before resolution, without changing reserve-cost characteristics.
The damage actions resolve for their expected damage and Silent Firebrand enters the field.
All 59 affected tests across nine files pass, including all previous users of the shared helper.
Card types and coverage consistency also pass. This pass changes tests only. Rules basis: Kindle
1–2; Class Bonus; Card Activation / payment of costs.

The Class Bonus Spellshroud pass covers Seeker's Aetherwing, Stellar Cosmos, and Maiden of
Shrouded Fog. Twenty-four new tests check own/opposing Spells with the target controller's class
bonus enabled or disabled. Meltdown and Soothing Disillusion cannot target the protected object;
the same paid spells can remove the unprotected control object. Tempered Steel and Training
Session are Skills and can target the protected objects. Public champion materialization checks
both gaining and losing the class bonus, so a buried class does not preserve Spellshroud.
All 24 tests, card types, and coverage consistency pass. This pass changes tests only.
Rules basis: Spellshroud 1; Class Bonus; Champion / Leveling Up 7.4.

The Class Bonus True Sight pass covers Concealed Marksman, Seeker's Aetherwing, and Sword of
Seeking. Twelve new cases exercise matching/nonmatching classes and publicly level into the
opposite class before attacking. An unrelated ally and attacks using Training Sword remain
unable to target Stealth; the tested unit or wielded weapon bypasses Stealth only when its
current class bonus is enabled. Seeker's Aetherwing still requires a load. Resonant Aether is
loaded through its public resolution choice, then actual combat verifies damage and disposal.
All 24 affected tests, card types, and coverage consistency pass. This pass changes tests only.
Rules basis: True Sight 1.1–1.2; Stealth 1; Class Bonus; Champion / Leveling Up 7.4.

The champion entry summon pass covers Full Bloom, Bise Blade, and Maiden of Waning Bloom.
Fourteen public-action tests check current champion identity, buried lineage, target legality,
optional target omission, token count, ownership, and entry timing. Full Bloom exposed two
production defects: its effect damaged every champion and omitted recovery, and one summon
batch admitted only one per-token entry trigger. The compiler now preserves the triggering
opponent and recovery; the engine admits each token entry separately while retaining one-or-more
batch grouping. Full Bloom now deals eight damage and recovers eight across four tokens, with
recovery capped at existing damage. Six trigger-admission tests also pass. Rules basis: Champion
Bonus; Champion / Leveling Up 7.4; Triggered Abilities 10–11; Recover.

The controlled entry condition pass covers Acheron Express Officer, Jovial Tinkerer, and Charged
Hunter. Sixty new cases check Class Bonus, own/opposing objects, field versus hand/graveyard,
object type and subtype, source exclusion, multiple qualifying objects, and removal before
resolution. Combat proves the resulting Ranged damage and distant expiry. Jovial Tinkerer draws
exactly one card into memory. Charged Hunter exposed a compiler defect that omitted its Powercell
alternative; the shared descriptor parser now preserves that alternative without changing other
generated definitions. All 68 affected tests and card types pass. Rules basis: Triggered
Abilities 2.1 and 4; Class Bonus; Distant 2–3; Ranged 1–2; Draw.

The combined full `ci-check` passes: 10,740 card tests across 1,714 files, 911 engine tests
with three skipped, generated verification, rules audit, all types, and coverage consistency.

The Class Bonus attack Glimpse pass covers Riptide Slash, Eternal Dreamer, and Seer's Sword.
Sixty-three public-action tests check matching and nonmatching classes, empty/short/full decks,
top/bottom/split ordering, illegal omissions/duplicates/opponent cards with rollback, and unchanged
opponent decks. Attack cards wait for their declared attack, weapons trigger when wielded, and
unrelated ally attacks do not trigger these abilities. Combat, attack-card disposal, and weapon
durability finish normally. Powercell boosts before the attack or in response change Eternal
Dreamer's Glimpse count; Reclaim after the attack preserves its last-known power, including the
boost. All 63 tests, card types, and coverage consistency pass. Production code is unchanged.
Rules basis: On Attack 1.1–1.3; Class Bonus 1–4; Glimpse 1–2; Abilities 13–14; Last-known
Information 1. The next group is phase-based summoning: Slimecall Cyclone, Convoking Slime, and
Stardust Oracle.

The Class Bonus phase summon pass covers Slimecall Cyclone, Convoking Slime, and Stardust
Oracle. Thirty-six new cases test matching/nonmatching classes, one/two sources, and field versus
hand/graveyard. Opposing phases do not trigger them. Each source summons once when its own phase
begins and again on the next turn; tokens have the printed name, type, class, element, and stats,
with the correct owner and controller. Convoking Slime copies enter rested, do not inherit buff
counters added through Training Session, and retain their own summoning ability for the next
recollection phase. All 41 affected tests, card types, and coverage consistency pass. Production
code is unchanged. Rules basis: Class Bonus 1–4; Triggered Abilities 10–11; Copy 2; Summon 1–2.
The next group is Deluge death triggers on Dynasty Chancellor, Drowned Exorcist, and Mistsworn
Magister.

The Deluge death pass covers Dynasty Chancellor, Drowned Exorcist, and Mistsworn Magister.
Forty-two new cases kill the real allies with Fireball and check below/at/above the WATER
graveyard threshold. The dying source counts; opponent graveyards, other elements, and other
zones do not. Dredging Streams adds a water card or removes the dead source before resolution,
proving the condition is evaluated then. Exiling the source does not cancel its trigger when
enough water cards remain. Class matching does not gate Deluge, and Reclaim does not cause a
death trigger. Tests verify the exact draw destination/count or two enlighten counters on the
correct champion. All 52 affected tests, card types, and coverage consistency pass. Production
code is unchanged. Rules basis: On Death 1–3; Triggered Abilities 2.1 and 4; Abilities 13–14.
The next group is optional entry discard on Package Courier, Shizun of the Ash, and Conflagrant
Sentinel.

The optional entry discard pass covers Package Courier, Shizun of the Ash, and Conflagrant
Sentinel. Tests exercise accepting, declining, one remaining hand card, and an empty hand after
reserve payment. Invalid opponent cards, field objects, reserved cards, missing selections, and
duplicates are rejected without state changes. The selected card goes to the graveyard before
the exact top-deck draw or buff reward; Sentinel's buff is also verified through combat damage.
The shared helper now covers a single eligible card and retains its existing fire-only and
attack-trigger behavior. All 21 affected tests across five files, card types, and coverage
consistency pass. Production code is unchanged. Rules basis: Triggered Abilities 1.1 and 4;
Discard 1–3; Buff counters. The next group is entry stat effects on Fluvial Fatestone, Imperious
Highlander, and Trusty Steed.

The entry stat pass covers Fluvial Fatestone, Trusty Steed, and Imperious Highlander. Tests
found that Trusty Steed accepted itself despite "another," and Highlander omitted the opponent
target and used the controller's ally count. The compiler now preserves the source exclusion
and represents Highlander's selected-opponent surplus, floored at zero and measured at
resolution. Only those two generated definitions changed. Nineteen focused tests pass, including
target legality, source/target removal, zero/positive surplus, changing ally counts before and
after resolution, combat damage, and end-of-turn expiry. The full `ci-check` passes: 10,911
card tests across 1,725 files, 911 engine tests with three skipped, generated verification, rules
audit, types, and coverage consistency.

The Fragmented Spirit pass covers the Wind, Water, and Fire starting champions. Eighteen new
pregame tests check six- and nine-card decks with top/bottom/split Glimpse ordering, invalid
choices with rollback, exact six-card draws, and one owned Spirit Shard token. The public
command's committed events confirm that all six draws precede the summon. No token exists while
the Glimpse decision is pending. All 75 affected tests across ten files pass, including all
existing starting-Glimpse helper users; card types and coverage consistency also pass. Production
code is unchanged. Rules basis: On Enter; Glimpse 1–2; Drawing Cards; Summon 1–2. The next group
is death draws on Angel Attendant, Magus Initiate, and Golden Pawn.

The unconditional death-draw pass covers Angel Attendant, Magus Initiate, and Golden Pawn.
Real combat kills each ally before its trigger draws exactly the top card into the controller's
hand. Dredging Streams can banish the dead source in response without cancelling the draw;
Reclaim returns the ally to hand without causing a death draw. The shared helper accepts a
printed attacker strong enough to kill Angel Attendant and retains the existing class-restricted
and source-level tests for Library Witch and Magus Disciple. All 24 affected tests across five
files, card types, and coverage consistency pass. Production code is unchanged. Rules basis:
On Death 1–3; Abilities 13–14; Drawing Cards. The next group is boon-gain Scavenge on Lesser Boon
of Viscosity, Lesser Boon of Scriveners, and Lesser Boon of Virelai.

The boon-gain Scavenge pass covers Lesser Boon of Viscosity, Lesser Boon of Scriveners, and
Lesser Boon of Virelai. Thirty real Pantheon bestowment tests check the three-card reserve cost,
invalid payment rollback, and matches at deck positions one, ten, and eleven. Each printed
filter has two eligible card probes. No-match and short-deck cases check the untouched deck
prefix and the exact set of revealed cards returned to the bottom. Opponent hands, decks, and
boons remain unchanged, and a gained boon cannot be bestowed again. All 30 tests, card types,
and coverage consistency pass. Production code is unchanged. Rules basis: Scavenge N 1;
Pantheon boon bestowment. The next group is entry keyword actions on Foraging Servant,
Dissonant Fractal, and Message in Shadows.

The entry-keyword pass covers Foraging Servant's Gather, Dissonant Fractal's Glimpse 4, and
Message in Shadows' Glimpse 2. Empty, short, and full decks cover top/bottom/split ordering;
invalid duplicate, missing, and foreign choices roll back. Both matching and nonmatching
champion classes receive the unconditional effects. The existing Gather helper checks one
owned, awake ingredient token and no opponent token. The pass also found that Message in
Shadows incorrectly applied its conditional +2 power to itself. The compiler now resolves
"it" to the linked object when a linked-object condition supplies that antecedent. Only Message
in Shadows changed on regeneration. Six additional tests verify printed stealth, no stealth,
and gained/expired stealth while other allies remain unchanged. All 48 affected tests pass.
Coverage and the generation manifest are updated. Full `ci-check` passes in
`/tmp/ga-ci-linked-pronoun.log`: 11,015 card tests across 1,733 files, 911 engine tests
with three skipped, generated-file verification, rules audit, types, and coverage consistency. Rules basis: Gather 1–3;
Glimpse 1–2; Link 1–3; Stealth 1–4.

The Perfusive Envelopment recovery pass adds 22 tests for zero, one, and three blood counters,
zero/one/five damage, both champion class states, and two consecutive recollections. Public
activations establish entry counters and damage; opposing Umbilical Ritual sacrifices add
blood counters. Recovery triggers only on the controller's recollection, removes the current
blood count without going below zero damage, and does not consume counters. Response tests
confirm that a later sacrifice increases recovery and that destroying the source with
Whirlwind Vizier still uses its last blood count. All 26 tests in the card file, card types,
and coverage consistency pass. Production code is unchanged in this pass. Rules basis:
Recover 1–2; Triggered Abilities; ability source last-known information. The remaining phase
recovery group includes Baihua and Greater Boon of Kanaloa.

The Kanaloa recovery pass adds eight three-player Pantheon tests covering face-down and
bestowed Greater Boon of Kanaloa with zero, one, three, and five champion damage. Public draws,
materializations, reserve payment, and bestowment establish the boon. Combat removes all three
Pantheon Barriers before Singeing Leap deals the measured champion damage. Three own end phases
verify recovery by two, capped at zero, while both opponents retain their damage. Opponent end
phases and face-down boons do not trigger recovery. All 14 tests in the card file, including the
existing Level Locked tests, card types, and coverage consistency pass. Production code is
unchanged. Rules basis: Recover 1–2; Boons; Pantheon Barrier printed replacement. Baihua remains
in the phase-recovery group.

The Baihua pass adds two three-player Pantheon scenarios with one and five damage on both
opposing champions. Full Bloom creates four Flowerbuds, and Bloom: Summer's Glow replaces them
with four owned Baihua tokens through public choices. Combat removes remaining Pantheon
Barriers before public actions establish champion damage. Each of four separate triggers
recovers exactly one from both opponents at the token controller's recollection. Two cycles
check the zero-damage cap and unchanged controller damage; other players' recollections have
no Baihua triggers. Both scenarios, card types, and coverage consistency pass. Production code
is unchanged. Rules basis: Recover 1–2; Triggered Abilities; token controller ownership. The
next group is end-phase sacrifice on Direwolf, Emberwrath Witch, and Lightweaver's Infinite
Shaping.

The end-sacrifice pass covers Direwolf, Emberwrath Witch, and Lightweaver's Infinite Shaping.
Twenty-six new tests check matching/nonmatching classes, field versus private/graveyard zones,
multiple non-Unique sources, exact public sacrifice events, token removal, and no opponent-phase
trigger. Reclaim response tests exposed a runtime defect: the pending Emberwrath Witch trigger
sacrificed its source from hand. The sacrifice effect executor now requires the object to be on
the field. Five engine cases verify field sacrifice and no movement from hand, memory,
graveyard, or banishment. All 28 affected card tests and all five focused engine tests pass.
The fixture separates field-object targets from private-zone card targets. Full validation in
`/tmp/ga-ci-end-sacrifice-final.log` passed types, 916 engine tests (three skipped), and 11,072
card tests; its only failure was a 15-second Kanaloa fixture timeout. Rules basis: Sacrifice
1–4; Tokens 2; End Phase 1.1.

The Powercell death pass adds 24 tests for Powered Armsmaster, Powered Bishop, and Delivery
Droid. Combat kills and public sacrifice costs summon exactly one owned, awake ITEM Powercell,
independent of champion class. Dredging Streams can banish the dead source before the trigger
resolves without cancelling the summon. Reclaim returns the source to hand without a summon;
an existing opposing Powercell remains unchanged. The Kanaloa setup now draws only the hand
needed for each damage case, reducing unused reserve-payment choices. All 42 affected card
tests across four files and card types pass. Coverage is updated. Full `ci-check` passes
in `/tmp/ga-ci-powercell.log`: 11,097 card tests across 1,738 files, 916 engine tests (three
skipped), generated-file verification, rules audit, types, and coverage consistency. Rules basis: On Death 1–3;
Summon 1–3; Tokens; ability source last-known information.

The attack-declaration tax pass covers Ducal Seal and Tariff Ring. Eight tests check matching
and nonmatching champion classes, one or two stacked copies, and rejection during own main,
own recollection, and opposing main phases without spending the source. Activation during an
opponent's recollection banishes each source as a cost. Both attacks on that turn require the
exact combined reserve payment; underpayment rolls back. Memory and hand changes match each
payment. Attacks by both players on subsequent turns are free after the duration expires. All
eight tests, card types, and coverage consistency pass. Production code is unchanged. Rules
basis: Recollection Phase 1–5; Attack Declarations; Costs and Memory; Continuous Effects. The
next group is Guo Jia-restricted transformation on Cyclonic Fatestone and Beseeched Fatestone.

The rest-cost Fatestone pass adds 15 tests for Cyclonic Fatestone and Beseeched Fatestone.
They check current Guo Jia identity, reject opposing or buried identity, and require exact
reserve payments. Beseeched Fatestone discounts only its controller's materializations during
the current turn, with a zero-cost floor. Opposing, expired, and ordinary activations do not
discount it. The source rests on activation, retains its incarnation and rest state through
transformation, and returns to its default face after Reclaim. All 17 affected tests, card
types, and coverage consistency pass. Production code is unchanged. Rules basis: Transform
1–2; Double-faced Cards 2–4 and 9; Card Materialization; Costs and Memory.

The counter-gated banishment pass covers both abilities on Windwalker Boots and Memento Mori.
Fifteen tests build preparation and prize counters through public phase changes and sacrifices.
Boots requires five counters on its own champion, permits fast activation, retains those
counters, and stops adding them after banishment. Its end-phase trigger requires an awake,
matching champion. Memento Mori counts both players' ally deaths, requires six prizes, and
rejects activation during an opposing turn or with a pending effect. Both costs banish the
source immediately; exact top-deck draws happen only on resolution, leaving the opposing hand
unchanged. All 15 tests, card types, and coverage consistency pass. Production code is
unchanged. Rules basis: Activated Abilities 1–6; Timing and Permissions, Fast vs Slow 1–2;
Counters 4–5. The next group is level-restricted sacrifice draws on Spirit Shard and Waited Accord.

The level-restricted sacrifice pass covers Spirit Shard and both Waited Accord abilities.
Twenty tests check current champion level, temporary level resolution and expiry, fast timing,
immediate sacrifice costs, exact draws, token removal, and rejection from other zones. Twelve
Waited Accord reveal scenarios check two, three, or four eligible material cards, optional
decline, invalid selections, prior activations, separate player allowances, turn resets, and
removal of the cost increase when the source leaves the field. The two-card case exposed a
runtime defect: optional reveal could partially perform an action requiring three cards.
The existing optional-effect completeness check now checks reveal selections before offering
the action. All 32 focused tests pass. Full `ci-check` passes in
`/tmp/ga-ci-optional-reveal-final.log`: 11,167 card tests across 1,745 files, 916 engine tests
(three skipped), generated-file verification, rules audit, types, and coverage consistency.
An initial generation check detected a sibling-test change; the retry verified stable card
file hashes across both regenerations. Rules basis: Level Restriction 1–2; Sacrifice 2–3;
Activated Abilities 1–6; Reveal; optional all-or-nothing actions.
The next group is next-activation discounts on Focusing Gem and The Duchess's Thornes.
Inspection also found two unverified Thornes concerns to reproduce: lowercase `cardistry`
cost filtering versus the generated `Cardistry` label, and its ally trigger using
`card-activated` rather than a filtered ability activation. No changes to those paths yet.

The Thornes and Focusing Gem pass adds 17 tests. Focusing Gem's discount works after earlier
activations, ignores abilities and opponents, applies once with a zero-cost floor, and expires
at turn end. Both items enter rested and must wake before their rest-and-banish ability can be
paid. Two Thornes defects were reproduced and fixed: its cost rule used a keyword filter that
did not match Cardistry labels, and its ally bonus listened for card activations. The compiler
now uses the Cardistry label in both rules. Activated-ability events expose their label, and
event patterns can filter it. Only the Thornes definition changed during regeneration.
Tests verify the exact six-reserve reduction, non-ally Cardistry, nonconsumption by other
abilities or opponents, and the ally-only bonus. Combat against Stealth proves true sight
works and expires with the power bonus. All 17 focused tests and workspace types pass.

The banish-and-summon pass adds eight tests for Backup Charger and Dummy Trainer. They reject
underpayment, overpayment, repeated activation, and an invalid own-player target; banishment
and payment happen immediately. Resolution draws the exact top card into memory and summons
one token for the correct owner/controller. Public event order matches each printed sequence;
Powercell enters rested and Training Dummy awake. Existing opposing tokens remain unchanged.
The first full Thornes run passed 916 engine tests and 11,180 card tests, with only four
Kanaloa recovery cases exceeding 15 seconds. Those long three-player recovery tests now have
a local 30-second limit, retaining all actions and assertions. All 22 affected summon/Kanaloa
tests, card types, and coverage consistency pass. Final full `ci-check` passes in
`/tmp/ga-ci-thornes-final.log`: 11,192 card tests across 1,749 files, 916 engine tests
(three skipped), generated verification, rules audit, types, and coverage consistency.
Rules basis: Hindered 1–2; Activated Abilities; Triggered
Abilities; Cardistry printed instructions; Summon 1–3; Tokens; Drawing Cards.
The next group is Gustmark Gauge's Glimpse ability and Ingredient Pouch's Gather ability.

The rest-cost keyword pass covers all three Gustmark Gauge abilities and Ingredient Pouch.
Nineteen tests check exact payments, immediate rest, refusal while rested, and reuse after
waking. Gauge cases cover empty, one-card, and longer decks; top/bottom choices; invalid
selections; level-one versus level-two power; own Chessman-only bonuses; and unchanged
opposing decks. A same-turn combat case leaves Golden Pawn alive at one damage under the
life bonus, then rests Gauge at cost payment. Pawn dies and its draw resolves before Glimpse,
which sees the next card. Pouch cases check both champion classes and turn players, owned
awake Herb tokens, unchanged opposing tokens, and random state advancing only at resolution.
Twenty-four seeds reproduce their outcomes and collectively summon all six ingredients.
All 19 tests, card types, and coverage consistency pass. No production code changed.
Rules basis: Gather 1–3; Glimpse 1–2; Activated Abilities; Buff and continuous stat changes;
state-based effects. The next group is Exquisite Dessert and Delicious Pastry sacrifice buffs.

The sacrifice-buff pass covers Exquisite Dessert and Delicious Pastry. Sixteen new cases
check both champion classes, own and opposing targets, exact reserve payments, and rejection
of missing, duplicate, non-ally, and non-field targets. Sacrifice is immediate: Dessert moves
to the graveyard and the Pastry token ceases to exist. Neither source can then pay for its
buff or recovery ability again. The buff appears only on resolution, gives exactly +1 power
and life, persists into later turns, and produces two combat damage from Woodland Squirrels.
Reclaim responses move the target to hand before resolution, preventing the buff without
refunding paid costs. Existing opposing sources and other allies stay unchanged. All 22
affected tests, card types, and coverage consistency pass. Production code is unchanged.
Rules basis: Sacrifice 2–3; Buff 1–4; Activated Abilities; target legality on resolution.
The next group is counter-paid draws on Cunning Broker and Pendant of Accrual.

The counter-paid draw pass covers Cunning Broker and both Pendant of Accrual abilities.
Nineteen tests build counters through public end/recollection phases, reject payment with
fewer than two counters, spend exactly two at activation, rest the source immediately, and
draw only on resolution. Both abilities work during either player's turn and can be reused
after waking. Broker draws to hand and cannot spend opposing champion counters. Pendant
draws to memory; its opponent can pay exactly two reserve to prevent debt, while declining
adds one counter. Its beginning-of-recollection payment cannot use cards still in memory:
zero/one-card hands reject acceptance, then recollection returns those cards after the debt
trigger finishes. All 19 tests, card types, and coverage consistency pass. Production code is
unchanged. Rules basis: Counters 1–5; Activated Abilities 1–6; Recollection Phase 1–5.
The next group is entry replacement effects on Key Slime Pudding and Synth Disrupter.

The temporary entry replacement pass covers Key Slime Pudding and Synth Disrupter.
Twenty-two tests check both players, matching and nonmatching champion classes, multiple
sources, repeated entries, token summons, and expiration. Pudding adds one buff counter per
source only to its controller's Slime allies; Slime phantasias and existing allies stay
unchanged. Its counters remain after the turn ends, while later entries receive no bonus.
Disrupter makes either player's new Automaton allies enter rested, including both tokens
from Summon Sentinels, while preserving their printed entry buff counters. Existing allies
and other ally types stay unchanged. Both effects continue after their sources are banished
and expire at turn end. All 22 tests, card types, and coverage consistency pass. Production
code is unchanged. Rules basis: Replacement Effects 1–5; Activated Abilities; Buff.
The next group is banish-paid card movement on Tabula of Salvage and Enfeebling Orb.

The banish-paid card movement pass covers Tabula of Salvage and Enfeebling Orb.
Seventeen tests verify immediate source banishment and movement only on resolution during
either player's turn. Tabula returns zero, one, three, or five selected graveyard cards in
the chosen bottom-deck order, leaves other cards unchanged, works with an empty graveyard,
and rejects duplicate, excess, opposing, and wrong-zone selections. Orb requires an opposing
player target; that opponent alone chooses two hand cards, or the available cards with a
smaller hand. Wrong-player answers and invalid selections reject without state changes.
Existing memory and the controller's hand remain unchanged. All 17 tests, card types, and
coverage consistency pass. Production code is unchanged. Rules basis: Playing Cards —
Resolution, General Rules 2–4; Game Zones — Main Deck 4 and 6.
The next group is banish-paid draws on Teardrop Diadem and Bauble of Abundance.

The banish-paid draw pass covers Teardrop Diadem's draw and exclusive Floating Memory payment,
plus Bauble of Abundance. Forty draw tests check both turns and matching/nonmatching classes,
immediate source banishment, no draw before resolution, exact top-card order, hand versus
memory destinations, and insufficient decks. Diadem draws three into its controller's memory;
Bauble draws one into each player's hand. Failed draws cause the correct player to lose, and
Bauble ends in a draw when both decks are empty. Four materialization tests reject ordinary
memory, under/overpayment, duplicates, wrong-zone cards, and opposing Floating Memory cards;
exactly three own graveyard Floating Memory cards pay the cost while leaving memory intact.
All 44 tests, card types, and coverage consistency pass. Production code is unchanged.
Rules basis: Drawing Cards 1–3 and 6; Ending the Game 5–6; Floating Memory 1–2.
The next group is Cardistry draw abilities on Eight of Hearts and Five of Diamonds.

The Cardistry draw pass covers Eight of Hearts and Five of Diamonds. The shared Cardistry
suite now checks either player's turn, exact reserve payment, overpayment rejection, and
exact draw counts and destinations. Repeated Suited reserve costs count only once, opposing
objects do not reduce costs, and the source counts toward its own discount. Eight draws two
to hand; Five draws one to memory. Four additional cases verify independent use by separate
copies and a fresh use after Reclaim returns a used source to hand and it re-enters the field.
The other copy remains used. All 48 affected tests across eight cards, card types, and coverage
consistency pass. Production code is unchanged. Rules basis: Drawing Cards 1–3;
Ability Tracking 1–2; each card's printed Cardistry cost and activation restriction.
The next group is sacrifice damage on Molten Cinder and Combustible Potion.

The sacrifice damage pass found that Molten Cinder accepted champions that had not leveled
up this turn. Six public-action regression cases reproduced the missing target restriction.
The compiler now preserves that restriction with a typed leveled-up-this-turn filter, and
the engine checks the candidate champion's current-turn level-up events. Only Molten Cinder's
generated definition changed. Its eight new cases cover own/opposing champions, no level-up,
current-turn level-up, expiration, invalid targets, immediate sacrifice, and damage on resolution.
Six Combustible Potion cases cover own/opposing units, champion damage, lethal ally damage,
invalid targets, and Reclaim responses that invalidate the target without refunding sacrifice.
All 30 focused tests pass. Full CI passes in `/tmp/ga-ci-cinder.log`: 11,371 card tests,
916 engine tests, generation verification, rules audit, coverage consistency, and all workspace
type checks. Three engine tests remain intentionally skipped.
Rules basis: Activated Abilities 1–6; Resolving Triggered and Activated Abilities 1;
Playing Cards — Resolution, Checking Resolution 1.4.
The next group is distant-state draws on Perilous Mend and Draught Dodge.

The distant-state draw pass covers Perilous Mend's second paragraph and Draught Dodge's
second paragraph. Twenty-four new cases establish distant through Vantage Point and check
matching/nonmatching classes, own/opposing champions, and own/opposing ally targets. Mend
draws to hand only when its controller's champion is distant and class matches. Dodge draws
to its controller's memory only when the selected unit is already distant and class matches;
otherwise its matching-class branch makes that unit distant. Unrelated units, opposing decks,
and the other draw zone stay unchanged. Distant expires at the target controller's end phase.
All 32 affected tests, card types, and coverage consistency pass. No production changes.
Rules basis: Drawing Cards 1–3; printed Class Bonus and distant clauses; Vantage Point's
printed distant duration. Mend's curse movement/recovery paragraph remains separately untested.
The next group is class-bonus draws on Surprise Reveal and Blood Surge.

The class-bonus draw pass covers both Surprise Reveal paragraphs and all four Blood Surge
paragraphs. Eighteen Blood Surge cases build champion damage through Singeing Leap and check
both class states plus the level 5/damage 10 and level 9/damage 20 boundaries independently.
Its exact draws occur before the prohibition, which then blocks both hand and memory draws
without affecting an opponent's Bauble draw; the prohibition expires at turn end. Four real
three-player Pantheon cases verify Surprise Reveal's selected opponent reveals every hand
and memory card without moving them, the third player's cards stay unchanged, Crowd's Favor
transfers to the controller, and only matching class draws. All 22 tests, card types, and
coverage consistency pass. Production code is unchanged. Rules basis: Drawing Cards 1–3;
Playing Cards — Resolution 2–4; printed Class Bonus, level, damage, and duration clauses.
The next group is counter-removal draws on Surreptitious Scheme and Stolen Chance.

The counter-removal draw pass covers Surreptitious Scheme and Stolen Chance. Twenty-four
tests create counters through Develop Mana and Elucidate Plans, then check both class states
and own/opposing champion targets. Removal and draw happen only on resolution. Each effect
removes exactly one required counter; unrelated counters and a continuous level bonus remain.
Sequential copies draw only while counters remain, and three stacked copies with two counters
draw exactly twice. Zero required counters never draw even with other counters present.
Invalid ally, card, duplicate, and missing targets reject without state changes. All 24 tests,
card types, and coverage consistency pass. Production code is unchanged. Rules basis:
Counters 1–5 and Level 1; Drawing Cards 1–3; Playing Cards — Resolution 2–4.
The next group is level-gated draws on Guarded Dissipation and Reveal the Hidden.

The level-one draw pass covers both Guarded Dissipation paragraphs and Reveal the Hidden's
draw paragraph. Twenty-eight cases check own current levels zero/one/two, both class states,
either player's turn, exact two-reserve payment, and temporary Cram Session level before/after
expiration. The opponent's higher level never enables the draw. Ten prevention cases verify
Guarded Dissipation uses the greatest controlled Sword power rather than the sum, ignores
non-Swords and opposing Swords, applies its capacity once across repeated damage, and expires
at turn end. All 38 tests, card types, and coverage consistency pass. Production code is unchanged.
Rules basis: Drawing Cards 1–3; printed Level 1 restriction and prevention capacity/duration.
Next, finish Reveal the Hidden's stealth removal, prohibition, affected-object scope, and expiry.

Reveal the Hidden's remaining paragraph now has eight focused cases. Existing allies on
both sides lose stealth, become legal attack targets, and cannot regain stealth from Smoke
Bombs that turn, while Smoke Bombs still draws. Existing champions lose Take Cover's stealth
and cannot regain it until expiry; Take Cover still grants distant. Printed stealth returns
at turn end, and new grants work again. Allies entering later, including an existing ally
returned by Reclaim and replayed, are new field instances outside the locked affected set.
Both class states and both players' turns are covered. All 22 card tests, card types, and
coverage consistency pass. Production code is unchanged. Rules basis: Stealth 1–4;
printed "each unit", "those units", and "this turn" clauses.
The next group is optional material-deck banishment on Weight of Looking Up and Break the Line.

The optional material-deck banishment pass found two missing selection restrictions: Weight
of Looking Up allowed champions below base level three, and Break the Line allowed non-Warrior
champions. Eight failing selection cases reproduced those omissions. The compiler now retains
both descriptors; regeneration changed only those two card definitions. Twenty passing cases
cover accept/decline, matching/nonmatching classes, eligible levels, invalid cards and zones,
empty/ineligible material decks, exact one-card selection, and consequence timing. Weight
draws to memory only after successful banishment. Break rejects activation outside combat;
accepted payment ends combat, banishes the pending Fireball, and prevents its damage, while
declining or lacking a valid payment leaves combat active. Full CI passed in
`/tmp/ga-ci-material-banish.log`: 11,507 card tests, 916 engine tests, generation verification,
rules audit, types, and coverage consistency. Three engine tests remain intentionally skipped.
Rules basis: Playing Cards — Resolution 2–6; printed base-level/class restrictions;
Break the Line's phase-ending reminder. Next, finish full validation and select the next group.

The counter-dependent damage/destruction pass covers Gilded Pyre and Manifest Threat.
Thirty-eight tests check matching/nonmatching classes and own/opposing targets. Pyre deals
exactly two without buffs and four with one or two buffs, including buffs added in response;
unbuffed champion targets take two. Manifest adds a debuff first and destroys only when a
debuff exists on resolution. Existing buffs cancel its first debuff, while a responding
Exquisite Dessert cancels an existing debuff and changes destruction into adding one debuff.
Later copies destroy that ally normally. Unrelated allies remain unchanged, and invalid target
types reject without mutation. All 38 tests, card types, and coverage consistency pass.
Production code is unchanged. Rules basis: Counters, Buff 4; Playing Cards — Resolution 2–4;
printed conditional effect clauses. Next: Harmonize on Carpsong Coda and Pluming Crescendo.

The Harmonize pass covers both paragraphs on Carpsong Coda and Pluming Crescendo. Thirty-seven
tests check matching/nonmatching classes, own/opposing Melody activation, prior turns,
non-Melody actions, pending Melodies, and Melodies activated in response. Coda mills before
calculating damage, uses the maximum life among its controller's water Animal/Beast ally cards
in the graveyard, ignores other zones and opposing cards, and mills short/empty decks without
a draw loss. Crescendo creates exactly two owned tokens before applying its Animal power
bonus; non-Animals and opponents do not receive that bonus, later entrants are excluded, and
the bonus expires at turn end. All 37 tests, card types, and coverage consistency pass.
Production code is unchanged. Rules basis: Playing Cards — Resolution 2–4; Drawing Cards 6;
printed Harmonize history and duration clauses. Next: Splashing Perch and Starstrung Reading.

The distant Glimpse pass covers Splashing Perch and both paragraphs on Starstrung Reading.
Forty tests verify distant checks at resolution, opponent-state exclusion, repeated and stacked
Perch resolutions, Glimpse ordering with short or empty decks, and the three-use Aethercalling
grant. Loading checks reject non-Aethercharge cards and opposing weapons. Declined loading still
uses an occurrence; an opponent's Glimpse does not. The grant expires at turn end. Focused tests,
card types, and coverage consistency pass. Production code is unchanged. Rules basis: Keywords
and Abilities — Aethercalling 1–2; printed distant, Glimpse, and grant duration clauses.
Next: Coriolis Ward and Harmonious Mantra.

The Shifting Currents conditional pass covers Coriolis Ward's memory draw and Harmonious
Mantra's recovery. Seventy-two new tests cover all four directions and absent mastery,
current champion levels, empty and partly damaged champions, and direction changes in response.
A temporary level increase contributes to North recovery. Recovery never removes more damage
than exists; West draws only into memory. All 96 affected tests, card types, and coverage
consistency pass. Production code is unchanged. Rules basis: Game Terms — Recover 1–2.2;
Glimpse 1–2; printed Shifting Currents conditions. Next: Pearled Prayer and Mana Resonance.

The activation-context pass fixes Pearled Prayer's own-main-phase condition. Four failing
public-action tests proved that the old compiler granted Recover 7 during an opponent's main
phase. The compiler now requires the controller's turn as well as the recorded activation phase.
Regeneration changes only Pearled Prayer's definition. Twenty-four tests cover both class states,
own main, opposing main, own end, and four damage totals. Mana Resonance gains 68 tests for
its maximum opposing Spell discount and draw condition: own Spells do not discount it, multiple
Spells use the maximum rather than their sum, and all-Reservable payment draws twice while
any card reserved to memory permits only one draw. All 92 focused tests, card types, and coverage
consistency pass. Full CI passes: 11,786 card tests and 916 engine tests, plus generation,
rules audit, all type checks, and coverage consistency. Rules basis: Game Terms — Recover 1–2.2; Playing Cards —
Card Activation; printed activation, turn ownership, and payment conditions.
Next: Equip with Courage and Wuthering Sforzando.

The next-attack pass covers Equip with Courage and both Wuthering Sforzando paragraphs.
Forty-eight tests prove linked-item counts of zero through two, unrelated links, stacked bonuses,
other allies attacking first, one-use consumption, same-turn wake and second attack, turn-end
expiry, and target departure/reentry. Bonuses modify the attack rather than the ally's standing
power. Wuthering's discount checks separate Cleric, Tamer, and Spirit champions against current,
previous-turn, opposing, and absent Melody history. All 48 tests, card types, and coverage
consistency pass. Production code is unchanged. Rules basis: Triggered Abilities 6–10;
Continuous Effects — General Rules 1–2; Link 1–7. Next: Evanescent Winds and Inspiring Aethercharge.

The Phantasia-ally pass fixes the compiler's conjunction filter. Four public-action tests
proved Evanescent Winds wrongly buffed non-ally Phantasias, causing a later animation to inherit
its earlier life bonus. The filter now requires both PHANTASIA and ALLY. Regeneration changes
only Evanescent Winds and Grim Foreboding. Sixteen new tests cover existing versus later animated
objects, ordinary and opposing allies, repeated spells, turn expiry, Inspiring Aethercharge's
power bonus and departure/reentry, and Grim Foreboding's Agility 3 on either player's turn.
Agility rejects wrong return counts and returns exactly the chosen three memory cards. All 26
affected tests, card types, and coverage consistency pass. Full CI passes: 11,850 card tests,
916 engine tests, generation verification, rules audit, all type checks, and coverage consistency. Rules basis:
Continuous Effects — Instanced Effects 1–2; Keywords and Abilities — Agility 1–2.
Next: Bolster Ranks and Cell Forging.

The counter-mode pass covers Bolster Ranks and Cell Forging. Twenty-four new tests reject
missing, duplicate, unknown, and multiple modes; verify resolution order between Drone summons
and group counters; exclude opposing allies, champions, and weapons from the group effect;
and show counters persist while later allies remain unchanged. Cell Forging adds exactly two
durability per resolution to either player's weapon, or summons its own Powercell without
requiring any weapon. Wrong target types and target counts roll back. All 26 affected tests,
card types, and coverage consistency pass. Production code is unchanged. Rules basis:
Card Activation 1.4–1.5; printed summon, counter, and mode clauses.
Next: Displace and Advantageous Perch.

The return-zone pass fixes Action descriptors and two zone-change boundaries. Twelve failing
Advantageous Perch tests proved its Ranger restriction was missing. The generic descriptor
parser now retains a capitalized qualifier before Action. Regeneration changes Advantageous
Perch, Bombastic Sprint, Dante Hemomancer, Maiden of Reverent Gale, and Sword Saint's Vow.
New Maiden tests reject non-Spell wind actions; a Sword test excludes non-Craft actions.
Displace tests proved that a linked item incorrectly survived its host leaving and returning
within one resolution. Link legality now detects a host departure since the link's own entry,
without treating same-zone moves as new entries. Event admission prevents tokens outside the
field from changing zones again before they cease. Public tests cover stolen allies returning
to their owner, rested entry, cleared counters/damage, broken links, and tokens not returning.
All 46 affected card tests, 117 focused engine tests, card/engine types, and coverage consistency
pass. Full CI passed 11,904 card tests and 916 engine tests but failed one compiler shape
assertion for Bombastic Sprint. Action class qualifiers now use the class filter; the next-fast
permission normalizes its existing class condition without duplicating a subtype filter. All 123
compiler tests pass after that repair. Rules basis: Link 4–5; Tokens 3–3.1; Game Zones 5.1;
printed return and qualified Action clauses.
Next: Sacred Engulfment and Volcanic Crescendo.

The Empower pass adds 68 public-action cases for Sacred Engulfment and Volcanic Crescendo:
optional zero/one/three fire-card banishment, invalid selections with rollback, additive next-Spell
level changes, a non-Spell not consuming Empower, turn expiry, and own/current Melody history
for Harmonize damage. Dante Hemomancer adds 22 cases plus its existing three lineage cases.
They cover each separate empowered Spell, optional recovery, repeated damage from a single
Burst Asunder, unempowered damage, exact X payment/range/rest limits, capped recovery, and
unpreventable self-damage preserving a prevention shield for later damage.
Two failing Dante cases exposed a source-lifetime problem: damage triggers inspected the Spell
after it had left the stack and lost Empower. Damage events now retain the source snapshot.
The compiler also replaces Dante's incorrect per-player/turn occurrence with a per-source
occurrence; the engine limits that history to the current object incarnation. A kernel regression
checks distinct sources, repeated events, same-zone moves, and departure/reentry. All 25 Dante
and six focused engine tests pass. Full CI passed 11,995 card tests (1,785 files),
917 engine tests (180 files, three tests/two files skipped), generation, rules audit, all types,
and coverage at 3,018.
Rules basis: Empower 1–3; Triggered Abilities 1.1 and 11; Game Zones 5.1 and 7;
printed Dante, Sacred Engulfment, and Volcanic Crescendo clauses.
Next: Charge the Soul and Burning Aethercharge.

A JSON restart probe then found that event object/source snapshots retained runtime Sets in
the persistence DTO. JSON reduced those Sets to empty objects. Twelve Dante cases failed after
saving in the middle of Burst Asunder. Both proposed and committed event serializers now
explicitly convert and restore the common object snapshot and damage-source snapshot. All 25
Dante cases pass, including 12 real JSON restarts between damage steps and a single recovery
for each empowered source after continuation. Twenty-eight focused persistence, occurrence,
link, and zone tests and both package type checks pass.

The damage-and-load pass adds 96 cases for Charge the Soul and Burning Aethercharge. They
check own/opposing units or champions, illegal target counts/types with rollback, damage before
the load decision, optional decline, missing hosts, both valid hosts, wrong owner/type/zone and
duplicate hosts, and loading after damage is fully prevented. Matching and nonmatching classes
use the same printed base effect. Both files pass all 102 tests, including existing Kindle and
Floating Memory coverage. Full CI passes at 3,020: 12,091 card tests (1,785 files), 917 engine
tests (180 files, three tests/two files skipped), generation verification, rules audit, all types,
and coverage consistency. Rules basis: Load 1; printed damage and optional load clauses.

The ordered-memory pass adds 128 cases across Stabilizing Capacitance, Buried Grief, and
Fractal of Refreshment (134 total with existing Capacitance level/class cases). Cases cover
zero/one/all selected memory cards, card versus Reservable payment, empty/short/full decks,
return order independent of reveal order, drawing returned cards after an initially empty deck,
held versus newly drawn hand cards, invalid ownership/zone/count selections, and empty-deck loss.
Eighteen Fractal decline cases exposed an invalid implicit result reference. The compiler now
keeps the optional reveal/return/draw chain together and counts the actual returned-card binding.
Only Fractal's generated definition changes. Six initial three-card failures were test omissions:
the existing engine correctly requests a separate order after revealing; the tests now answer it.
Two Buried Grief cases exposed a decision left open for a player already marked lost by an empty
draw. Explicit resolution choices now exclude lost players and skip the dependent instruction
when no chooser remains, as reserve/discard/reveal operations already do. All 257 focused card
and compiler tests, 24 focused draw/end-game/simultaneous-choice engine tests, package types,
and coverage consistency pass at 3,023. Full CI passes: 12,219 card tests (1,787 files),
917 engine tests (180 files, three tests/two files skipped), generation verification, rules audit,
all workspace types, and coverage consistency.
Rules basis: Drawing Cards 1–3 and 6; Ending the Game 2 and 5; printed reveal/return/order clauses.
Next: Reflect the Skies and Think Deep.

The ordered-deck pass adds 182 public cases for Reflect the Skies, Think Deep, and Sly Songstress.
Reflect covers class costs, zero/short/full decks, two random seeds, forced bottom-card selection,
random placement followed by Glimpse, and all-top/all-bottom/split results. Its 74 tests pass.
Think Deep's initial 37 failures exposed two causes: the compiler omitted Fatestone from
"a Fatestone or a Fatebound object", and an up-to top-deck selection accepted the second card
without the first. The paired-subtype parser now allows a repeated article. Only Think Deep and
Sly Songstress definitions change; Companion Fatestone remains unchanged and its tests pass.
Ordered-zone selection validation now takes a contiguous edge slice of the submitted length,
with top and bottom regression cases. Think Deep's 62 cases prove Fatestone/Fatebound/both,
wrong owner/zone, exact costs, Glimpse reorder, and zero/one/two consecutive top cards.
Sly Songstress's 54 cases include 48 new cases for Harmony, Melody actions and allies, wrong
activation owner, nonmatching cards, optional decline, empty hands, and discard before draw.
All 319 focused card/compiler tests, 113 focused engine tests, card/engine types, and coverage
consistency pass at 3,027. Full CI passes: generated files, rules audit, coverage, all types,
12,401 card tests, and 919 engine tests (3 skipped).
Rules basis: Glimpse 1–2; printed bottom-four, top-card, subtype-alternative, and activation clauses.

The reveal-and-return pass adds 230 public cases across Modulating Cadence, Rally the Peasants,
Foraging Fox, Eventide Lure, and SignalTech X Ultra. Cases cover empty/short/full decks,
optional decline, wrong owner/zone, cards outside the viewed group, each qualifying subtype,
exact hand versus memory transfers, and reversed bottom-deck order. Modulating Cadence also
checks its own Animal ally count, class restriction, and zero-cost floor. SignalTech initially
failed 24 cases because its reveal step reopened the ally choice instead of using its result.
The compiler now reveals all cards in the selected binding. Only SignalTech's generated
definition changes. Its 40 cases verify immediate rest, no second choice, ordering before
sacrifice, banishment for the sacrificed regalia, and no sacrifice when no card enters hand.
All 248 focused card tests, 123 compiler tests, card types, and coverage consistency pass at
3,033 covered abilities. Full CI passes: generated files, rules audit, coverage, all types,
12,631 card tests (1,792 files), and 919 engine tests (3 skipped).
Rules basis: Reveal 1–2 and Sacrifice 2; printed selection, reveal, transfer, and order clauses.
Next: Twisted Verdict and Divining Streams.

The opponent-choice and reveal-binding pass adds 216 public cases. Twisted Verdict's 72 cases
verify the chosen opponent alone receives and answers both choices, exact memory transfer,
private look events, short decks, invalid targets, and ordered bottom remainders. Divining Streams
adds 60 cases for all three-card destination permutations, short decks, and rejecting repeated
or outside cards. Lena adds 60 cases and Nature's Insight adds 24. They initially fail 32 and
24 cases respectively because nested reveal operations reopen a previously chosen card.
Both compiler clauses now reveal all cards in their selected binding, preserving the choice.
Only these two generated definitions change. Existing tests now finish the real deck-ordering
step instead of accepting a repeated card choice. Lena covers normal/distant costs, Ranger
ally filtering, class independence, and decline. Nature's Insight covers selected reserve costs
0/1/4, exact preserved material-deck transfers, empty/short decks, and reveal events.
A catalog scan across all faces finds no remaining reveal nested under a choose that reuses its
selection id. All 387 focused card/compiler tests, card types, and coverage consistency pass at
3,035 covered abilities. Full CI passes: generated files, rules audit, coverage, all types,
12,847 card tests (1,793 files), and 919 engine tests (3 skipped).
Rules basis: Reveal 1–2; Game Zones - Public vs Private Information 1.2.1 and 6.1;
printed opponent chooser, destination, preservation, and reserve-cost clauses.
Next: Conjuring Fluorescence and Halcyon Animus.

The effect-materialization pass adds 84 public card cases for Conjuring Fluorescence and Halcyon
Animus. They cover own material deck versus banishment, invalid card types/owners/zones,
zero/one memory costs, reserve paid with cards or Reservable fractals, ordinary memory and
Floating Memory, no eligible regalia, stack entry before field entry, and the Merlin/Sheen 8+
fast-speed boundary at 6/7/8/9 mastery counters. Six cases exposed a mandatory declaration
with no legal payment or cancellation when its memory cost was unaffordable.
The materialization admission path now proves fixed-cost shortfalls using all available memory
plus every active Floating Memory card as an upper bound. This proof excludes variable/mode/
target-dependent costs, replacement costs, and contribution methods; it does not infer
impossibility from bounded command enumeration. Such a proven shortfall permits cancellation
and continuation. Affordable mandatory declarations still reject cancellation. Three engine
cases test costs 0/1/2 with one memory, legal-command exposure, atomic rejected payments,
JSON save/restore, and a following draw. All 84 card tests, 29 focused engine tests, package
types, and coverage consistency pass at 3,038. Full CI passes: generated files, rules audit,
coverage, all types, 12,931 card tests (1,795 files), and 922 engine tests (3 skipped).
Rules basis: Card Materialization 1–3.4, especially 3.3 on unpayable costs; printed permission,
zone, cost, champion, and sheen clauses. Broader impossible declarations with variable or
alternative costs remain outside this sufficient shortfall proof and need further coverage.
Next: Leeching Bolt and Hemoflux Drain, including Empower preservation and the Damage 20 cost boundary.

The drain/recovery pass adds 519 public cases for Leeching Bolt and Hemoflux Drain: levels
0/1/4/5, Empower 3, own/opposing champions and allies, full/partial/no prevention, and recovery
with/without prior damage. Leeching Bolt recovers a fixed two even when damage is prevented;
Hemoflux recovers only actual damage. Hemoflux's class-dependent cost checks damage 19/20/21.
A full Leeching Bolt preservation/return case exposed that direct preserved-state effects left
cards face-down in the material deck. The effect executor now turns directly preserved cards
face-up there. This fixes the shared effect semantics rather than changing generated card text.
Opponent engine projections now show Leeching Bolt and all Nature's Insight preserved cards.
Returning Leeching Bolt through the public command consumes the materialization opportunity,
returns it face-down to hand, and clears preservation; wrong-player and wrong-phase requests
remain atomic failures. All 546 focused card tests, 139 core/keyword engine tests, card/engine
types, and coverage consistency pass at 3,042. Full CI passes: generated files, rules audit,
coverage, all types, 13,450 card tests (1,797 files), and 922 engine tests (3 skipped).
Rules basis: Damage 1, 7, 9, and 13; Recover 1–3; Preserve/Preserved 3–4;
printed fixed versus dealt-damage recovery, class, Empower, and Damage 20 clauses.

The catalog contains 2,495 cards and 4,544 executable abilities. The coverage report records 3,042
covered abilities, zero blocked abilities, and 1,502 abilities still without behavioral evidence.
Zero recorded blockers is not exhaustive semantic proof. Run `coverage:cards:next` in
`packages/cards` to select the next behavior group. Other conditional cost reductions remain untested.
Damage effects with extra costs, counters, and dice,
plus other conditional card paragraphs, also remain without behavioral evidence.

Rules basis: [Card Activation 1.4–1.6](https://rules.gatcg.com/game-mechanics/game-mechanics-playing-cards/playing-cards-card-activation),
[Link 1–5](https://rules.gatcg.com/glossary/keywords-and-abilities#link), and
[Double-faced Cards 2–4 and 9](https://rules.gatcg.com/general-rules/general-rules-card-characteristics/double-faced-cards).

The remaining phases below include integration work. That work is separate from this engine and
card checkpoint.

The rules engine and current catalog are executable. The next phase should turn that foundation
into a production simulator while increasing confidence that generated card semantics remain
correct as the official rules and catalog evolve.

Work is ordered by dependency and risk. A later phase should not create its own rules logic to
work around an unfinished earlier phase.

## Phase 0 — Make Generation Reproducible

**Goal:** the official inputs and compiler produce the committed catalog without manual repair.

The current catalog is executable, but a full regeneration has previously exposed drift between
the generic ability compiler and hand-corrected generated definitions. This is the highest-risk
maintenance gap because future catalog refreshes can overwrite known-good semantics.

Deliverables:

- Establish one authoritative pipeline from official Index snapshot to normalized catalog to card
  definitions.
- Make `pnpm generate` produce a clean Git diff from a clean checkout.
- Move exceptional card semantics into typed compiler rules or explicit maintained overrides with
  provenance; never patch generated output without an owning source.
- Add a generation manifest containing the official snapshot identity, compiler version, card
  count, ability count, and output fingerprint.
- Keep the zero-`unparsed` and whole-catalog match-program admission gates.

Definition of done:

- Two consecutive clean regenerations are byte-for-byte identical.
- No generated file changes after `pnpm run ci-check`.
- A card compiler gap fails closed with the card and paragraph identified.

## Phase 1 — Build the Simulator Adapter

**Goal:** expose the engine through the game-agnostic simulator contracts without moving Grand
Archive rules into shared packages.

Deliverables:

- Add the Grand Archive adapter in the agnostic-simulator workspace.
- Map engine player, object, zone, command, decision, log, and wait-state types to shared simulator
  contracts.
- Render controls exclusively from `listGrandArchiveLegalCommands` and the viewer projection.
- Implement setup for Standard first, then Draft and Pantheon.
- Preserve object incarnation and state version in every client command.
- Add deterministic visual fixtures for pregame action, materialization choice, Opportunity,
  decision, resolving, and game-over wait states.

Definition of done:

- Two players can complete a real Standard match in the browser without debug-state mutation.
- Hidden cards cannot be recovered from client payloads or logs.
- Rejected and stale commands leave the displayed match unchanged.
- Simulator behavior tests drive real controls and assert both HTML and engine outcomes.

## Phase 2 — Add the Server and Replay Boundary

**Goal:** make matches reconnectable, auditable, and safe under concurrent commands.

Deliverables:

- Integrate the runtime with the game-server adapter using expected state versions.
- Persist validated snapshots and the accepted command/event stream.
- Define idempotency behavior for retried client commands.
- Restore suspended decisions, replacement continuations, combat, and Effects Stack resolution after
  process restart.
- Create a Grand Archive replay format and focused replay inspection command.
- Project viewer-specific state and logs server-side; never send authoritative state to clients.

Definition of done:

- A match can stop at every decision family, serialize, restart in another process, and continue.
- Duplicate or stale submissions cannot pay a cost or resolve an effect twice.
- A replay reproduces the same final snapshot fingerprint and public logs.

## Phase 3 — Strengthen Rules and Catalog Drift Detection

**Goal:** official changes cannot inherit an obsolete `implemented` status silently.

The current audit discovers new headings, but changed prose under an existing heading retains the
same audit key. Add content-aware provenance.

Deliverables:

- Record a normalized content hash for every audited rule unit.
- Mark a unit pending when its official text hash changes.
- Record the rules mirror revision or synchronization timestamp in generated audit metadata.
- Diff added, removed, renamed, and changed rules in CI output.
- Tie card-catalog snapshots to their official source version and generation manifest.

Definition of done:

- Editing the body of an existing mirrored rule causes the completion gate to fail.
- Refreshing the rules mirror produces a bounded review list.
- Removed or renamed rule units require an explicit migration rather than disappearing unnoticed.

## Phase 4 — Expand Card-Level Behavioral Confidence

**Goal:** move from complete structural executability toward systematic semantic confidence.

Deliverables:

- Generate a coverage manifest mapping every executable ability to shared primitive coverage,
  keyword coverage, a card-specific regression, or an explicitly reviewed static/no-op
  representation.
- Prioritize cards with nested choices, replacement effects, copied activations, private
  information, variable costs, multiplayer selection, and last-known information.
- Require every card bug to add a production-runtime regression through `GrandArchiveTestEngine`.
- Add cross-card interaction suites for mechanics that compose at different layers.
- Track behavior coverage independently from parser and match-program admission.

Definition of done:

- Every catalog ability has a visible behavioral-evidence classification.
- No test implements a parallel rule shortcut.
- Shared engine defects are repaired at the owning rule boundary and proven by a real catalog card.

## Phase 5 — Continuous Fuzzing and Performance Budgets

**Goal:** discover long-tail state, persistence, and convergence failures before release.

Deliverables:

- Run deterministic real-catalog match fuzzing on a scheduled CI job.
- Run snapshot round-trip validation after every accepted fuzz command.
- Retain bounded seed, command, state-version, and refusal evidence for reproduction.
- Add focused generators for replacement ordering, simultaneous multiplayer choices, target
  invalidation, copy/LKI behavior, and phase transitions.
- Establish measured budgets for legal-command enumeration, command execution, snapshot size, and
  full automated matches.

Definition of done:

- Every fuzz failure is replayable from a seed and committed command transcript.
- Performance gates compare against versioned baselines rather than arbitrary machine timings.
- Transaction, stabilization, and stack limits produce diagnosable failures rather than hangs.

## Phase 6 — Improve Player-Facing Logs and AI Evaluation

**Goal:** make engine decisions understandable to players and measurable for automated strategies.

Deliverables:

- Complete localized messages for costs, replacements, triggers, target invalidation, fizzling, and
  state-based outcomes.
- Add dual-viewer log audits for every event carrying private information.
- Build champion-profile benchmark decks and deterministic strategy evaluations.
- Measure legality failures, match termination quality, decision depth, and strategy regressions.
- Keep bots as consumers of legal commands; never let a strategy bypass engine legality.

Definition of done:

- A player can understand why an action failed or an effect changed from the projected log.
- Strategy comparisons are reproducible from deck lists, seeds, and engine fingerprints.
- AI harness changes cannot reveal hidden information or mutate authoritative state directly.

## Recommended Immediate Milestone

Start with one vertical slice combining Phases 0 and 1:

1. Make regeneration stable for the cards used in a minimal Standard fixture.
2. Implement the simulator adapter for initialization, viewer state, wait state, legal commands,
   command submission, and logs.
3. Play one deterministic browser match through pregame, materialization, activation, combat,
   decisions, and game end.
4. Persist and restore the match once during that flow.

This milestone exercises the real integration boundaries early without weakening the engine or
waiting for every production service to be built first.
