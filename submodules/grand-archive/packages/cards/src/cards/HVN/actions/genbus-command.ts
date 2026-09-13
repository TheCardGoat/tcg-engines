import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const genbusCommand: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jjwp945rlb",
  slug: "genbus-command",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "jjwp945rlb:face:default",
      catalogId: "jjwp945rlb",
      name: "Genbu's Command",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Target Beast ally gets +3 LIFE until end of turn. If that ally is a Shenju, recover 6. (To recover, remove that many damage counters from your champion.)",
      abilities: [
        {
          id: "jjwp945rlb-a1",
          kind: "card-resolution",
          text: "Target Beast ally gets +3 LIFE until end of turn. If that ally is a Shenju, recover 6. (To recover, remove that many damage counters from your champion.)",
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
                      kind: "subtype",
                      oneOf: ["BEAST"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-1",
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
                  property: "life",
                  operation: "add",
                  amount: 3,
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  filter: {
                    kind: "subtype",
                    oneOf: ["SHENJU"],
                  },
                },
                then: {
                  kind: "recover",
                  player: "controller",
                  amount: 6,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default genbusCommand;
