import { battleworn, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/refraction-bolters.generated.ts";

export const refractionBolters = defineCard(
  fabCardIdentitiesByCanonicalId["dtg9jMjQFFbmncCBNHjW9"],
  {
    keywords: [battleworn],
    abilities: {
      whenWeaponControlHitsMayDestroyRefractionBoltersIf: {
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
                  types: ["Weapon"],
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
                selector: "binding",
                binding: "it",
              },
              duration: "this-turn",
            },
          },
        },
      },
    },
  },
);
