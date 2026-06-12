import type { CharacterCard } from "@tcg/lorcana-types";
import { hiroHamadaTeamLeaderI18n } from "./154-hiro-hamada-team-leader.i18n";

export const hiroHamadaTeamLeader: CharacterCard = {
  id: "Lzp",
  canonicalId: "ci_Lzp",
  reprints: ["set6-154"],
  cardType: "character",
  name: "Hiro Hamada",
  version: "Team Leader",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  cardNumber: 154,
  rarity: "rare",
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_7115d5f5c2604ff08596a89ef6574d19",
    tcgPlayer: 578232,
  },
  text: [
    {
      title: "I NEED TO UPGRADE ALL OF YOU",
      description: "Your other Inventor characters gain Resist +1.",
    },
    {
      title: "SHAPE THE FUTURE 2",
      description:
        "{I} — Look at the top card of your deck. Put it on either the top or the bottom of your deck.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Inventor"],
  abilities: [
    {
      effect: {
        keyword: "Resist",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          excludeSelf: true,
          filter: [
            {
              type: "has-classification",
              classification: "Inventor",
            },
          ],
        },
        type: "gain-keyword",
        value: 1,
      },
      id: "1yr-1",
      name: "I NEED TO UPGRADE ALL OF YOU",
      text: "I NEED TO UPGRADE ALL OF YOU Your other Inventor characters gain Resist +1.",
      type: "static",
    },
    {
      cost: {
        ink: 2,
      },
      effect: {
        amount: 1,
        destinations: [
          {
            zone: "deck-top",
            min: 0,
            max: 1,
          },
          {
            zone: "deck-bottom",
            remainder: true,
          },
        ],
        type: "scry",
      },
      id: "1yr-2",
      text: "SHAPE THE FUTURE 2 {I} - Look at the top card of your deck. Put it on either the top or the bottom of your deck.",
      type: "activated",
    },
  ],
  i18n: hiroHamadaTeamLeaderI18n,
};
