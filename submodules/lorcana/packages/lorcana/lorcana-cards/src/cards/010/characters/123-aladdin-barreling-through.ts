import type { CharacterCard } from "@tcg/lorcana-types";
import { boost } from "../../../helpers/abilities/boost";
import { reckless } from "../../../helpers/abilities/reckless";
import { aladdinBarrelingThroughI18n } from "./123-aladdin-barreling-through.i18n";

export const aladdinBarrelingThrough: CharacterCard = {
  id: "c04",
  canonicalId: "ci_pqa",
  reprints: ["set10-123"],
  cardType: "character",
  name: "Aladdin",
  version: "Barreling Through",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "010",
  cardNumber: 123,
  rarity: "rare",
  cost: 3,
  strength: 4,
  willpower: 4,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_eca465c4f9f6483db912ae876f8011ce",
    tcgPlayer: 660269,
  },
  text: [
    {
      title: "Boost 1 {I}",
    },
    {
      title: "Reckless",
    },
    {
      title: "ONLY THE BOLD",
      description:
        'While there\'s a card under this character, your characters with Reckless gain "{E} — Gain 1 lore."',
    },
  ],
  classifications: ["Storyborn", "Hero", "Whisper"],
  abilities: [
    boost(1),
    reckless,
    {
      id: "1tr-3",
      name: "ONLY THE BOLD",
      text: 'ONLY THE BOLD While there\'s a card under this character, your characters with Reckless gain "{E} — Gain 1 lore."',
      type: "static",
      condition: {
        type: "has-card-under",
      },
      effect: {
        type: "grant-abilities-while-here",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-keyword",
              keyword: "Reckless",
            },
          ],
        },
        abilities: [
          {
            type: "activated",
            name: "ONLY THE BOLD",
            text: "{E} — Gain 1 lore.",
            cost: {
              exert: true,
            },
            effect: {
              type: "gain-lore",
              amount: 1,
            },
          },
        ],
      },
    },
  ],
  i18n: aladdinBarrelingThroughI18n,
};
