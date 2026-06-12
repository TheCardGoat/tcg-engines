import type { CharacterCard } from "@tcg/lorcana-types";
import { jafarPowerhungryVizierI18n } from "./193-jafar-power-hungry-vizier.i18n";

export const jafarPowerhungryVizier: CharacterCard = {
  id: "QV3",
  canonicalId: "ci_QV3",
  reprints: ["set6-193"],
  cardType: "character",
  name: "Jafar",
  version: "Power-Hungry Vizier",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "006",
  cardNumber: 193,
  rarity: "common",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_b3029d9bf3ee4b7c8bf5cd2403f0b2f5",
    tcgPlayer: 591118,
  },
  text: [
    {
      title: "YOU WILL BE PAID WHEN THE TIME COMES",
      description:
        "During your turn, whenever a card is put into your inkwell, deal 1 damage to chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  abilities: [
    {
      effect: {
        amount: 1,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "1w6-1",
      name: "YOU WILL BE PAID WHEN THE TIME COMES",
      text: "YOU WILL BE PAID WHEN THE TIME COMES During your turn, whenever a card is put into your inkwell, deal 1 damage to chosen character.",
      condition: {
        type: "your-turn",
      },
      trigger: {
        event: "ink",
        on: "CONTROLLER",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: jafarPowerhungryVizierI18n,
};
