import type { CharacterCard } from "@tcg/lorcana-types";
import { flotsamJetsamEntanglingEelsI18n } from "./044-flotsam-jetsam-entangling-eels.i18n";

export const flotsamJetsamEntanglingEels: CharacterCard = {
  id: "Eq7",
  canonicalId: "ci_Eq7",
  reprints: ["set4-044"],
  cardType: "character",
  name: "Flotsam & Jetsam",
  version: "Entangling Eels",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "004",
  cardNumber: 44,
  rarity: "uncommon",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_2eb85540f12446e38d0eef16937315eb",
    tcgPlayer: 547764,
  },
  text: [
    {
      title: "Shift: Discard 2 cards ",
      description:
        "(You may discard 2 cards to play this on top of one of your characters named Flotsam or Jetsam.)",
    },
    {
      title: "(This character counts as being named both Flotsam and Jetsam.)",
    },
  ],
  classifications: ["Floodborn", "Ally"],
  abilities: [
    {
      type: "keyword",
      keyword: "Shift",
      cost: {
        discardCards: 2,
      },
      shiftTarget: "Flotsam or Jetsam",
      text: "Shift: Discard 2 cards (You may discard 2 cards to play this on top of one of your characters named Flotsam or Jetsam.)",
    },
  ],
  i18n: flotsamJetsamEntanglingEelsI18n,
};
