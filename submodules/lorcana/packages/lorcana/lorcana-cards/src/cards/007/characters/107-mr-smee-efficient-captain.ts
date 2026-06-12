import type { CharacterCard } from "@tcg/lorcana-types";
import { mrSmeeEfficientCaptainI18n } from "./107-mr-smee-efficient-captain.i18n";

export const mrSmeeEfficientCaptain: CharacterCard = {
  id: "Y7a",
  canonicalId: "ci_Y7a",
  reprints: ["set7-107"],
  cardType: "character",
  name: "Mr. Smee",
  version: "Efficient Captain",
  inkType: ["emerald", "steel"],
  franchise: "Peter Pan",
  set: "007",
  cardNumber: 107,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_0cea7c1e74014adeb7fc3a59ddce500f",
    tcgPlayer: 618140,
  },
  text: [
    {
      title: "PIPE UP THE CREW",
      description:
        "Whenever you play an action that isn't a song, you may ready chosen Pirate character.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Pirate", "Captain"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
            filter: [{ type: "has-classification", classification: "Pirate" }],
          },
          type: "ready",
        },
        type: "optional",
      },
      id: "1co-1",
      name: "PIPE UP THE CREW",
      text: "PIPE UP THE CREW Whenever you play an action that isn't a song, you may ready chosen Pirate character.",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
          excludeSong: true,
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: mrSmeeEfficientCaptainI18n,
};
