import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/snapback.generated.ts";

/**
 * Model notes (hand-authored): second clause is a play-as-instant permission,
 * not a resolution that plays Snapback from soul. Gate is played-this Wizard
 * non-attack action (generated has-status marker is unhandled).
 */
export const snapback = definePitchFamily(fabPitchFamilies["snapback"], {
  parameters: pitchMap({ red: { damage: 3 }, yellow: { damage: 2 }, blue: { damage: 1 } }),
  abilities: ({ damage }) => ({
    resolutionDealDamage: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: damage,
        target: {
          selector: "any-hero",
        },
      },
    },
    playStaticEffect: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "played-this",
        per: "turn",
        filter: {
          typeBox: {
            supertypes: ["Wizard"],
            types: ["Action"],
            excludeSubtypes: ["Attack"],
          },
        },
        comparison: {
          op: "gte",
          value: 1,
        },
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

export const { red: snapbackRed, yellow: snapbackYellow, blue: snapbackBlue } = snapback.cards;
