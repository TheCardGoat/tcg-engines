import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/chain-of-brutality.generated.ts";

import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";

import { goAgain } from "../shared/keywords.ts";

export const chainOfBrutality = definePitchFamily(fabPitchFamilies["chain-of-brutality"], {
  keywords: [goAgain],
  abilities: () => ({
    ifHas6MoreGetsGoAgainWhenHits: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "compare-amount",
        amount: {
          type: "subject-property",
          property: "power",
          basis: "current",
          missing: "zero",
        },
        comparison: { op: "gte", value: 6 },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: goAgain,
            },
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "whenHitsHeroNextAttackActionPlayTurnHas",
                text: "",
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
                    target: {
                      kind: "hero",
                    },
                  },
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "modify-numeric",
                    property: "power",
                    op: "set-base",
                    amount: 6,
                    target: {
                      selector: "this-attack",
                    },
                    duration: "this-turn",
                    appliesTo: nextAttackActionLatch(),
                  },
                },
              },
            },
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
        ],
      },
    },
  }),
});
export const { red: chainOfBrutalityRed } = chainOfBrutality.cards;
