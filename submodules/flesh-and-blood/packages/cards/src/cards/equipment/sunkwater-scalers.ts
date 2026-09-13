import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/sunkwater-scalers.generated.ts";

export const sunkwaterScalers = defineCard(
  fabCardIdentitiesByCanonicalId["kRzbQwnrjfkgzbncc9QQn"],
  {
    keywords: [bladeBreak],
    abilities: {
      whenDefendsPutFaceUpFromArsenalBottomDeck: {
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
            type: "if-you-do",
            effect: {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["arsenal"],
                filter: {
                  hasStatus: "face-up",
                },
                count: 1,
              },
              to: {
                zone: "deck",
                position: "bottom",
              },
            },
            then: {
              type: "sequence",
              steps: [
                {
                  type: "draw",
                  count: 1,
                  player: "controller",
                },
                {
                  type: "modify-numeric",
                  property: "defense",
                  op: "add",
                  amount: 1,
                  target: {
                    selector: "self",
                  },
                  duration: "this-turn",
                },
              ],
            },
          },
        },
      },
    },
  },
);
