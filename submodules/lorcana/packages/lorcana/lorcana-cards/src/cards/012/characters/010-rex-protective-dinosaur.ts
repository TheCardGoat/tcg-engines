import type { CharacterCard } from "@tcg/lorcana-types";
import { rexProtectiveDinosaurI18n } from "./010-rex-protective-dinosaur.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const rexProtectiveDinosaur: CharacterCard = {
  id: "G6y",
  canonicalId: "ci_G6y",
  reprints: ["set12-010"],
  cardType: "character",
  name: "Rex",
  version: "Protective Dinosaur",
  inkType: ["amber"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 10,
  rarity: "rare",
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_39de8b639e424da9b739e523f4a661d2",
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "RUN AWAY!",
      description: "During an opponent's turn, when this character is banished, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Dinosaur", "Toy"],
  abilities: [
    bodyguard,
    {
      id: "G6y-2",
      name: "RUN AWAY!",
      type: "triggered",
      text: "RUN AWAY! During an opponent's turn, when this character is banished, gain 1 lore.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
        restrictions: [
          {
            type: "during-turn",
            whose: "opponent",
          },
        ],
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: rexProtectiveDinosaurI18n,
};
