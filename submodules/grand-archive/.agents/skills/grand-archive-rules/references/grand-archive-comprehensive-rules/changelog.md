# Changelog

IMPORTANT LINKS:

* [Tournament Rules and Guidelines](https://trg.gatcg.com/)
* [Infraction Policy Guide](https://ipg.gatcg.com/)
* [Index Database](https://index.gatcg.com/)
* [Judge Handbook](https://jh.gatcg.com)

\
To download the full PDF of the rulebook, [click here](https://rules.gatcg.com/~gitbook/pdf?limit=150).

To check out the rulebook and the full list of changes via GitHub, [click here](https://github.com/weebsoftheshore/gitbook-rules).

\
August 21st, 2026

* Various small fixes
* Slight changes to attack legality on weapons (or any wielded objects) and Commands for attack legality with having 0 power.
* Corrected Static counter ability to be only for combat damage.
* Added missing Sheen X+ restriction ability reference
* Added clarification rule for Tokens: an object classified as a token will always be a token, regardless of any other property/characteristic changes.
* Intercept clarification with Multistrike, general redirect clarifications. Added a small section for [Redirect](/game-mechanics/game-mechanics-objects-and-targeting.md)

\
\
August 17th, 2026

* Updated rules for .asphodel/paradise
  * New Keywords: [Link Shield](/glossary/keywords-and-abilities.md#link-shield), [Elysian Aura](/glossary/keywords-and-abilities.md#elysian-aura), [Aenean Progression](/glossary/keywords-and-abilities.md#aenean-progression), [Multistrike](/glossary/keywords-and-abilities.md#multistrike-n), [Cascade](/glossary/keywords-and-abilities.md#cascade)
    * For Multistrike + Cleave, combat will require that the Cleaved opponent is designated and that Multistrike additional targets pick other targets that are not or would not be defending units at the time the attack is declared. This only practically has considerations for Pantheon; the result would be that one opponent is cleaved while units controlled by another opponent may be selected for additional targets.
  * New Counter: Static. These counters are non-generic and grant an ability.
  * Updated definition: Wield. (The rules around Wielding are not new; this is to simplify the language syntax surrounding weapons being used for attacks.) There are no functional changes as a result of this being defined; however, cards will be errata'd to match the game term.
* Other changes:
  * The following updates do not involve any intended functional rules changes:
  * Updated verbiage on "gets," "gains," "has/have," "become," etc. This involves a clarification for [Curtain of Shadows](https://index.gatcg.com/edition/curtain-of-shadows-rdo1e) where the Shadow tokens that are currently in play will get +1 power for the rest of the game; however, the tokens created after Curtain resolves will not have this. Both currently controlled and future tokens will statically have the On Hit ability.
  * Moved section on continuous effect syntax from game terms to the continuous effect section. See [get/becomes/has/are](/game-mechanics/game-mechanics-types-of-effects/types-of-effects-continuous-effects.md#static-effects).
  * Added more clarity to the language of [whenever vs whenever one or more](/game-mechanics/game-mechanics-miscellaneous-topics/effects.md).
  * Amended Ambush to include the case when a Domain is an attack target
  * Amended attacker/defender roles to be retained during type changes
    * The same is true for wielded objects
  * Slight amendment for Ending the Game for clarity
  * Clarified what happens in multiplayer games when the active player loses with respect to the phases in the game.
  * Updated definition of Fizzling and Negation to keep up to date with recent Effects Stack and Card Activation/Resolution changes. No functional changes, although the wording has seen somewhat significant changes to improve clarity and consistency.

<br>

May 21st, 2026

* Everflame (and et. al.) ability tracking for Spell sources is now correctly supported within the rules. Rule 17 in Abilities has been expanded to support the intended design. While there were a couple of potential solutions for resolving this bug, including an errata to Everflame, we opted for the more persistent fix that extends to "as a Spell" interactions across the board.
  * In brief, the Everflame will trigger if a non-Spell source deals damage "as a Spell." This is the intended design, but was not supported by the then-justification within the rules. With some (poor) judgement, the example for "as a Spell" rules for Everflame was removed, with an explanation that a fix would be instated at a later time. This update covers the fix.
  * The fix: Borrowing from the example of Spirit Blade: Ensoul that allows Weapons to temporarily function as Allies without the "downside" of having an Ally type, "as a Spell" abilities allow a non-Spell source of the ability to act as if it were a Spell for the duration of the ability's resolution. This allows Spell source-dependent conditions to be fulfilled without any hardcoding of type-changing that may cause issues with subtype-based interactions around state-based checks and continuous/static effects. We believe this to be a cleaner fix than any other alternatives we considered. We apologize if handling the fix this way caused any apprehension among our players and judges. While the course we took to correct the fix has been standard for similar impactful cases, the temporary suspension of the example was too hasty.
* Other: Fixed Agility's outdated "delayed" trigger specification.

May 12th, 2026

* Added a new section to better define types of player actions and explicitly added a default rule for actions with a value of 0 (E.g., glimpse 0, recover 0, empower 0).
* Various fixes
  * Agility bug fixed
  * Missing text for fracturize example added (someone ate it)
  * Imbue subnote added for clarity with exalted
  * Phantasmagoria incorrectly specifying reflexive trigger was amended
  * Replacement effects in a resolving player action + resolution checks (if you do, when you do, etc.) note added for clarification
  * Timestamps for boons/masteries clarified
  * Restructured End of Combat step to be better in line with other sections
  * Added clarity to preserve objects + banishment interaction
  * Reworded Attacking 2.c. for better resolution of edge-case interactions
  * Typos and other stuff fixed, QOL
  * Kinda functional change for Everflame Staff:  From the last update, " 'as a spell' now counts as a spell subtype for abilities. E.g., Everflame Staff will trigger if a triggered or activated ability does damage "as a spell." This is covered as rule 17 in [Abilities](/game-mechanics/game-mechanics-abilities.md).' -> This ruling is incorrect. While this is kind of the intention, the rules don't support a simple way to resolve this interaction, so it is being tabled for now. The changes in Abilities.17 are still valid otherwise.

April 20th, 2026

* Functional rewrite/rework regarding card activations/materializations/bestowments.
  * This rework affects the structure of the Effect Stack (kind of) as well as how activations/materializations/bestowments are placed on the stack. The "old" effects stack treated each played card as a uniquely defined instance from which all information to resolve effects, create objects, or instance further copies of that activation was sourced. This meant that any properties of that activation were identically copied but treated as separate instances, so restriction abilities were applied independently in each instance of an activation copy. This was also true for creating copies of objects on the field, which copied over activation-linked properties, but did not do the same for other effects (e.g., copying a rested object did not also make the new object rested).
  * The updated system for the effects stack will function like so: When there is a card activation, materialization, etc., placed on the effects stack, the card source is given a timestamp for when it enters the stack, and its activation is placed at a new index created at the top-most part of the effects stack (treated as an empty placeholder for new cards and effects).&#x20;
    * This card source is treated as a template for the activation of the card, which is its own instance and refers to the card source.&#x20;
    * For ability activations, the card source is treated as wherever the card currently is (it isn't moved to the effects stack), and last-known information rules will apply for resolving effects. The "activation" is one of the instances where, in essence, the game is given instructions to read off the template source card to generate effects, objects, or copies.
  * This way, any effects ascribed to the card, such as Imbued, Brewed, or Prepared will still be copied over. This also has the effect of allowing instances to copy over the state of restriction abilities from the controller of that card source. E.g., if my opponent activates a card with a restriction ability that says Level 10+ and meets this requirement, a copy of that card activation I create (and control) will *also* have that restriction ability unlocked, even if I do not meet the Level 10+ requirement. This will apply to class bonuses, champion bonuses, etc. The change will also now apply to things such as Empower and also track additional cost payment information.
    * This change also specifically affects Empower, which we've changed to reflect the functional changes and moved it to a property of cards on the effects stack. Copies of activations of empowered cards will thereby also be empowered.
  * The second effect this change will have is the following: Regarding negation effects, negations that target a card activation target specifically an activation instance, not the card itself. The card remains in the effect stack and is removed as a state-based check for when the last activation instance is resolved, fizzles, or is removed from the stack. If the card itself is removed, then all above or pending activations will fizzles due to not having the card reference for the card activation. E.g., Frostbind will banish the card of the activation, moving it from the Effects Stack to Banishment. Any remaining activations of that card fizzle since there is no card to "read" and activate.
  * While the cards that are added to the effects stack are naturally timestamped, the cards themselves don't follow a specific ordering or placement in the stack. The activations, however, do, and will still follow the structured first-in-last-out ordering for resolution, regardless of what time point their corresponding card was given.
  * The wording in the [Copy](/game-mechanics/game-mechanics-copy.md) section has been slightly reworded with these changes in mind.
* Other:
  * Bug regarding play permissions fixed
  * Split ability resolution and card resolution sections to allow us greater ability to be specific and explicit when discussing one or the other, since "activation" can be ascribed to both cards and abilities. There are no functional changes pertaining to how abilities are activated, tracked, and represented in this update.
  * ~~"As a spell" now counts as a spell subtype for abilities. E.g., Everflame Staff will trigger if a triggered or activated ability does damage "as a spell." This is covered as rule 17 in~~ [~~Abilities~~](/game-mechanics/game-mechanics-abilities.md)~~.~~&#x20;
  * Regarding "modal" triggers: To cover any ambiguities and accommodate future design space, modal triggers will have the mode be determined during resolution, rather than when they are placed on the effects stack. This will clear up interactions with Ciel's Servile Possessions mastery, where, after the triggered ability is added to the Effects Stack during combat, players will be given Opportunity to affect the amount of Omens in banishment before the ability resolves. See [Triggered Abilities](/game-mechanics/game-mechanics-abilities/abilities-triggered-abilities.md), rule 5.b.

April 9th, 2026

* Further spring cleaning for the rulebook...
  * Mainly QOL, edge-case conflicts and rules, typos, etc.
  * Suppress written to explicitly be under the control of the trigger's controller for discerning resolution and order in the case of multiple resolving suppress triggers.
  * Agility now is also a given to a player as a property that expires during Clean-Up. Recollecting cards with agility does not remove "having agility" until the turn ends.

April 4th, 2026

* Rulebook cleanups:
  * Fixed pantheon format rules issue
  * Added [Ordering and Tracking](/game-mechanics/game-mechanics-miscellaneous-topics/ordering-and-tracking.md) section. This applies to card ordering, typically for the main deck, and applies to effects like Glimpse, as well.
  * Various QOL, "implied mechanics" clarifications
  * Other fixes

March 28th, 2026

* Rulebook updated in anticipation of Radiant Origins:
  * Added section on [Boons](/general-rules/general-rules-card-types/card-types-boons.md) and how to [Bestow](/game-mechanics/game-mechanics-playing-cards/playing-cards-bestowing-boons.md) Boons.
  * Added Pantheon rules in [Starting the Game](/general-rules/general-rules-starting-the-game.md#pantheon-games)
  * Added [Pantheon](/game-mechanics/game-mechanics-game-zones/game-zones-pantheon.md) to Zones
  * Included Pantheon tag in border information
  * Added section on [Statuses](/game-mechanics/game-mechanics-statuses.md)
  * Added section on [Dice Results / D Effects](/game-mechanics/game-mechanics-miscellaneous-topics/die-results-d-effects.md) for "D6" rolls.
  * Added ruling for Recovering while having 0 damage counters. E.g., Recover 1 while having 0 damage counters will still trigger "whenever you recover" abilities.
  * Added note that counters can be placed on card activations.
  * Modified [Names](/general-rules/general-rules-parts-of-a-card/parts-of-a-card-name.md) section for clarity regarding restrictions, lineages, and conventions of champion names
  * Reorganized [Imbue](/glossary/keywords-and-abilities.md#imbue) keyword to be more comprehensive/combine Imbue types
  * Added [First Boon](/glossary/keywords-and-abilities.md#first-boon) as a keyword, as well as [Level Locked](/glossary/keywords-and-abilities.md#level-locked-n), and [Class Locked](/glossary/keywords-and-abilities.md#class-locked).
  * Updated type masterlist

January 22nd, 2026

* Revised Turn Orders for consistency. Highlighted breakdowns of phase steps, mostly in categories of "Turn-based Action," "Opportunity," or "State-based checks."
  * This revision has no significant bearing on the game except for one difference; triggered abilities generated from the act of recollecting will be handled during the recollection phase as opposed to being put on the Effects Stack in the phase and resolved during the Draw Phase.
  * This breakdown should help communicate when players are receiving opportunity and when state-based checks happen for the generation of triggers or other effects.
* Addressed the implied hole regarding resolution of champion materializations: An N+1 champion materialization that becomes an N+2 champion (due to deleveling while the champion card is pending resolution) fizzles, however, this was not explicitly stated. This is not a functional change.

December 4th, 2025

* Entries added for Phantom Monarchs Release
  * Fractured Memories and Phantasmagoria added as Masteries
  * Interdiction is added to Keywords
  * MAJOR RULE CHANGE!!! - Each player now begins the game with their starting Lv 0 champion in play and resolves each of the On Enter abilities in turn order before the first turn player takes their turn. Read more in [Starting the Game](/general-rules/general-rules-starting-the-game.md) and [Turn Order](/game-mechanics/game-mechanics-turn-order.md). This rule change is effective on December 5th, 2025 with the launch of Phantom Monarchs.
    * (This rule change also cleans up the Eternal Magistrate issue \*whew\*)
  * Masteries can get counters (kind of implied, but rules are a little more explicit now)
  * Broadened language regarding the Ephemeral property (applies to card activations as well as objects; activations that would become objects are only ephemeral when they hit the field, whilst Actions (or non-object) and like card activations become ephemeral on the stack.
  * Addendum 12/12/25
    * Correctly added Anomaly under master type list
    * Ammended Attack Declarations to be more explicit with a breakdown of timings for payments and options associated with attack declarations
    * Corrected slight bug with Turn One under start of game procedures
    * Corrected slight bug with X cost verbiage. X costs for objects are counted as 0 for effects like Unbroken Mustang. For cards (not objects, not on the effects stack) value-wise, still counts as 0 when under a non-discrete set (e.g., "less than 3") but will need to match "X" when part of a discrete set. E.g., specified as "card with cost X" is valid. Finding a "card with cost 0" will not allow selecting a card with X cost while "cards with cost 2 or less" and "cards with cost 0 or X" will be valid for finding an X cost card). (edited)

\
\
October 24th, 2025

* Non-functional changes
* Various fixes, consistency changes, organizational changes, etc. Completed remainder of rules formatting according to earlier sections.
* Slight fix for reorganizing timing of state-based checks during combat to cleanup role and card-based permanence for correctly determining result of combat effects.\ <br>

September 26th, 2025

* Slightly expanded rules under [Copying](/game-mechanics/game-mechanics-copy.md) regarding classification type of copied cards (they are also cards for the purpose of the copying). While this was true before and could be interpreted as such by the rules, it should now be explicit. No functional changes.
* Cleaned up [Effects](/game-mechanics/game-mechanics-miscellaneous-topics/effects.md), [Abilities](/game-mechanics/game-mechanics-abilities.md), [Masteries](/game-mechanics/game-mechanics-mastery.md), and many other sections
* Continued to reorganize/reserialize the rulebook for consistency and indexed/addressed rulings.
* Correctly added missing Commanded Will ability entry.

August 8th, 2025

* Fixed inconsistency in rules with Ciel's mastery. Matches Index entry now. This isn't a functional change but rather fixing entry errors in the rules.
* Readability/Syntax improvements
* Slightly more clarity to ephemerate, added additional clarity support to On Kill, Immortality, Spellshroud
* Added definition of intrinsic ability explicitly, reworded how "instrinsic abilities" are referenced in ability rules
* Reminder to check the GitHub commit history for exact changes

July 28th, 2025

* Fixy things
  * Further amendment to abilities operating from the intent; properly includes static abilities (was missing)
  * Added missing TOC links and reorganized the hierarchy of sections within game mechanics
  * Added Load as a gamer term. Split "Negated" from Negate as a game term; they are now listed as separate terms in the Glossary
  * Added section on simultaneous selection rules
* Will start to reorganize rules such that each entry, if it is not a general description within a section, will be itemized under subchapter headings to give better indexing of rules. E.g., A chapter flow should read starting with a broad description (if applicable), followed by General Rules, and then subsequent specific subchapters delineating specific areas of those rules. This reformatting will be trialed and prone to feedback. The first section to undergo this change is General Rulesm, which has also received reorganization and clarification changes in each section
* Consolidated Durability, Life, Power, and Speed under [Stats](/general-rules/general-rules-parts-of-a-card/parts-of-a-card-stats.md) section
* Revamped [Object and Targeting](/game-mechanics/game-mechanics-objects-and-targeting.md) section
* Other various changes (have fun)
* Integrated with [GitHub](https://github.com/weebsoftheshore/gitbook-rules) via GitSync. Now any changes will be reflected on GitHub, along with diffs of the changes. This patch will troubleshoot this feature

July 18th, 2025

* Rulebook update in anticipation of DTR:
  * Aethercharge/Aetherwing is described under functional subtypes
    * Aetherwings are loaded with Aethercharge cards in the same way Guns are loaded with Bullets or Bows are loaded with Arrows. Aethercharge cards are Spells with power stats that allow the player to load them into an Aetherwing as they resolve
    * [Aethercalling](/glossary/keywords-and-abilities.md#aethercalling) Added to keywords
  * [Cardistry](/glossary/game-terms.md#label-keywords) added as a label keyword
  * Section on special continuous effects added, which includes [time distortion](/game-mechanics/game-mechanics-types-of-effects/types-of-effects-continuous-effects/special-continuous-effects.md)
  * [Ephemerate](/glossary/keywords-and-abilities.md#ephemerate) and [On Charge](/glossary/keywords-and-abilities.md#on-charge-n) added to keywords
    * [Ephemeral](/glossary/game-terms.md#ephemeral) added as a property
  * [Exalted element](/game-mechanics/game-mechanics-special-elements.md#exalted) added
  * [Servile Possessions](/game-mechanics/game-mechanics-mastery.md) mastery added
* Amended conditions for attacker roles in combat. Previously, the attacker's role ended simultaneously with the loss of all defending units. The attacker role will be preserved until the end of combat, and its attack target can be redirected or reselected from a legal/null target/no target to a valid target
* [Amended rules for ability activations from the intent](/game-mechanics/game-mechanics-abilities.md). Cards in the intent can activate abilities as if they were objects, with the exception of costs such as resting and sacrificing (since you can't rest or sacrifice an intent, you can only do these actions with objects)
* Additional rule for Command attack cards added regarding the intent
* Various fixes
  * Added missing keywords

June 25th, 2025

* No functional changes.
  * Added missing section describing tokens. No functional changes to how tokens are treated. (Oopsie)
  * Various clarity and consistency fixes.

May 29th, 2025&#x20;

* Rulebook revisions for MRC Alter
  * Added [Command](/glossary/keywords-and-abilities.md#command) as a keyword ability of attacks
* Continued to clarify language in public vs private section.
* Wording fixed for On Kill
* Searching and Finding section updated for clarity on instructions to Put or move cards across zones (e.g., Incarnate Majesty, Slime King)
* Section on copying clarified, additional support for considerations like Imbue.
* Phase ending ruling added (regarding not self-banishing)
* Empower 0 ruling added, stacking clause added
* Revised section on card/ability resolutions with "default choice" on optional resolving modes added

March 14th, 2025

* Slightly cleaned up [this section on combat](/game-mechanics/game-mechanics-turn-order/turn-order-combat-phase/combat-phase-attacking-and-the-combat-phase.md).
* Added missing sub-layers to layer E regarding power/life modification orders ([sorry](https://tenor.com/view/sprinkle-chef-chris-cho-onion-cooking-dancing-gif-22681225)).
* Moved siegeable to [Functional Subtypes](/general-rules/general-rules-card-types/card-types-functional-subtypes.md) and reorganized this section.
* Cleaned up the language consistency for double-faced cards.
* Other minor fixes...<br>

March 5th, 2025

* Added comprehensive [typing list ](/glossary/type-list.md)in the Glossary.
* Added keywords and counters new to HVN: Siegeable, Kindle, as keywords and Wither as a new functional counter.
  * Siegeable has required that some sections of the rulebook including On Hit, On Kill, Dies/Destroy, Cleave, and other combat-based rules to be modified to be inclusive of domains as attackable objects while not being considered units.
* Added section on [double-faced cards](/general-rules/general-rules-card-characteristics/double-faced-cards.md) and the player action transform.
* Modifed rules regarding setting stat characteristics: If an effect sets a value that the object previously did not have, such as setting a champion's power to 3, the effect will concurrently "give" that object stat which is set to a default of 0 for as long as that effect applies.
* Slightly expanded public vs private information concerning previously-public or previously-private information and play permissions.
* Clarified damage events from the perspective of damage sources.
* Clarified Opportunity context in the Materialize phase
* Updated typing and characteristics of triggers to inherit those of their sources. This is important for Strategem triggers vs Spellshroud and other similar cases. The definition of Spellshroud has been updated accordingly.
* Updated Format Conventions regarding draft to match the TRG (and fixed a minor duplicated numbered list bug)
* Cleaned up the section regarding the intent, now should read as intended.
* Fixed bug in logic regarding leveling/playing champion requirements (now explicitly have to satisfy legal conditions).
* Expanded "discrete events" regarding drawing cards to other similar classes of deck interaction, e.g. banishing, putting into graveyard, etc.

\
\
February 7th, 2025

* Slightly modified rules regarding steps for play methods. There is now a second mode selection step during reserve cost payment in the case of payment method either modifying or adding additional modes or selections. This is essentially a "hotfix" for Imbue.

February 3rd, 2025

* Expanded section for resolving [dependencies](/game-mechanics/game-mechanics-types-of-effects/types-of-effects-continuous-effects.md#dependencies).

December 4th, 2024

* Added clause to Preserve mechanic: You can return a Preserved card if you are given an option or opportunity to materialize, regardless if you have something to materialize (e.g. your material deck only consists of Preserved cards or a non-regalia card is underneath Quicksilver Grail. You would not have to reveal the card that was underneath Grail except for during the end of game procedures.
* Added clause regarding multiple retaliating units and order of damage assignment. Additional rule set regarding a "killing blow" rule where only the unit inflicting lethal damage will trigger its On Kill ability. Subsequent units after the "lethal" unit can still trigger On Hit abilities if the damage dealt is in excess.
* Corrected previous addendum to mode and target selection regarding In-line restriction abilities.
* Fixed consistencies regarding On Attack triggers.
* Shifted obedience clause on Intercept in the ability definitions rather than under obedience definitions for clarity.
* Various fixes, QOL improvements (such as download link at the top of this page)

October 17th, 2024

* Various fixes
* Explicit addition of In-line vs Static Restriction Abilities and mode/target selection regarding these effects on the Effects Stack.

October 8th, 2024

* Updated rulebook for Mortal Ambition release
  * Added keywords [Empower](/glossary/keywords-and-abilities.md#empower), and [Retort](/glossary/keywords-and-abilities.md#retort-n)
  * Equestrian is added as a [Label Keyword](/glossary/game-terms.md#label-keywords)
  * Added [Mastery](/game-mechanics/game-mechanics-mastery.md)
* Clarified rules for information across zones and last-known information
  * Expanded section and added in dedicated page to detailing tracking of card and object information across zones: [Card and Object Information](/game-mechanics/game-mechanics-card-and-object-information.md)
  * Functional change to Dusklight Communion (now the effect will apply and persist even if Dusklight Communion leaves the field)

September 23rd, 2024

* Miscelaneous clarifications and fixes. No functional changes.
  * Cost payment order codified (such as the interaction between Powercell tokens, Cordelia, and payment for Overlord)
  * "Up to X" wording includes other similar wordings for optional targeting requirements in resolution.
  * Clarification on default opportunity after activations and materializations.
  * Clarified what happens if an attack card is activated during active combat (it fizzles)
  * And that a resolved attack card must choose a valid target (can't opt to not pick and let it fizzle)
  * State checks will test for loss/win conditions first (now explicit)

August 27th, 2024

* Clarified [Timestamp](/game-mechanics/game-mechanics-types-of-effects/types-of-effects-continuous-effects.md#timestamps) rules for cards in champion lineage.
* Slightly clarified negate wording
* Added clarified language on permission-based clauses (e.g. "you may") to [Resolution](/game-mechanics/game-mechanics-playing-cards/playing-cards-resolution.md) page

August 23rd, 2024

* Sacrificing an object counts as the object being destroyed (mainly to ensure intended interaction between sacrifice and Preserve)
* Slightly expanded wording of negated zone destination rules

August 22nd, 2024

* Cleaned up [Special Game Actions](/game-mechanics/game-mechanics-miscellaneous-topics/special-game-actions-and-turn-based-actions.md) section (Drawing cards removed, rules text of cards excludes special game actions. This is mostly out of consideration for the Eternal Magistrate interaction on turn 1 for Spirit champions.)
* Modified [negation](/glossary/game-terms.md#negate) rules (negating will send things to the graveyard by default, but if the resolution of a negated card were to change the zone it would be placed in, negating will send it to the same place it would have gone upon resolution)
* Cleaned up section on [Searching and Finding](/game-mechanics/game-mechanics-miscellaneous-topics/searching-and-finding.md) with respect to failure to find among public cards
* Reconciled language on Enlighten counters across various sections on the rulebook
* Fixed [On Hit ](/glossary/keywords-and-abilities.md#on-hit)being unclear with regards to combat damage sources (applies to retaliation as well)
* Adjusted negative [LV](/glossary/game-terms.md#lv) rules (split cases for when negative values don't apply.)
* Clarified [Brew](/glossary/keywords-and-abilities.md#brew) ruling for additional activation costs
* Cleaned up [Ending the Game](/general-rules/general-rules-ending-the-game.md) section

\
July 31st, 2024

* Added leveling clause (rule #8) to [Champions](/general-rules/general-rules-card-types/card-types-champion.md)
* Corrected language around default power stats of Champions
* Slightly modified language in [Triggered Abilities](/game-mechanics/game-mechanics-abilities/abilities-triggered-abilities.md) for clarity
* Expanded [Naming](/game-mechanics/game-mechanics-miscellaneous-topics/naming.md) section for clarity in consideration of cards like Nia

July 9th, 2024

* Cleaned up inconsistency between verbiage in Attack Declarations and Retaliation Step for opportunity and timing for resolving effects
* (Re)Added hindered
* Brew rules are now more explicit

July 1st, 2024

* Slightly changed language in Champion Types to make rules clearer
* Enlighten counters have been changed from an innate champion ability to an ability of the enlighten counters themselves. Therefore, champions can still draw cards through enlighten counters under effects such as Caliburn's
* Expanded section on Play Timings with a section on Special Permissions that describe explicitly when and how players can play cards when instructed to do so or when they are given special permissions (Quicksilver Grail, Beseech, Naia, etc.)

June 28th, 2024

* Various bugfixes/clarity changes
* Sacrifice now correctly specifies that you can only sacrifice things you control
* Added negative values clause for LV

May 31st, 2024

* Slightly reworded Materialize phase to clarify when/if Opportunity is given. No functional changes
* Clarified copies being activations/materializations themselves

May 17th, 2024 (MRC Launch)

* Added entries for [Imbue](/glossary/keywords-and-abilities.md#imbue-n), [Ambush](/glossary/keywords-and-abilities.md#ambush), [Debuff Counters](/game-mechanics/game-mechanics-counters.md#debuff-counter), [Agility](/glossary/keywords-and-abilities.md#agility-n), [Unblockable](/glossary/keywords-and-abilities.md#unblockable)
* Added entries for [Redirect](/glossary/game-terms.md#redirect), [Have/Gain/Get/Are](/glossary/game-terms.md#have-gain-get-become-are), [Reflexive Triggers](/glossary/game-terms.md#reflexive-trigger)
* Reorganized and realphabetized Glossary and Game Terms
* Broadened language around discarding (any zone can be discarded from, the hand is default)
* Reworked properties section. Intrinsic properties has been relabeled to [Card Characteristics ](/general-rules/general-rules-card-characteristics.md)and is now its own section under General Rules.
* Reworked section on Properties and States to be more explicit/straightforward
* Added note on copying object activations
* Fixed card types only specifying activation at slow speed (playing at slow speed is default)
* [Vigor](/glossary/keywords-and-abilities.md#vigor) is now a triggered ability instead of being part of the turn-based actions during End Step procedures, in line with the intended triggered effect of Agility. This also means that Vigor is no longer redundant. [End Phase](/game-mechanics/game-mechanics-turn-order/turn-order-end-phase.md) steps have been adjusted accordingly
* Updated [Sideboard](/general-rules/general-rules-format-conventions.md) rules.

April 28th, 2024

* Imported rule book *(v1.0.23)* from the original document to GitBook for soft launch
* Polished wording, fixed various typos, and restructured the rulebook

***
