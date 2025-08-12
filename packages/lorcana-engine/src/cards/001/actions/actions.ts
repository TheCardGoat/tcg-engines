import type { Trigger } from "@lorcanito/lorcana-engine";
import type { FloatingTriggeredAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { chosenDamagedCharacter } from "@lorcanito/lorcana-engine/abilities/target";
import {
  chosenCharacter,
  self,
} from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import {
  chosenCharacterGainsSupport,
  dealDamageEffect,
  mayBanish,
  readyAndCantQuest,
} from "@lorcanito/lorcana-engine/effects/effects";
import type {
  AbilityEffect,
  DamageEffect,
  DiscardEffect,
  LoreEffect,
  TargetConditionalEffect,
} from "@lorcanito/lorcana-engine/effects/effectTypes";
export const controlYourTemper: LorcanitoActionCard = {
  id: "eny",
  name: "Control Your Temper!",
  characteristics: ["action"],
  text: "Chosen characters gets -2 {S} this turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "subtract",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  illustrator: "Amber Kommavongsa",
  number: 26,
  set: "TFC",
  rarity: "common",
};

export const healingGlow: LorcanitoActionCard = {
  id: "ta0",
  name: "Healing Glow",
  characteristics: ["action"],
  text: "Remove up to 2 damage from chosen character.",
  type: "action",
  rarity: "common",
  abilities: [
    {
      type: "resolution",
      name: "Healing Glow",
      text: "Remove up to 2 damage from chosen character.",
      effects: [
        {
          type: "heal",
          amount: 2,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "Don't freak out! Rapunzel",
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  illustrator: "Philipp Kruse",
  number: 28,
  set: "TFC",
};

export const justInTime: LorcanitoActionCard = {
  id: "gir",
  name: "Just in Time",
  characteristics: ["action"],
  text: "You may play a character with cost 5 or less for free.",
  type: "action",
  abilities: [
    {
      type: "resolution",
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
              {
                filter: "attribute",
                value: "cost",
                comparison: { operator: "lte", value: 5 },
              },
            ],
          },
        },
      ],
    },
  ],
  flavour:
    "The best heroes always arrive at the perfect moment− \rwhether they know it or not.",
  colors: ["amber"],
  cost: 3,
  illustrator: "Leonardo Giammichele",
  number: 29,
  set: "TFC",
  rarity: "rare",
};

export const youHaveForgottenMe: LorcanitoActionCard = {
  id: "z53",
  name: "You Have Forgotten Me",
  characteristics: ["action"],
  text: "Each opponent chooses and discards 2 cards.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "You Have Forgotten Me",
      text: "Each opponent chooses and discards two cards.",
      optional: false,
      responder: "opponent",
      effects: [
        {
          type: "discard",
          amount: 2,
          target: {
            type: "card",
            value: 2,
            filters: [
              { filter: "zone", value: "hand" },
              { filter: "owner", value: "self" },
            ],
          },
        } as DiscardEffect,
      ],
    },
  ],
  flavour: "You are more than what you have become. \n−Mufasa",
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  illustrator: "Alice Pisoni",
  number: 31,
  set: "TFC",
  rarity: "uncommon",
};

export const befuddle: LorcanitoActionCard = {
  id: "teb",
  name: "Befuddle",
  characteristics: ["action"],
  text: "Return a character or item with cost 2 or less to their player's hand.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Befuddle",
      text: "Return a character or item with cost 2 or less to their player's hand.",
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: ["character", "item"] },
              { filter: "zone", value: "play" },
              {
                filter: "attribute",
                value: "cost",
                comparison: { operator: "lte", value: 2 },
              },
            ],
          },
        },
      ],
    },
  ],
  flavour: "Never be afraid to have your mind boggled now and then.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  illustrator: "Kendall Hale",
  number: 62,
  set: "TFC",
  rarity: "uncommon",
};

