import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const robinHoodCapableFighter: LorcanaCharacterCardDefinition = {
  id: "ta2",
  reprints: ["kjo"],

  name: "Robin Hood",
  title: "Capable Fighter",
  characteristics: ["hero", "dreamborn"],
  text: "**SKIRMISH** {E} − Deal 1 damage to chosen character.",
  type: "character",
  abilities: [
    {
      type: "activated",
      costs: [{ type: "exert" }],
      optional: false,
      name: "Skirmish",
      text: "{E} − Deal 1 damage to chosen character.",
      effects: [
        {
          type: "damage",
          amount: 1,
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour: "Capable? You don't know the half of it.\n−Little John",
  colors: ["steel"],
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Noukah",
  number: 193,
  set: "ROF",
  rarity: "uncommon",
};
