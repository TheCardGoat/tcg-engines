/**
 * Tournament **text** deck fixtures for Flesh and Blood bots and deck-QA.
 *
 * Format mirrors FaBrary exports and platform `bot-deck-fixtures`:
 * newline-separated `Nx Name` lines. Pitch-colored main-deck cards use
 * `(red)` / `(yellow)` / `(blue)`. Arena cards (equipment, weapons, items)
 * are listed without pitch. The combined `cards` string is hero + arena +
 * main deck so consumers can parse a single blob.
 *
 * These fixtures are the catalog text sources of truth. The unified lookup
 * lives in `deck-catalog.ts`.
 */

import {
  createFabTournamentTextFixture,
  type FabDeckFormat,
  type FabDeckTextFixture,
} from "./deck-text-fixture-factory.ts";
import { FAB_CC_COVERAGE_DECK_FIXTURES } from "./deck-text-fixtures-cc-coverage.ts";

export type { FabDeckFormat, FabDeckTextFixture };

export const DEFAULT_PLAYER_DECK_ID = "cc-edinburgh-1st-gravy-bones";
export const DEFAULT_BOT_DECK_ID = "cc-guilherme-coutinho-rhinar";

const fixture = createFabTournamentTextFixture;

// ── Classic Constructed (Calling: Edinburgh) ──────────────────────────────────

const CC_EDINBURGH_1ST_GRAVY = fixture({
  id: "cc-edinburgh-1st-gravy-bones",
  name: "Calling: Edinburgh 1st — Gravy Bones",
  description:
    "Classic Constructed Gravy Bones, Shipwrecked Looter — Calling Edinburgh 1st (FaBrary).",
  format: "classic-constructed",
  hero: "Gravy Bones, Shipwrecked Looter",
  heroClass: "pirate",
  event: "Calling: Edinburgh",
  placement: 1,
  source: "https://fabrary.net/decks/01KYF5FGZCG7QH0R4P3W5VQ133",
  arena: `
1x Balance of Justice
1x Base of the Mountain
1x Carrion Crown
1x Compass of Sunken Depths
1x Crown of Providence
1x Dead Threads
1x Gold-Baited Hook
1x Mage Master Boots
1x Nullrune Hood
1x Quickdodge Flexors
1x Scuttle Toes
`,
  mainDeck: `
3x Blood in the Water (red)
2x Cheating Scoundrel (red)
3x Conqueror of the High Seas (red)
1x Fiddler's Green (red)
1x Saltwater Swell (red)
2x Swiftwater Sloop (red)
3x Anka, Drag Under (yellow)
3x Chum, Friendly First Mate (yellow)
2x Loan Shark (yellow)
3x Prismatic Leyline (yellow)
1x Riches of Trōpal-Dhani (yellow)
3x Riggermortis (yellow)
3x Sawbones, Dock Hand (yellow)
3x Scooba, Salty Sea Dog (yellow)
1x Wailer Humperdinck (yellow)
3x Avast Ye! (blue)
1x Back Alley Breakline (blue)
3x Call to the Grave (blue)
1x Eye of Ophidia (blue)
2x Fearless Confrontation (blue)
3x Golden Tipple (blue)
3x Jittery Bones (blue)
1x Last Ditch Effort (blue)
3x Loot the Hold (blue)
3x Murderous Rabble (blue)
3x Portside Exchange (blue)
3x Saltwater Swell (blue)
3x Sunken Treasure (blue)
3x Tip the Barkeep (blue)
`,
});

const CC_EDINBURGH_3RD_TUFFNUT = fixture({
  id: "cc-edinburgh-3rd-tuffnut",
  name: "Calling: Edinburgh 3rd — Tuffnut",
  description: "Classic Constructed Tuffnut, Bumbling Hulkster — Calling Edinburgh 3rd (FaBrary).",
  format: "classic-constructed",
  hero: "Tuffnut, Bumbling Hulkster",
  heroClass: "brute",
  event: "Calling: Edinburgh",
  placement: 3,
  source: "https://fabrary.net/decks/01KYF5FH01JYM88AGHX07GDKKY",
  arena: `
1x Comeback Kicks
1x Fyendal's Spring Tunic
1x Gauntlets of Tyrannical Rex
1x Nullrune Hood
1x Predatory Plating
1x Rok
1x Scabskin Leathers
1x Scowling Flesh Bag
1x Skera Strapping
1x Skullhorn
`,
  mainDeck: `
3x Buckwild (red)
3x Jaws of Victory (red)
2x Battlefront Bastion (yellow)
3x Buckwild (yellow)
3x Crowd Goes Wild (yellow)
3x Dig In (yellow)
3x Good Natured Brutality (yellow)
3x No Hero Stands Alone (yellow)
3x Rip Off the Top (yellow)
1x Send Packing (yellow)
3x Song of Sinew (yellow)
3x Thick Hide Hunter (yellow)
3x Tough Smashup (yellow)
3x Unexpected Backhand (yellow)
3x Vigorous Smashup (yellow)
3x Battlefront Bastion (blue)
2x Buckwild (blue)
3x Hulk Up (blue)
2x Pilfer the Tomb (blue)
3x Rockyard Rodeo (blue)
3x Tough as a Rok (blue)
3x Tough Smashup (blue)
3x Vigorous Smashup (blue)
3x Wind Up the Crowd (blue)
3x Wrecker Romp (blue)
`,
});

const CC_EDINBURGH_5TH_VYNNSET = fixture({
  id: "cc-edinburgh-5th-vynnset",
  name: "Calling: Edinburgh 5th — Vynnset",
  description: "Classic Constructed Vynnset, Iron Maiden — Calling Edinburgh 5th (FaBrary).",
  format: "classic-constructed",
  hero: "Vynnset, Iron Maiden",
  heroClass: "runeblade",
  event: "Calling: Edinburgh",
  placement: 5,
  source: "https://fabrary.net/decks/01KYF5FGZMHFWR7649EKSC99RB",
  arena: `
1x Dyadic Carapace
1x Ebon Fold
1x Face Purgatory
1x Flail of Agony
1x Fyendal's Spring Tunic
1x Grimoire of Fellingsong
1x Grimoire of the Haunt
1x Spellbound Creepers
1x Vexing Quillhand
`,
  mainDeck: `
3x Beseech the Demigon (red)
3x Cull (red)
3x Deadwood Dirge (red)
3x Deathly Delight (red)
3x Deathly Wail (red)
3x Eloquent Eulogy (red)
2x Envelop in Darkness (red)
3x Fasting Carcass (red)
2x Funeral Moon (red)
3x Malefic Incantation (red)
3x Reduce to Runechant (red)
2x Revel in Runeblood (red)
2x Runeblood Incantation (red)
3x Shadow Puppetry (red)
3x Sonata Galaxia (red)
3x Tear Through the Portal (red)
3x Widespread Ruin (red)
3x Deathly Wail (yellow)
3x Malefic Incantation (yellow)
3x Succumb to Temptation (yellow)
3x Widespread Destruction (yellow)
3x Deathly Wail (blue)
3x Deep Recesses of Existence (blue)
2x Fasting Carcass (blue)
1x Oblivion (blue)
3x Widespread Annihilation (blue)
`,
});

