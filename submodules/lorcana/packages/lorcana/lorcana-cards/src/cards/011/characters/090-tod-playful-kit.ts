import type { CharacterCard } from "@tcg/lorcana-types";
import { todPlayfulKitI18n } from "./090-tod-playful-kit.i18n";

export const todPlayfulKit: CharacterCard = {
  id: "43t",
  canonicalId: "ci_43t",
  reprints: ["set11-090"],
  cardType: "character",
  name: "Tod",
  version: "Playful Kit",
  inkType: ["emerald"],
  franchise: "Fox and the Hound",
  set: "011",
  cardNumber: 90,
  rarity: "rare",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_da2a2175ec4d44f0b624880a24548506",
    tcgPlayer: 673426,
  },
  text: [
    {
      title: "LOOK AT THIS!",
      description: "Whenever this character quests, choose one:",
    },
    {
      title: "* Gain 1 lore.",
    },
    {
      title: "* Chosen character of yours gains Evasive until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "43t-1",
      name: "LOOK AT THIS!",
      effect: {
        optionLabels: [
          "Gain 1 lore.",
          "Chosen character of yours gains Evasive until the start of your next turn.",
        ],
        options: [
          {
            amount: 1,
            type: "gain-lore",
          },
          {
            keyword: "Evasive",
            duration: "until-start-of-next-turn",
            target: "CHOSEN_CHARACTER_OF_YOURS",
            type: "gain-keyword",
          },
        ],
        type: "choice",
      },
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
      text: "LOOK AT THIS! Whenever this character quests, choose one: Gain 1 lore, or chosen character of yours gains Evasive until the start of your next turn.",
    },
  ],
  i18n: todPlayfulKitI18n,
};
