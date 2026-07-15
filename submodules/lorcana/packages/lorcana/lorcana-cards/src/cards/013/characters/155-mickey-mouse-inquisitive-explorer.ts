import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseInquisitiveExplorerI18n } from "./155-mickey-mouse-inquisitive-explorer.i18n";

export const mickeyMouseInquisitiveExplorer: CharacterCard = {
  id: "JLp",
  canonicalId: "ci_JLp",
  slug: "lorcana-ci_JLp",
  printings: [
    {
      id: "set13-155",
      artId: "set13-155",
      setCode: "set13",
      collectorNumber: "155",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-155"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Inquisitive Explorer",
  inkType: ["sapphire"],
  set: "013",
  cardNumber: 155,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 5,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_3ced0ce0141942339483629a699b4276",
  },
  classifications: ["Dreamborn", "Hero"],
  i18n: mickeyMouseInquisitiveExplorerI18n,
};
