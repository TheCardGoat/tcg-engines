import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/ignite.generated.ts";

export const ignite = definePitchFamily(fabPitchFamilies["ignite"], {
  keywords: [goAgain],
  abilities: () => ({
    attacksNextDraconicPlayActivateCombatChainCostsResourceLessPlayActivate: {
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
          property: "cost",
          op: "subtract",
          amount: 1,
          target: {
            selector: "this-attack",
          },
          duration: "this-combat-chain",
          appliesTo: {
            next: {
              typeBox: {
                supertypes: ["Draconic"],
              },
            },
          },
        },
      },
    },
  }),
});

export const { red: igniteRed } = ignite.cards;
