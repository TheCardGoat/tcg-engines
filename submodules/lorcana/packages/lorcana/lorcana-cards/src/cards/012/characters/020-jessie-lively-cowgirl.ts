import type { CharacterCard } from "@tcg/lorcana-types";
import { jessieLivelyCowgirlI18n } from "./020-jessie-lively-cowgirl.i18n";

export const jessieLivelyCowgirl: CharacterCard = {
  id: "K5K",
  canonicalId: "ci_K5K",
  reprints: ["set12-020"],
  cardType: "character",
  name: "Jessie",
  version: "Lively Cowgirl",
  inkType: ["amber"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 20,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c7f3b3cbe19c44f7943c510392ea88db",
  },
  text: [
    {
      title: "PART OF",
      description:
        "A FAMILY Whenever this character quests, if you have 2 or more other Toy characters in play, you may draw a card.",
    },
    {
      title: "YODEL-AY-HEE-HOO!",
      description:
        "Whenever you pay 2 {I} or less to play a card, chosen opposing character gets -1 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Toy"],
  abilities: [
    {
      id: "4l2-1",
      name: "PART OF A FAMILY",
      type: "triggered",
      text: "PART OF A FAMILY Whenever this character quests, if you have 2 or more other Toy characters in play, you may draw a card.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      condition: {
        type: "has-character-count",
        controller: "you",
        comparison: "greater-or-equal",
        count: 2,
        classification: "Toy",
        excludeSelf: true,
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "draw",
          amount: 1,
        },
      },
    },
    {
      id: "4l2-2",
      name: "YODEL-AY-HEE-HOO!",
      type: "triggered",
      text: "YODEL-AY-HEE-HOO! Whenever you pay 2 {I} or less to play a card, chosen opposing character gets -1 {S} until the start of your next turn.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          filters: [
            {
              type: "cost-comparison",
              comparison: "less-or-equal",
              value: 2,
              costSource: "paid",
            },
          ],
        },
        timing: "whenever",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "CHOSEN_OPPOSING_CHARACTER",
        duration: "until-start-of-next-turn",
      },
    },
  ],
  i18n: jessieLivelyCowgirlI18n,
};
