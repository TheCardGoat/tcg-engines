import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/sigil-of-permafrost.generated.ts";

export const sigilOfPermafrost = definePitchFamily(fabPitchFamilies["sigil-of-permafrost"], {
  keywords: [fusion("Ice")],
  abilities: () => ({
    createFrostbitesAfterFusedArcaneDamage: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "fused",
      },
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "deal-damage",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "none",
            },
            target: {
              kind: "hero",
            },
            damageType: "arcane",
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-turn",
          matching: "first",
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "create-token",
            token: "frostbite",
            controller: "target-controller",
            count: {
              type: "event-amount",
            },
          },
        },
      },
    },
  }),
});

export const {
  red: sigilOfPermafrostRed,
  yellow: sigilOfPermafrostYellow,
  blue: sigilOfPermafrostBlue,
} = sigilOfPermafrost.cards;
