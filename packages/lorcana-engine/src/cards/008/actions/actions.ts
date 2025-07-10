import type {
  CardEffectTarget,
  LorcanitoActionCard,
  ResolutionAbility,
  TargetFilter,
} from "@lorcanito/lorcana-engine";
import {
  type ActivatedAbility,
  singerTogetherAbility,
} from "@lorcanito/lorcana-engine/abilities/abilities";
import {
  chosenCharacter,
  chosenItem,
  chosenOpposingCharacter,
  self,
  yourCharacters,
} from "@lorcanito/lorcana-engine/abilities/targets";
import {
  chosenCharacterGainsEvasive,
  chosenCharacterGetsStrength,
  drawACard,
  drawXCards,
  moveDamageEffect,
  youPayXLessToPlayNextCharThisTurn,
} from "@lorcanito/lorcana-engine/effects/effects";

export { candyDrift } from "./amber/039-candy-drift";
export { onlySoMuchRoom } from "./amber/041-only-so-much-room";
export { trialsAndTribulations } from "./amber/043-trials-and-tribulations";
export { beyondTheHorizon } from "./amber/202-beyond-the-horizon";
export { forestDuel } from "./amethyst/077-forest-duel";
export { fantasticalAndMagical } from "./amethyst/079-fantastical-and-magical";
export { intoTheUnknown } from "./dual-ink/081-into-the-unknown";
export { pullTheLever } from "./emerald/080-pull-the-lever";
export { wrongLeverAction } from "./emerald/116-wrong-lever";
export { undermine } from "./emerald/117-undermine";
export { nothingWeWontDo } from "./ruby/147-nothing-we-wont-do";
export { getOut } from "./ruby/148-get-out";
export { twitterpated } from "./ruby/150-twitterpated";
export { mostEveryonesMadHere } from "./ruby/151-most-everyones-mad-here";
export { headsHeldHigh } from "./sapphire/175-heads-held-high";
export { desperatePlan } from "./steel/201-desperate-plan";
export { quickShot } from "./steel/203-quick-shot";

