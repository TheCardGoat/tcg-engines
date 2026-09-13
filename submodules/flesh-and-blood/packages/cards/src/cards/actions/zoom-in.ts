import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/zoom-in.generated.ts";
import { boost } from "../shared/keywords.ts";

export const zoomIn = definePitchFamily(fabPitchFamilies["zoom-in"], {
  keywords: [
    {
      name: "opt",
      value: {
        type: "x",
      },
    },
    boost,
  ],
  abilities: () => ({
    triggeredStaticOnAttackEffect: {
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
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              name: "Zoom In",
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "opt",
          count: {
            type: "count",
            what: "boosts-this-combat-chain",
          },
        },
      },
    },
  }),
});

export const { red: zoomInRed, yellow: zoomInYellow, blue: zoomInBlue } = zoomIn.cards;
