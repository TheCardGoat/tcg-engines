import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/soul-bond-belief.generated.ts";

const abilities = {
  triggeredEffect: {
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
              player: "controller",
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
                color: ["yellow"],
              },
            },
            then: {
              type: "sequence",
              steps: [
                {
                  type: "move-card",
                  target: {
                    selector: "binding",
                    binding: "it",
                  },
                  to: {
                    zone: "soul",
                  },
                },
                {
                  type: "modify-numeric",
                  property: "power",
                  op: "add",
                  amount: 1,
                  target: {
                    selector: "self",
                  },
                  duration: "this-turn",
                },
              ],
            },
          },
        ],
      },
    },
  },
} as const;

export const soulBondBelief = definePitchFamily(fabPitchFamilies["soul-bond-belief"], {
  abilities: () => abilities,
});

export const {
  red: soulBondBeliefRed,
  yellow: soulBondBeliefYellow,
  blue: soulBondBeliefBlue,
} = soulBondBelief.cards;
