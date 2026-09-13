import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/brothers-in-arms.generated.ts";

export const brothersInArms = definePitchFamily(fabPitchFamilies["brothers-in-arms"], {
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
            cost: { class: "asset", type: "resources", amount: 1 },
            payer: "controller",
          },
          then: {
            type: "modify-numeric",
            property: "defense",
            op: "add",
            amount: 2,
            target: { selector: "self" },
            duration: "this-turn",
          },
        },
      },
    },
  }),
});

export const {
  red: brothersInArmsRed,
  yellow: brothersInArmsYellow,
  blue: brothersInArmsBlue,
} = brothersInArms.cards;
