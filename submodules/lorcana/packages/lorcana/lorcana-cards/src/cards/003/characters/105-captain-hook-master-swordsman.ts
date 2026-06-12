import type { CharacterCard } from "@tcg/lorcana-types";
import { captainHookMasterSwordsmanI18n } from "./105-captain-hook-master-swordsman.i18n";

export const captainHookMasterSwordsman: CharacterCard = {
  id: "ICh",
  canonicalId: "ci_6Vd",
  reprints: ["set3-105"],
  cardType: "character",
  name: "Captain Hook",
  version: "Master Swordsman",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "003",
  cardNumber: 105,
  rarity: "rare",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_266d7d17b42a44be9472057e4e6dd1b1",
    tcgPlayer: 539166,
  },
  text: [
    {
      title: "NEMESIS",
      description:
        "During your turn, whenever this character banishes another character in a challenge, ready this character. He can't quest for the rest of this turn.",
    },
    {
      title: "MAN-TO-MAN",
      description: "Characters named Peter Pan lose Evasive and can't gain Evasive.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Pirate", "Captain"],
  abilities: [
    {
      effect: {
        steps: [
          {
            target: {
              selector: "self",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "ready",
          },
          {
            duration: "this-turn",
            restriction: "cant-quest",
            target: "SELF",
            type: "restriction",
          },
        ],
        type: "sequence",
      },
      id: "gip-1",
      name: "NEMESIS",
      text: "NEMESIS During your turn, whenever this character banishes another character in a challenge, ready this character. He can't quest for the rest of this turn.",
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
    {
      name: "MAN-TO-MAN",
      effect: {
        keyword: "Evasive",
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-name",
              name: "Peter Pan",
            },
          ],
        },
        type: "lose-keyword",
      },
      id: "gip-2",
      text: "MAN-TO-MAN Characters named Peter Pan lose Evasive and can't gain Evasive.",
      type: "static",
    },
  ],
  i18n: captainHookMasterSwordsmanI18n,
};
