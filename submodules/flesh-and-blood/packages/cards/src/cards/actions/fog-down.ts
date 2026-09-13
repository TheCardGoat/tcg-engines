import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/fog-down.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const fogDown = definePitchFamily(fabPitchFamilies["fog-down"], {
  abilities: () => ({
    nonAttackActionLoseCanTGainGoAgain: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "remove-property",
            property: {
              kind: "keyword",
              keyword: goAgain,
            },
            target: {
              selector: "object",
              declared: "at-resolution",
              zones: ["stack", "combat-chain"],
              filter: {
                typeBox: {
                  types: ["Action"],
                  excludeSubtypes: ["Attack"],
                },
              },
              count: {
                type: "all",
              },
            },
            duration: "while-in-arena",
          },
          {
            type: "rule-modification",
            mode: "restrict",
            action: "gain-keyword",
            keyword: "go-again",
            filter: {
              typeBox: {
                types: ["Action"],
                excludeSubtypes: ["Attack"],
              },
            },
            duration: "while-in-arena",
          },
        ],
      },
    },
    atBeginningActionPhaseDestroyFogDown: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
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
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
  }),
});
export const { yellow: fogDownYellow } = fogDown.cards;
