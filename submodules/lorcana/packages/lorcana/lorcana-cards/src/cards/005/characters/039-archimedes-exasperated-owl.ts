import type { CharacterCard } from "@tcg/lorcana-types";
import { archimedesExasperatedOwlI18n } from "./039-archimedes-exasperated-owl.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const archimedesExasperatedOwl: CharacterCard = {
  id: "KbE",
  canonicalId: "ci_0lB",
  reprints: ["set5-039"],
  cardType: "character",
  name: "Archimedes",
  version: "Exasperated Owl",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "005",
  cardNumber: 39,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_fc8acdf39f114f398bca3f962a072274",
    tcgPlayer: 561467,
  },
  text: "Evasive",
  classifications: ["Storyborn", "Ally"],
  abilities: [evasive],
  i18n: archimedesExasperatedOwlI18n,
};
