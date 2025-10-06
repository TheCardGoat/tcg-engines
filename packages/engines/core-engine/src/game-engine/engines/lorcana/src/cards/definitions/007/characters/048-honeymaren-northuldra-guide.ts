import { taleOfTheFifthSpiritAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const honeymarenNorthuldraGuide: LorcanaCharacterCardDefinition = {
  id: "q36",
  name: "Honeymaren",
  title: "Northuldra Guide",
  characteristics: ["storyborn", "ally"],
  text: "TALE OF THE FIFTH SPIRIT When you play this character, if an opponent has an exerted character in play, gain 1 lore.",
  type: "character",
  abilities: [taleOfTheFifthSpiritAbility],
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  strength: 2,
  willpower: 2,
  illustrator: "Alexandria Neonakis",
  number: 48,
  set: "007",
  rarity: "common",
  lore: 1,
};
