import type { CharacterCard } from "@tcg/lorcana-types";
import { genieWonderfulTricksterI18n } from "./061-genie-wonderful-trickster.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const genieWonderfulTrickster: CharacterCard = {
  id: "o38",
  canonicalId: "ci_o38",
  reprints: ["set6-061"],
  cardType: "character",
  name: "Genie",
  version: "Wonderful Trickster",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "006",
  cardNumber: 61,
  rarity: "legendary",
  cost: 7,
  strength: 4,
  willpower: 7,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5cbbabaf0d9f4ad58c942174904a1d8f",
    tcgPlayer: 588084,
  },
  text: [
    {
      title: "Shift 5",
    },
    {
      title: "YOUR REWARD AWAITS",
      description: "Whenever you play a card, draw a card.",
    },
    {
      title: "FORBIDDEN TREASURE",
      description:
        "At the end of your turn, put all the cards in your hand on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Floodborn", "Ally"],
  abilities: [
    shift(5),
    {
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      id: "1yx-2",
      name: "YOUR REWARD AWAITS",
      text: "YOUR REWARD AWAITS Whenever you play a card, draw a card.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          excludeSelf: true,
        },
        timing: "whenever",
      },
      type: "triggered",
    },
    {
      id: "1yx-3",
      name: "FORBIDDEN TREASURE",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      effect: {
        ordering: "player-choice",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["hand"],
        },
        type: "put-on-bottom",
      },
      text: "FORBIDDEN TREASURE At the end of your turn, put all the cards in your hand on the bottom of your deck in any order.",
      type: "triggered",
    },
  ],
  i18n: genieWonderfulTricksterI18n,
};
