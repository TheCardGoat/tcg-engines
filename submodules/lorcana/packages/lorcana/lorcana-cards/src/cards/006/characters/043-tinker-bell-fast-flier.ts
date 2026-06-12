import type { CharacterCard } from "@tcg/lorcana-types";
import { tinkerBellFastFlierI18n } from "./043-tinker-bell-fast-flier.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const tinkerBellFastFlier: CharacterCard = {
  id: "kEF",
  canonicalId: "ci_kEF",
  reprints: ["set6-043"],
  cardType: "character",
  name: "Tinker Bell",
  version: "Fast Flier",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "006",
  cardNumber: 43,
  rarity: "common",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_ea5cca0b6f8747b8a438b6cdced02d93",
    tcgPlayer: 593045,
  },
  text: "Evasive",
  classifications: ["Storyborn", "Ally", "Fairy"],
  abilities: [evasive],
  i18n: tinkerBellFastFlierI18n,
};
