import type { CharacterCard } from "@tcg/lorcana-types";
import { auntCassBiggestFanI18n } from "./138-aunt-cass-biggest-fan.i18n";

export const auntCassBiggestFan: CharacterCard = {
  id: "zKK",
  canonicalId: "ci_zKK",
  reprints: ["set6-138"],
  cardType: "character",
  name: "Aunt Cass",
  version: "Biggest Fan",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  cardNumber: 138,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a881e85e281f4e3abe2fbf0437a5c159",
    tcgPlayer: 591989,
  },
  text: [
    {
      title: "HAPPY TO HELP",
      description:
        "Whenever this character quests, chosen Inventor character gets +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Mentor"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: {
          selector: "chosen",
          cardTypes: ["character"],
          owner: "you",
          zones: ["play"],
          count: 1,
          filter: [
            {
              type: "has-classification",
              classification: "Inventor",
            },
          ],
        },
        type: "modify-stat",
      },
      id: "1qq-1",
      name: "HAPPY TO HELP",
      text: "HAPPY TO HELP Whenever this character quests, chosen Inventor character gets +1 {L} this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: auntCassBiggestFanI18n,
};
