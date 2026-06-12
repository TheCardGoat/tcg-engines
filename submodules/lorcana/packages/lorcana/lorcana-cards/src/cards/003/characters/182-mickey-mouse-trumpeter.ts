import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseTrumpeterI18n } from "./182-mickey-mouse-trumpeter.i18n";

export const mickeyMouseTrumpeter: CharacterCard = {
  id: "hh8",
  canonicalId: "ci_gBS",
  reprints: ["set3-182", "set9-172"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Trumpeter",
  inkType: ["steel"],
  set: "003",
  cardNumber: 182,
  rarity: "legendary",
  cost: 4,
  strength: 0,
  willpower: 1,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_631c3f90c74b4c0cabded03d2b07f85b",
    tcgPlayer: 650106,
  },
  text: [
    {
      title: "SOUND THE CALL",
      description: "{E}, 2 {I} — Play a character for free.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        cardType: "character",
        cost: "free",
        from: "hand",
        type: "play-card",
      },
      id: "6jz-1",
      name: "SOUND THE CALL",
      text: "SOUND THE CALL {E}, 2 {I} — Play a character for free.",
      type: "activated",
    },
  ],
  i18n: mickeyMouseTrumpeterI18n,
};
