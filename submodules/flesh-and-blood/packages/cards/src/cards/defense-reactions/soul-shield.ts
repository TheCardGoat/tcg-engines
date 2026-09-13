import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/soul-shield.generated.ts";

export const soulShield = definePitchFamily(fabPitchFamilies["soul-shield"], {
  abilities: () => ({
    moveToSoulWhenChainCloses: {
      kind: "resolution",
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "combat-chain-close",
            actor: {
              kind: "none",
            },
            observes: {
              kind: "none",
            },
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-combat-chain",
          matching: "first",
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "move-card",
            target: {
              selector: "self",
            },
            to: {
              zone: "soul",
            },
          },
        },
      },
    },
  }),
});

export const { yellow: soulShieldYellow } = soulShield.cards;
