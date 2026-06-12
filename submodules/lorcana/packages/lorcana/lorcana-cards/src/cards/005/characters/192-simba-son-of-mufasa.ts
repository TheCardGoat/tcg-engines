import type { CharacterCard } from "@tcg/lorcana-types";
import { simbaSonOfMufasaI18n } from "./192-simba-son-of-mufasa.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const simbaSonOfMufasa: CharacterCard = {
  id: "746",
  canonicalId: "ci_746",
  reprints: ["set5-192"],
  cardType: "character",
  name: "Simba",
  version: "Son of Mufasa",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "005",
  cardNumber: 192,
  rarity: "uncommon",
  cost: 6,
  strength: 3,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_6b0937a994d6436ca4ffaf3e6304534b",
    tcgPlayer: 561974,
  },
  text: [
    {
      title: "Shift 4",
    },
    {
      title: "FEARSOME ROAR",
      description: "When you play this character, you may banish chosen item or location.",
    },
  ],
  classifications: ["Floodborn", "Hero", "King"],
  abilities: [
    shift(4),
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: "CHOSEN_ITEM_OR_LOCATION",
          type: "banish",
        },
        type: "optional",
      },
      id: "xnq-2",
      name: "FEARSOME ROAR",
      text: "FEARSOME ROAR When you play this character, you may banish chosen item or location.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: simbaSonOfMufasaI18n,
};
