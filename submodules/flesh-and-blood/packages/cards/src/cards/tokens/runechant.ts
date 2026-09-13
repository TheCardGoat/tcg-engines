import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/runechant.generated.ts";
import { attackActionFilter } from "@tcg/flesh-and-blood-types";

export const runechant = defineCard(fabCardIdentitiesByCanonicalId.zfrHQjbPkpBmdQGrWcTMB, {
  abilities: {
    dealArcaneDamageOnPlayedAttack: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "played-card",
            relationship: {
              kind: "any",
            },
            filter: attackActionFilter(),
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "deal-damage",
              damageType: "arcane",
              amount: 1,
              target: {
                selector: "opponent",
              },
            },
          ],
        },
      },
    },
    dealArcaneDamageOnWeaponAttack: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "activate",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "activated-card",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                types: ["Weapon"],
              },
            },
          },
          abilityType: "attack",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "deal-damage",
              damageType: "arcane",
              amount: 1,
              target: {
                selector: "opponent",
              },
            },
          ],
        },
      },
    },
  },
});
