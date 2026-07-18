import type {
  CharacterCard,
  EventCard,
  LeaderCard,
  OPCardI18n,
  OPRarity,
  StageCard,
} from "@tcg/op-types";

function i18n(name: string, effect?: string, imageId?: string): OPCardI18n {
  return {
    en: {
      name,
      ...(effect ? { effect } : {}),
      ...(imageId
        ? { imageUrl: `https://www.optcgapi.com/media/static/Card_Images/${imageId}.jpg` }
        : {}),
    },
  };
}

function printing(id: string, rarity: OPRarity) {
  return {
    id,
    artId: id,
    setCode: "ST01",
    collectorNumber: id.slice("ST01-".length),
    rarity,
    imageUrl: `https://www.optcgapi.com/media/static/Card_Images/${id}.jpg`,
  };
}

const strawHat = ["Straw Hat Crew"];
const supernovasStrawHat = ["Supernovas", "Straw Hat Crew"];

export const st01MonkeyDLuffy001: LeaderCard = {
  id: "ST01-001",
  canonicalId: "ST01-001",
  slug: "monkey-d-luffy/st01-001",
  name: "Monkey.D.Luffy",
  printings: [printing("ST01-001", "L")],
  cardType: "leader",
  color: ["red"],
  rarity: "L",
  setId: "ST01",
  power: 5000,
  life: 5,
  traits: supernovasStrawHat,
  attribute: "strike",
  effect:
    "[Activate: Main] [Once Per Turn] Give this Leader or 1 of your Characters up to 1 rested DON!! card.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        oncePerTurn: true,
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: { amount: 1, upTo: true },
            },
            count: { amount: 1, upTo: true },
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: i18n(
    "Monkey.D.Luffy",
    "[Activate: Main] [Once Per Turn] Give this Leader or 1 of your Characters up to 1 rested DON!! card.",
    "ST01-001",
  ),
};

export const st01Usopp002: CharacterCard = {
  id: "ST01-002",
  canonicalId: "ST01-002",
  slug: "usopp/st01-002",
  name: "Usopp",
  printings: [printing("ST01-002", "C")],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: strawHat,
  attribute: "ranged",
  trigger: "[Trigger] Play this card.",
  effect:
    "[DON!! x2] [When Attacking] Your opponent cannot activate a [Blocker] Character that has 5000 or more power during this battle.",
  i18n: i18n(
    "Usopp",
    "[DON!! x2] [When Attacking] Your opponent cannot activate a [Blocker] Character that has 5000 or more power during this battle.",
    "ST01-002",
  ),
};

export const st01Karoo003: CharacterCard = {
  id: "ST01-003",
  canonicalId: "ST01-003",
  slug: "karoo/st01-003",
  name: "Karoo",
  printings: [printing("ST01-003", "C")],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 1,
  power: 3000,
  counter: 1000,
  traits: ["Animal", "Alabasta"],
  attribute: "strike",
  i18n: i18n("Karoo", undefined, "ST01-003"),
};

export const st01Sanji004: CharacterCard = {
  id: "ST01-004",
  canonicalId: "ST01-004",
  slug: "sanji/st01-004",
  name: "Sanji",
  printings: [printing("ST01-004", "C")],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 2,
  power: 4000,
  traits: strawHat,
  attribute: "strike",
  effect: "[DON!! x2] This Character gains [Rush].",
  i18n: i18n("Sanji", "[DON!! x2] This Character gains [Rush].", "ST01-004"),
};

