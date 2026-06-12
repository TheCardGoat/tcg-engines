import type { CharacterCard } from "@tcg/lorcana-types";
import { violetParrLearningNewPowersI18n } from "./048-violet-parr-learning-new-powers.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const violetParrLearningNewPowers: CharacterCard = {
  id: "YdE",
  canonicalId: "ci_YdE",
  reprints: ["set12-048"],
  cardType: "character",
  name: "Violet Parr",
  version: "Learning New Powers",
  inkType: ["amethyst"],
  franchise: "Incredibles",
  set: "012",
  cardNumber: 48,
  rarity: "uncommon",
  cost: 3,
  strength: 4,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_20da43997f8642f6b33d1fa04865209d",
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "DEFLECT",
      description:
        "When you play this character, you may move 1 damage from chosen character to chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Super", "Hero"],
  abilities: [
    evasive,
    {
      id: "YdE-2",
      name: "DEFLECT",
      type: "triggered",
      text: "DEFLECT When you play this character, you may move 1 damage from chosen character to chosen opposing character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "move-damage",
          amount: 1,
          from: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
            filters: [{ type: "status", status: "damaged" }],
          },
          to: "CHOSEN_OPPOSING_CHARACTER",
        },
      },
    },
  ],
  i18n: violetParrLearningNewPowersI18n,
};
