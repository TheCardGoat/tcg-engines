import type { CharacterCard } from "@tcg/lorcana-types";
import { sneezyStartlinglyLoudI18n } from "./042-sneezy-startlingly-loud.i18n";

export const sneezyStartlinglyLoud: CharacterCard = {
  id: "Z17",
  canonicalId: "ci_Z17",
  reprints: ["set12-042"],
  cardType: "character",
  name: "Sneezy",
  version: "Startlingly Loud",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "012",
  cardNumber: 42,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_157e8d9b9f8745f2addc02e485dd2050",
  },
  text: [
    {
      title: "GESUNDHEIT",
      description: "When you play this character, chosen character gets +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
  abilities: [
    {
      id: "Z17-1",
      name: "Gesundheit",
      text: "Gesundheit When you play this character, chosen character gets +1 {L} this turn.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        duration: "this-turn",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
      },
    },
  ],
  i18n: sneezyStartlinglyLoudI18n,
};
