import { exertAndCantReady } from "@lorcanito/lorcana-engine/effects/effects";
import { whenYouPlayThisCharacter } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const chernabogCreatureOfTheNight: LorcanaCharacterCardDefinition = {
  id: "olc",
  name: "Chernabog",
  title: "Creature of the Night",
  characteristics: ["storyborn", "villain"],
  text: "MIDNIGHT Revel When you play this character, each opponent chooses and exerts one of their ready characters. They can't ready at the start of their next turn..",
  type: "character",
  abilities: [
    whenYouPlayThisCharacter({
      name: "",
      text: "",
      responder: "opponent",
      effects: exertAndCantReady({
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "owner", value: "self" },
        ],
      }),
    }),
  ],
  inkwell: false,
  colors: ["amethyst"],
  cost: 5,
  strength: 2,
  willpower: 6,
  illustrator: "Giulia Riva",
  number: 50,
  set: "007",
  rarity: "rare",
  lore: 1,
};
