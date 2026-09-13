import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shaden-death-hydra.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const shadenDeathHydra = definePitchFamily(fabPitchFamilies["shaden-death-hydra"], {
  keywords: [bloodDebt],
  abilities: () => ({
    whenAttacksDealsXDamageWhereXNumber13MinusNumberWithBlood: {
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
          type: "deal-damage",
          damageType: "generic",
          amount: {
            type: "difference",
            operands: [
              13,
              {
                type: "count",
                what: "cards-in-zone",
                zone: "banished",
                player: "controller",
                filter: {
                  hasKeyword: "blood-debt",
                },
              },
            ],
          },
          target: {
            selector: "controller",
          },
        },
      },
    },
  }),
});

export const { yellow: shadenDeathHydraYellow } = shadenDeathHydra.cards;
