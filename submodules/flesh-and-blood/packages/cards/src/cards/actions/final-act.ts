import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/final-act.generated.ts";

export const finalAct = definePitchFamily(fabPitchFamilies["final-act"], {
  abilities: () => ({
    whenAttacksGetsXWhereXIsTwiceNumber: {
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
          amount: {
            type: "double",
            operands: [
              {
                type: "count",
                what: "cards-in-zone",
                zone: "pitch",
                player: "any",
              },
            ],
          },
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    },
  }),
});
export const { red: finalActRed } = finalAct.cards;
