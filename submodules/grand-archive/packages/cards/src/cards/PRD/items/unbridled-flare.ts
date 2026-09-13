import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const unbridledFlare: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "hXERTZPM0w",
  slug: "unbridled-flare",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "hXERTZPM0w:face:default",
      catalogId: "hXERTZPM0w",
      name: "Unbridled Flare",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ARTIFACT"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "REST: As a Spell, deal 1 damage to target champion.\n\nREST, Banish two fire element cards from your graveyard: As a Spell, deal 2 damage to target champion.",
      abilities: [
        {
          id: "hXERTZPM0w-a1",
          kind: "activated",
          text: "REST: As a Spell, deal 1 damage to target champion.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
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
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "target-1",
              },
              amount: 1,
            },
          },
        },
        {
          id: "hXERTZPM0w-a2",
          kind: "activated",
          text: "REST, Banish two fire element cards from your graveyard: As a Spell, deal 2 damage to target champion.",
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
                kind: "select-and-move",
                player: "controller",
                from: "graveyard",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 2,
                },
                filter: {
                  kind: "element",
                  oneOf: ["FIRE"],
                },
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
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
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
          },
        },
      ],
    },
  },
};

export default unbridledFlare;
