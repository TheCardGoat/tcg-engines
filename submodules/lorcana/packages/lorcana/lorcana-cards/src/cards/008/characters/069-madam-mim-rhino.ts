import type { CharacterCard } from "@tcg/lorcana-types";
import { madamMimRhinoI18n } from "./069-madam-mim-rhino.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const madamMimRhino: CharacterCard = {
  id: "buu",
  canonicalId: "ci_buu",
  reprints: ["set8-069"],
  cardType: "character",
  name: "Madam Mim",
  version: "Rhino",
  inkType: ["amethyst", "ruby"],
  franchise: "Sword in the Stone",
  set: "008",
  cardNumber: 69,
  rarity: "uncommon",
  cost: 6,
  strength: 6,
  willpower: 5,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_5af1ae1121a447af9a275e5b2c6cf71f",
    tcgPlayer: 631396,
  },
  text: [
    {
      title: "Shift 2",
    },
    {
      title: "MAKE WAY, COMING THROUGH!",
      description:
        "When you play this character, banish her or return another chosen character of yours to your hand.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Sorcerer"],
  abilities: [
    shift(2),
    {
      effect: {
        type: "or",
        optionLabels: ["banish her", "return another chosen character of yours to your hand"],
        options: [
          {
            target: "SELF",
            type: "banish",
          },
          {
            target: {
              excludeSelf: true,
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "return-to-hand",
          },
        ],
      },
      id: "1jr-2",
      name: "MAKE WAY, COMING THROUGH!",
      text: "MAKE WAY, COMING THROUGH! When you play this character, banish her or return another chosen character of yours to your hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: madamMimRhinoI18n,
};
