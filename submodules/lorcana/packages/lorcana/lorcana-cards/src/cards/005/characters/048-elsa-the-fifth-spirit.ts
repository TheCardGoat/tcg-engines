import type { CharacterCard } from "@tcg/lorcana-types";
import { elsaTheFifthSpiritI18n } from "./048-elsa-the-fifth-spirit.i18n";
import { rush } from "../../../helpers/abilities/rush";
import { evasive } from "../../../helpers/abilities/evasive";

export const elsaTheFifthSpirit: CharacterCard = {
  id: "PX4",
  canonicalId: "ci_PX4",
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
    lorcast: "crd_db64e740e8ef4c22b87c89fa48093cee",
    tcgPlayer: 555245,
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
