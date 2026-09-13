import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rearingRebound: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dbuoc8sm7z",
  slug: "rearing-rebound",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dbuoc8sm7z:face:default",
      catalogId: "dbuoc8sm7z",
      name: "Rearing Rebound",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Suppress target ally. (To suppress an ally, banish it and return it to the field under its owner's control at the beginning of the next end phase.)\n\nEquestrian — If you control a Horse ally, draw a card into your memory.",
      abilities: [
        {
          id: "dbuoc8sm7z-a1",
          kind: "card-resolution",
          text: "Suppress target ally. (To suppress an ally, banish it and return it to the field under its owner's control at the beginning of the next end phase.)",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
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
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "keyword-action",
            action: "suppress",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
          },
        },
        {
          id: "dbuoc8sm7z-a2",
          kind: "card-resolution",
          text: "Equestrian — If you control a Horse ally, draw a card into your memory.",
          effect: {
            kind: "conditional",
            condition: {
              kind: "collection-exists",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["HORSE"],
                    },
                  ],
                },
              },
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
              to: "memory",
            },
          },
          label: {
            name: "Equestrian",
          },
        },
      ],
    },
  },
};

export default rearingRebound;
