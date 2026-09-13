import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/crowd-control.generated.ts";

export const crowdControl = definePitchFamily(fabPitchFamilies["crowd-control"], {
  abilities: () => ({
    payForDefense: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "defender" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "pay",
            cost: { class: "asset", type: "resources", amount: 3 },
            payer: "controller",
          },
          then: {
            type: "modify-numeric",
            property: "defense",
            op: "add",
            amount: { type: "count", what: "heroes", player: "opponent" },
            target: { selector: "self" },
            duration: "this-turn",
          },
        },
      },
    },
  }),
});

export const {
  red: crowdControlRed,
  yellow: crowdControlYellow,
  blue: crowdControlBlue,
} = crowdControl.cards;
