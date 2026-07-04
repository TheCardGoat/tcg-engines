import type { ActionCard } from "@tcg/lorcana-types";
import { andThenAlongCameZeusI18n } from "./195-and-then-along-came-zeus.i18n";

export const andThenAlongCameZeus: ActionCard = {
  id: "rIR",
  canonicalId: "ci_dTx",
  slug: "lorcana-ci_dTx",
  printings: [
    {
      id: "set3-195",
      artId: "set3-195",
      setCode: "set3",
      collectorNumber: "195",
      rarity: "rare",
      imageUrl: "",
    },
  ],
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
    tcgPlayer: "539173",
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
