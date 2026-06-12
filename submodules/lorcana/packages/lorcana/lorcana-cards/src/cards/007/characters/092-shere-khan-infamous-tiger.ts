import type { CharacterCard } from "@tcg/lorcana-types";
import { shereKhanInfamousTigerI18n } from "./092-shere-khan-infamous-tiger.i18n";

export const shereKhanInfamousTiger: CharacterCard = {
  id: "Y6a",
  canonicalId: "ci_Y6a",
  reprints: ["set7-092"],
  cardType: "character",
  name: "Shere Khan",
  version: "Infamous Tiger",
  inkType: ["emerald"],
  franchise: "Jungle Book",
  set: "007",
  cardNumber: 92,
  rarity: "rare",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_7a9520920a6d4267a8bcd80653a43c60",
    tcgPlayer: 619455,
  },
  text: [
    {
      title: "WHAT A PITY",
      description: "When you play this character, discard your hand.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        amount: "all",
        target: "CONTROLLER",
        type: "discard",
      },
      id: "1r2-1",
      name: "WHAT A PITY",
      text: "WHAT A PITY When you play this character, discard your hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: shereKhanInfamousTigerI18n,
};
