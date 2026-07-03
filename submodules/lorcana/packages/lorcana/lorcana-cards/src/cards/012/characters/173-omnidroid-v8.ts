import type { CharacterCard } from "@tcg/lorcana-types";
import { omnidroidV8I18n } from "./173-omnidroid-v8.i18n";

export const omnidroidV8: CharacterCard = {
  id: "IRb",
  canonicalId: "ci_IRb",
  slug: "lorcana-ci_IRb",
  printings: [
    {
      id: "set12-173",
      artId: "set12-173",
      setCode: "set12",
      collectorNumber: "173",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set12-173"],
  cardType: "character",
  name: "Omnidroid",
  version: "V.8",
  inkType: ["steel"],
  franchise: "Incredibles",
  set: "012",
  cardNumber: 173,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_533ffe972f704ee58ab086b350627fe7",
    tcgPlayer: "692192",
  },
  classifications: ["Storyborn", "Robot"],
  i18n: omnidroidV8I18n,
};
