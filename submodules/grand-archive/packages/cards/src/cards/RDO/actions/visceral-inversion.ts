import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const visceralInversion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tZtoAl4ojK",
  slug: "visceral-inversion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "tZtoAl4ojK:face:default",
      catalogId: "tZtoAl4ojK",
      name: "Visceral Inversion",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["UMBRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Target attacking ally gets -5POWER until end of turn. If Visceral Inversion is ephemeral, that ally gets -5LIFE instead.\n\nEphemerate — (3) (You may activate this card from your graveyard by paying this cost. Action cards played this way become ephemeral on the effects stack.)",
      abilities: [
        {
          id: "tZtoAl4ojK-a1",
          kind: "card-resolution",
          text: "Target attacking ally gets -5POWER until end of turn. If Visceral Inversion is ephemeral, that ally gets -5LIFE instead.",
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "object-state",
                      state: "attacking",
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "object-state",
              subject: {
                kind: "source",
              },
              state: "ephemeral",
            },
            then: {
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
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "life",
                operation: "subtract",
                amount: 5,
              },
            },
            else: {
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
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "subtract",
                amount: 5,
              },
            },
          },
        },
        {
          id: "tZtoAl4ojK-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ephemerate — (3) (You may activate this card from your graveyard by paying this cost. Action cards played this way become ephemeral on the effects stack.)",
          keyword: {
            name: "ephemerate",
            cost: {
              kind: "pay-reserve",
              amount: 3,
            },
          },
        },
      ],
    },
  },
};

export default visceralInversion;
