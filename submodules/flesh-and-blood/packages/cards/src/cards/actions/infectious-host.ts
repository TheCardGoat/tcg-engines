import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/infectious-host.generated.ts";

export const infectiousHost = definePitchFamily(fabPitchFamilies["infectious-host"], {
  abilities: () => ({
    triggeredAttackSequenceConditionalControlObjectFrailtyCreateTokenFrailtyConditionalControlObjectInertiaCreateTokenInertiaConditionalControlObject:
      {
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
              kind: "source",
              selector: "attack",
            },
            target: {
              kind: "hero",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "conditional",
                condition: {
                  type: "control-object",
                  filter: {
                    name: "Frailty",
                    typeBox: {
                      metatypes: ["Token"],
                    },
                  },
                },
                then: {
                  type: "create-token",
                  token: "frailty",
                  controller: "attack-target",
                },
              },
              {
                type: "conditional",
                condition: {
                  type: "control-object",
                  filter: {
                    name: "Inertia",
                    typeBox: {
                      metatypes: ["Token"],
                    },
                  },
                },
                then: {
                  type: "create-token",
                  token: "inertia",
                  controller: "attack-target",
                },
              },
              {
                type: "conditional",
                condition: {
                  type: "control-object",
                  filter: {
                    name: "Bloodrot Pox",
                    typeBox: {
                      metatypes: ["Token"],
                    },
                  },
                },
                then: {
                  type: "create-token",
                  token: "bloodrot-pox",
                  controller: "attack-target",
                },
              },
            ],
          },
        },
      },
  }),
});

export const {
  red: infectiousHostRed,
  yellow: infectiousHostYellow,
  blue: infectiousHostBlue,
} = infectiousHost.cards;
