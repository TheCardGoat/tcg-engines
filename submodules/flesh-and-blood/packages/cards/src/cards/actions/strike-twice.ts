import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/strike-twice.generated.ts";

export const strikeTwice = definePitchFamily(fabPitchFamilies["strike-twice"], {
  abilities: () => ({
    dealNumber3ArcaneDamageAny: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 3,
        target: {
          selector: "object",
          declared: "on-stack",
          player: "any",
          zones: ["hero", "permanent"],
          filter: { hasProperty: "life" },
          count: 1,
        },
      },
    },
    veDealtArcaneDamageOpposingHeroTurnPlayAsThoughWereInstant: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "compare-amount",
        amount: {
          type: "count",
          what: "damage-dealt",
          recipient: "opposing-heroes",
          damageType: "arcane",
          per: "turn",
        },
        comparison: { op: "gt", value: 0 },
      },
      playEffect: {
        role: "permission",
        fromZones: ["hand", "arsenal"],
        asType: "instant",
        optional: true,
      },
    },
  }),
});

export const { red: strikeTwiceRed } = strikeTwice.cards;
