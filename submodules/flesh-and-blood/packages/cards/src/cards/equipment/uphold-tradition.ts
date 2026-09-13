import { cloaked, ward } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/uphold-tradition.generated.ts";

/**
 * ENG005 Uphold Tradition — Mystic Illusionist Arms, Cloaked + Ward 1.
 *
 * Printed: Cloaked. Instant - {r}, turn this face-up: Put a +1{p} counter on
 * an aura you control with ward. Ward 1
 *
 * Model notes (hand-authored; ENG003 Truths Retold sibling):
 * - Cloaked seats face-down; turn-face-up cost only legal while face-down.
 * - Instant mixed {r} + turn-face-up self.
 * - Target aura: types:["Aura"] (not subtypes — ENG003 lesson: type-line
 *   filter uses the types path so Aura matches) + hasKeyword ward.
 * - +1{p} counter = numeric counter value 1 property power.
 */
export const upholdTradition = defineCard(fabCardIdentitiesByCanonicalId["dH8jGBhdrCK7gbf9NhtGJ"], {
  keywords: [cloaked, ward(1)],
  abilities: {
    instantTurnFaceUpPut1CounterAuraControl: {
      kind: "activated",
      abilityType: "instant",
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
            type: "turn-face-up",
            target: {
              selector: "self",
            },
          },
        ],
      },
      effect: {
        type: "add-counter",
        counter: {
          kind: "numeric",
          value: 1,
          property: "power",
        },
        count: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["permanent"],
          filter: {
            typeBox: {
              subtypes: ["Aura"],
            },
            hasKeyword: "ward",
          },
          count: 1,
        },
      },
    },
  },
});
