import type { ItemCard } from "@tcg/lorcana-types";
import { signedContractI18n } from "./099-signed-contract.i18n";

export const signedContract: ItemCard = {
  id: "hYT",
  canonicalId: "ci_yKQ",
  reprints: ["set4-099", "set9-101"],
  cardType: "item",
  name: "Signed Contract",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "004",
  cardNumber: 99,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_ebe4a26a2312422db81dc2b43198f159",
    tcgPlayer: 650039,
  },
  text: [
    {
      title: "FINE PRINT",
      description: "Whenever an opponent plays a song, you may draw a card.",
    },
  ],
  abilities: [
    {
      id: "1y6-1",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      name: "FINE PRINT",
      trigger: {
        event: "play",
        on: {
          cardType: "song",
          controller: "opponent",
        },
        timing: "whenever",
      },
      type: "triggered",
      text: "FINE PRINT Whenever an opponent plays a song, you may draw a card.",
    },
  ],
  i18n: signedContractI18n,
};
