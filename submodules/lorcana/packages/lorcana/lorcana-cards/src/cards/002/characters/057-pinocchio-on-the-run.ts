import type { CharacterCard } from "@tcg/lorcana-types";
import { pinocchioOnTheRunI18n } from "./057-pinocchio-on-the-run.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const pinocchioOnTheRun: CharacterCard = {
  id: "e9v",
  canonicalId: "ci_e9v",
  reprints: ["set2-057"],
  cardType: "character",
  name: "Pinocchio",
  version: "On the Run",
  inkType: ["amethyst"],
  franchise: "Pinocchio",
  set: "002",
  cardNumber: 57,
  rarity: "uncommon",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_a3bfa4a999c04a9ea29d4877f877474e",
    tcgPlayer: 527626,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "LISTEN TO YOUR CONSCIENCE",
      description:
        "When you play this character, you may return chosen character or item with cost 3 or less to their player's hand.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
  abilities: [
    shift(3),
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character", "item"],
            filters: [
              {
                type: "cost-comparison",
                comparison: "less-or-equal",
                value: 3,
              },
            ],
          },
          type: "return-to-hand",
        },
        type: "optional",
      },
      id: "186-2",
      name: "LISTEN TO YOUR CONSCIENCE",
      text: "LISTEN TO YOUR CONSCIENCE When you play this character, you may return chosen character or item with cost 3 or less to their player's hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: pinocchioOnTheRunI18n,
};
