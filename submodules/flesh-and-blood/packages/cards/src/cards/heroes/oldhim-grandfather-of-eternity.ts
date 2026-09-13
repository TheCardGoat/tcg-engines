import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/oldhim-grandfather-of-eternity.generated.ts";

export const oldhimGrandfatherOfEternity = defineCard(
  fabCardIdentitiesByCanonicalId["bh96L8jp69mNpjcGRCDbj"],
  {
    keywords: [
      {
        name: "essence",
        supertypes: ["Earth", "Ice"],
      },
    ],
    abilities: {
      oncePerTurnDefenseReactionResourceResourceResourceEarthPitchedWayPreventNext2DamageDealtOldhimTurnIcePitchedWayAttackingPutsHandTopDeck:
        {
          kind: "activated",
          limit: {
            count: 1,
            per: "turn",
          },
          abilityType: "defense-reaction",
          cost: {
            class: "asset",
            type: "resources",
            amount: 3,
          },
          effect: {
            type: "sequence",
            steps: [
              {
                type: "conditional",
                condition: {
                  type: "binding-numeric",
                  binding: "pitched-this-way-earth-card",
                  comparison: { op: "eq", value: 1 },
                },
                then: {
                  type: "prevention",
                  preventionKind: "fixed",
                  amount: 2,
                  shielded: { selector: "controller" },
                  duration: "this-turn",
                },
              },
              {
                type: "conditional",
                condition: {
                  type: "binding-numeric",
                  binding: "pitched-this-way-ice-card",
                  comparison: { op: "eq", value: 1 },
                },
                then: {
                  type: "move-card",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "attacking-hero",
                    zones: ["hand"],
                    count: 1,
                  },
                  to: {
                    zone: "deck",
                    position: "top",
                  },
                },
              },
            ],
          },
        },
    },
  },
);
