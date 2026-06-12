import type { ItemCard } from "@tcg/lorcana-types";
import { trainingDummyI18n } from "./201-training-dummy.i18n";

export const trainingDummy: ItemCard = {
  id: "Y5U",
  canonicalId: "ci_Y5U",
  reprints: ["set6-201"],
  cardType: "item",
  name: "Training Dummy",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "006",
  cardNumber: 201,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_513288f8ceec405e9b17fafcb0f5523a",
    tcgPlayer: 588158,
  },
  text: [
    {
      title: "HANDLE WITH CARE",
      description:
        "{E}, 2 {I} — Chosen character gains Bodyguard until the start of your next turn. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        duration: "until-start-of-next-turn",
        keyword: "Bodyguard",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      id: "1dj-1",
      name: "HANDLE WITH CARE",
      text: "HANDLE WITH CARE {E}, 2 {I} — Chosen character gains Bodyguard until the start of your next turn.",
      type: "activated",
    },
  ],
  i18n: trainingDummyI18n,
};
