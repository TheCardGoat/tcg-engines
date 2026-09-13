import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const greenSlime: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zgcxyky280",
  slug: "green-slime",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zgcxyky280:face:default",
      catalogId: "zgcxyky280",
      name: "Green Slime",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "SLIME"],
      },
      elements: ["WIND"],
      stats: {
        power: 0,
        life: 1,
      },
      rulesText:
        "Pride 3 (This ally won't obey you unless your champion is level 3 or higher.)\n\nOn Enter: Put two buff counters on Green Slime.\n\n[Class Bonus] On Leave: Put the buff counters that were on Green Slime on target ally you control.",
      abilities: [
        {
          id: "zgcxyky280-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 3 (This ally won't obey you unless your champion is level 3 or higher.)",
          keyword: {
            name: "pride",
            value: 3,
          },
        },
        {
          id: "zgcxyky280-a2",
          kind: "triggered",
          text: "On Enter: Put two buff counters on Green Slime.",
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
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: "buff",
            amount: 2,
          },
        },
        {
          id: "zgcxyky280-a3",
          kind: "triggered",
          text: "[Class Bonus] On Leave: Put the buff counters that were on Green Slime on target ally you control.",
          trigger: {
            kind: "event",
            event: {
              name: "object-left-field",
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
          effect: {
            kind: "move-counter",
            from: {
              kind: "event-source",
            },
            to: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "buff",
            amount: {
              kind: "all",
            },
          },
        },
      ],
    },
  },
};

export default greenSlime;
