import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const namaariNemesis: LorcanaCharacterCardDefinition = {
  id: "jyl",

  name: "Namaari",
  title: "Nemesis",
  characteristics: ["storyborn", "villain", "princess"],
  text: "**THIS SHOULDN'T TAKE LONG** {E}, Banish this character − Banish chosen character.",
  type: "character",
  abilities: [
    {
      type: "activated",
      name: "This Shouldn't Take Long",
      text: "{E}, Banish this character − Banish chosen character.",
      costs: [{ type: "banish" }, { type: "exert" }],
      effects: [
        {
          type: "banish",
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour: "I don't need swords to beat you. They just make it more fun.",
  colors: ["ruby"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Hedvig Häggman-Sund",
  number: 118,
  set: "ROF",
  rarity: "super_rare",
};
