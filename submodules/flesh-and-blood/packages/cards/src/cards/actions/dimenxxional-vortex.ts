import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/actions/dimenxxional-vortex.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const dimenxxionalVortex = defineCard(
  fabCardIdentitiesByCanonicalId["JdCmtgpzCdnNWrD7FB7mp"],
  {
    keywords: [bloodDebt],
    abilities: {
      mayPlayFromBanishedZoneIfDoCostsLess: {
        kind: "static",
        staticKind: "play",
        playEffect: {
          role: "permission",
          fromZones: ["banished"],
          optional: true,
          then: {
            type: "modify-numeric",
            property: "cost",
            op: "subtract",
            amount: 2,
            target: {
              selector: "self",
            },
            duration: "while-condition",
          },
        },
      },
      eachHeroBanishesFromTheirArsenal: {
        kind: "resolution",
        effect: {
          type: "for-each",
          target: {
            selector: "each-hero",
          },
          effect: {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "iteration-subject",
              zones: ["arsenal"],
              count: 1,
            },
          },
        },
      },
    },
  },
);
