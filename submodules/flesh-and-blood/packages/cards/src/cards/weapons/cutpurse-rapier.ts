import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/cutpurse-rapier.generated.ts";

export const cutpurseRapier = defineCard(fabCardIdentitiesByCanonicalId["6Q8jHk7BG7FzfmcnfBtgN"], {
  abilities: {
    oncePerTurnActionResourceAttack: {
      kind: "activated",
      limit: { count: 1, per: "turn" },
      abilityType: "attack",
      cost: { class: "asset", type: "resources", amount: 1 },
      effect: { type: "attack-with", target: { selector: "self" } },
    },
    stealGoldOnHit: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "attack" },
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
            filter: { typeBox: { metatypes: ["Token"] }, name: "Gold" },
            count: 1,
          },
          controller: "controller",
        },
      },
    },
  },
});
