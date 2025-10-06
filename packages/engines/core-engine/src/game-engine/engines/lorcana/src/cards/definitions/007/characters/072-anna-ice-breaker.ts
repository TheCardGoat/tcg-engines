import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const annaIceBreaker: LorcanaCharacterCardDefinition = {
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
