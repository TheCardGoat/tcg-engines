import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/summit-the-unforgiving.generated.ts";

export const summitTheUnforgiving = defineCard(
  fabCardIdentitiesByCanonicalId["mdKJt7RCqRRrW6PbnJztL"],
  {
    abilities: {
      oncePerTurnActionResourceResourceResourceResourceResourceResourceAttack: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "attack",
        cost: {
          class: "asset",
          type: "resources",
          amount: 6,
        },
        effect: {
          type: "attack-with",
          target: {
            selector: "self",
          },
        },
      },
      hitsCreateFrostbiteTokenExposedHeadChestArmsLegsZone: {
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
            type: "create-token",
            token: "frostbite",
            creator: "effect-controller",
            controller: "attack-target",
            amongExposed: ["equipment-head", "equipment-chest", "equipment-arms", "equipment-legs"],
          },
        },
      },
      onlyEquippedWeaponZonesGets2Power: {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "zone-count",
          zone: "weapon",
          player: "controller",
          comparison: {
            op: "eq",
            value: 1,
          },
        },
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 2,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
        label: {
          name: "heavy",
        },
      },
    },
  },
);
