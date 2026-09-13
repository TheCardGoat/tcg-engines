import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const goldenMeasurePatisserie: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Bq2kynKJvx",
  slug: "golden-measure-patisserie",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Bq2kynKJvx:face:default",
      catalogId: "Bq2kynKJvx",
      name: "Golden Measure Patisserie",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "KITCHEN", "MARKET"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "On Enter: Put a buff counter on target ally.\n\n(3), REST: Summon a Delicious Pastry token. This ability costs (1) less to activate for each Kitchen item you control.",
      abilities: [
        {
          id: "Bq2kynKJvx-a1",
          kind: "triggered",
          text: "On Enter: Put a buff counter on target ally.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
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
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "buff",
            amount: 1,
          },
        },
        {
          id: "Bq2kynKJvx-a2",
          kind: "activated",
          text: "(3), REST: Summon a Delicious Pastry token. This ability costs (1) less to activate for each Kitchen item you control.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          costModifiers: [
            {
              operation: "subtract",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ITEM"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["KITCHEN"],
                      },
                    ],
                  },
                },
              },
            },
          ],
          effect: {
            kind: "summon",
            object: "Delicious Pastry",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
      ],
    },
  },
};

export default goldenMeasurePatisserie;
