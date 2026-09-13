import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/tremorshield-sabatons.generated.ts";

export const tremorshieldSabatons = defineCard(
  fabCardIdentitiesByCanonicalId["mwWqPrQzL7fmQkzCFfttc"],
  {
    keywords: [bladeBreak],
    abilities: {
      instantDestroyPreventNext1ArcaneDamageWouldBe: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        effect: {
          type: "conditional",
          condition: {
            type: "performed-this-turn",
            event: "control-seismic-surge",
            player: "controller",
          },
          then: {
            type: "prevention",
            preventionKind: "fixed",
            amount: 2,
            damageType: "arcane",
            shielded: {
              selector: "controller",
            },
            duration: "this-turn",
          },
          else: {
            type: "prevention",
            preventionKind: "fixed",
            amount: 1,
            damageType: "arcane",
            shielded: {
              selector: "controller",
            },
            duration: "this-turn",
          },
        },
      },
    },
  },
);
