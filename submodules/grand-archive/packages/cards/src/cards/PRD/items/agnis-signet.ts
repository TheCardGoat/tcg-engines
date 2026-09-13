import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const agnisSignet: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "yIozXMrdqr",
  slug: "agnis-signet",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "yIozXMrdqr:face:default",
      catalogId: "yIozXMrdqr",
      name: "Agni's Signet",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "ACCESSORY"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "Hindered (This object enters the field rested.)\n\n(2),  REST, Banish Agni's Signet:  As a Spell, destroy target damaged ally.",
      abilities: [
        {
          id: "yIozXMrdqr-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This object enters the field rested.)",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "yIozXMrdqr-a2",
          kind: "activated",
          text: "(2),  REST, Banish Agni's Signet:  As a Spell, destroy target damaged ally.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "object-state",
                      state: "damaged",
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
              kind: "destroy",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              bindResultAs: "destroyed-object",
            },
          },
        },
      ],
    },
  },
};

export default agnisSignet;
