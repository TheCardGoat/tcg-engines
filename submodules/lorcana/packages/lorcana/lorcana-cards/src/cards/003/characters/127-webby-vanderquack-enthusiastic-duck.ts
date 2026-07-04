import type { CharacterCard } from "@tcg/lorcana-types";
import { webbyVanderquackEnthusiasticDuckI18n } from "./127-webby-vanderquack-enthusiastic-duck.i18n";

export const webbyVanderquackEnthusiasticDuck: CharacterCard = {
  id: "3kz",
  canonicalId: "ci_3kz",
  slug: "lorcana-ci_3kz",
  printings: [
    {
      id: "set3-127",
      artId: "set3-127",
      setCode: "set3",
      collectorNumber: "127",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set3-127"],
  cardType: "character",
  name: "Webby Vanderquack",
  version: "Enthusiastic Duck",
  inkType: ["ruby"],
  franchise: "Ducktales",
  set: "003",
  cardNumber: 127,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_b1bb1284147849648c18082ac8b7f6b0",
    tcgPlayer: "538351",
  },
  classifications: ["Storyborn", "Ally"],
  i18n: webbyVanderquackEnthusiasticDuckI18n,
};
