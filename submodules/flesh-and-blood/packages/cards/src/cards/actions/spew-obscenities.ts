import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/spew-obscenities.generated.ts";

export const spewObscenities = definePitchFamily(fabPitchFamilies["spew-obscenities"], {
  abilities: () => ({
    controlConfidenceMightTokenGetsNumber1Power: {
      kind: "resolution",
      condition: {
        type: "control-object",
        filter: {
          name: "Confidence Or Might",
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
    whenHitsHeroCreateConfidenceMightToken: {
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
              token: "confidence",
              controller: "controller",
            },
            {
              type: "create-token",
              token: "might",
              controller: "controller",
            },
          ],
        },
      },
    },
  }),
});

export const { yellow: spewObscenitiesYellow } = spewObscenities.cards;
