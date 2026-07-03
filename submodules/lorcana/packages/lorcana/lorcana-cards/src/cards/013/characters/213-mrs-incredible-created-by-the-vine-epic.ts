import type { CharacterCard } from "@tcg/lorcana-types";
import { mrsIncredibleCreatedByTheVine } from "./051-mrs-incredible-created-by-the-vine";
import { mrsIncredibleCreatedByTheVineEpicI18n } from "./213-mrs-incredible-created-by-the-vine-epic.i18n";

export const mrsIncredibleCreatedByTheVineEpic: CharacterCard = {
  ...mrsIncredibleCreatedByTheVine,
  id: "gQJ",
  printings: [
    {
      id: "set13-213-epic",
      artId: "ci_qAV-epic",
      setCode: "set13",
      collectorNumber: "213",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  cardNumber: 213,
  rarity: "common",
  specialRarity: "epic",
  i18n: mrsIncredibleCreatedByTheVineEpicI18n,
};
