import type { CharacterCard } from "@tcg/lorcana-types";
import { baymaxUpgradedRobotI18n } from "./175-baymax-upgraded-robot.i18n";
import { support } from "../../../helpers/abilities/support";

export const baymaxUpgradedRobot: CharacterCard = {
  id: "ibv",
  canonicalId: "ci_ibv",
  reprints: ["set7-175"],
  cardType: "character",
  name: "Baymax",
  version: "Upgraded Robot",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "007",
  cardNumber: 175,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_4b7cdb55b647410f85f60e74a4a4b619",
    tcgPlayer: 619507,
  },
  text: [
    {
      title: "Support",
    },
    {
      title: "ADVANCED SCANNER",
      description:
        "When you play this character, look at the top 4 cards of your deck. You may reveal a Floodborn character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Robot"],
  abilities: [
    support,
    {
      effect: {
        type: "scry",
        amount: 4,
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
                classification: "Floodborn",
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
      id: "10n-2",
      name: "ADVANCED SCANNER",
      text: "ADVANCED SCANNER When you play this character, look at the top 4 cards of your deck. You may reveal a Floodborn character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: baymaxUpgradedRobotI18n,
};
