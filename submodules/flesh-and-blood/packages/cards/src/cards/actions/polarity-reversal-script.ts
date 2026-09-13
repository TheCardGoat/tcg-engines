import { crank } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/polarity-reversal-script.generated.ts";

export const polarityReversalScript = definePitchFamily(
  fabPitchFamilies["polarity-reversal-script"],
  {
    keywords: [crank],
    abilities: () => ({
      entersArenaSteamCounter: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "replacement",
          replacementKind: "standard",
          replaces: {
            name: "enter-arena",
            subject: "self",
          },
          modification: {
            type: "add-counter",
            counter: {
              kind: "named",
              name: "steam",
            },
            count: 1,
            target: {
              selector: "self",
            },
          },
          duration: "while-in-arena",
        },
      },
      startTurnDestroyUnlessRemoveSteamCounter: {
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
            type: "unless",
            effect: {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            escape: {
              type: "remove-counters",
              counter: {
                kind: "named",
                name: "steam",
              },
              count: 1,
              target: {
                selector: "self",
              },
            },
          },
        },
      },
      actionGet1DefenseDefendingMechanologistAttackAction: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "modify-numeric",
          property: "defense",
          op: "subtract",
          amount: 1,
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "any",
            zones: ["combat-chain"],
            filter: {
              typeBox: {
                types: ["Action"],
              },
              defending: true,
              defendingAgainst: {
                typeBox: {
                  supertypes: ["Mechanologist"],
                  types: ["Action"],
                  subtypes: ["Attack"],
                },
              },
            },
            count: {
              type: "all",
            },
          },
          duration: "while-in-arena",
        },
      },
    }),
  },
);

export const { red: polarityReversalScriptRed } = polarityReversalScript.cards;
