import type { CharacterCard } from "@tcg/lorcana-types";
import { johnSilverVengefulPirateI18n } from "./109-john-silver-vengeful-pirate.i18n";
import { resist } from "../../../helpers/abilities/resist";

export const johnSilverVengefulPirate: CharacterCard = {
  id: "haz",
  canonicalId: "ci_haz",
  reprints: ["set7-109"],
  cardType: "character",
  name: "John Silver",
  version: "Vengeful Pirate",
  inkType: ["emerald", "steel"],
  franchise: "Treasure Planet",
  set: "007",
  cardNumber: 109,
  rarity: "rare",
  cost: 8,
  strength: 6,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_b6a644c09d674fe6ace0502427a05c6e",
    tcgPlayer: 619466,
  },
  text: [
    {
      title: "DRAWN TO A FIGHT",
      description:
        "If an opposing character took damage this turn, you pay 2 {I} less to play this character.",
    },
    {
      title: "Resist +1",
    },
    {
      title: "I AIN'T GONE SOFT!",
      description:
        "Whenever you play an action that isn't a song, you may deal 1 damage to chosen character.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Alien", "Pirate", "Captain"],
  abilities: [
    {
      condition: {
        type: "turn-metric",
        metric: "damaged-characters-by-owner",
        comparison: {
          operator: "gte",
          value: 1,
        },
        ownerScope: "opponent",
      },
      effect: {
        amount: 2,
        target: "CONTROLLER",
        type: "cost-reduction",
      },
      id: "1p4-1",
      name: "DRAWN TO A FIGHT",
      text: "DRAWN TO A FIGHT If an opposing character took damage this turn, you pay 2 {I} less to play this character.",
      type: "static",
    },
    resist(1),
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "1p4-3",
      name: "I AIN'T GONE SOFT!",
      text: "I AIN'T GONE SOFT! Whenever you play an action that isn't a song, you may deal 1 damage to chosen character.",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
          excludeSong: true,
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: johnSilverVengefulPirateI18n,
};
