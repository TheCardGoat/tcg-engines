import type { CharacterCard } from "@tcg/lorcana-types";
import { faZhouMulansFatherI18n } from "./105-fa-zhou-mulans-father.i18n";

export const faZhouMulansFather: CharacterCard = {
  id: "m9e",
  canonicalId: "ci_m9e",
  reprints: ["set4-105"],
  cardType: "character",
  name: "Fa Zhou",
  version: "Mulan's Father",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "004",
  cardNumber: 105,
  rarity: "common",
  cost: 2,
  strength: 0,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8fe17bb9974247b18e4180d4e4df3ab0",
    tcgPlayer: 550590,
  },
  text: [
    {
      title: "WAR INJURY",
      description: "This character can't challenge.",
    },
    {
      title: "HEAD OF THE HOUSEHOLD",
      description:
        "{E} — Ready chosen character named Mulan. She can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Mentor"],
  abilities: [
    {
      effect: {
        restriction: "cant-challenge",
        target: "SELF",
        type: "restriction",
      },
      id: "gc0-1",
      name: "WAR INJURY",
      text: "WAR INJURY This character can't challenge.",
      type: "static",
    },
    {
      cost: {
        exert: true,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "ready",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [
                {
                  type: "has-name",
                  name: "Mulan",
                },
              ],
            },
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            duration: "this-turn",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [
                {
                  type: "has-name",
                  name: "Mulan",
                },
              ],
            },
          },
        ],
      },
      id: "gc0-2",
      name: "HEAD OF THE HOUSEHOLD",
      text: "HEAD OF THE HOUSEHOLD {E} — Ready chosen character named Mulan. She can't quest for the rest of this turn.",
      type: "activated",
    },
  ],
  i18n: faZhouMulansFatherI18n,
};
