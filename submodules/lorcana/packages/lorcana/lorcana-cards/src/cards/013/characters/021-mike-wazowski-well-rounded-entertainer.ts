import type { CharacterCard } from "@tcg/lorcana-types";
import { mikeWazowskiWellroundedEntertainerI18n } from "./021-mike-wazowski-well-rounded-entertainer.i18n";

export const mikeWazowskiWellroundedEntertainer: CharacterCard = {
  id: "k4t",
  canonicalId: "ci_k4t",
  slug: "lorcana-ci_k4t",
  printings: [
    {
      id: "set13-021",
      artId: "set13-021",
      setCode: "set13",
      collectorNumber: "21",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-021"],
  cardType: "character",
  name: "Mike Wazowski",
  version: "Well-Rounded Entertainer",
  inkType: ["amber"],
  franchise: "Monsters, Inc.",
  set: "013",
  cardNumber: 21,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_cd584ce92868463191e0e226b3a8c371",
  },
  text: [
    {
      title: "MAKE 'EM LAUGH",
      description:
        "When you play this character, you may pay 2 {I} to give chosen character +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Monster"],
  abilities: [
    {
      type: "triggered",
      id: "k4t-1",
      name: "MAKE 'EM LAUGH",
      text: "MAKE 'EM LAUGH When you play this character, you may pay 2 {I} to give chosen character +1 {L} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "pay-cost",
          cost: {
            ink: 2,
          },
          effect: {
            type: "modify-stat",
            stat: "lore",
            modifier: 1,
            duration: "this-turn",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        },
      },
    },
  ],
  i18n: mikeWazowskiWellroundedEntertainerI18n,
};
