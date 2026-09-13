import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/ink-lined-cloak.generated.ts";

/**
 * OSC004 Ink-lined Cloak — Wizard Chest d0.
 *
 * Printed:
 *   Instant - Destroy this: Gain {r}. Activate this only if you control an
 *   aura permanent with Sigil in its name.
 *
 * Model notes (hand-authored):
 * - Gate is control-object of a permanent with Aura on the type line AND
 *   "Sigil" in the name. Aura is a type-box type (not a subtype) — prior
 *   subtypes:["Aura"] never matched Sigil of Fate / Sigil of Solace auras.
 */
export const inkLinedCloak = defineCard(fabCardIdentitiesByCanonicalId["TPQdbDWdpDjBznGcwfF7g"], {
  abilities: {
    instantDestroyGainActivateOnlyIfControlAuraPermanent: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      condition: {
        type: "control-object",
        filter: {
          and: [
            {
              typeBox: {
                subtypes: ["Aura"],
              },
            },
            {
              nameContains: "Sigil",
            },
          ],
        },
      },
      effect: {
        type: "gain-resources",
        amount: 1,
      },
    },
  },
});
