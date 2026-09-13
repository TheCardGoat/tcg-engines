import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/haboob.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const haboob = definePitchFamily(fabPitchFamilies["haboob"], {
  keywords: [goAgain],
  abilities: () => ({
    startTurnPutStormCounterThenDestroyUnlessDestroyAshStormCounter: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "add-counter",
              counter: {
                kind: "named",
                name: "storm",
              },
              count: 1,
              target: {
                selector: "self",
              },
            },
            {
              type: "unless",
              effect: {
                type: "destroy",
                target: {
                  selector: "self",
                },
              },
              escape: {
                type: "destroy",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["permanent"],
                  filter: {
                    typeBox: {
                      subtypes: ["Ash"],
                    },
                  },
                  count: {
                    type: "count",
                    what: "counters-on-source",
                  },
                },
              },
            },
          ],
        },
      },
    },
    attackActionGet1PowerAttackingDefending: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "subtract",
        amount: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          zones: ["combat-chain"],
          filter: attackActionFilter({ hasStatus: "attacking-or-defending" }),
          count: {
            type: "all",
          },
        },
        duration: "while-in-arena",
      },
    },
  }),
});

export const { red: haboobRed } = haboob.cards;