const CC_EDINBURGH_5TH_JARL = fixture({
  id: "cc-edinburgh-5th-jarl",
  name: "Calling: Edinburgh 5th — Jarl Vetreiði",
  description: "Classic Constructed Jarl Vetreiði — Calling Edinburgh 5th (FaBrary).",
  format: "classic-constructed",
  hero: "Jarl Vetreiði",
  heroClass: "guardian",
  event: "Calling: Edinburgh",
  placement: 5,
  source: "https://fabrary.net/decks/01KYF5FGXFDJ1GG8VQASYZ39YB",
  arena: `
1x Balance of Justice
1x Barkskin of the Millennium Tree
1x Boots of Omnis Ward
1x Crown of Everbloom
1x Fyendal's Spring Tunic
1x Gauntlets of the Boreal Domain
1x Heart of Ice
1x Nullrune Gloves
1x Rampart of the Ram's Head
1x Sledge of Anvilheim
1x Stalagmite, Bastion of Isenloft
1x Titan's Fist
`,
  mainDeck: `
3x Boulder Drop (red)
1x Colors of Aria (red)
3x Command and Conquer (red)
3x Felling of the Crown (red)
3x Fiddler's Green (red)
3x Mangle (red)
3x Oaken Old (red)
3x Rootbound Carapace (red)
3x Shelter from the Storm (red)
3x Sigil of Solace (red)
3x Sink Below (red)
2x Staunch Response (red)
3x Plow Under (yellow)
3x Autumn's Touch (blue)
1x Blizzard (blue)
3x Channel Iceloch Glaze (blue)
3x Channel Lake Frigid (blue)
3x Crumble to Eternity (blue)
3x Everbloom // Life (blue)
3x Frozen to Death (blue)
3x Fruits of the Forest (blue)
3x Imposing Visage (blue)
1x Pulse of Isenloft (blue)
3x Ripple Away (blue)
3x Tear Asunder (blue)
`,
});

const CC_EDINBURGH_5TH_FANG = fixture({
  id: "cc-edinburgh-5th-fang",
  name: "Calling: Edinburgh 5th — Fang",
  description: "Classic Constructed Fang, Dracai of Blades — Calling Edinburgh 5th (FaBrary).",
  format: "classic-constructed",
  hero: "Fang, Dracai of Blades",
  heroClass: "ninja",
  event: "Calling: Edinburgh",
  placement: 5,
  source: "https://fabrary.net/decks/01KYF5FGY5ZPKQWCVGQ7J2WDNY",
  arena: `
1x Braveforge Bracers
1x Crown of Providence
1x Decimator Great Axe
1x Fyendal's Spring Tunic
1x Kabuto of Imperial Authority
1x Nullrune Boots
1x Nullrune Gloves
1x Nullrune Hood
1x Pillar of Unity
`,
  mainDeck: `
3x Cleave (red)
3x Enlightened Strike (red)
3x Fate Foreseen (red)
3x Felling Swing (red)
3x Oasis Respite (red)
3x Oath of Loyalty (red)
3x Sharpen Steel (red)
3x Shelter from the Storm (red)
3x Sigil of Solace (red)
3x Sink Below (red)
3x Steelblade Shunt (red)
3x Blunten (yellow)
3x Steelblade Shunt (yellow)
3x Brothers in Arms (blue)
3x Fatal Engagement (blue)
3x Felling Swing (blue)
1x Heart of Fyendal (blue)
3x Last Ditch Effort (blue)
1x Overcrowded (blue)
3x Overpower (blue)
3x Provoke (blue)
3x Ripple Away (blue)
3x Sirens of Safe Harbor (blue)
3x Steelblade Shunt (blue)
3x Warmonger's Diplomacy (blue)
`,
});

// ── Silver Age (Sunday Showdown: Edinburgh) ───────────────────────────────────

const SA_EDINBURGH_1ST_BRIAR = fixture({
  id: "sa-edinburgh-1st-briar",
  name: "Sunday Showdown: Edinburgh 1st — Briar",
  description: "Silver Age Briar — Sunday Showdown Edinburgh 1st (FaBrary).",
  format: "silver-age",
  hero: "Briar",
  heroClass: "runeblade",
  event: "Sunday Showdown: Edinburgh",
  placement: 1,
  source: "https://fabrary.net/decks/01KYF7WYBBTCP7BFN0TXMNT3MG",
  arena: `
1x Blade Beckoner Boots
1x Blade Beckoner Gauntlets
1x Blade Beckoner Helm
1x Blade Beckoner Plating
1x Blitz Kicks
1x Bloodied Oval
1x Garland of Spring
1x Helm of Might and Magic
1x Star Fall
1x Swiftstrike Bracers
`,
  mainDeck: `
2x Arcane Polarity (red)
2x Arcane Seeds // Life (red)
2x Arcanic Shockwave (red)
2x Burn Up // Shock (red)
2x Entwine Lightning (red)
2x Flittering Charge (red)
1x Harness Lightning (red)
2x Lightning Press (red)
2x Lightning Surge (red)
2x Nimblism (red)
2x Path of Same Ends (red)
2x Quick Succession (red)
2x Ravenous Rabble (red)
2x Rush of Power (red)
2x Scar for a Scar (red)
2x Second Strike (red)
2x Sigil of Suffering (red)
2x Sizzle (red)
2x Snatch (red)
2x Sprout Strength (red)
2x Static Shock (red)
2x Weave Lightning (red)
1x Quick Succession (yellow)
1x Sigil of Suffering (yellow)
`,
});

const SA_EDINBURGH_2ND_OSCILIO = fixture({
  id: "sa-edinburgh-2nd-oscilio",
  name: "Sunday Showdown: Edinburgh 2nd — Oscilio",
  description: "Silver Age Oscilio — Sunday Showdown Edinburgh 2nd (FaBrary).",
  format: "silver-age",
  hero: "Oscilio",
  heroClass: "wizard",
  event: "Sunday Showdown: Edinburgh",
  placement: 2,
  source: "https://fabrary.net/decks/01KYF7WYD9RQCJSJK6Z3W54RVX",
  arena: `
1x Blossom of Spring
1x Constella Waves
1x Twinkle Toes
1x Voltic Vanguard
1x Volzar, Meteor Storm
`,
  mainDeck: `
1x Aethersling (red)
2x Arcane Polarity (red)
1x Battlefront Bastion (red)
2x Chromatic Refinement (red)
2x Cloud Cover (red)
2x Comet Collision (red)
2x Core Reaction (red)
2x Cosmic Flare (red)
1x Electrolyze (red)
2x Electrostatic Discharge (red)
2x Entwine Lightning (red)
2x Flash Bolt (red)
2x Flittering Charge (red)
1x Flittering Spike (red)
1x Fyendal's Fighting Spirit (red)
2x Lightning Press (red)
2x Lightning Surge (red)
2x Meteoric Impact (red)
2x Ravenous Rabble (red)
2x Scar for a Scar (red)
2x Second Strike (red)
2x Snapback (red)
1x Snatch (red)
2x Stormshard (red)
2x Strike Twice (red)
2x Constella Contemplation (yellow)
2x Constella Flowslide (yellow)
2x Constella Uplift (yellow)
`,
});

