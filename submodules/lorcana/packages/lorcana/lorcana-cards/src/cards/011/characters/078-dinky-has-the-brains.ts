import type { CharacterCard } from "@tcg/lorcana-types";
import { dinkyHasTheBrainsI18n } from "./078-dinky-has-the-brains.i18n";

export const dinkyHasTheBrains: CharacterCard = {
  id: "m5J",
  canonicalId: "ci_m5J",
  reprints: ["set11-078"],
  cardType: "character",
  name: "Dinky",
  version: "Has the Brains",
  inkType: ["emerald"],
  franchise: "Fox and the Hound",
  set: "011",
  cardNumber: 78,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_0fc3d71d5b8e4fb08b5c9108cbd3e28a",
    tcgPlayer: 676199,
  },
  text: [
    {
      title: "GET HIM!",
      description:
        "When you play this character, each opponent chooses one of their characters and deals 1 damage to them.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "lv7-1",
      name: "GET HIM!",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "deal-damage",
        amount: 1,
        chosenBy: "opponent",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "opponent",
          selector: "chosen",
          zones: ["play"],
        },
      },
      text: "GET HIM! When you play this character, each opponent chooses one of their characters and deals 1 damage to them.",
    },
  ],
  i18n: dinkyHasTheBrainsI18n,
};
