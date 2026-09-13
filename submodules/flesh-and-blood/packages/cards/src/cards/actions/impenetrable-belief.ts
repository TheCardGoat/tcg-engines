import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/impenetrable-belief.generated.ts";

const abilities = {
  continuousAndHasStatusThisIsDefendingZoneCountModifyNumericDefenseWhileCondition: {
    kind: "static",
    staticKind: "continuous",
    condition: {
      type: "and",
      conditions: [
        {
          type: "has-status",
          status: "this-is-defending",
        },
        {
          type: "zone-count",
          zone: "banished",
          player: "opponent",
          per: "turn",
          comparison: {
            op: "gte",
            value: 3,
          },
        },
      ],
    },
    effect: {
      type: "modify-numeric",
      property: "defense",
      op: "add",
      amount: 2,
      target: {
        selector: "self",
      },
      duration: "while-condition",
    },
  },
} as const;

export const impenetrableBelief = definePitchFamily(fabPitchFamilies["impenetrable-belief"], {
  abilities: () => ({ ...abilities }),
});

export const {
  red: impenetrableBeliefRed,
  yellow: impenetrableBeliefYellow,
  blue: impenetrableBeliefBlue,
} = impenetrableBelief.cards;
