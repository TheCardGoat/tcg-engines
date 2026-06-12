import type { CharacterCard } from "@tcg/lorcana-types";
import { scroogeMcduckResourcefulMiserI18n } from "./154-scrooge-mcduck-resourceful-miser.i18n";

export const scroogeMcduckResourcefulMiser: CharacterCard = {
  id: "eru",
  canonicalId: "ci_eru",
  reprints: ["set7-154"],
  cardType: "character",
  name: "Scrooge McDuck",
  version: "Resourceful Miser",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "007",
  cardNumber: 154,
  rarity: "legendary",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_485779f8b4954059b78e81f46882d744",
    tcgPlayer: 618202,
  },
  text: [
    {
      title: "PUT IT TO GOOD USE",
      description: "You may exert 4 items of yours to play this character for free.",
    },
    {
      title: "FORTUNE HUNTER",
      description:
        "When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        type: "exert",
        target: {
          selector: "chosen",
          count: 4,
          owner: "you",
          zones: ["play"],
          cardTypes: ["item"],
          filter: [{ type: "ready" }],
        },
      },
      alternativeCost: "exert-4-items",
      id: "18b-1",
      name: "PUT IT TO GOOD USE",
      text: "PUT IT TO GOOD USE You may exert 4 items of yours to play this character for free.",
      type: "action",
    },
    {
      effect: {
        type: "scry",
        amount: 4,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
            reveal: true,
            filter: {
              type: "card-type",
              cardType: "item",
            },
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
      id: "18b-2",
      name: "FORTUNE HUNTER",
      text: "FORTUNE HUNTER When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: scroogeMcduckResourcefulMiserI18n,
};
