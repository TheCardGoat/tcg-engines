import { arcaneBarrier } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/solforge-gauntlet.generated.ts";

export const solforgeGauntlet = defineCard(
  fabCardIdentitiesByCanonicalId["BnN6JDzQwHnC8NTGPnrJB"],
  {
    keywords: [arcaneBarrier(1)],
    abilities: {
      whenCombatChainClosesIfDefendedPutIntoSoul: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event-and-state",
          event: {
            name: "combat-chain-close",
            actor: {
              kind: "none",
            },
            observes: {
              kind: "none",
            },
          },
          state: { type: "moved-this-turn", to: "combat-chain", onlySource: true },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "move-card",
            target: {
              selector: "self",
            },
            to: {
              zone: "soul",
            },
          },
        },
      },
    },
  },
);
