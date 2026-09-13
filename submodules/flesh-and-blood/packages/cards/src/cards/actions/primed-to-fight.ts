import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/primed-to-fight.generated.ts";

export const primedToFight = definePitchFamily(fabPitchFamilies["primed-to-fight"], {
  abilities: () => ({
    vigorTokenTurnCostsResourceLessPlay: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "control-object",
        filter: { name: "Vigor" },
        per: "turn",
      },
      playEffect: {
        role: "cost-reduction",
        cost: {
          class: "asset",
          type: "resources",
          amount: 1,
        },
      },
    },
    mightTokenTurnGets1Power: {
      kind: "resolution",
      condition: {
        type: "control-object",
        filter: { name: "Might" },
        per: "turn",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { red: primedToFightRed } = primedToFight.cards;
