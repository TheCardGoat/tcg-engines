import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const vantagePoint: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "U6krXc5283",
  slug: "vantage-point",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "U6krXc5283:face:default",
      catalogId: "U6krXc5283",
      name: "Vantage Point",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Target unit becomes distant. (Units stay distant until the end of their controller’s turn.)\n\n[Class Bonus] Ephemerate — (2) (You may activate this card from your graveyard by paying this cost. Action cards played this way become ephemeral on the effects stack.)",
      abilities: [
        {
          id: "U6krXc5283-a1",
          kind: "card-resolution",
          text: "Target unit becomes distant. (Units stay distant until the end of their controller’s turn.)",
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
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "set-object-state",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            state: "distant",
            value: true,
          },
        },
        {
          id: "U6krXc5283-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Ephemerate — (2) (You may activate this card from your graveyard by paying this cost. Action cards played this way become ephemeral on the effects stack.)",
          keyword: {
            name: "ephemerate",
            cost: {
              kind: "pay-reserve",
              amount: 2,
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
        },
      ],
    },
  },
};

export default vantagePoint;
