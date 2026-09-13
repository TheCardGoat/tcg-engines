import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/manifestation-of-miragai.generated.ts";

export const manifestationOfMiragai = definePitchFamily(
  fabPitchFamilies["manifestation-of-miragai"],
  {
    keywords: [
      {
        name: "ward",
        value: {
          type: "x",
        },
      },
    ],
    abilities: () => ({
      entersArenaTwo1CountersIfChiWasPitched: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "replacement",
          replacementKind: "standard",
          replaces: {
            name: "enter-arena",
            subject: "self",
          },
          modification: {
            type: "add-counter",
            counter: {
              kind: "numeric",
              value: 1,
              property: "power",
            },
            count: {
              type: "conditional",
              condition: {
                type: "binding-numeric",
                binding: "pitched-this-way-chi-card",
                comparison: { op: "eq", value: 1 },
              },
              then: 4,
              else: 2,
            },
            target: {
              selector: "self",
            },
          },
          duration: "while-in-arena",
        },
      },
      wardXWhereXIsNumber1Counters: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: {
              name: "ward",
              value: {
                type: "count",
                what: "counters-on-source",
                counter: {
                  kind: "numeric",
                  value: 1,
                  property: "power",
                },
              },
            },
          },
          target: {
            selector: "self",
          },
          duration: "while-in-arena",
        },
      },
    }),
  },
);

export const { blue: manifestationOfMiragaiBlue } = manifestationOfMiragai.cards;
