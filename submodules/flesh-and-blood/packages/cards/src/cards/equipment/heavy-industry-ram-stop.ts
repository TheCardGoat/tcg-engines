import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/heavy-industry-ram-stop.generated.ts";

export const heavyIndustryRamStop = defineCard(
  fabCardIdentitiesByCanonicalId["WgHWK8qbFHRzWFpH9NCWQ"],
  {
    keywords: [temper],
    abilities: {
      whenDefendsMayPayIfDoGets1Until: {
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
            type: "optional",
            effect: {
              type: "pay",
              cost: {
                class: "asset",
                type: "resources",
                amount: 1,
              },
              payer: "controller",
            },
            then: {
              type: "modify-numeric",
              property: "defense",
              op: "add",
              amount: 1,
              target: {
                selector: "self",
              },
              duration: "this-turn",
            },
          },
        },
      },
    },
  },
);