const SA_EDINBURGH_5TH_BLAZE = fixture({
  id: "sa-edinburgh-5th-blaze",
  name: "Sunday Showdown: Edinburgh 5th — Blaze",
  description: "Silver Age Blaze, Firemind — Sunday Showdown Edinburgh 5th (FaBrary).",
  format: "silver-age",
  hero: "Blaze, Firemind",
  heroClass: "wizard",
  event: "Sunday Showdown: Edinburgh",
  placement: 5,
  source: "https://fabrary.net/decks/01KYF7WYBKRT5ZB61V3HAN3ZST",
  arena: `
1x Aetherstorm Wellingtons
1x Blade Beckoner Boots
1x Crucible of Aetherweave
1x Mage Master Boots
1x Seeker's Mitts
1x Spellfire Cloak
1x Talismanic Lens
1x Unflinching Foothold
1x Unyielding Grip
`,
  mainDeck: `
2x Absorb in Aether (red)
2x Aether Spindle (red)
1x Aethersling (red)
2x Arcane Polarity (red)
2x Cindering Foresight (red)
1x Dampen (red)
2x Emeritus Scolding (red)
2x Fyendal's Fighting Spirit (red)
2x Nucleus Aetherbolt (red)
2x Ravenous Rabble (red)
2x Scar for a Scar (red)
2x Snapback (red)
2x Turn to Mindfire (red)
2x Voltic Bolt (red)
1x Whisper of the Oracle (red)
2x Cindering Foresight (yellow)
2x Emeritus Scolding (yellow)
2x Aether Spindle (blue)
2x Arcane Twining (blue)
2x Emeritus Scolding (blue)
1x Foreboding Bolt (blue)
2x Painful Premonition (blue)
2x Photon Splicing (blue)
2x Voltic Bolt (blue)
2x Whisper of the Oracle (blue)
`,
});

const SA_EDINBURGH_5TH_FAI = fixture({
  id: "sa-edinburgh-5th-fai",
  name: "Sunday Showdown: Edinburgh 5th — Fai",
  description: "Silver Age Fai — Sunday Showdown Edinburgh 5th (FaBrary).",
  format: "silver-age",
  hero: "Fai",
  heroClass: "ninja",
  event: "Sunday Showdown: Edinburgh",
  placement: 5,
  source: "https://fabrary.net/decks/01KYF7WYC3Z3VF3X4BK3EPVF1Y",
  arena: `
1x Arcane Lantern
1x Blade Beckoner Helm
1x Blood Scent
1x Bloodied Oval
1x Kunai of Retribution
1x Mask of the Swarming Claw
1x Pouncing Paws
1x Searing Emberblade
1x Tearing Shuko
`,
  mainDeck: `
2x Arcane Polarity (red)
2x Blaze Headlong (red)
2x Brand with Cinderclaw (red)
2x Breaking Point (red)
2x Burning Blade Dance (red)
2x Display Loyalty (red)
2x Enflame the Firebrand (red)
2x Fire Tenet: Strike First (red)
2x Fire that Burns Within (red)
2x Hot on Their Heels (red)
2x Lava Burst (red)
2x Lava Vein Loyalty (red)
2x Phoenix Flame (red)
2x Ravenous Rabble (red)
2x Rise from the Ashes (red)
2x Rising Resentment (red)
2x Ronin Renegade (red)
2x Scar for a Scar (red)
2x Snatch (red)
2x Brand with Cinderclaw (yellow)
2x Dragon Power (blue)
2x Legacy of Ikaru (blue)
2x Nip at the Heels (blue)
`,
});

// ── Classic Constructed (Calling: Las Vegas) ──────────────────────────────────

const CC_LAS_VEGAS_1ST_KASSAI = fixture({
  id: "cc-las-vegas-1st-kassai",
  name: "Calling: Las Vegas 1st — Kassai",
  description: "Classic Constructed Kassai of the Golden Sand — Calling Las Vegas 1st (FaBrary).",
  format: "classic-constructed",
  hero: "Kassai of the Golden Sand",
  heroClass: "warrior",
  event: "Calling: Las Vegas",
  placement: 1,
  source: "https://fabrary.net/decks/01KXY7MM448BWKDAGVA3XG17JB",
  arena: `
1x Balance of Justice
1x Braveforge Bracers
1x Cintari Saber
1x Crown of Dominion
1x Fyendal's Spring Tunic
1x Grains of Bloodspill
1x Hot Streak
1x Kabuto of Imperial Authority
1x Nullrune Hood
1x Talismanic Lens
1x Valiant Dynamo
`,
  mainDeck: `
3x Blade Flurry (red)
3x Blade Runner (red)
1x Draw Swords (red)
3x Fate Foreseen (red)
1x In the Swing (red)
1x Nourishing Emptiness (red)
3x Outland Skirmish (red)
3x Shelter from the Storm (red)
2x Sigil of Solace (red)
3x Sink Below (red)
3x Slice and Dice (red)
3x Spoils of War (red)
3x Unsheathed (red)
3x Blood Follows Blade (yellow)
3x Blood on Her Hands (yellow)
3x Blunten (yellow)
3x Raise an Army (yellow)
1x Riches of Trōpal-Dhani (yellow)
3x Run Through (yellow)
2x Sharpened Senses (yellow)
3x Slice and Dice (yellow)
2x That All You Got? (yellow)
3x Blade Runner (blue)
3x Glint the Quicksilver (blue)
2x High Current Currency (blue)
3x Hit and Run (blue)
3x Trot Along (blue)
`,
});

const CC_LAS_VEGAS_3RD_DORINTHEA = fixture({
  id: "cc-las-vegas-3rd-dorinthea",
  name: "Calling: Las Vegas 3rd — Dorinthea",
  description: "Classic Constructed Dorinthea Ironsong — Calling Las Vegas 3rd (FaBrary).",
  format: "classic-constructed",
  hero: "Dorinthea Ironsong",
  heroClass: "warrior",
  event: "Calling: Las Vegas",
  placement: 3,
  source: "https://fabrary.net/decks/01KXY7MM0RMJF5D40ZK5JN517J",
  arena: `
1x Balance of Justice
1x Braveforge Bracers
1x Crown of Providence
1x Dawnblade
1x Grains of Bloodspill
1x Helm of Astral Sanctuary
1x Kabuto of Imperial Authority
1x Nullrune Hood
1x Refraction Bolters
`,
  mainDeck: `
3x Blade Flurry (red)
2x Dauntless (red)
1x Gleam of the Blade (red)
3x Ironsong Response (red)
3x Jagged Edge (red)
3x Puncture (red)
1x Shelter from the Storm (red)
2x Sigil of Solace (red)
2x Sink Below (red)
2x Spoils of War (red)
3x Steelblade Supremacy (red)
2x Swordmaster's Shine (red)
3x Unsheathed (red)
3x Warrior's Valor (red)
3x Glistening Steelblade (yellow)
3x Ironsong Determination (yellow)
3x Singing Steelblade (yellow)
3x Twinning Blade (yellow)
1x Authority of Ataya (blue)
1x Backside of the Blade (blue)
3x Beat of the Ironsong (blue)
3x Glint the Quicksilver (blue)
1x Goblet of Bloodrun Wine (blue)
3x Hit and Run (blue)
2x Nasty Surprise (blue)
3x Nip at the Heels (blue)
2x Overpower (blue)
2x Provoke (blue)
3x Trot Along (blue)
2x Warrior's Valor (blue)
`,
});

