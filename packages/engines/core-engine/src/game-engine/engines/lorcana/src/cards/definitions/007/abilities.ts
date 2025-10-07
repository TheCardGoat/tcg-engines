import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";
import {
  banishChosenItem,
  chosenCharacterGainsChallenger,
  chosenCharacterGainsEvasive,
  chosenCharacterGetsStrength,
  drawACard,
  drawXCards,
  moveDamageEffect,
  returnToHand,
  youGainLore,
  youMayDrawThenChooseAndDiscard,
  youPayXLessToPlayNextItemThisTurn,
} from "~/game-engine/engines/lorcana/src/abilities/effect";
import {
  chosenCharacter,
  chosenCharacterOfYours,
  chosenCharacterOrLocation,
  chosenDamagedCharacter,
  chosenOpposingCharacter,
  chosenPlayer,
  opponent,
  self,
  thisCharacter,
} from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { BanishTrigger } from "~/game-engine/engines/lorcana/src/abilities/triggers";
import {
  whenThisIsBanished,
  whenYouPlayThisCharacter,
} from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import {
  wheneverACardIsPutIntoYourInkwell,
  wheneverYouPlayACharacter,
  wheneverYouPlayAnActionNotASong,
} from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";

export const soMuchToGiveAbility = {
  type: "resolution",
  name: "So Much To Give",
  text: "Draw a card. Chosen character gains Bodyguard until the start of your next turn.",
  resolveEffectsIndividually: true,
  effects: [
    drawACard,
    {
      type: "ability",
      ability: "bodyguard",
      modifier: "add",
      duration: "next_turn",
      until: true,
      target: chosenCharacter,
    },
  ],
};

export const restoringTheHeartAbility = {
  type: "resolution",
  text: "Remove up to 3 damage from chosen character or location. Draw a card.",
  resolveEffectsIndividually: true,
  effects: [
    {
      type: "heal",
      amount: 3,
      target: chosenCharacterOrLocation,
    },
    drawACard,
  ],
};

export const magicalManeuversAbility = {
  type: "resolution",
  text: "Return chosen character of yours to your hand. Exert chosen character.",
  resolveEffectsIndividually: true,
  effects: [
    {
      type: "move",
      to: "hand",
      target: chosenCharacterOfYours,
    },
    {
      type: "exert",
      exert: true,
      target: chosenCharacter,
    },
  ],
};

export const thisIsMyFamilyAbility = {
  type: "resolution",
  text: "(A character with cost 2 or more can {E} to sing this song for free.)\nGain 1 lore. Draw a card.",
  resolveEffectsIndividually: true,
  effects: [youGainLore(1), drawACard],
};

export const showMeMoreAbilities = [
  {
    type: "resolution",
    name: "Show Me More!",
    text: "Each player draws 3 cards.",
    effects: [drawXCards(3, self), drawXCards(3, opponent)],
  },
];
export const weveGotCompanyAbility = {
  type: "resolution",
  text: "Ready all your characters. They gain Reckless this turn. (They can't quest and must challenge if able.)",
  effects: [
    {
      type: "exert",
      exert: false,
      target: {
        type: "card",
        value: "all",
        filters: [
          { filter: "type", value: "character" },
          { filter: "owner", value: "self" },
        ],
      },
    },
    {
      type: "ability",
      ability: "reckless",
      modifier: "add",
      duration: "turn",
      target: {
        type: "card",
        value: "all",
        filters: [
          { filter: "type", value: "character" },
          { filter: "owner", value: "self" },
        ],
      },
    },
  ],
};

export const outOfOrderAbility = {
  type: "resolution",
  text: "Banish chosen character.",
  effects: [
    {
      type: "banish",
      target: chosenCharacter,
    },
  ],
};

const waterHasMemoryEffect = {
  type: "scry",
  amount: 4,
  mode: "both",
  shouldRevealTutored: false,
  target: chosenPlayer, // This will be overwritten by the chosen player from "create-layer-targeting-player" effect
  limits: {
    bottom: 3,
    top: 1,
  },
};

// IT's a two steps process, so the active player can choose the target and then resolve the effect
const waterHasMemoryChoseTarget = {
  type: "create-layer-targeting-player",
  target: chosenPlayer,
  layer: {
    type: "resolution",
    name: "Water Has Memory",
    text: "Look at the top 4 cards of chosen player's deck. Put one on the top of their deck and the rest on the bottom of their deck in any order.",
    effects: [waterHasMemoryEffect],
  },
};

