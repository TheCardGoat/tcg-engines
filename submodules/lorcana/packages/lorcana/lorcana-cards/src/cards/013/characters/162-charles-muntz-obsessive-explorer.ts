import type { CharacterCard } from "@tcg/lorcana-types";
import { charlesMuntzObsessiveExplorerI18n } from "./162-charles-muntz-obsessive-explorer.i18n";

export const charlesMuntzObsessiveExplorer: CharacterCard = {
  id: "I7b",
  canonicalId: "ci_I7b",
  slug: "lorcana-ci_I7b",
  printings: [
    {
      id: "set13-162",
      artId: "set13-162",
      setCode: "set13",
      collectorNumber: "162",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-162"],
  cardType: "character",
  name: "Charles Muntz",
  version: "Obsessive Explorer",
  inkType: ["sapphire"],
  franchise: "Up",
  set: "013",
  cardNumber: 162,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_1d8f273d61c54f8e9fb5a188994bdff0",
  },
  text: [
    {
      title: "USEFUL GEAR",
      description:
        "Whenever you play an item, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
    },
    {
      title: "FIND THAT BIRD!",
      description:
        "Whenever this character quests, look at the top card of your deck. If it's a character card named Kevin, you may reveal it and put it into your hand to gain 3 lore. Otherwise, put it on either the top or the bottom of your deck.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Inventor"],
  abilities: [
    {
      id: "I7b-1",
      name: "USEFUL GEAR",
      type: "triggered",
      trigger: {
        event: "play",
        on: {
          cardType: "item",
          controller: "you",
        },
        timing: "whenever",
      },
      effect: {
        type: "scry",
        amount: 1,
        target: "CONTROLLER",
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
      },
      text: "USEFUL GEAR Whenever you play an item, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
    },
    {
      id: "I7b-2",
      name: "FIND THAT BIRD!",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "reveal-and-route",
        target: "CONTROLLER",
        routes: [
          {
            condition: {
              type: "revealed-is-character-named",
              name: "Kevin",
            },
            destination: {
              zone: "hand",
            },
            optional: true,
            sideEffects: [
              {
                type: "gain-lore",
                amount: 3,
                target: "CONTROLLER",
              },
            ],
          },
        ],
        fallback: {
          zone: "deck-bottom",
        },
      },
      text: "FIND THAT BIRD! Whenever this character quests, look at the top card of your deck. If it's a character card named Kevin, you may reveal it and put it into your hand to gain 3 lore. Otherwise, put it on either the top or the bottom of your deck.",
    },
  ],
  i18n: charlesMuntzObsessiveExplorerI18n,
};
