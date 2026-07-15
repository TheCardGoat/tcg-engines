import type { CharacterCard } from "@tcg/lorcana-types";
import { mikeWazowskiHeroicClimberI18n } from "./018-mike-wazowski-heroic-climber.i18n";

export const mikeWazowskiHeroicClimber: CharacterCard = {
  id: "35R",
  canonicalId: "ci_35R",
  slug: "lorcana-ci_35R",
  printings: [
    {
      id: "set13-018",
      artId: "set13-018",
      setCode: "set13",
      collectorNumber: "18",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-018"],
  cardType: "character",
  name: "Mike Wazowski",
  version: "Heroic Climber",
  inkType: ["amber"],
  franchise: "Monsters, Inc.",
  set: "013",
  cardNumber: 18,
  rarity: "common",
  cost: 2,
  strength: 0,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_c754c6ca0ba242e593252c4e8690258a",
  },
  text: [
    {
      title: "FIND",
      description:
        "A FRIEND When you play this character and whenever he quests, each player reveals the top card of their deck. If it's a character card, they may put it into their hand. Otherwise, put it on the bottom of their deck.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Monster"],
  abilities: [
    {
      type: "triggered",
      name: "FIND A FRIEND",
      text: "FIND A FRIEND When you play this character and whenever he quests, each player reveals the top card of their deck. If it's a character card, they may put it into their hand. Otherwise, put it on the bottom of their deck.",
      trigger: {
        events: ["play", "quest"],
        on: "SELF",
        timing: "when-or-whenever",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "scry",
            amount: 1,
            target: "CONTROLLER",
            chooser: "CONTROLLER",
            revealAll: true,
            destinations: [
              {
                zone: "hand",
                min: 0,
                max: 1,
                filter: {
                  type: "card-type",
                  cardType: "character",
                },
                reveal: true,
              },
              {
                zone: "deck-bottom",
                remainder: true,
              },
            ],
          },
          {
            type: "scry",
            amount: 1,
            target: "OPPONENT",
            chooser: "OPPONENT",
            revealAll: true,
            destinations: [
              {
                zone: "hand",
                min: 0,
                max: 1,
                filter: {
                  type: "card-type",
                  cardType: "character",
                },
                reveal: true,
              },
              {
                zone: "deck-bottom",
                remainder: true,
              },
            ],
          },
        ],
      },
    },
  ],
  i18n: mikeWazowskiHeroicClimberI18n,
};
