import type { ItemCard } from "@tcg/lorcana-types";
import { inkrunnerI18n } from "./169-inkrunner.i18n";

export const inkrunner: ItemCard = {
  id: "VpM",
  canonicalId: "ci_VpM",
  reprints: ["set10-169"],
  cardType: "item",
  name: "Inkrunner",
  inkType: ["sapphire"],
  franchise: "Lorcana",
  set: "010",
  cardNumber: 169,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_2e63442a36994d4fa8266285fe63addd",
    tcgPlayer: 659389,
  },
  text: [
    {
      title: "PREFLIGHT CHECK",
      description: "When you play this item, draw a card.",
    },
    {
      title: "READY TO RIDE",
      description:
        "{E}, 1 {I} — Chosen character gains Alert this turn. (They can challenge as if they had Evasive.)",
    },
  ],
  abilities: [
    {
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      id: "u80-1",
      name: "PREFLIGHT CHECK",
      text: "PREFLIGHT CHECK When you play this item, draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      name: "READY TO RIDE",
      type: "activated",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        duration: "this-turn",
        keyword: "Alert",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      id: "u80-2",
      text: "READY TO RIDE {E}, 1 {I} — Chosen character gains Alert this turn.",
    },
  ],
  i18n: inkrunnerI18n,
};
