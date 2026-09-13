import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/steelblade-shunt.generated.ts";

export const steelbladeShunt = definePitchFamily(fabPitchFamilies["steelblade-shunt"], {
  abilities: () => ({
    damageAttackerWhenDefendingWeapon: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "defended-attack",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                types: ["Weapon"],
              },
            },
          },
          target: {
            kind: "any",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "deal-damage",
          damageType: "generic",
          amount: 1,
          target: {
            selector: "attacking-hero",
          },
        },
      },
    },
  }),
});

export const {
  red: steelbladeShuntRed,
  yellow: steelbladeShuntYellow,
  blue: steelbladeShuntBlue,
} = steelbladeShunt.cards;
