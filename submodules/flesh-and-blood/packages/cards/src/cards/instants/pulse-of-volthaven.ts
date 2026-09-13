import { legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/pulse-of-volthaven.generated.ts";

export const pulseOfVolthaven = definePitchFamily(fabPitchFamilies["pulse-of-volthaven"], {
  keywords: [legendary],
  abilities: () => ({
    nextIceLightningElementalAttackTurnGains4: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 4,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            or: [
              {
                typeBox: {
                  supertypes: ["Ice"],
                },
              },
              {
                typeBox: {
                  supertypes: ["Lightning"],
                },
              },
              {
                typeBox: {
                  supertypes: ["Elemental"],
                },
              },
            ],
          },
        },
      },
    },
  }),
});

export const { red: pulseOfVolthavenRed } = pulseOfVolthaven.cards;
