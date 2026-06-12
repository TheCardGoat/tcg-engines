import type { ActionCard } from "@tcg/lorcana-types";
import { howFarIllGoI18n } from "./161-how-far-ill-go.i18n";

export const howFarIllGo: ActionCard = {
  id: "r73",
  canonicalId: "ci_r73",
  reprints: ["set3-161"],
  cardType: "action",
  name: "How Far I'll Go",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "003",
  cardNumber: 161,
  rarity: "uncommon",
  cost: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_b6996baaca9440328210eecc4afdc123",
    tcgPlayer: 539102,
  },
  text: "Look at the top 2 cards of your deck. Put one into your hand and the other into your inkwell facedown and exerted.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        type: "scry",
        amount: 2,
        target: "CONTROLLER",
        destinations: [
          {
            zone: "hand",
            min: 1,
            max: 1,
          },
          {
            zone: "inkwell",
            min: 1,
            max: 1,
            exerted: true,
            facedown: true,
          },
        ],
      },
      type: "action",
    },
  ],
  i18n: howFarIllGoI18n,
};
