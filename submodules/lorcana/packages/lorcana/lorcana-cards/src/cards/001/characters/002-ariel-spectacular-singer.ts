import type { CharacterCard } from "@tcg/lorcana-types";
import { arielSpectacularSingerI18n } from "./002-ariel-spectacular-singer.i18n";
import { singer } from "../../../helpers/abilities/singer";

export const arielSpectacularSinger: CharacterCard = {
  id: "Z4N",
  canonicalId: "ci_Z4N",
  reprints: ["set1-002"],
  cardType: "character",
  name: "Ariel",
  version: "Spectacular Singer",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "001",
  cardNumber: 2,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_be92bba983424f2f9546f237e65ce357",
    tcgPlayer: 504451,
  },
  text: [
    {
      title: "Singer 5",
    },
    {
      title: "MUSICAL DEBUT",
      description:
        "When you play this character, look at the top 4 cards of your deck. You may reveal a song card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    singer(5),
    {
      effect: {
        amount: 4,
        destinations: [
          {
            filter: {
              type: "song",
            },
            max: 1,
            min: 0,
            reveal: true,
            zone: "hand",
          },
          {
            ordering: "player-choice",
            remainder: true,
            zone: "deck-bottom",
          },
        ],
        type: "scry",
      },
      id: "1k6-2",
      name: "MUSICAL DEBUT",
      text: "MUSICAL DEBUT When you play this character, look at the top 4 cards of your deck. You may reveal a song card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: arielSpectacularSingerI18n,
};
