import type { CharacterCard } from "@tcg/lorcana-types";
import { jafarRoyalVizierI18n } from "./184-jafar-royal-vizier.i18n";

export const jafarRoyalVizier: CharacterCard = {
  id: "uIO",
  canonicalId: "ci_9gw",
  reprints: ["set2-184", "set9-181"],
  cardType: "character",
  name: "Jafar",
  version: "Royal Vizier",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "002",
  cardNumber: 184,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_7d0510c02fca4d878ec8a11ed836ae80",
    tcgPlayer: 650114,
  },
  text: [
    {
      title: "I DON'T TRUST HIM, SIRE",
      description:
        "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    {
      condition: {
        type: "turn",
        whose: "your",
      },
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "1gq-1",
      name: "I DON'T TRUST HIM, SIRE",
      text: "I DON'T TRUST HIM, SIRE During your turn, this character gains Evasive.",
      type: "static",
    },
  ],
  i18n: jafarRoyalVizierI18n,
};
