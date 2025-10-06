import { chosenCharacterGetLoreThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const eyeOfTheFate: LorcanaItemCardDefinition = {
  characteristics: ["item"],
  id: "jgm",

  name: "Eye of the Fates",
  text: "**SEE THE FUTURE** {E} − Chosen character gets +1 {L} this turn.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "See the Future",
      text: "Chosen character gets +1 {L} this turn.",
      costs: [{ type: "exert" }],
      effects: [chosenCharacterGetLoreThisTurn(1)],
    } as ActivatedAbility,
  ],
  flavour: "You can change the future once you know what you're looking at.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  illustrator: "Ron Baird",
  number: 167,
  set: "TFC",
  rarity: "uncommon",
};