export const freeze: LorcanitoActionCard = {
  id: "e7s",
  name: "Freeze",
  characteristics: ["action"],
  text: "Exert chosen opposing character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Freeze",
      text: "Exert chosen opposing character.",
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
              { filter: "owner", value: "opponent" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "It's time for you to chill.",
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Cristian Romero",
  number: 63,
  set: "TFC",
  rarity: "common",
};

export const doItAgain: LorcanitoActionCard = {
  id: "yld",
  name: "Do It Again!",
  characteristics: ["action"],
  text: "Return an action card from your discard to your hand.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Do It Again!",
      text: "Return an action card from your discard to your hand.",
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "type", value: ["action"] },
              { filter: "zone", value: "discard" },
            ],
          },
        },
      ],
    },
  ],
  flavour:
    ". . . Then scrub the terrace, sweep the halls and the stairs, clean the chimneys. And of course there's the mending, and the sewing, and the laundry . . . −Lady Tremaine",
  colors: ["emerald"],
  cost: 3,
  illustrator: "Ellie Horie",
  number: 94,
  set: "TFC",
  rarity: "rare",
};

export const stampede: LorcanitoActionCard = {
  id: "eje",
  name: "Stampede",
  characteristics: ["action"],
  text: "Deal 2 damage to chosen damaged character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Stampede",
      text: "Deal 2 damage to chosen damaged character.",
      effects: [
        {
          type: "damage",
          amount: 2,
          target: chosenDamagedCharacter,
        } as DamageEffect,
      ],
    },
  ],
  flavour:
    "A wildebeest stampede is like a raging river: best experienced from a distance.",
  colors: ["emerald"],
  cost: 1,
  illustrator: "Matt Chapman",
  number: 96,
  set: "TFC",
  rarity: "common",
};

export const stealFromRich: LorcanitoActionCard = {
  id: "wje",
  name: "Steal from the Rich",
  characteristics: ["action"],
  text: "Whenever one of your characters quests this turn, each opponent loses 1 lore.",
  type: "action",
  abilities: [
    {
      type: "floating-triggered",
      duration: "turn",
      trigger: {
        on: "quest",
        target: {
          type: "card",
          value: "all",
          filters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "play" },
            { filter: "type", value: "character" },
          ],
        },
      } as Trigger,
      layer: {
        type: "resolution",
        effects: [
          {
            type: "lore",
            amount: 1,
            modifier: "subtract",
            target: {
              type: "player",
              value: "opponent",
            },
          } as LoreEffect,
        ],
      },
    } as FloatingTriggeredAbility,
  ],
  flavour:
    "Wonder how much ol' Prince John spent on all those fancy locks. \n−Little John",
  colors: ["emerald"],
  cost: 5,
  illustrator: "Hedvig Häggman-Sund",
  number: 97,
  set: "TFC",
  rarity: "rare",
};

export const theBeastIsMine: LorcanitoActionCard = {
  id: "mlb",
  name: "The Beast is Mine!",
  characteristics: ["action"],
  text: "Chosen character gains **Reckless** during their next turn. _(They can‘t quest and must challenge if able.)_",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "The Beast is Mine!",
      text: "Chosen character gains **Reckless** during their next turn. _(They can‘t quest and must challenge if able.)_",
      effects: [
        {
          type: "ability",
          ability: "reckless",
          modifier: "add",
          duration: "next_turn",
          target: chosenCharacter,
        } as AbilityEffect,
      ],
    },
  ],
  flavour:
    "It‘s only fitting that the finest hunter gets the foulest \rbeast!<br />\r− Gaston",
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  illustrator: "\tMatthew Robert Davies",
  number: 99,
  set: "TFC",
  rarity: "uncommon",
};

