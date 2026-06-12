import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseInspirationalWarriorI18n } from "./200-mickey-mouse-inspirational-warrior.i18n";

export const mickeyMouseInspirationalWarrior: CharacterCard = {
  id: "Bv8",
  canonicalId: "ci_mDz",
  reprints: ["set7-200"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Inspirational Warrior",
  inkType: ["steel"],
  set: "007",
  cardNumber: 200,
  rarity: "legendary",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_ec8ba95c2c20470ab00ef4f03c8db8ee",
    tcgPlayer: 619749,
  },
  text: [
    {
      title: "STIRRING SPIRIT",
      description:
        "During your turn, whenever this character banishes another character in a challenge, you may play a character for free.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          cardType: "character",
          cost: "free",
          from: "hand",
          type: "play-card",
        },
        type: "optional",
      },
      id: "vri-1",
      name: "STIRRING SPIRIT",
      text: "STIRRING SPIRIT During your turn, whenever this character banishes another character in a challenge, you may play a character for free.",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      type: "triggered",
    },
  ],
  i18n: mickeyMouseInspirationalWarriorI18n,
};
