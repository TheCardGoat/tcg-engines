import type { CharacterCard } from "@tcg/lorcana-types";
import { woodyLeaderOfTheToysD23I18n } from "./d23-009-woody-leader-of-the-toys.i18n";

export const woodyLeaderOfTheToysD23: CharacterCard = {
  id: "Cl1",
  canonicalId: "ci_sCi",
  slug: "lorcana-ci_sCi",
  printings: [
    {
      id: "set12-d23-009",
      artId: "set12-d23-009",
      setCode: "set12",
      collectorNumber: "9",
      rarity: "special",
      imageUrl: "",
    },
  ],
  reprints: ["set12-d23-009", "set12-021"],
  cardType: "character",
  name: "Woody",
  version: "Leader of the Toys",
  inkType: ["amber"],
  franchise: "D23",
  set: "012",
  cardNumber: 9,
  rarity: "special",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_752b3ac3ef5a4ce6833d0dbe46f1f671",
    tcgPlayer: "690205",
  },
  text: [
    {
      title: "Let's Go Home",
      description:
        "When you play this character, look at the top 4 cards of your deck. You may reveal a Toy character card or a location card named Andy's Room and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Toy"],
  abilities: [
    {
      id: "Y0U-1",
      name: "LET'S GO HOME",
      type: "triggered",
      text: "LET'S GO HOME When you play this character, look at the top 4 cards of your deck. You may reveal a Toy character card or a location card named Andy's Room and put it into your hand. Put the rest on the bottom of your deck in any order.",
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
                      classification: "Toy",
                    },
                  ],
                },
                {
                  type: "and",
                  filters: [
                    {
                      type: "card-type",
                      cardType: "location",
                    },
                    {
                      type: "has-name",
                      name: "Andy's Room",
                    },
                  ],
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
  i18n: woodyLeaderOfTheToysD23I18n,
};
