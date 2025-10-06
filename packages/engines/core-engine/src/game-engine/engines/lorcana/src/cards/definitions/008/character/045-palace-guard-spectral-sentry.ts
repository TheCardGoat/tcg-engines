import { vanishAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/vanishAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const palaceGuardSpectralSentry: LorcanaCharacterCardDefinition = {
  id: "wmq",
  name: "Palace Guard",
  title: "Spectral Sentry",
  characteristics: ["dreamborn", "ally", "illusion"],
  text: "Vanish",
  type: "character",
  abilities: [vanishAbility],
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  strength: 1,
  willpower: 4,
  illustrator: "Eva Widermann",
  number: 45,
  set: "008",
  rarity: "super_rare",
  lore: 1,
};
