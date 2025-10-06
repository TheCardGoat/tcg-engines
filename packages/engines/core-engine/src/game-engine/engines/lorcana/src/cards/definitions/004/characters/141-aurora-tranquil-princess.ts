import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const auroraTranquilPrincess: LorcanaCharacterCardDefinition = {
  id: "pdt",
  reprints: ["u0u"],
  name: "Aurora",
  title: "Tranquil Princess",
  characteristics: ["hero", "dreamborn", "princess"],
  text: "**Ward** _(Opponents can't choose this character except to challenge.)_",
  type: "character",
  abilities: [wardAbility],
  flavour: "Her music fills the Illuminary's gardens with joy and light.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Koni",
  number: 141,
  set: "URR",
  rarity: "common",
};
