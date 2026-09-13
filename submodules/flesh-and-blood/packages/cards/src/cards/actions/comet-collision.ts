import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/comet-collision.generated.ts";

export const cometCollision = definePitchFamily(fabPitchFamilies["comet-collision"], {
  parameters: pitchMap({
    red: 3,
    yellow: 2,
    blue: 1,
  }),
  abilities: (amount) => ({
    starfallDamage: {
      type: "conditional",
      condition: {
        type: "zone-count",
        zone: "graveyard",
        player: "controller",
        filter: { typeBox: { types: ["Instant"] } },
        comparison: { op: "gte", value: 1 },
        per: "turn",
      },
      then: {
        type: "deal-damage",
        damageType: "arcane",
        amount: amount + 1,
        target: {
          selector: "object",
          declared: "on-stack",
          player: "any",
          zones: ["hero", "permanent"],
          count: 1,
        },
      },
      else: {
        type: "deal-damage",
        damageType: "arcane",
        amount,
        target: {
          selector: "object",
          declared: "on-stack",
          player: "any",
          zones: ["hero", "permanent"],
          count: 1,
        },
      },
      label: { name: "starfall" },
    },
  }),
});

export const {
  red: cometCollisionRed,
  yellow: cometCollisionYellow,
  blue: cometCollisionBlue,
} = cometCollision.cards;
