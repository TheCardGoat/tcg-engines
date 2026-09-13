import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/sit.generated.ts";

export const sit = definePitchFamily(fabPitchFamilies.sit, {
  abilities: () => ({
    bruteDefense: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: { kind: "any" },
          observes: {
            kind: "event-object",
            selector: "defended-attack",
            relationship: { kind: "any" },
            filter: { typeBox: { supertypes: ["Brute"] } },
          },
          target: { kind: "any" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "defense",
          op: "add",
          amount: 3,
          target: { selector: "self" },
          duration: "this-turn",
        },
      },
    },
  }),
});

export const { red: sitRed } = sit.cards;
