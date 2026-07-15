import type { ActionCard } from "@tcg/lorcana-types";
import { secondStarToTheRightEnchantedI18n } from "./210-second-star-to-the-right-enchanted.i18n";

export const secondStarToTheRightEnchanted: ActionCard = {
  id: "B4E",
  canonicalId: "ci_oGQ",
  slug: "lorcana-ci_oGQ",
  printings: [
    {
      id: "set4-210-enchanted",
      artId: "ci_oGQ-enchanted",
      setCode: "set4",
      collectorNumber: "210",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set4-061", "set9-060"],
  cardType: "action",
  name: "Second Star to the Right",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "004",
  cardNumber: 210,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 10,
  inkable: false,
  externalIds: {
    lorcast: "crd_07d43fd911d2476caa9c4aa982d29405",
    tcgPlayer: "650004",
  },
  text: [
    {
      title: "Sing Together 10",
      description:
        "(Any number of your or your teammates' characters with total cost 10 or more may {E} to sing this song for free.)",
    },
    {
      title: "Chosen player draws 5 cards.",
    },
  ],
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "draw",
        amount: 5,
        target: "CHOSEN_PLAYER",
      },
    },
  ],
  i18n: secondStarToTheRightEnchantedI18n,
};
