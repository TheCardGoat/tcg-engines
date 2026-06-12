import type { CharacterCard } from "@tcg/lorcana-types";
import { meridaGiftedArcherI18n } from "./089-merida-gifted-archer.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const meridaGiftedArcher: CharacterCard = {
  id: "wwO",
  canonicalId: "ci_wwO",
  reprints: ["set12-089"],
  cardType: "character",
  name: "Merida",
  version: "Gifted Archer",
  inkType: ["emerald"],
  franchise: "Brave",
  set: "012",
  cardNumber: 89,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_2ba24a02308b4a9196bbe2cef9546e6b",
  },
  text: [
    {
      title: "Shift 3 {I}",
    },
    {
      title: "FIERCE PROTECTION",
      description:
        "While this character is exerted, whenever an opposing character challenges, you may deal 1 damage to the challenging character.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess"],
  abilities: [
    shift(3),
    {
      id: "wwO-2",
      name: "FIERCE PROTECTION",
      type: "triggered",
      trigger: {
        event: "challenge",
        on: "OPPONENT_CHARACTERS",
        timing: "whenever",
      },
      condition: {
        type: "is-exerted",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "deal-damage",
          amount: 1,
          target: {
            ref: "trigger-subject",
          },
        },
      },
      text: "FIERCE PROTECTION While this character is exerted, whenever an opposing character challenges, you may deal 1 damage to the challenging character.",
    },
  ],
  i18n: meridaGiftedArcherI18n,
};
