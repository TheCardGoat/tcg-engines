import type { CharacterCard } from "@tcg/lorcana-types";
import { belleAlwaysReadingI18n } from "./148-belle-always-reading.i18n";

export const belleAlwaysReading: CharacterCard = {
  id: "WGT",
  canonicalId: "ci_WGT",
  slug: "lorcana-ci_WGT",
  printings: [
    {
      id: "set13-148",
      artId: "set13-148",
      setCode: "set13",
      collectorNumber: "148",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-148"],
  cardType: "character",
  name: "Belle",
  version: "Always Reading",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "013",
  cardNumber: 148,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8f0fc8f569f84d628af731a571bc62b1",
  },
  text: [
    {
      title: "DREAMING OF MORE",
      description: "You pay 1 {} less to shift a character on top of this character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      id: "WGT-1",
      name: "DREAMING OF MORE",
      type: "static",
      text: "DREAMING OF MORE You pay 1 {I} less to shift a character on top of this character.",
      effect: {
        type: "cost-reduction",
        amount: 1,
        cardType: "character",
        playMethod: "shift",
        target: "SELF",
      },
    },
  ],
  i18n: belleAlwaysReadingI18n,
};
