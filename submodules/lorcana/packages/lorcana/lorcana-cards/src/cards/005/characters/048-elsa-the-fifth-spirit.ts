import type { CharacterCard } from "@tcg/lorcana-types";
import { elsaTheFifthSpiritI18n } from "./048-elsa-the-fifth-spirit.i18n";

import { rush } from "../../../helpers/abilities/rush";
import { evasive } from "../../../helpers/abilities/evasive";

export const elsaTheFifthSpirit: CharacterCard = {
  id: "3zi",
  canonicalId: "ci_BaR",
  slug: "lorcana-ci_BaR",
  printings: [
    {
      id: "set5-048",
      artId: "set5-048",
      setCode: "set5",
      collectorNumber: "48",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set5-048"],
  cardType: "character",
  name: "Elsa",
  version: "The Fifth Spirit",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "005",
  cardNumber: 48,
  rarity: "common",
  cost: 5,
  strength: 2,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b16f35fcfe884bc4b442745f49c0b811",
    tcgPlayer: "650189",
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "Evasive",
    },
    {
      title: "CRYSTALLIZE",
      description: "When you play this character, exert chosen opposing character.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Queen", "Sorcerer"],
  abilities: [
    rush,
    evasive,
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "opponent",
          selector: "chosen",
          zones: ["play"],
        },
        type: "exert",
      },
      id: "dwf-3",
      name: "CRYSTALLIZE",
      text: "CRYSTALLIZE When you play this character, exert chosen opposing character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: elsaTheFifthSpiritI18n,
};
