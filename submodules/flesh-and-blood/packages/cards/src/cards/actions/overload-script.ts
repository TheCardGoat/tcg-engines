import { crank, overpower } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/overload-script.generated.ts";

export const overloadScript = definePitchFamily(fabPitchFamilies["overload-script"], {
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
    mechanologistAttackActionGetOverpower: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: overpower,
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["stack", "combat-chain"],
          filter: {
            typeBox: {
              supertypes: ["Mechanologist"],
              types: ["Action"],
              subtypes: ["Attack"],
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
});

export const { red: overloadScriptRed } = overloadScript.cards;
