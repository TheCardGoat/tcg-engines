import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shimmers-of-silver.generated.ts";
import { spectra } from "../shared/keywords.ts";

/**
 * Model notes (hand-authored): trigger filters Illusionist aura weapons (not a
 * name string) and puts the +1{p} counter on the attacking weapon.
 */
export const shimmersOfSilver = definePitchFamily(fabPitchFamilies["shimmers-of-silver"], {
  keywords: [spectra],
  abilities: () => ({
    oncePerTurnWhenAttackWithIllusionistAuraWeaponPutNumber1Power: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                supertypes: ["Illusionist"],
                types: ["Weapon"],
                subtypes: ["Aura"],
              },
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "add-counter",
          counter: {
            kind: "numeric",
            value: 1,
            property: "power",
          },
          count: 1,
          target: {
            selector: "this-attack",
          },
        },
      },
      limit: {
        count: 1,
        per: "turn",
      },
    },
  }),
});

export const { blue: shimmersOfSilverBlue } = shimmersOfSilver.cards;
