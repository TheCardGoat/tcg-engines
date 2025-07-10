import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const annaIceBreaker: LorcanitoCharacterCard = {
  id: "ctd",
  name: "Anna",
  title: "Ice Breaker",
  characteristics: ["dreamborn", "hero", "queen", "sorcerer"],
  text: "Support\nWINTER AMBUSH When you play this character, chosen opposing character can't ready at the start of their next turn.",
  type: "character",
  abilities: [
    supportAbility,
    {
      type: "resolution",
      name: "WINTER AMBUSH",
      text: "When you play this character, chosen opposing character can't ready at the start of their next turn.",
      effects: [
        {
          type: "restriction",
          restriction: "ready-at-start-of-turn",
          duration: "next_turn",
          target: chosenOpposingCharacter,
        },
      ],
    },
  ],
  inkwell: true,
  // @ts-expect-error
  color: "",
  colors: ["amethyst", "sapphire"],
  cost: 4,
  strength: 2,
  willpower: 3,
  illustrator: "Ian MacDonald",
  number: 72,
  set: "007",
  rarity: "uncommon",
  lore: 2,
};
