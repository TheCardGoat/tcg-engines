import { boost } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/combustible-courier.generated.ts";

export const combustibleCourier = definePitchFamily(fabPitchFamilies["combustible-courier"], {
  keywords: [boost],
  abilities: () => ({
    onHitModifyNumericPower: {
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
          amount: 3,
          target: {
            selector: "this-attack",
          },
          duration: "this-combat-chain",
          appliesTo: {
            next: {
              typeBox: {
                subtypes: ["Attack"],
              },
              hasStatus: "boosted",
            },
          },
        },
      },
    },
  }),
});

export const {
  red: combustibleCourierRed,
  yellow: combustibleCourierYellow,
  blue: combustibleCourierBlue,
} = combustibleCourier.cards;
