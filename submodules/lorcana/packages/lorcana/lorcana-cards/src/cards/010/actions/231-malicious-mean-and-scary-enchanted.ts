import type { ActionCard } from "@tcg/lorcana-types";
import { maliciousMeanAndScaryEnchantedI18n } from "./231-malicious-mean-and-scary-enchanted.i18n";

export const maliciousMeanAndScaryEnchanted: ActionCard = {
  id: "z7X",
  canonicalId: "ci_Ggc",
  slug: "lorcana-ci_Ggc",
  printings: [
    {
      id: "set10-231-enchanted",
      artId: "ci_Ggc-enchanted",
      setCode: "set10",
      collectorNumber: "231",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set10-097"],
  cardType: "action",
  name: "Malicious, Mean, and Scary",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "010",
  cardNumber: 231,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_5547bd08bb6344d4bcd03d37e415c75f",
    tcgPlayer: "660027",
  },
  text: "Put 1 damage counter on each opposing character.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        amount: 1,
        target: "ALL_OPPOSING_CHARACTERS",
        type: "put-damage",
      },
      type: "action",
    },
  ],
  i18n: maliciousMeanAndScaryEnchantedI18n,
};
