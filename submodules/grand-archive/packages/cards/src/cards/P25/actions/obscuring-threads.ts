import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const obscuringThreads: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ff8jchay4s",
  slug: "obscuring-threads",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ff8jchay4s:face:default",
      catalogId: "ff8jchay4s",
      name: "Obscuring Threads",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FATEBOUND", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Up to one target Fatestone or Fatebound object gains spellshroud until end of turn. (Objects with spellshroud can't be targeted by Spells.)\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "ff8jchay4s-a1",
          kind: "card-resolution",
          text: "Up to one target Fatestone or Fatebound object gains spellshroud until end of turn. (Objects with spellshroud can't be targeted by Spells.)",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "any",
                  filters: [
                    {
                      kind: "subtype",
                      oneOf: ["FATESTONE"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["FATEBOUND"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "target-1",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-keyword",
              keyword: {
                name: "spellshroud",
              },
            },
          },
        },
        {
          id: "ff8jchay4s-a2",
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

export default obscuringThreads;
