import type { CharacterCard } from "@tcg/lorcana-types";
import { kakamoraPiratePitcherI18n } from "./105-kakamora-pirate-pitcher.i18n";

export const kakamoraPiratePitcher: CharacterCard = {
  id: "AVY",
  canonicalId: "ci_AVY",
  reprints: ["set6-105"],
  cardType: "character",
  name: "Kakamora",
  version: "Pirate Pitcher",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "006",
  cardNumber: 105,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_46799cbfa9fd48629572bf3851c598af",
    tcgPlayer: 588362,
  },
  text: [
    {
      title: "DIZZYING SPEED",
      description:
        "When you play this character, chosen Pirate character gains Evasive until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Pirate"],
  abilities: [
    {
      effect: {
        duration: "until-start-of-next-turn",
        keyword: "Evasive",
        target: {
          cardTypes: ["character"],
          count: 1,
          filter: [{ type: "has-classification", classification: "Pirate" }],
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      id: "xu8-1",
      name: "DIZZYING SPEED",
      text: "DIZZYING SPEED When you play this character, chosen Pirate character gains Evasive until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: kakamoraPiratePitcherI18n,
};
