import type { ItemCard } from "@tcg/lorcana-types";
import { theWeedwhackerI18n } from "./205-the-weedwhacker.i18n";

export const theWeedwhacker: ItemCard = {
  id: "qNx",
  canonicalId: "ci_qNx",
  slug: "lorcana-ci_qNx",
  printings: [
    {
      id: "set13-205",
      artId: "set13-205",
      setCode: "set13",
      collectorNumber: "205",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-205"],
  cardType: "item",
  name: "The Weedwhacker",
  inkType: ["steel"],
  franchise: "Darkwing Duck",
  set: "013",
  cardNumber: 205,
  rarity: "uncommon",
  cost: 3,
  inkable: true,
  text: [
    {
      title: "Full Power",
      description:
        "{E}, 1 {I} — Chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
    },
    {
      title: "Clear-Cut",
      description: "2 {I}, Banish this item — Banish chosen Vineling character.",
    },
  ],
  abilities: [
    {
      type: "activated",
      name: "FULL POWER",
      text: "FULL POWER {E}, 1 {I} - Chosen character gains Challenger +2 this turn.",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        value: 2,
        duration: "this-turn",
        target: "CHOSEN_CHARACTER",
      },
    },
    {
      type: "activated",
      name: "CLEAR-CUT",
      text: "CLEAR-CUT 2 {I}, Banish this item - Banish chosen Vineling character.",
      cost: {
        ink: 2,
        banishSelf: true,
      },
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Vineling",
            },
          ],
        },
      },
    },
  ],
  i18n: theWeedwhackerI18n,
};
