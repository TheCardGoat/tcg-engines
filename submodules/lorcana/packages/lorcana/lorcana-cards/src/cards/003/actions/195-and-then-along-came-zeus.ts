import type { ActionCard } from "@tcg/lorcana-types";
import { andThenAlongCameZeusI18n } from "./195-and-then-along-came-zeus.i18n";

export const andThenAlongCameZeus: ActionCard = {
  id: "DXq",
  canonicalId: "ci_dTx",
  reprints: ["set3-195"],
  cardType: "action",
  name: "And Then Along Came Zeus",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "003",
  cardNumber: 195,
  rarity: "rare",
  cost: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_0bd8f734ff064b3881191b916f8354cf",
    tcgPlayer: 539173,
  },
  text: "Deal 5 damage to chosen character or location.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        amount: 5,
        target: "CHOSEN_CHARACTER_OR_LOCATION",
        type: "deal-damage",
      },
      type: "action",
    },
  ],
  i18n: andThenAlongCameZeusI18n,
};
