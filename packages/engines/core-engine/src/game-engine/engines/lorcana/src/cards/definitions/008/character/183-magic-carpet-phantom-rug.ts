import {
  challengerAbility,
  vanishAbility,
  yourOtherCharactersWithGain,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const magicCarpetPhantomRug: LorcanaCharacterCardDefinition = {
  id: "eer",
  name: "Magic Carpet",
  title: "Phantom Rug",
  characteristics: ["dreamborn", "ally", "illusion"],
  text: "Vanish\nSPECTRAL FORCE Your other Illusion characters gain Challenger +1. (They get +1 {S} while challenging.)",
  type: "character",
  abilities: [
    vanishAbility,
    yourOtherCharactersWithGain({
      name: "SPECTRAL FORCE",
      text: "Your other Illusion characters gain Challenger +1. (They get +1 {S} while challenging.)",
      gainedAbility: challengerAbility(1),
      filter: { filter: "characteristics", value: ["illusion"] },
    }),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 2,
  willpower: 4,
  illustrator: "Andrea Parisi",
  number: 183,
  set: "008",
  rarity: "common",
  lore: 2,
};
