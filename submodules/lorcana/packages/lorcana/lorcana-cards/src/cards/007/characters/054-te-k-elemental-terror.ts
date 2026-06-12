import type { CharacterCard } from "@tcg/lorcana-types";
import { teKElementalTerrorI18n } from "./054-te-k-elemental-terror.i18n";

export const teKElementalTerror: CharacterCard = {
  id: "8UQ",
  canonicalId: "ci_8UQ",
  reprints: ["set7-054"],
  cardType: "character",
  name: "Te Kā",
  version: "Elemental Terror",
  inkType: ["amethyst", "ruby"],
  franchise: "Moana",
  set: "007",
  cardNumber: 54,
  rarity: "common",
  cost: 10,
  strength: 12,
  willpower: 12,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_97ba744205d341099f6b8a54f12eee71",
    tcgPlayer: 618257,
  },
  text: [
    {
      title: "Shift 7",
    },
    {
      title: "ANCIENT RAGE",
      description: "During your turn, whenever an opposing character is exerted, banish them.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Deity"],
  abilities: [
    {
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 7,
      },
      shiftTarget: "Te Kā",
    },
    {
      id: "8UQ-ancient-rage",
      name: "ANCIENT RAGE",
      text: "ANCIENT RAGE During your turn, whenever an opposing character is exerted, banish them.",
      type: "triggered",
      trigger: {
        event: "exert",
        on: "OPPONENT_CHARACTERS",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      effect: {
        type: "banish",
        target: {
          ref: "trigger-subject",
        },
      },
    },
  ],
  i18n: teKElementalTerrorI18n,
};
