import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/mutiny-on-the-swiftwater.generated.ts";

const moreGoldThanYou = {
  type: "compare-amount" as const,
  amount: {
    type: "count" as const,
    what: "cards-in-zone" as const,
    zone: "permanent" as const,
    player: "opponent" as const,
    filter: { name: "Gold" },
  },
  comparison: {
    op: "gt" as const,
    value: {
      type: "count" as const,
      what: "cards-in-zone" as const,
      zone: "permanent" as const,
      player: "controller" as const,
      filter: { name: "Gold" },
    },
  },
};

const stealTheirGold = {
  type: "steal" as const,
  target: {
    selector: "object" as const,
    declared: "at-resolution" as const,
    player: "opponent" as const,
    zones: ["permanent" as const],
    filter: { name: "Gold" },
    count: 1,
  },
  controller: "controller" as const,
  duration: "this-turn" as const,
};

export const mutinyOnTheSwiftwater = definePitchFamily(
  fabPitchFamilies["mutiny-on-the-swiftwater"],
  {
    keywords: [goAgain],
    abilities: () => ({
      controlsMoreGoldThanStealGoldTokenGain1MoreGoldTokensWayNextAttackTurnGetsGoAgain: {
        kind: "resolution",
        effect: {
          type: "if-you-do",
          effect: {
            type: "conditional",
            condition: moreGoldThanYou,
            then: stealTheirGold,
          },
          then: {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: goAgain,
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  subtypes: ["Attack"],
                },
              },
            },
          },
        },
        label: {
          name: "steal",
        },
      },
    }),
  },
);

export const { blue: mutinyOnTheSwiftwaterBlue } = mutinyOnTheSwiftwater.cards;
