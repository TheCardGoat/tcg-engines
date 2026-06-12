import type { CharacterCard } from "@tcg/lorcana-types";
import { honkerMuddlefootTimidGeniusI18n } from "./143-honker-muddlefoot-timid-genius.i18n";

export const honkerMuddlefootTimidGenius: CharacterCard = {
  id: "3yH",
  canonicalId: "ci_3yH",
  reprints: ["set11-143"],
  cardType: "character",
  name: "Honker Muddlefoot",
  version: "Timid Genius",
  inkType: ["sapphire"],
  franchise: "Darkwing Duck",
  set: "011",
  cardNumber: 143,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_864fbdcc6f91431db5a365dd2aa4dba1",
    tcgPlayer: 677136,
  },
  text: [
    {
      title: "BE CAREFUL!",
      description: "Your characters named Darkwing Duck gain Resist +1.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Inventor"],
  abilities: [
    {
      id: "fcd-1",
      name: "BE CAREFUL!",
      effect: {
        keyword: "Resist",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-name",
              name: "Darkwing Duck",
            },
          ],
        },
        type: "gain-keyword",
        value: 1,
      },
      type: "static",
      text: "BE CAREFUL! Your characters named Darkwing Duck gain Resist +1.",
    },
  ],
  i18n: honkerMuddlefootTimidGeniusI18n,
};
