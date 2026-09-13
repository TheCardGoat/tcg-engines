import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/polar-blast.generated.ts";
import { dominate, goAgain } from "../shared/keywords.ts";

export const polarBlast = definePitchFamily(fabPitchFamilies["polar-blast"], {
  keywords: [goAgain],
  abilities: (_parameter, { pitch }) => ({
    unlessGrantPropertyThisTurnPayResources: {
      kind: "resolution",
      effect: {
        type: "unless",
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: dominate,
          },
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: {
            next: {
              typeBox: {
                subtypes: ["Attack"],
              },
            },
          },
        },
        escape: {
          type: "pay",
          cost: {
            class: "asset",
            type: "resources",
            amount: 4 - Number(pitch),
          },
          payer: "opponent",
        },
      },
    },
    triggeredPlayDraw: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "played-card",
          },
          from: ["arsenal"],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "draw",
          count: 1,
          player: "controller",
        },
      },
    },
  }),
});

export const {
  red: polarBlastRed,
  yellow: polarBlastYellow,
  blue: polarBlastBlue,
} = polarBlast.cards;
