import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/escalate-violence.generated.ts";

export const escalateViolence = definePitchFamily(fabPitchFamilies["escalate-violence"], {
  abilities: () => ({
    whenAttacksIfControlMightTokenCreate3More: {
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
          type: "control-object",
          filter: {
            name: "Might",
            typeBox: {
              metatypes: ["Token"],
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "might",
          controller: "controller",
          count: 3,
        },
      },
    },
  }),
});
export const { blue: escalateViolenceBlue } = escalateViolence.cards;
