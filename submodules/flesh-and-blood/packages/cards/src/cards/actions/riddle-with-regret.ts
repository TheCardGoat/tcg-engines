import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/riddle-with-regret.generated.ts";

const auraCount = (player: "controller" | "opponent") =>
  ({
    type: "count",
    what: "cards-in-zone",
    zone: "permanent",
    player,
    filter: {
      typeBox: {
        subtypes: ["Aura"],
      },
    },
  }) as const;

const endPhaseTax = (player: "controller" | "opponent") =>
  ({
    type: "sequence",
    steps: [
      {
        type: "lose-life",
        amount: auraCount(player),
        target: {
          selector: player,
        },
      },
      {
        type: "conditional",
        condition: {
          type: "compare-amount",
          amount: auraCount(player),
          comparison: { op: "gte", value: 3 },
        },
        then: {
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    ],
  }) as const;

export const riddleWithRegret = definePitchFamily(fabPitchFamilies["riddle-with-regret"], {
  keywords: [goAgain],
  abilities: () => ({
    beginningHerosEndPhaseLoseXLifeWhereXNumberAurasTriggeredX3MoreDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "end-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: endPhaseTax("controller"),
      },
    },
    beginningHerosEndPhaseLoseXLifeWhereXNumberAurasTriggeredX3MoreDestroyTriggeredEndPhase: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "end-phase",
          actor: {
            kind: "player",
            player: "opponent",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: endPhaseTax("opponent"),
      },
    },
  }),
});

export const { red: riddleWithRegretRed } = riddleWithRegret.cards;
