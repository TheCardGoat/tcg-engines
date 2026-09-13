import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const guoJiaBlessedScion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "59ipqa91r2",
  slug: "guo-jia-blessed-scion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "59ipqa91r2:face:default",
      catalogId: "59ipqa91r2",
      name: "Guo Jia, Blessed Scion",
      lineageName: "Guo Jia",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 2,
        life: 22,
      },
      rulesText:
        "Guo Jia Lineage\n\nOn Enter: You may put two quest counters on Guo Jia. If you don't, draw a card.\n\nLineage Release — Negate target activation or trigger that targets a Fatestone or Fatebound object you control.",
      abilities: [
        {
          id: "59ipqa91r2-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Guo Jia Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Guo Jia",
          },
        },
        {
          id: "59ipqa91r2-a2",
          kind: "triggered",
          text: "On Enter: You may put two quest counters on Guo Jia. If you don't, draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "add-counter",
              subject: {
                kind: "source",
              },
              counter: {
                named: "quest",
              },
              amount: 2,
            },
            otherwise: {
              kind: "draw",
              player: "controller",
              amount: 1,
            },
          },
        },
        {
          id: "59ipqa91r2-a3",
          kind: "activated",
          text: "Lineage Release — Negate target activation or trigger that targets a Fatestone or Fatebound object you control.",
          keyword: {
            name: "lineage-release",
            cost: {
              kind: "banish-self",
            },
          },
          functionalZones: ["inner-lineage"],
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          targets: [
            {
              id: "target-stack-item",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "stack-item",
                itemTypes: ["ability", "card-activation", "materialization"],
                targeting: {
                  player: "controller",
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
            },
          ],
          effect: {
            kind: "negate",
            subject: {
              kind: "bound",
              binding: "target-stack-item",
            },
            bindResultAs: "negated-stack-item",
          },
        },
      ],
    },
  },
};

export default guoJiaBlessedScion;
