import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/templar-spellbane.generated.ts";

export const templarSpellbane = defineCard(
  fabCardIdentitiesByCanonicalId["QF7w8mPkmCmLGmtzDLDPM"],
  {
    keywords: [battleworn],
    abilities: {
      instantDestroyPreventNext1ArcaneDamageWouldBe: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        // Printed "instead" — single prevention with then/else amount, not a
        // sequence that registers prevent-1 then stacks prevent-2. Sequence +
        // instead:true was ignored by the proposal layer (both steps fired).
        effect: {
          type: "conditional",
          condition: {
            type: "performed-this-turn",
            event: "activate-weapon",
            player: "controller",
          },
          then: {
            type: "prevention",
            preventionKind: "shielding",
            amount: 2,
            damageType: "arcane",
            shielded: {
              selector: "controller",
            },
            duration: "this-turn",
          },
          else: {
            type: "prevention",
            preventionKind: "shielding",
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
