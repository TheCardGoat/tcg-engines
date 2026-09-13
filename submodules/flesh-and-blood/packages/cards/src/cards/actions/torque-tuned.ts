import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/torque-tuned.generated.ts";
import { overpower } from "../shared/keywords.ts";

export const torqueTuned = definePitchFamily(fabPitchFamilies["torque-tuned"], {
  abilities: () => ({
    triggeredStaticOnAttackEffect: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
        state: {
          type: "performed-this-turn",
          event: "destroy-item",
          player: "controller",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: overpower,
          },
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    },
    triggeredStaticOnDefendEffect: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Item"],
                },
              },
              count: 1,
            },
          },
          then: {
            type: "modify-numeric",
            property: "defense",
            op: "add",
            amount: 2,
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
        },
      },
      label: {
        name: "galvanize",
      },
    },
  }),
});

export const {
  red: torqueTunedRed,
  yellow: torqueTunedYellow,
  blue: torqueTunedBlue,
} = torqueTuned.cards;
