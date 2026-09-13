import { protect } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/reya-the-unyielding.generated.ts";

export const reyaTheUnyielding = defineCard(
  fabCardIdentitiesByCanonicalId["KnwNm8LC9DNpT8wMzDnFn"],
  {
    abilities: {
      blockEquipment1GreaterDefenseGetProtect: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: protect,
          },
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["hand", "permanent"],
            filter: {
              numeric: [
                {
                  property: "defense",
                  basis: "current",
                  comparison: { op: "gte", value: 1 },
                },
              ],
            },
            count: {
              type: "all",
            },
          },
          duration: "while-in-arena",
        },
      },
      wheneverProtectAnotherCreateGoldToken: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "protect",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "none",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "create-token",
            token: "gold",
            controller: "controller",
          },
        },
      },
    },
  },
);
