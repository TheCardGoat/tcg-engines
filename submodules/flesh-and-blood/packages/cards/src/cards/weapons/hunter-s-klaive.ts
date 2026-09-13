import { goAgain, piercing } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/hunter-s-klaive.generated.ts";

export const hunterSKlaive = defineCard(fabCardIdentitiesByCanonicalId["QTkWJ8jqCgbMCTcNpmMmC"], {
  keywords: [piercing(1)],
  abilities: {
    oncePerTurnActionResourceResourceAttackGoAgain: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack",
      cost: {
        class: "asset",
        type: "resources",
        amount: 2,
      },
      layerKeywords: [goAgain],
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
      label: {
        name: "mark",
      },
    },
    hitsMark: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
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
          type: "mark",
          target: {
            selector: "attack-target",
          },
        },
      },
      label: {
        name: "mark",
      },
    },
  },
});
