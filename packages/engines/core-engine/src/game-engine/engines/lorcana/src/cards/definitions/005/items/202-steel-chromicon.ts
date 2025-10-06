import { dealDamageToChosenCharacter } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const steelChromicon: LorcanaItemCardDefinition = {
  id: "yz9",
  missingTestCase: true,
  name: "Steel Chromicon",
  characteristics: ["item"],
  text: "**STEEL LIGHT** {E} – Deal 1 damage to chosen character.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "STEEL LIGHT",
      text: "{E} – Deal 1 damage to chosen character.",
      costs: [{ type: "exert" }],
      effects: [dealDamageToChosenCharacter(1)],
    },
  ],
  flavour: "Strong in will, strong in battle.\n−Inscription",
  colors: ["steel"],
  cost: 6,
  illustrator: "Dustin Panzino",
  number: 202,
  set: "SSK",
  rarity: "uncommon",
};