const CC_LAS_VEGAS_5TH_TEKLOVOSSEN = fixture({
  id: "cc-las-vegas-5th-teklovossen",
  name: "Calling: Las Vegas 5th — Teklovossen",
  description:
    "Classic Constructed Teklovossen, Esteemed Magnate — Calling Las Vegas 5th (FaBrary).",
  format: "classic-constructed",
  hero: "Teklovossen, Esteemed Magnate",
  heroClass: "mechanologist",
  event: "Calling: Las Vegas",
  placement: 5,
  source: "https://fabrary.net/decks/01KXY7MM2X13V9PX2D6Z8YP9HB",
  arena: `
1x Adaptive Alpha Mold
1x Adaptive Dissolver
1x Cogwerx Base Chest
1x Cogwerx Base Legs
1x Synapse Sparkcap
1x Teklo Foundry Heart
1x Teklo Leveler
`,
  mainDeck: `
3x Blast Rig (red)
2x Fabricate (red)
3x Firewall (red)
2x Ghost Protocol: Architect (red)
3x Heavy Metal Hardcore (red)
2x Maximum Velocity (red)
3x Pulsewave Harpoon (red)
1x Singularity (red)
3x T-Bone (red)
3x Terminator Tank (red)
3x Twin Drive (red)
2x War Machine (red)
3x Zero to Sixty (red)
2x Zipper Hit (red)
2x Arcbane Grasp (blue)
3x Evo Beta Base Arms (blue)
2x Evo Beta Base Chest (blue)
3x Evo Beta Base Head (blue)
3x Evo Beta Base Legs (blue)
1x Evo Recall (blue)
1x Evo Speedslip (blue)
3x Evo Steel Soul Controller (blue)
3x Evo Steel Soul Memory (blue)
3x Evo Steel Soul Processor (blue)
3x Evo Steel Soul Tower (blue)
3x Ghost Protocol: Mainframe (blue)
3x Steel Street Enforcement (blue)
2x T-Bone (blue)
3x Teklo Trebuchet 2000 (blue)
`,
});

// ── Classic Constructed (community deck lists, 2026-08-11) ──────────────────

const CC_ZYGGY_STARLIGHT_2026_08_11 = fixture({
  id: "cc-2026-08-11-zyggy-starlight",
  name: "2026-08-11 — Zyggy Starlight",
  description: "Classic Constructed Zyggy Starlight community deck list.",
  format: "classic-constructed",
  hero: "Zyggy Starlight",
  heroClass: "illusionist",
  date: "2026-08-11",
  arena: `
1x Iris of Reality
1x Crown of Providence
1x Fyendal's Spring Tunic
1x Dream Weavers
1x Mage Master Boots
`,
  mainDeck: `
3x Ebbing Arcstride (red)
3x Enlightened Strike (red)
3x Lunar Mirage (red)
3x Phantasmaclasm (red)
3x Shelter from the Storm (red)
3x Sink Below (red)
3x Spears of Surreality (red)
3x Flicker Trick (red)
3x Miraging Metamorph (red)
3x Cosmic Duality (blue)
3x Ebbing Arcstride (blue)
3x Fleeing Starbreeze (blue)
3x Fractal Creation (blue)
3x Haze Bending (blue)
3x Nourishing Glow (blue)
3x Pierce Reality (blue)
3x Shimmers of Silver (blue)
3x Spears of Surreality (blue)
3x Vengeful Apparition (blue)
3x Warmonger's Diplomacy (blue)
`,
});

const CC_YAN_PEDRONI_VYNNSET = fixture({
  id: "cc-yan-pedroni-vynnset",
  name: "Yan Pedroni — Vynnset, Iron Maiden",
  description: "Classic Constructed Vynnset, Iron Maiden community deck list.",
  format: "classic-constructed",
  hero: "Vynnset, Iron Maiden",
  heroClass: "runeblade",
  author: "Yan Pedroni",
  arena: `
1x Dyadic Carapace
1x Face Purgatory
1x Flail of Agony
1x Fyendal's Spring Tunic
1x Grasp of the Arknight
1x Grimoire of Fellingsong
1x Grimoire of the Haunt
1x Spellbound Creepers
1x Vexing Quillhand
`,
  mainDeck: `
3x Beseech the Demigon (red)
3x Cull (red)
3x Deadwood Dirge (red)
1x Deathly Delight (red)
3x Deathly Wail (red)
3x Eloquent Eulogy (red)
3x Envelop in Darkness (red)
3x Funeral Moon (red)
3x Malefic Incantation (red)
2x Mauvrion Skies (red)
2x Mordred Tide (red)
1x Putrid Stirrings (red)
3x Reduce to Runechant (red)
2x Revel in Runeblood (red)
2x Runeblood Incantation (red)
3x Shadow Puppetry (red)
2x Sonata Galaxia (red)
3x Widespread Ruin (red)
3x Deathly Wail (yellow)
3x Malefic Incantation (yellow)
3x Succumb to Temptation (yellow)
3x Widespread Destruction (yellow)
3x Deathly Wail (blue)
3x Deep Recesses of Existence (blue)
1x Invert Existence (blue)
3x Machinations of Dominion (blue)
1x Oblivion (blue)
3x Widespread Annihilation (blue)
`,
});

const CC_AURORA_LEGACY_OF_TEMPEST_2026_08_11 = fixture({
  id: "cc-2026-08-11-aurora-legacy-of-tempest",
  name: "2026-08-11 — Aurora, Legacy of Tempest",
  description: "Classic Constructed Aurora, Legacy of Tempest community deck list.",
  format: "classic-constructed",
  hero: "Aurora, Legacy of Tempest",
  heroClass: "wizard",
  date: "2026-08-11",
  arena: `
1x Scorpio, Comet Tail
1x Face Purgatory
1x Aether Ironweave
1x Grasp of the Arknight
1x Snapdragon Scalers
`,
  mainDeck: `
3x Enlightened Strike (red)
2x Flowstate Embodiment (red)
3x Fry (red)
2x Jack Be Nimble (red)
3x Lightning Press (red)
3x Lightning Surge (red)
3x Nimblism (red)
2x Nimby (red)
3x Path of Same Ends (red)
3x Quick Succession (red)
3x Ravenous Rabble (red)
3x Second Strike (red)
3x Skyzyk (red)
3x Snatch (red)
2x Tempestuous Kiss (red)
1x Voltbound Duality (red)
3x Electrostatic Discharge (red)
3x Flittering Charge (red)
2x Scar for a Scar (red)
3x Arc Lightning (yellow)
3x Skyward Serenade (yellow)
1x Quick Succession (yellow)
3x Current Funnel (blue)
`,
});

