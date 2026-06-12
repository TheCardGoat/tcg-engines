import type { CharacterCard } from "@tcg/lorcana-types";
import { theQueenCommandingPresenceI18n } from "./026-the-queen-commanding-presence.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const theQueenCommandingPresence: CharacterCard = {
  id: "A9v",
  canonicalId: "ci_A9v",
  reprints: ["set2-026"],
  cardType: "character",
  name: "The Queen",
  version: "Commanding Presence",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  cardNumber: 26,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_fe74bbe0dddc45fc8ecb07ba325f1e69",
    tcgPlayer: 516386,
  },
  text: [
    {
      title: "Shift 2",
    },
    {
      title: "WHO IS THE FAIREST?",
      description:
        "Whenever this character quests, chosen opposing character gets -4 {S} this turn and chosen character gets +4 {S} this turn.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Queen"],
  abilities: [
    shift(2),
    {
      id: "A9v-2",
      name: "WHO IS THE FAIREST?",
      text: "WHO IS THE FAIREST? Whenever this character quests, chosen opposing character gets -4 {S} this turn and chosen character gets +4 {S} this turn.",
      effect: {
        steps: [
          {
            duration: "this-turn",
            modifier: -4,
            stat: "strength",
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "modify-stat",
          },
          {
            duration: "this-turn",
            modifier: 4,
            stat: "strength",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "modify-stat",
          },
        ],
        type: "sequence",
      },
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: theQueenCommandingPresenceI18n,
};
