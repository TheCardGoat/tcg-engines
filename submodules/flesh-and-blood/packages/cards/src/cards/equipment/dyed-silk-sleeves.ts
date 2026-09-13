import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/dyed-silk-sleeves.generated.ts";

export const dyedSilkSleeves = defineCard(fabCardIdentitiesByCanonicalId["6DFGcBD8MKkJmGmFLwQbc"], {
  keywords: [bladeBreak],
  abilities: {
    attackReactionDestroyDaggerControlSNotActiveChain: {
      kind: "activated",
      abilityType: "attack-reaction",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          {
            class: "effect",
            type: "tap-self",
          },
          {
            class: "effect",
            type: "destroy",
            filter: {
              typeBox: {
                subtypes: ["Dagger"],
              },
              hasStatus: "not-on-active-chain-link",
            },
          },
        ],
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                typeBox: {
                  supertypes: ["Ninja"],
                  types: ["Action"],
                  subtypes: ["Attack"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
            outputBinding: "it",
          },
          {
            type: "delayed-trigger",
            trigger: {
              kind: "event-and-state",
              event: {
                name: "chain-link-resolve",
                actor: {
                  kind: "any",
                },
                // The sleeves are not the attack; watch the buffed attack
                // captured by the +1{p} step's "it" binding.
                observes: {
                  kind: "bound-object",
                  selector: "attack",
                  binding: "it",
                },
              },
              state: {
                type: "has-status",
                status: "didnt-hit",
              },
            },
            policy: {
              kind: "windowed",
              duration: "this-chain-link",
              matching: "first",
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
        ],
      },
    },
  },
});
