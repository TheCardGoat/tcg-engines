import type { CharacterCard } from "@tcg/lorcana-types";
import { judyHoppsUncoveringCluesD23I18n } from "./d23-014-judy-hopps-uncovering-clues.i18n";

export const judyHoppsUncoveringCluesD23: CharacterCard = {
  id: "Wsv",
  canonicalId: "ci_Imt",
  slug: "lorcana-ci_Imt",
  printings: [
    {
      id: "set10-d23-014",
      artId: "set10-d23-014",
      setCode: "set10",
      collectorNumber: "14",
      rarity: "special",
      imageUrl: "",
    },
  ],
  reprints: ["set10-d23-014", "set10-156"],
  cardType: "character",
  name: "Judy Hopps",
  version: "Uncovering Clues",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "010",
  cardNumber: 14,
  rarity: "special",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_977a785a450a4621b0dcff4404592877",
    tcgPlayer: "653916",
  },
  text: [
    {
      title: "Thorough Investigation",
      description:
        "When you play this character and whenever she quests, look at the top 3 cards of your deck. You may reveal a Detective character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Detective"],
  abilities: [
    {
      effect: {
        type: "scry",
        amount: 3,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
            reveal: true,
            filters: [
              {
                type: "card-type",
                cardType: "character",
              },
              {
                type: "classification",
                classification: "Detective",
              },
            ],
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
      id: "1mf-1",
      name: "THOROUGH INVESTIGATION",
      text: "THOROUGH INVESTIGATION When you play this character and whenever she quests, look at the top 3 cards of your deck. You may reveal a Detective character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        type: "scry",
        amount: 3,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
            reveal: true,
            filters: [
              {
                type: "card-type",
                cardType: "character",
              },
              {
                type: "classification",
                classification: "Detective",
              },
            ],
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
      id: "1mf-2",
      name: "THOROUGH INVESTIGATION",
      text: "THOROUGH INVESTIGATION When you play this character and whenever she quests, look at the top 3 cards of your deck. You may reveal a Detective character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: judyHoppsUncoveringCluesD23I18n,
};
