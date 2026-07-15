import type { CharacterCard } from "@tcg/lorcana-types";
import { jasmineSteadyStrategistEnchantedI18n } from "./221-jasmine-steady-strategist-enchanted.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const jasmineSteadyStrategistEnchanted: CharacterCard = {
  id: "8JD",
  canonicalId: "ci_UgP",
  slug: "lorcana-ci_UgP",
  printings: [
    {
      id: "set8-221-enchanted",
      artId: "ci_UgP-enchanted",
      setCode: "set8",
      collectorNumber: "221",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set8-171"],
  cardType: "character",
  name: "Jasmine",
  version: "Steady Strategist",
  inkType: ["sapphire", "steel"],
  franchise: "Aladdin",
  set: "008",
  cardNumber: 221,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a8b66e0b4abe48f58f9c47dc25593197",
    tcgPlayer: "633098",
  },
  text: [
    {
      title: "Shift 2",
    },
    {
      title: "ALWAYS PLANNING",
      description:
        "Whenever this character quests, look at the top 3 cards of your deck. You may reveal an Ally character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess"],
  abilities: [
    shift(2),
    {
      effect: {
        type: "scry",
        amount: 3,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
            reveal: true,
            filters: [
              {
                type: "card-type",
                cardType: "character",
              },
              {
                type: "classification",
                classification: "Ally",
              },
            ],
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
      id: "13i-2",
      name: "ALWAYS PLANNING",
      text: "ALWAYS PLANNING Whenever this character quests, look at the top 3 cards of your deck. You may reveal an Ally character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: jasmineSteadyStrategistEnchantedI18n,
};