const CC_GUILHERME_COUTINHO_RHINAR = fixture({
  id: "cc-guilherme-coutinho-rhinar",
  name: "Guilherme Coutinho — Rhinar, Reckless Rampage",
  description: "Classic Constructed Rhinar, Reckless Rampage community deck list.",
  format: "classic-constructed",
  hero: "Rhinar, Reckless Rampage",
  heroClass: "brute",
  author: "Guilherme Coutinho",
  arena: `
1x Beaten Trackers
1x Crown of Providence
1x Gauntlets of Tyrannical Rex
1x Monstrous Veil
1x Nullrune Gloves
1x Ravenous Meataxe
1x Savage Sash
1x Scabskin Leathers
1x Scowling Flesh Bag
`,
  mainDeck: `
3x Aggressive Pounce (red)
2x Amnesia (red)
2x Bare Fangs (red)
2x Command and Conquer (red)
2x Erase Face (red)
3x Pulping (red)
3x Reckless Stampede (red)
3x Savage Feast (red)
3x Show of Strength (red)
3x Splatter Skull (red)
3x Swing Big (red)
2x Vigorous Smashup (red)
3x Wild Ride (red)
3x Agile Windup (yellow)
3x Beast Within (yellow)
3x Bloodrush Bellow (yellow)
2x Buckwild (yellow)
3x Sea Legs (yellow)
3x Send Packing (yellow)
1x Song of Sinew (yellow)
3x Strongest Survive (yellow)
1x Thick Hide Hunter (yellow)
3x Vigorous Smashup (yellow)
3x Alpha Instinct (blue)
1x Eye of Ophidia (blue)
1x Reckless Swing (blue)
3x Sand Sketched Plan (blue)
1x Tear Limb from Limb (blue)
3x Wrecker Romp (blue)
`,
});

const CC_KONRAD_WEISS_OSCILIO = fixture({
  id: "cc-konrad-weiss-oscilio",
  name: "Konrad Weiss — Oscilio, Constella Intelligence",
  description: "Classic Constructed Oscilio, Constella Intelligence community deck list.",
  format: "classic-constructed",
  hero: "Oscilio, Constella Intelligence",
  heroClass: "wizard",
  author: "Konrad Weiss",
  arena: `
1x Balance of Justice
1x Bracers of Belief
1x Cap of Quick Thinking
1x Crown of Providence
1x Fyendal's Spring Tunic
1x Gloves of Astral Sanctuary
1x Lightning Greaves
1x Old Knocker
1x Shock Charmers
1x Stonewall Gauntlet
1x Volzar, Meteor Storm
`,
  mainDeck: `
3x Astral Bridge (red)
3x Cloud Cover (red)
3x Comet Collision (red)
3x Electrostatic Discharge (red)
3x Enlightened Strike (red)
3x Entwine Lightning (red)
1x Even Bigger Than That! (red)
3x Fate Foreseen (red)
3x Flittering Charge (red)
3x Gone in a Flash (red)
3x Lightning Press (red)
2x Lightning Surge (red)
1x Meteoric Impact (red)
3x Ravenous Rabble (red)
3x Scar for a Scar (red)
3x Second Strike (red)
3x Sigil of Solace (red)
2x Snatch (red)
3x Consign to Cosmos // Shock (yellow)
3x Constella Contemplation (yellow)
2x Constella Uplift (yellow)
2x Echoflash (yellow)
1x Remembrance (yellow)
3x Sigil of Brilliance (yellow)
3x Blink (blue)
1x Ruby Amulet (blue)
`,
});

const CC_MEXICO_NATS_2025_1ST_ARAKNI_CRAX = fixture({
  id: "cc-mexico-nats-2025-1st-arakni-crax",
  name: "Mexico National Championship 2025 1st — Arakni, 5L!p3d 7hRu 7h3 cR4X",
  description:
    "Classic Constructed Arakni, 5L!p3d 7hRu 7h3 cR4X — Mexico National Championship 2025 1st (FaBrary).",
  format: "classic-constructed",
  hero: "Arakni, 5L!p3d 7hRu 7h3 cR4X",
  heroClass: "assassin",
  event: "Mexico National Championship 2025",
  placement: 1,
  source: "https://fabrary.net/decks/01JZKY77PHYE22Z4XGH0KDRFAR",
  arena: `
1x Blacktek Whisperers
1x Crown of Providence
1x Flick Knives
1x Fyendal's Spring Tunic
3x Hunter's Klaive
1x Mask of Perdition
1x Nerve Scalpel
1x Widow Veil Respirator
1x Widow Web Crawler
`,
  mainDeck: `
3x Art of Desire: Body (red)
3x Bonds of Attraction (red)
3x Command and Conquer (red)
1x Defang the Dragon (red)
3x Double Trouble (red)
1x Extinguish the Flames (red)
2x Infect (red)
3x Just a Nick (red)
3x Kiss of Death (red)
3x Leave No Witnesses (red)
3x Mark of the Black Widow (red)
3x Orb-Weaver Spinneret (red)
3x Pain in the Backside (red)
3x Razor's Edge (red)
3x Shelter from the Storm (red)
3x Sink Below (red)
3x Tarantula Toxin (red)
2x Undercover Acquisition (red)
1x Codex of Bloodrot (yellow)
3x Codex of Frailty (yellow)
2x Shred (yellow)
3x Take Up the Mantle (yellow)
3x Bonds of Agony (blue)
2x Concealed Blade (blue)
3x Double Trouble (blue)
3x Persuasive Prognosis (blue)
1x Regicide (blue)
`,
});

const CC_GRAVE_TROLL_1ST_ARAKNI_HUNTSMAN = fixture({
  id: "cc-grave-troll-1st-arakni-huntsman",
  name: "Battlegrounds: Grave Troll Games 1st — Arakni, Huntsman",
  description:
    "Classic Constructed Arakni, Huntsman — Battlegrounds: Grave Troll Games 1st (FaBrary).",
  format: "classic-constructed",
  hero: "Arakni, Huntsman",
  heroClass: "assassin",
  event: "Battlegrounds: Grave Troll Games",
  placement: 1,
  source: "https://fabrary.net/decks/01KX9FG6H5XBCF14SJPMCADVBK",
  arena: `
1x Arcane Lantern
1x Balance of Justice
1x Flick Knives
1x Fyendal's Spring Tunic
1x Graven Call
1x Graven Walkers
1x Nerve Scalpel
1x Spider's Bite
1x Stonewall Gauntlet
1x Widow Claw Tarsus
1x Widow Veil Respirator
`,
  mainDeck: `
3x Annihilate the Armed (red)
3x Command and Conquer (red)
3x Cut to the Chase (red)
3x Enlightened Strike (red)
3x Excessive Bloodloss (red)
3x Fate Foreseen (red)
3x Fiddler's Green (red)
3x Fleece the Frail (red)
3x Frailty Trap (red)
3x Leave No Witnesses (red)
2x Oasis Respite (red)
3x Plunder the Poor (red)
3x Shelter from the Storm (red)
2x Sigil of Solace (red)
3x Sink Below (red)
3x Codex of Frailty (yellow)
2x Shred (yellow)
3x Coercive Tendency (blue)
3x Hunter or Hunted? (blue)
1x Overcrowded (blue)
3x Persuasive Prognosis (blue)
3x Ripple Away (blue)
2x Shred (blue)
3x Surgical Extraction (blue)
3x Under the Trap-Door (blue)
`,
});

