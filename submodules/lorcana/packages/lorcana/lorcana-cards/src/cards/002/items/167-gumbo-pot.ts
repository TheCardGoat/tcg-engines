import type { ItemCard } from "@tcg/lorcana-types";
import { gumboPotI18n } from "./167-gumbo-pot.i18n";

export const gumboPot: ItemCard = {
  id: "MEA",
  canonicalId: "ci_A51",
  reprints: ["set2-167"],
  cardType: "item",
  name: "Gumbo Pot",
  inkType: ["sapphire"],
  franchise: "Princess and the Frog",
  set: "002",
  cardNumber: 167,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_45bfb8a9f002440191e7bfd8b993fd22",
    tcgPlayer: 525309,
  },
  text: [
    {
      title: "THE BEST I'VE EVER TASTED",
      description: "{E} — Remove 1 damage each from up to 2 chosen characters.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        target: "UP_TO_2_CHOSEN_CHARACTERS",
        type: "remove-damage",
      },
      id: "1ee-1",
      name: "THE BEST I'VE EVER TASTED",
      text: "THE BEST I'VE EVER TASTED {E} — Remove 1 damage each from up to 2 chosen characters.",
      type: "activated",
    },
  ],
  i18n: gumboPotI18n,
};
