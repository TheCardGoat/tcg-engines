import type { CharacterCard } from "@tcg/lorcana-types";
import { yzmaScaryBeyondAllReasonI18n } from "./060-yzma-scary-beyond-all-reason.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const yzmaScaryBeyondAllReason: CharacterCard = {
  id: "mCu",
  canonicalId: "ci_mCu",
  reprints: ["set2-060"],
  cardType: "character",
  name: "Yzma",
  version: "Scary Beyond All Reason",
  inkType: ["amethyst"],
  franchise: "Emperors New Groove",
  set: "002",
  cardNumber: 60,
  rarity: "common",
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_b687a800e99b4465a744086c0eb9c93f",
    tcgPlayer: 527739,
  },
  text: [
    {
      title: "Shift 4",
    },
    {
      title: "CRUEL IRONY",
      description:
        "When you play this character, shuffle another chosen character card into their player's deck. That player draws 2 cards.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Sorcerer"],
  abilities: [
    shift(4),
    {
      id: "1c0-2",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "shuffle-into-deck",
            intoDeck: "owner",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
              excludeSelf: true,
            },
          },
          {
            amount: 2,
            target: "CARD_OWNER",
            type: "draw",
          },
        ],
      },
      name: "CRUEL IRONY",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "CRUEL IRONY When you play this character, shuffle another chosen character card into their player's deck. That player draws 2 cards.",
    },
  ],
  i18n: yzmaScaryBeyondAllReasonI18n,
};
