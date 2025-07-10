import {
  ResolutionAbility,
  type TriggeredAbility,
} from "@lorcanito/lorcana-engine/abilities/abilities";
import { atTheEndOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import {
  discardACard,
  exertedCharCantReadyNextTurn,
  opponentRevealHand,
  readyAndCantQuest,
  youPayXLessToPlayNextCharThisTurn,
} from "@lorcanito/lorcana-engine/effects/effects";
import type {
  CardEffectTarget,
  PlayerEffectTarget,
} from "@lorcanito/lorcana-engine/effects/effectTargets";
import type {
  AttributeEffect,
  CardRestrictionEffect,
  DrawEffect,
  ReplacementEffect,
} from "@lorcanito/lorcana-engine/effects/effectTypes";
import {
  type AbilityEffect,
  type BanishEffect,
  type DamageEffect,
  HealEffect,
  type LoreEffect,
} from "@lorcanito/lorcana-engine/effects/effectTypes";

const targetTriggerCard: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [{ filter: "source", value: "trigger" }],
};

const banishSelf: BanishEffect = {
  type: "banish",
  target: targetTriggerCard,
};

const atEndOfTurnBanishItself: TriggeredAbility = atTheEndOfYourTurn({
  effects: [banishSelf],
  // target: targetTriggerCard,
});

