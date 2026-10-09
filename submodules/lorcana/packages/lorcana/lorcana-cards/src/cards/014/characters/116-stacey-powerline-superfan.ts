import type { CharacterCard } from "@tcg/lorcana-types";
import { staceyPowerlineSuperfanI18n } from "./116-stacey-powerline-superfan.i18n";

export const staceyPowerlineSuperfan: CharacterCard = {
  id: "bUg",
  canonicalId: "ci_bUg",
  slug: "lorcana-ci_bUg",
  printings: [
    {
      id: "set14-116",
      artId: "set14-116",
      setCode: "set14",
      collectorNumber: "116",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-116"],
  cardType: "character",
  name: "Stacey",
  version: "Powerline Superfan",
  inkType: ["ruby"],
  franchise: "Goofy Movie",
  set: "014",
  cardNumber: 116,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 3,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_1323750fa3724ad3a96a4e34db6c9e93",
  },
  classifications: ["Storyborn", "Ally"],
  i18n: staceyPowerlineSuperfanI18n,
};
