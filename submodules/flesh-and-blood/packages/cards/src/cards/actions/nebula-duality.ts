import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/nebula-duality.generated.ts";

export const nebulaDuality = definePitchFamily(fabPitchFamilies["nebula-duality"], {
  abilities: (_parameter, { pitch }) => ({
    dealDamage: {
      kind: "resolution",
      effect: {
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
    },
    instantAllResourcesDiscardSelfSequenceDealDamageCreateTokenLightningFlow: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          {
            class: "effect",
            type: "discard-self",
          },
        ],
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "deal-damage",
            damageType: "arcane",
            amount: 1,
            target: {
              selector: "any-hero",
            },
          },
          {
            type: "create-token",
            token: "lightning-flow",
            controller: "controller",
          },
        ],
      },
    },
  }),
});

export const {
  red: nebulaDualityRed,
  yellow: nebulaDualityYellow,
  blue: nebulaDualityBlue,
} = nebulaDuality.cards;
