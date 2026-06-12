import type { ActionCard } from "@tcg/lorcana-types";
import { maliciousMeanAndScaryI18n } from "./097-malicious-mean-and-scary.i18n";

export const maliciousMeanAndScary: ActionCard = {
  id: "Rc1",
  canonicalId: "ci_Ggc",
  reprints: ["set10-097"],
  cardType: "action",
  name: "Malicious, Mean, and Scary",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "010",
  cardNumber: 97,
  rarity: "uncommon",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_5547bd08bb6344d4bcd03d37e415c75f",
    tcgPlayer: 660027,
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
  i18n: maliciousMeanAndScaryI18n,
};
