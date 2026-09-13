import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/companions/sticky-fingers.generated.ts";
import { perched } from "../shared/keywords.ts";

export const stickyFingers = defineCard(fabCardIdentitiesByCanonicalId.mdtMRhRMbMkBRntzQzcbJ, {
  keywords: [perched],
  abilities: {
    attackAndUnequip: {
      kind: "activated",
      abilityType: "attack",
      cost: { class: "effect", type: "tap-self" },
      effect: {
        type: "sequence",
        steps: [
          { type: "attack-with", target: { selector: "self" } },
          {
            type: "conditional",
            condition: { type: "has-status", status: "equipped" },
            then: { type: "move-card", target: { selector: "self" }, to: { zone: "inventory" } },
          },
        ],
      },
      label: { name: "attack" },
    },
    stealGoldOnAttack: {
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
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "steal",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["permanent"],
            filter: {
              typeBox: {
                metatypes: ["Token"],
              },
              name: "Gold",
            },
            count: 1,
          },
          controller: "controller",
        },
      },
      label: { name: "steal" },
    },
  },
});
