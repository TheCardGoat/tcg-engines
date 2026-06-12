import type { ActionCard } from "@tcg/lorcana-types";
import { dragonFireI18n } from "./130-dragon-fire.i18n";

export const dragonFire: ActionCard = {
  id: "NCd",
  canonicalId: "ci_Jpc",
  reprints: ["set1-130", "set10-133"],
  cardType: "action",
  name: "Dragon Fire",
  inkType: ["ruby"],
  franchise: "Sleeping Beauty",
  set: "001",
  cardNumber: 130,
  rarity: "uncommon",
  cost: 5,
  inkable: false,
  externalIds: {
    lorcast: "crd_c5d9b54870104360b88dfd59bbb28af5",
    tcgPlayer: 659245,
  },
  text: "Banish chosen character.",
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "banish",
      },
      type: "action",
    },
  ],
  i18n: dragonFireI18n,
};
