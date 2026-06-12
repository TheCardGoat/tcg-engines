import type { CharacterCard } from "@tcg/lorcana-types";
import { rapunzelLettingDownHerHairI18n } from "./121-rapunzel-letting-down-her-hair.i18n";

export const rapunzelLettingDownHerHair: CharacterCard = {
  id: "nSe",
  canonicalId: "ci_Su6",
  reprints: ["set1-121", "set9-124"],
  cardType: "character",
  name: "Rapunzel",
  version: "Letting Down Her Hair",
  inkType: ["ruby"],
  franchise: "Tangled",
  set: "001",
  cardNumber: 121,
  rarity: "uncommon",
  cost: 6,
  strength: 5,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_cdba0ed02d3a4361afb0aaa7689ee1de",
    tcgPlayer: 650059,
  },
  text: [
    {
      title: "TANGLE",
      description: "When you play this character, each opponent loses 1 lore.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    {
      effect: {
        amount: 1,
        target: "EACH_OPPONENT",
        type: "lose-lore",
      },
      id: "w6r-1",
      name: "TANGLE",
      text: "TANGLE When you play this character, each opponent loses 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: rapunzelLettingDownHerHairI18n,
};
