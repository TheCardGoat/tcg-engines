import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/double-down.generated.ts";

import { goAgain, overpower } from "../shared/keywords.ts";

export const doubleDown = definePitchFamily(fabPitchFamilies["double-down"], {
  keywords: [goAgain],
  abilities: () => ({
    mayDestroyGoldControlRatherThanPayDoubleDown: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "alternative-cost",
        cost: {
          class: "effect",
          type: "destroy",
          filter: {
            name: "Gold",
          },
        },
        optional: true,
      },
    },
    nextAttackWagersTurnGets3Overpower: {
      kind: "resolution",
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "wager",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "none",
            },
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-turn",
          matching: "first",
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 3,
                target: {
                  selector: "this-attack",
                },
                duration: "this-turn",
              },
              {
                type: "grant-property",
                property: {
                  kind: "keyword",
                  keyword: overpower,
                },
                target: {
                  selector: "this-attack",
                },
                duration: "this-turn",
              },
            ],
          },
        },
      },
    },
    ifHeroWouldCreate1MoreTokensFromWager: {
      kind: "resolution",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "create",
          creator: "any",
          occurrences: "every",
          filter: {
            typeBox: {
              metatypes: ["Token"],
            },
          },
          source: "wager",
        },
        modification: {
          type: "modify-numeric",
          property: "count",
          op: "add",
          amount: 1,
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
        duration: "this-turn",
      },
    },
  }),
});
export const { red: doubleDownRed } = doubleDown.cards;