export const st01Jinbe005: CharacterCard = {
  id: "ST01-005",
  canonicalId: "ST01-005",
  slug: "jinbe/st01-005",
  name: "Jinbe",
  printings: [printing("ST01-005", "C")],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 3,
  power: 5000,
  traits: ["Fish-Man", "Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[DON!! x1] [When Attacking] Up to 1 of your Leader or Character cards other than this card gains +1000 power during this turn.",
  i18n: i18n(
    "Jinbe",
    "[DON!! x1] [When Attacking] Up to 1 of your Leader or Character cards other than this card gains +1000 power during this turn.",
    "ST01-005",
  ),
};

export const st01TonyTonyChopper006: CharacterCard = {
  id: "ST01-006",
  canonicalId: "ST01-006",
  slug: "tony-tony-chopper/st01-006",
  name: "Tony Tony.Chopper",
  printings: [printing("ST01-006", "C")],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 1,
  power: 1000,
  traits: ["Animal", "Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: i18n(
    "Tony Tony.Chopper",
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
    "ST01-006",
  ),
};

export const st01Nami007: CharacterCard = {
  id: "ST01-007",
  canonicalId: "ST01-007",
  slug: "nami/st01-007",
  name: "Nami",
  printings: [printing("ST01-007", "C")],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: strawHat,
  attribute: "special",
  effect:
    "[Activate: Main] [Once Per Turn] Give up to 1 rested DON!! card to your Leader or 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: { amount: 1 },
            },
            count: { amount: 1, upTo: true },
            donState: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: i18n(
    "Nami",
    "[Activate: Main] [Once Per Turn] Give up to 1 rested DON!! card to your Leader or 1 of your Characters.",
    "ST01-007",
  ),
};

export const st01NicoRobin008: CharacterCard = {
  id: "ST01-008",
  canonicalId: "ST01-008",
  slug: "nico-robin/st01-008",
  name: "Nico Robin",
  printings: [printing("ST01-008", "C")],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: strawHat,
  attribute: "wisdom",
  i18n: i18n("Nico Robin", undefined, "ST01-008"),
};

export const st01NefeltariVivi009: CharacterCard = {
  id: "ST01-009",
  canonicalId: "ST01-009",
  slug: "nefeltari-vivi/st01-009",
  name: "Nefeltari Vivi",
  printings: [printing("ST01-009", "C")],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 2,
  power: 4000,
  counter: 1000,
  traits: ["Alabasta"],
  attribute: "slash",
  i18n: i18n("Nefeltari Vivi", undefined, "ST01-009"),
};

export const st01Franky010: CharacterCard = {
  id: "ST01-010",
  canonicalId: "ST01-010",
  slug: "franky/st01-010",
  name: "Franky",
  printings: [printing("ST01-010", "C")],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: strawHat,
  attribute: "strike",
  i18n: i18n("Franky", undefined, "ST01-010"),
};

export const st01Brook011: CharacterCard = {
  id: "ST01-011",
  canonicalId: "ST01-011",
  slug: "brook/st01-011",
  name: "Brook",
  printings: [printing("ST01-011", "C")],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: strawHat,
  attribute: "slash",
  effect: "[On Play] Give up to 2 rested DON!! cards to your Leader or 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: { amount: 1 },
            },
            count: { amount: 2, upTo: true },
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: i18n(
    "Brook",
    "[On Play] Give up to 2 rested DON!! cards to your Leader or 1 of your Characters.",
    "ST01-011",
  ),
};

