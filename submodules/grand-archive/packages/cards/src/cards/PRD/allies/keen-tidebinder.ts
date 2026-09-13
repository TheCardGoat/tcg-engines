import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const keenTidebinder: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ZmBQAOb9gj",
  slug: "keen-tidebinder",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ZmBQAOb9gj:face:default",
      catalogId: "ZmBQAOb9gj",
      name: "Keen Tidebinder",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Whenever you empower for the first time each turn, Keen Tidebinder gets +2POWER until end of turn.\n\n[Class Bonus] Floating Memory",
      abilities: [
        {
          id: "ZmBQAOb9gj-a1",
          kind: "triggered",
          text: "[Class Bonus] Whenever you empower for the first time each turn, Keen Tidebinder gets +2POWER until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "keyword-action-performed",
              actor: "controller",
              action: "empower",
              occurrence: {
                count: 1,
                window: "this-turn",
                actorScope: "same-player",
              },
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
          effect: {
            kind: "continuous",
            subjects: {
              kind: "source",
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
              operation: "add",
              amount: 2,
            },
          },
        },
        {
          id: "ZmBQAOb9gj-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory",
          keyword: {
            name: "floating-memory",
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

export default keenTidebinder;
