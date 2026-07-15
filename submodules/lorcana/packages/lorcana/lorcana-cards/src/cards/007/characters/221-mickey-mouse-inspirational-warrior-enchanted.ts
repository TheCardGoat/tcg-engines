import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseInspirationalWarriorEnchantedI18n } from "./221-mickey-mouse-inspirational-warrior-enchanted.i18n";

export const mickeyMouseInspirationalWarriorEnchanted: CharacterCard = {
  id: "WSz",
  canonicalId: "ci_mDz",
  slug: "lorcana-ci_mDz",
  printings: [
    {
      id: "set7-221-enchanted",
      artId: "ci_mDz-enchanted",
      setCode: "set7",
      collectorNumber: "221",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set7-200"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Inspirational Warrior",
  inkType: ["steel"],
  set: "007",
  cardNumber: 221,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_ec8ba95c2c20470ab00ef4f03c8db8ee",
    tcgPlayer: "619749",
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
  i18n: mickeyMouseInspirationalWarriorEnchantedI18n,
};
