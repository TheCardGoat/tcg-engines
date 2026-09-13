import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/placeholders/dragons-of-legend.generated.ts";

export const dragonsOfLegend = defineCard(fabCardIdentitiesByCanonicalId.nFBgGfC6HwTwNFCgmnCRn, {
  abilities: {
    draconaOptimai: {
      kind: "static",
      staticKind: "meta",
    },
    tomeltai: {
      kind: "static",
      staticKind: "meta",
    },
    dominia: {
      kind: "static",
      staticKind: "meta",
    },
    azvolai: {
      kind: "static",
      staticKind: "meta",
    },
    cromai: {
      kind: "static",
      staticKind: "meta",
    },
    kyloria: {
      kind: "static",
      staticKind: "meta",
    },
    miragai: {
      kind: "static",
      staticKind: "meta",
    },
    nekria: {
      kind: "static",
      staticKind: "meta",
    },
    ouvia: {
      kind: "static",
      staticKind: "meta",
    },
    themai: {
      kind: "static",
      staticKind: "meta",
    },
    vynserakai: {
      kind: "static",
      staticKind: "meta",
    },
    yendurai: {
      kind: "static",
      staticKind: "meta",
    },
    invocationProxy: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["hand", "arsenal"],
        optional: true,
      },
    },
  },
});
