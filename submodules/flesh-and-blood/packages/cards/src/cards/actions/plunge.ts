import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/plunge.generated.ts";

export const plunge = definePitchFamily(fabPitchFamilies["plunge"], {
  supertypeSets: [["Assassin"], ["Ninja"]],
  keywords: [goAgain],

  abilities: () => ({
    triggeredHitModifyNumericPowerThisTurn: {
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
          duration: "this-turn",
          appliesTo: {
            next: {
              typeBox: {
                subtypes: ["Dagger"],
              },
            },
          },
        },
      },
    },
  }),
});
export const { red: plungeRed, yellow: plungeYellow, blue: plungeBlue } = plunge.cards;
