import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/moment-maker.generated.ts";

export const momentMaker = defineCard(fabCardIdentitiesByCanonicalId["6kFn87DgtCPtJ9J9M6zGL"], {
  abilities: {
    oncePerTurnActionResourceResourceResourceAttack: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack",
      cost: {
        class: "asset",
        type: "resources",
        amount: 3,
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
      label: {
        name: "the-crowd-cheers",
      },
    },
    empowerSuspenseAuraAndCheerOnHit: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "zone-count",
        zone: "permanent",
        player: "controller",
        filter: {
          typeBox: {
            subtypes: ["Aura"],
          },
          hasKeyword: "suspense",
        },
        comparison: {
          op: "gte",
          value: 3,
        },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
        ],
      },
      label: {
        name: "the-crowd-cheers",
      },
    },
    hitsCrowdCheers: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
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
        state: {
          type: "zone-count",
          zone: "permanent",
          player: "controller",
          filter: {
            typeBox: {
              subtypes: ["Aura"],
            },
            hasKeyword: "suspense",
          },
          comparison: {
            op: "gte",
            value: 3,
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "crowd-cheers",
          target: "controller",
        },
      },
      label: {
        name: "the-crowd-cheers",
      },
    },
  },
});