export const waterHasMemoryAbility = {
  type: "resolution",
  name: "Water Has Memory",
  text: "Look at the top 4 cards of chosen player's deck. Put one on the top of their deck and the rest on the bottom of their deck in any order.",
  effects: [waterHasMemoryChoseTarget],
};

export const restoringAtlantisAbility = {
  type: "resolution",
  text: "Your characters can't be challenged until the start of your next turn.",
  effects: [
    {
      type: "restriction",
      restriction: "be-challenged",
      duration: "next_turn",
      until: true,
      target: {
        type: "card",
        value: "all",
        filters: [
          { filter: "type", value: "character" },
          { filter: "owner", value: "self" },
          { filter: "zone", value: "play" },
        ],
      },
    },
  ],
};

const madrigalScry = {
  type: "scry",
  amount: 5,
  mode: "top",
  shouldRevealTutored: true,
  target: self,
  tutorFilters: [
    { filter: "owner", value: "self" },
    { filter: "zone", value: "deck" },
  ],
  limits: {
    top: 5,
    hand: [
      {
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "character" },
          { filter: "characteristics", value: ["madrigal"] },
        ],
      },
      {
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "action" },
          { filter: "characteristics", value: ["song"] },
        ],
      },
    ],
  },
};

export const theFamilyMadrigalAbility = {
  type: "resolution",
  name: "The Family Madrigal",
  text: "Look at the top 5 cards of your deck. You may reveal up to 1 Madrigal character card and up to 1 song card and put them into your hand. Put the rest on the top of your deck in any order.",
  effects: [madrigalScry],
};

export const theReturnOfHerculesAbility = [
  {
    type: "resolution",
    name: "The Return Of Hercules",
    text: "Each player may reveal a character card from their hand and play it for free.",
    responder: "opponent",
    optional: true,
    effects: [
      {
        type: "play",
        forFree: true,
        target: {
          type: "card",
          value: 1,
          filters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "hand" },
            { filter: "type", value: "character" },
          ],
        },
      },
    ],
  },
  {
    type: "resolution",
    name: "The Return Of Hercules",
    text: "Each player may reveal a character card from their hand and play it for free.",
    responder: "self",
    optional: true,
    effects: [
      {
        type: "play",
        forFree: true,
        target: {
          type: "card",
          value: 1,
          filters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "hand" },
            { filter: "type", value: "character" },
          ],
        },
      },
    ],
  },
];

export const allIsFoundAbility = {
  type: "resolution",
  name: "All Is Found",
  text: "Put up to 2 cards from your discard into your inkwell, facedown and exerted.",
  effects: [
    {
      type: "move",
      to: "inkwell",
      exerted: true,
      target: {
        type: "card",
        value: 2,
        upTo: true,
        excludeSelf: true,
        filters: [
          { filter: "zone", value: "discard" },
          { filter: "owner", value: "self" },
        ],
      },
    },
  ],
};

export const doubleTroubleAbility = {
  type: "resolution",
  text: "Deal 1 damage to up to 2 chosen characters.",
  effects: [
    {
      type: "damage",
      amount: 1,
      target: {
        type: "card",
        value: 2,
        upTo: true,
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
        ],
      },
    },
  ],
};

export const hesATrampAbility = {
  type: "resolution",
  name: "He's A Tramp",
  text: "Chosen character gets +1 {S} this turn for each character you have in play.",
  conditions: [],
  effects: [
    {
      type: "attribute",
      attribute: "strength",
      amount: {
        dynamic: true,
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "owner", value: "self" },
        ],
      },
      modifier: "add",
      duration: "turn",
      target: chosenCharacter,
    },
  ],
};

export const wakeUpAliceAbility = {
  type: "resolution",
  name: "Wake Up, Alice!",
  text: "Return chosen damaged character to their player's hand.",
  effects: [
    {
      type: "move",
      to: "hand",
      target: {
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          {
            filter: "status",
            value: "damage",
            comparison: { operator: "gte", value: 1 },
          },
        ],
      },
    },
  ],
};