export const st01MonkeyDLuffy012: CharacterCard = {
  id: "ST01-012",
  canonicalId: "ST01-012",
  slug: "monkey-d-luffy/st01-012",
  name: "Monkey.D.Luffy",
  printings: [printing("ST01-012", "SR")],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "ST01",
  cost: 5,
  power: 6000,
  traits: supernovasStrawHat,
  attribute: "strike",
  effect:
    "[Rush] (This card can attack on the turn in which it is played.) [DON!! x2] [When Attacking] Your opponent cannot activate [Blocker] during this battle.",
  effects: {
    keywords: ["rush"],
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [{ condition: "donAttached", amount: 2 }],
        actions: [
          {
            action: "cannotActivate",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: "all" },
            },
            keyword: "blocker",
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: i18n(
    "Monkey.D.Luffy",
    "[Rush] (This card can attack on the turn in which it is played.) [DON!! x2] [When Attacking] Your opponent cannot activate [Blocker] during this battle.",
    "ST01-012",
  ),
};

export const st01RoronoaZoro013: CharacterCard = {
  id: "ST01-013",
  canonicalId: "ST01-013",
  slug: "roronoa-zoro/st01-013",
  name: "Roronoa Zoro",
  printings: [printing("ST01-013", "SR")],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "ST01",
  cost: 3,
  power: 5000,
  traits: supernovasStrawHat,
  attribute: "slash",
  effect: "[DON!! x1] This Character gains +1000 power.",
  i18n: i18n("Roronoa Zoro", "[DON!! x1] This Character gains +1000 power.", "ST01-013"),
};

export const st01GuardPoint014: EventCard = {
  id: "ST01-014",
  canonicalId: "ST01-014",
  slug: "guard-point",
  name: "Guard Point",
  printings: [printing("ST01-014", "C")],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 1,
  traits: strawHat,
  trigger:
    "[Trigger] Up to 1 of your Leader or Character cards gains +1000 power during this turn.",
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: { amount: 1, upTo: true },
            },
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: { amount: 1, upTo: true },
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: i18n(
    "Guard Point",
    "[Counter] Up to 1 of your Leader or Character cards gains +3000 power during this battle.",
    "ST01-014",
  ),
};

export const st01GumGumJetPistol015: EventCard = {
  id: "ST01-015",
  canonicalId: "ST01-015",
  slug: "gum-gum-jet-pistol",
  name: "Gum-Gum Jet Pistol",
  printings: [printing("ST01-015", "C")],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 4,
  traits: supernovasStrawHat,
  trigger: "[Trigger] Activate this card's [Main] effect.",
  effect: "[Main] K.O. up to 1 of your opponent's Characters with 6000 power or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "power", comparison: "lte", value: 6000 }],
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [{ action: "activateEffect", effectTrigger: "main" }],
      },
    ],
  },
  i18n: i18n(
    "Gum-Gum Jet Pistol",
    "[Main] K.O. up to 1 of your opponent's Characters with 6000 power or less.",
    "ST01-015",
  ),
};

export const st01DiableJambe016: EventCard = {
  id: "ST01-016",
  canonicalId: "ST01-016",
  slug: "diable-jambe",
  name: "Diable Jambe",
  printings: [printing("ST01-016", "C")],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 1,
  traits: strawHat,
  trigger:
    "[Trigger] K.O. up to 1 of your opponent's [Blocker] Characters with a cost of 3 or less.",
  effect:
    "[Main] Select up to 1 of your {Straw Hat Crew} type Leader or Character cards. Your opponent cannot activate [Blocker] if that Leader or Character attacks during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "trait", value: "Straw Hat Crew", match: "includes" }],
            },
            keyword: "unblockable",
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "hasKeyword", value: "blocker" },
                { filter: "cost", comparison: "lte", value: 3 },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: i18n(
    "Diable Jambe",
    "[Main] Select up to 1 of your {Straw Hat Crew} type Leader or Character cards. Your opponent cannot activate [Blocker] if that Leader or Character attacks during this turn.",
    "ST01-016",
  ),
};

export const st01ThousandSunny017: StageCard = {
  id: "ST01-017",
  canonicalId: "ST01-017",
  slug: "thousand-sunny/st01-017",
  name: "Thousand Sunny",
  printings: [printing("ST01-017", "C")],
  cardType: "stage",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 2,
  traits: strawHat,
  effect:
    "[Activate: Main] You may rest this Stage: Up to 1 {Straw Hat Crew} type Leader or Character card on your field gains +1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [{ cost: "restThisCard" }],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "trait", value: "Straw Hat Crew", match: "includes" }],
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: i18n(
    "Thousand Sunny",
    "[Activate: Main] You may rest this Stage: Up to 1 {Straw Hat Crew} type Leader or Character card on your field gains +1000 power during this turn.",
    "ST01-017",
  ),
};
