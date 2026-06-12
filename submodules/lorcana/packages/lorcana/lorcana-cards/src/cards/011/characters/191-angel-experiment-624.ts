import type { CharacterCard } from "@tcg/lorcana-types";
import { angelExperiment624I18n } from "./191-angel-experiment-624.i18n";

export const angelExperiment624: CharacterCard = {
  id: "oBs",
  canonicalId: "ci_oxv",
  reprints: ["set11-191"],
  cardType: "character",
  name: "Angel",
  version: "Experiment 624",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 191,
  rarity: "legendary",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_fbad358f2f804554838545c738341380",
    tcgPlayer: 677169,
  },
  text: [
    {
      title: "UNTOUCHABLE",
      description: "While you have no cards in your hand, this character gains Resist +2.",
    },
    {
      title: "GOOD AIM",
      description:
        "Once during your turn, you may choose and discard a card to deal 2 damage to chosen character.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Alien"],
  abilities: [
    {
      id: "1cz-1",
      name: "UNTOUCHABLE",
      type: "static",
      condition: {
        type: "resource-count",
        what: "cards-in-hand",
        controller: "you",
        comparison: "equal",
        value: 0,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 2,
        target: "SELF",
      },
      text: "UNTOUCHABLE While you have no cards in your hand, this character gains Resist +2.",
    },
    {
      id: "1cz-2",
      name: "GOOD AIM",
      type: "activated",
      cost: {
        discardCards: 1,
        discardChosen: true,
      },
      restrictions: [
        {
          type: "once-per-turn",
        },
      ],
      effect: {
        type: "deal-damage",
        amount: 2,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
      },
      text: "GOOD AIM Once during your turn, you may choose and discard a card to deal 2 damage to chosen character.",
    },
  ],
  i18n: angelExperiment624I18n,
};
