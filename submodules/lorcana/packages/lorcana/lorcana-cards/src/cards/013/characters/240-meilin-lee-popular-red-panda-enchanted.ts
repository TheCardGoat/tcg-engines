import type { CharacterCard } from "@tcg/lorcana-types";
import { meilinLeePopularRedPanda } from "./125-meilin-lee-popular-red-panda";
import { meilinLeePopularRedPandaEnchantedI18n } from "./240-meilin-lee-popular-red-panda-enchanted.i18n";

export const meilinLeePopularRedPandaEnchanted: CharacterCard = {
  ...meilinLeePopularRedPanda,
  id: "zCZ",
  printings: [
    {
      id: "set13-240-enchanted",
      artId: "ci_KWX-enchanted",
      setCode: "set13",
      collectorNumber: "240",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  cardNumber: 240,
  rarity: "enchanted",
  specialRarity: "enchanted",
  i18n: meilinLeePopularRedPandaEnchantedI18n,
};
