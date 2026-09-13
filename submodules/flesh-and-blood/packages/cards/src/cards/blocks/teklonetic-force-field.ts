import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/teklonetic-force-field.generated.ts";

export const tekloneticForceField = definePitchFamily(fabPitchFamilies["teklonetic-force-field"], {
  abilities: () => ({
    overpowerDefense: {
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
            filter: { hasKeyword: "overpower" },
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
          amount: 2,
          target: { selector: "self" },
          duration: "this-turn",
        },
      },
    },
  }),
});

export const {
  red: tekloneticForceFieldRed,
  yellow: tekloneticForceFieldYellow,
  blue: tekloneticForceFieldBlue,
} = tekloneticForceField.cards;