export const viciousBetrayal: LorcanitoActionCard = {
  id: "e6i",
  name: "Vicious Betrayal",
  characteristics: ["action"],
  text: "Chosen character gets +2 {S} this turn. If a Villain character is chosen, they get +3 {S} instead.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "target-conditional",
          autoResolve: false,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "characteristics", value: ["villain"] },
            ],
          },
          effects: [
            {
              type: "attribute",
              attribute: "strength",
              amount: 3,
              modifier: "add",
              duration: "turn",
              target: {
                type: "card",
                value: 1,
                filters: [
                  { filter: "type", value: "character" },
                  { filter: "zone", value: "play" },
                  { filter: "characteristics", value: ["villain"] },
                ],
              },
            },
          ],
          fallback: [
            {
              type: "attribute",
              attribute: "strength",
              amount: 2,
              modifier: "add",
              duration: "turn",
              target: {
                type: "card",
                value: 1,
                filters: [
                  { filter: "type", value: "character" },
                  { filter: "zone", value: "play" },
                ],
              },
            },
          ],
        } as TargetConditionalEffect,
      ],
    },
  ],
  flavour: "A true king takes matters into his own claws. −Scar",
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  illustrator: "Michaela Martin",
  number: 100,
  set: "TFC",
  rarity: "common",
};

export const cutToTheChase: LorcanitoActionCard = {
  id: "cei",
  name: "Cut to the Chase",
  characteristics: ["action"],
  text: "Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Cut to the Chase",
      text: "Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
      effects: [
        {
          type: "ability",
          ability: "rush",
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
        } as AbilityEffect,
      ],
    },
  ],
  flavour: "Surprise!",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  illustrator: "Ellie Horie",
  number: 129,
  set: "TFC",
  rarity: "uncommon",
};

export const dragonFire: LorcanitoActionCard = {
  id: "buy",
  name: "Dragon Fire",
  characteristics: ["action"],
  text: "Banish chosen character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Dragon Fire",
      text: "Banish chosen character.",
      effects: [mayBanish(chosenCharacter)],
    },
  ],
  flavour: "Rare is the hero who can withstand a dragon's wrath.",
  colors: ["ruby"],
  cost: 5,
  illustrator: "Luis Huerta",
  number: 130,
  set: "TFC",
  rarity: "uncommon",
};

export const fanTheFlames: LorcanitoActionCard = {
  id: "afx",
  name: "Fan The Flames",
  characteristics: ["action"],
  text: "Ready chosen character. They can't quest for the rest of this turn.",
  type: "action",
  abilities: [
    // {
    //   type: "resolution",
    //   name: "Fan The Flames",
    //   text: "Ready chosen character. They can't quest for the rest of this turn.",
    //   effects: readyAndCantQuest({
    //     type: "card",
    //     value: 1,
    //     filters: [
    //       { filter: "type", value: "character" },
    //       { filter: "zone", value: "play" },
    //     ],
    //   }),
    // },
  ],
  flavour: "Pretty words can move a crowd, but so can ugly ones.",
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  illustrator: "Jenna Gray",
  number: 131,
  set: "TFC",
  rarity: "uncommon",
};

export const hesGotASword: LorcanitoActionCard = {
  id: "wmw",
  name: "He's Got a Sword!",
  characteristics: ["action"],
  text: "Chosen character gets +2 {S} this turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "add",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "We've all got swords! \n−Razoul",
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  illustrator: "Koni",
  number: 132,
  set: "TFC",
  rarity: "common",
};

