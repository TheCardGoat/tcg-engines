import type { CharacterCard } from "@tcg/lorcana-types";
import { genieTheEverImpressiveI18n } from "./077-genie-the-ever-impressive.i18n";

export const genieTheEverImpressive: CharacterCard = {
  id: "5U3",
  canonicalId: "ci_5U3",
  slug: "lorcana-ci_5U3",
  printings: [
    {
      id: "set1-077",
      artId: "set1-077",
      setCode: "set1",
      collectorNumber: "77",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set1-077"],
  cardType: "character",
  name: "Genie",
  version: "The Ever Impressive",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "001",
  cardNumber: 77,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_64d94b7ad8e84bac909438767e1e63af",
    tcgPlayer: "507515",
  },
  classifications: ["Dreamborn", "Ally"],
  i18n: genieTheEverImpressiveI18n,
};
