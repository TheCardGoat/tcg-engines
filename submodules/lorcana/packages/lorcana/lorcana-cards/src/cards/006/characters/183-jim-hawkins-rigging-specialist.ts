import type { CharacterCard } from "@tcg/lorcana-types";
import { jimHawkinsRiggingSpecialistI18n } from "./183-jim-hawkins-rigging-specialist.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const jimHawkinsRiggingSpecialist: CharacterCard = {
  id: "FZ4",
  canonicalId: "ci_FZ4",
  reprints: ["set6-183"],
  cardType: "character",
  name: "Jim Hawkins",
  version: "Rigging Specialist",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "006",
  cardNumber: 183,
  rarity: "uncommon",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_88c973fe2a114a198654133896a022b7",
    tcgPlayer: 593015,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "BATTLE STATION",
      description:
        "When you play this character, you may deal 1 damage to chosen character or location.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
  abilities: [
    shift(3),
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character", "location"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "woa-2",
      name: "BATTLE STATION",
      text: "BATTLE STATION When you play this character, you may deal 1 damage to chosen character or location.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: jimHawkinsRiggingSpecialistI18n,
};
