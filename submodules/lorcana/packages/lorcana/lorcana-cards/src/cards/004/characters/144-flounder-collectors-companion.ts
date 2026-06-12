import type { CharacterCard } from "@tcg/lorcana-types";
import { flounderCollectorsCompanionI18n } from "./144-flounder-collectors-companion.i18n";

export const flounderCollectorsCompanion: CharacterCard = {
  id: "xbo",
  canonicalId: "ci_xbo",
  reprints: ["set4-144"],
  cardType: "character",
  name: "Flounder",
  version: "Collector’s Companion",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "004",
  cardNumber: 144,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_e5268062a91d46d1b89bd272a3f8c043",
    tcgPlayer: 547687,
  },
  text: [
    {
      title: "Support",
    },
    {
      title: "I'M NOT A GUPPY",
      description:
        "If you have a character named Ariel in play, you pay 1 {I} less to play this character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "1n4-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
    {
      condition: {
        controller: "you",
        name: "Ariel",
        type: "has-named-character",
      },
      effect: {
        amount: 1,
        cardType: "character",
        type: "cost-reduction",
      },
      id: "1n4-2",
      name: "I'M NOT A GUPPY",
      sourceZones: ["hand"],
      text: "I'M NOT A GUPPY If you have a character named Ariel in play, you pay 1 {I} less to play this character.",
      type: "static",
    },
  ],
  i18n: flounderCollectorsCompanionI18n,
};
