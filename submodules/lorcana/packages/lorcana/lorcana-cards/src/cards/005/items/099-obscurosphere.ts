import type { ItemCard } from "@tcg/lorcana-types";
import { obscurosphereI18n } from "./099-obscurosphere.i18n";

export const obscurosphere: ItemCard = {
  id: "1rv",
  canonicalId: "ci_1rv",
  reprints: ["set5-099"],
  cardType: "item",
  name: "Obscurosphere",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "005",
  cardNumber: 99,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_20513d1b0b8947e7b18e967292e9fb23",
    tcgPlayer: 561171,
  },
  text: [
    {
      title: "EXTRACT OF EMERALD 2",
      description:
        "{I}, Banish this item — Your characters gain Ward until the start of your next turn.",
    },
  ],
  abilities: [
    {
      cost: {
        ink: 1,
        banishSelf: true,
      },
      effect: {
        duration: "until-start-of-next-turn",
        keyword: "Ward",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
      },
      id: "wfc-1",
      name: "EXTRACT OF EMERALD 2",
      text: "EXTRACT OF EMERALD 2 {I}, Banish this item — Your characters gain Ward until the start of your next turn.",
      type: "activated",
    },
  ],
  i18n: obscurosphereI18n,
};
