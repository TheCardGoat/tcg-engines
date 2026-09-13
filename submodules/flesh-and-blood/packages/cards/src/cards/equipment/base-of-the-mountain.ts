import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/base-of-the-mountain.generated.ts";

export const baseOfTheMountain = defineCard(
  fabCardIdentitiesByCanonicalId["gBQnWLRkrTJNGGm7dWPBN"],
  {
    keywords: [bladeBreak],
    abilities: {
      whenDefendsBanishAnyNumberActionFromHandThen: {
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
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "banish",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hand"],
                  filter: {
                    typeBox: {
                      types: ["Action"],
                    },
                  },
                  count: {
                    type: "any-number",
                  },
                  upTo: true,
                },
                outputBinding: "them",
              },
              {
                type: "add-defending",
                target: {
                  selector: "binding",
                  binding: "them",
                },
              },
            ],
          },
        },
      },
      sIsEqualNumberActionDefendingActiveChainLink: {
        kind: "static",
        staticKind: "property",
        property: "defense",
        value: {
          type: "count",
          what: "cards-defending",
          per: "chain-link",
          filter: {
            typeBox: {
              types: ["Action"],
            },
          },
        },
      },
    },
  },
);
