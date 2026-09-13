import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/polar-cap.generated.ts";

export const polarCap = definePitchFamily(fabPitchFamilies["polar-cap"], {
  keywords: [fusion("Ice")],
  abilities: (_parameter, { pitch }) => ({
    sequenceDealDamageConditionalAndHasStatusFusedHasStatusDealtDamageToHeroCreateTokenFrostbite: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "deal-damage",
            damageType: "arcane",
            amount: 5 - Number(pitch),
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["hero", "permanent"],
              count: 1,
            },
          },
          {
            type: "conditional",
            condition: {
              type: "and",
              conditions: [
                { type: "has-status", status: "fused" },
                { type: "has-status", status: "dealt-damage-to-hero" },
              ],
            },
            then: {
              type: "create-token",
              token: "frostbite",
              controller: "target-controller",
            },
          },
        ],
      },
    },
  }),
});

export const { red: polarCapRed, yellow: polarCapYellow, blue: polarCapBlue } = polarCap.cards;
