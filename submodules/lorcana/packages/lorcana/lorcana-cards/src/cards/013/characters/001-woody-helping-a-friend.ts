import type { CharacterCard } from "@tcg/lorcana-types";
import { woodyHelpingAFriendI18n } from "./001-woody-helping-a-friend.i18n";

export const woodyHelpingAFriend: CharacterCard = {
  id: "oR5",
  canonicalId: "ci_oR5",
  slug: "lorcana-ci_oR5",
  printings: [
    {
      id: "set13-001",
      artId: "set13-001",
      setCode: "set13",
      collectorNumber: "1",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-001"],
  cardType: "character",
  name: "Woody",
  version: "Helping a Friend",
  inkType: ["amber"],
  franchise: "Toy Story",
  set: "013",
  cardNumber: 1,
  rarity: "rare",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_1792f6aa4efe42ce93bd680da01f7016",
  },
  text: [
    {
      title: "HANG ON!",
      description:
        "When you play this character, choose one of the following. If you have another Toy character in play, choose both instead:",
    },
    {
      title:
        "• You may return a character card with cost 2 or less from your discard to your hand.",
    },
    {
      title: "• You may play a character with cost 2 or less for free.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Toy"],
  abilities: [
    {
      type: "triggered",
      name: "HANG ON!",
      text: "HANG ON! When you play this character, choose one of the following. If you have another Toy character in play, choose both instead.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "has-character-count",
          controller: "you",
          comparison: "greater-or-equal",
          count: 2,
          classification: "Toy",
        },
        then: {
          type: "sequence",
          steps: [
            {
              type: "optional",
              chooser: "CONTROLLER",
              effect: {
                type: "return-from-discard",
                target: "CONTROLLER",
                count: 1,
                cardType: "character",
                costRestriction: {
                  comparison: "less-or-equal",
                  value: 2,
                },
              },
            },
            {
              type: "optional",
              chooser: "CONTROLLER",
              effect: {
                type: "play-card",
                from: "hand",
                cardType: "character",
                cost: "free",
                costRestriction: {
                  comparison: "less-or-equal",
                  value: 2,
                },
              },
            },
          ],
        },
        else: {
          type: "choice",
          chooser: "CONTROLLER",
          options: [
            {
              type: "optional",
              chooser: "CONTROLLER",
              effect: {
                type: "return-from-discard",
                target: "CONTROLLER",
                count: 1,
                cardType: "character",
                costRestriction: {
                  comparison: "less-or-equal",
                  value: 2,
                },
              },
            },
            {
              type: "optional",
              chooser: "CONTROLLER",
              effect: {
                type: "play-card",
                from: "hand",
                cardType: "character",
                cost: "free",
                costRestriction: {
                  comparison: "less-or-equal",
                  value: 2,
                },
              },
            },
          ],
        },
      },
    },
  ],
  i18n: woodyHelpingAFriendI18n,
};
