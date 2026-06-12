import type { ItemCard } from "@tcg/lorcana-types";
import { maleficentsStaffI18n } from "./065-maleficents-staff.i18n";

export const maleficentsStaff: ItemCard = {
  id: "8Jv",
  canonicalId: "ci_O2Q",
  reprints: ["set6-065"],
  cardType: "item",
  name: "Maleficent's Staff",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "006",
  cardNumber: 65,
  rarity: "rare",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_66c2f5fd704b45bdbe79f585ac31d6fc",
    tcgPlayer: 592034,
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
  i18n: maleficentsStaffI18n,
};
