import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import { whenThisCharacterBanishedInAChallenge } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const buckyNuttyRascal: LorcanaCharacterCardDefinition = {
  id: "tfn",
  name: "Bucky",
  title: "Nutty Rascal",
  characteristics: ["dreamborn", "ally"],
  text: "POP! When this character is banished in a challenge, you may draw a card.",
  type: "character",
  abilities: [
    whenThisCharacterBanishedInAChallenge({
      name: "POP!",
      text: "When this character is banished in a challenge, you may draw a card.",
      optional: true,
      effects: [drawACard],
    }),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  strength: 3,
  willpower: 2,
  illustrator: "Kenneth Anderson",
  number: 60,
  set: "007",
  rarity: "common",
  lore: 1,
};
