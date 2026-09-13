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
          selector: "any-hero",
        },
      },
    },
    veDealtArcaneDamageOpposingHeroTurnPlayAsThoughWereInstant: {
      kind: "static",
      staticKind: "play",
      condition: { type: "performed-this-turn", event: "deal-arcane-damage", player: "controller" },
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
