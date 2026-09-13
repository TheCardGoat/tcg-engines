import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/luminaris-angel-s-glow.generated.ts";
import { goAgain } from "../shared/keywords.ts";

const yellowCardInPitchZone = {
  type: "zone-count",
  zone: "pitch",
  player: "controller",
  filter: {
    color: ["yellow"],
  },
  comparison: {
    op: "gte",
    value: 1,
  },
} as const;

export const luminarisAngelSGlow = defineCard(
  fabCardIdentitiesByCanonicalId["zcHmW9zd8TRqMMGc8PHmh"],
  {
    abilities: {
      grantGoAgainToFirstHeraldAttack: {
        kind: "static",
        staticKind: "continuous",
        condition: yellowCardInPitchZone,
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "this-attack",
          },
          duration: "while-in-arena",
          appliesTo: {
            ...nextAttackActionLatch({ nameContains: "Herald" }),
            ordinal: 1,
            perTurn: true,
          },
        },
      },
      grantGoAgainToFirstAngelAttack: {
        kind: "static",
        staticKind: "continuous",
        condition: yellowCardInPitchZone,
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "this-attack",
          },
          duration: "while-in-arena",
          appliesTo: {
            next: {
              typeBox: {
                subtypes: ["Angel", "Attack"],
              },
            },
            ordinal: 1,
            perTurn: true,
          },
        },
      },
    },
  },
);