const SA_JAKARTA_SHOWDOWN_5TH_ARAKNI_WEB = fixture({
  id: "sa-jakarta-showdown-5th-arakni-web",
  name: "Sunday Showdown: Jakarta 5th — Arakni, Web of Deceit",
  description: "Silver Age Arakni, Web of Deceit — Sunday Showdown: Jakarta 5th (FaBrary).",
  format: "silver-age",
  hero: "Arakni, Web of Deceit",
  heroClass: "assassin",
  event: "Sunday Showdown: Jakarta",
  placement: 5,
  source: "https://fabrary.net/decks/01KR99HXYZBKVD5YQS39KE47YF",
  arena: `
1x Blossom of Spring
1x Danger Digits
2x Mark of the Huntsman
1x Nullrune Robe
1x Prey Spotters
1x Stalker's Steps
1x Topsy Turvy
`,
  mainDeck: `
2x Arcane Polarity (red)
2x Art of Desire: Body (red)
2x Bite (red)
2x Concoct Disorder (red)
2x Double Trouble (red)
1x Hurl (red)
2x Infect (red)
2x Lair of the Spider (red)
2x Mark of the Black Widow (red)
2x Mark of the Funnel Web (red)
2x Mark the Prey (red)
2x Nimblism (red)
2x Oasis Respite (red)
2x Orb-Weaver Spinneret (red)
1x Pick Up the Point (red)
1x Public Bounty (red)
2x Pursue to the Edge of Oblivion (red)
1x Pursue to the Pits of Despair (red)
2x Ravenous Rabble (red)
1x Razor Reflex (red)
2x Razor's Edge (red)
2x Shred (red)
2x Stains of the Redback (red)
1x Night's Embrace (blue)
2x Reaper's Call (blue)
1x Relentless Pursuit (blue)
2x Shred (blue)
`,
});

const CC_AUSTRIA_NATS_2026_2ND_VALDA = fixture({
  id: "cc-austria-nats-2026-2nd-valda",
  name: "Austria National Championship 2026 2nd — Valda, Seismic Impact",
  description:
    "Classic Constructed Valda, Seismic Impact — Austria National Championship 2026 2nd (FaBrary).",
  format: "classic-constructed",
  hero: "Valda, Seismic Impact",
  heroClass: "guardian",
  event: "Austria National Championship 2026",
  placement: 2,
  source: "https://fabrary.net/decks/01KWTAYCA8H4394G99CANTRTZR",
  arena: `
1x Arcane Lantern
1x Balance of Justice
1x Basalt Boots
1x Crown of Providence
1x Ironfist Revelation
1x Miller's Grindstone
1x Nullrune Boots
1x Nullrune Gloves
1x Tectonic Plating
1x Testament of Valahai
`,
  mainDeck: `
3x Aftershock (red)
2x Batter to a Pulp (red)
3x Boulder Drop (red)
1x Cartilage Crush (red)
3x Crash and Bash (red)
1x Debilitate (red)
3x Disable (red)
1x Disenchantment of the Old Ones (red)
1x Fault Line (red)
3x Pummel (red)
3x Put 'Em In Their Place (red)
1x Shelter from the Storm (red)
3x Sink Below (red)
3x Spinal Crush (red)
2x Midas Touch (yellow)
1x Pummel (yellow)
1x Remembrance (yellow)
1x Righteous Cleansing (yellow)
3x Seismic Eruption (yellow)
3x Cranial Crush (blue)
3x Disable (blue)
1x Grandeur of Valahai (blue)
1x Headbutt (blue)
1x Imposing Visage (blue)
1x Ley Line of the Old Ones (blue)
3x Macho Grande (blue)
3x Promising Terrain (blue)
2x Pummel (blue)
2x Rouse the Ancients (blue)
1x Sense Weakness (blue)
2x Solid Ground (blue)
3x Tear Asunder (blue)
2x Tectonic Instability (blue)
3x Thunder Quake (blue)
`,
});

const CC_INDONESIA_NATS_2026_3RD_AURORA = fixture({
  id: "cc-indonesia-nats-2026-3rd-aurora",
  name: "Indonesia National Championship 2026 3rd — Aurora, Legacy of Tempest",
  description:
    "Classic Constructed Aurora, Legacy of Tempest — Indonesia National Championship 2026 3rd (FaBrary).",
  format: "classic-constructed",
  hero: "Aurora, Legacy of Tempest",
  heroClass: "runeblade",
  event: "Indonesia National Championship 2026",
  placement: 3,
  source: "https://fabrary.net/decks/01KWRFFMQ5EZZ57REGVPBYTGRG",
  arena: `
1x Balance of Justice
1x Crown of Providence
1x Dread Scythe
1x Dyadic Carapace
1x Fyendal's Spring Tunic
1x Gauntlet of Sword and Sorcery
1x Grasp of the Arknight
1x Helm of Astral Sanctuary
1x Lightning Greaves
1x Scorpio, Comet Tail
1x Snapdragon Scalers
`,
  mainDeck: `
3x Burn Up // Shock (red)
3x Enlightened Strike (red)
3x Flittering Charge (red)
3x Flowing Stormstrike (red)
2x Flowstate Embodiment (red)
3x Gone in a Flash (red)
3x Lightning Press (red)
3x Lightning Surge (red)
3x Path of Same Ends (red)
3x Ravenous Rabble (red)
3x Rush of Power (red)
3x Scar for a Scar (red)
3x Second Strike (red)
3x Sigil of Solace (red)
3x Sigil of Suffering (red)
3x Sink Below (red)
3x Snatch (red)
3x Arc Lightning (yellow)
3x Quick Succession (yellow)
1x Remembrance (yellow)
3x Current Funnel (blue)
3x Ominous Excavation (blue)
2x Overcrowded (blue)
1x Voltaris (blue)
2x Voltbound Duality (blue)
1x Written in the Stars (blue)
`,
});

// ── Classic Constructed (Calling: Hamburg) ────────────────────────────────────

const CC_HAMBURG_1ST_DASH_IO = fixture({
  id: "cc-hamburg-1st-dash-io",
  name: "Calling: Hamburg 1st — Dash I/O",
  description: "Classic Constructed Dash I/O — Calling Hamburg 1st (FaBrary).",
  format: "classic-constructed",
  hero: "Dash I/O",
  heroClass: "mechanologist",
  event: "Calling: Hamburg",
  placement: 1,
  source: "https://fabrary.net/decks/01M0QC2TGSCR35H4076E1KV5EF",
  arena: `
1x Achilles Accelerator
1x Adaptive Plating
1x Bracers of Belief
1x Cogwerx Tinker Rings
1x Crown of Providence
1x Symbiosis Shot
1x Teklo Foundry Heart
1x Viziertronic Model i
`,
  mainDeck: `
3x Backup Protocol: RED (red)
2x Bios Update (red)
3x Boom Grenade (red)
1x Convection Amplifier (red)
3x Expedite (red)
3x Fast and Furious (red)
3x Heist (red)
3x Maximum Velocity (red)
3x Out Pace (red)
1x Plasma Mainline (red)
3x Pulsewave Harpoon (red)
3x Sprocket Rocket (red)
3x Throttle (red)
3x Zero to Sixty (red)
3x Zipper Hit (red)
3x Boom Grenade (yellow)
3x Spark of Genius (yellow)
3x Zero to Sixty (yellow)
3x Zipper Hit (yellow)
3x Cerebellum Processor (blue)
1x Null Time Zone (blue)
3x Teklo Core (blue)
3x Teklo Pounder (blue)
3x Teklo Trebuchet 2000 (blue)
2x Throttle (blue)
3x Zero to Sixty (blue)
2x Zipper Hit (blue)
`,
});

