import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/aether-flare.generated.ts";

export const aetherFlare = definePitchFamily(fabPitchFamilies["aether-flare"], {
  parameters: pitchMap({ red: { damage: 3 }, yellow: { damage: 2 }, blue: { damage: 1 } }),
  abilities: ({ damage }) => ({
    resolutionDealDamageArcane: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: damage,
        target: {
          selector: "opponent",
        },
      },
    },
    resolutionReplacementModifyNumericCount: {
      kind: "resolution",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "damage",
          damageType: "arcane",
        },
        modification: {
          type: "modify-numeric",
          property: "count",
          op: "add",
          amount: {
            type: "count",
            what: "damage-dealt",
            per: "turn",
            filter: {
              name: "Aether Flare",
            },
          },
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            hasStatus: "arcane-damage-effect",
          },
        },
      },
    },
  }),
});

export const {
  red: aetherFlareRed,
  yellow: aetherFlareYellow,
  blue: aetherFlareBlue,
} = aetherFlare.cards;
