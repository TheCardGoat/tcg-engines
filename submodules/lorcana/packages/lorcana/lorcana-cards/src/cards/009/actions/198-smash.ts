import type { ActionCard } from "@tcg/lorcana-types";
import { smashI18n } from "./198-smash.i18n";

export const smash: ActionCard = {
  id: "H3h",
  canonicalId: "ci_0iV",
  slug: "lorcana-ci_0iV",
  printings: [
    {
      id: "set9-198",
      artId: "set9-198",
      setCode: "set9",
      collectorNumber: "198",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set1-200", "set9-198"],
  cardType: "action",
  name: "Smash",
  inkType: ["steel"],
  franchise: "Frozen",
  set: "009",
  cardNumber: 198,
  rarity: "uncommon",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_108a4980fc8d4e3f84faf7b7ffc18cc0",
    tcgPlayer: "650131",
  },
  text: "Deal 3 damage to chosen character.",
  abilities: [
    {
      type: "action",
      effect: {
        amount: 3,
        type: "deal-damage",
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
  i18n: smashI18n,
};
