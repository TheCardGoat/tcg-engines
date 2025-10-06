import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";
import { exertChosenOpposingCharacter } from "~/game-engine/engines/lorcana/src/abilities/effect";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const iceOver: ActivatedAbility = {
  type: "activated",
  name: "ICE OVER",
  text: "1 {I}, Choose and discard a card – Exert chosen opposing character.",
  optional: false,
  costs: [
    { type: "ink", amount: 1 },
    {
      type: "card",
      action: "discard",
      amount: 1,
      filters: [
        { filter: "zone", value: "hand" },
        { filter: "owner", value: "self" },
      ],
    },
  ],
  effects: [exertChosenOpposingCharacter],
};

export const elsaFierceProtector: LorcanaCharacterCardDefinition = {
  id: "wd1",
  name: "Elsa",
  title: "Fierce Protector",
  characteristics: ["storyborn", "hero", "queen", "sorcerer"],
  text: "ICE OVER 1 {I}, Choose and discard a card – Exert chosen opposing character.",
  type: "character",
  abilities: [iceOver],
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 3,
  willpower: 4,
  illustrator: "Hedvig H S",
  number: 60,
  set: "008",
  rarity: "rare",
  lore: 1,
};
