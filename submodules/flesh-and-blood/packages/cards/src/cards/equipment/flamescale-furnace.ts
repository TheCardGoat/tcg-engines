import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/flamescale-furnace.generated.ts";

/**
 * UPR084 Flamescale Furnace — Draconic Chest d2 Temper.
 *
 * Printed:
 *   Once per Turn Instant - {r}: Gain {r} for each red card in your pitch zone.
 *   Activate this ability only if you've played a red card this turn.
 *   Temper
 *
 * Model notes (hand-authored; sash-of-sandikai sibling):
 * - "played a red card" / "red card in pitch" are color filters, not type-line
 *   tokens. Prior types:["Red"] is invalid vocabulary and never matched.
 * - Effect amount already used color:["red"] for pitch count.
 */
export const flamescaleFurnace = defineCard(
  fabCardIdentitiesByCanonicalId["Fg6Mc9mLLBCDFdrTpTpTB"],
  {
    keywords: [temper],
    abilities: {
      oncePerTurnInstantGainEachRedPitchZone: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "instant",
        cost: {
          class: "asset",
          type: "resources",
          amount: 1,
        },
        condition: {
          type: "played-this",
          per: "turn",
          filter: {
            // Color, not type — Red is FabColor after normalize, not FAB_TYPES.
            color: ["red"],
          },
          comparison: {
            op: "gte",
            value: 1,
          },
        },
        effect: {
          type: "gain-resources",
          amount: {
            type: "count",
            what: "cards-in-zone",
            zone: "pitch",
            player: "controller",
            filter: {
              color: ["red"],
            },
          },
        },
      },
    },
  },
);
