import type { ActionCard } from "@tcg/lorcana-types";
import { showMeMoreEnchantedI18n } from "./211-show-me-more-enchanted.i18n";

export const showMeMoreEnchanted: ActionCard = {
  id: "a5N",
  canonicalId: "ci_Jte",
  slug: "lorcana-ci_Jte",
  printings: [
    {
      id: "set7-211-enchanted",
      artId: "ci_Jte-enchanted",
      setCode: "set7",
      collectorNumber: "211",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set7-082"],
  cardType: "action",
  name: "Show Me More!",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "007",
  cardNumber: 211,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_29df1d46e9f9463f9058c264f7b3bbd5",
    tcgPlayer: "619739",
  },
  text: "Each player draws 3 cards.",
  abilities: [
    {
      id: "11i-1",
      effect: {
        amount: 3,
        target: "EACH_PLAYER",
        type: "draw",
      },
      type: "action",
      text: "Each player draws 3 cards.",
    },
  ],
  i18n: showMeMoreEnchantedI18n,
};
