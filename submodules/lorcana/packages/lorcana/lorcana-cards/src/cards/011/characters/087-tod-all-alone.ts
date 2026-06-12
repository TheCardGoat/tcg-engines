import type { CharacterCard } from "@tcg/lorcana-types";
import { todAllAloneI18n } from "./087-tod-all-alone.i18n";

export const todAllAlone: CharacterCard = {
  id: "oKC",
  canonicalId: "ci_oKC",
  reprints: ["set11-087"],
  cardType: "character",
  name: "Tod",
  version: "All Alone",
  inkType: ["emerald"],
  franchise: "Fox and the Hound",
  set: "011",
  cardNumber: 87,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_fdbc7b03d5194e2cb2c407273f96e01a",
    tcgPlayer: 676205,
  },
  classifications: ["Storyborn", "Hero"],
  i18n: todAllAloneI18n,
};
