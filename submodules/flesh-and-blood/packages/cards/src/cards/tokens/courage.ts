import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/courage.generated.ts";
import { attackActionFilter } from "@tcg/flesh-and-blood-types";

export const courage = defineCard(fabCardIdentitiesByCanonicalId.fQTg89mpRjTDTRmPGkQb6, {
  abilities: {
    empowerPlayedAttack: {
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
            bindAs: "it",
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
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 1,
              target: {
                selector: "binding",
                binding: "it",
              },
              duration: "this-chain-link",
            },
          ],
        },
      },
    },
    empowerWeaponAttack: {
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
            bindAs: "it",
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
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 1,
              target: {
                selector: "binding",
                binding: "it",
              },
              duration: "this-chain-link",
            },
          ],
        },
      },
    },
  },
});
