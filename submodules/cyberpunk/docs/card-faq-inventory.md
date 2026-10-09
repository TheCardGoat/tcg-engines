# Consolidated card FAQ inventory

<!-- Generated from card-faq-coverage.json. Run node tools/check-card-faq-coverage.mjs --write-inventory from the Cyberpunk workspace. -->

Source: [official card FAQ feed](https://api.netdeck.gg/api/faqs/cyberpunk?scope=card). Checked 2026-10-08.

244 source FAQs are consolidated into 239 entries. 240 source FAQs (235 entries) have behavior-test mappings. 4 source conflicts remain; their current-behavior tests do not verify the FAQ ruling. Run `vp run ci:faq` to verify every linked test.

Identical questions and answers share one entry, including repeated text on different cards. Equivalent wording is merged only with an explicit explanation. All official IDs and card-specific test mappings remain. Related questions with different assertions remain separate.

## Consolidated duplicates

- [Corporate Surveillance / Memory Relapse](#faq-00513475-b873-4eec-b582-c8bb969fe1e5): 2 source FAQs. Identical question and answer.
- [Misty Olszewski: Mender of Broken Spirits](#faq-e82502be-aaff-4d75-bd4b-87e00e760fa1): 2 source FAQs. Equivalent wording: both questions ask whether Legends are a valid card type choice.
- [Padre: Man of the Cross / Wakako Okada: Peace and Harmony](#faq-2376d51c-ae2c-4eb6-aed9-d25a05d56e09): 2 source FAQs. Identical question and answer.
- [Pyramid Song / Towerfall](#faq-29b8e233-81e1-4660-9df8-eb9002af9562): 2 source FAQs. Identical question and answer.
- [We Gotta Live Together / Zetatech Berserk](#faq-972b7a64-cc96-4e31-8e7f-5718d319914a): 2 source FAQs. Identical question and answer.

## Coverage gaps

- [Appetite for Destruction](#faq-f7e7ce23-ddae-4f92-a770-e2e7a0fe368e): The FAQ requires choosing one Unit when played. Current retail text applies to the next friendly Unit that wins a fight by 3+ power, without choosing one on play.
- [Bootleg Black Sapphire Show](#faq-63c9a5f8-27f2-485d-a779-79587ac49d91): The FAQ says to sell the top card without revealing it. CR 11.9.1 defines Sell as revealing the card before placing it face-down. Current retail text only says Sell the top card.
- [Dying Night: V's Pistol](#faq-881c635b-268e-4855-8617-a84587951a8f): The FAQ keeps an end-of-turn Eddie ready effect after the host leaves. Current retail text is a separate end-of-turn ability, which needs the Gear and host in play to trigger.
- [Safety Override](#faq-6b38d8b1-470f-402a-aeca-024e1db97b4d): The FAQ requires choosing one Unit when played. Current retail text applies to the next friendly Unit that loses a fight, without choosing one on play.

<a id="faq-ed0b637f-567a-418c-a759-ab8deb631ce4"></a>

## 6th Street Recruits

**Question:** If a friendly Unit steals two d6s simultaneously, can I increase two Gigs?

**Answer:** Yes, the effect triggers for each stolen d6.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [6th Street Recruits](https://cyberpunktcg.com/cards/6th-street-recruits) — `ed0b637f-567a-418c-a759-ab8deb631ce4`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — 6th-street-recruits FAQ 1

<a id="faq-4dc5a7cb-cb53-4a44-bcd4-33e373dafbd3"></a>

## Adam Smasher: Ender of Legends

**Question:** Does Adam Smasher’s [PLAY] effect trigger when he is called or flipped face-up as a Legend?

**Answer:** No, the [PLAY] effect only activates when you play Adam Smasher to the field area.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Adam Smasher: Ender of Legends](https://cyberpunktcg.com/cards/adam-smasher-ender-of-legends) — `4dc5a7cb-cb53-4a44-bcd4-33e373dafbd3`

**Unit tests:**

- [packages/engine/src/cards/legends/adam-smasher-ender-of-legends.test.ts](../packages/engine/src/cards/legends/adam-smasher-ender-of-legends.test.ts) — does not fire PLAY when it is Called rather than played

<a id="faq-439b43af-068f-4296-923b-fd7a55ec73a9"></a>

## Adam Smasher: Ender of Legends

**Question:** Does Adam Smasher’s [PLAY] effect trigger when he Goes Solo?

**Answer:** Yes. [GO SOLO] plays Adam Smasher to the field area and triggers the [PLAY] effect.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Adam Smasher: Ender of Legends](https://cyberpunktcg.com/cards/adam-smasher-ender-of-legends) — `439b43af-068f-4296-923b-fd7a55ec73a9`

**Unit tests:**

- [packages/engine/src/cards/legends/adam-smasher-ender-of-legends.test.ts](../packages/engine/src/cards/legends/adam-smasher-ender-of-legends.test.ts) — pays for GO SOLO, becomes attack-ready, and defeats exactly one chosen rival Unit on PLAY

<a id="faq-89104f80-8329-4ad9-85ff-cb23f3320d53"></a>

## Adam Smasher: Ender of Legends

**Question:** If Adam Smasher is removed from the field area after being played to the field area is Adam Smasher removed from the game instead of being placed in the designated area?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Adam Smasher: Ender of Legends](https://cyberpunktcg.com/cards/adam-smasher-ender-of-legends) — `89104f80-8329-4ad9-85ff-cb23f3320d53`

**Unit tests:**

- [packages/engine/src/cards/legends/adam-smasher-ender-of-legends.test.ts](../packages/engine/src/cards/legends/adam-smasher-ender-of-legends.test.ts) — is removed from the game when another real card defeats it after GO SOLO

<a id="faq-321ab46b-ddf1-4110-9078-9e691a8267e6"></a>

## Adam Smasher: Ender of Legends

**Question:** If Adam Smasher’s cost is reduced does that also reduce cost to activate [GO SOLO]?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Adam Smasher: Ender of Legends](https://cyberpunktcg.com/cards/adam-smasher-ender-of-legends) — `321ab46b-ddf1-4110-9078-9e691a8267e6`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — adam-smasher-ender-of-legends FAQ 4

<a id="faq-a40401c6-6467-486a-9e91-a0e95a95b210"></a>

## Adam Smasher: Metal Over Meat

**Question:** If I manage to play Adam Smasher on my Rival's turn. Does it still get the [PLAY] effect?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Adam Smasher: Metal Over Meat](https://cyberpunktcg.com/cards/adam-smasher-metal-over-meat) — `a40401c6-6467-486a-9e91-a0e95a95b210`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — adam-smasher-metal-over-meat FAQ 1

<a id="faq-fc82d674-d5c0-42f8-9fd9-a47a71be9ec7"></a>

## Adrenaline Converter

**Question:** If my Rival controls exactly 2 more Gigs than me when I play Adrenline Converter but I steal a Gig before I attack with the equipped Unit,  does it still have [ADRENALINE]?

**Answer:** No, the Unit only has [ADRENALINE] while the conditions are met.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Adrenaline Converter](https://cyberpunktcg.com/cards/adrenaline-converter) — `fc82d674-d5c0-42f8-9fd9-a47a71be9ec7`

**Unit tests:**

- [packages/engine/src/cards/gear/adrenaline-converter.test.ts](../packages/engine/src/cards/gear/adrenaline-converter.test.ts) — continuously loses Adrenaline when another friendly Unit closes the Gig gap

<a id="faq-e81b51a1-5dd8-4a2b-9bb8-28b93b227bee"></a>

## Afterparty at Lizzie's

**Question:** If I choose not to adjust a Gig, can I still draw 1 if I control 2 or more Gigs with different values?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Afterparty at Lizzie's](https://cyberpunktcg.com/cards/afterparty-at-lizzie-s) — `e81b51a1-5dd8-4a2b-9bb8-28b93b227bee`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — afterparty-at-lizzie-s FAQ 1

<a id="faq-6f7d6a80-3536-4417-bbb8-c27485f07557"></a>

## All is Lost

**Question:** If All is Lost trashes one or more Units, do I have to add them to my hand  even if I don't want to?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [All is Lost](https://cyberpunktcg.com/cards/all-is-lost) — `6f7d6a80-3536-4417-bbb8-c27485f07557`

**Unit tests:**

- [packages/engine/src/cards/programs/all-is-lost.test.ts](../packages/engine/src/cards/programs/all-is-lost.test.ts) — pays 1, trashes exactly the top 3, and offers only their Units to its controller

<a id="faq-086fb943-7bfb-4fee-8645-01f3cf132232"></a>

## All is Lost

**Question:** If All is Lost's effect trashes no Units, can I still add a Unit to my hand?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [All is Lost](https://cyberpunktcg.com/cards/all-is-lost) — `086fb943-7bfb-4fee-8645-01f3cf132232`

**Unit tests:**

- [packages/engine/src/cards/programs/all-is-lost.test.ts](../packages/engine/src/cards/programs/all-is-lost.test.ts) — trashes 3 non-Units and continues without offering an impossible Unit choice

<a id="faq-8227301d-f845-4e94-b4ff-556fd7c9e5d0"></a>

## All is Lost

**Question:** If I have fewer than 3 cards in my deck, can I still play All is Lost?

**Answer:** Yes. Trash as many cards as possible, instead.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [All is Lost](https://cyberpunktcg.com/cards/all-is-lost) — `8227301d-f845-4e94-b4ff-556fd7c9e5d0`

**Unit tests:**

- [packages/engine/src/cards/programs/all-is-lost.test.ts](../packages/engine/src/cards/programs/all-is-lost.test.ts) — trashes as many as possible from a two-card deck and can recover its Unit

<a id="faq-9c300537-ed1f-4196-a9c7-076dc5fd4603"></a>

## Alt Cunningham: Mother of Daemons

**Question:** Do both effects work on either players turn?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Alt Cunningham: Mother of Daemons](https://cyberpunktcg.com/cards/alt-cunningham-mother-of-daemons) — `9c300537-ed1f-4196-a9c7-076dc5fd4603`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — alt-cunningham-mother-of-daemons FAQ 1

<a id="faq-f6e95797-6d5e-4a78-b1ab-dbc01b1821f4"></a>

## Alt Cunningham: Soulkiller Architect

**Question:** Does Alt Cunningham's first effect apply to Programs played from Trash, too?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Alt Cunningham: Soulkiller Architect](https://cyberpunktcg.com/cards/alt-cunningham-soulkiller-architect) — `f6e95797-6d5e-4a78-b1ab-dbc01b1821f4`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — alt-cunningham-soulkiller-architect FAQ 1

<a id="faq-c2b026c3-6e44-4b3e-97db-abef28faa220"></a>

## Alt Cunningham: Soulkiller Architect

**Question:** If I ready Alt Cunningham after using her first effect and use it again before playing a Program, does the discount stack?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Alt Cunningham: Soulkiller Architect](https://cyberpunktcg.com/cards/alt-cunningham-soulkiller-architect) — `c2b026c3-6e44-4b3e-97db-abef28faa220`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — alt-cunningham-soulkiller-architect FAQ 2

<a id="faq-dd4138dc-c8ee-4d08-899a-d3f69fb00fc7"></a>

## Alt Cunningham: Soulkiller Architect

**Question:** I activated Alt Cunningham's first effect with 2 friendly min Gigs, but before I play my next Program I acquire a 3rd min Gig. Does my next Program play for -3 €$ instead of -2€$?

**Answer:** No, the reduction amount is determined when you activate the effect.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Alt Cunningham: Soulkiller Architect](https://cyberpunktcg.com/cards/alt-cunningham-soulkiller-architect) — `dd4138dc-c8ee-4d08-899a-d3f69fb00fc7`

**Unit tests:**

- [packages/engine/src/cards/legends/alt-cunningham-soulkiller-architect.test.ts](../packages/engine/src/cards/legends/alt-cunningham-soulkiller-architect.test.ts) — captures the friendly min-Gig count for the next Program only

<a id="faq-f7e7ce23-ddae-4f92-a770-e2e7a0fe368e"></a>

## Appetite for Destruction

**Question:** When I play Appetite for Destruction, do I choose a friendly Unit, or can any friendly Unit satisfy the effect later this turn?

**Answer:** You must choose a friendly Unit when you play this card. The condition will only be met when that Unit wins a fight.

**Status:** Unresolved source conflict; current-behavior tests only.

**Conflict:** The FAQ requires choosing one Unit when played. Current retail text applies to the next friendly Unit that wins a fight by 3+ power, without choosing one on play.

Sources: [card](https://cyberpunktcg.com/cards/appetite-for-destruction); [rules](https://cyberpunktcg.com/comprehensive-rules).

**Official sources:**

- [Appetite for Destruction](https://cyberpunktcg.com/cards/appetite-for-destruction) — `f7e7ce23-ddae-4f92-a770-e2e7a0fe368e`

**Unit tests:**

- [packages/engine/src/cards/programs/appetite-for-destruction.test.ts](../packages/engine/src/cards/programs/appetite-for-destruction.test.ts) — lets the next friendly Unit that wins by 3 power steal a chosen Gig

<a id="faq-dd350a6e-8ee0-4c1f-9418-2d22a5160c40"></a>

## Appetite for Destruction

**Question:** If a Unit steals a Gig because of Appetite for Destruction, does that count as that Unit stealing a Gig for effects that trigger when that Unit steals a Gig?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Appetite for Destruction](https://cyberpunktcg.com/cards/appetite-for-destruction) — `dd350a6e-8ee0-4c1f-9418-2d22a5160c40`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — appetite-for-destruction FAQ 2

<a id="faq-82802953-08ff-450a-8630-517546b3091a"></a>

## Appetite for Destruction

**Question:** If the friendly Unit cannot defeat the rival Unit but still wins the fight, does it still steal a Gig?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Appetite for Destruction](https://cyberpunktcg.com/cards/appetite-for-destruction) — `82802953-08ff-450a-8630-517546b3091a`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — appetite-for-destruction FAQ 3

<a id="faq-d3587386-2389-4745-b6e9-8953bc790bfe"></a>

## Arasaka Emergency Radioport

**Question:** If the equipped Unit or Legend is spent as part of an attack, can Arasaka Emergency Radioport Call a Legend before that Unit’s [ATTACK] effect resolves?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Arasaka Emergency Radioport](https://cyberpunktcg.com/cards/arasaka-emergency-radioport) — `d3587386-2389-4745-b6e9-8953bc790bfe`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — arasaka-emergency-radioport FAQ 1

<a id="faq-1dc1d892-bdbf-46a6-a217-ab452b6c0c63"></a>

## Augmented Negotiators

**Question:** Can I use [BLOCKER] even if my Rival has no cards in their hand?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Augmented Negotiators](https://cyberpunktcg.com/cards/augmented-negotiators) — `1dc1d892-bdbf-46a6-a217-ab452b6c0c63`

**Unit tests:**

- [packages/engine/src/cards/units/augmented-negotiators.test.ts](../packages/engine/src/cards/units/augmented-negotiators.test.ts) — resolves without a discard choice when the attacking Rival has no cards in hand

<a id="faq-b3bcae3f-acb3-4891-a985-4d69fea65fc7"></a>

## Bonnie and Clyde

**Question:** If a Rival controls at least 2 more Gigs than me, can I still choose to defeat only one Unit?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Bonnie and Clyde](https://cyberpunktcg.com/cards/bonnie-and-clyde) — `b3bcae3f-acb3-4891-a985-4d69fea65fc7`

**Unit tests:**

- [packages/engine/src/cards/programs/bonnie-and-clyde.test.ts](../packages/engine/src/cards/programs/bonnie-and-clyde.test.ts) — only defeats 1 of the valid targets even when the condition is met (player's choice)

<a id="faq-63c9a5f8-27f2-485d-a779-79587ac49d91"></a>

## Bootleg Black Sapphire Show

**Question:** Do I reveal or get to look at the card I am selling?

**Answer:** No.

**Status:** Unresolved source conflict; current-behavior tests only.

**Conflict:** The FAQ says to sell the top card without revealing it. CR 11.9.1 defines Sell as revealing the card before placing it face-down. Current retail text only says Sell the top card.

Sources: [card](https://cyberpunktcg.com/cards/bootleg-black-sapphire-show); [rules](https://cyberpunktcg.com/comprehensive-rules).

**Official sources:**

- [Bootleg Black Sapphire Show](https://cyberpunktcg.com/cards/bootleg-black-sapphire-show) — `63c9a5f8-27f2-485d-a779-79587ac49d91`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — Bootleg current Sell reveal behavior (source conflict)

<a id="faq-71cfd404-4021-41e1-bebe-a468e11f0a3d"></a>

## Bootleg Black Sapphire Show

**Question:** If the top card of my deck doesn't have a sell tag, do I still sell it for this effect?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Bootleg Black Sapphire Show](https://cyberpunktcg.com/cards/bootleg-black-sapphire-show) — `71cfd404-4021-41e1-bebe-a468e11f0a3d`

**Unit tests:**

- [packages/engine/src/cards/programs/bootleg-black-sapphire-show.test.ts](../packages/engine/src/cards/programs/bootleg-black-sapphire-show.test.ts) — still sells the top card but does not draw without both even and odd friendly Gigs

<a id="faq-68737f4d-0d40-42b9-b490-30d02b06544f"></a>

## Bootleg Black Sapphire Show

**Question:** If I already sold a card during my main phase, can I still sell a card from Bootleg Sapphire's effect?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Bootleg Black Sapphire Show](https://cyberpunktcg.com/cards/bootleg-black-sapphire-show) — `68737f4d-0d40-42b9-b490-30d02b06544f`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — bootleg-black-sapphire-show FAQ 3

<a id="faq-31c66530-6c62-4ba8-a521-e34ec9be6b01"></a>

## Caliber: Totentanz's Top Dog

**Question:** Do I have to defeat a rival Unit with cost 2 or less even if I don't want to?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Caliber: Totentanz's Top Dog](https://cyberpunktcg.com/cards/caliber-totentanz-s-top-dog) — `31c66530-6c62-4ba8-a521-e34ec9be6b01`

**Unit tests:**

- [packages/engine/src/cards/units/caliber-totentanz-s-top-dog.test.ts](../packages/engine/src/cards/units/caliber-totentanz-s-top-dog.test.ts) — on play defeats a rival unit with cost two or less
- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — caliber-totentanz-s-top-dog FAQ 1

<a id="faq-03bc1552-a6ba-410b-8c26-4fbc895a57d5"></a>

## Caliber: Totentanz's Top Dog

**Question:** If the second card my Rival discards also has a cost equal to a friendly Gig, does my rival have to discard again?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Caliber: Totentanz's Top Dog](https://cyberpunktcg.com/cards/caliber-totentanz-s-top-dog) — `03bc1552-a6ba-410b-8c26-4fbc895a57d5`

**Unit tests:**

- [packages/engine/src/cards/units/caliber-totentanz-s-top-dog.test.ts](../packages/engine/src/cards/units/caliber-totentanz-s-top-dog.test.ts) — logs the additional discard when the discarded card cost matches a friendly Gig

<a id="faq-31ed50ec-6a68-4eff-9f47-fc232e4e90e6"></a>

## Carnage at the Colosseum

**Question:** When I play this Program for less because of it's effect does that change the cost of the card too?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Carnage at the Colosseum](https://cyberpunktcg.com/cards/carnage-at-the-colosseum) — `31ed50ec-6a68-4eff-9f47-fc232e4e90e6`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — carnage-at-the-colosseum FAQ 1

<a id="faq-42c38a1d-103c-4c9a-adf0-e199853a16e9"></a>

## Chrome Fang

**Question:** Does Chrome Fang’s effect apply to all rival Units?

**Answer:** Yes. Including any new rival Units played after Chrome Fang.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Chrome Fang](https://cyberpunktcg.com/cards/chrome-fang) — `42c38a1d-103c-4c9a-adf0-e199853a16e9`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — chrome-fang FAQ 1

<a id="faq-eb37dc38-f33d-49c8-aade-383f879945c8"></a>

## Chrome Fang

**Question:** Does Chrome Fang’s effect continue to apply if Chrome Fang leaves the field before your next turn?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Chrome Fang](https://cyberpunktcg.com/cards/chrome-fang) — `eb37dc38-f33d-49c8-aade-383f879945c8`

**Unit tests:**

- [packages/engine/src/cards/units/chrome-fang.test.ts](../packages/engine/src/cards/units/chrome-fang.test.ts) — keeps its until-next-turn steal restriction after leaving the field

<a id="faq-28a0d1ab-e3a1-4dd4-a952-b0ad4403f831"></a>

## Chrome Fang

**Question:** If my rival Unit has power 6 can it steal a friendly Gig with value 6?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Chrome Fang](https://cyberpunktcg.com/cards/chrome-fang) — `28a0d1ab-e3a1-4dd4-a952-b0ad4403f831`

**Unit tests:**

- [packages/engine/src/cards/units/chrome-fang.test.ts](../packages/engine/src/cards/units/chrome-fang.test.ts) — still allows stealing a Gig whose value equals the attacker's power

<a id="faq-18a0c359-400b-43de-9055-c7fc79baf415"></a>

## Chrome Fang

**Question:** What happens if a rival Unit attacks my Gig area while Chrome Fang's effect is active, but all friendly Gig values are higher than its power?

**Answer:** The attack still happens, but the rival Unit does not steal any Gigs.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Chrome Fang](https://cyberpunktcg.com/cards/chrome-fang) — `18a0c359-400b-43de-9055-c7fc79baf415`

**Unit tests:**

- [packages/engine/src/cards/units/chrome-fang.test.ts](../packages/engine/src/cards/units/chrome-fang.test.ts) — stops a rival Unit from stealing a Gig valued higher than its power

<a id="faq-fa5d28f5-57df-451f-8246-cd8949f324ad"></a>

## Chrome Fang

**Question:** If an effect says a Unit steals an additional Gig (like Gorilla Arms), does Chrome Fang's effect apply?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Chrome Fang](https://cyberpunktcg.com/cards/chrome-fang) — `fa5d28f5-57df-451f-8246-cd8949f324ad`

**Unit tests:**

- [packages/engine/src/cards/units/chrome-fang.test.ts](../packages/engine/src/cards/units/chrome-fang.test.ts) — also filters a rival Unit's card-driven Gig steal

<a id="faq-9caf46ed-3bf8-4dd7-9110-7d9e147e821e"></a>

## Chrome Reverie

**Question:** If I the chosen rival Unit that can't attack until my next turn is given the effect to attack. Can it?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Chrome Reverie](https://cyberpunktcg.com/cards/chrome-reverie) — `9caf46ed-3bf8-4dd7-9110-7d9e147e821e`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — chrome-reverie FAQ 1

<a id="faq-5139f71f-b1f8-4819-8a83-51880067dbea"></a>

## Chrome Reverie

**Question:** What is a min Gig?

**Answer:** A Gig showing it's 1 value.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Chrome Reverie](https://cyberpunktcg.com/cards/chrome-reverie) — `5139f71f-b1f8-4819-8a83-51880067dbea`

**Unit tests:**

- [packages/engine/src/cards/programs/chrome-reverie.test.ts](../packages/engine/src/cards/programs/chrome-reverie.test.ts) — may Call a Legend for free when it controls a min Gig
- [packages/engine/src/cards/programs/chrome-reverie.test.ts](../packages/engine/src/cards/programs/chrome-reverie.test.ts) — does not Call for a non-min friendly Gig or a min rival Gig

<a id="faq-1dc8b307-ebd1-43e8-9d14-d11a7893c1d1"></a>

## Chrome Reverie

**Question:** When resolving this effect and do not choose to Call a Legend for free. Can I call a Legend for free later in the turn from this effect?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Chrome Reverie](https://cyberpunktcg.com/cards/chrome-reverie) — `1dc8b307-ebd1-43e8-9d14-d11a7893c1d1`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — chrome-reverie FAQ 3

<a id="faq-4496adf7-0641-4c06-a1f7-6eb120c075bf"></a>

## Corporate Surveillance

**Question:** Can I play this card without a rival Unit on the field?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Corporate Surveillance](https://cyberpunktcg.com/cards/corporate-surveillance) — `4496adf7-0641-4c06-a1f7-6eb120c075bf`

**Unit tests:**

- [packages/engine/src/cards/programs/corporate-surveillance.test.ts](../packages/engine/src/cards/programs/corporate-surveillance.test.ts) — resolves and moves to trash when no ready rival Unit costs 4 or less

<a id="faq-00513475-b873-4eec-b582-c8bb969fe1e5"></a>

## Corporate Surveillance / Memory Relapse

**Question:** Can I choose a Unit that's already spent for this card's effect?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Corporate Surveillance](https://cyberpunktcg.com/cards/corporate-surveillance) — `00513475-b873-4eec-b582-c8bb969fe1e5`
- [Memory Relapse](https://cyberpunktcg.com/cards/memory-relapse) — `5e7e7fa9-d975-45fd-aaaf-27cd449ac788`

**Unit tests:**

- [packages/engine/src/cards/programs/corporate-surveillance.test.ts](../packages/engine/src/cards/programs/corporate-surveillance.test.ts) — targets an already-spent rival Unit: the spend no-ops and the program still resolves (Corporate Surveillance)
- [packages/engine/src/cards/programs/memory-relapse.test.ts](../packages/engine/src/cards/programs/memory-relapse.test.ts) — targets an already-spent rival Unit: the spend no-ops, the lock holds, and even Street Cred draws (Memory Relapse)

<a id="faq-030e8902-1692-4ba3-86de-56b83c036897"></a>

## Corpo Security

**Question:** If this Unit gains [ADRENALINE] the turn it's played, can it attack?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Corpo Security](https://cyberpunktcg.com/cards/corpo-security) — `030e8902-1692-4ba3-86de-56b83c036897`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — corpo-security FAQ 1

<a id="faq-b59cc194-67ee-4b3e-9e4e-6858131f2903"></a>

## Cyberpsychosis

**Question:** Can I choose an equipped rival Unit with this effect?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Cyberpsychosis](https://cyberpunktcg.com/cards/cyberpsychosis) — `b59cc194-67ee-4b3e-9e4e-6858131f2903`

**Unit tests:**

- [packages/engine/src/cards/programs/cyberpsychosis.test.ts](../packages/engine/src/cards/programs/cyberpsychosis.test.ts) — can target a rival equipped attacker as a QUICK reaction and defeats it after it steals

<a id="faq-0f661d5c-bfc7-4c2a-8174-b4f98e7d8b61"></a>

## Cyberpsychosis

**Question:** If I play this Program [QUICK] as a reaction and choose the attacking rival Unit for the effect, what happens?

**Answer:** The rival Unit gets the power boost for the ensuing fight and is defeated at the end of the turn.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Cyberpsychosis](https://cyberpunktcg.com/cards/cyberpsychosis) — `0f661d5c-bfc7-4c2a-8174-b4f98e7d8b61`

**Unit tests:**

- [packages/engine/src/cards/programs/cyberpsychosis.test.ts](../packages/engine/src/cards/programs/cyberpsychosis.test.ts) — can target a rival equipped attacker as a QUICK reaction and defeats it after it steals

<a id="faq-0a4c62a0-f5aa-4b7e-9341-db86caf28c81"></a>

## Cyberpsychosis

**Question:** If a Unit  under the effect of Cyberpsychosis attacks but does not make it to the Fight or Steal step, is it still defeated at the end of the turn?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Cyberpsychosis](https://cyberpunktcg.com/cards/cyberpsychosis) — `0a4c62a0-f5aa-4b7e-9341-db86caf28c81`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — cyberpsychosis FAQ 3

<a id="faq-307b211e-ebe4-46db-9baa-e652918576fe"></a>

## Deadman Transmitter

**Question:** If a Unit or Legend with two or more Deadman Transmitters is defeated, do I have to defeat both Deadman Transmitters?

**Answer:** No, choose one of them.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Deadman Transmitter](https://cyberpunktcg.com/cards/deadman-transmitter) — `307b211e-ebe4-46db-9baa-e652918576fe`

**Unit tests:**

- [packages/engine/src/cards/gear/deadman-transmitter.test.ts](../packages/engine/src/cards/gear/deadman-transmitter.test.ts) — lets the affected player choose between multiple mandatory Transmitter replacements

<a id="faq-4b85693e-f6d3-4895-8606-e9917f6c706a"></a>

## Deadman Transmitter

**Question:** If Deadman Transmitter protects a Unit from being defeated in a fight did that Unit still lose the fight?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Deadman Transmitter](https://cyberpunktcg.com/cards/deadman-transmitter) — `4b85693e-f6d3-4895-8606-e9917f6c706a`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — deadman-transmitter FAQ 2

<a id="faq-59552a2f-6661-4130-95cd-6f119a95f6b6"></a>

## Delamain Cab

**Question:** If this Unit steals a Gig but is no longer in the field area at the end of the turn, do I still ready 1 Eddie?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Delamain Cab](https://cyberpunktcg.com/cards/delamain-cab) — `59552a2f-6661-4130-95cd-6f119a95f6b6`

**Unit tests:**

- [packages/engine/src/cards/units/delamain-cab.test.ts](../packages/engine/src/cards/units/delamain-cab.test.ts) — does not trigger if it stole a Gig but left play before the end of turn

<a id="faq-cdc01e4e-6e36-43a8-a193-90564776528d"></a>

## Delamain: Rideshare AI

**Question:** Do I have to Draw 2 with this card's [PLAY] effect even if I don't want to?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Delamain: Rideshare AI](https://cyberpunktcg.com/cards/delamain-rideshare-ai) — `cdc01e4e-6e36-43a8-a193-90564776528d`

**Unit tests:**

- [packages/engine/src/cards/units/delamain-rideshare-ai.test.ts](../packages/engine/src/cards/units/delamain-rideshare-ai.test.ts) — draws 2 on Play

<a id="faq-2ae2b855-aecf-4b12-9858-234649764cf1"></a>

## Detonate

**Question:** Can Detonate defeat Gear equipped to a face-up Legend?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Detonate](https://cyberpunktcg.com/cards/detonate) — `2ae2b855-aecf-4b12-9858-234649764cf1`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — detonate FAQ 1

<a id="faq-c459acd1-042d-47ae-9278-3cdd05d98283"></a>

## Detonate

**Question:** Can I play Detonate if there are no rival Gears in play?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Detonate](https://cyberpunktcg.com/cards/detonate) — `c459acd1-042d-47ae-9278-3cdd05d98283`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — detonate FAQ 2

<a id="faq-47feaf18-6dff-4cf7-b24f-ba01d2a92514"></a>

## Dexter DeShawn: Off the Grid

**Question:** If I don't have a friendly Unit on the field when I call Dexter Deshawn, do I have to choose Draw 1?

**Answer:** No, you can still choose the other effect, it just fails.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Dexter DeShawn: Off the Grid](https://cyberpunktcg.com/cards/dexter-deshawn-off-the-grid) — `47feaf18-6dff-4cf7-b24f-ba01d2a92514`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — dexter-deshawn-off-the-grid FAQ 1

<a id="faq-f868fe18-6a35-457a-9ed5-004b48956db9"></a>

## Dexter DeShawn: Off the Grid

**Question:** If I call Dexter Deshawn as a reaction, can I play a [QUICK] card that I drew off of Dexter's effect?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Dexter DeShawn: Off the Grid](https://cyberpunktcg.com/cards/dexter-deshawn-off-the-grid) — `f868fe18-6a35-457a-9ed5-004b48956db9`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — dexter-deshawn-off-the-grid FAQ 2

<a id="faq-2a8619f2-2d2b-4b22-a190-623617b0b515"></a>

## Dexter DeShawn: Off the Grid

**Question:** Can Dexter Deshawn ’s [Spend Icon:] effect increase either a friendly Gig or a rival Gig?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Dexter DeShawn: Off the Grid](https://cyberpunktcg.com/cards/dexter-deshawn-off-the-grid) — `2a8619f2-2d2b-4b22-a190-623617b0b515`

**Unit tests:**

- [packages/engine/src/cards/legends/dexter-deshawn-off-the-grid.test.ts](../packages/engine/src/cards/legends/dexter-deshawn-off-the-grid.test.ts) — spends to increase any player's Gig by up to 2

<a id="faq-ac95df60-d8dd-44bc-b04f-1246a08a8540"></a>

## Dexter DeShawn: One Last Chance

**Question:** With the [Play] and [Attack] effect. If I choose to adjust up to 0. Does that still count as adjusting a Gig?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Dexter DeShawn: One Last Chance](https://cyberpunktcg.com/cards/dexter-deshawn-one-last-chance) — `ac95df60-d8dd-44bc-b04f-1246a08a8540`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — dexter-deshawn-one-last-chance FAQ 1

<a id="faq-fc26a153-0d04-43ec-8f94-beaa97ce3a93"></a>

## (Don't Fear) The Reaper

**Question:** If all rival Units are already spent, can I still use this card?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [(Don't Fear) The Reaper](https://cyberpunktcg.com/cards/don-t-fear-the-reaper) — `fc26a153-0d04-43ec-8f94-beaa97ce3a93`

**Unit tests:**

- [packages/engine/src/cards/programs/don-t-fear-the-reaper.test.ts](../packages/engine/src/cards/programs/don-t-fear-the-reaper.test.ts) — does not emit a spend event for a rival Unit that is already spent

<a id="faq-1715a8ca-857b-4dcc-9c1c-4782ccd13c04"></a>

## (Don't Fear) The Reaper

**Question:** Can I defeat a spent Unit that I did not spend with this effect?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [(Don't Fear) The Reaper](https://cyberpunktcg.com/cards/don-t-fear-the-reaper) — `1715a8ca-857b-4dcc-9c1c-4782ccd13c04`

**Unit tests:**

- [packages/engine/src/cards/programs/don-t-fear-the-reaper.test.ts](../packages/engine/src/cards/programs/don-t-fear-the-reaper.test.ts) — can defeat a friendly spent Unit after spending rivals

<a id="faq-94144c1c-7f0c-4bb0-898f-a9edaa1d0cd9"></a>

## Dum Dum: Maelstrom Triggerman

**Question:** Can Dum Dum’s [QUICK] effect choose a friendly Unit with no equipped Gear?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Dum Dum: Maelstrom Triggerman](https://cyberpunktcg.com/cards/dum-dum-maelstrom-triggerman) — `94144c1c-7f0c-4bb0-898f-a9edaa1d0cd9`

**Unit tests:**

- [packages/engine/src/cards/legends/dum-dum-maelstrom-triggerman.test.ts](../packages/engine/src/cards/legends/dum-dum-maelstrom-triggerman.test.ts) — pays and spends for +0 when the chosen friendly Unit has no equipped Gear

<a id="faq-bfb1adc4-7e30-4d4c-8219-c62ee23df515"></a>

## Dum Dum: Maelstrom Triggerman

**Question:** If the chosen Unit gains or loses Gear after Dum Dum’s [QUICK] effect resolves, does the power bonus change?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Dum Dum: Maelstrom Triggerman](https://cyberpunktcg.com/cards/dum-dum-maelstrom-triggerman) — `bfb1adc4-7e30-4d4c-8219-c62ee23df515`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — dum-dum-maelstrom-triggerman FAQ 2

<a id="faq-5f960b7a-2008-4b2c-bbfd-ec852848651f"></a>

## Dying Night: V's Pistol

**Question:** If I choose not to decrease a Gig, can I still ready 2 Eddies at the end of my turn if the equipped Unit is named "V"?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Dying Night: V's Pistol](https://cyberpunktcg.com/cards/dying-night-v-s-pistol) — `5f960b7a-2008-4b2c-bbfd-ec852848651f`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — dying-night-v-s-pistol FAQ 1

<a id="faq-881c635b-268e-4855-8617-a84587951a8f"></a>

## Dying Night: V's Pistol

**Question:** If this Gear is attached to a Unit named "V" and the Unit attacks but is defeated before the end of the turn, can I still ready 2 Eddies?

**Answer:** Yes.

**Status:** Unresolved source conflict; current-behavior tests only.

**Conflict:** The FAQ keeps an end-of-turn Eddie ready effect after the host leaves. Current retail text is a separate end-of-turn ability, which needs the Gear and host in play to trigger.

Sources: [card](https://cyberpunktcg.com/cards/dying-night-v-s-pistol); [rules](https://cyberpunktcg.com/comprehensive-rules).

**Official sources:**

- [Dying Night: V's Pistol](https://cyberpunktcg.com/cards/dying-night-v-s-pistol) — `881c635b-268e-4855-8617-a84587951a8f`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — Dying Night current end-turn text needs its host in play (source conflict)

<a id="faq-2984e648-802f-48da-9ecd-0e0c0434f9e3"></a>

## El Sombrerón: La Venganza Lenta

**Question:** If I control multiple friendly max Gigs, can I choose which one El Sombrerón's effect uses?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [El Sombrerón: La Venganza Lenta](https://cyberpunktcg.com/cards/el-sombrero-n-la-venganza-lenta) — `2984e648-802f-48da-9ecd-0e0c0434f9e3`

**Unit tests:**

- [packages/engine/src/cards/units/el-sombreron-la-venganza-lenta.test.ts](../packages/engine/src/cards/units/el-sombreron-la-venganza-lenta.test.ts) — asks which friendly max Gig to use when multiple are available

<a id="faq-71386fef-475e-4a5f-9a81-084f6a32f02b"></a>

## El Sombrerón: La Venganza Lenta

**Question:** If the value of my chosen friendly max Gig changes later in the turn, does El Sombrerón’s gained power change too?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [El Sombrerón: La Venganza Lenta](https://cyberpunktcg.com/cards/el-sombrero-n-la-venganza-lenta) — `71386fef-475e-4a5f-9a81-084f6a32f02b`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — el-sombrero-n-la-venganza-lenta FAQ 2

<a id="faq-a51b1f00-a914-4586-8baf-9926b76fcbec"></a>

## El Sombrerón: La Venganza Lenta

**Question:** If I do not control a friendly max Gig can I still pay 2 €$ for El Sombrerón’s effect?

**Answer:** Yes, but El Sombrerón won't gain any power from it.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [El Sombrerón: La Venganza Lenta](https://cyberpunktcg.com/cards/el-sombrero-n-la-venganza-lenta) — `a51b1f00-a914-4586-8baf-9926b76fcbec`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — el-sombrero-n-la-venganza-lenta FAQ 3

<a id="faq-6f60b8fc-5126-488c-9aeb-5ee39226a5f0"></a>

## Evelyn Parker: Beautiful Enigma

**Question:** If a rival Unit chosen by Evenlyn Parker's second effect makes an attack and then readies in the same turn, is it forced to make another attack?

**Answer:** Yes; as long as the chosen Unit can attack, your Rival cannot end their turn until it attacks.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Evelyn Parker: Beautiful Enigma](https://cyberpunktcg.com/cards/evelyn-parker-beautiful-enigma) — `6f60b8fc-5126-488c-9aeb-5ee39226a5f0`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — evelyn-parker-beautiful-enigma FAQ 1

<a id="faq-99f345a2-35ad-4d4e-8f7b-c6da08c50b4a"></a>

## Evelyn Parker: Beautiful Enigma

**Question:** If I have a Unit chosen by Evelyn Parker's second effect, do I have to attack with it as soon as possible, or can I play other cards first?

**Answer:** You may do other actions but cannot end your turn if the Unit chosen by Evelyn Parker can still legally declare an attack.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Evelyn Parker: Beautiful Enigma](https://cyberpunktcg.com/cards/evelyn-parker-beautiful-enigma) — `99f345a2-35ad-4d4e-8f7b-c6da08c50b4a`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — evelyn-parker-beautiful-enigma FAQ 2

<a id="faq-21199b77-ad4d-42ac-834c-416bf3d458b5"></a>

## Evelyn Parker: Scheming Siren

**Question:** Is Evelyn Parker's [ATTACK] effect mandatory?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Evelyn Parker: Scheming Siren](https://cyberpunktcg.com/cards/evelyn-parker-scheming-siren) — `21199b77-ad4d-42ac-834c-416bf3d458b5`

**Unit tests:**

- [packages/engine/src/cards/units/evelyn-parker-scheming-siren.test.ts](../packages/engine/src/cards/units/evelyn-parker-scheming-siren.test.ts) — ATTACK draws 1, then discards 1 when friendly Street Cred is greater

<a id="faq-e83fc5f6-3649-4162-9415-f1ff3fde56ed"></a>

## Field Operator

**Question:** Does 0 count as an even number?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Field Operator](https://cyberpunktcg.com/cards/field-operator) — `e83fc5f6-3649-4162-9415-f1ff3fde56ed`

**Unit tests:**

- [packages/engine/src/cards/units/field-operator.test.ts](../packages/engine/src/cards/units/field-operator.test.ts) — does not treat Null Street Cred as even when the controller has no Gigs

<a id="faq-2c3ac370-03ca-4a5c-9cf3-a61e9789b515"></a>

## Floor It

**Question:** Can you play this with no rival Units in play?

**Answer:** Yes

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Floor It](https://cyberpunktcg.com/cards/floor-it) — `2c3ac370-03ca-4a5c-9cf3-a61e9789b515`

**Unit tests:**

- [packages/engine/src/cards/programs/floor-it.test.ts](../packages/engine/src/cards/programs/floor-it.test.ts) — still draws 1 when no rival Unit can be targeted (the Draw is independent of the debuff target)

<a id="faq-7cc65141-2888-4258-9e95-b77b60f43754"></a>

## Fool on the Hill

**Question:** When I reveal the top 2 cards of my deck, are they still considered part of my deck?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Fool on the Hill](https://cyberpunktcg.com/cards/fool-on-the-hill) — `7cc65141-2888-4258-9e95-b77b60f43754`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — fool-on-the-hill FAQ 1

<a id="faq-db8d72b0-4892-45a9-82fb-9d7cf1df3791"></a>

## Gilded Matón

**Question:** If my Rival does not have a Unit, may I still defeat a friendly Gear?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Gilded Matón](https://cyberpunktcg.com/cards/gilded-mato-n) — `db8d72b0-4892-45a9-82fb-9d7cf1df3791`

**Unit tests:**

- [packages/engine/src/cards/units/gilded-maton.test.ts](../packages/engine/src/cards/units/gilded-maton.test.ts) — defeats the friendly Gear and resolves when no rival Unit costs 3 or less

<a id="faq-978f0a21-058a-4676-8366-ce220a6f6aa4"></a>

## Gorilla Arms

**Question:** Who steals the Gig with this effect; the player, or the Unit equipped with Gorilla arms?

**Answer:** The Unit.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Gorilla Arms](https://cyberpunktcg.com/cards/gorilla-arms) — `978f0a21-058a-4676-8366-ce220a6f6aa4`

**Unit tests:**

- [packages/engine/src/cards/gear/gorilla-arms.test.ts](../packages/engine/src/cards/gear/gorilla-arms.test.ts) — attributes a card-driven steal to the host Unit (Change A) and bounds the cascade

<a id="faq-9ad7e1cf-9965-4ba0-8503-ac17c897ffbd"></a>

## Goro Takemura: Hands Unclean

**Question:** Can I use this Legend's [Blocker] in the Legend area?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Goro Takemura: Hands Unclean](https://cyberpunktcg.com/cards/goro-takemura-hands-unclean) — `9ad7e1cf-9965-4ba0-8503-ac17c897ffbd`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — goro-takemura-hands-unclean FAQ 1

<a id="faq-0c5b038a-705c-44ba-bff6-95403c35f032"></a>

## Goro Takemura: Losing His Way

**Question:** If all my friendly Legends become face-up after I declare an attack, does Goro Takemura's effect trigger?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Goro Takemura: Losing His Way](https://cyberpunktcg.com/cards/goro-takemura-losing-his-way) — `0c5b038a-705c-44ba-bff6-95403c35f032`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — goro-takemura-losing-his-way FAQ 1

<a id="faq-c40c2c04-c8eb-453b-8a04-2cb0cb4fd1a4"></a>

## Goro Takemura: Vengeful Bodyguard

**Question:** If I manage to play a Unit during my React step and I give it [BLOCKER] from Goro Takemura, can that friendly Unit use [BLOCKER] immediately?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Goro Takemura: Vengeful Bodyguard](https://cyberpunktcg.com/cards/goro-takemura-vengeful-bodyguard) — `c40c2c04-c8eb-453b-8a04-2cb0cb4fd1a4`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — goro-takemura-vengeful-bodyguard FAQ 1

<a id="faq-46be1b50-5788-41f0-92de-af2fb2f670be"></a>

## Goro Takemura: Vengeful Bodyguard

**Question:** When a friendly Unit uses [BLOCKER] am I forced to discard 1?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Goro Takemura: Vengeful Bodyguard](https://cyberpunktcg.com/cards/goro-takemura-vengeful-bodyguard) — `46be1b50-5788-41f0-92de-af2fb2f670be`

**Unit tests:**

- [packages/engine/src/cards/legends/goro-takemura-vengeful-bodyguard.test.ts](../packages/engine/src/cards/legends/goro-takemura-vengeful-bodyguard.test.ts) — may decline the discard after BLOCKER and then does not draw

<a id="faq-3e703f01-25ac-4255-ae2f-b3c0fb7a816c"></a>

## Goro Takemura: Vengeful Bodyguard

**Question:** If I have no cards in deck may I still discard 1?

**Answer:** Yes, but you must draw 1 after, so you will lose the game.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Goro Takemura: Vengeful Bodyguard](https://cyberpunktcg.com/cards/goro-takemura-vengeful-bodyguard) — `3e703f01-25ac-4255-ae2f-b3c0fb7a816c`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — goro-takemura-vengeful-bodyguard FAQ 3

<a id="faq-048e77d0-3873-4e27-a4ee-b419fc503d3d"></a>

## Goro Takemura: Vengeful Bodyguard

**Question:** Does a friendly Unit using [BLOCKER] trigger Goro Takemura's second effect even if it's not a result of first effect?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Goro Takemura: Vengeful Bodyguard](https://cyberpunktcg.com/cards/goro-takemura-vengeful-bodyguard) — `048e77d0-3873-4e27-a4ee-b419fc503d3d`

**Unit tests:**

- [packages/engine/src/cards/legends/goro-takemura-vengeful-bodyguard.test.ts](../packages/engine/src/cards/legends/goro-takemura-vengeful-bodyguard.test.ts) — draws 1 if you discard after a friendly Unit uses BLOCKER

<a id="faq-2a901389-f319-4b65-ae4b-00483f4e80f5"></a>

## Gunpoint Diplomacy

**Question:** Can I choose the order of the two effects?

**Answer:** No. You must resolve the effect from top to bottom.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Gunpoint Diplomacy](https://cyberpunktcg.com/cards/gunpoint-diplomacy) — `2a901389-f319-4b65-ae4b-00483f4e80f5`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — gunpoint-diplomacy FAQ 1

<a id="faq-e4e22bef-839b-49d6-9bed-8a34f59b95ce"></a>

## Gunpoint Diplomacy

**Question:** When my Rival chooses the effect for Gunpoint Diplomacy, do they also choose the friendly Unit?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Gunpoint Diplomacy](https://cyberpunktcg.com/cards/gunpoint-diplomacy) — `e4e22bef-839b-49d6-9bed-8a34f59b95ce`

**Unit tests:**

- [packages/engine/src/cards/programs/gunpoint-diplomacy.test.ts](../packages/engine/src/cards/programs/gunpoint-diplomacy.test.ts) — lets the Rival choose one effect when you have less Street Cred

<a id="faq-d7f37678-fda8-4c98-b027-af22cc68b7c6"></a>

## Hacked Corpo

**Question:** After I trash 3 with this effect do I have to add a Program to hand from those 3?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Hacked Corpo](https://cyberpunktcg.com/cards/hacked-corpo) — `d7f37678-fda8-4c98-b027-af22cc68b7c6`

**Unit tests:**

- [packages/engine/src/cards/units/hacked-corpo.test.ts](../packages/engine/src/cards/units/hacked-corpo.test.ts) — requires recovery when a Program is available (min: 1)

<a id="faq-b9dffd87-5e0a-45a6-92c3-dae20f68df5f"></a>

## Hanako Arasaka: Daughter of the Emperor

**Question:** If either myself or my Rival controls 0 Gigs, can I swap?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Hanako Arasaka: Daughter of the Emperor](https://cyberpunktcg.com/cards/hanako-arasaka-daughter-of-the-emperor) — `b9dffd87-5e0a-45a6-92c3-dae20f68df5f`

**Unit tests:**

- [packages/engine/src/cards/legends/hanako-arasaka-daughter-of-the-emperor.test.ts](../packages/engine/src/cards/legends/hanako-arasaka-daughter-of-the-emperor.test.ts) — cannot activate the swap without both a friendly and rival Gig and does not spend

<a id="faq-1b9a65e5-250a-446e-971f-867ab7f688fb"></a>

## Hanako Arasaka: Daughter of the Emperor

**Question:** Is swapping Gigs considered stealing?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Hanako Arasaka: Daughter of the Emperor](https://cyberpunktcg.com/cards/hanako-arasaka-daughter-of-the-emperor) — `1b9a65e5-250a-446e-971f-867ab7f688fb`

**Unit tests:**

- [packages/engine/src/cards/legends/hanako-arasaka-daughter-of-the-emperor.test.ts](../packages/engine/src/cards/legends/hanako-arasaka-daughter-of-the-emperor.test.ts) — spends to swap a chosen friendly Gig with a chosen rival Gig

<a id="faq-4b611db2-a369-4b7f-b074-377613c6cada"></a>

## Hanako Arasaka: Daughter of the Emperor

**Question:** When I activate this effect, do I get to choose the rival Gig too?

**Answer:** Yes, you choose both Gigs involved in the swap.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Hanako Arasaka: Daughter of the Emperor](https://cyberpunktcg.com/cards/hanako-arasaka-daughter-of-the-emperor) — `4b611db2-a369-4b7f-b074-377613c6cada`

**Unit tests:**

- [packages/engine/src/cards/legends/hanako-arasaka-daughter-of-the-emperor.test.ts](../packages/engine/src/cards/legends/hanako-arasaka-daughter-of-the-emperor.test.ts) — spends to swap a chosen friendly Gig with a chosen rival Gig

<a id="faq-89eca244-872c-4c28-bf2c-7dbf294e0e6c"></a>

## Heywood Ripperdoc

**Question:** May I defeat a Gear if I don't have any Gigs that match cost with value?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Heywood Ripperdoc](https://cyberpunktcg.com/cards/heywood-ripperdoc) — `89eca244-872c-4c28-bf2c-7dbf294e0e6c`

**Unit tests:**

- [packages/engine/src/cards/units/heywood-ripperdoc.test.ts](../packages/engine/src/cards/units/heywood-ripperdoc.test.ts) — does not draw when the defeated Gear cost does not match a friendly Gig

<a id="faq-ad3b75f8-1401-485f-891d-7e54fdbfe30f"></a>

## Industrial Assembly

**Question:** Can I choose to increase a Gig by 0?

**Answer:** Yes, but it does not count as "adjusting" a Gig for effects triggered by "adjusting a Gig."

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Industrial Assembly](https://cyberpunktcg.com/cards/industrial-assembly) — `ad3b75f8-1401-485f-891d-7e54fdbfe30f`

**Unit tests:**

- [packages/engine/src/cards/programs/industrial-assembly.test.ts](../packages/engine/src/cards/programs/industrial-assembly.test.ts) — allows a zero increase and still draws for an existing friendly value 8

<a id="faq-2f4ce47f-25ba-4321-a673-809fc8f75bd7"></a>

## Industrial Assembly

**Question:** Can I adjust a rival Gig?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Industrial Assembly](https://cyberpunktcg.com/cards/industrial-assembly) — `2f4ce47f-25ba-4321-a673-809fc8f75bd7`

**Unit tests:**

- [packages/engine/src/cards/programs/industrial-assembly.test.ts](../packages/engine/src/cards/programs/industrial-assembly.test.ts) — may increase a rival Gig but does not draw for the rival's 8+ value

<a id="faq-39c1b729-a65b-4cf6-81dd-150719aa38b3"></a>

## Jacked-In Voodoo Boy

**Question:** If this Unit gains [ADRENALINE] the turn it's played , can it attack even if I haven't played a Program yet?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Jacked-In Voodoo Boy](https://cyberpunktcg.com/cards/jacked-in-voodoo-boy) — `39c1b729-a65b-4cf6-81dd-150719aa38b3`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — jacked-in-voodoo-boy FAQ 1

<a id="faq-739fcd51-c571-4770-9ceb-dc6d7c785842"></a>

## Jackie Welles: Mama's Favorite

**Question:** When I defeat Jackie Welles instead of a friendly Unit, does the Unit's [DEFEATED] effect trigger?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Jackie Welles: Mama's Favorite](https://cyberpunktcg.com/cards/jackie-welles-mama-s-favorite) — `739fcd51-c571-4770-9ceb-dc6d7c785842`

**Unit tests:**

- [packages/engine/src/cards/legends/jackie-welles-mama-s-favorite.test.ts](../packages/engine/src/cards/legends/jackie-welles-mama-s-favorite.test.ts) — may spend 1 Eddie and remove itself instead of a friendly Unit defeated in a fight

<a id="faq-659dec0e-519c-445d-966e-6e27e4ad5c1f"></a>

## Jackie Welles: Mama's Favorite

**Question:** Can I use this effect if Jackie Welles is in the Field area as a Unit?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Jackie Welles: Mama's Favorite](https://cyberpunktcg.com/cards/jackie-welles-mama-s-favorite) — `659dec0e-519c-445d-966e-6e27e4ad5c1f`

**Unit tests:**

- [packages/engine/src/cards/legends/jackie-welles-mama-s-favorite.test.ts](../packages/engine/src/cards/legends/jackie-welles-mama-s-favorite.test.ts) — can replace its own defeat after going solo and is removed from the game

<a id="faq-2d22697d-50af-4372-bffb-29cae81f45cc"></a>

## Jackie Welles: Mama's Favorite

**Question:** Can I use this effect if Jackie Welles is in the Legends area?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Jackie Welles: Mama's Favorite](https://cyberpunktcg.com/cards/jackie-welles-mama-s-favorite) — `2d22697d-50af-4372-bffb-29cae81f45cc`

**Unit tests:**

- [packages/engine/src/cards/legends/jackie-welles-mama-s-favorite.test.ts](../packages/engine/src/cards/legends/jackie-welles-mama-s-favorite.test.ts) — may spend 1 Eddie and remove itself instead of a friendly Unit defeated in a fight

<a id="faq-ab195483-70b3-4bdf-9d42-488148b666ec"></a>

## Jackie Welles: Mama's Favorite

**Question:** If Jackie Welles would be defeated while it's a Unit, could I use Jackie Welle's effect to defeat himself instead of being defeated the other way?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Jackie Welles: Mama's Favorite](https://cyberpunktcg.com/cards/jackie-welles-mama-s-favorite) — `ab195483-70b3-4bdf-9d42-488148b666ec`

**Unit tests:**

- [packages/engine/src/cards/legends/jackie-welles-mama-s-favorite.test.ts](../packages/engine/src/cards/legends/jackie-welles-mama-s-favorite.test.ts) — can replace its own defeat after going solo and is removed from the game

<a id="faq-15b27a52-f1e8-48fb-9c59-ac9d2d4c6824"></a>

## Jackie Welles: Pour One Out For Me

**Question:** If I've already played a Blue Unit or Gear this turn before Jackie Welles is face-up, then flip Jackie, can I trigger Jackie's effect that turn by playing another Blue Gear or Unit?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Jackie Welles: Pour One Out For Me](https://cyberpunktcg.com/cards/jackie-welles-pour-one-out-for-me) — `15b27a52-f1e8-48fb-9c59-ac9d2d4c6824`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — jackie-welles-pour-one-out-for-me FAQ 1

<a id="faq-763356ba-0750-492a-86d2-2b7b75325208"></a>

## Jackie Welles: Pour One Out For Me

**Question:** Does playing a Legend from the Legends area to the field, trigger Jackie Welles's effect?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Jackie Welles: Pour One Out For Me](https://cyberpunktcg.com/cards/jackie-welles-pour-one-out-for-me) — `763356ba-0750-492a-86d2-2b7b75325208`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — jackie-welles-pour-one-out-for-me FAQ 2

<a id="faq-c58d792f-af25-4060-b261-dc7369c18aa2"></a>

## Jackie Welles: Pour One Out For Me

**Question:** If I choose an already min Gig for Jackie Welles's effect, can I draw 1?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Jackie Welles: Pour One Out For Me](https://cyberpunktcg.com/cards/jackie-welles-pour-one-out-for-me) — `c58d792f-af25-4060-b261-dc7369c18aa2`

**Unit tests:**

- [packages/engine/src/cards/legends/jackie-welles-pour-one-out-for-me.test.ts](../packages/engine/src/cards/legends/jackie-welles-pour-one-out-for-me.test.ts) — does not draw when a Gig was already min and the player chooses zero decrease

<a id="faq-801aa9c8-c507-44e9-89c1-3477c1f8a2b1"></a>

## Jackie Welles: Ride or Die Choom

**Question:** If Gig becomes odd after Jackie attacks, does Jackie lose the +2 power?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Jackie Welles: Ride or Die Choom](https://cyberpunktcg.com/cards/jackie-welles-ride-or-die-choom) — `801aa9c8-c507-44e9-89c1-3477c1f8a2b1`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — jackie-welles-ride-or-die-choom FAQ 1

<a id="faq-c61101be-05ed-46e3-b027-d05f5981632f"></a>

## Jackie Welles: Ride or Die Choom

**Question:** If I acquire another friendly even Gig after Jackie Welles attacks, does Jackie Welles get another +2 power this turn?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Jackie Welles: Ride or Die Choom](https://cyberpunktcg.com/cards/jackie-welles-ride-or-die-choom) — `c61101be-05ed-46e3-b027-d05f5981632f`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — jackie-welles-ride-or-die-choom FAQ 2

<a id="faq-cce96f5d-9d4d-4a30-b6ba-5e49c53280dc"></a>

## Japantown Jonin

**Question:** Can Japantown Jonin choose itself with its own [PLAY] effect?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Japantown Jonin](https://cyberpunktcg.com/cards/japantown-jonin) — `cce96f5d-9d4d-4a30-b6ba-5e49c53280dc`

**Unit tests:**

- [packages/engine/src/cards/units/japantown-jonin.test.ts](../packages/engine/src/cards/units/japantown-jonin.test.ts) — can target itself with the power boost

<a id="faq-3cfb42c3-4d87-44db-9b06-7f48c24b912f"></a>

## Johnny Silverhand: Never Stop Fighting

**Question:** What "This Unit wins all fights against CORPO Units" mean?

**Answer:** When Johnny Silvlerhand attacks (or is attacked by) a CORPO Unit,  he always wins the fight, regardless of power. So, Johnny Silverhand defeats the opposing CORPO Unit (as long as he has power 1+).

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Johnny Silverhand: Never Stop Fighting](https://cyberpunktcg.com/cards/johnny-silverhand-never-stop-fighting) — `3cfb42c3-4d87-44db-9b06-7f48c24b912f`

**Unit tests:**

- [packages/engine/src/cards/units/johnny-silverhand-never-stop-fighting.test.ts](../packages/engine/src/cards/units/johnny-silverhand-never-stop-fighting.test.ts) — wins a fight against a CORPO Unit even at lower power
- [packages/engine/src/cards/units/johnny-silverhand-never-stop-fighting.test.ts](../packages/engine/src/cards/units/johnny-silverhand-never-stop-fighting.test.ts) — also auto-wins as the defender when a CORPO Unit attacks it

<a id="faq-e512816e-a856-491a-896b-fde16d661ea7"></a>

## Johnny Silverhand: Never Stop Fighting

**Question:** If Johnny wins a fight during a Rival’s turn, does he still ready from his effect?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Johnny Silverhand: Never Stop Fighting](https://cyberpunktcg.com/cards/johnny-silverhand-never-stop-fighting) — `e512816e-a856-491a-896b-fde16d661ea7`

**Unit tests:**

- [packages/engine/src/cards/units/johnny-silverhand-never-stop-fighting.test.ts](../packages/engine/src/cards/units/johnny-silverhand-never-stop-fighting.test.ts) — also auto-wins as the defender when a CORPO Unit attacks it

<a id="faq-d33a4200-b3f8-48ee-8a83-35c113ee45da"></a>

## Johnny Silverhand: Never Stop Fighting

**Question:** If Johnny wins his first fight this turn but is already ready, can I use the effect on his next attack instead?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Johnny Silverhand: Never Stop Fighting](https://cyberpunktcg.com/cards/johnny-silverhand-never-stop-fighting) — `d33a4200-b3f8-48ee-8a83-35c113ee45da`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — johnny-silverhand-never-stop-fighting FAQ 3

<a id="faq-69794180-6e80-4a4c-b0dc-df8c290bdc19"></a>

## Johnny Silverhand: Never Stop Fighting

**Question:** If Johnny has power 0 when he fights a CORPO Unit., does he still defeat the opposing rival Unit?

**Answer:** No. Johnny Silverhand still wins the fight, but Units at power 0 can't defeat other Units in a fight, so neither Unit is defeated.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Johnny Silverhand: Never Stop Fighting](https://cyberpunktcg.com/cards/johnny-silverhand-never-stop-fighting) — `69794180-6e80-4a4c-b0dc-df8c290bdc19`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — johnny-silverhand-never-stop-fighting FAQ 4

<a id="faq-97a58f36-cd0e-4e0b-9be0-b1ff61a9d2b4"></a>

## Johnny Silverhand: Rocking Renegade

**Question:** Can I reduce Johnny Silverhand’s effect cost to 0 €$?

**Answer:** Yes, but you still need to spend Johnny Silverhand to activate it.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Johnny Silverhand: Rocking Renegade](https://cyberpunktcg.com/cards/johnny-silverhand-rocking-renegade) — `97a58f36-cd0e-4e0b-9be0-b1ff61a9d2b4`

**Unit tests:**

- [packages/engine/src/cards/legends/johnny-silverhand-rocking-renegade.test.ts](../packages/engine/src/cards/legends/johnny-silverhand-rocking-renegade.test.ts) — activates for zero Eddies with two friendly 8+ Gigs

<a id="faq-7af4302f-2f3e-4ddc-9445-fe0ac9f755d7"></a>

## Johnny Silverhand: Rocking Renegade

**Question:** Can I use Johnny's effect on a Unit that wasn't played this turn?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Johnny Silverhand: Rocking Renegade](https://cyberpunktcg.com/cards/johnny-silverhand-rocking-renegade) — `7af4302f-2f3e-4ddc-9445-fe0ac9f755d7`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — johnny-silverhand-rocking-renegade FAQ 2

<a id="faq-e403c866-e7b1-4982-8c0c-0b7d672b7185"></a>

## Johnny Silverhand: Rocking Renegade

**Question:** Can a Unit played on a previous turn still attack the rival Gig area if I use Johnny's effect on it?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Johnny Silverhand: Rocking Renegade](https://cyberpunktcg.com/cards/johnny-silverhand-rocking-renegade) — `e403c866-e7b1-4982-8c0c-0b7d672b7185`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — johnny-silverhand-rocking-renegade FAQ 2

<a id="faq-3dbd8dd8-e076-4ca2-8103-e648718f35e6"></a>

## Judy Álvarez: Braindance Maestro

**Question:** If I play a Program from my trash, does the first effect still trigger?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Judy Álvarez: Braindance Maestro](https://cyberpunktcg.com/cards/judy-a-lvarez-braindance-maestro) — `3dbd8dd8-e076-4ca2-8103-e648718f35e6`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — judy-a-lvarez-braindance-maestro FAQ 1

<a id="faq-179be304-b54b-47f7-8358-eac64e44f31e"></a>

## Judy Álvarez: Braindance Maestro

**Question:** Can I trigger the first effect multiple times in a turn by playing multiple BRAINDANCE Programs?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Judy Álvarez: Braindance Maestro](https://cyberpunktcg.com/cards/judy-a-lvarez-braindance-maestro) — `179be304-b54b-47f7-8358-eac64e44f31e`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — judy-a-lvarez-braindance-maestro FAQ 2

<a id="faq-5822e4e8-3878-49b3-b0d0-fb241272ae6d"></a>

## Judy Álvarez: Braindance Maestro

**Question:** Can I choose the same friendly Unit with this card's first effect each time I play a Program?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Judy Álvarez: Braindance Maestro](https://cyberpunktcg.com/cards/judy-a-lvarez-braindance-maestro) — `5822e4e8-3878-49b3-b0d0-fb241272ae6d`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — judy-a-lvarez-braindance-maestro FAQ 2

<a id="faq-284c60bf-247b-4ff1-8bcb-d60361138dad"></a>

## Judy Álvarez: Braindance Maestro

**Question:** If I play a [QUICK] BRAINDANCE Program as a reaction on my Rival's turn, does first effect trigger?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Judy Álvarez: Braindance Maestro](https://cyberpunktcg.com/cards/judy-a-lvarez-braindance-maestro) — `284c60bf-247b-4ff1-8bcb-d60361138dad`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — judy-a-lvarez-braindance-maestro FAQ 4

<a id="faq-90d8581b-b42a-4061-a7d4-d589879389cc"></a>

## Judy Álvarez: Nothing to Doubt

**Question:** Can I activate this card's effect if I have no cards left in my deck?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Judy Álvarez: Nothing to Doubt](https://cyberpunktcg.com/cards/judy-a-lvarez-nothing-to-doubt) — `90d8581b-b42a-4061-a7d4-d589879389cc`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — judy-a-lvarez-nothing-to-doubt FAQ 1

<a id="faq-91ff465b-38fc-45b1-8db2-d8cbe6b465cc"></a>

## Kerry Eurodyne: Axe, Attitude, Audience

**Question:** If I roll a 1 on a friendly Gig and choose to reroll with Kerry Eurodyne's effect, but don't roll a 1 or 20 on that Gig, do I still get the draw effect for the first result?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Kerry Eurodyne: Axe, Attitude, Audience](https://cyberpunktcg.com/cards/kerry-eurodyne-axe-attitude-audience) — `91ff465b-38fc-45b1-8db2-d8cbe6b465cc`

**Unit tests:**

- [packages/engine/src/cards/legends/kerry-eurodyne-axe-attitude-audience.test.ts](../packages/engine/src/cards/legends/kerry-eurodyne-axe-attitude-audience.test.ts) — uses only the final value after replacing an original boundary roll

<a id="faq-d23941b5-53c4-4036-b19d-cfa8bf059c5a"></a>

## Kerry Eurodyne: The Last Rockerboy

**Question:** Can I activate Kerry's [Spend Icon:] effect the turn I play him?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Kerry Eurodyne: The Last Rockerboy](https://cyberpunktcg.com/cards/kerry-eurodyne-the-last-rockerboy) — `d23941b5-53c4-4036-b19d-cfa8bf059c5a`

**Unit tests:**

- [packages/engine/src/cards/units/kerry-eurodyne-the-last-rockerboy.test.ts](../packages/engine/src/cards/units/kerry-eurodyne-the-last-rockerboy.test.ts) — cannot activate its Spend ability while Kerry has Lag

<a id="faq-1da9b201-025a-487d-b49b-b1c8523579a8"></a>

## Kerry Eurodyne: The Last Rockerboy

**Question:** Can I activate Kerry’s [Spend Icon:] effect if I do not control an 8+ Gig?

**Answer:** Yes, but you won't get to draw 2.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Kerry Eurodyne: The Last Rockerboy](https://cyberpunktcg.com/cards/kerry-eurodyne-the-last-rockerboy) — `1da9b201-025a-487d-b49b-b1c8523579a8`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — kerry-eurodyne-the-last-rockerboy FAQ 2

<a id="faq-498e223a-b488-4fc8-a8cf-35f5e800543a"></a>

## Kerry Eurodyne: The Last Rockerboy

**Question:** If Kerry readies after I activated his [Spend Icon:] effect, can I activate  it again on the same turn?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Kerry Eurodyne: The Last Rockerboy](https://cyberpunktcg.com/cards/kerry-eurodyne-the-last-rockerboy) — `498e223a-b488-4fc8-a8cf-35f5e800543a`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — kerry-eurodyne-the-last-rockerboy FAQ 3

<a id="faq-22d75516-cd32-4b86-bce5-915d075c3ec3"></a>

## Kiroshi Optics

**Question:** Do I have to look at at friendly face-down Legend even if I don't want to?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Kiroshi Optics](https://cyberpunktcg.com/cards/kiroshi-optics) — `22d75516-cd32-4b86-bce5-915d075c3ec3`

**Unit tests:**

- [packages/engine/src/cards/gear/kiroshi-optics.test.ts](../packages/engine/src/cards/gear/kiroshi-optics.test.ts) — looks at a friendly face-down legend without revealing it

<a id="faq-7cf45f7a-84df-4193-9f28-656d3054d183"></a>

## La Llorona: Ghost of the Past

**Question:** When La Llorona uses [BLOCKER], do I increase a Gig for her second effect before or after the ensuing fight?

**Answer:** Before.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [La Llorona: Ghost of the Past](https://cyberpunktcg.com/cards/la-llorona-ghost-of-the-past) — `7cf45f7a-84df-4193-9f28-656d3054d183`

**Unit tests:**

- [packages/engine/src/cards/units/la-llorona-ghost-of-the-past.test.ts](../packages/engine/src/cards/units/la-llorona-ghost-of-the-past.test.ts) — uses Blocker, then may increase either player's Gig by up to 3

<a id="faq-10236d8a-b781-4d18-8857-57f7b3555983"></a>

## La Llorona: Ghost of the Past

**Question:** Can I use  a different Unit's [BLOCKER] effect after I block with La Llorna to redirect the attack again?

**Answer:** Yes. There is no limit of how many times you can use [BLOCKER] in one turn.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [La Llorona: Ghost of the Past](https://cyberpunktcg.com/cards/la-llorona-ghost-of-the-past) — `10236d8a-b781-4d18-8857-57f7b3555983`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — la-llorona-ghost-of-the-past FAQ 2

<a id="faq-287826c0-e5e6-4383-ab1a-a24314ebc44d"></a>

## La Llorona: Ghost of the Past

**Question:** Can La Llorona increase a Gig by 0, 1, 2, or 3, or must it increase by exactly 3?

**Answer:** Up to means 0, 1, 2, or 3.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [La Llorona: Ghost of the Past](https://cyberpunktcg.com/cards/la-llorona-ghost-of-the-past) — `287826c0-e5e6-4383-ab1a-a24314ebc44d`

**Unit tests:**

- [packages/engine/src/cards/units/la-llorona-ghost-of-the-past.test.ts](../packages/engine/src/cards/units/la-llorona-ghost-of-the-past.test.ts) — uses Blocker, then may increase either player's Gig by up to 3
- [packages/engine/src/cards/units/la-llorona-ghost-of-the-past.test.ts](../packages/engine/src/cards/units/la-llorona-ghost-of-the-past.test.ts) — may choose an increase of 0 because the effect says up to 3
- [packages/engine/src/cards/units/la-llorona-ghost-of-the-past.test.ts](../packages/engine/src/cards/units/la-llorona-ghost-of-the-past.test.ts) — normalizes the increase to the selected Gig's maximum face

<a id="faq-9a85bf8b-c371-4d1a-8d13-22976fb78130"></a>

## Les Élémens

**Question:** Who chooses?

**Answer:** The Player activating the card Chooses.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Les Élémens](https://cyberpunktcg.com/cards/les-e-le-mens) — `9a85bf8b-c371-4d1a-8d13-22976fb78130`

**Unit tests:**

- [packages/engine/src/cards/programs/les-elemens.test.ts](../packages/engine/src/cards/programs/les-elemens.test.ts) — allows the player to choose among tied lowest-power Units

<a id="faq-072482a5-a9f6-4f39-9d18-53f483613eed"></a>

## Les Élémens

**Question:** Can I play this card if there is no Rival Unit?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Les Élémens](https://cyberpunktcg.com/cards/les-e-le-mens) — `072482a5-a9f6-4f39-9d18-53f483613eed`

**Unit tests:**

- [packages/engine/src/cards/programs/les-elemens.test.ts](../packages/engine/src/cards/programs/les-elemens.test.ts) — still pays and trashes itself without opening a choice when no rival Unit exists

<a id="faq-3c7f6d4d-2ff5-42a8-a56b-71767d912551"></a>

## Live with the Aftermath

**Question:** Can I play this Program if I do not have a friendly Unit in the field area?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Live with the Aftermath](https://cyberpunktcg.com/cards/live-with-the-aftermath) — `3c7f6d4d-2ff5-42a8-a56b-71767d912551`

**Unit tests:**

- [packages/engine/src/cards/programs/live-with-the-aftermath.test.ts](../packages/engine/src/cards/programs/live-with-the-aftermath.test.ts) — still lets the rival defeat their Unit when the controller controls no Unit

<a id="faq-a391a6fc-a480-4d18-b451-438ba58948e1"></a>

## Live with the Aftermath

**Question:** Can I play this Program if there is no rival Unit in the field area?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Live with the Aftermath](https://cyberpunktcg.com/cards/live-with-the-aftermath) — `a391a6fc-a480-4d18-b451-438ba58948e1`

**Unit tests:**

- [packages/engine/src/cards/programs/live-with-the-aftermath.test.ts](../packages/engine/src/cards/programs/live-with-the-aftermath.test.ts) — still defeats the controller's Unit when the rival controls no Unit

<a id="faq-8ebfb418-5733-4153-a981-8076cb0e9f41"></a>

## Live with the Aftermath

**Question:** Can I play this Program if there are no Units in the field area?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Live with the Aftermath](https://cyberpunktcg.com/cards/live-with-the-aftermath) — `8ebfb418-5733-4153-a981-8076cb0e9f41`

**Unit tests:**

- [packages/engine/src/cards/programs/live-with-the-aftermath.test.ts](../packages/engine/src/cards/programs/live-with-the-aftermath.test.ts) — pays and trashes itself without a choice when neither player controls a Unit

<a id="faq-bd1e1e2f-a20a-40dc-be90-265bfcb367aa"></a>

## Maelstrom Goons

**Question:** If I steal more than 1 Gig at a time, does my Rival have to discard more than 1?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Maelstrom Goons](https://cyberpunktcg.com/cards/maelstrom-goons) — `bd1e1e2f-a20a-40dc-be90-265bfcb367aa`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — maelstrom-goons FAQ 1

<a id="faq-a40d7f07-d5ed-4ae5-88f7-f5e4e4d4b28f"></a>

## Maelstrom Zealots

**Question:** What is "the opposing rival Unit?"

**Answer:** It's the Unit in a fight with your friendly Unit.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Maelstrom Zealots](https://cyberpunktcg.com/cards/maelstrom-zealots) — `a40d7f07-d5ed-4ae5-88f7-f5e4e4d4b28f`

**Unit tests:**

- [packages/engine/src/cards/units/maelstrom-zealots.test.ts](../packages/engine/src/cards/units/maelstrom-zealots.test.ts) — defeats the opposing rival Unit when it loses a fight as the attacker
- [packages/engine/src/cards/units/maelstrom-zealots.test.ts](../packages/engine/src/cards/units/maelstrom-zealots.test.ts) — defeats the opposing attacker when it loses a fight as the defender

<a id="faq-3dc2ff22-518e-4809-ae1e-f778621642f0"></a>

## Maelstrom Zealots

**Question:** If my Unit loses a fight but has an effect that it cannot be defeated, does it still lose the fight?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Maelstrom Zealots](https://cyberpunktcg.com/cards/maelstrom-zealots) — `3dc2ff22-518e-4809-ae1e-f778621642f0`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — muamar-reyes-el-capita-n FAQ 3

<a id="faq-9d6d9ce9-9dca-42f9-bb90-0e89c5fed80b"></a>

## Maman Brigitte: Spirit of Death

**Question:** If I can't discard 2 Programs to gain the rest of the effect, can I choose to just discard 1 anyway?

**Answer:** No. You may discard 2 to resolve the full effect or none at all.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Maman Brigitte: Spirit of Death](https://cyberpunktcg.com/cards/maman-brigitte-spirit-of-death) — `9d6d9ce9-9dca-42f9-bb90-0e89c5fed80b`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — maman-brigitte-spirit-of-death FAQ 1

<a id="faq-9dfba4f9-6ebe-46ab-adcf-757a0e407d11"></a>

## MaxTac AV

**Question:** Am I forced to Swap Gigs?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [MaxTac AV](https://cyberpunktcg.com/cards/maxtac-av) — `9dfba4f9-6ebe-46ab-adcf-757a0e407d11`

**Unit tests:**

- [packages/engine/src/cards/units/maxtac-av.test.ts](../packages/engine/src/cards/units/maxtac-av.test.ts) — may decline the Play trigger without swapping either Gig

<a id="faq-86289bd1-7a4f-4b3e-b588-b8acc2212ad7"></a>

## MaxTac Heavy

**Question:** Does MaxTac Heavy's effect change the cost of the card?

**Answer:** No, only the amount you pay.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [MaxTac Heavy](https://cyberpunktcg.com/cards/maxtac-heavy) — `86289bd1-7a4f-4b3e-b588-b8acc2212ad7`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — maxtac-heavy FAQ 1

<a id="faq-36ecf80a-cd64-4a27-91ac-a079e8d4250b"></a>

## MaxTac Squadron

**Question:** If I ready my Maxtac Squadron with a different end-of-turn effect before I resolve this effect, can I still ready a friendly face-up Legend?

**Answer:** No. To avoid invalidating Maxtac Squadron's effect, resolve it before any effects that would ready it.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [MaxTac Squadron](https://cyberpunktcg.com/cards/maxtac-squadron) — `36ecf80a-cd64-4a27-91ac-a079e8d4250b`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — maxtac-squadron FAQ 1

<a id="faq-00a253c5-f0a2-4f13-a7a3-520c703c2402"></a>

## MaxTac Suppression Team

**Question:** I played a friendly Legend to the field area with [GO SOLO] this turn. Can it attack even if my rival has a Maxtax Suppression Team?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [MaxTac Suppression Team](https://cyberpunktcg.com/cards/maxtac-suppression-team) — `00a253c5-f0a2-4f13-a7a3-520c703c2402`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — maxtac-suppression-team FAQ 1

<a id="faq-ae3bd50b-b937-4a8a-8c8a-24dab0acd367"></a>

## Meredith Stout: Stone Cold Corpo

**Question:** If a Rival adjusts or swaps multiple friendly Gigs simultaneously, does Meredith Stout's effect trigger for each of them?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Meredith Stout: Stone Cold Corpo](https://cyberpunktcg.com/cards/meredith-stout-stone-cold-corpo) — `ae3bd50b-b937-4a8a-8c8a-24dab0acd367`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — meredith-stout-stone-cold-corpo FAQ 1

<a id="faq-a6bfa127-ff5b-4aed-a261-fac2be6a71c5"></a>

## Minotaur

**Question:** Can I still play this card if I don't have more Street Cred than my Rival?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Minotaur](https://cyberpunktcg.com/cards/minotaur) — `a6bfa127-ff5b-4aed-a261-fac2be6a71c5`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — minotaur FAQ 1

<a id="faq-1528eec2-100f-4436-9874-d45f3589e9af"></a>

## Minotaur

**Question:** Do I have to defeat a rival Unit with power 5 or less, even if I don't want to?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Minotaur](https://cyberpunktcg.com/cards/minotaur) — `1528eec2-100f-4436-9874-d45f3589e9af`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — minotaur FAQ 2

<a id="faq-e82502be-aaff-4d75-bd4b-87e00e760fa1"></a>

## Misty Olszewski: Mender of Broken Spirits

**Question:** Do card types include Legends?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Consolidation:** Equivalent wording: both questions ask whether Legends are a valid card type choice.

**Official sources:**

- [Misty Olszewski: Mender of Broken Spirits](https://cyberpunktcg.com/cards/misty-olszewski-mender-of-broken-spirits) — `e82502be-aaff-4d75-bd4b-87e00e760fa1`
- [Misty Olszewski: Mender of Broken Spirits](https://cyberpunktcg.com/cards/misty-olszewski-mender-of-broken-spirits) — `1d61a391-26ad-484b-9ae5-621df7aa2adc`
  - Wording: Can I choose "Legends" for this effect?

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — misty-olszewski-mender-of-broken-spirits FAQ 2 (Misty Olszewski: Mender of Broken Spirits)

<a id="faq-e6eaf7b6-9d18-41a9-8e01-d2d060dafc03"></a>

## Modded Kusanagi

**Question:** Can this effect be used in the trash?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Modded Kusanagi](https://cyberpunktcg.com/cards/modded-kusanagi) — `e6eaf7b6-9d18-41a9-8e01-d2d060dafc03`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — modded-kusanagi FAQ 1

<a id="faq-d0a32e18-0674-4b46-ae37-e4f5dd4ab053"></a>

## Modded Muramasa

**Question:** If I have less (Street Cred) than a Rival at the end of my turn, am I forced to ready this Unit?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Modded Muramasa](https://cyberpunktcg.com/cards/modded-muramasa) — `d0a32e18-0674-4b46-ae37-e4f5dd4ab053`

**Unit tests:**

- [packages/engine/src/cards/units/modded-muramasa.test.ts](../packages/engine/src/cards/units/modded-muramasa.test.ts) — readies at the end of your turn when you have less Street Cred than a Rival

<a id="faq-993d5dde-b6f3-4e0a-b6de-48fe2efda10c"></a>

## Mox Inciters

**Question:** I use this on my rival's Unit that has an effect that reads "This Unit can't attack." will that Unit be able to make an attack?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Mox Inciters](https://cyberpunktcg.com/cards/mox-inciters) — `993d5dde-b6f3-4e0a-b6de-48fe2efda10c`

**Unit tests:**

- [packages/engine/src/cards/units/mox-inciters.test.ts](../packages/engine/src/cards/units/mox-inciters.test.ts) — lets the rival pass and expires the rule if the incited Unit can't attack

<a id="faq-b0b79c55-4167-448c-8717-b9f9f60b7ea6"></a>

## MT0D12 Flathead

**Question:** Am I able to sell this card even if it is a Unit?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [MT0D12 Flathead](https://cyberpunktcg.com/cards/mt0d12-flathead) — `b0b79c55-4167-448c-8717-b9f9f60b7ea6`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — mt0d12-flathead FAQ 1

<a id="faq-4ab27f37-6192-43a3-97eb-cf81060bb6d3"></a>

## MT0D12 Flathead

**Question:** If I have lower Street Cred when I attack with MT0D12 Flathead, but triggered effects or reactions make my Rival's Street Cred lower than mine, can my Rival then block the MT0D12 Flathead's attack?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [MT0D12 Flathead](https://cyberpunktcg.com/cards/mt0d12-flathead) — `4ab27f37-6192-43a3-97eb-cf81060bb6d3`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — mt0d12-flathead FAQ 2

<a id="faq-63f515ca-17b9-40ee-83ae-30abb4404bb4"></a>

## Muamar Reyes: El Capitán

**Question:** If I do not have a friendly Unit, do I have to choose the Draw 1 effect?

**Answer:** No. You can still "choose" the other effect, it just fails.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Muamar Reyes: El Capitán](https://cyberpunktcg.com/cards/muamar-reyes-el-capita-n) — `63f515ca-17b9-40ee-83ae-30abb4404bb4`

**Unit tests:**

- [packages/engine/src/cards/legends/muamar-reyes-el-capitan.test.ts](../packages/engine/src/cards/legends/muamar-reyes-el-capitan.test.ts) — may choose protection with no friendly Unit and resolves as much as possible

<a id="faq-329babc2-5aa7-40ee-a760-126d86bdc2c5"></a>

## Muamar Reyes: El Capitán

**Question:** Does Muamar Reyes's effect each fight the Unit is in this turn?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Muamar Reyes: El Capitán](https://cyberpunktcg.com/cards/muamar-reyes-el-capita-n) — `329babc2-5aa7-40ee-a760-126d86bdc2c5`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — muamar-reyes-el-capita-n FAQ 2

<a id="faq-c155d52c-a1ee-42f6-8698-13721cb2b6b9"></a>

## Muamar Reyes: El Capitán

**Question:** If the chosen Unit with Muamar Reye's effect can't be defeated, can it still lose a fight?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Muamar Reyes: El Capitán](https://cyberpunktcg.com/cards/muamar-reyes-el-capita-n) — `c155d52c-a1ee-42f6-8698-13721cb2b6b9`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — muamar-reyes-el-capita-n FAQ 3

<a id="faq-526169c5-08ff-4dfe-9690-c385754b658c"></a>

## Nadia: Fighting Through Grief

**Question:** If Nadia attacks the rival Gig area the turn she is played but an effect causes my Rival to have less Gig's than me, does that cancel Nadia's attack?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Nadia: Fighting Through Grief](https://cyberpunktcg.com/cards/nadia-fighting-through-grief) — `526169c5-08ff-4dfe-9690-c385754b658c`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — nadia-fighting-through-grief FAQ 1

<a id="faq-44cc0af1-c683-4dd4-882e-7eefd4c443b3"></a>

## NetWatch Netdriver

**Question:** When I spend a Unit equipped with Netwatch Netdriver to declare an attack, do I get Netwatch Netdriver's effect before or after I resolve the attack?

**Answer:** Before.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [NetWatch Netdriver](https://cyberpunktcg.com/cards/netwatch-netdriver) — `44cc0af1-c683-4dd4-882e-7eefd4c443b3`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — netwatch-netdriver FAQ 1

<a id="faq-e7efa410-6ebf-4195-9e8e-8a31a00f20b2"></a>

## NetWatch Netdriver

**Question:** If I spend a Unit equipped with Netwatch Netdriver to declare an attack, and the Unit or Legend has an [ATTACK] effect, do I get Netwatch Netdriver's effect before or after the [ATTACK] effect?

**Answer:** You can choose the order you resolve these effects.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [NetWatch Netdriver](https://cyberpunktcg.com/cards/netwatch-netdriver) — `e7efa410-6ebf-4195-9e8e-8a31a00f20b2`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — netwatch-netdriver FAQ 2 (spend first)
- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — netwatch-netdriver FAQ 2 (attack first)

<a id="faq-6a903897-b1e2-486f-835e-3c702fcbe77c"></a>

## NetWatch Netdriver

**Question:** If I spend a Unit or Legend equipped with Netwatch Netdriver to activate the Unit/Legend's [Spend Icon:] effect, do I resolve Netwatch Netdriver's effect before or after the activated effect?

**Answer:** After. Resolve the activated [Spend Icon:] effect first.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [NetWatch Netdriver](https://cyberpunktcg.com/cards/netwatch-netdriver) — `6a903897-b1e2-486f-835e-3c702fcbe77c`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — netwatch-netdriver FAQ 3

<a id="faq-52e98457-4afa-4996-972b-5ec373a331c5"></a>

## NetWatch Netdriver

**Question:** If I spend a Legend equipped with Netwatch Netdriver to pay a card's cost, do I resolve Netwatch Netdriver's effect before or after I play the card?

**Answer:** After.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [NetWatch Netdriver](https://cyberpunktcg.com/cards/netwatch-netdriver) — `52e98457-4afa-4996-972b-5ec373a331c5`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — netwatch-netdriver FAQ 4

<a id="faq-d1fecc2d-4186-438c-9de7-de02184f0ad7"></a>

## Nocturne OP55 N1

**Question:** How do I know if my fixer area is empty?

**Answer:** If there are no longer any Gig die in the fixer area then the fixer area is now empty.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Nocturne OP55 N1](https://cyberpunktcg.com/cards/nocturne-op55-n1) — `d1fecc2d-4186-438c-9de7-de02184f0ad7`

**Unit tests:**

- [packages/engine/src/cards/programs/nocturne-op55-n1.test.ts](../packages/engine/src/cards/programs/nocturne-op55-n1.test.ts) — replaces its play cost with 1 €$ when the fixer area is empty
- [packages/engine/src/cards/programs/nocturne-op55-n1.test.ts](../packages/engine/src/cards/programs/nocturne-op55-n1.test.ts) — keeps its printed 3 €$ cost while the fixer still has dice

<a id="faq-d9d3bf9e-e13a-4a19-9220-7fcc74e47eae"></a>

## Nocturne OP55 N1

**Question:** May I chose an effect even if I cannot meet the requirements to fufill the effect?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Nocturne OP55 N1](https://cyberpunktcg.com/cards/nocturne-op55-n1) — `d9d3bf9e-e13a-4a19-9220-7fcc74e47eae`

**Unit tests:**

- [packages/engine/src/cards/programs/nocturne-op55-n1.test.ts](../packages/engine/src/cards/programs/nocturne-op55-n1.test.ts) — keeps all three printed modes available even when no nested target currently exists

<a id="faq-0bba2dd4-1887-48bc-a577-9411b1081a64"></a>

## Nocturne OP55 N1

**Question:** If your fixer area is empty am I forced to play this for 1 eddie?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Nocturne OP55 N1](https://cyberpunktcg.com/cards/nocturne-op55-n1) — `0bba2dd4-1887-48bc-a577-9411b1081a64`

**Unit tests:**

- [packages/engine/src/cards/programs/nocturne-op55-n1.test.ts](../packages/engine/src/cards/programs/nocturne-op55-n1.test.ts) — replaces its play cost with 1 €$ when the fixer area is empty

<a id="faq-79a2970c-40e7-4d7f-a419-57a4b8eb3c76"></a>

## Octant

**Question:** Does Octant's effect change the cost of the card?

**Answer:** No, only the amount you pay.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Octant](https://cyberpunktcg.com/cards/octant) — `79a2970c-40e7-4d7f-a419-57a4b8eb3c76`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — octant FAQ 1

<a id="faq-b91fa741-e2c0-4974-8663-74d7f661d3e3"></a>

## Offduty Malfini

**Question:** If my Rival does not have a Unit on the field when I play Offduty Malfini, do I still have to spend it?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Offduty Malfini](https://cyberpunktcg.com/cards/offduty-malfini) — `b91fa741-e2c0-4974-8663-74d7f661d3e3`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — offduty-malfini FAQ 1

<a id="faq-3aec4fa6-6b30-466a-a4a8-7449ce7ab078"></a>

## Over the Edge

**Question:** Can I use this to defeat a Unit with 0 power if I do not have a friendly D20?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Over the Edge](https://cyberpunktcg.com/cards/over-the-edge) — `3aec4fa6-6b30-466a-a4a8-7449ce7ab078`

**Unit tests:**

- [packages/engine/src/cards/programs/over-the-edge.test.ts](../packages/engine/src/cards/programs/over-the-edge.test.ts) — ignores a rival d20 and resolves with no target when no friendly d20 exists

<a id="faq-6b61f796-5665-4ae0-bb6a-4b607cb20b28"></a>

## Over the Edge

**Question:** Can I defeat my own Unit with this effect?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Over the Edge](https://cyberpunktcg.com/cards/over-the-edge) — `6b61f796-5665-4ae0-bb6a-4b607cb20b28`

**Unit tests:**

- [packages/engine/src/cards/programs/over-the-edge.test.ts](../packages/engine/src/cards/programs/over-the-edge.test.ts) — pays 3 and offers friendly and rival Units at or below the friendly d20 value

<a id="faq-00b41165-2bad-41c3-8a4a-be0c6747f4d7"></a>

## Over the Edge

**Question:** If I do not control a friendly d20, can I play Over the Edge?

**Answer:** Yes, but you cannot defeat a Unit.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Over the Edge](https://cyberpunktcg.com/cards/over-the-edge) — `00b41165-2bad-41c3-8a4a-be0c6747f4d7`

**Unit tests:**

- [packages/engine/src/cards/programs/over-the-edge.test.ts](../packages/engine/src/cards/programs/over-the-edge.test.ts) — ignores a rival d20 and resolves with no target when no friendly d20 exists

<a id="faq-7f11608a-92cf-4b9f-a3b0-9d170ef231c7"></a>

## Overwatch: Panam's Gift

**Question:** If I use this card's [Spend Icon:] effect but my hand is empty, can I still do the rest of the effect?

**Answer:** No, you must discard 1.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Overwatch: Panam's Gift](https://cyberpunktcg.com/cards/overwatch-panam-s-gift) — `7f11608a-92cf-4b9f-a3b0-9d170ef231c7`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — overwatch-panam-s-gift FAQ 1

<a id="faq-933f4b48-5e65-48a8-97ba-3a2e255a8b7d"></a>

## Pacifica Netrunner

**Question:** Do I have to choose a rival Unit with this effect when played?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Pacifica Netrunner](https://cyberpunktcg.com/cards/pacifica-netrunner) — `933f4b48-5e65-48a8-97ba-3a2e255a8b7d`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — pacifica-netrunner FAQ 1

<a id="faq-2376d51c-ae2c-4eb6-aed9-d25a05d56e09"></a>

## Padre: Man of the Cross / Wakako Okada: Peace and Harmony

**Question:** If there are no viable rival Units, do I have to choose the draw effect?

**Answer:** No. You can still "choose" the other effect, it just fails.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Padre: Man of the Cross](https://cyberpunktcg.com/cards/padre-man-of-the-cross) — `2376d51c-ae2c-4eb6-aed9-d25a05d56e09`
- [Wakako Okada: Peace and Harmony](https://cyberpunktcg.com/cards/wakako-okada-peace-and-harmony) — `ab2739ef-ffc9-493d-b523-b6823ba1b618`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — padre-man-of-the-cross FAQ 1 (Padre: Man of the Cross)
- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — wakako-okada-peace-and-harmony FAQ 1 (Wakako Okada: Peace and Harmony)

<a id="faq-afa9a2eb-1766-49c4-95d5-2c1673aae7dd"></a>

## Padre: Man of the Cross

**Question:** May I use this card's [Spend Icon:] if all Gigs are already the same value?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Padre: Man of the Cross](https://cyberpunktcg.com/cards/padre-man-of-the-cross) — `afa9a2eb-1766-49c4-95d5-2c1673aae7dd`

**Unit tests:**

- [packages/engine/src/cards/legends/padre-man-of-the-cross.test.ts](../packages/engine/src/cards/legends/padre-man-of-the-cross.test.ts) — allows a same-value pair, spends Padre, and leaves the Gig unchanged

<a id="faq-097a8261-ba28-407e-9f81-1cf59c8e995b"></a>

## Panam Palmer: Nomad Cavalry

**Question:** Can I move a Gear from this Legend to an unequipped friendly Unit that's already ready?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Panam Palmer: Nomad Cavalry](https://cyberpunktcg.com/cards/panam-palmer-nomad-cavalry) — `097a8261-ba28-407e-9f81-1cf59c8e995b`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — panam-palmer-nomad-cavalry FAQ 1

<a id="faq-5c29eb76-b653-47e4-a7c5-ad38e770890c"></a>

## Panam Palmer: Nomad Cavalry

**Question:** For the second effect,  do I need both Units and Legends equipped?

**Answer:** No, a combination of any 5 equipped Units and equipped Legends satisfies the condition.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Panam Palmer: Nomad Cavalry](https://cyberpunktcg.com/cards/panam-palmer-nomad-cavalry) — `5c29eb76-b653-47e4-a7c5-ad38e770890c`

**Unit tests:**

- [packages/engine/src/cards/legends/panam-palmer-nomad-cavalry.test.ts](../packages/engine/src/cards/legends/panam-palmer-nomad-cavalry.test.ts) — at exactly five equipped friendly Units and Legends, readies all five at end of turn

<a id="faq-eb1edc97-4acc-49ca-b9e7-8c07cb28e1d9"></a>

## Panam Palmer: Strength Through Family

**Question:** If I already Called a Legend this turn, can I call another Legend with Panam Palmer's effect?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Panam Palmer: Strength Through Family](https://cyberpunktcg.com/cards/panam-palmer-strength-through-family) — `eb1edc97-4acc-49ca-b9e7-8c07cb28e1d9`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — panam-palmer-strength-through-family FAQ 1

<a id="faq-070c816a-ea6e-43b6-9408-cf976ef42dac"></a>

## Peace Offering

**Question:** Does the Gig I set need to be part of the value-pair in order to draw 1?

**Answer:** No. Any friendly value-pair satisfies the conditions.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Peace Offering](https://cyberpunktcg.com/cards/peace-offering) — `070c816a-ea6e-43b6-9408-cf976ef42dac`

**Unit tests:**

- [packages/engine/src/cards/programs/peace-offering.test.ts](../packages/engine/src/cards/programs/peace-offering.test.ts) — may decline the copy and still performs the following value-pair draw
- [packages/engine/src/cards/programs/peace-offering.test.ts](../packages/engine/src/cards/programs/peace-offering.test.ts) — allows selecting an invalid target and still draws from an existing friendly pair

<a id="faq-1f2d750b-a776-4d1c-bc79-a4621ab2cf0d"></a>

## Pepe Najarro: Working Doubles

**Question:** What's a value-pair?

**Answer:** Two Gigs with the same value within the same Gig area.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Pepe Najarro: Working Doubles](https://cyberpunktcg.com/cards/pepe-najarro-working-doubles) — `1f2d750b-a776-4d1c-bc79-a4621ab2cf0d`

**Unit tests:**

- [packages/engine/src/cards/units/pepe-najarro-working-doubles.test.ts](../packages/engine/src/cards/units/pepe-najarro-working-doubles.test.ts) — with a value-pair offers exactly the spent face-up MERC Legends
- [packages/engine/src/cards/units/pepe-najarro-working-doubles.test.ts](../packages/engine/src/cards/units/pepe-najarro-working-doubles.test.ts) — does not trigger the ready choice without a friendly value-pair

<a id="faq-ae31fcd3-d3db-4bbe-b099-2a07cc0ba270"></a>

## Placide: Voodoo Sentinel

**Question:** May I discard 1 Program even if there's no rival Unit to bottom-deck?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Placide: Voodoo Sentinel](https://cyberpunktcg.com/cards/placide-voodoo-sentinel) — `ae31fcd3-d3db-4bbe-b099-2a07cc0ba270`

**Unit tests:**

- [packages/engine/src/cards/units/placide-voodoo-sentinel.test.ts](../packages/engine/src/cards/units/placide-voodoo-sentinel.test.ts) — may discard a Program even when there is no rival Unit to bottom-deck

<a id="faq-29b8e233-81e1-4660-9df8-eb9002af9562"></a>

## Pyramid Song / Towerfall

**Question:** If I choose both effetcs, can I choose what order I resolve them?

**Answer:** No, you must resolve the top effect first, then the bottom one.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Pyramid Song](https://cyberpunktcg.com/cards/pyramid-song) — `29b8e233-81e1-4660-9df8-eb9002af9562`
- [Towerfall](https://cyberpunktcg.com/cards/towerfall) — `cabf44d5-8f4c-420e-b149-e408e4fcc699`

**Unit tests:**

- [packages/engine/src/cards/programs/pyramid-song.test.ts](../packages/engine/src/cards/programs/pyramid-song.test.ts) — both path continues after the first target prompt (power-down then bottom-deck) (Pyramid Song)
- [packages/engine/src/cards/programs/towerfall.test.ts](../packages/engine/src/cards/programs/towerfall.test.ts) — applies both modes when the caster has less Street Cred (Towerfall)

<a id="faq-e18d31dd-7ee1-4494-8098-a72db45bfa2d"></a>

## Reboot Optics

**Question:** If my Unit loses a fight but isn't defeated due to this effect, does it still count as losing the fight?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Reboot Optics](https://cyberpunktcg.com/cards/reboot-optics) — `e18d31dd-7ee1-4494-8098-a72db45bfa2d`

**Unit tests:**

- [packages/engine/src/cards/programs/reboot-optics.test.ts](../packages/engine/src/cards/programs/reboot-optics.test.ts) — protects the friendly attacker when a stronger rival defender fights

<a id="faq-06f40e31-2d2e-46d4-bfab-7670da4c189c"></a>

## Riot Shield

**Question:** Does this effect force my Rival to use [GO SOLO] on their turn if they have enough €$ available?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Riot Shield](https://cyberpunktcg.com/cards/riot-shield) — `06f40e31-2d2e-46d4-bfab-7670da4c189c`

**Unit tests:**

- [packages/engine/src/cards/gear/riot-shield.test.ts](../packages/engine/src/cards/gear/riot-shield.test.ts) — registers a rival Go Solo cost increase while attached
- [packages/engine/src/cards/gear/riot-shield.test.ts](../packages/engine/src/cards/gear/riot-shield.test.ts) — lets a rival Go Solo once they pay the +2 €$ (the legend funds 1 itself, 6 eddies cover the rest)
- [packages/engine/src/cards/gear/riot-shield.test.ts](../packages/engine/src/cards/gear/riot-shield.test.ts) — rejects a rival Go Solo when only the printed base cost is available

<a id="faq-7b34456c-7332-4134-9650-5864aee59890"></a>

## Rita Wheeler: No Stupid Questions

**Question:** If I have no cards left in my deck when I spend a friendly Rita Wheeler, do I lose the game?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Rita Wheeler: No Stupid Questions](https://cyberpunktcg.com/cards/rita-wheeler-no-stupid-questions) — `7b34456c-7332-4134-9650-5864aee59890`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — rita-wheeler-no-stupid-questions FAQ 1

<a id="faq-88707f62-0eaf-4383-9304-c28a50c995e3"></a>

## River Ward: Detective on the Hunt

**Question:** Can I activate River Ward’s [QUICK] [Spend Icon:] effect if I have no Gear cards in hand?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [River Ward: Detective on the Hunt](https://cyberpunktcg.com/cards/river-ward-detective-on-the-hunt) — `88707f62-0eaf-4383-9304-c28a50c995e3`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — river-ward-detective-on-the-hunt FAQ 1

<a id="faq-81489d83-54af-42d9-a5b3-8eb4e5399ae6"></a>

## River Ward: Detective on the Hunt

**Question:** Does the Gear have to be equipped to this Legend?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [River Ward: Detective on the Hunt](https://cyberpunktcg.com/cards/river-ward-detective-on-the-hunt) — `81489d83-54af-42d9-a5b3-8eb4e5399ae6`

**Unit tests:**

- [packages/engine/src/cards/legends/river-ward-detective-on-the-hunt.test.ts](../packages/engine/src/cards/legends/river-ward-detective-on-the-hunt.test.ts) — can equip a cheap Gear from hand to a friendly face-up Legend

<a id="faq-a6ed37cc-f3f9-42e6-8246-0edf668b0bc5"></a>

## River Ward: Detective on the Hunt

**Question:** Do you have to Trash the top card after searching?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [River Ward: Detective on the Hunt](https://cyberpunktcg.com/cards/river-ward-detective-on-the-hunt) — `a6ed37cc-f3f9-42e6-8246-0edf668b0bc5`

**Unit tests:**

- [packages/engine/src/cards/legends/river-ward-detective-on-the-hunt.test.ts](../packages/engine/src/cards/legends/river-ward-detective-on-the-hunt.test.ts) — triggers from an equipped friendly Unit using the defeated event-time attached state

<a id="faq-28a594b5-9188-4f9b-9d3d-8e0100d6ce5e"></a>

## River Ward: Detective on the Hunt

**Question:** Do I keep the card not Trashed on top of my deck?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [River Ward: Detective on the Hunt](https://cyberpunktcg.com/cards/river-ward-detective-on-the-hunt) — `28a594b5-9188-4f9b-9d3d-8e0100d6ce5e`

**Unit tests:**

- [packages/engine/src/cards/legends/river-ward-detective-on-the-hunt.test.ts](../packages/engine/src/cards/legends/river-ward-detective-on-the-hunt.test.ts) — triggers from an equipped friendly Unit using the defeated event-time attached state

<a id="faq-e4837808-b775-4bbb-8e98-6c5c8441324e"></a>

## Rogue Amendiares: Preem Solo

**Question:** Does Rogue Amendiares' effect trigger if she steals a Gig herself?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Rogue Amendiares: Preem Solo](https://cyberpunktcg.com/cards/rogue-amendiares-preem-solo) — `e4837808-b775-4bbb-8e98-6c5c8441324e`

**Unit tests:**

- [packages/engine/src/cards/legends/rogue-amendiares-preem-solo.test.ts](../packages/engine/src/cards/legends/rogue-amendiares-preem-solo.test.ts) — resolves once per Gig when a friendly Legend simultaneously steals one even and one odd Gig

<a id="faq-c66b9c47-a74d-4293-89ae-3d04bbb5bf92"></a>

## Rogue Amendiares: Preem Solo

**Question:** Does Rogue Amendiares' effect work while face-up in the Legend area?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Rogue Amendiares: Preem Solo](https://cyberpunktcg.com/cards/rogue-amendiares-preem-solo) — `c66b9c47-a74d-4293-89ae-3d04bbb5bf92`

**Unit tests:**

- [packages/engine/src/cards/legends/rogue-amendiares-preem-solo.test.ts](../packages/engine/src/cards/legends/rogue-amendiares-preem-solo.test.ts) — draws 1 when a friendly Legend steals an even Gig
- [packages/engine/src/cards/legends/rogue-amendiares-preem-solo.test.ts](../packages/engine/src/cards/legends/rogue-amendiares-preem-solo.test.ts) — makes a Rival discard 1 when a friendly Legend steals an odd Gig

<a id="faq-9ce8258b-6b6a-4157-9054-7923068292d5"></a>

## Rogue Amendiares: Queen of the Afterlife

**Question:** If I manage to play Rogue Amendiares on my Rival's turn, can I use her [QUICK] effect that turn?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Rogue Amendiares: Queen of the Afterlife](https://cyberpunktcg.com/cards/rogue-amendiares-queen-of-the-afterlife) — `9ce8258b-6b6a-4157-9054-7923068292d5`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — rogue-amendiares-queen-of-the-afterlife FAQ 1

<a id="faq-506cd2e9-d647-404d-a713-14e340241fcc"></a>

## Royce: Don't Call Me Simon

**Question:** Do I have to defeat a rival Unit even if I don't want to?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Royce: Don't Call Me Simon](https://cyberpunktcg.com/cards/royce-don-t-call-me-simon) — `506cd2e9-d647-404d-a713-14e340241fcc`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — royce-don-t-call-me-simon FAQ 1

<a id="faq-3ae8916f-514c-47dd-b078-a5844f21277d"></a>

## Royce: Don't Call Me Simon

**Question:** If a rival Unit’s power is reduced to 2 or 3 by another effect this turn, can Royce defeat it?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Royce: Don't Call Me Simon](https://cyberpunktcg.com/cards/royce-don-t-call-me-simon) — `3ae8916f-514c-47dd-b078-a5844f21277d`

**Unit tests:**

- [packages/engine/src/cards/units/royce-don-t-call-me-simon.test.ts](../packages/engine/src/cards/units/royce-don-t-call-me-simon.test.ts) — uses the power-2 threshold at equal Street Cred and effective power
- [packages/engine/src/cards/units/royce-don-t-call-me-simon.test.ts](../packages/engine/src/cards/units/royce-don-t-call-me-simon.test.ts) — offers only rival Units and uses their effective rather than printed power

<a id="faq-4c90424e-2603-4927-8bbd-067de4332a36"></a>

## Royce: Psycho on the Edge

**Question:** Can I equip Gear to Royce in the Legends area?

**Answer:** Yes, you can equip face-up Legends in the Legends area.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Royce: Psycho on the Edge](https://cyberpunktcg.com/cards/royce-psycho-on-the-edge) — `4c90424e-2603-4927-8bbd-067de4332a36`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — royce-psycho-on-the-edge FAQ 1

<a id="faq-46c436af-2ee0-4b1a-b7d5-03df43ed5203"></a>

## Royce: Psycho on the Edge

**Question:** Does the Royce +2 power for each equipped Gear apply while he is still in the Legend area?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Royce: Psycho on the Edge](https://cyberpunktcg.com/cards/royce-psycho-on-the-edge) — `46c436af-2ee0-4b1a-b7d5-03df43ed5203`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — royce-psycho-on-the-edge FAQ 1

<a id="faq-903ccbd0-d2d9-46e0-9ffc-cd5ebddef04a"></a>

## Royce: Psycho on the Edge

**Question:** What happens to a Gear on a Legend when the Legend is removed from play?

**Answer:** When a Legend leaves the field or Legends area, its attached Gear follows the Legend to that area, then is no longer equipped in the new area. So, the Gear remains in that new area when you remove the Legend from play.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Royce: Psycho on the Edge](https://cyberpunktcg.com/cards/royce-psycho-on-the-edge) — `903ccbd0-d2d9-46e0-9ffc-cd5ebddef04a`

**Unit tests:**

- [packages/engine/src/cards/legends/royce-psycho-on-the-edge.test.ts](../packages/engine/src/cards/legends/royce-psycho-on-the-edge.test.ts) — is removed from the game rather than trashed after GO SOLO when it leaves the field

<a id="faq-76746ab1-b325-427c-a8ca-499dcff97fb3"></a>

## Ruthless Lowlife

**Question:** If this Unit is chosen by Mox Inciters to attack but there's no spent rival Unit, is this Unit forced to make an attack on the rival's Gig area?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Ruthless Lowlife](https://cyberpunktcg.com/cards/ruthless-lowlife) — `76746ab1-b325-427c-a8ca-499dcff97fb3`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — ruthless-lowlife FAQ 1

<a id="faq-18318e94-6979-4623-9cf5-fee73924d728"></a>

## Saburo Arasaka: Stubborn Patriarch

**Question:** Do my Friendly Arasaka Units have +1 power while in the fight or steal step?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Saburo Arasaka: Stubborn Patriarch](https://cyberpunktcg.com/cards/saburo-arasaka-stubborn-patriarch) — `18318e94-6979-4623-9cf5-fee73924d728`

**Unit tests:**

- [packages/engine/src/cards/legends/saburo-arasaka-stubborn-patriarch.test.ts](../packages/engine/src/cards/legends/saburo-arasaka-stubborn-patriarch.test.ts) — gives a friendly Arasaka Unit +1 power while it attacks
- [packages/engine/src/cards/legends/saburo-arasaka-stubborn-patriarch.test.ts](../packages/engine/src/cards/legends/saburo-arasaka-stubborn-patriarch.test.ts) — crosses the 10-power breakpoint and steals exactly 2 Gigs

<a id="faq-6b38d8b1-470f-402a-aeca-024e1db97b4d"></a>

## Safety Override

**Question:** Do I need to choose a Unit on the field for this Program to effect?

**Answer:** Yes.

**Status:** Unresolved source conflict; current-behavior tests only.

**Conflict:** The FAQ requires choosing one Unit when played. Current retail text applies to the next friendly Unit that loses a fight, without choosing one on play.

Sources: [card](https://cyberpunktcg.com/cards/safety-override); [rules](https://cyberpunktcg.com/comprehensive-rules).

**Official sources:**

- [Safety Override](https://cyberpunktcg.com/cards/safety-override) — `6b38d8b1-470f-402a-aeca-024e1db97b4d`

**Unit tests:**

- [packages/engine/src/cards/programs/safety-override.test.ts](../packages/engine/src/cards/programs/safety-override.test.ts) — is consumed after one friendly loss (single use)

<a id="faq-2507570b-3a3a-4c5e-bb34-451ebf248cc4"></a>

## Sandayu Oda: Hanako's Guardian

**Question:** Can this Unit attack ready Units with its effect?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Sandayu Oda: Hanako's Guardian](https://cyberpunktcg.com/cards/sandayu-oda-hanako-s-guardian) — `2507570b-3a3a-4c5e-bb34-451ebf248cc4`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — sandayu-oda-hanako-s-guardian FAQ 1

<a id="faq-66f0aa50-b90c-4bf0-9a02-ddfbec146375"></a>

## Sandevistan

**Question:** At the end of my turn do I have to ready this Unit or Legend even if I don't want to?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Sandevistan](https://cyberpunktcg.com/cards/sandevistan) — `66f0aa50-b90c-4bf0-9a02-ddfbec146375`

**Unit tests:**

- [packages/engine/src/cards/gear/sandevistan.test.ts](../packages/engine/src/cards/gear/sandevistan.test.ts) — readies the equipped Unit host at the end of its controller's turn
- [packages/engine/src/cards/gear/sandevistan.test.ts](../packages/engine/src/cards/gear/sandevistan.test.ts) — readies an equipped face-up Legend at the end of its controller's turn

<a id="faq-8b665720-9bdc-47ee-8930-9e8b6f6d41ef"></a>

## Sasha Yakovleva: Won't Let You Down

**Question:** If I attack the rival Gig area with Sasha but she has 0 power, does she steal a Gig?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Sasha Yakovleva: Won't Let You Down](https://cyberpunktcg.com/cards/sasha-yakovleva-won-t-let-you-down) — `8b665720-9bdc-47ee-8930-9e8b6f6d41ef`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — sasha-yakovleva-won-t-let-you-down FAQ 1

<a id="faq-f548eacd-802d-4101-b47c-36cf1155e1df"></a>

## Sasha Yakovleva: Won't Let You Down

**Question:** When I declare an attack with Sasha Yakovleva, can I use her [ATTACK] effect before I choose a target?

**Answer:** No. You must declare the attack target before revealing the card for her [ATTACK] effect.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Sasha Yakovleva: Won't Let You Down](https://cyberpunktcg.com/cards/sasha-yakovleva-won-t-let-you-down) — `f548eacd-802d-4101-b47c-36cf1155e1df`

**Unit tests:**

- [packages/engine/src/cards/legends/sasha-yakovleva-won-t-let-you-down.test.ts](../packages/engine/src/cards/legends/sasha-yakovleva-won-t-let-you-down.test.ts) — reveals and adds the top deck card when attacking, then gains power equal to its cost

<a id="faq-d9ad00b9-ab93-498f-a6fa-bab6d833d949"></a>

## Satori: Sword of Saburo

**Question:** If a friendly Unit equipped with Satori fights a Unit of the same power and they defeat each other, do I still draw 1?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Satori: Sword of Saburo](https://cyberpunktcg.com/cards/satori-sword-of-saburo) — `d9ad00b9-ab93-498f-a6fa-bab6d833d949`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — satori-sword-of-saburo FAQ 1

<a id="faq-8ba81187-0232-4320-b876-cae87a389ea5"></a>

## Satori: Sword of Saburo

**Question:** If my Unit equipped with Satori is attacked by a rival Unit and my Unit wins the fight, do I draw 1?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Satori: Sword of Saburo](https://cyberpunktcg.com/cards/satori-sword-of-saburo) — `8ba81187-0232-4320-b876-cae87a389ea5`

**Unit tests:**

- [packages/engine/src/cards/gear/satori-sword-of-saburo.test.ts](../packages/engine/src/cards/gear/satori-sword-of-saburo.test.ts) — draws 1 after the equipped defender wins a fight against a rival unit

<a id="faq-1f7a2ac5-b236-4b1c-9f4b-6e0b34441174"></a>

## Saul Bright: Stormrider

**Question:** Do other Units keep the +2 power while fighting and stealing too?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Saul Bright: Stormrider](https://cyberpunktcg.com/cards/saul-bright-stormrider) — `1f7a2ac5-b236-4b1c-9f4b-6e0b34441174`

**Unit tests:**

- [packages/engine/src/cards/units/saul-bright-stormrider.test.ts](../packages/engine/src/cards/units/saul-bright-stormrider.test.ts) — costs exactly 8 to play and enters with Lag

<a id="faq-461379b1-06dd-4753-91b2-1fdabc5024e0"></a>

## Screw: Lovelorn Fool

**Question:** If I have another Unit in my trash, do I have to add it to my hand  even if I don't want to?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Screw: Lovelorn Fool](https://cyberpunktcg.com/cards/screw-lovelorn-fool) — `461379b1-06dd-4753-91b2-1fdabc5024e0`

**Unit tests:**

- [packages/engine/src/cards/units/screw-lovelorn-fool.test.ts](../packages/engine/src/cards/units/screw-lovelorn-fool.test.ts) — offers exactly one other friendly Unit, excluding non-Units and rival trash

<a id="faq-0db0dbe4-a10b-458b-9b5c-9e478b71c615"></a>

## Screw: Lovelorn Fool

**Question:** Can Screw's effect add a different copy of Screw from my trash to my hand?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Screw: Lovelorn Fool](https://cyberpunktcg.com/cards/screw-lovelorn-fool) — `0db0dbe4-a10b-458b-9b5c-9e478b71c615`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — screw-lovelorn-fool FAQ 2

<a id="faq-0d03437c-9149-4ee7-8006-7bb8fd044608"></a>

## Shattered Memories

**Question:** If neither player has cards in hand when I play Shattered Memories, what happens?

**Answer:** Each player may still choose to draw 5, and the total number of discarded cards equals 0.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Shattered Memories](https://cyberpunktcg.com/cards/shattered-memories) — `0d03437c-9149-4ee7-8006-7bb8fd044608`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — shattered-memories FAQ 1

<a id="faq-9e6de445-d9cb-42cc-8e94-20c941da7cd9"></a>

## Sketchy Ripper

**Question:** When I search the top 3 cards of my deck, can I choose not to reveal any cards and bottom-deck them all even if there's a Gear among them?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Sketchy Ripper](https://cyberpunktcg.com/cards/sketchy-ripper) — `9e6de445-d9cb-42cc-8e94-20c941da7cd9`

**Unit tests:**

- [packages/engine/src/cards/units/sketchy-ripper.test.ts](../packages/engine/src/cards/units/sketchy-ripper.test.ts) — searches the top 3 on attack, reveals a Gear, and adds it to hand

<a id="faq-c41cdb0c-25d6-47ec-8c4c-5bb900a14b3e"></a>

## Swordwise Huscle

**Question:** If this Unit gains 5+ power while fighting or after I declare an attack or in a fight. Do I draw 1?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Swordwise Huscle](https://cyberpunktcg.com/cards/swordwise-huscle) — `c41cdb0c-25d6-47ec-8c4c-5bb900a14b3e`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — swordwise-huscle FAQ 1

<a id="faq-9f5fa425-bb0f-4f5f-908c-d56b67d14862"></a>

## Synapse Burnout

**Question:** Does this effect count friendly face-up Legends in the field area?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Synapse Burnout](https://cyberpunktcg.com/cards/synapse-burnout) — `9f5fa425-bb0f-4f5f-908c-d56b67d14862`

**Unit tests:**

- [packages/engine/src/cards/programs/synapse-burnout.test.ts](../packages/engine/src/cards/programs/synapse-burnout.test.ts) — counts a friendly Legend that used Go Solo and is now on the field

<a id="faq-2a2b9c9f-1076-493c-aa0f-24a274fbf85a"></a>

## Synapse Burnout

**Question:** If I use this on a friendly Legend in that field area that is now a also a Unit, does the Legend count itself for a +1?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Synapse Burnout](https://cyberpunktcg.com/cards/synapse-burnout) — `2a2b9c9f-1076-493c-aa0f-24a274fbf85a`

**Unit tests:**

- [packages/engine/src/cards/programs/synapse-burnout.test.ts](../packages/engine/src/cards/programs/synapse-burnout.test.ts) — lets a Go Solo Legend count itself when it receives the power bonus

<a id="faq-4e9fde1b-cbe0-4025-9a04-c61b13ecde02"></a>

## Take Control

**Question:** Does this apply to Units stealing Gigs through effects outside of attacking?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Take Control](https://cyberpunktcg.com/cards/take-control) — `4e9fde1b-cbe0-4025-9a04-c61b13ecde02`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — take-control FAQ 1

<a id="faq-b6be2042-7260-4c72-a7e0-0478c9cda9f9"></a>

## Take Control

**Question:** If I use Take Control on a rival Unit that would normally steal 1 Gig but is equipped with Gorilla Arms, how many Gigs does it actually steal?

**Answer:** 0 Gigs. Take Control's effect prevents the rival Unit from stealing a Gig, which means Gorilla Arms does not activate.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Take Control](https://cyberpunktcg.com/cards/take-control) — `b6be2042-7260-4c72-a7e0-0478c9cda9f9`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — take-control FAQ 2

<a id="faq-2110a5e9-a27c-42b5-b3e4-ca464f1d2dd0"></a>

## T-Bug: Amateur Philosopher

**Question:** Do I have to reveal the friendly face-down Legends I look at?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [T-Bug: Amateur Philosopher](https://cyberpunktcg.com/cards/t-bug-amateur-philosopher) — `2110a5e9-a27c-42b5-b3e4-ca464f1d2dd0`

**Unit tests:**

- [packages/engine/src/cards/units/t-bug-amateur-philosopher.test.ts](../packages/engine/src/cards/units/t-bug-amateur-philosopher.test.ts) — on defeat, may choose a friendly face-down Legend to Call for free (a/d)
- [packages/engine/src/cards/units/t-bug-amateur-philosopher.test.ts](../packages/engine/src/cards/units/t-bug-amateur-philosopher.test.ts) — if a Legend was already Called this turn, the free Call is skipped but lookAt still occurs (c)

<a id="faq-2a1bca2f-eaca-4418-baeb-96aab1b4e476"></a>

## T-Bug: Amateur Philosopher

**Question:** Do I have to look at my Legends even if I don't want to?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [T-Bug: Amateur Philosopher](https://cyberpunktcg.com/cards/t-bug-amateur-philosopher) — `2a1bca2f-eaca-4418-baeb-96aab1b4e476`

**Unit tests:**

- [packages/engine/src/cards/units/t-bug-amateur-philosopher.test.ts](../packages/engine/src/cards/units/t-bug-amateur-philosopher.test.ts) — if a Legend was already Called this turn, the free Call is skipped but lookAt still occurs (c)

<a id="faq-5ecbb33e-871b-40cd-bb66-6997a692e1a6"></a>

## Tetratronic Rippler

**Question:** When searching the top card of the deck is the card still currently counted as being in the deck?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Tetratronic Rippler](https://cyberpunktcg.com/cards/tetratronic-rippler) — `5ecbb33e-871b-40cd-bb66-6997a692e1a6`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — tetratronic-rippler FAQ 1

<a id="faq-8151aa53-358f-4d39-b3f6-58b165127b8e"></a>

## The Heist

**Question:** If I trash 1 or more Gears from this effect, do I have to add one to my hand even if I don't want to?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [The Heist](https://cyberpunktcg.com/cards/the-heist) — `8151aa53-358f-4d39-b3f6-58b165127b8e`

**Unit tests:**

- [packages/engine/src/cards/programs/the-heist.test.ts](../packages/engine/src/cards/programs/the-heist.test.ts) — offers only Gear cards from among the trashed cards as the selection

<a id="faq-4f2133a0-c3cc-4955-9815-6026ed16735d"></a>

## The Heist

**Question:** If I choose a Gear with cost equal to the value of a friendly Gig, do I have to play it for free, or can I just add it to my hand?

**Answer:** You may add it to your hand if you don't want to play it immediately. (But if you play it later, you must pay its cost normally.)

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [The Heist](https://cyberpunktcg.com/cards/the-heist) — `4f2133a0-c3cc-4955-9815-6026ed16735d`

**Unit tests:**

- [packages/engine/src/cards/programs/the-heist.test.ts](../packages/engine/src/cards/programs/the-heist.test.ts) — keeps the recovered Gear in hand when the free attachment is declined

<a id="faq-91373c98-159f-48e1-a231-045b5fe34631"></a>

## The Relic: Experimental Biochip

**Question:** When a Unit or Legend equipped with The Relic is defeated, do I move any equipped Gear on it to the bottom-deck, too?

**Answer:** No. The Unit/Legend moves to the trash first, so any Gear (including The Relic) remains in the trash when you bottom-deck the Unit/Legend.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [The Relic: Experimental Biochip](https://cyberpunktcg.com/cards/the-relic-experimental-biochip) — `91373c98-159f-48e1-a231-045b5fe34631`

**Unit tests:**

- [packages/engine/src/cards/gear/the-relic-experimental-biochip.test.ts](../packages/engine/src/cards/gear/the-relic-experimental-biochip.test.ts) — fires Defeated when its host is defeated, free-plays another Unit, and bottom-decks the host

<a id="faq-71b6fcd4-2bac-430b-8589-258ab1aae486"></a>

## Three Mouths, One Desire

**Question:** When searching the top 3 cards of my deck, are the cards still considered part of the deck?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Three Mouths, One Desire](https://cyberpunktcg.com/cards/three-mouths-one-desire) — `71b6fcd4-2bac-430b-8589-258ab1aae486`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — three-mouths-one-desire FAQ 1

<a id="faq-2a2fadce-85ca-49cd-a9a5-76a77e5cf615"></a>

## Towerfall

**Question:** IfI have the same amount of Street Cred as a Rival, do I get both effects?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Towerfall](https://cyberpunktcg.com/cards/towerfall) — `2a2fadce-85ca-49cd-a9a5-76a77e5cf615`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — towerfall FAQ 1

<a id="faq-b7e62adb-5a98-482e-8ec7-39fc3d176aa1"></a>

## Trauma Team Operatives

**Question:** Does Trauma Team Operatives' effect change the cost of the card?

**Answer:** No, only the amount you pay.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Trauma Team Operatives](https://cyberpunktcg.com/cards/trauma-team-operatives) — `b7e62adb-5a98-482e-8ec7-39fc3d176aa1`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — trauma-team-operatives FAQ 1

<a id="faq-cc187a60-e949-4ff2-a8d2-38adf6ff32e9"></a>

## Trust No One

**Question:** Does the Gig I decrease with the effect have to be the min Gig I use for the draw 1 effect condition?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Trust No One](https://cyberpunktcg.com/cards/trust-no-one) — `cc187a60-e949-4ff2-a8d2-38adf6ff32e9`

**Unit tests:**

- [packages/engine/src/cards/programs/trust-no-one.test.ts](../packages/engine/src/cards/programs/trust-no-one.test.ts) — may decline the Gig decrease and still draws for an existing friendly min Gig

<a id="faq-0c12a0d1-b75a-4269-b1b5-68d5e80acf4b"></a>

## Tyger's Whisper

**Question:** If I don't Call a Legend for free when I play this card, can I Call a Legend for free later instead?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Tyger's Whisper](https://cyberpunktcg.com/cards/tyger-s-whisper) — `0c12a0d1-b75a-4269-b1b5-68d5e80acf4b`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — tyger-s-whisper FAQ 1

<a id="faq-1dcc06cf-2c53-4507-88d8-f5f002e2d656"></a>

## Tyger's Whisper

**Question:** If I manage to play Tyger's Whisper on my Rival's turn, can I Call a Legend for free through its [PLAY] effect?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Tyger's Whisper](https://cyberpunktcg.com/cards/tyger-s-whisper) — `1dcc06cf-2c53-4507-88d8-f5f002e2d656`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — tyger-s-whisper FAQ 2

<a id="faq-92d69f9f-e14d-491e-8589-7f79d56b5320"></a>

## Tyger's Whisper

**Question:** If I already Called a Legend this turn, can I call another Legend with Tyger's Whisper's [PLAY] effect?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Tyger's Whisper](https://cyberpunktcg.com/cards/tyger-s-whisper) — `92d69f9f-e14d-491e-8589-7f79d56b5320`

**Unit tests:**

- [packages/engine/src/cards/units/tyger-s-whisper.test.ts](../packages/engine/src/cards/units/tyger-s-whisper.test.ts) — does not offer another Call after a Legend was already Called this turn

<a id="faq-51314e7a-dea5-4d38-aeeb-52f58dc2a55a"></a>

## Unlikely Bond

**Question:** If I play this when there are no rival Units do I still have to bottom deck a friendly Unit?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Unlikely Bond](https://cyberpunktcg.com/cards/unlikely-bond) — `51314e7a-dea5-4d38-aeeb-52f58dc2a55a`

**Unit tests:**

- [packages/engine/src/cards/programs/unlikely-bond.test.ts](../packages/engine/src/cards/programs/unlikely-bond.test.ts) — still bottom-decks the ready friendly Unit when no spent rival Unit exists

<a id="faq-fbe43ae0-a606-4391-8183-342a43213365"></a>

## Valentino Guerrera

**Question:** If Valentino Guerrera attacks a ready rival Unit with [BLOCKER], can the attacked Unit use its own [BLOCKER] effect?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Valentino Guerrera](https://cyberpunktcg.com/cards/valentino-guerrera) — `fbe43ae0-a606-4391-8183-342a43213365`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — valentino-guerrera FAQ 1

<a id="faq-c78f53c3-489c-4a0e-8d73-9ab7a8431419"></a>

## Valentino Street Racer

**Question:** If I give a friendly Unit [ADRENALINE] on my Rival's turn, can it make an attack?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Valentino Street Racer](https://cyberpunktcg.com/cards/valentino-street-racer) — `c78f53c3-489c-4a0e-8d73-9ab7a8431419`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — valentino-street-racer FAQ 1

<a id="faq-22eadcab-b88a-45cd-9e07-ef51084da8cf"></a>

## V: Corporate Exile

**Question:** Can I play this Legend to the Field area without using the [GO SOLO] keyword?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [V: Corporate Exile](https://cyberpunktcg.com/cards/v-corporate-exile) — `22eadcab-b88a-45cd-9e07-ef51084da8cf`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — v-corporate-exile FAQ 1

<a id="faq-80577b2c-f335-442e-9476-b2e38d0d03dd"></a>

## Viktor Vektor: Drop Your Illusions

**Question:** If I have a way to play a Gear on my rival's turn, do I still get the  -3 €$ discount?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Viktor Vektor: Drop Your Illusions](https://cyberpunktcg.com/cards/viktor-vektor-drop-your-illusions) — `80577b2c-f335-442e-9476-b2e38d0d03dd`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — viktor-vektor-drop-your-illusions FAQ 1

<a id="faq-449ecd14-296c-4431-b445-261265f89c1d"></a>

## Viktor Vektor: Drop Your Illusions

**Question:** When I play my first Cyberware each turn, do I have to pay the reduced amount even if I would prefer to pay full price?

**Answer:** Yes, the discount is mandatory.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Viktor Vektor: Drop Your Illusions](https://cyberpunktcg.com/cards/viktor-vektor-drop-your-illusions) — `449ecd14-296c-4431-b445-261265f89c1d`

**Unit tests:**

- [packages/engine/src/cards/units/viktor-vektor-drop-your-illusions.test.ts](../packages/engine/src/cards/units/viktor-vektor-drop-your-illusions.test.ts) — reduces the first Cyberware Gear played each turn by 3 €$, minimum 1

<a id="faq-03d7a874-2d53-4fc9-9f7d-905cebcedcc7"></a>

## Viktor Vektor: Sit Down and Relax

**Question:** When I search the top 5 cards of my deck, can I choose not to reveal any cards and bottom-deck them all even if there's a viable Gear among them?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Viktor Vektor: Sit Down and Relax](https://cyberpunktcg.com/cards/viktor-vektor-sit-down-and-relax) — `03d7a874-2d53-4fc9-9f7d-905cebcedcc7`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — viktor-vektor-sit-down-and-relax FAQ 1

<a id="faq-602f90aa-bda8-44dc-97b6-f3e23e59918f"></a>

## Viktor Vektor: You Might Feel a Little Pinch

**Question:** Can I choose not to use Viktor Vektor's [PLAY] effect?

**Answer:** No, the effect is mandatory. If you can do it, you must.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Viktor Vektor: You Might Feel a Little Pinch](https://cyberpunktcg.com/cards/viktor-vektor-you-might-feel-a-little-pinch) — `602f90aa-bda8-44dc-97b6-f3e23e59918f`

**Unit tests:**

- [packages/engine/src/cards/units/viktor-vektor-you-might-feel-a-little-pinch.test.ts](../packages/engine/src/cards/units/viktor-vektor-you-might-feel-a-little-pinch.test.ts) — equips a cheap Cyberware Gear from trash to another friendly Unit

<a id="faq-9eee394b-2dc7-4750-a5ef-5cb0fc988ee9"></a>

## V: Roamer of the Badlands

**Question:** If V steals multiple Gigs in one attack, can V increase each stolen Gig?

**Answer:** Yes, as this card specifies 'A Gig' so each Gig that gets stolen may be increased by the effect.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [V: Roamer of the Badlands](https://cyberpunktcg.com/cards/v-roamer-of-the-badlands) — `9eee394b-2dc7-4750-a5ef-5cb0fc988ee9`

**Unit tests:**

- [packages/engine/src/cards/units/v-roamer-of-the-badlands.test.ts](../packages/engine/src/cards/units/v-roamer-of-the-badlands.test.ts) — pends one increase for each Gig this Unit steals at the same time

<a id="faq-1dd664ff-e61f-4b15-8e96-45f0dd31a13a"></a>

## V: Streetkid

**Question:** When I trash 3, do I need to add a BRAINDANCE Program from the cards I trashed?

**Answer:** No. You can add any BRAINDANCE Program from your trash.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [V: Streetkid](https://cyberpunktcg.com/cards/v-streetkid) — `1dd664ff-e61f-4b15-8e96-45f0dd31a13a`

**Unit tests:**

- [packages/engine/src/cards/legends/v-streetkid.test.ts](../packages/engine/src/cards/legends/v-streetkid.test.ts) — trashes 3 on call and returns a Braindance Program from trash to hand

<a id="faq-ba7d3b2f-96f6-4570-8e03-b7f514512d9a"></a>

## V: Streetkid

**Question:** If there are fewer than 3 cards in my deck, can I still call V?

**Answer:** Yes. Trash as many cards as possible, instead.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [V: Streetkid](https://cyberpunktcg.com/cards/v-streetkid) — `ba7d3b2f-96f6-4570-8e03-b7f514512d9a`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — v-streetkid FAQ 2

<a id="faq-15ebfd43-82fa-4e07-a8e5-2432562e32ef"></a>

## V: Streetkid

**Question:** If V’s [CALL] effect trashes multiple BRAINDANCE Programs,  can I choose more than 1?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [V: Streetkid](https://cyberpunktcg.com/cards/v-streetkid) — `15ebfd43-82fa-4e07-a8e5-2432562e32ef`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — v-streetkid FAQ 3

<a id="faq-8bbbcb97-0cb0-41b9-a674-7647d6085163"></a>

## Wakako Okada: Peace and Harmony

**Question:** Can I use this card's [Spend Icon:] effect on an already min Gig?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Wakako Okada: Peace and Harmony](https://cyberpunktcg.com/cards/wakako-okada-peace-and-harmony) — `8bbbcb97-0cb0-41b9-a674-7647d6085163`

**Unit tests:**

- [packages/engine/src/cards/legends/wakako-okada-peace-and-harmony.test.ts](../packages/engine/src/cards/legends/wakako-okada-peace-and-harmony.test.ts) — may decrease the chosen Gig by zero

<a id="faq-972b7a64-cc96-4e31-8e7f-5718d319914a"></a>

## We Gotta Live Together / Zetatech Berserk

**Question:** Does this card's effect change the cost of the card?

**Answer:** No, only the amount you pay.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [We Gotta Live Together](https://cyberpunktcg.com/cards/we-gotta-live-together) — `972b7a64-cc96-4e31-8e7f-5718d319914a`
- [Zetatech Berserk](https://cyberpunktcg.com/cards/zetatech-berserk) — `fc46987c-3869-4d97-b73b-686e1e08120e`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — we-gotta-live-together FAQ 1 (We Gotta Live Together)
- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — zetatech-berserk FAQ 1 (Zetatech Berserk)

<a id="faq-abf24590-be16-41a4-9314-05cf9964a483"></a>

## We Gotta Live Together

**Question:** Can I choose to play this card for it's full cost if my Rival has 2 or more Gigs?

**Answer:** No, the discount is mandatory.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [We Gotta Live Together](https://cyberpunktcg.com/cards/we-gotta-live-together) — `abf24590-be16-41a4-9314-05cf9964a483`

**Unit tests:**

- [packages/engine/src/cards/programs/we-gotta-live-together.test.ts](../packages/engine/src/cards/programs/we-gotta-live-together.test.ts) — costs 3 €$ when a Rival controls at least 2 more Gigs

<a id="faq-6a19fd88-c002-4d46-914c-dfe3b13fd27b"></a>

## Westbrook Netrunner

**Question:** If my Rival plays a Legend to the field after I play Westbrook Netrunner, can the Legend steal a Gig with value less than their power?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Westbrook Netrunner](https://cyberpunktcg.com/cards/westbrook-netrunner) — `6a19fd88-c002-4d46-914c-dfe3b13fd27b`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — westbrook-netrunner FAQ 1

<a id="faq-5b17e2c5-e679-4dad-a131-815a6618dd48"></a>

## Westbrook Netrunner

**Question:** If Westbrook Netrunner is defeated before my next turn, is its effect still active?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Westbrook Netrunner](https://cyberpunktcg.com/cards/westbrook-netrunner) — `5b17e2c5-e679-4dad-a131-815a6618dd48`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — westbrook-netrunner FAQ 2

<a id="faq-d0d1a60f-cb84-4dbf-b131-c2ee9f7bae22"></a>

## Wild in the Streets

**Question:** Can I play this card if there are no spent Units on the field?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Wild in the Streets](https://cyberpunktcg.com/cards/wild-in-the-streets) — `d0d1a60f-cb84-4dbf-b131-c2ee9f7bae22`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — wild-in-the-streets FAQ 1

<a id="faq-192c3c09-2160-4818-840a-ae6b1d9cf27f"></a>

## Wild in the Streets

**Question:** Can I choose a friendly Unit with this effect?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Wild in the Streets](https://cyberpunktcg.com/cards/wild-in-the-streets) — `192c3c09-2160-4818-840a-ae6b1d9cf27f`

**Unit tests:**

- [packages/engine/src/cards/programs/wild-in-the-streets.test.ts](../packages/engine/src/cards/programs/wild-in-the-streets.test.ts) — can target either player's spent Unit but excludes every ready Unit

<a id="faq-7ea036d0-1f07-4425-9a47-198eec19fef1"></a>

## Wild in the Streets

**Question:** If I play this Program and there is only a spent friendly Unit in the Field areas. Will I have to choose my Unit?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Wild in the Streets](https://cyberpunktcg.com/cards/wild-in-the-streets) — `7ea036d0-1f07-4425-9a47-198eec19fef1`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — wild-in-the-streets FAQ 3

<a id="faq-7ec76a28-572e-45e7-81b2-53c8f38b8ce3"></a>

## Wraith Marauders

**Question:** When this card steals a Gig do I have to ready another friendly Unit even if I don't want to?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Wraith Marauders](https://cyberpunktcg.com/cards/wraith-marauders) — `7ec76a28-572e-45e7-81b2-53c8f38b8ce3`

**Unit tests:**

- [packages/engine/src/cards/units/wraith-marauders.test.ts](../packages/engine/src/cards/units/wraith-marauders.test.ts) — readies another friendly spent unit whose power equals the stolen Gig value

<a id="faq-61ad63b3-47d9-48ee-a3f6-4c2842b11c66"></a>

## Yorinobu Arasaka: Embracing Destruction

**Question:** If I've already attacked with an ARASAKA Unit this turn before Yorinobu Arasaka is face-up, then flip Yorinobu, can I trigger Yorinobu's effect that turn by attacking with another ARASAKA Unit?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Yorinobu Arasaka: Embracing Destruction](https://cyberpunktcg.com/cards/yorinobu-arasaka-embracing-destruction) — `61ad63b3-47d9-48ee-a3f6-4c2842b11c66`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — yorinobu-arasaka-embracing-destruction FAQ 1

<a id="faq-16ff9b92-68eb-4215-9e05-eaa8bcd9afa4"></a>

## Yorinobu Arasaka: Steel Dragon

**Question:** If the Unit played by Yorinobu has [ADRENALINE], can it attack the rival Gig area this turn?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Yorinobu Arasaka: Steel Dragon](https://cyberpunktcg.com/cards/yorinobu-arasaka-steel-dragon) — `16ff9b92-68eb-4215-9e05-eaa8bcd9afa4`

**Unit tests:**

- [packages/engine/src/cards/units/yorinobu-arasaka-steel-dragon.test.ts](../packages/engine/src/cards/units/yorinobu-arasaka-steel-dragon.test.ts) — lets the free Unit attack the rival Gig area when it gains Adrenaline

<a id="faq-6e649617-ec75-42db-a1b0-a3c2b1ebee6c"></a>

## Yorinobu Arasaka: Steel Dragon

**Question:** Does Yorinobu count itself for “the first time an ARASAKA Unit is defeated each turn”?

**Answer:** Yes.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Yorinobu Arasaka: Steel Dragon](https://cyberpunktcg.com/cards/yorinobu-arasaka-steel-dragon) — `6e649617-ec75-42db-a1b0-a3c2b1ebee6c`

**Unit tests:**

- [packages/engine/src/cards/units/yorinobu-arasaka-steel-dragon.test.ts](../packages/engine/src/cards/units/yorinobu-arasaka-steel-dragon.test.ts) — draws exactly one card when he is the first Arasaka Unit defeated in combat
- [packages/engine/src/cards/units/yorinobu-arasaka-steel-dragon.test.ts](../packages/engine/src/cards/units/yorinobu-arasaka-steel-dragon.test.ts) — draws when he is the first Arasaka Unit defeated by an effect

<a id="faq-d2074e1b-4efa-4cfb-bc7a-0ca063fcf804"></a>

## Yorinobu Arasaka: Steel Dragon

**Question:** If a friendly Arasaka Unit was defeated previusly during my turn and then play Yorinobu Arasaka. If another friendly Arasaka Unit is then defeated this turn. Will I draw 1 off Yorinobu's effect?

**Answer:** No.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Yorinobu Arasaka: Steel Dragon](https://cyberpunktcg.com/cards/yorinobu-arasaka-steel-dragon) — `d2074e1b-4efa-4cfb-bc7a-0ca063fcf804`

**Unit tests:**

- [packages/engine/src/cards/units/yorinobu-arasaka-steel-dragon.test.ts](../packages/engine/src/cards/units/yorinobu-arasaka-steel-dragon.test.ts) — does not draw if an Arasaka Unit was defeated before Yorinobu entered play this turn

<a id="faq-a4b85193-1647-4001-a076-846f54d54481"></a>

## Zetatech Faceplate

**Question:** When I spend a Unit equipped with Zetatech Faceplate to declare an attack, do I get Zetatech Faceplate's effect before or after I resolve the attack?

**Answer:** Before. Adjust the Gig for Zetatech Faceplate's effect before moving on to your Rival's react step.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Zetatech Faceplate](https://cyberpunktcg.com/cards/zetatech-faceplate) — `a4b85193-1647-4001-a076-846f54d54481`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — zetatech-faceplate FAQ 1

<a id="faq-9f87591e-514c-44ee-bba4-515fc488fb77"></a>

## Zetatech Faceplate

**Question:** If I spend a Unit equipped with Zetatech Faceplate to declare an attack, and the Unit or Legend has an [ATTACK] effect, do I get Zetatech Faceplacte's effect before or after the [ATTACK] effect?

**Answer:** You can choose the order you resolve these effects.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Zetatech Faceplate](https://cyberpunktcg.com/cards/zetatech-faceplate) — `9f87591e-514c-44ee-bba4-515fc488fb77`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — zetatech-faceplate FAQ 2 (spend first)
- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — zetatech-faceplate FAQ 2 (attack first)

<a id="faq-9b281489-5883-47ca-80a9-fa6707655b12"></a>

## Zetatech Faceplate

**Question:** If I spend a Unit or Legend equipped with Zetatech Faceplate to activate the Unit/Legend's [Spend Icon:] effect, do I get Zetatech Faceplate's effect before or after the activated effect?

**Answer:** After. Resolve the activated [Spend Icon:] effect first.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Zetatech Faceplate](https://cyberpunktcg.com/cards/zetatech-faceplate) — `9b281489-5883-47ca-80a9-fa6707655b12`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — zetatech-faceplate FAQ 3

<a id="faq-62c60c04-72ec-4231-9ea7-f5b8048eb4d8"></a>

## Zetatech Faceplate

**Question:** If I spend a Legend equipped with Zetatech Faceplate to pay a card's cost, do I get Zetatech Faceplate's effect before or after I play the card?

**Answer:** After. Play the card first, then adjust the Gig.

**Status:** Behavior tests mapped; CI requires them to pass.

**Official sources:**

- [Zetatech Faceplate](https://cyberpunktcg.com/cards/zetatech-faceplate) — `62c60c04-72ec-4231-9ea7-f5b8048eb4d8`

**Unit tests:**

- [packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts](../packages/engine/tests/comprehensive-rules/card-faq-regressions.test.ts) — zetatech-faceplate FAQ 4
