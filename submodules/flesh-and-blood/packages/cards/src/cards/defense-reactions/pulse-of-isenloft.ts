import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/pulse-of-isenloft.generated.ts";
import { legendary } from "../shared/keywords.ts";

export const pulseOfIsenloft = definePitchFamily(fabPitchFamilies["pulse-of-isenloft"], {
  keywords: [legendary],
  abilities: () => ({
    bolsterElementalDefense: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              types: ["Action"],
            },
            or: [
              {
                typeBox: {
                  supertypes: ["Earth"],
                },
              },
              {
                typeBox: {
                  supertypes: ["Ice"],
                },
              },
              {
                typeBox: {
                  supertypes: ["Elemental"],
                },
              },
            ],
          },
          events: ["defend"],
          count: { type: "all" },
        },
      },
    },
  }),
});

export const { blue: pulseOfIsenloftBlue } = pulseOfIsenloft.cards;
