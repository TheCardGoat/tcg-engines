import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shadow-of-blasmophet.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const shadowOfBlasmophet = definePitchFamily(fabPitchFamilies["shadow-of-blasmophet"], {
  keywords: [bloodDebt],
  abilities: () => ({
    drawDiscardRandomWithNumber6MorePowerDiscardedWaySearchDeckFor: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            count: 1,
            player: "controller",
          },
          {
            type: "discard",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              count: 1,
              random: true,
            },
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "compare-amount",
              amount: {
                type: "count",
                what: "discarded-this-way",
                filter: { power: { op: "gte", value: 6 } },
              },
              comparison: { op: "gte", value: 1 },
            },
            then: {
              type: "search",
              zones: ["deck"],
              filter: {
                hasKeyword: "blood-debt",
              },
              mayFail: true,
              to: {
                zone: "banished",
              },
            },
          },
          {
            type: "shuffle",
            zone: "deck",
          },
        ],
      },
    },
  }),
});

export const { red: shadowOfBlasmophetRed } = shadowOfBlasmophet.cards;
