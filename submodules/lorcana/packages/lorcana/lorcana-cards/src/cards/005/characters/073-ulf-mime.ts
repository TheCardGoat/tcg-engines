import type { CharacterCard } from "@tcg/lorcana-types";
import { ulfMimeI18n } from "./073-ulf-mime.i18n";

export const ulfMime: CharacterCard = {
  id: "5p6",
  canonicalId: "ci_5p6",
  reprints: ["set5-073"],
  cardType: "character",
  name: "Ulf",
  version: "Mime",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "005",
  cardNumber: 73,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_4b2b91b67cde4db99f61c51b388a338f",
    tcgPlayer: 561159,
  },
  text: [
    {
      title: "SILENT PERFORMANCE",
      description: "This character can't {E} to sing songs.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        restriction: "cant-sing",
        target: "SELF",
        type: "restriction",
      },
      id: "111-1",
      name: "SILENT PERFORMANCE",
      text: "SILENT PERFORMANCE This character can't {E} to sing songs.",
      type: "static",
    },
  ],
  i18n: ulfMimeI18n,
};
