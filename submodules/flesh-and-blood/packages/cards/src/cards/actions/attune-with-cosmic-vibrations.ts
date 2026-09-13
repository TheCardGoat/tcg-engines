import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/attune-with-cosmic-vibrations.generated.ts";

export const attuneWithCosmicVibrations = definePitchFamily(
  fabPitchFamilies["attune-with-cosmic-vibrations"],
  {
    abilities: () => ({
      whenAttacksHeroDefendsHeroSAttackRevealTop: {
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
                type: "reveal",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "opponent",
                  zones: ["deck"],
                  position: "top",
                  count: 1,
                },
                outputBinding: "it",
              },
              {
                type: "conditional",
                condition: {
                  type: "binding-matches",
                  binding: "it",
                  filter: {
                    color: ["blue"],
                  },
                },
                then: {
                  type: "sequence",
                  steps: [
                    {
                      type: "modify-numeric",
                      property: "power",
                      op: "add",
                      amount: 3,
                      target: {
                        selector: "self",
                      },
                      duration: "permanent",
                    },
                    {
                      type: "modify-numeric",
                      property: "defense",
                      op: "add",
                      amount: 3,
                      target: {
                        selector: "self",
                      },
                      duration: "permanent",
                    },
                  ],
                },
              },
            ],
          },
        },
      },
      whenAttacksHeroDefendsHeroSAttackRevealTop2: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "defend",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "source",
              selector: "defender",
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
                type: "reveal",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "opponent",
                  zones: ["deck"],
                  position: "top",
                  count: 1,
                },
                outputBinding: "it",
              },
              {
                type: "conditional",
                condition: {
                  type: "binding-matches",
                  binding: "it",
                  filter: {
                    color: ["blue"],
                  },
                },
                then: {
                  type: "sequence",
                  steps: [
                    {
                      type: "modify-numeric",
                      property: "power",
                      op: "add",
                      amount: 3,
                      target: {
                        selector: "self",
                      },
                      duration: "permanent",
                    },
                    {
                      type: "modify-numeric",
                      property: "defense",
                      op: "add",
                      amount: 3,
                      target: {
                        selector: "self",
                      },
                      duration: "permanent",
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    }),
  },
);
export const { blue: attuneWithCosmicVibrationsBlue } = attuneWithCosmicVibrations.cards;
