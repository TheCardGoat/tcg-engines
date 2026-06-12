import type { CharacterCard } from "@tcg/lorcana-types";
import { isabelaMadrigalGoldenChildI18n } from "./045-isabela-madrigal-golden-child.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const isabelaMadrigalGoldenChild: CharacterCard = {
  id: "Kq0",
  canonicalId: "ci_Kq0",
  reprints: ["set4-045"],
  cardType: "character",
  name: "Isabela Madrigal",
  version: "Golden Child",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "004",
  cardNumber: 45,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_21cddbd22cb445fbb3b810abe4ecbaf6",
    tcgPlayer: 548204,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "LADIES FIRST",
      description:
        "During your turn, if no other character has quested this turn, this character gets +3 {L}.",
    },
    {
      title: "LEAVE IT TO ME",
      description:
        "Whenever this character quests, your other characters can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
  abilities: [
    evasive,
    {
      effect: {
        condition: {
          type: "turn-metric",
          metric: "quested-characters",
          comparison: {
            operator: "eq",
            value: 0,
          },
          playerScope: "you",
          excludeSource: true,
        },
        then: {
          modifier: 3,
          stat: "lore",
          target: "SELF",
          type: "modify-stat",
        },
        type: "conditional",
      },
      id: "qop-2",
      name: "LADIES FIRST",
      text: "LADIES FIRST During your turn, if no other character has quested this turn, this character gets +3 {L}.",
      type: "static",
    },
    {
      effect: {
        duration: "this-turn",
        restriction: "cant-quest",
        target: "SELF",
        type: "restriction",
      },
      id: "qop-3",
      name: "LEAVE IT TO ME",
      text: "LEAVE IT TO ME Whenever this character quests, your other characters can't quest for the rest of this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: isabelaMadrigalGoldenChildI18n,
};
