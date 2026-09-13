import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { battleworn, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/breeze-rider-boots.generated.ts";

export const breezeRiderBoots = defineCard(
  fabCardIdentitiesByCanonicalId["LQFQqtHDnRNhPQ6GP8z9j"],
  {
    keywords: [battleworn],
    abilities: {
      whenNinjaAttackActionControlHitsMayDestroyBreeze: {
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
              kind: "event-object",
              selector: "attack",
              relationship: {
                kind: "any",
              },
              filter: {
                typeBox: {
                  supertypes: ["Ninja"],
                  types: ["Action"],
                  subtypes: ["Attack"],
                },
              },
              bindAs: "it",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            then: {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: goAgain,
              },
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["combat-chain", "stack"],
                filter: attackActionFilter({ hasLabel: "combo" }),
                count: {
                  type: "all",
                },
              },
              duration: "this-turn",
            },
          },
        },
      },
    },
  },
);
