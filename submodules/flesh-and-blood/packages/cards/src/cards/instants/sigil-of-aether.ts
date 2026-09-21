import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/sigil-of-aether.generated.ts";

export const sigilOfAether = definePitchFamily(fabPitchFamilies["sigil-of-aether"], {
  abilities: () => ({
    atBeginningActionPhaseDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
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
        effect: {
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
    whenLeavesArenaDeal1ArcaneDamageAnyTarget: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "leave-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "deal-damage",
              damageType: "arcane",
              amount: 1,
              target: {
                selector: "object",
                declared: "on-stack",
                player: "any",
                zones: ["hero", "permanent"],
                filter: { hasProperty: "life" },
                count: 1,
              },
            },
            {
              type: "conditional",
              condition: {
                type: "binding-numeric",
                binding: "damage-dealt-this-way",
                comparison: { op: "gt", value: 0 },
              },
              then: {
                type: "amp",
                amount: 1,
              },
            },
          ],
        },
      },
    },
  }),
});

export const { blue: sigilOfAetherBlue } = sigilOfAether.cards;
