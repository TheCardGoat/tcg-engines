import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/taylor.generated.ts";

export const taylor = defineCard(fabCardIdentitiesByCanonicalId["PkD89rQPqTmdPjzH6GMhf"], {
  abilities: {
    equipmentAnyClassTalentInventoryEquipmentStartingInventoryMustDifferentName: {
      // Deckbuilding / table policy (not mid-game engine): any class/talent
      // equipment in inventory; each starting inventory equipment different name.
      kind: "static",
      staticKind: "meta",
    },
    startTurnBanishEquipmentEquipSameSubtypeInventory: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
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
          type: "optional",
          effect: {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  types: ["Equipment"],
                },
              },
              count: 1,
            },
            outputBinding: "banished",
          },
          then: {
            type: "equip",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["inventory"],
              filter: {
                sameTypeBoxAs: {
                  binding: "banished",
                  categories: ["subtypes"],
                  comparison: "overlap",
                },
              },
              count: 1,
            },
          },
        },
      },
    },
  },
});
