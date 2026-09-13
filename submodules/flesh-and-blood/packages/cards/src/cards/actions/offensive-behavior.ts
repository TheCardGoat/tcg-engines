import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/offensive-behavior.generated.ts";

export const offensiveBehavior = definePitchFamily(fabPitchFamilies["offensive-behavior"], {
  abilities: () => ({
    mightVigorTokenGets1Power: {
      kind: "resolution",
      condition: {
        type: "control-object",
        filter: {
          name: "Might Or Vigor",
          typeBox: {
            metatypes: ["Token"],
          },
        },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
    hitsCreateMightVigorToken: {
      kind: "static",
      staticKind: "triggered",
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
              type: "create-token",
              token: "might",
              controller: "controller",
            },
            {
              type: "create-token",
              token: "vigor",
              controller: "controller",
            },
          ],
        },
      },
    },
  }),
});

export const { blue: offensiveBehaviorBlue } = offensiveBehavior.cards;
