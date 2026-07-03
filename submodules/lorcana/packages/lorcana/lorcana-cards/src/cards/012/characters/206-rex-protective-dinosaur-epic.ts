import type { CharacterCard } from "@tcg/lorcana-types";
import { rexProtectiveDinosaurEpicI18n } from "./206-rex-protective-dinosaur-epic.i18n";

import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const rexProtectiveDinosaurEpic: CharacterCard = {
  id: "0O9",
  canonicalId: "ci_G6y",
  slug: "lorcana-ci_G6y",
  printings: [
    {
      id: "set12-206-epic",
      artId: "ci_G6y-epic",
      setCode: "set12",
      collectorNumber: "206",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set12-010"],
  cardType: "character",
  name: "Rex",
  version: "Protective Dinosaur",
  inkType: ["amber"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 206,
  rarity: "common",
  specialRarity: "epic",
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_70e7c418c5034714b2eb7889c89e3c86",
    tcgPlayer: "692204",
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
  i18n: rexProtectiveDinosaurEpicI18n,
};
