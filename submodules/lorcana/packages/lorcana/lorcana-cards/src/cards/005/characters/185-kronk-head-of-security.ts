import type { CharacterCard } from "@tcg/lorcana-types";
import { kronkHeadOfSecurityI18n } from "./185-kronk-head-of-security.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const kronkHeadOfSecurity: CharacterCard = {
  id: "qAr",
  canonicalId: "ci_qAr",
  reprints: ["set5-185"],
  cardType: "character",
  name: "Kronk",
  version: "Head of Security",
  inkType: ["steel"],
  franchise: "Emperors New Groove",
  set: "005",
  cardNumber: 185,
  rarity: "common",
  cost: 7,
  strength: 6,
  willpower: 6,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_a1439f505f594dcfb80bb8aa6d495e20",
    tcgPlayer: 555273,
  },
  text: [
    {
      title: "Shift 5",
    },
    {
      title: "ARE YOU ON THE LIST?",
      description:
        "During your turn, whenever this character banishes another character in a challenge, you may play a character with cost 5 or less for free.",
    },
  ],
  classifications: ["Floodborn", "Ally", "Captain"],
  abilities: [
    shift(5),
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          cardType: "character",
          cost: "free",
          costRestriction: {
            comparison: "less-or-equal",
            value: 5,
          },
          from: "hand",
          type: "play-card",
        },
        type: "optional",
      },
      id: "156-2",
      name: "ARE YOU ON THE LIST?",
      text: "ARE YOU ON THE LIST? During your turn, whenever this character banishes another character in a challenge, you may play a character with cost 5 or less for free.",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      type: "triggered",
    },
  ],
  i18n: kronkHeadOfSecurityI18n,
};
