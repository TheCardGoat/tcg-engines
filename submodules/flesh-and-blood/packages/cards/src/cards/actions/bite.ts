import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/bite.generated.ts";

import { stealth } from "../shared/keywords.ts";

const abilities = {
  onAttackDealDamageDestroy: {
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
        type: "sequence",
        steps: [
          {
            type: "optional",
            effect: {
              type: "deal-damage",
              damageType: "generic",
              amount: 1,
              target: {
                selector: "attack-target",
              },
              source: {
                selector: "object",
                declared: "on-stack",
                player: "controller",
                zones: ["weapon", "permanent", "combat-chain"],
                filter: {
                  typeBox: {
                    subtypes: ["Dagger"],
                  },
                },
                count: 1,
              },
              outputBinding: "it",
            },
          },
          {
            type: "conditional",
            condition: {
              type: "binding-numeric",
              binding: "damage-dealt-this-way",
              comparison: {
                op: "gt",
                value: 0,
              },
            },
            then: {
              type: "set-status",
              status: "hit",
              target: {
                selector: "binding",
                binding: "it",
              },
            },
          },
          {
            type: "destroy",
            target: {
              selector: "binding",
              binding: "it",
            },
          },
        ],
      },
    },
  },
} as const;

export const bite = definePitchFamily(fabPitchFamilies["bite"], {
  keywords: [stealth],
  abilities: () => ({ ...abilities }),
});

export const { red: biteRed, yellow: biteYellow, blue: biteBlue } = bite.cards;
