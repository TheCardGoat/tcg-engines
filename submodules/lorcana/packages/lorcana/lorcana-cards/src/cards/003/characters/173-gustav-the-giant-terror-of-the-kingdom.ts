import type { CharacterCard } from "@tcg/lorcana-types";
import { gustavTheGiantTerrorOfTheKingdomI18n } from "./173-gustav-the-giant-terror-of-the-kingdom.i18n";

export const gustavTheGiantTerrorOfTheKingdom: CharacterCard = {
  id: "25w",
  canonicalId: "ci_25w",
  reprints: ["set3-173"],
  cardType: "character",
  name: "Gustav the Giant",
  version: "Terror of the Kingdom",
  inkType: ["steel"],
  set: "003",
  cardNumber: 173,
  rarity: "rare",
  cost: 3,
  strength: 6,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_2977bf4ea525446f9f26eb7c272ed37b",
    tcgPlayer: 539105,
  },
  text: [
    {
      title: "ALL TIED UP",
      description: "This character enters play exerted and can't ready at the start of your turn.",
    },
    {
      title: "BREAK FREE",
      description:
        "During your turn, whenever one of your other characters banishes another character in a challenge, you may ready this character.",
    },
  ],
  classifications: ["Dreamborn", "Villain"],
  abilities: [
    {
      effect: {
        restriction: "enters-play-exerted",
        target: "SELF",
        type: "restriction",
      },
      id: "5zz-1",
      name: "ALL TIED UP",
      text: "ALL TIED UP This character enters play exerted and can't ready at the start of your turn.",
      type: "static",
    },
    {
      effect: {
        restriction: "cant-ready-at-start-of-turn",
        target: "SELF",
        type: "restriction",
      },
      id: "5zz-1b",
      name: "ALL TIED UP",
      text: "ALL TIED UP This character enters play exerted and can't ready at the start of your turn.",
      type: "static",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "self",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "ready",
        },
        type: "optional",
      },
      id: "5zz-2",
      name: "BREAK FREE",
      text: "BREAK FREE During your turn, whenever one of your other characters banishes another character in a challenge, you may ready this character.",
      trigger: {
        event: "banish-in-challenge",
        on: "YOUR_OTHER_CHARACTERS",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: gustavTheGiantTerrorOfTheKingdomI18n,
};
