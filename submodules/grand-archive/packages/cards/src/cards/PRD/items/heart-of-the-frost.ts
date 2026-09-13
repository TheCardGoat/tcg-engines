import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const heartOfTheFrost: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7NlaXYtNM6",
  slug: "heart-of-the-frost",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7NlaXYtNM6:face:default",
      catalogId: "7NlaXYtNM6",
      name: "Heart of the Frost",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "ARTIFACT"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Hindered (This object enters the field rested.)\n\nREST, Banish Heart of the Frost: As a Spell, deal 2 damage to target ally if it's rested. Otherwise, rest it.",
      abilities: [
        {
          id: "7NlaXYtNM6-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This object enters the field rested.)",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "7NlaXYtNM6-a2",
          kind: "activated",
          text: "REST, Banish Heart of the Frost: As a Spell, deal 2 damage to target ally if it's rested. Otherwise, rest it.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "banish-self",
              },
            ],
          },
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
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
              kind: "conditional",
              condition: {
                kind: "object-state",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                state: "rested",
              },
              then: {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "bound",
                  binding: "target-1",
                },
                amount: 2,
              },
              else: {
                kind: "rest",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default heartOfTheFrost;