const eachOfYourCharactersWithBodyGuard: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [
    { filter: "owner", value: "self" },
    { filter: "zone", value: "play" },
    { filter: "type", value: "character" },
    { filter: "ability", value: "bodyguard" },
  ],
};
const shesYourPersonAbility: ResolutionAbility = {
  type: "resolution",
  effects: [
    {
      type: "modal",
      // TODO: Get rid of target
      target: chosenCharacter,
      modes: [
        {
          id: "1",
          text: "Remove up to 3 damage from chosen character.",
          effects: [
            {
              type: "heal",
              amount: 3,
              target: chosenCharacter,
            },
          ],
        },
        {
          id: "2",
          text: "Remove up to 3 damage from each of your characters with Bodyguard.",
          effects: [
            {
              type: "heal",
              amount: 3,
              target: eachOfYourCharactersWithBodyGuard,
            },
          ],
        },
      ],
    },
  ],
};
export const shesYourPerson: LorcanitoActionCard = {
  id: "u6y",
  name: "She's Your Person",
  characteristics: ["action"],
  text: "Choose one:\n• Remove up to 3 damage from chosen character.\n• Remove up to 3 damage from each of your characters with Bodyguard.",
  type: "action",
  inkwell: true,
  colors: ["amber", "steel"],
  cost: 1,
  illustrator: "Sergio Márquez",
  number: 40,
  set: "008",
  rarity: "uncommon",
  abilities: [shesYourPersonAbility],
};
export const itMeansNoWorries: LorcanitoActionCard = {
  id: "u6f",
  name: "It Means No Worries",
  characteristics: ["action", "song"],
  text: "Sing Together 9 (Any number of your or your teammates' characters with total cost 9 or more may {E} to sing this song for free.)\nReturn up to 3 character cards from your discard to your hand. You pay 2 {I} less for the next character you play this turn.",
  type: "action",
  inkwell: false,
  colors: ["amber"],
  cost: 9,
  illustrator: "Gianluca Barone",
  number: 42,
  set: "008",
  rarity: "rare",
  abilities: [
    singerTogetherAbility(9),
    {
      type: "resolution",
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 3,
            upTo: true,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "discard" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    },
    {
      type: "resolution",
      effects: [youPayXLessToPlayNextCharThisTurn(2)],
    },
  ],
};
export const theyNeverComeBack: LorcanitoActionCard = {
  id: "dtw",
  name: "They Never Come Back",
  characteristics: ["action"],
  text: "Up to 2 chosen characters can’t ready at the start of their next turn. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "restriction",
          restriction: "ready-at-start-of-turn",
          duration: "next_turn",
          target: {
            type: "card",
            value: 2,
            upTo: true,
            filters: chosenCharacter.filters,
          },
        },
        drawACard,
      ],
    },
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  illustrator: "Saulo Nate",
  number: 78,
  set: "008",
  rarity: "uncommon",
};
export const everybodysGotAWeakness: LorcanitoActionCard = {
  id: "j44",
  name: "Everybody's Got A Weakness",
  characteristics: ["action"],
  text: "Move 1 damage counter from each damaged character you have in play to chosen opposing character. Draw a card for each damage counter moved this way.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        moveDamageEffect({
          amount: 1,
          from: yourCharacters,
          to: chosenOpposingCharacter,
        }),
        drawXCards({
          dynamic: true,
          filters: [
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            { filter: "owner", value: "self" },
            { filter: "status", value: "damaged" },
          ],
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  illustrator: "Linh Dang",
  number: 82,
  set: "008",
  rarity: "rare",
};
export const heWhoStealsAndRunsAway: LorcanitoActionCard = {
  id: "s8j",
  name: "He Who Steals And Runs Away",
  characteristics: ["action"],
  text: "Banish chosen item. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "banish",
          target: chosenItem,
        },
        drawACard,
      ],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  illustrator: "Luis Huerta",
  number: 114,
  set: "008",
  rarity: "common",
};
export const stoppedChaosInItsTracks: LorcanitoActionCard = {
  id: "cm3",
  name: "Stopped Chaos In Its Tracks",
  characteristics: ["action", "song"],
  text: "Sing Together 8\nReturn up to 2 chosen characters with 3 {S} or less each to their player's hand.",
  type: "action",
  inkwell: true,
  colors: ["emerald"],
  cost: 8,
  illustrator: "Edu Francisco",
  number: 115,
  set: "008",
  rarity: "uncommon",
  abilities: [
    singerTogetherAbility(8),
    {
      type: "resolution",
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 2,
            upTo: true,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              {
                filter: "attribute",
                value: "strength",
                comparison: { operator: "lte", value: 3 },
              },
            ],
          },
        },
      ],
    },
  ],
};
const walkThePlankGainedAbility: ActivatedAbility = {
  type: "activated",
  costs: [{ type: "exert" }],
  effects: [
    {
      type: "banish",
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
const walkThePlankAbility: ResolutionAbility = {
  type: "resolution",
  effects: [
    {
      type: "ability",
      ability: "custom",
      duration: "turn",
      modifier: "add",
      customAbility: walkThePlankGainedAbility,
      target: {
        type: "card",
        value: "all",
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "owner", value: "self" },
          { filter: "characteristics", value: ["pirate"] },
        ],
      },
    },
  ],
};
export const walkThePlank: LorcanitoActionCard = {
  id: "yl4",
  name: "Walk The Plank!",
  characteristics: ["action"],
  text: 'Your Pirate characters gain "{E} – Banish chosen damaged character" this turn.',
  type: "action",
  inkwell: false,
  colors: ["emerald", "steel"],
  cost: 3,
  illustrator: "Alberto Zermeno",
  number: 118,
  set: "008",
  rarity: "uncommon",
  abilities: [walkThePlankAbility],
};
const lightTheFuseAbility: ResolutionAbility = {
  type: "resolution",
  effects: [
    {
      type: "damage",
      amount: {
        dynamic: true,
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "owner", value: "self" },
          {
            filter: "status",
            value: "exerted",
          },
        ],
      },
      target: chosenCharacter,
    },
  ],
};
export const lightTheFuse: LorcanitoActionCard = {
  id: "cep",
  name: "Light The Fuse",
  characteristics: ["action"],
  text: "Deal 1 damage to chosen character for each exerted character you have in play.",
  type: "action",
  inkwell: false,
  colors: ["ruby", "steel"],
  cost: 1,
  illustrator: "Kenneth Anderson",
  number: 149,
  set: "008",
  rarity: "uncommon",
  abilities: [lightTheFuseAbility],
};
export const pouncingPractice: LorcanitoActionCard = {
  id: "bxz",
  name: "Pouncing Practice",
  characteristics: ["action"],
  text: "Chosen character gets -2 {S} this turn. Chosen character of yours gains Evasive this turn.",
  type: "action",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Moniek Schilder",
  number: 176,
  set: "008",
  rarity: "uncommon",
  abilities: [
    {
      type: "resolution",
      effects: [chosenCharacterGainsEvasive],
    },
    {
      type: "resolution",
      effects: [chosenCharacterGetsStrength(-2)],
    },
  ],
};
const downInNewOrleansFilter: TargetFilter[] = [
  { filter: "owner", value: "self" },
  { filter: "zone", value: "deck" },
  { filter: "type", value: ["character", "item", "location"] },
  {
    filter: "attribute",
    value: "cost",
    comparison: { operator: "lte", value: 6 },
  },
];
const downInNewOrleansAbility: ResolutionAbility = {
  type: "resolution",
  effects: [
    {
      type: "scry",
      amount: 3,
      mode: "bottom",
      shouldRevealTutored: true,
      playExerted: false,
      target: self,
      limits: {
        bottom: 3,
        play: 1,
      },
      playFilters: downInNewOrleansFilter,
      tutorFilters: downInNewOrleansFilter,
    },
  ],
};
export const downInNewOrleans: LorcanitoActionCard = {
  id: "py1",
  name: "Down In New Orleans",
  characteristics: ["action", "song"],
  text: "Look at the top 3 cards of your deck. You may reveal a character, item, or location card with cost 6 or less and play it for free. Put the rest on the bottom of your deck in any order.",
  type: "action",
  inkwell: false,
  colors: ["sapphire"],
  cost: 6,
  illustrator: "Robin Chung",
  number: 177,
  set: "008",
  rarity: "super_rare",
  abilities: [downInNewOrleansAbility],
};