const self: PlayerEffectTarget = {
  type: "player",
  value: "self",
};
const opponent: PlayerEffectTarget = {
  type: "player",
  value: "opponent",
};
const drawACard: DrawEffect = {
  type: "draw",
  amount: 1,
  target: self,
};
const chosenItemOfYours: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "item" },
    { filter: "owner", value: "self" },
  ],
};
const chosenVillainOfYours: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "character" },
    { filter: "owner", value: "self" },
    { filter: "characteristics", value: ["villain"] },
  ],
};
const chosenCharacterOfYour: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "character" },
    { filter: "owner", value: "self" },
  ],
};
const chosenCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "character" },
  ],
};
const chosenDamagedCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    {
      filter: "status",
      value: "damage",
      comparison: { operator: "gte", value: 1 },
    },
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
  ],
};
export const holdStill: LorcanitoActionCard = {
  id: "y6k",

  name: "Hold Still",
  characteristics: ["action"],
  text: "Remove up to 4 damage from chosen character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Remove up to 4 damage from chosen character.",
      effects: [
        {
          type: "heal",
          amount: 4,
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour: "This might sting a little.",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  illustrator: "Connie Kang / Jackie Droujko",
  number: 28,
  set: "ROF",
  rarity: "common",
};
export const lastStand: LorcanitoActionCard = {
  id: "yh3",

  name: "Last Stand",
  characteristics: ["action"],
  text: "Banish chosen character who was challenged this turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Banish chosen character who was challenged this turn.",
      effects: [
        {
          type: "banish",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "play" },
              { filter: "type", value: "character" },
              { filter: "was-challenged" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "Let’s finish this, binturi.\n–Namaari",
  colors: ["amber"],
  cost: 2,
  illustrator: "Aisha Durmagambetova",
  number: 29,
  set: "ROF",
  rarity: "uncommon",
};

export const paintingTheRosesRed: LorcanitoActionCard = {
  id: "g0a",

  name: "Painting the Roses Red",
  characteristics: ["action", "song"],
  text: "_(A character with cost 2 or more can {E} to sing this song for free.)_\n\nUp to 2 chosen characters get -1 {S} this turn. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Painting the Roses Red",
      text: "Up to 2 chosen characters get -1 {S} this turn. Draw a card.",
      detrimental: true,
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 1,
          modifier: "subtract",
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
        drawACard,
      ],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  illustrator: "Matt Chapman",
  number: 30,
  set: "ROF",
  rarity: "common",
};
export const worldsGreatestCriminalMind: LorcanitoActionCard = {
  id: "c97",

  name: "World's Greatest Criminal Mind",
  characteristics: ["action", "song"],
  text: "_A character with cost 3 or more can {E} to sing this song for free.)_\n\nBanish chosen character with 5 {S} or more.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "World's Greatest Criminal Mind",
      text: "Banish chosen character with 5 {S} or more.",
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
                filter: "attribute",
                value: "strength",
                comparison: { operator: "gte", value: 5 },
              },
            ],
          },
        } as BanishEffect,
      ],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  illustrator: "Giulia Riva",
  number: 31,
  set: "ROF",
  rarity: "rare",
};
export const zeroToHero: LorcanitoActionCard = {
  id: "uyt",

  name: "Zero To Hero",
  characteristics: ["action", "song"],
  text: "_A character with cost 2 or more can {E} to sing this song for free.)_\n\nCount the number of characters you have in play. You pay that amount of {I} less for the next character you play this turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      optional: false,
      effects: [
        youPayXLessToPlayNextCharThisTurn({
          dynamic: true,
          filters: [
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            { filter: "owner", value: "self" },
          ],
        }),
      ],
    },
  ],
  colors: ["amber"],
  cost: 2,
  illustrator: "Rob Di Salvo",
  number: 32,
  set: "ROF",
  rarity: "uncommon",
};
export const gruesomeAndGrim: LorcanitoActionCard = {
  id: "zcv",
  name: "Gruesome And Grim",
  characteristics: ["action", "song"],
  text: "_A character with cost 3 or more can {E} to sing this song for free.)_\n\nPlay a character with cost 4 or less for free. They gain **Rush**. At the end of the turn, banish them. _(They can challenge the turn they're played.)_",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Gruesome And Grim",
      text: "Play a character with cost 4 or less for free. They gain **Rush**. At the end of the turn, banish them.",
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
              {
                filter: "attribute",
                value: "cost",
                comparison: { operator: "lte", value: 4 },
              },
            ],
          },
        },
        {
          type: "ability",
          ability: "rush",
          modifier: "add",
          duration: "turn",
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "source", value: "target" }],
          },
        } as AbilityEffect,
        {
          type: "ability",
          ability: "custom",
          modifier: "add",
          duration: "turn",
          customAbility: atEndOfTurnBanishItself,
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "source", value: "target" }],
          },
        } as AbilityEffect,
      ],
    },
  ],
  colors: ["amethyst"],
  cost: 3,
  illustrator: "Mariana Moreno",
  number: 62,
  set: "ROF",
  rarity: "rare",
};
export const imStuck: LorcanitoActionCard = {
  id: "t6t",

  name: "I'm Stuck!",
  characteristics: ["action"],
  text: "Chosen exerted character can't ready at the start of their next turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Chosen exerted character can't ready at the start of their next turn.",
      effects: [exertedCharCantReadyNextTurn],
    },
  ],
  flavour: "Oh, bother−not again.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  illustrator: "Rob Di Salve",
  number: 63,
  set: "ROF",
  rarity: "common",
};
export const legendOfTheSwordInTheStone: LorcanitoActionCard = {
  id: "fjm",

  name: "Legend of the Sword in the Stone",
  characteristics: ["action", "song"],
  text: "_(A character with cost 2 or more can {E} to sing this song for free.)_\n\nChosen character gains **Challenger** +3 this turn. _(They get +3 {S} while challenging.)_",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "ability",
          ability: "challenger",
          amount: 3,
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour:
    "A legend is sung of when England was young \nAnd knights were brave and bold",
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Kuya Jaypi",
  number: 64,
  set: "ROF",
  rarity: "common",
};
export const bibbidiBobbidiBoo: LorcanitoActionCard = {
  id: "waz",

  name: "Bibbidi Bobbidi Boo",
  characteristics: ["action", "song"],
  text: "_A character with cost 3 or more can {E} to sing this song for free.)_\n\nReturn chosen character of yours to your hand to play another character with the same cost or less for free.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      optional: false,
      name: "Bibbidi Bobbidi Boo",
      text: "Return chosen character of yours to your hand to play another character with the same cost or less for free.",
      resolveEffectsIndividually: true,
      dependentEffects: true,
      effects: [
        {
          type: "play",
          forFree: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "owner", value: "self" },
              { filter: "zone", value: "hand" },
            ],
          },
        },
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "It'll do magic, believe it or not",
  colors: ["emerald"],
  cost: 3,
  illustrator: "LadyShalirin",
  number: 96,
  set: "ROF",
  rarity: "rare",
};
export const bounce: LorcanitoActionCard = {
  id: "fpf",
  name: "Bounce",
  characteristics: ["action"],
  text: "Return chosen character of yours to your hand to return another chosen character to their player's hand.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      optional: false,
      resolveEffectsIndividually: true,
      dependentEffects: true,
      effects: [
        {
          type: "move",
          to: "hand",
          target: chosenCharacter,
        },
        {
          type: "move",
          to: "hand",
          target: chosenCharacterOfYour,
        },
      ],
    },
  ],
  flavour: "Are you ready for some bouncing?\n−Tigger",
  colors: ["emerald"],
  cost: 2,
  illustrator: "Bill Robinson",
  number: 97,
  set: "ROF",
  rarity: "uncommon",
};
export const hypnotize: LorcanitoActionCard = {
  id: "awj",

  name: "Hypnotize",
  characteristics: ["action"],
  text: "Each opponent chooses and discards a card. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      optional: false,
      effects: [{ type: "draw", amount: 1, target: self }],
    },
    {
      type: "resolution",
      optional: false,
      responder: "opponent",
      effects: [discardACard],
    },
  ],
  flavour: "Look me in the eye when I’m speaking to you.",
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  illustrator: "Lauren Levering",
  number: 98,
  set: "ROF",
  rarity: "common",
};
export const improvise: LorcanitoActionCard = {
  id: "m0h",

  name: "Improvise",
  characteristics: ["action"],
  text: "Chosen character gets +1 {S} this turn. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Improvise",
      text: "Chosen character gets +1 {S} this turn. Draw a card.",
      resolveEffectsIndividually: true,
      effects: [
        {
          type: "draw",
          amount: 1,
          target: self,
        },
        {
          type: "attribute",
          attribute: "strength",
          amount: 1,
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour: "Shan-Yu: It looks like you’re out of ideas. \nMulan: Not quite!",
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  illustrator: "Mane Kandalyan",
  number: 99,
  set: "ROF",
  rarity: "common",
};
export const packTactics: LorcanitoActionCard = {
  id: "yp2",

  name: "Pack Tactics",
  characteristics: ["action"],
  text: "Gain 1 lore for each damaged character opponents have in play.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "lore",
          modifier: "add",
          target: self,
          amount: {
            dynamic: true,
            amount: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "owner", value: "opponent" },
              {
                filter: "status",
                value: "damage",
                comparison: { operator: "gte", value: 1 },
              },
            ],
          },
        } as LoreEffect,
      ],
    },
  ],
  flavour:
    "Pacha: You want to survive the jungle? Start thinking like you belong here. \nKuzco: No problem . . . Grrr, look at me, I'm a jaguar.",
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  illustrator: "Don Aguillo",
  number: 100,
  set: "ROF",
  rarity: "rare",
};

