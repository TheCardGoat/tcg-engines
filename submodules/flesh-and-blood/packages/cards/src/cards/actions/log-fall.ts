import { overpower } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/log-fall.generated.ts";

export const logFall = definePitchFamily(fabPitchFamilies["log-fall"], {
  parameters: {
    red: {
      earthPitchedPlayGetsOverpower: {
        kind: "resolution",
        condition: {
          type: "binding-numeric",
          binding: "pitched-this-way-earth-card",
          comparison: { op: "eq", value: 1 },
        },
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
        label: {
          name: "earth-bond",
        },
      },
    },
    yellow: {
      earthPitchedPlayGetsOverpower: {
        kind: "resolution",
        condition: {
          type: "binding-numeric",
          binding: "pitched-this-way-earth-card",
          comparison: { op: "eq", value: 1 },
        },
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
        label: {
          name: "earth-bond",
        },
      },
    },
  },
  abilities: (abilities) => abilities,
});

export const { red: logFallRed, yellow: logFallYellow } = logFall.cards;
