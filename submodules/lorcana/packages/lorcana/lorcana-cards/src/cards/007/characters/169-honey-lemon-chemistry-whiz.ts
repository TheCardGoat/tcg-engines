import type { CharacterCard } from "@tcg/lorcana-types";
import { honeyLemonChemistryWhizI18n } from "./169-honey-lemon-chemistry-whiz.i18n";

export const honeyLemonChemistryWhiz: CharacterCard = {
  id: "20p",
  canonicalId: "ci_20p",
  reprints: ["set7-169"],
  cardType: "character",
  name: "Honey Lemon",
  version: "Chemistry Whiz",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "007",
  cardNumber: 169,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_78044308d04647f5ac60546f4d320292",
    tcgPlayer: 619503,
  },
  text: [
    {
      title: "PRETTY GREAT, HUH?",
      description:
        "Whenever you play a Floodborn character, if you used Shift to play them, you may remove up to 2 damage from chosen character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Inventor"],
  abilities: [
    {
      id: "1q1-1",
      name: "PRETTY GREAT, HUH?",
      type: "triggered",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          classification: "Floodborn",
          controller: "you",
        },
        timing: "whenever",
      },
      condition: {
        type: "play-context",
        context: "used-shift",
      },
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
      text: "PRETTY GREAT, HUH? Whenever you play a Floodborn character, if you used Shift to play them, you may remove up to 2 damage from chosen character.",
    },
  ],
  i18n: honeyLemonChemistryWhizI18n,
};
