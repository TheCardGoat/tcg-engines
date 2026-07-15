import type { CharacterCard } from "@tcg/lorcana-types";
import { maleficentMistressOfAllEvilEnchantedI18n } from "./209-maleficent-mistress-of-all-evil-enchanted.i18n";

export const maleficentMistressOfAllEvilEnchanted: CharacterCard = {
  id: "l4m",
  canonicalId: "ci_FwY",
  slug: "lorcana-ci_FwY",
  printings: [
    {
      id: "set3-209-enchanted",
      artId: "ci_FwY-enchanted",
      setCode: "set3",
      collectorNumber: "209",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set3-051"],
  cardType: "character",
  name: "Maleficent",
  version: "Mistress of All Evil",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "003",
  cardNumber: 209,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 5,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_40690491af114f2e810a6fd1c6ddcafa",
    tcgPlayer: "539159",
  },
  text: [
    {
      title: "DARK KNOWLEDGE",
      description: "Whenever this character quests, you may draw a card.",
    },
    {
      title: "DIVINATION",
      description:
        "During your turn, whenever you draw a card, you may move 1 damage counter from chosen character to chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "277-1",
      name: "DARK KNOWLEDGE",
      text: "DARK KNOWLEDGE Whenever this character quests, you may draw a card DIVINATION During your turn, whenever you draw a card, you may move 1 damage counter from chosen character to chosen opposing character.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
    {
      effect: {
        steps: [
          {
            chooser: "CONTROLLER",
            effect: {
              type: "move-damage",
              amount: 1,
              from: "CHOSEN_CHARACTER",
              to: "CHOSEN_OPPOSING_CHARACTER",
            },
            type: "optional",
          },
        ],
        type: "sequence",
      },
      id: "277-2",
      name: "DIVINATION",
      text: "DIVINATION During your turn, whenever you draw a card, you may move 1 damage counter from chosen character to chosen opposing character.",
      trigger: {
        event: "draw",
        on: "YOU",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: maleficentMistressOfAllEvilEnchantedI18n,
};
