import type { CharacterCard } from "@tcg/lorcana-types";
import { arthurWizardsApprentice } from "./035-arthur-wizards-apprentice";

export const arthurWizardsApprenticeEnchanted: CharacterCard = {
  ...arthurWizardsApprentice,
  id: "6Rx",
  reprints: ["set2-035"],
  set: "002",
  cardNumber: 207,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_19431b87131547d98fef8a693077a77e",
    tcgPlayer: 527797,
  },
};
