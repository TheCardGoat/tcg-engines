import type { CharacterCard } from "@tcg/lorcana-types";
import { mushuFasttalkingDragonI18n } from "./130-mushu-fast-talking-dragon.i18n";

export const mushuFasttalkingDragon: CharacterCard = {
  id: "Ffp",
  canonicalId: "ci_Ffp",
  reprints: ["set8-130"],
  cardType: "character",
  name: "Mushu",
  version: "Fast-Talking Dragon",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "008",
  cardNumber: 130,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_ea0d142942ae47fb8d5840fedf77bd08",
    tcgPlayer: 631435,
  },
  text: [
    {
      title: "LET'S GET THIS SHOW ON THE ROAD",
      description:
        "{E} — Chosen character gains Rush this turn. (They can challenge the turn they're played.)",
    },
  ],
  classifications: ["Storyborn", "Ally", "Dragon"],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        duration: "this-turn",
        keyword: "Rush",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      id: "17r-1",
      name: "LET'S GET THIS SHOW ON THE ROAD",
      text: "LET'S GET THIS SHOW ON THE ROAD {E} — Chosen character gains Rush this turn.",
      type: "activated",
    },
  ],
  i18n: mushuFasttalkingDragonI18n,
};
