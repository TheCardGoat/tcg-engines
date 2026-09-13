import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/autosave-script.generated.ts";

import { crank } from "../shared/keywords.ts";

export const autosaveScript = definePitchFamily(fabPitchFamilies["autosave-script"], {
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
    atStartTurnDestroyUnlessRemoveSteamCounterFrom: {
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
    mechanologistAttackActionGetWhenHitsPutBottomOwner: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "whenHitsPutBottomOwnerSDeck",
            text: "",
            trigger: {
              kind: "event",
              event: {
                name: "hit",
                actor: {
                  kind: "player",
                  player: "ability-controller",
                },
                observes: {
                  kind: "source",
                  selector: "attack",
                },
              },
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "move-card",
                target: {
                  selector: "self",
                },
                to: {
                  zone: "deck",
                  position: "bottom",
                },
              },
            },
          },
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
export const { blue: autosaveScriptBlue } = autosaveScript.cards;
