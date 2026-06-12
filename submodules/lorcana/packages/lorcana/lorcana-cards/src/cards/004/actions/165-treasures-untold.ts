import type { ActionCard } from "@tcg/lorcana-types";
import { treasuresUntoldI18n } from "./165-treasures-untold.i18n";

export const treasuresUntold: ActionCard = {
  id: "WWB",
  canonicalId: "ci_WWB",
  reprints: ["set4-165"],
  cardType: "action",
  name: "Treasures Untold",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "004",
  cardNumber: 165,
  rarity: "rare",
  cost: 6,
  inkable: true,
  externalIds: {
    lorcast: "crd_e0862c1712b84e8eafa76836362c9870",
    tcgPlayer: 547772,
  },
  text: "Return up to 2 item cards from your discard into your hand.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "return-from-discard",
        cardType: "item",
        target: "CONTROLLER",
        count: 2,
        destination: "hand",
      },
    },
  ],
  i18n: treasuresUntoldI18n,
};
