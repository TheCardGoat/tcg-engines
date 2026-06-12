import type { CharacterCard } from "@tcg/lorcana-types";
import { archimedesHighlyEducatedOwlI18n } from "./036-archimedes-highly-educated-owl.i18n";

export const archimedesHighlyEducatedOwl: CharacterCard = {
  id: "mgF",
  canonicalId: "ci_mgF",
  reprints: ["set1-036"],
  cardType: "character",
  name: "Archimedes",
  version: "Highly Educated Owl",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "001",
  cardNumber: 36,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_f2b9a7e014e64eca88d8c9c7eee07019",
    tcgPlayer: 501406,
  },
  classifications: ["Dreamborn", "Ally"],
  i18n: archimedesHighlyEducatedOwlI18n,
};
