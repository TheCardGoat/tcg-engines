import type { ItemCard } from "@tcg/lorcana-types";
import { mushusRocketI18n } from "./134-mushus-rocket.i18n";

export const mushusRocket: ItemCard = {
  id: "Atf",
  canonicalId: "ci_Atf",
  reprints: ["set10-134"],
  cardType: "item",
  name: "Mushu's Rocket",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "010",
  cardNumber: 134,
  rarity: "uncommon",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_26b89746756b40979ee1a9885c8e3f5b",
    tcgPlayer: 659423,
  },
  text: [
    {
      title: "I NEED FIREPOWER",
      description:
        "When you play this item, chosen character gains Rush this turn. (They can challenge the turn they're played.)",
    },
    {
      title: "HITCH A RIDE 2",
      description: "{I}, Banish this item — Chosen character gains Rush this turn.",
    },
  ],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Rush",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      id: "u0o-1",
      name: "I NEED FIREPOWER",
      text: "I NEED FIREPOWER When you play this item, chosen character gains Rush this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      cost: {
        ink: 2,
        banishSelf: true,
      },
      effect: {
        duration: "this-turn",
        keyword: "Rush",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      id: "u0o-2",
      name: "HITCH A RIDE",
      text: "HITCH A RIDE 2 {I}, Banish this item — Chosen character gains Rush this turn.",
      type: "activated",
    },
  ],
  i18n: mushusRocketI18n,
};
