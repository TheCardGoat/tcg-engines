import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/arcane-compliance.generated.ts";

export const arcaneCompliance = definePitchFamily(fabPitchFamilies["arcane-compliance"], {
  abilities: () => ({
    untilEndTurnEffectsCanTIncreaseArcaneDamage: {
      kind: "resolution",
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "modify-damage",
        damageType: "arcane",
        subject: {
          selector: "object",
          declared: "on-stack",
          player: "any",
          zones: ["stack"],
          filter: {
            typeBox: {
              types: ["Action"],
            },
          },
          count: 1,
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { blue: arcaneComplianceBlue } = arcaneCompliance.cards;
