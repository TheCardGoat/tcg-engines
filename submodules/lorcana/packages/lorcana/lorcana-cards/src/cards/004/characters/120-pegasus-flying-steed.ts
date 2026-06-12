import type { CharacterCard } from "@tcg/lorcana-types";
import { pegasusFlyingSteedI18n } from "./120-pegasus-flying-steed.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const pegasusFlyingSteed: CharacterCard = {
  id: "iG3",
  canonicalId: "ci_iG3",
  reprints: ["set4-120"],
  cardType: "character",
  name: "Pegasus",
  version: "Flying Steed",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "004",
  cardNumber: 120,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_42751c368c5545afbfc23be49ae65519",
    tcgPlayer: 550597,
  },
  text: "Evasive",
  classifications: ["Storyborn", "Ally"],
  abilities: [evasive],
  i18n: pegasusFlyingSteedI18n,
};
