import { putTopCardOfYourDeckIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const heartOfTeFiti: LorcanaItemCardDefinition = {
  id: "fzw",
  reprints: ["cl8"],
  missingTestCase: true,
  name: "Heart of Te Fiti",
  characteristics: ["item"],
  text: "**CREATE LIFE** {E}, 2 {I} – Put the top card of your deck into your inkwell facedown and exerted.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Create Life",
      text: "{E}, 2 {I} – Put the top card of your deck into your inkwell facedown and exerted.",
      costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
      effects: [putTopCardOfYourDeckIntoYourInkwellExerted],
    },
  ],
  flavour: "It takes a pure heart to calm the raging storm within.",
  inkwell: true,
  colors: ["sapphire"],
  illustrator: "Kamil Murzyn",
  number: 164,
  cost: 3,
  set: "ITI",
  rarity: "rare",
};
