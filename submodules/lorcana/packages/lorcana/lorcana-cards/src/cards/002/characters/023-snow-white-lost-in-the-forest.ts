import type { CharacterCard } from "@tcg/lorcana-types";
import { snowWhiteLostInTheForestI18n } from "./023-snow-white-lost-in-the-forest.i18n";

export const snowWhiteLostInTheForest: CharacterCard = {
  id: "sl6",
  canonicalId: "ci_sl6",
  reprints: ["set2-023"],
  cardType: "character",
  name: "Snow White",
  version: "Lost in the Forest",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  cardNumber: 23,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_abb29b66e814454ab886f18985102a9d",
    tcgPlayer: 527721,
  },
  text: [
    {
      title: "I WON'T HURT YOU",
      description:
        "When you play this character, you may remove up to 2 damage from chosen character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: { type: "up-to", value: 2 },
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "remove-damage",
        },
        type: "optional",
      },
      id: "muw-1",
      name: "I WON'T HURT YOU",
      text: "I WON'T HURT YOU When you play this character, you may remove up to 2 damage from chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: snowWhiteLostInTheForestI18n,
};
