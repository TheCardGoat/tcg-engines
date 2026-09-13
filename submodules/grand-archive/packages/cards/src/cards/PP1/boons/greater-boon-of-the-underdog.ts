import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const greaterBoonOfTheUnderdog: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nETOkMHYwv",
  slug: "greater-boon-of-the-underdog",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "nETOkMHYwv:face:default",
      catalogId: "nETOkMHYwv",
      name: "Greater Boon of the Underdog",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["GREATER BOON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Level Locked 2\n\nBestow this boon only if your starting main deck had no unique cards.\n\nAs you gain this boon, draw two cards and put two buff counters on an ally you control.",
      abilities: [
        {
          id: "nETOkMHYwv-a1",
          kind: "static",
          staticKind: "effects",
          text: "Level Locked 2",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "play",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "base",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "nETOkMHYwv-a2",
          kind: "static",
          staticKind: "effects",
          text: "Bestow this boon only if your starting main deck had no unique cards.",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "bestow",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "starting-deck-count",
                zone: "main-deck",
                filter: {
                  kind: "supertype",
                  oneOf: ["UNIQUE"],
                },
                operator: "eq",
                value: 0,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "nETOkMHYwv-a3",
          kind: "triggered",
          text: "As you gain this boon, draw two cards and put two buff counters on an ally you control.",
          trigger: {
            kind: "event",
            event: {
              name: "boon-gained",
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
                relationship: "controlled-by",
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
                kind: "draw",
                player: "controller",
                amount: 2,
              },
              {
                kind: "add-counter",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                counter: "buff",
                amount: 2,
              },
            ],
          },
        },
      ],
    },
  },
};

export default greaterBoonOfTheUnderdog;
