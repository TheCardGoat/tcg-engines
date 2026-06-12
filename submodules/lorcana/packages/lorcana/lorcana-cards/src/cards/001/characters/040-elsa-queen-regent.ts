import type { CharacterCard } from "@tcg/lorcana-types";
import { elsaQueenRegentI18n } from "./040-elsa-queen-regent.i18n";

export const elsaQueenRegent: CharacterCard = {
  id: "qQ5",
  canonicalId: "ci_qQ5",
  reprints: ["set1-040"],
  cardType: "character",
  name: "Elsa",
  version: "Queen Regent",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "001",
  cardNumber: 40,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_643a385f109c4e50a6462b86c64b98b2",
    tcgPlayer: 507276,
  },
  classifications: ["Storyborn", "Hero", "Queen", "Sorcerer"],
  i18n: elsaQueenRegentI18n,
};
