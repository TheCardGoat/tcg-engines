import type { CharacterCard } from "@tcg/lorcana-types";
import { maidMarianBadmintonAceI18n } from "./176-maid-marian-badminton-ace.i18n";

export const maidMarianBadmintonAce: CharacterCard = {
  id: "II0",
  canonicalId: "ci_II0",
  reprints: ["set7-176"],
  cardType: "character",
  name: "Maid Marian",
  version: "Badminton Ace",
  inkType: ["sapphire", "steel"],
  franchise: "Robin Hood",
  set: "007",
  cardNumber: 176,
  rarity: "super_rare",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_1a7dadb10b334375b5b5b4eca2cce42c",
    tcgPlayer: 619508,
  },
  text: [
    {
      title: "GOOD SHOT",
      description:
        "During an opponent's turn, whenever one of your Ally characters takes damage, deal 1 damage to chosen opposing character.",
    },
    {
      title: "FAIR PLAY",
      description: "Your characters named Lady Kluck gain Resist +1.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    {
      id: "6at-1",
      name: "GOOD SHOT",
      text: "GOOD SHOT During an opponent's turn, whenever one of your Ally characters takes damage, deal 1 damage to chosen opposing character.",
      type: "triggered",
      trigger: {
        event: "damage",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Ally",
        },
        restrictions: [{ type: "during-turn", whose: "opponent" }],
      },
      effect: {
        type: "deal-damage",
        amount: 1,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "opponent",
          selector: "chosen",
          zones: ["play"],
        },
      },
    },
    {
      id: "6at-2",
      name: "FAIR PLAY",
      text: "FAIR PLAY Your characters named Lady Kluck gain Resist +1.",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 1,
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "you",
          selector: "all",
          zones: ["play"],
          filter: [
            { type: "attribute", attribute: "name", comparison: "equals", value: "Lady Kluck" },
          ],
        },
      },
    },
  ],
  i18n: maidMarianBadmintonAceI18n,
};
