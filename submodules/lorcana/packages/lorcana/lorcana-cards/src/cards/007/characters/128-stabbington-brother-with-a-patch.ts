import type { CharacterCard } from "@tcg/lorcana-types";
import { stabbingtonBrotherWithAPatchI18n } from "./128-stabbington-brother-with-a-patch.i18n";

export const stabbingtonBrotherWithAPatch: CharacterCard = {
  id: "QMj",
  canonicalId: "ci_QMj",
  reprints: ["set7-128"],
  cardType: "character",
  name: "Stabbington Brother",
  version: "With a Patch",
  inkType: ["ruby"],
  franchise: "Tangled",
  set: "007",
  cardNumber: 128,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_2e6d017b97da415fb97b8d42bb129e98",
    tcgPlayer: 619476,
  },
  text: [
    {
      title: "CRIME OF OPPORTUNITY",
      description: "When you play this character, chosen opponent loses 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        amount: 1,
        target: "OPPONENT",
        type: "lose-lore",
      },
      id: "y6f-1",
      name: "CRIME OF OPPORTUNITY",
      text: "CRIME OF OPPORTUNITY When you play this character, chosen opponent loses 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: stabbingtonBrotherWithAPatchI18n,
};
