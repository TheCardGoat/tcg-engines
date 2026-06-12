import type { CharacterCard } from "@tcg/lorcana-types";
import { flintheartGlomgoldSchemingBillionaireI18n } from "./076-flintheart-glomgold-scheming-billionaire.i18n";

export const flintheartGlomgoldSchemingBillionaire: CharacterCard = {
  id: "fzp",
  canonicalId: "ci_fzp",
  reprints: ["set10-076"],
  cardType: "character",
  name: "Flintheart Glomgold",
  version: "Scheming Billionaire",
  inkType: ["emerald"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 76,
  rarity: "uncommon",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_6337614f5664420999e442e0bfa1dd31",
    tcgPlayer: 659184,
  },
  text: [
    {
      title: "TRY ME",
      description:
        "While you have a character or location in play with a card under them, this character gains Ward.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      condition: {
        comparison: {
          operator: "gte",
          value: 1,
        },
        query: {
          filters: [
            {
              comparison: "gte",
              type: "cards-under",
              value: 1,
            },
          ],
          owner: "you",
          selector: "all",
          zones: ["play"],
        },
        type: "target-query",
      },
      effect: {
        keyword: "Ward",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "l2o-1",
      name: "TRY ME",
      text: "TRY ME While you have a character or location in play with a card under them, this character gains Ward.",
      type: "static",
    },
  ],
  i18n: flintheartGlomgoldSchemingBillionaireI18n,
};
