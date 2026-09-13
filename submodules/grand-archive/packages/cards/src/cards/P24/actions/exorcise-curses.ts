import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const exorciseCurses: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "u1xhs5jwsl",
  slug: "exorcise-curses",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "u1xhs5jwsl:face:default",
      catalogId: "u1xhs5jwsl",
      name: "Exorcise Curses",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Choose up to two Curse cards from a champion's lineage and discard them.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "u1xhs5jwsl-a1",
          kind: "card-resolution",
          text: "Choose up to two Curse cards from a champion's lineage and discard them.",
          effect: {
            kind: "choose",
            selection: {
              id: "lineage-champion",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
            effect: {
              kind: "choose",
              selection: {
                id: "lineage-cards",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "up-to",
                  amount: 2,
                },
                unique: true,
                candidates: {
                  kind: "card",
                  zones: ["inner-lineage"],
                  host: {
                    kind: "bound",
                    binding: "lineage-champion",
                  },
                  relationship: "lineage-of",
                  filter: {
                    kind: "subtype",
                    oneOf: ["CURSE"],
                  },
                },
              },
              effect: {
                kind: "discard-object",
                subject: {
                  kind: "bound",
                  binding: "lineage-cards",
                },
              },
            },
          },
        },
        {
          id: "u1xhs5jwsl-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default exorciseCurses;
