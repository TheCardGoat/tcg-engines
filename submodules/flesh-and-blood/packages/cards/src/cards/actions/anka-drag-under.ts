import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/anka-drag-under.generated.ts";

import { wateryGrave } from "../shared/keywords.ts";

/** Model notes (hand-authored): the delayed discard hits the opponent who drew, not an attack-target. */
export const ankaDragUnder = definePitchFamily(fabPitchFamilies["anka-drag-under"], {
  keywords: [wateryGrave],
  abilities: () => ({
    actionAttack: {
      kind: "activated",
      abilityType: "attack",
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
        ],
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    instantDiscardWateryGraveNextTimeOpponentDrawsOne: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "tap-self",
          },
          {
            class: "effect",
            type: "discard",
            count: 1,
            filter: {
              hasKeyword: "watery-grave",
            },
          },
        ],
      },
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "draw",
            actor: {
              kind: "player",
              player: "opponent",
            },
            observes: {
              kind: "none",
            },
            during: {
              kind: "phase",
              phase: "action",
            },
            amount: {
              op: "gte",
              value: 1,
            },
          },
        },
        policy: {
          kind: "windowed",
          duration: "until-end-of-action-phase",
          matching: "first",
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "discard",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["hand"],
              count: 1,
            },
          },
        },
      },
    },
  }),
});
export const { yellow: ankaDragUnderYellow } = ankaDragUnder.cards;