export const ringTheBell: LorcanitoActionCard = {
  id: "bvn",

  name: "Ring The Bell",
  characteristics: ["action"],
  text: "Banish chosen damaged character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "banish",
          target: chosenDamagedCharacter,
        },
      ],
    },
  ],
  flavour: "I’m afraid that you’ve gone and upset me. \n– Ratigan",
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  illustrator: "Brian Weisz",
  number: 101,
  set: "ROF",
  rarity: "uncommon",
};
export const goTheDistance: LorcanitoActionCard = {
  id: "k1y",

  name: "Go the Distance",
  characteristics: ["action", "song"],
  text: "_(A character with cost 2 or more can {E} to sing this song for free.)_\n\nReady chosen damaged character of yours. They can't quest for the rest of this turn. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        ...readyAndCantQuest({
          type: "card",
          value: 1,
          filters: [
            { filter: "owner", value: "self" },
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            {
              filter: "status",
              value: "damage",
              comparison: { operator: "gte", value: 1 },
            },
          ],
        }),
        {
          type: "draw",
          amount: 1,
          target: self,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  illustrator: "Gaku Kumatori",
  number: 129,
  set: "ROF",
  rarity: "common",
};
export const teethAndAmbitions: LorcanitoActionCard = {
  id: "dvr",

  name: "Teeth and Ambitions",
  characteristics: ["action", "song"],
  text: "_A character with cost 2 or more can {E} to sing this song for free.)_\n\nDeal 2 damage to chosen character of yours to deal 2 damage to another chosen character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Deal 2 damage to chosen character of yours to deal 2 damage to another chosen character.",
      dependentEffects: true,
      resolveEffectsIndividually: true,
      effects: [
        {
          type: "damage",
          amount: 2,
          target: chosenCharacter,
        },
        {
          type: "damage",
          amount: 2,
          target: chosenCharacterOfYour,
        },
      ],
    },
  ],
  flavour:
    "Of course, quid pro quo, you’re expected \nTo take certain duties on board",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  illustrator: "Jake Parker",
  number: 130,
  set: "ROF",
  rarity: "rare",
};
export const theMostDiabolicalScheme: LorcanitoActionCard = {
  id: "qad",

  name: "The Most Diabolical Scheme",
  characteristics: ["action", "song"],
  text: "_(A character with cost 3 or more can {E} to sing this song for free.)_\n\nBanish chosen Villain of yours to banish chosen character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      dependentEffects: true,
      resolveEffectsIndividually: true,
      effects: [
        {
          type: "banish",
          target: chosenCharacter,
        },
        {
          type: "banish",
          target: chosenVillainOfYours,
        },
      ],
    },
  ],
  flavour: "New comes the real tour de force \nTricky and wicked, of course",
  colors: ["ruby"],
  cost: 3,
  illustrator: "Carlos Ruiz",
  number: 131,
  set: "ROF",
  rarity: "uncommon",
};
export const whatDidYouCallMe: LorcanitoActionCard = {
  id: "vrt",

  name: "What did you call me?",
  characteristics: ["action"],
  text: "Chosen damaged character gets +3 {S} this turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "What did you call me?",
      text: "Chosen damaged character gets +3 {S} this turn.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 3,
          modifier: "add",
          duration: "turn",
          target: chosenDamagedCharacter,
        },
      ],
    },
  ],
  flavour:
    "No one can have a higher opinion of you than I have, and I think you’re a slimy, contemptible sewer rat! \n−Basil",
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  illustrator: "Luis Huerta",
  number: 132,
  set: "ROF",
  rarity: "common",
};
export const youCanFly: LorcanitoActionCard = {
  id: "yio",

  name: "You Can Fly",
  characteristics: ["action", "song"],
  text: "_(A character with cost 2 or more can {E} to sing this song for free.)_\n\nChosen character gains **Evasive** until the start of your next turn. _Only characters with Evasive can challenge them.)_",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "ability",
          ability: "evasive",
          modifier: "add",
          duration: "next_turn",
          until: true,
          target: chosenCharacter,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  illustrator: "Eva Widermann",
  number: 133,
  set: "ROF",
  rarity: "uncommon",
};
export const fallingDownTheRabbitHole: LorcanitoActionCard = {
  id: "j9g",
  name: "Falling Down the Rabbit Hole",
  characteristics: ["action"],
  text: "Each player chooses one of their characters and puts them into their inkwell facedown and exerted.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Falling Down the Rabbit Hole",
      text: "Each player chooses one of their characters and puts them into their inkwell facedown and exerted.",
      responder: "self",
      effects: [
        {
          type: "move",
          to: "inkwell",
          exerted: true,
          target: chosenCharacterOfYour,
        },
      ],
    },
    {
      type: "resolution",
      name: "Falling Down the Rabbit Hole",
      text: "Each player chooses one of their characters and puts them into their inkwell facedown and exerted.",
      responder: "opponent",
      effects: [
        {
          type: "move",
          to: "inkwell",
          exerted: true,
          target: chosenCharacterOfYour,
        },
      ],
    },
  ],
  flavour:
    "Down, down, down she went, floating in a swirl of ink. How curious!",
  colors: ["sapphire"],
  cost: 4,
  illustrator: "Lissette Carrera",
  number: 162,
  set: "ROF",
  rarity: "rare",
};
export const fourDozenEggs: LorcanitoActionCard = {
  id: "cww",

  name: "Four Dozen Eggs",
  characteristics: ["action", "song"],
  text: "_(A character with cost 4 or more can {E} to sing this\nsong for free.)_\n\nYour characters gain **Resist** +2 until the start of your next turn. _(Damage dealt to them is reduced by 2.)_",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Four Dozen Eggs",
      text: "Your characters gain **Resist** +2 until the start of your next turn. _(Damage dealt to them is reduced by 2.)_",
      effects: [
        {
          type: "ability",
          ability: "resist",
          amount: 2,
          modifier: "add",
          duration: "next_turn",
          until: true,
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "play" },
              { filter: "type", value: "character" },
              { filter: "owner", value: "self" },
            ],
          },
        } as AbilityEffect,
      ],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  illustrator: "Jochem Van Gool",
  number: 163,
  set: "ROF",
  rarity: "uncommon",
};

