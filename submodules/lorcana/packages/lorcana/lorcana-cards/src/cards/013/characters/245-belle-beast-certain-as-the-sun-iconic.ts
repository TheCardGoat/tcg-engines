import type { CharacterCard } from "@tcg/lorcana-types";
import { belleBeastCertainAsTheSun } from "./132-belle-beast-certain-as-the-sun";
import { belleBeastCertainAsTheSunIconicI18n } from "./245-belle-beast-certain-as-the-sun-iconic.i18n";

export const belleBeastCertainAsTheSunIconic: CharacterCard = {
  ...belleBeastCertainAsTheSun,
  id: "1aZ",
  printings: [
    {
      id: "set13-245-iconic",
      artId: "ci_ibA-iconic",
      setCode: "set13",
      collectorNumber: "245",
      rarity: "iconic",
      imageUrl: "",
    },
  ],
  cardNumber: 245,
  rarity: "common",
  specialRarity: "iconic",
  i18n: belleBeastCertainAsTheSunIconicI18n,
};
