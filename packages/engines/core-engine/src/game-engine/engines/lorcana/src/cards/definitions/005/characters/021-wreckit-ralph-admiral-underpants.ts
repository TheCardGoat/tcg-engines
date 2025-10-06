import type {
  CardEffectTarget,
  LorcanitoCharacterCard,
  ResolutionAbility,
} from "@lorcanito/lorcana-engine";
import {
  returnCharacterFromDiscardToHand,
  youGainLore,
} from "@lorcanito/lorcana-engine/effects/effects";

const targetPrincesInYourDiscard: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "discard" },
    { filter: "owner", value: "self" },
    { filter: "characteristics", value: ["princess"] },
  ],
};

const iveGotTheCoolestFriend: ResolutionAbility = {
  type: "resolution",
  name: "I'VE GOT THE COOLEST FRIEND",
  text: "When you play this character, return a character card from your discard to your hand. If that card is a Princess character card, gain 2 lore.",
  effects: [
    {
      type: "target-conditional",
      effects: [
        {
          type: "move",
          to: "hand",
          target: targetPrincesInYourDiscard,
        },
        youGainLore(2),
      ],
      fallback: [returnCharacterFromDiscardToHand],
      target: targetPrincesInYourDiscard,
    },
  ],
};

export const wreckitRalphAdmiralUnderpants: LorcanitoCharacterCardDefinition = {
  id: "cso",
  name: "Wreck-It Ralph",
  title: "Admiral Underpants",
  characteristics: ["hero", "storyborn"],
  text: "**I’VE GOT THE COOLEST FRIEND** When you play this character, return a character card from your discard to your hand. If that card is a Princess character card, gain 2 lore.",
  type: "character",
  abilities: [iveGotTheCoolestFriend],
  flavour: "If he must give a victory speech, he’ll keep it brief.",
  colors: ["amber"],
  cost: 7,
  strength: 6,
  willpower: 7,
  lore: 2,
  illustrator: "Hyuna Lee",
  number: 21,
  set: "SSK",
  rarity: "rare",
};
