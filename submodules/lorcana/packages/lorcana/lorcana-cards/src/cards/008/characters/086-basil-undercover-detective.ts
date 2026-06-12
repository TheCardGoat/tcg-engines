import type { CharacterCard } from "@tcg/lorcana-types";
import { basilUndercoverDetectiveI18n } from "./086-basil-undercover-detective.i18n";

export const basilUndercoverDetective: CharacterCard = {
  id: "c7u",
  canonicalId: "ci_c7u",
  reprints: ["set8-086"],
  cardType: "character",
  name: "Basil",
  version: "Undercover Detective",
  inkType: ["emerald"],
  franchise: "Great Mouse Detective",
  set: "008",
  cardNumber: 86,
  rarity: "rare",
  cost: 7,
  strength: 5,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_36c4b9223273478a903b07f18fe7d193",
    tcgPlayer: 631407,
  },
  text: [
    {
      title: "INCAPACITATE",
      description:
        "When you play this character, you may return chosen character to their player's hand.",
    },
    {
      title: "INTERFERE",
      description: "Whenever this character quests, chosen opponent discards a card at random.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Detective"],
  abilities: [
    {
      id: "c7u-1",
      name: "INCAPACITATE",
      text: "INCAPACITATE When you play this character, you may return chosen character to their player's hand.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: "CHOSEN_CHARACTER",
          type: "return-to-hand",
        },
        type: "optional",
      },
    },
    {
      id: "c7u-2",
      name: "INTERFERE",
      text: "INTERFERE Whenever this character quests, chosen opponent discards a card at random.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "discard",
        amount: 1,
        random: true,
        target: "OPPONENT",
      },
    },
  ],
  i18n: basilUndercoverDetectiveI18n,
};
