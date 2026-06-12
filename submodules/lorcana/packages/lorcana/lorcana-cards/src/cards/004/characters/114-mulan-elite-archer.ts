import type { CharacterCard } from "@tcg/lorcana-types";
import { mulanEliteArcherI18n } from "./114-mulan-elite-archer.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const mulanEliteArcher: CharacterCard = {
  id: "4gd",
  canonicalId: "ci_9XN",
  reprints: ["set4-114", "set9-126"],
  cardType: "character",
  name: "Mulan",
  version: "Elite Archer",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "004",
  cardNumber: 114,
  rarity: "legendary",
  cost: 6,
  strength: 2,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_44fe3bead4bf40f79163468a4fd647e5",
    tcgPlayer: 650061,
  },
  text: [
    {
      title: "Shift 5",
    },
    {
      title: "STRAIGHT SHOOTER",
      description:
        "When you play this character, if you used Shift to play her, she gets +3 {S} this turn.",
    },
    {
      title: "TRIPLE SHOT",
      description:
        "During your turn, whenever this character deals damage to another character in a challenge, deal the same amount of damage to up to 2 other chosen characters.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess"],
  abilities: [
    shift(5),
    {
      id: "4gd-2",
      name: "STRAIGHT SHOOTER",
      text: "STRAIGHT SHOOTER When you play this character, if you used Shift to play her, she gets +3 {S} this turn.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "used-shift",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
        target: "SELF",
        duration: "this-turn",
      },
    },
    {
      id: "4gd-3",
      name: "TRIPLE SHOT",
      text: "TRIPLE SHOT During your turn, whenever this character deals damage to another character in a challenge, deal the same amount of damage to up to 2 other chosen characters.",
      type: "triggered",
      trigger: {
        event: "deal-damage",
        on: "SELF",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "in-challenge",
          },
          {
            type: "defender-is-character",
          },
        ],
      },
      effect: {
        type: "deal-damage",
        amount: {
          type: "trigger-amount",
        },
        target: {
          selector: "chosen",
          count: { upTo: 2 },
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          excludeSelf: true,
          excludeTriggerSubject: true,
        },
      },
    },
  ],
  i18n: mulanEliteArcherI18n,
};
