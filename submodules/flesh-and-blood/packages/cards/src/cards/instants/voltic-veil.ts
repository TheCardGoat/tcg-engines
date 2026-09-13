import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/voltic-veil.generated.ts";

export const volticVeil = definePitchFamily(fabPitchFamilies["voltic-veil"], {
  abilities: () => ({
    preventNext4DamageWouldBeDealtTurn: {
      kind: "resolution",
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 4,
        shielded: {
          selector: "controller",
        },
        duration: "this-turn",
      },
    },
    ifLightningWasPitchedPlayDeal1ArcaneDamage: {
      kind: "resolution",
      condition: {
        type: "binding-numeric",
        binding: "pitched-this-way-lightning-card",
        comparison: { op: "eq", value: 1 },
      },
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "opponent",
          zones: ["hero"],
          count: {
            type: "all",
          },
        },
      },
      label: {
        name: "lightning-bond",
      },
    },
  }),
});

export const { red: volticVeilRed } = volticVeil.cards;