export const tangle: LorcanitoActionCard = {
  id: "kni",
  name: "Tangle",
  characteristics: ["action"],
  text: "Each opponent loses 1 lore.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "lore",
          amount: 1,
          modifier: "subtract",
          target: {
            type: "player",
            value: "opponent",
          },
        } as LoreEffect,
      ],
    },
  ],
  flavour:
    "Stay right here! I mean, you don't have a choice, I guess. But still! Don't move! \n− Rapunzel",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  illustrator: "Eri Welli",
  number: 133,
  set: "TFC",
  rarity: "common",
};
export const developYourBrain: LorcanitoActionCard = {
  id: "yy9",

  name: "Develop Your Brain",
  characteristics: ["action"],
  text: "Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of the deck.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Develop Your Brain",
      text: "Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of the deck.",
      effects: [
        {
          type: "scry",
          amount: 2,
          mode: "bottom",
          shouldRevealTutored: false,
          target: self,
          limits: {
            bottom: 1,
            inkwell: 0,
            hand: 1,
            top: 0,
          },
          tutorFilters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "deck" },
          ],
        },
      ],
    },
  ],
  flavour:
    "„Knowledge, wisdom−there‘s the <b>real</b> power!\u0003<br />−Merlin",
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  illustrator: "Pao Yong",
  number: 161,
  set: "TFC",
  rarity: "common",
};
export const ifItsNotBaroque: LorcanitoActionCard = {
  id: "m65",

  name: "If It's Not Baroque",
  characteristics: ["action"],
  text: "Return an item card from your discard to your hand.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "item" },
              { filter: "owner", value: "self" },
              { filter: "zone", value: "discard" },
            ],
          },
        },
      ],
    },
  ],
  flavour: ". . . Don't fix it.",
  colors: ["sapphire"],
  cost: 3,
  illustrator: "Kenneth Anderson",
  number: 162,
  set: "TFC",
  rarity: "rare",
};
export const workTogether: LorcanitoActionCard = {
  id: "cxh",
  name: "Work Together",
  characteristics: ["action"],
  text: "Chosen character gains **Support** this turn. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Work Together",
      text: "Chosen character gains **Support** this turn.",
      effects: [chosenCharacterGainsSupport("turn")],
    },
  ],
  flavour:
    "Pacha: Put your whole back into it! \nKuzco: This is my whole back!",
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  illustrator: "Bill Robinson",
  number: 165,
  set: "TFC",
  rarity: "common",
};
export const breakAction: LorcanitoActionCard = {
  id: "whn",
  name: "Break",
  characteristics: ["action"],
  text: "Banish chosen item.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "banish",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "item" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "No one throws a tantrum like a beast.",
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  illustrator: "Grace Tran",
  number: 196,
  set: "TFC",
  rarity: "common",
};
export const fireTheCannons: LorcanitoActionCard = {
  id: "lhl",
  name: "Fire the Cannons!",
  characteristics: ["action"],
  text: "Deal 2 damage to chosen character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Fire the Cannons!",
      text: "Deal 2 damage to chosen character.",
      effects: [
        {
          type: "damage",
          amount: 2,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    },
  ],
  flavour:
    "Captain Hook: „Double the powder and shorten the\rfuse!<br />Mr. Smee: „Shorten the powder and double the fuse!",
  colors: ["steel"],
  cost: 1,
  illustrator: "Matt Chapman",
  number: 197,
  set: "TFC",
  rarity: "common",
};
export const ransack: LorcanitoActionCard = {
  id: "cfx",
  name: "Ransack",
  characteristics: ["action"],
  text: "Draw 2 cards, then choose and discard 2 cards.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      resolveEffectsIndividually: true,
      effects: [
        {
          type: "discard",
          amount: 2,
          target: {
            type: "card",
            value: 2,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "zone", value: "hand" },
            ],
          },
        } as DiscardEffect,
        {
          type: "draw",
          amount: 2,
          target: {
            type: "player",
            value: "self",
          },
        },
      ],
    },
  ],
  flavour: "Who has time to read labels?",
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  illustrator: "Amber Kommavongsa",
  number: 199,
  set: "TFC",
  rarity: "uncommon",
};
export const smash: LorcanitoActionCard = {
  id: "ub4",
  name: "Smash",
  characteristics: ["action"],
  text: "Deal 3 damage to the chosen character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Smash",
      text: "Deal 3 damage to chosen character.",
      effects: [dealDamageEffect(3, chosenCharacter)],
    },
  ],
  flavour: '"Go away!"',
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  illustrator: "Simangaliso Sibaya",
  number: 200,
  set: "TFC",
  rarity: "uncommon",
};
