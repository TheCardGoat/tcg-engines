import type { CharacterCard } from "@tcg/lorcana-types";
import { buckySquirrelSqueakTutorI18n } from "./073-bucky-squirrel-squeak-tutor.i18n";

export const buckySquirrelSqueakTutor: CharacterCard = {
  id: "IGz",
  canonicalId: "ci_IGz",
  reprints: ["set2-073"],
  cardType: "character",
  name: "Bucky",
  version: "Squirrel Squeak Tutor",
  inkType: ["emerald"],
  franchise: "Emperors New Groove",
  set: "002",
  cardNumber: 73,
  rarity: "uncommon",
  cost: 3,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b577553c749f4093b477e1ade7e52a2b",
    tcgPlayer: 519506,
  },
  text: [
    {
      title: "SQUEAK",
      description:
        "Whenever you play a Floodborn character, if you used Shift to play them, each opponent chooses and discards a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        condition: {
          expression: "you used Shift to play them",
          type: "if",
        },
        then: {
          amount: 1,
          chosen: true,
          target: "EACH_OPPONENT",
          type: "discard",
        },
        type: "conditional",
      },
      id: "tzh-1",
      name: "SQUEAK",
      text: "SQUEAK Whenever you play a Floodborn character, if you used Shift to play them, each opponent chooses and discards a card.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          classification: "Floodborn",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: buckySquirrelSqueakTutorI18n,
};
