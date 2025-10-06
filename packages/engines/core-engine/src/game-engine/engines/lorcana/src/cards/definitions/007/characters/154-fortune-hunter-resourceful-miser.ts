import { readyItemsYouControl } from "@lorcanito/lorcana-engine/abilities/target";
import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import type {
  MetaAbility,
  ResolutionAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const fortuneHunterAbility: ResolutionAbility = {
  type: "resolution",
  name: "FORTUNE HUNTER",
  text: "When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  effects: [
    {
      type: "scry",
      amount: 4,
      mode: "bottom",
      shouldRevealTutored: true,
      target: self,
      limits: {
        bottom: 4,
        top: 0,
        hand: 1,
        inkwell: 0,
      },
      tutorFilters: [
        { filter: "owner", value: "self" },
        { filter: "zone", value: "deck" },
        { filter: "type", value: "item" },
      ],
    },
  ],
};

const putItToGoodUse: MetaAbility = {
  type: "static",
  ability: "meta",
  name: "PUT IT TO GOOD USE",
  text: "You may exert 4 items of yours to play this character for free.",
  alternativeCosts: [
    {
      type: "card",
      action: "exert",
      amount: 4,
      filters: readyItemsYouControl,
    },
  ],
};

export const scroogeMcduckResourcefulMiser: LorcanaCharacterCardDefinition = {
  id: "z1q",
  name: "Scrooge Mcduck",
  title: "Resourceful Miser",
  characteristics: ["storyborn", "hero"],
  text: "PUT IT TO GOOD USE You may exert 4 items of yours to play this character for free.\nFORTUNE HUNTER When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  type: "character",
  abilities: [putItToGoodUse, fortuneHunterAbility],
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  strength: 4,
  willpower: 4,
  illustrator: "Kenneth Anderson",
  number: 154,
  set: "007",
  rarity: "legendary",
  lore: 1,
};
