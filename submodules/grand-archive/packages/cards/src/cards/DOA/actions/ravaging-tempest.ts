import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ravagingTempest: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "WsunZX4IlW",
  slug: "ravaging-tempest",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "WsunZX4IlW:face:default",
      catalogId: "WsunZX4IlW",
      name: "Ravaging Tempest",
      cost: {
        kind: "reserve",
        amount: 8,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Efficiency (This card costs LV less to activate. LV refers to your champion's level.)\n\nBanish all allies. For each ally banished this way, its controller draws a card.",
      abilities: [
        {
          id: "WsunZX4IlW-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Efficiency (This card costs LV less to activate. LV refers to your champion's level.)",
          keyword: {
            name: "efficiency",
          },
        },
        {
          id: "WsunZX4IlW-a2",
          kind: "card-resolution",
          text: "Banish all allies. For each ally banished this way, its controller draws a card.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "banish-object",
                subject: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                  },
                },
                bindResultAs: "banished-allies",
              },
              {
                kind: "for-each",
                collection: {
                  binding: "banished-allies",
                },
                bindEachAs: "banished-ally",
                effect: {
                  kind: "draw",
                  player: {
                    controllerOf: "banished-ally",
                  },
                  amount: 1,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default ravagingTempest;
