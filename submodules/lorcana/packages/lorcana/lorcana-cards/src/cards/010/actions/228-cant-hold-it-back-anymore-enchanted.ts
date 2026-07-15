import type { ActionCard } from "@tcg/lorcana-types";
import { cantHoldItBackAnymoreEnchantedI18n } from "./228-cant-hold-it-back-anymore-enchanted.i18n";

export const cantHoldItBackAnymoreEnchanted: ActionCard = {
  id: "2fJ",
  canonicalId: "ci_s2u",
  slug: "lorcana-ci_s2u",
  printings: [
    {
      id: "set10-228-enchanted",
      artId: "ci_s2u-enchanted",
      setCode: "set10",
      collectorNumber: "228",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set10-062"],
  cardType: "action",
  name: "Can't Hold It Back Anymore",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "010",
  cardNumber: 228,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_715c77fe8d9b410d8194beea91b7163d",
    tcgPlayer: "660041",
  },
  text: "Exert chosen opposing character. Move all damage counters from all other characters to that character.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        steps: [
          {
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "opponent",
              selector: "chosen",
              zones: ["play"],
            },
            type: "exert",
          },
          {
            from: "ALL_CHARACTERS",
            to: {
              ref: "previous-target",
            },
            type: "move-damage",
          },
        ],
        type: "sequence",
      },
      type: "action",
    },
  ],
  i18n: cantHoldItBackAnymoreEnchantedI18n,
};
