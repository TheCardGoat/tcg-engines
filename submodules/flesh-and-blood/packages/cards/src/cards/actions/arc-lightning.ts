import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/arc-lightning.generated.ts";

import { goAgain } from "../shared/keywords.ts";

/** Model notes (hand-authored): delayed this-turn go-again trigger; next Action (not this card) gets go again. */
export const arcLightning = definePitchFamily(fabPitchFamilies["arc-lightning"], {
  keywords: [
    {
      name: "specialization",
      hero: "Aurora",
    },
    goAgain,
  ],
  abilities: () => ({
    wheneverGoAgainTurnDeal1ArcaneDamageAny: {
      kind: "resolution",
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "go-again",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "none",
            },
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-turn",
          matching: "every",
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "deal-damage",
            damageType: "arcane",
            amount: 1,
            target: {
              selector: "object",
              // Chosen each time the delayed layer resolves (not when Arc Lightning is played).
              declared: "at-resolution",
              player: "any",
              zones: ["hero", "permanent"],
              count: 1,
            },
          },
        },
      },
    },
    nextActionPlayTurnGetsGoAgain: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              types: ["Action"],
            },
          },
        },
      },
    },
  }),
});
export const { yellow: arcLightningYellow } = arcLightning.cards;
