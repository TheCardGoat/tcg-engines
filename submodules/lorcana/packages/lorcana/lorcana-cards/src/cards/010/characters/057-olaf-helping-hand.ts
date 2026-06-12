import type { CharacterCard } from "@tcg/lorcana-types";
import { olafHelpingHandI18n } from "./057-olaf-helping-hand.i18n";

export const olafHelpingHand: CharacterCard = {
  id: "D7f",
  canonicalId: "ci_D7f",
  reprints: ["set10-057"],
  cardType: "character",
  name: "Olaf",
  version: "Helping Hand",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "010",
  cardNumber: 57,
  rarity: "uncommon",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e9f12c944cfb48bb98fc1a02e87bb6db",
    tcgPlayer: 659447,
  },
  text: [
    {
      title: "SECOND CHANCE",
      description:
        "When this character leaves play, you may return chosen character of yours to your hand.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "you",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "return-to-hand",
        },
        type: "optional",
      },
      id: "uix-1",
      name: "SECOND CHANCE",
      text: "SECOND CHANCE When this character leaves play, you may return chosen character of yours to your hand.",
      trigger: {
        event: "leave-play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: olafHelpingHandI18n,
};
