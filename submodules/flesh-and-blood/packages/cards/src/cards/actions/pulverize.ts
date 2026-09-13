import { heave } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pulverize.generated.ts";

export const pulverize = definePitchFamily(fabPitchFamilies["pulverize"], {
  keywords: [heave(3)],
  abilities: () => ({
    pulverizeHitsFirstAttackDuringNextTurn4Power: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
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
          amount: 4,
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
    },
  }),
});

export const { red: pulverizeRed } = pulverize.cards;
