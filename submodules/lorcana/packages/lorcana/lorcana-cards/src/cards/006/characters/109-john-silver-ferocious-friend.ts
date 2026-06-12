import type { CharacterCard } from "@tcg/lorcana-types";
import { johnSilverFerociousFriendI18n } from "./109-john-silver-ferocious-friend.i18n";

export const johnSilverFerociousFriend: CharacterCard = {
  id: "J7B",
  canonicalId: "ci_J7B",
  reprints: ["set6-109"],
  cardType: "character",
  name: "John Silver",
  version: "Ferocious Friend",
  inkType: ["ruby"],
  franchise: "Treasure Planet",
  set: "006",
  cardNumber: 109,
  rarity: "uncommon",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_6c12ae52fc6c4244b1f638ff2102bf59",
    tcgPlayer: 591121,
  },
  text: [
    {
      title: "YOU HAVE TO CHART YOUR OWN COURSE",
      description:
        "Whenever this character quests, you may deal 1 damage to one of your other characters. If you do, ready that character. They cannot quest this turn.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Alien", "Pirate", "Captain"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          steps: [
            {
              type: "deal-damage",
              amount: 1,
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                excludeSelf: true,
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
            {
              condition: {
                type: "if-you-do",
              },
              then: {
                steps: [
                  {
                    type: "ready",
                    target: { ref: "previous-target" },
                  },
                  {
                    duration: "this-turn",
                    restriction: "cant-quest",
                    target: { ref: "previous-target" },
                    type: "restriction",
                  },
                ],
                type: "sequence",
              },
              type: "conditional",
            },
          ],
          type: "sequence",
        },
        type: "optional",
      },
      id: "sje-1",
      name: "YOU HAVE TO CHART YOUR OWN COURSE",
      text: "YOU HAVE TO CHART YOUR OWN COURSE Whenever this character quests, you may deal 1 damage to one of your other characters. If you do, ready that character. They cannot quest this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: johnSilverFerociousFriendI18n,
};
