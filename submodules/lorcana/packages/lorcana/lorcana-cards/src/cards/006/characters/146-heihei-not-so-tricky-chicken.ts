import type { CharacterCard } from "@tcg/lorcana-types";
import { heiheiNotsotrickyChickenI18n } from "./146-heihei-not-so-tricky-chicken.i18n";

export const heiheiNotsotrickyChicken: CharacterCard = {
  id: "jj9",
  canonicalId: "ci_jj9",
  reprints: ["set6-146"],
  cardType: "character",
  name: "Heihei",
  version: "Not-So-Tricky Chicken",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "006",
  cardNumber: 146,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e4908765126742488bab30dd0beb2c12",
    tcgPlayer: 588363,
  },
  text: [
    {
      title: "EAT ANYTHING",
      description:
        "When you play this character, exert chosen opposing item. It can't ready at the start of its next turn.",
    },
    {
      title: "OUT TO LUNCH",
      description:
        "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        steps: [
          {
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["item"],
            },
            type: "exert",
          },
          {
            duration: "next-turn",
            restriction: "cant-ready",
            target: { ref: "previous-target" },
            type: "restriction",
          },
        ],
        type: "sequence",
      },
      id: "1qk-1",
      name: "EAT ANYTHING",
      text: "EAT ANYTHING When you play this character, exert chosen opposing item. It can't ready at the start of its next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      condition: {
        type: "turn",
        whose: "your",
      },
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "1qk-2",
      name: "OUT TO LUNCH",
      text: "OUT TO LUNCH During your turn, this character gains Evasive.",
      type: "static",
    },
  ],
  i18n: heiheiNotsotrickyChickenI18n,
};
