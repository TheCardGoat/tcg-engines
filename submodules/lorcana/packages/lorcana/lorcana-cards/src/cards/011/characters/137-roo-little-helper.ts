import type { CharacterCard } from "@tcg/lorcana-types";
import { rooLittleHelperI18n } from "./137-roo-little-helper.i18n";

export const rooLittleHelper: CharacterCard = {
  id: "0Bd",
  canonicalId: "ci_0Bd",
  reprints: ["set11-137"],
  cardType: "character",
  name: "Roo",
  version: "Little Helper",
  inkType: ["sapphire"],
  franchise: "Winnie the Pooh",
  set: "011",
  cardNumber: 137,
  rarity: "uncommon",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e2a1ea3f5b0d48db8e7197056581c11d",
    tcgPlayer: 676217,
  },
  text: [
    {
      title: "HOPPING IN",
      description:
        "{E} — Put this character facedown under one of your characters or locations with Boost.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Whisper"],
  abilities: [
    {
      id: "0Bd-1",
      name: "HOPPING IN",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "put-under",
        source: "this-card",
        under: {
          cardTypes: ["character", "location"],
          count: 1,
          owner: "you",
          selector: "chosen",
          zones: ["play"],
          filter: [
            {
              keyword: "Boost",
              type: "has-keyword",
            },
          ],
        },
      },
      text: "HOPPING IN {E} — Put this character facedown under one of your characters or locations with Boost.",
    },
  ],
  i18n: rooLittleHelperI18n,
};
