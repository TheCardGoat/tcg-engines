import type { CharacterCard } from "@tcg/lorcana-types";
import { thumperYoungBunnyI18n } from "./134-thumper-young-bunny.i18n";

export const thumperYoungBunny: CharacterCard = {
  id: "tI0",
  canonicalId: "ci_tI0",
  reprints: ["set8-134"],
  cardType: "character",
  name: "Thumper",
  version: "Young Bunny",
  inkType: ["ruby"],
  franchise: "Bambi",
  set: "008",
  cardNumber: 134,
  rarity: "uncommon",
  cost: 2,
  strength: 0,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_def9163ddaf740d6820cbc2df3fddbf3",
    tcgPlayer: 631438,
  },
  text: [
    {
      title: "YOU CAN DO IT!",
      description: "{E} — Chosen character gets +3 this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        duration: "this-turn",
        modifier: 3,
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      id: "tI0-1",
      name: "YOU CAN DO IT!",
      text: "YOU CAN DO IT! {E} — Chosen character gets +3 this turn.",
      type: "activated",
    },
  ],
  i18n: thumperYoungBunnyI18n,
};
