import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/lightning-overload.generated.ts";

export const lightningOverload = definePitchFamily(fabPitchFamilies["lightning-overload"], {
  abilities: (_parameter, { pitch }) => ({
    dealDamage: {
      kind: "resolution",
      effect: {
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
    },
    zoneCountCreateTokenLightningFlowStarfall: {
      kind: "resolution",
      condition: {
        type: "zone-count",
        zone: "graveyard",
        player: "controller",
        filter: {
          typeBox: {
            types: ["Instant"],
          },
        },
        comparison: {
          op: "gte",
          value: 1,
        },
        per: "turn",
      },
      effect: {
        type: "create-token",
        token: "lightning-flow",
        controller: "controller",
      },
      label: {
        name: "starfall",
      },
    },
  }),
});

export const {
  red: lightningOverloadRed,
  yellow: lightningOverloadYellow,
  blue: lightningOverloadBlue,
} = lightningOverload.cards;
