import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/aether-wildfire.generated.ts";

export const aetherWildfire = definePitchFamily(fabPitchFamilies["aether-wildfire"], {
  abilities: () => ({
    deal4ArcaneDamageTargetOpposingHero: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 4,
        target: {
          selector: "opponent",
        },
      },
    },
    ifAetherWildfireIsPlayedDuringOpponentsTurnUntil: {
      kind: "resolution",
      condition: {
        type: "turn-player",
        who: "opponent",
      },
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "damage",
          damageType: "arcane",
          filter: {
            typeBox: {
              types: ["Action"],
            },
          },
        },
        modification: {
          type: "modify-numeric",
          property: "count",
          op: "add",
          amount: {
            type: "count",
            what: "damage-dealt",
            damageType: "arcane",
          },
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
        duration: "this-turn",
      },
    },
  }),
});
export const { red: aetherWildfireRed } = aetherWildfire.cards;
