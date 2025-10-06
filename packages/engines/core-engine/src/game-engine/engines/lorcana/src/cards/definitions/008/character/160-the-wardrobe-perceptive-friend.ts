import { drawXCards } from "@lorcanito/lorcana-engine/effects/effects";
import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const iHaveJustTheThing: ActivatedAbility = {
  type: "activated",
  name: "I HAVE JUST THE THING",
  text: "{E}, Choose and discard an item card - Draw 2 cards",
  costs: [
    {
      type: "card",
      action: "discard",
      amount: 1,
      filters: [
        { filter: "type", value: "item" },
        { filter: "owner", value: "self" },
        { filter: "zone", value: "hand" },
      ],
    },
    { type: "exert" },
  ],
  effects: [drawXCards(2)],
};

export const theWardrobePerceptiveFriend: LorcanaCharacterCardDefinition = {
  id: "ogz",
  name: "The Wardrobe",
  title: "Perceptive Friend",
  characteristics: ["storyborn", "ally"],
  text: "I HAVE JUST THE THING {E}, Choose and discard an item card - Draw 2 cards",
  type: "character",
  abilities: [iHaveJustTheThing],
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  strength: 3,
  willpower: 4,
  illustrator: "Giulia Riva",
  number: 160,
  set: "008",
  rarity: "common",
  lore: 1,
};
