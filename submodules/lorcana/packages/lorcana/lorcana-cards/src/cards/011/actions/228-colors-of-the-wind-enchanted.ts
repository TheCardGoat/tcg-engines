import type { ActionCard } from "@tcg/lorcana-types";
import { colorsOfTheWindEnchantedI18n } from "./228-colors-of-the-wind-enchanted.i18n";

export const colorsOfTheWindEnchanted: ActionCard = {
  id: "wWW",
  canonicalId: "ci_Wdy",
  slug: "lorcana-ci_Wdy",
  printings: [
    {
      id: "set11-228-enchanted",
      artId: "ci_Wdy-enchanted",
      setCode: "set11",
      collectorNumber: "228",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set11-064"],
  cardType: "action",
  name: "Colors of the Wind",
  inkType: ["amethyst"],
  franchise: "Pocahontas",
  set: "011",
  cardNumber: 228,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_8ef1d474eb68402e8d35e2aa3bce689a",
    tcgPlayer: "677161",
  },
  text: "Each player reveals the top card of their deck. Draw a card for each different ink type of cards revealed this way.",
  actionSubtype: "song",
  abilities: [
    {
      id: "arw-1",
      type: "action",
      text: "Each player reveals the top card of their deck. Draw a card for each different ink type of cards revealed this way.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal-top-card",
            target: "EACH_PLAYER",
          },
          {
            type: "count",
            what: "distinct-revealed-ink-types",
          },
          {
            type: "draw",
            amount: {
              type: "trigger-amount",
            },
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  i18n: colorsOfTheWindEnchantedI18n,
};
