import type { CharacterCard } from "@tcg/lorcana-types";
import { captainHookThePirateKingI18n } from "./109-captain-hook-the-pirate-king.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const captainHookThePirateKing: CharacterCard = {
  id: "3AG",
  canonicalId: "ci_dkw",
  reprints: ["set8-109"],
  cardType: "character",
  name: "Captain Hook",
  version: "The Pirate King",
  inkType: ["emerald", "steel"],
  franchise: "Peter Pan",
  set: "008",
  cardNumber: 109,
  rarity: "rare",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_0a53330fb9424adcab9e92d04aa428a0",
    tcgPlayer: 632251,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "GIVE 'EM ALL YOU GOT!",
      description:
        "Once during your turn, whenever an opposing character takes damage, your Pirate characters get +2 {S} and gain Resist +2 this turn.",
    },
  ],
  classifications: ["Floodborn", "Villain", "King", "Pirate", "Captain"],
  abilities: [
    shift(3),
    {
      effect: {
        steps: [
          {
            modifier: 2,
            stat: "strength",
            target: "YOUR_PIRATE_CHARACTERS",
            duration: "this-turn",
            type: "modify-stat",
          },
          {
            duration: "this-turn",
            keyword: "Resist",
            target: "YOUR_PIRATE_CHARACTERS",
            type: "gain-keyword",
            value: 2,
          },
        ],
        type: "sequence",
      },
      id: "1na-2",
      name: "GIVE ‘EM ALL YOU GOT!",
      text: "GIVE ‘EM ALL YOU GOT! Once during your turn, whenever an opposing character takes damage, your Pirate characters get +2 {S} and gain Resist +2 this turn.",
      trigger: {
        event: "damage",
        on: "OPPONENT_CHARACTERS",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "once-per-turn",
          },
        ],
      },
      type: "triggered",
    },
  ],
  i18n: captainHookThePirateKingI18n,
};
