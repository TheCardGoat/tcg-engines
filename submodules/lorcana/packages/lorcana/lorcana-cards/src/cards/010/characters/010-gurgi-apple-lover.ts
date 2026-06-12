import type { CharacterCard } from "@tcg/lorcana-types";
import { gurgiAppleLoverI18n } from "./010-gurgi-apple-lover.i18n";

export const gurgiAppleLover: CharacterCard = {
  id: "KY3",
  canonicalId: "ci_KY3",
  reprints: ["set10-010"],
  cardType: "character",
  name: "Gurgi",
  version: "Apple Lover",
  inkType: ["amber"],
  franchise: "Black Cauldron",
  set: "010",
  cardNumber: 10,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_9b85042e33b2405e923af72d271b377e",
    tcgPlayer: 658290,
  },
  text: [
    {
      title: "HAPPY DAY",
      description:
        "When you play this character, you may remove up to 2 damage from chosen character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
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
      id: "1pr-1",
      name: "HAPPY DAY",
      text: "HAPPY DAY When you play this character, you may remove up to 2 damage from chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: gurgiAppleLoverI18n,
};