export const launch: LorcanitoActionCard = {
  id: "mu2",

  name: "Launch",
  characteristics: ["action"],
  text: "Banish chosen item of yours to deal 5 damage to chosen character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Banish chosen item of yours to deal 5 damage to chosen character.",
      resolveEffectsIndividually: true,
      dependentEffects: true,
      detrimental: true,
      effects: [
        {
          type: "damage",
          amount: 5,
          target: chosenCharacter,
        } as DamageEffect,
        {
          type: "banish",
          target: chosenItemOfYours,
        } as BanishEffect,
      ],
    },
  ],
  flavour: "Ready . . . aim . . . coconut?",
  colors: ["sapphire"],
  cost: 3,
  illustrator: "Juan Diego Leon",
  number: 164,
  set: "ROF",
  rarity: "uncommon",
};

export const nothingToHide: LorcanitoActionCard = {
  id: "q9s",

  name: "Nothing to Hide",
  characteristics: ["action"],
  text: "Each opponent reveals their hand. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Nothing to Hide",
      text: "Each opponent reveals their hand. Draw a card.",
      effects: [
        {
          type: "draw",
          amount: 1,
          target: self,
        },
        opponentRevealHand,
      ],
    },
  ],
  flavour: "Helps you avoid unpleasant surprises.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  illustrator: "Mane Kandalyan / Jochem Van Gool",
  number: 165,
  set: "ROF",
  rarity: "common",
};
export const charge: LorcanitoActionCard = {
  id: "koq",
  name: "Charge!",
  characteristics: ["action"],
  text: "Chosen character gains **Challenger** +2 and **Resist** +2 this turn. _(They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)_",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Charge",
      text: "Chosen character gains **Challenger** +2 and **Resist** +2 this turn. _(They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)_",
      effects: [
        {
          type: "ability",
          ability: "challenger",
          amount: 2,
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
        } as AbilityEffect,
        {
          type: "ability",
          ability: "resist",
          amount: 2,
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
        } as AbilityEffect,
      ],
    },
  ],
  flavour: "Sometimes subtlety is required. This is not one of those times.",
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  illustrator: "Hedvig Häggman-Sund",
  number: 198,
  set: "ROF",
  rarity: "common",
};
export const letTheStormRageOn: LorcanitoActionCard = {
  id: "dlc",
  name: "Let the Storm Rage On",
  characteristics: ["action", "song"],
  text: "_(A character with cost 3 or more can {E} to sing this song for free.)_\n\nDeal 2 damage to chosen character. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Let the Storm Rage On",
      text: "Deal 2 damage to chosen character. Draw a card.",
      detrimental: true,
      resolveEffectsIndividually: true,
      effects: [
        drawACard,
        {
          type: "damage",
          amount: 2,
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour: "The cold never bothered me anyway",
  colors: ["steel"],
  cost: 3,
  illustrator: "R. la Barbera / L. Giammichele",
  number: 199,
  set: "ROF",
  rarity: "common",
};
export const pickAFight: LorcanitoActionCard = {
  id: "mmh",

  name: "Pick a Fight",
  characteristics: ["action"],
  text: "Chosen character can challenge ready characters this turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Pick a Fight",
      text: "Chosen character can challenge ready characters this turn.",
      effects: [
        {
          type: "ability",
          ability: "challenge_ready_chars",
          modifier: "add",
          duration: "turn",
          until: true,
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour: "I'm gonna wreck it!",
  colors: ["steel"],
  cost: 2,
  illustrator: "Pablo Hidalgo / Jeff Merghart",
  number: 200,
  set: "ROF",
  rarity: "uncommon",
};
export const strengthOfARagingFire: LorcanitoActionCard = {
  id: "x5y",

  name: "Strength of a Raging Fire",
  characteristics: ["action", "song"],
  text: "_A character with cost 3 or more can {E} to sing this song for free.)_\n\nDeal damage to chosen character equal to the number of characters you have in play.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Strength of a Raging Fire",
      text: "Deal damage to chosen character equal to the number of characters you have in play.",
      effects: [
        {
          type: "damage",
          target: chosenCharacter,
          amount: {
            dynamic: true,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "Tranquil as a forest \nBut on fire within",
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  illustrator: "Jared Nickerl / Alex Accorsi",
  number: 201,
  set: "ROF",
  rarity: "rare",
};