const CC_HAMBURG_2ND_OSCILIO = fixture({
  id: "cc-hamburg-2nd-oscilio",
  name: "Calling: Hamburg 2nd — Oscilio",
  description:
    "Classic Constructed Oscilio, Constella Intelligence — Calling Hamburg 2nd (FaBrary).",
  format: "classic-constructed",
  hero: "Oscilio, Constella Intelligence",
  heroClass: "wizard",
  event: "Calling: Hamburg",
  placement: 2,
  source: "https://fabrary.net/decks/01M0QC2TJMY30XTTXZGHRQBNQE",
  arena: `
1x Balance of Justice
1x Crown of Providence
1x Fyendal's Spring Tunic
1x Metacarpus Node
1x Stonewall Gauntlet
1x Storm Striders
1x Volzar, Meteor Storm
`,
  mainDeck: `
3x Aether Flare (red)
3x Aethersling (red)
3x Chromatic Refinement (red)
3x Comet Collision (red)
3x Comet Storm // Shock (red)
2x Cosmic Flare (red)
3x Fate Foreseen (red)
3x Kindle (red)
3x Meteoric Impact (red)
1x Save the Thought (red)
3x Shelter from the Storm (red)
3x Sigil of Solace (red)
3x Sink Below (red)
3x Snapback (red)
3x Strike Twice (red)
3x Turn to Mindfire (red)
2x Consign to Cosmos // Shock (yellow)
3x Constella Contemplation (yellow)
3x Constella Uplift (yellow)
3x Echoflash (yellow)
2x Amulet of Echoes (blue)
3x Mental Block (blue)
3x Meteoric Impact (blue)
2x Scour (blue)
3x Sigil of Aether (blue)
1x Will of Arcana (blue)
3x Burn Bare
`,
});

const CC_HAMBURG_5TH_MARLYNN = fixture({
  id: "cc-hamburg-5th-marlynn",
  name: "Calling: Hamburg 5th — Marlynn",
  description: "Classic Constructed Marlynn, Treasure Hunter — Calling Hamburg 5th (FaBrary).",
  format: "classic-constructed",
  hero: "Marlynn, Treasure Hunter",
  heroClass: "ranger",
  event: "Calling: Hamburg",
  placement: 5,
  source: "https://fabrary.net/decks/01M0QC2TJ20YJE98NJK2WW6WCH",
  arena: `
1x Arcanite Skullcap
1x Boots of Omnis Ward
1x Bull's Eye Bracers
1x Crown of Dominion
1x Enchanted Quiver
1x Fyendal's Spring Tunic
1x Gold-Baited Hook
1x Hammerhead, Harpoon Cannon
1x Quiver of Abyssal Depths
1x Sealace Sarong
1x Trench of Sunken Treasure
`,
  mainDeck: `
1x Battering Bolt (red)
3x Cheating Scoundrel (red)
3x Endless Arrow (red)
3x King Kraken Harpoon (red)
3x King Shark Harpoon (red)
2x Shelter from the Storm (red)
2x Take Cover (red)
3x Three of a Kind (red)
3x Big Game Trophy Shot (yellow)
2x Boulder Trap (yellow)
3x Codex of Frailty (yellow)
1x Riches of Trōpal-Dhani (yellow)
3x Shallow Water Shark Harpoon (yellow)
3x Tarpit Trap (yellow)
1x Authority of Ataya (blue)
3x Blue Fin Harpoon (blue)
2x Burdens of the Past (blue)
3x Catch of the Day (blue)
3x Murderous Rabble (blue)
1x Pilfer the Tomb (blue)
3x Portside Exchange (blue)
3x Red Fin Harpoon (blue)
2x Red Lure Harpoon (blue)
3x Sea Floor Salvage (blue)
3x Sunken Treasure (blue)
1x Throw Caution to the Wind (blue)
3x Tip the Barkeep (blue)
3x Yellow Fin Harpoon (blue)
`,
});

const CC_NEW_VIS_WHO_DIS_VISERAI_THE_FORSAKEN = fixture({
  id: "cc-2026-09-12-new-vis-who-dis",
  name: "New vis who dis — Viserai, the Forsaken",
  description:
    "Classic Constructed Viserai, the Forsaken Runechant/Ursur community deck list (FaBrary).",
  format: "classic-constructed",
  hero: "Viserai, the Forsaken",
  heroClass: "runeblade",
  date: "2026-09-12",
  source: "https://fabrary.net/decks/01M0BXSMC60A2MTKPA1GNJ9NYF",
  arena: `
1x Dyadic Carapace
1x Ebon Fold
1x Face Purgatory
1x Fyendal's Spring Tunic
1x Seven Sin Nebula
1x Spellbound Creepers
1x Vexing Quillhand
`,
  mainDeck: `
3x Bloodsong Gloomblade (red)
3x Cull (red)
3x Cullingsong Gloomblade (red)
3x Deadwood Dirge (red)
3x Eloquent Eulogy (red)
3x Embrace Ursur (red)
3x Gore Belching (red)
3x Haunting Rendition (red)
3x Malefic Incantation (red)
3x Painful Passage (red)
3x Plundersong Gloomblade (red)
3x Revel in Runeblood (red)
3x Runeblood Incantation (red)
3x Runerager Swarm (red)
3x Shadow Puppetry (red)
3x Sonata Galaxia (red)
3x Deadwood Dirge (yellow)
2x Runechant of Gluttony (yellow)
3x Runechant of Greed (yellow)
3x Runechant of Sloth (yellow)
3x Succumb to Temptation (yellow)
1x Arknight Descendancy (blue)
1x Arknight Shard (blue)
3x Become the Shadow Lord (blue)
3x Captain's Call (blue)
3x Shadow of Ursur (blue)
`,
});

const CC_SHADOW_SUN_KISSED_TECHNIQUE_VISERAI_THE_FORSAKEN = fixture({
  id: "cc-2026-09-13-shadow-sun-kissed-technique-viserai",
  name: "Shadow Sun Kissed Technique - WIP, closer — Viserai, the Forsaken",
  description:
    "Classic Constructed Viserai, the Forsaken Gloomblade/community deck list (FaBrary).",
  format: "classic-constructed",
  hero: "Viserai, the Forsaken",
  heroClass: "runeblade",
  date: "2026-09-13",
  source: "https://fabrary.net/decks/01KXRC4HN9QZ1SKVWPYYXV1290",
  arena: `
1x Crown of Dichotomy
1x Dyadic Carapace
1x Grasp of the Arknight
1x Seven Sin Nebula
`,
  mainDeck: `
3x Bloodfrenzy Gloomblade (red)
3x Call for Backup (red)
3x Cull (red)
3x Cullingsong Gloomblade (red)
3x Demonbound Gloomblade (red)
3x Fate Foreseen (red)
3x Malefic Incantation (red)
3x Murmuring Gloomblade (red)
3x Open the Gate to i'Arathael (red)
3x Pull from Beyond (red)
3x Shadowake Gloomblade (red)
3x Sinspeaker Gloomblade (red)
3x Fallen Herald (yellow)
3x Runechant of Greed (yellow)
3x Runechant of Sloth (yellow)
3x Arknight Descendancy (blue)
1x Arknight Shard (blue)
3x Become the Shadow Lord (blue)
2x Demonbound Gloomblade (blue)
3x Invert Existence (blue)
3x Murmuring Gloomblade (blue)
3x Pull from Beyond (blue)
3x Rites of Nightfall (blue)
3x Shadow of Ursur (blue)
3x Usurp the Shadow Throne (blue)
`,
});

