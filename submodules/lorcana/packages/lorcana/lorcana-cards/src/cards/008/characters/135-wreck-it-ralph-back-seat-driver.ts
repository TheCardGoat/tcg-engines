import type { CharacterCard } from "@tcg/lorcana-types";
import { wreckitRalphBackSeatDriverI18n } from "./135-wreck-it-ralph-back-seat-driver.i18n";

export const wreckitRalphBackSeatDriver: CharacterCard = {
  id: "mFI",
  canonicalId: "ci_mFI",
  reprints: ["set8-135"],
  cardType: "character",
  name: "Wreck-It Ralph",
  version: "Back Seat Driver",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "008",
  cardNumber: 135,
  rarity: "rare",
  cost: 3,
  strength: 4,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_9eeb0424b962449d8a91e3ff5487e96c",
    tcgPlayer: 631692,
  },
  text: [
    {
      title: "CHARGED UP",
      description: "When you play this character, chosen Racer character gets +4 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Racer"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 4,
        stat: "strength",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Racer",
            },
          ],
        },
        type: "modify-stat",
      },
      id: "1ce-1",
      name: "CHARGED UP",
      text: "CHARGED UP When you play this character, chosen Racer character gets +4 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: wreckitRalphBackSeatDriverI18n,
};
