import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/teklo-trebuchet-2000.generated.ts";
import { boost } from "../shared/keywords.ts";

export const tekloTrebuchet2000 = definePitchFamily(fabPitchFamilies["teklo-trebuchet-2000"], {
  keywords: [boost],
  abilities: () => ({
    whenAttacksNextAttackBoostCombatChainGetsNumber2Power: {
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
          amount: 2,
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

export const { blue: tekloTrebuchet2000Blue } = tekloTrebuchet2000.cards;
