import type { CharacterCard } from "@tcg/lorcana-types";
import { theMadrigalFamilyEveryGenerationI18n } from "./030-the-madrigal-family-every-generation.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const theMadrigalFamilyEveryGeneration: CharacterCard = {
  id: "wAj",
  canonicalId: "ci_wAj",
  slug: "lorcana-ci_wAj",
  printings: [
    {
      id: "set13-030",
      artId: "set13-030",
      setCode: "set13",
      collectorNumber: "30",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-030"],
  cardType: "character",
  name: "The Madrigal Family",
  version: "Every Generation",
  inkType: ["amber", "sapphire"],
  franchise: "Encanto",
  set: "013",
  cardNumber: 30,
  rarity: "rare",
  cost: 5,
  strength: 2,
  willpower: 8,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_f82d2fbf598249eb924b2cdbdc915f62",
  },
  text: [
    {
      title: "Madrigal Shift 3 {I}",
      description: "(You may pay 3 {I} to play this on top of one of your Madrigal characters.)",
    },
    {
      title: "FAMILY BLESSINGS",
      description:
        "Once during your turn, whenever you remove 1 or more damage from one of your characters, put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Team", "Madrigal"],
  abilities: [
    shift(3),
    {
      id: "wAj-2",
      name: "FAMILY BLESSINGS",
      type: "triggered",
      trigger: {
        event: "remove-damage",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
        sourceFilter: {
          sourceController: "you",
        },
        restrictions: [
          {
            type: "once-per-turn",
          },
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      effect: {
        type: "put-into-inkwell",
        source: "top-of-deck",
        target: "CONTROLLER",
        exerted: true,
        facedown: true,
      },
      text: "FAMILY BLESSINGS Once during your turn, whenever you remove 1 or more damage from one of your characters, put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  i18n: theMadrigalFamilyEveryGenerationI18n,
};
