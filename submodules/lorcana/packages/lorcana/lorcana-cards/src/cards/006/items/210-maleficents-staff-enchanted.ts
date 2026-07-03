import type { ItemCard } from "@tcg/lorcana-types";
import { maleficentsStaffEnchantedI18n } from "./210-maleficents-staff-enchanted.i18n";

export const maleficentsStaffEnchanted: ItemCard = {
  id: "CTm",
  canonicalId: "ci_O2Q",
  slug: "lorcana-ci_O2Q",
  printings: [
    {
      id: "set6-210-enchanted",
      artId: "ci_O2Q-enchanted",
      setCode: "set6",
      collectorNumber: "210",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set6-065"],
  cardType: "item",
  name: "Maleficent's Staff",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "006",
  cardNumber: 210,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_66c2f5fd704b45bdbe79f585ac31d6fc",
    tcgPlayer: "592034",
  },
  text: [
    {
      title: "BACK, FOOLS!",
      description:
        "Whenever one of your opponents' characters, items, or locations is returned to their hand from play, gain 1 lore.",
    },
  ],
  abilities: [
    {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "8Jv-1",
      name: "BACK, FOOLS!",
      text: "BACK, FOOLS! Whenever one of your opponents' characters, items, or locations is returned to their hand from play, gain 1 lore.",
      trigger: {
        event: "return-to-hand",
        on: {
          controller: "opponent",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: maleficentsStaffEnchantedI18n,
};
