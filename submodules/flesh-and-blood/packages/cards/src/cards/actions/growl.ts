import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/growl.generated.ts";

export const growl = definePitchFamily(fabPitchFamilies["growl"], {
  keywords: [goAgain],
  abilities: () => ({
    whenAttacksNextCrouchingTigerPlayCombatChainGets: {
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
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "this-attack",
          },
          duration: "this-combat-chain",
          appliesTo: {
            next: {
              name: "Crouching Tiger",
            },
          },
        },
      },
    },
  }),
});
export const { red: growlRed, yellow: growlYellow } = growl.cards;
