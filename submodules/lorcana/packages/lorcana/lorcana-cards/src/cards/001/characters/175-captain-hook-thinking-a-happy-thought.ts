import type { CharacterCard } from "@tcg/lorcana-types";
import { captainHookThinkingAHappyThoughtI18n } from "./175-captain-hook-thinking-a-happy-thought.i18n";
import { challenger } from "../../../helpers/abilities/challenger";
import { shift } from "../../../helpers/abilities/shift";

export const captainHookThinkingAHappyThought: CharacterCard = {
  id: "3Ri",
  canonicalId: "ci_3Ri",
  reprints: ["set1-175"],
  cardType: "character",
  name: "Captain Hook",
  version: "Thinking a Happy Thought",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "001",
  cardNumber: 175,
  rarity: "rare",
  cost: 5,
  strength: 2,
  willpower: 5,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_217eb0feed8b46fea1b5dc6c0b2b9e12",
    tcgPlayer: 507505,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "Challenger +3",
    },
    {
      title: "STOLEN DUST",
      description: "Characters with cost 3 or less can't challenge this character.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Pirate", "Captain"],
  abilities: [
    shift(3),
    challenger(3),
    {
      effect: {
        restriction: "cant-be-challenged",
        target: "SELF",
        type: "restriction",
        challengerFilter: {
          type: "cost-comparison",
          operator: "lte",
          value: 3,
        },
      },
      id: "4hp-3",
      name: "STOLEN DUST",
      text: "STOLEN DUST Characters with cost 3 or less can't challenge this character.",
      type: "static",
    },
  ],
  i18n: captainHookThinkingAHappyThoughtI18n,
};
