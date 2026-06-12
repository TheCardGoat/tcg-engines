import type { CharacterCard } from "@tcg/lorcana-types";
import { bambiLittlePrinceI18n } from "./063-bambi-little-prince.i18n";

export const bambiLittlePrince: CharacterCard = {
  id: "WmT",
  canonicalId: "ci_eD3",
  reprints: ["set8-063"],
  cardType: "character",
  name: "Bambi",
  version: "Little Prince",
  inkType: ["amethyst"],
  franchise: "Bambi",
  set: "008",
  cardNumber: 63,
  rarity: "legendary",
  cost: 3,
  strength: 1,
  willpower: 1,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_6527615670294d2a8a23873bc964cec0",
    tcgPlayer: 633099,
  },
  text: [
    {
      title: "SAY HELLO",
      description: "When you play this character, gain 1 lore.",
    },
    {
      title: "KIND OF BASHFUL",
      description: "When an opponent plays a character, return this character to your hand.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [
    {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "cmx-1",
      name: "SAY HELLO",
      text: "SAY HELLO When you play this character, gain 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        target: "SELF",
        type: "return-to-hand",
      },
      id: "cmx-2",
      name: "KIND OF BASHFUL",
      text: "KIND OF BASHFUL When an opponent plays a character, return this character to your hand.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          controller: "opponent",
        },
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: bambiLittlePrinceI18n,
};
