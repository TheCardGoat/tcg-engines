import type { CharacterCard } from "@tcg/lorcana-types";
import { basilSecretInformerI18n } from "./093-basil-secret-informer.i18n";

export const basilSecretInformer: CharacterCard = {
  id: "10Q",
  canonicalId: "ci_10Q",
  reprints: ["set7-093"],
  cardType: "character",
  name: "Basil",
  version: "Secret Informer",
  inkType: ["emerald"],
  franchise: "Great Mouse Detective",
  set: "007",
  cardNumber: 93,
  rarity: "rare",
  cost: 6,
  strength: 3,
  willpower: 6,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_06d0c264e2e34e248fcce5ce2e0d3efe",
    tcgPlayer: 619456,
  },
  text: [
    {
      title: "DRAW THEM OUT",
      description:
        "Whenever this character quests, opposing damaged characters gain Reckless during their next turn. (They can't quest and must challenge if able.)",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Detective"],
  abilities: [
    {
      effect: {
        keyword: "Reckless",
        duration: "their-next-turn",
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "damaged",
            },
          ],
        },
        type: "gain-keyword",
      },
      id: "lk0-1",
      name: "DRAW THEM OUT",
      text: "DRAW THEM OUT Whenever this character quests, opposing damaged characters gain Reckless during their next turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: basilSecretInformerI18n,
};
