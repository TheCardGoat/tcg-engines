import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spectralHaunting: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Dtr3jPRAFJ",
  slug: "spectral-haunting",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Dtr3jPRAFJ:face:default",
      catalogId: "Dtr3jPRAFJ",
      name: "Spectral Haunting",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPECTER", "SPELL"],
      },
      elements: ["UMBRA"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Alice Bonus] This card costs 4 less to activate if it targets a Specter card.\n\nReturn target ally card from your graveyard to the field. It becomes ephemeral. (If an ephemeral object would leave the field, banish it instead.)",
      abilities: [
        {
          id: "Dtr3jPRAFJ-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Alice Bonus] This card costs 4 less to activate if it targets a Specter card.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Alice",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "ability-target-matches",
                ability: "this",
                filter: {
                  kind: "subtype",
                  oneOf: ["SPECTER"],
                },
                quantifier: "any",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 4,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "Dtr3jPRAFJ-a2",
          kind: "card-resolution",
          text: "Return target ally card from your graveyard to the field. It becomes ephemeral. (If an ephemeral object would leave the field, banish it instead.)",
          targets: [
            {
              id: "target-ally-card",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["graveyard"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "target-ally-card",
                },
                from: "graveyard",
                destination: {
                  zone: "field",
                },
              },
              {
                kind: "set-object-state",
                subject: {
                  kind: "bound",
                  binding: "target-ally-card",
                },
                state: "ephemeral",
                value: true,
              },
            ],
          },
        },
      ],
    },
  },
};

export default spectralHaunting;
