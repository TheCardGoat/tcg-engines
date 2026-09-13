import { dominate, goAgain } from "../shared/keywords.ts";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/cut-n-carve.generated.ts";

export const cutNCarve = definePitchFamily(fabPitchFamilies["cut-n-carve"], {
  parameters: pitchMap({ red: 1, yellow: 2, blue: 3 }),
  keywords: [{ name: "sharpen" }, goAgain],
  abilities: (threshold) => ({
    sharpen: {
      type: "sharpen",
      target: {
        selector: "object",
        declared: "on-stack",
        player: "controller",
        zones: ["weapon", "permanent"],
        filter: {
          typeBox: {
            subtypes: ["Sword"],
          },
        },
        count: 1,
      },
      outputBinding: "it",
    },
    dominate: {
      kind: "resolution",
      condition: {
        type: "has-counter",
        counter: {
          kind: "numeric",
          value: 1,
          property: "power",
        },
        target: {
          selector: "binding",
          binding: "it",
        },
        comparison: {
          op: "gte",
          value: threshold,
        },
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: dominate,
        },
        target: {
          selector: "binding",
          binding: "it",
        },
        duration: "this-turn",
        appliesTo: {
          attacksOf: true,
          count: 1,
          next: {
            typeBox: {
              types: ["Weapon"],
            },
          },
          events: ["attack"],
        },
      },
    },
  }),
});

export const { red: cutNCarveRed, yellow: cutNCarveYellow, blue: cutNCarveBlue } = cutNCarve.cards;
