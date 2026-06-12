import type { CharacterCard } from "@tcg/lorcana-types";
import { fredMajorScienceEnthusiastI18n } from "./092-fred-major-science-enthusiast.i18n";

export const fredMajorScienceEnthusiast: CharacterCard = {
  id: "7A9",
  canonicalId: "ci_7A9",
  reprints: ["set8-092"],
  cardType: "character",
  name: "Fred",
  version: "Major Science Enthusiast",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "008",
  cardNumber: 92,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_cce48aee1b594c6db6fbc7f6bc3eada7",
    tcgPlayer: 631411,
  },
  text: [
    {
      title: "SPITTING FIRE!",
      description: "When you play this character, you may banish chosen item.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "1pz-1",
      name: "SPITTING FIRE!",
      text: "SPITTING FIRE! When you play this character, you may banish chosen item.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: fredMajorScienceEnthusiastI18n,
};
