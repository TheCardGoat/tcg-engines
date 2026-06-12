import type { CharacterCard } from "@tcg/lorcana-types";
import { grumpySkepticalKnightI18n } from "./186-grumpy-skeptical-knight.i18n";

export const grumpySkepticalKnight: CharacterCard = {
  id: "VFd",
  canonicalId: "ci_VFd",
  reprints: ["set5-186"],
  cardType: "character",
  name: "Grumpy",
  version: "Skeptical Knight",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "005",
  cardNumber: 186,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_9ec070844bb24ee997efeb9e7bf9dac2",
    tcgPlayer: 559666,
  },
  text: [
    {
      title: "BOON OF RESILIENCE",
      description:
        "While one of your Knight characters is at a location, that character gains Resist +2.",
    },
    {
      title: "BURST OF SPEED",
      description:
        "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Knight", "Seven Dwarfs"],
  abilities: [
    {
      type: "static",
      effect: {
        keyword: "Resist",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Knight",
            },
            {
              type: "at-location",
            },
          ],
        },
        type: "gain-keyword",
        value: 2,
      },
      id: "pqh-1",
      name: "BOON OF RESILIENCE",
      text: "BOON OF RESILIENCE While one of your Knight characters is at a location, that character gains Resist +2.",
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
      id: "pqh-2",
      name: "BURST OF SPEED",
      text: "BURST OF SPEED During your turn, this character gains Evasive.",
      type: "static",
    },
  ],
  i18n: grumpySkepticalKnightI18n,
};
