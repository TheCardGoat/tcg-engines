import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/look-tuff.generated.ts";

export const lookTuff = definePitchFamily(fabPitchFamilies["look-tuff"], {
  abilities: () => ({
    attacksGets1PowerUnlessPayResource: {
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
          type: "unless",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "subtract",
            amount: 1,
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
          escape: {
            type: "pay",
            cost: {
              class: "asset",
              type: "resources",
              amount: 1,
            },
            payer: "controller",
          },
        },
      },
    },
  }),
});

export const { red: lookTuffRed } = lookTuff.cards;
