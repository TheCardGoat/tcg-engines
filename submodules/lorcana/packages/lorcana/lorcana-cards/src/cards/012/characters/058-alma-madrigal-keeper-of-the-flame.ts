import type { CharacterCard } from "@tcg/lorcana-types";
import { almaMadrigalKeeperOfTheFlameI18n } from "./058-alma-madrigal-keeper-of-the-flame.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const almaMadrigalKeeperOfTheFlame: CharacterCard = {
  id: "HdV",
  canonicalId: "ci_HdV",
  reprints: ["set12-058"],
  cardType: "character",
  name: "Alma Madrigal",
  version: "Keeper of the Flame",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "012",
  cardNumber: 58,
  rarity: "rare",
  cost: 5,
  strength: 2,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_c464c4847629458e811da161a49a3aaf",
  },
  text: [
    {
      title: "Shift 3 {I}",
    },
    {
      title: "THAT'S ENOUGH",
      description:
        "Whenever you remove 1 or more damage from one of your characters, you may exert chosen opposing character.",
    },
  ],
  classifications: ["Floodborn", "Mentor", "Madrigal"],
  abilities: [
    shift(3),
    {
      id: "HdV-2",
      name: "THAT'S ENOUGH",
      type: "triggered",
      text: "THAT'S ENOUGH Whenever you remove 1 or more damage from one of your characters, you may exert chosen opposing character.",
      trigger: {
        event: "remove-damage",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
        sourceFilter: {
          sourceController: "you",
        },
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "exert",
          target: "CHOSEN_OPPOSING_CHARACTER",
        },
      },
    },
  ],
  i18n: almaMadrigalKeeperOfTheFlameI18n,
};
