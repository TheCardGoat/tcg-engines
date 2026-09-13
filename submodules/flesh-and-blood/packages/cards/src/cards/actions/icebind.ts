import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/icebind.generated.ts";

export const icebind = definePitchFamily(fabPitchFamilies["icebind"], {
  keywords: [fusion("Ice")],
  abilities: (_parameter, { pitch }) => ({
    sequenceDealDamageConditionalAndHasStatusFusedHasStatusDealtDamageToHeroFreezeUntilStartOfOwnNext:
      {
        kind: "resolution",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "deal-damage",
              damageType: "arcane",
              amount: 4 - Number(pitch),
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
                type: "freeze",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "target-controller",
                  zones: ["arsenal"],
                  count: 1,
                },
                duration: "until-start-of-own-next-turn",
              },
            },
          ],
        },
      },
  }),
});

export const { red: icebindRed, yellow: icebindYellow, blue: icebindBlue } = icebind.cards;
