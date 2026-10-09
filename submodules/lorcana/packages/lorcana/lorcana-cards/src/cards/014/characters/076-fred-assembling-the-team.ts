import type { CharacterCard } from "@tcg/lorcana-types";
import { fredAssemblingTheTeamI18n } from "./076-fred-assembling-the-team.i18n";

export const fredAssemblingTheTeam: CharacterCard = {
  id: "FRw",
  canonicalId: "ci_FRw",
  slug: "lorcana-ci_FRw",
  printings: [
    {
      id: "set14-076",
      artId: "set14-076",
      setCode: "set14",
      collectorNumber: "76",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-076"],
  cardType: "character",
  name: "Fred",
  version: "Assembling the Team",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "014",
  cardNumber: 76,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Brain Trust",
      description:
        "When you play this character, look at the top 4 cards of your deck. You may reveal a Super character card or an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Super", "Hero"],
  abilities: [
    {
      id: "FRw-1",
      name: "Brain Trust",
      type: "triggered",
      text: "Brain Trust When you play this character, look at the top 4 cards of your deck. You may reveal a Super character card or an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "scry",
        amount: 4,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
            reveal: true,
            filter: {
              type: "or",
              filters: [
                {
                  type: "and",
                  filters: [
                    {
                      type: "card-type",
                      cardType: "character",
                    },
                    {
                      type: "has-classification",
                      classification: "Super",
                    },
                  ],
                },
                {
                  type: "card-type",
                  cardType: "item",
                },
              ],
            },
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
    },
  ],
  i18n: fredAssemblingTheTeamI18n,
};
