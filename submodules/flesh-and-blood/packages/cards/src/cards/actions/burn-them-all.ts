import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/burn-them-all.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const burnThemAll = definePitchFamily(fabPitchFamilies["burn-them-all"], {
  keywords: [goAgain],
  abilities: () => ({
    whenDragonControlAttacksDeals1ArcaneDamageEach: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                subtypes: ["Dragon"],
              },
            },
            bindAs: "it",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "deal-damage",
          damageType: "arcane",
          amount: 1,
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["hero"],
            count: {
              type: "all",
            },
          },
          source: {
            selector: "binding",
            binding: "it",
          },
        },
      },
      limit: {
        count: 1,
        per: "turn",
      },
    },
    atBeginningEndPhasePutRazeCounterBurnThem: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "end-phase",
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
                name: "raze",
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
                  selector: "binding",
                  binding: "it",
                },
              },
              escape: {
                type: "banish",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["graveyard"],
                  filter: {
                    color: ["red"],
                  },
                  count: {
                    type: "count",
                    what: "counters-on-source",
                    counter: {
                      kind: "named",
                      name: "raze",
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },
  }),
});
export const { red: burnThemAllRed } = burnThemAll.cards;
