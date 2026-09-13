import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusedWhile, grantAbilityToSelf } from "@tcg/flesh-and-blood-types/authoring";
import { fusion } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/entangle.generated.ts";
export const entangle = definePitchFamily(fabPitchFamilies["entangle"], {
  keywords: [fusion("Earth")],
  abilities: (_parameter, _context) => ({
    weakenNextAttackOnHit: fusedWhile(
      grantAbilityToSelf("weakenNextAttack", {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "hit",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "source",
              selector: "attack",
            },
            target: {
              kind: "hero",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "subtract",
            amount: 2,
            target: {
              selector: "this-attack",
            },
            duration: "until-end-of-next-turn",
            appliesTo: {
              next: {
                typeBox: {
                  subtypes: ["Attack"],
                },
              },
              ordinal: 1,
            },
          },
        },
      }),
    ),
  }),
});
export const { red: entangleRed, yellow: entangleYellow, blue: entangleBlue } = entangle.cards;
