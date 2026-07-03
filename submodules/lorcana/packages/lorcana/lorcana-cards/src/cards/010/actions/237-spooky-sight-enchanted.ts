import type { ActionCard } from "@tcg/lorcana-types";
import { spookySightEnchantedI18n } from "./237-spooky-sight-enchanted.i18n";

export const spookySightEnchanted: ActionCard = {
  id: "59U",
  canonicalId: "ci_5Hw",
  slug: "lorcana-ci_5Hw",
  printings: [
    {
      id: "set10-237-enchanted",
      artId: "ci_5Hw-enchanted",
      setCode: "set10",
      collectorNumber: "237",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set10-165"],
  cardType: "action",
  name: "Spooky Sight",
  inkType: ["sapphire"],
  set: "010",
  cardNumber: 237,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 6,
  inkable: false,
  externalIds: {
    lorcast: "crd_9a1fff8a9426484ebc7fae9cb8605572",
    tcgPlayer: "660011",
  },
  text: "Put all characters with cost 3 or less into their players' inkwells facedown and exerted.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "put-into-inkwell",
        source: "chosen-character",
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "cost-comparison",
              comparison: "less-or-equal",
              value: 3,
            },
          ],
        },
        facedown: true,
        exerted: true,
      },
    },
  ],
  i18n: spookySightEnchantedI18n,
};
