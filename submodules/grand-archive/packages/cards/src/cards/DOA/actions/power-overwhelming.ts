import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const powerOverwhelming: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "AnEPyfFfHj",
  slug: "power-overwhelming",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "AnEPyfFfHj:face:default",
      catalogId: "AnEPyfFfHj",
      name: "Power Overwhelming",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["ARCANE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Remove any amount of enlighten counters from your champion. Your champion gets +1 level for each counter removed this way until end of turn.",
      abilities: [
        {
          id: "AnEPyfFfHj-a1",
          kind: "card-resolution",
          text: "Remove any amount of enlighten counters from your champion. Your champion gets +1 level for each counter removed this way until end of turn.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "choose-value",
                selection: {
                  id: "removed-enlighten-count",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "number",
                    minimum: 0,
                    maximum: {
                      kind: "counter-count",
                      subject: {
                        kind: "champion",
                        player: "controller",
                      },
                      counter: "enlighten",
                    },
                  },
                },
                trackAs: "removed-enlighten-count",
              },
              {
                kind: "remove-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "enlighten",
                amount: {
                  kind: "binding",
                  binding: "removed-enlighten-count",
                },
                bindResultAs: "removed-enlighten-counters",
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "champion",
                  player: "controller",
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
                  property: "level",
                  operation: "add",
                  amount: {
                    kind: "modified-ability-result-amount",
                    metric: "counters-removed",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default powerOverwhelming;
