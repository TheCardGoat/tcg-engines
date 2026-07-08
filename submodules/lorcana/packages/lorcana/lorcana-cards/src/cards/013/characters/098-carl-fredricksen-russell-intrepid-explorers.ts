import type { CharacterCard } from "@tcg/lorcana-types";
import { carlFredricksenRussellIntrepidExplorersI18n } from "./098-carl-fredricksen-russell-intrepid-explorers.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const carlFredricksenRussellIntrepidExplorers: CharacterCard = {
  id: "QUJ",
  canonicalId: "ci_QUJ",
  slug: "lorcana-ci_QUJ",
  printings: [
    {
      id: "set13-098",
      artId: "set13-098",
      setCode: "set13",
      collectorNumber: "98",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-098"],
  cardType: "character",
  name: "Carl Fredricksen & Russell",
  version: "Intrepid Explorers",
  inkType: ["emerald", "ruby"],
  franchise: "Up",
  set: "013",
  cardNumber: 98,
  rarity: "rare",
  cost: 6,
  strength: 6,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_a11ca900e22b4319a66e50fe7cb8c504",
  },
  text: [
    {
      title: "Shift 4 {I}",
    },
    {
      title: "OUTDOOR SKILLS",
      description:
        "While this character is at a location, all characters at that location get +1 {L} and gain Evasive.",
    },
  ],
  classifications: ["Storyborn", "Team", "Hero"],
  abilities: [
    shift(4),
    {
      type: "static",
      name: "OUTDOOR SKILLS",
      text: "OUTDOOR SKILLS While this character is at a location, all characters at that location get +1 lore.",
      condition: {
        type: "at-location",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "same-location-as-source",
            },
          ],
        },
      },
    },
    {
      type: "static",
      name: "OUTDOOR SKILLS",
      text: "OUTDOOR SKILLS While this character is at a location, all characters at that location gain Evasive.",
      condition: {
        type: "at-location",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "same-location-as-source",
            },
          ],
        },
      },
    },
  ],
  i18n: carlFredricksenRussellIntrepidExplorersI18n,
};