const exertAllOpposingChars = {
  type: "resolution",
  name: "Restoring The Crown",
  text: "Exert all opposing characters.",
  effects: [
    {
      type: "exert",
      exert: true,
      target: {
        type: "card",
        value: "all",
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "owner", value: "opponent" },
        ],
      },
    },
  ],
};
const banishTrigger: BanishTrigger = {
  on: "banish",
  in: "challenge",
  exclude: "source",
  filters: [
    { filter: "type", value: "character" },
    { filter: "owner", value: "opponent" },
  ],
};
const gainLoreOnBanish = {
  type: "floating-triggered",
  text: "Whenever one of your characters banishes another character in a challenge this turn, gain 2 lore.",
  duration: "turn",
  trigger: banishTrigger,
  layer: {
    type: "resolution",
    effects: [
      {
        type: "lore",
        amount: 2,
        modifier: "add",
        target: self,
      },
    ],
  },
};
export const restoringTheCrownAbilities = [
  exertAllOpposingChars,
  gainLoreOnBanish,
];
export const spaghettiDinnerAbility: ActivatedAbility = {
  type: "activated",
  name: "Fine Dining",
  text: "{E}, 1 {I} – If you have 2 or more characters in play, gain 1 lore.",
  costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
  conditions: [
    {
      type: "filter",
      comparison: { operator: "gte", value: 2 },
      filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "self" },
      ],
    },
  ],
  effects: [youGainLore(1)],
};
export const kanineKrunchiesAbility = {
  type: "static",
  ability: "effects",
  name: "You Can Be A Champion, Too",
  text: "Your Puppy characters get +1 {W}.",
  effects: [
    {
      type: "attribute",
      attribute: "willpower",
      amount: 1,
      modifier: "add",
      target: {
        type: "card",
        value: "all",
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "characteristics", value: ["puppy"] },
          { filter: "owner", value: "self" },
        ],
      },
    },
  ],
};
export const searchTheKingdom: ActivatedAbility = {
  type: "activated",
  name: "Search The Kingdom",
  text: "Banish this item, {E} one of your Prince characters – Search your deck for a Princess character card and reveal it to all players. Put that card into your hand and shuffle your deck.",
  costs: [
    { type: "banish" },
    {
      type: "card",
      action: "exert",
      amount: 1,
      filters: [
        { filter: "owner", value: "self" },
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "characteristics", value: ["prince"] },
      ],
    },
  ],
  effects: [
    {
      type: "shuffle-deck",
      target: self,
    },
    {
      type: "move",
      to: "hand",
      target: {
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "character" },
          { filter: "characteristics", value: ["princess"] },
          { filter: "zone", value: "deck" },
          { filter: "owner", value: "self" },
        ],
      },
    },
  ],
};
export const amethystCoilAbility = wheneverACardIsPutIntoYourInkwell({
  name: "Magical Touch",
  text: "During your turn, whenever a card is put into your inkwell, you may move 1 damage counter from chosen character to chosen opposing character.",
  optional: true,
  effects: [
    moveDamageEffect({
      amount: 1,
      from: chosenCharacter,
      to: chosenOpposingCharacter,
    }),
  ],
  conditions: [{ type: "during-turn", value: "self" }],
});
export const emeraldCoilAbility = wheneverACardIsPutIntoYourInkwell({
  name: "Shimmering Wings",
  text: "During your turn, whenever a card is put into your inkwell, chosen character gains Evasive until the start of your next turn.",
  optional: true,
  effects: [
    { ...chosenCharacterGainsEvasive, duration: "next_turn", until: true },
  ],
  conditions: [{ type: "during-turn", value: "self" }],
});
export const unconventionalToolAbility = whenThisIsBanished({
  name: "Fixed In No Time",
  text: "When this item is banished, you pay 2 {I} less for the next item you play this turn.",
  effects: [youPayXLessToPlayNextItemThisTurn(2)],
});
export const sapphireCoilAbility = wheneverACardIsPutIntoYourInkwell({
  name: "Brilliant Shine",
  text: "During your turn, whenever a card is put into your inkwell, you may give chosen character -2 {S} this turn.",
  optional: true,
  conditions: [{ type: "during-turn", value: "self" }],
  effects: [chosenCharacterGetsStrength(-2)],
});
export const devilsEyeDiamondAbility: ActivatedAbility = {
  type: "activated",
  name: "The Price Of Power",
  text: "{E} - If one of your characters was damaged this turn, gain 1 lore.",
  costs: [{ type: "exert" }],
  conditions: [
    {
      type: "this-turn",
      value: "was-damaged",
      target: "self",
      comparison: { operator: "gte", value: 1 },
      filters: [
        { filter: "type", value: "character" },
        { filter: "owner", value: "self" },
      ],
    },
  ],
  effects: [youGainLore(1)],
};
export const baymaxsChargingStationAbility = wheneverYouPlayACharacter({
  name: "Energy Converter",
  text: "Whenever you play a Floodborn character, if you used Shift to play them, you may draw a card.",
  optional: true,
  hasShifted: true,
  effects: [drawACard],
});
export const amberCoilAbility = wheneverACardIsPutIntoYourInkwell({
  name: "Healing Aura",
  text: "During your turn, whenever a card is put into your inkwell, you may remove up to 2 damage from chosen character.",
  optional: true,
  effects: [
    {
      type: "heal",
      amount: 2,
      target: chosenCharacter,
    },
  ],
  conditions: [{ type: "during-turn", value: "self" }],
});
export const rubyCoilAbility = wheneverACardIsPutIntoYourInkwell({
  name: "Crimson Spark",
  text: "During your turn, whenever a card is put into your inkwell, chosen character gets +2 {S} this turn.",
  optional: true,
  effects: [chosenCharacterGetsStrength(2)],
  conditions: [{ type: "during-turn", value: "self" }],
});
export const mauricesMachineAbility = whenThisIsBanished({
  name: "Break Down",
  text: "When this item is banished, you may return an item card with cost 2 or less from your discard to your hand.",
  optional: true,
  effects: [
    returnToHand({
      filters: [
        { filter: "owner", value: "self" },
        { filter: "type", value: "item" },
        {
          filter: "attribute",
          value: "cost",
          comparison: { operator: "lte", value: 2 },
        },
      ],
    }),
  ],
});

