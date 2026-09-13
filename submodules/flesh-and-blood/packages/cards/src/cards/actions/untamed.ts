import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/untamed.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const untamed = definePitchFamily(fabPitchFamilies["untamed"], {
  keywords: [goAgain],
  abilities: () => ({
    triggeredStaticOnAttackEffect: {
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

export const { red: untamedRed, yellow: untamedYellow, blue: untamedBlue } = untamed.cards;
