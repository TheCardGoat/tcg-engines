import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/steel-street-enforcement.generated.ts";

export const steelStreetEnforcement = definePitchFamily(
  fabPitchFamilies["steel-street-enforcement"],
  {
    abilities: () => ({
      evoUpgrade: {
        kind: "static",
        staticKind: "while",
        condition: { type: "has-status", status: "defending" },
        effect: {
          type: "modify-numeric",
          property: "defense",
          op: "add",
          amount: { type: "count", what: "evos-equipped" },
          target: { selector: "self" },
          duration: "this-turn",
        },
        label: { name: "evo-upgrade" },
      },
    }),
  },
);

export const { blue: steelStreetEnforcementBlue } = steelStreetEnforcement.cards;
