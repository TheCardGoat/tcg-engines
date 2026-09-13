import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/herald-of-ravages.generated.ts";
import { phantasm } from "../shared/keywords.ts";

const abilities = {
  triggeredHitSequenceMoveCardDealDamage: {
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
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "move-card",
            target: {
              selector: "self",
            },
            to: {
              zone: "soul",
            },
          },
          {
            type: "deal-damage",
            damageType: "arcane",
            amount: 1,
            target: {
              selector: "any-hero",
            },
          },
        ],
      },
    },
  },
} as const;

export const heraldOfRavages = definePitchFamily(fabPitchFamilies["herald-of-ravages"], {
  keywords: [phantasm],
  abilities: () => ({ ...abilities }),
});

export const {
  red: heraldOfRavagesRed,
  yellow: heraldOfRavagesYellow,
  blue: heraldOfRavagesBlue,
} = heraldOfRavages.cards;
