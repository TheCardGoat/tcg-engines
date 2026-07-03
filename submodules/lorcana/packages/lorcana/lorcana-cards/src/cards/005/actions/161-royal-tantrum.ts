import type { ActionCard } from "@tcg/lorcana-types";
import { royalTantrumI18n } from "./161-royal-tantrum.i18n";

export const royalTantrum: ActionCard = {
  id: "VjU",
  canonicalId: "ci_MQW",
  slug: "lorcana-ci_MQW",
  printings: [
    {
      id: "set5-161",
      artId: "set5-161",
      setCode: "set5",
      collectorNumber: "161",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set5-161"],
  cardType: "action",
  name: "Royal Tantrum",
  inkType: ["sapphire"],
  franchise: "Robin Hood",
  set: "005",
  cardNumber: 161,
  rarity: "rare",
  cost: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_ae4635bbf7ef4b4fb6a30c61f633fa0d",
    tcgPlayer: "561976",
  },
  text: "Banish any number of your items, then draw a card for each item banished this way.",
  abilities: [
    {
      effect: {
        steps: [
          {
            target: {
              selector: "chosen",
              count: "all",
              owner: "you",
              zones: ["play"],
              cardTypes: ["item"],
            },
            type: "banish",
          },
          {
            amount: {
              type: "for-each",
              counter: {
                type: "banished-this-way",
              },
            },
            target: "CONTROLLER",
            type: "draw",
          },
        ],
        type: "sequence",
      },
      id: "96v-1",
      text: "Banish any number of your items, then draw a card for each item banished this way.",
      type: "action",
    },
  ],
  i18n: royalTantrumI18n,
};