export const steelCoilAbility = wheneverACardIsPutIntoYourInkwell({
  ...youMayDrawThenChooseAndDiscard,
  optional: true,
  name: "Metallic Flow",
  text: "During your turn, whenever a card is put into your inkwell, you may draw a card, then choose and discard a card.",
  conditions: [{ type: "during-turn", value: "self" }],
});

export const trainingStaffAbility: ActivatedAbility = {
  type: "activated",
  name: "Precision Strike",
  text: "{E}, 1 {I} – Chosen character gains Challenger +2 this turn.",
  costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
  effects: [chosenCharacterGainsChallenger(2)],
};

export const hiddenAwayAbility = {
  type: "static",
  ability: "effects",
  name: "HIDDEN AWAY",
  text: "This character can't be challenged.",
  effects: [
    {
      type: "restriction",
      restriction: "be-challenged",
      target: thisCharacter,
    },
  ],
};

export const taleOfTheFifthSpiritAbility = whenYouPlayThisCharacter({
  name: "TALE OF THE FIFTH SPIRIT",
  text: "When you play this character, if an opponent has an exerted character in play, gain 1 lore.",
  conditions: [
    {
      type: "filter",
      comparison: { operator: "gte", value: 1 },
      filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "opponent" },
        { filter: "status", value: "exerted" },
      ],
    },
  ],
  optional: false,
  effects: [youGainLore(1)],
});

export const midnightFestivitiesAbility = {
  type: "resolution",
  name: "MIDNIGHT FESTIVITIES",
  text: "When you play this character, each opponent chooses one of their readied characters and exhausts it. Characters exhausted this way do not ready at the start of their next turn.",
  responder: "opponent",
  effects: [
    {
      type: "exert",
      exert: true,
      target: {
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "owner", value: "self" },
          { filter: "status", value: "ready" },
        ],
      },
      subEffect: {
        type: "restriction",
        restriction: "ready-at-start-of-turn",
        duration: "next_turn",
        target: {
          type: "card",
          value: "all",
          filters: [{ filter: "source", value: "target" }],
        },
      },
    },
  ],
};

export const madGrinAbility = {
  type: "resolution",
  name: "MAD GRIN",
  text: "When you play this character, you may deal 2 damage to chosen damaged character.",
  optional: true,
  effects: [
    {
      type: "damage",
      amount: 2,
      target: chosenDamagedCharacter,
    },
  ],
};

export const pilferAndPlunderAbility = wheneverYouPlayAnActionNotASong({
  name: "PILFER AND PLUNDER",
  text: "Whenever you play an action that isn't a song, you may banish chosen item.",
  optional: true,
  effects: [banishChosenItem],
});
