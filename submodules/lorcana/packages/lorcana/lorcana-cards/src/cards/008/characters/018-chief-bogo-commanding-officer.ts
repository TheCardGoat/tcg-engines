import type { CharacterCard } from "@tcg/lorcana-types";
import { chiefBogoCommandingOfficerI18n } from "./018-chief-bogo-commanding-officer.i18n";

export const chiefBogoCommandingOfficer: CharacterCard = {
  id: "2pp",
  canonicalId: "ci_2pp",
  reprints: ["set8-018"],
  cardType: "character",
  name: "Chief Bogo",
  version: "Commanding Officer",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "008",
  cardNumber: 18,
  rarity: "legendary",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_cafa13413b754a96b2ac5df738bd0b89",
    tcgPlayer: 631362,
  },
  text: [
    {
      title: "SENDING BACKUP",
      description:
        "During an opponent's turn, whenever one of your characters with Bodyguard is banished, you may reveal the top card of your deck. If it's a character card with cost 5 or less, you may play that character for free. Otherwise, put it on the top of your deck.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "scry",
          amount: 1,
          target: "CONTROLLER",
          revealAll: true,
          destinations: [
            {
              zone: "play",
              min: 0,
              max: 1,
              cost: "free",
              filters: [
                { type: "card-type", cardType: "character" },
                { type: "cost", comparison: "lte", value: 5 },
              ],
            },
            {
              zone: "deck-top",
              remainder: true,
            },
          ],
        },
      },
      id: "17e-1",
      name: "SENDING BACKUP",
      text: "SENDING BACKUP During an opponent's turn, whenever one of your characters with Bodyguard is banished, you may reveal the top card of your deck. If it's a character card with cost 5 or less, you may play that character for free. Otherwise, put it on the top of your deck.",
      trigger: {
        event: "banish",
        on: {
          controller: "you",
          cardType: "character",
          hasKeyword: "Bodyguard",
        },
        timing: "whenever",
      },
      condition: {
        type: "during-turn",
        whose: "opponent",
      },
      type: "triggered",
    },
  ],
  i18n: chiefBogoCommandingOfficerI18n,
};
