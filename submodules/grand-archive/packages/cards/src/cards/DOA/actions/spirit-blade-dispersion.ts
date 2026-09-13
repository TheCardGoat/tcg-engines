import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spiritBladeDispersion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7Rsid05Cf6",
  slug: "spirit-blade-dispersion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7Rsid05Cf6:face:default",
      catalogId: "7Rsid05Cf6",
      name: "Spirit Blade: Dispersion",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPELL"],
      },
      elements: ["CRUX"],
      speed: "fast",
      stats: {},
      rulesText:
        "Remove all durability counters from any amount of Sword weapons you control, then banish them. Choose any amount of units and deal damage equal to the amount of durability counters removed this way split among them.",
      abilities: [
        {
          id: "7Rsid05Cf6-a1",
          kind: "card-resolution",
          text: "Remove all durability counters from any amount of Sword weapons you control, then banish them. Choose any amount of units and deal damage equal to the amount of durability counters removed this way split among them.",
          effect: {
            kind: "choose",
            selection: {
              id: "sword-weapons",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "any-number",
              },
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["WEAPON"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SWORD"],
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "bind-value",
              value: {
                kind: "sum-counters",
                collection: {
                  binding: "sword-weapons",
                },
                counter: "durability",
              },
              bindAs: "removed-durability",
              effect: {
                kind: "sequence",
                effects: [
                  {
                    kind: "remove-counter",
                    subject: {
                      kind: "bound",
                      binding: "sword-weapons",
                    },
                    counter: "durability",
                    amount: {
                      kind: "all",
                    },
                  },
                  {
                    kind: "banish-object",
                    subject: {
                      kind: "bound",
                      binding: "sword-weapons",
                    },
                  },
                  {
                    kind: "distribute",
                    amount: {
                      kind: "binding",
                      binding: "removed-durability",
                    },
                    among: {
                      id: "damage-recipients",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "any-number",
                      },
                      unique: true,
                      candidates: {
                        kind: "object",
                        zones: ["field"],
                        filter: {
                          kind: "type",
                          oneOf: ["ALLY", "CHAMPION"],
                        },
                      },
                    },
                    payload: {
                      kind: "damage",
                      source: {
                        kind: "source",
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  },
};

export default spiritBladeDispersion;
