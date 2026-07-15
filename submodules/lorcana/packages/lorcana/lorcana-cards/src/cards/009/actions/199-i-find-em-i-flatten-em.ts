import type { ActionCard } from "@tcg/lorcana-types";
import { iFindEmIFlattenEmI18n } from "./199-i-find-em-i-flatten-em.i18n";

export const iFindEmIFlattenEm: ActionCard = {
  id: "jXV",
  canonicalId: "ci_lHK",
  slug: "lorcana-ci_lHK",
  printings: [
    {
      id: "set9-199",
      artId: "set9-199",
      setCode: "set9",
      collectorNumber: "199",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set4-196", "set9-199"],
  cardType: "action",
  name: "I Find ’Em, I Flatten ’Em",
  inkType: ["steel"],
  franchise: "Encanto",
  set: "009",
  cardNumber: 199,
  rarity: "uncommon",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_47f56a5b08b04ccda46e94744710ad9c",
    tcgPlayer: "650132",
  },
  text: "Banish all items.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "banish",
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["item"],
        },
      },
    },
  ],
  i18n: iFindEmIFlattenEmI18n,
};