const CC_DOMINA_ON_MY_CORPSE_MALICE = fixture({
  id: "cc-2026-09-12-domina-on-my-corpse-malice",
  name: "Domina on my Corpse until I'm Dead — Malice",
  description:
    "Classic Constructed Malice, Domina of the Dead zombie/community deck list (FaBrary). " +
    "The supplied export labels Shadowrealm Strength blue, but official IAR082 exists only as red; " +
    "the fixture uses the authoritative red printing.",
  format: "classic-constructed",
  hero: "Malice, Domina of the Dead",
  heroClass: "necromancer",
  date: "2026-09-12",
  source: "https://fabrary.net/decks/01M23JMY0AY27JRGGJKYTRMS15",
  arena: `
1x Carrion Crown
1x Carrion Husk
1x Danse Macabre
1x Dead Threads
1x Nullrune Gloves
1x Nullrune Hood
1x Scuttle Toes
1x Undead Grasp
1x Vox Necropolis
`,
  mainDeck: `
3x Arcane Polarity (red)
3x Dig for Souls (red)
3x Fasting Carcass (red)
2x Ominous Toll (red)
3x Restless Commander (red)
2x Restless Corporal (red)
2x Restless Looter (red)
3x Restless Magister (red)
2x Restless Plowman (red)
3x Restless Templar (red)
3x Shadowrealm Strength (red)
3x Sink Below (red)
1x Tome of Necrosis (red)
3x Fallen Herald (yellow)
3x Shadowrealm Swiftness (yellow)
2x Amulet of Echoes (blue)
3x Bone Barrier (blue)
3x Bridge of Damnation (blue)
3x Call to the Grave (blue)
3x Clambering Corpses (blue)
3x Corpse Cover (blue)
2x Mark of Ushering (blue)
3x Ominous Toll (blue)
1x Overcrowded (blue)
3x Shadowrealm Solace (blue)
3x Skeletal Puppetry (blue)
3x Trot Along (blue)
`,
});

/** All tournament text deck fixtures (CC + Silver Age events). */
export const FAB_DECK_TEXT_FIXTURES: readonly FabDeckTextFixture[] = [
  CC_EDINBURGH_1ST_GRAVY,
  CC_EDINBURGH_3RD_TUFFNUT,
  CC_EDINBURGH_5TH_VYNNSET,
  CC_EDINBURGH_5TH_JARL,
  CC_EDINBURGH_5TH_FANG,
  CC_LAS_VEGAS_1ST_KASSAI,
  CC_LAS_VEGAS_3RD_DORINTHEA,
  CC_LAS_VEGAS_5TH_TEKLOVOSSEN,
  SA_EDINBURGH_1ST_BRIAR,
  SA_EDINBURGH_2ND_OSCILIO,
  SA_EDINBURGH_5TH_BLAZE,
  SA_EDINBURGH_5TH_FAI,
  CC_ZYGGY_STARLIGHT_2026_08_11,
  CC_YAN_PEDRONI_VYNNSET,
  CC_AURORA_LEGACY_OF_TEMPEST_2026_08_11,
  CC_GUILHERME_COUTINHO_RHINAR,
  CC_KONRAD_WEISS_OSCILIO,
  CC_MEXICO_NATS_2025_1ST_ARAKNI_CRAX,
  CC_GRAVE_TROLL_1ST_ARAKNI_HUNTSMAN,
  SA_JAKARTA_SHOWDOWN_5TH_ARAKNI_WEB,
  CC_AUSTRIA_NATS_2026_2ND_VALDA,
  CC_INDONESIA_NATS_2026_3RD_AURORA,
  CC_HAMBURG_1ST_DASH_IO,
  CC_HAMBURG_2ND_OSCILIO,
  CC_HAMBURG_5TH_MARLYNN,
  CC_NEW_VIS_WHO_DIS_VISERAI_THE_FORSAKEN,
  CC_SHADOW_SUN_KISSED_TECHNIQUE_VISERAI_THE_FORSAKEN,
  CC_DOMINA_ON_MY_CORPSE_MALICE,
  ...FAB_CC_COVERAGE_DECK_FIXTURES,
];

export function getFabDeckTextFixture(deckId: string): FabDeckTextFixture | undefined {
  return FAB_DECK_TEXT_FIXTURES.find((deck) => deck.id === deckId);
}

export function getFabDeckTextFixturesByFormat(
  format: FabDeckFormat,
): readonly FabDeckTextFixture[] {
  return FAB_DECK_TEXT_FIXTURES.filter((deck) => deck.format === format);
}

/** Named re-exports for direct imports. */
export {
  CC_EDINBURGH_1ST_GRAVY,
  CC_EDINBURGH_3RD_TUFFNUT,
  CC_EDINBURGH_5TH_VYNNSET,
  CC_EDINBURGH_5TH_JARL,
  CC_EDINBURGH_5TH_FANG,
  CC_LAS_VEGAS_1ST_KASSAI,
  CC_LAS_VEGAS_3RD_DORINTHEA,
  CC_LAS_VEGAS_5TH_TEKLOVOSSEN,
  SA_EDINBURGH_1ST_BRIAR,
  SA_EDINBURGH_2ND_OSCILIO,
  SA_EDINBURGH_5TH_BLAZE,
  SA_EDINBURGH_5TH_FAI,
  CC_ZYGGY_STARLIGHT_2026_08_11,
  CC_YAN_PEDRONI_VYNNSET,
  CC_AURORA_LEGACY_OF_TEMPEST_2026_08_11,
  CC_GUILHERME_COUTINHO_RHINAR,
  CC_KONRAD_WEISS_OSCILIO,
  CC_MEXICO_NATS_2025_1ST_ARAKNI_CRAX,
  CC_GRAVE_TROLL_1ST_ARAKNI_HUNTSMAN,
  SA_JAKARTA_SHOWDOWN_5TH_ARAKNI_WEB,
  CC_AUSTRIA_NATS_2026_2ND_VALDA,
  CC_INDONESIA_NATS_2026_3RD_AURORA,
  CC_HAMBURG_1ST_DASH_IO,
  CC_HAMBURG_2ND_OSCILIO,
  CC_HAMBURG_5TH_MARLYNN,
  CC_NEW_VIS_WHO_DIS_VISERAI_THE_FORSAKEN,
  CC_SHADOW_SUN_KISSED_TECHNIQUE_VISERAI_THE_FORSAKEN,
  CC_DOMINA_ON_MY_CORPSE_MALICE,
};
