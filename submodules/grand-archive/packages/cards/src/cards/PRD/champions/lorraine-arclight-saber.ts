import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lorraineArclightSaber: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "x9sSpjpP3G",
  slug: "lorraine-arclight-saber",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "x9sSpjpP3G:face:default",
      catalogId: "x9sSpjpP3G",
      name: "Lorraine, Arclight Saber",
      lineageName: "Lorraine",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["ARCANE"],
      stats: {
        level: 3,
        life: 28,
      },
      rulesText:
        "Lorraine Lineage\n\nOn Enter: Put LV static counters on Lorraine. Then for each of up to seven arcane element cards in your banishment, put another static counter on Lorraine. (Whenever an arcane element unit deals combat damage to an object, you may remove a static counter from this unit and deal 1 damage to the object that was dealt damage.)",
      abilities: [
        {
          id: "x9sSpjpP3G-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Lorraine Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Lorraine",
          },
        },
        {
          id: "x9sSpjpP3G-a2",
          kind: "triggered",
          text: "On Enter: Put LV static counters on Lorraine. Then for each of up to seven arcane element cards in your banishment, put another static counter on Lorraine. (Whenever an arcane element unit deals combat damage to an object, you may remove a static counter from this unit and deal 1 damage to the object that was dealt damage.)",
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
            kind: "sequence",
            effects: [
              {
                kind: "add-counter",
                subject: {
                  kind: "source",
                },
                counter: "static",
                amount: {
                  kind: "property",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  property: "level",
                  basis: "current",
                },
              },
              {
                kind: "choose",
                selection: {
                  id: "selected-arcane-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 7,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["banishment"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "element",
                      oneOf: ["ARCANE"],
                    },
                  },
                },
                effect: {
                  kind: "add-counter",
                  subject: {
                    kind: "source",
                  },
                  counter: "static",
                  amount: {
                    kind: "binding-count",
                    binding: "selected-arcane-cards",
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

export default lorraineArclightSaber;
