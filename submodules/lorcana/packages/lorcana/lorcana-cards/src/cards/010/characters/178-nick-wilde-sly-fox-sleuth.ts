import type { CharacterCard } from "@tcg/lorcana-types";
import { nickWildeSlyFoxSleuthI18n } from "./178-nick-wilde-sly-fox-sleuth.i18n";

export const nickWildeSlyFoxSleuth: CharacterCard = {
  id: "MAY",
  canonicalId: "ci_MAY",
  slug: "lorcana-ci_MAY",
  printings: [
    {
      id: "set10-178",
      artId: "set10-178",
      setCode: "set10",
      collectorNumber: "178",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set10-178"],
  cardType: "character",
  name: "Nick Wilde",
  version: "Sly Fox Sleuth",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "010",
  cardNumber: 178,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_cd157cb698744c9ab14a292d392123b8",
    tcgPlayer: "660167",
  },
  classifications: ["Dreamborn", "Ally", "Detective"],
  i18n: nickWildeSlyFoxSleuthI18n,
};
