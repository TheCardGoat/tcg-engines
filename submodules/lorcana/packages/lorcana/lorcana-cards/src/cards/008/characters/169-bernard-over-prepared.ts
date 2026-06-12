import type { CharacterCard } from "@tcg/lorcana-types";
import { bernardOverpreparedI18n } from "./169-bernard-over-prepared.i18n";

export const bernardOverprepared: CharacterCard = {
  id: "xHO",
  canonicalId: "ci_xHO",
  reprints: ["set8-169"],
  cardType: "character",
  name: "Bernard",
  version: "Over-Prepared",
  inkType: ["sapphire", "steel"],
  franchise: "Rescuers",
  set: "008",
  cardNumber: 169,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_66c4a3962c704f18ac6b7131fa2662f1",
    tcgPlayer: 631465,
  },
  text: [
    {
      title: "GO DOWN THERE AND INVESTIGATE",
      description:
        "When you play this character, if you have an Ally character in play, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "wn2-1",
      condition: {
        type: "has-character-with-classification",
        classification: "Ally",
        controller: "you",
      },
      effect: {
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      name: "GO DOWN THERE AND INVESTIGATE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "GO DOWN THERE AND INVESTIGATE When you play this character, if you have an Ally character in play, you may draw a card.",
    },
  ],
  i18n: bernardOverpreparedI18n,
};
