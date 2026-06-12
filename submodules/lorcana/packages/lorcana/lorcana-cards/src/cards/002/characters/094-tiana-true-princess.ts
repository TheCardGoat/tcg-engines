import type { CharacterCard } from "@tcg/lorcana-types";
import { tianaTruePrincessI18n } from "./094-tiana-true-princess.i18n";

export const tianaTruePrincess: CharacterCard = {
  id: "dRI",
  canonicalId: "ci_dRI",
  reprints: ["set2-094"],
  cardType: "character",
  name: "Tiana",
  version: "True Princess",
  inkType: ["emerald"],
  franchise: "Princess and the Frog",
  set: "002",
  cardNumber: 94,
  rarity: "uncommon",
  cost: 5,
  strength: 5,
  willpower: 3,
  lore: 3,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_5403ff921bce4bbc90468b0f860dc23c",
    tcgPlayer: 527751,
  },
  classifications: ["Storyborn", "Hero", "Princess"],
  i18n: tianaTruePrincessI18n,
};
