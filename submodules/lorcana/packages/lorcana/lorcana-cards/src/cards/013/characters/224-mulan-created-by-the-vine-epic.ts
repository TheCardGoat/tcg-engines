import type { CharacterCard } from "@tcg/lorcana-types";
import { mulanCreatedByTheVine } from "./192-mulan-created-by-the-vine";
import { mulanCreatedByTheVineEpicI18n } from "./224-mulan-created-by-the-vine-epic.i18n";

export const mulanCreatedByTheVineEpic: CharacterCard = {
  ...mulanCreatedByTheVine,
  id: "51H",
  printings: [
    {
      id: "set13-224-epic",
      artId: "ci_v6P-epic",
      setCode: "set13",
      collectorNumber: "224",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  cardNumber: 224,
  rarity: "common",
  specialRarity: "epic",
  i18n: mulanCreatedByTheVineEpicI18n,
};
