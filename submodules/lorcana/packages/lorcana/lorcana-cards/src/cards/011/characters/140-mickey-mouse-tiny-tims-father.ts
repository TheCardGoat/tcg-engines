import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseTinyTimsFatherI18n } from "./140-mickey-mouse-tiny-tims-father.i18n";

export const mickeyMouseTinyTimsFather: CharacterCard = {
  id: "mnX",
  canonicalId: "ci_mnX",
  slug: "lorcana-ci_mnX",
  printings: [
    {
      id: "set11-140",
      artId: "set11-140",
      setCode: "set11",
      collectorNumber: "140",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set11-140"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Tiny Tim's Father",
  inkType: ["sapphire"],
  franchise: "Mickey's Christmas Carol",
  set: "011",
  cardNumber: 140,
  rarity: "common",
  cost: 6,
  strength: 6,
  willpower: 7,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_9280b9713ade4c7fb2fb651ff5a2e815",
    tcgPlayer: "676220",
  },
  classifications: ["Storyborn", "Hero"],
  i18n: mickeyMouseTinyTimsFatherI18n,
};
