import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pound-of-flesh.generated.ts";

export const poundOfFlesh = definePitchFamily(fabPitchFamilies["pound-of-flesh"], {
  keywords: [goAgain],
  abilities: () => ({
    banishesHandWhoDidntBanish6MorePowerWayLoses1Life: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "for-each",
            target: {
              selector: "each-hero",
            },
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "banish",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "iteration-subject",
                    zones: ["hand"],
                    count: 1,
                  },
                },
                {
                  type: "conditional",
                  condition: {
                    type: "compare-amount",
                    amount: {
                      type: "count",
                      what: "banished-this-way",
                      player: "iteration-subject",
                      filter: { power: { op: "gte", value: 6 } },
                    },
                    comparison: { op: "lt", value: 1 },
                  },
                  then: {
                    type: "lose-life",
                    amount: 1,
                    target: {
                      selector: "iteration-subject",
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  }),
});

export const { blue: poundOfFleshBlue } = poundOfFlesh.cards;
