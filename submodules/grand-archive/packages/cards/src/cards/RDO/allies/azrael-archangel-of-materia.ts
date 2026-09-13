import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const azraelArchangelOfMateria: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "eDCnvWoGxf",
  slug: "azrael-archangel-of-materia",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "eDCnvWoGxf:face:default",
      catalogId: "eDCnvWoGxf",
      name: "Azrael, Archangel of Materia",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "ANGEL"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Exia & Neos Imbue 3 (You may reserve all cards revealed as you activate this card. If at least three of them are exia and/or neos element, this card becomes imbued.)\n\nOn Enter: As a Spell, if Azrael is imbued, destroy another target non-regalia non-champion object with reserve cost 3 or less. Its controller summons a Spirit Shard token.",
      abilities: [
        {
          id: "eDCnvWoGxf-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Exia & Neos Imbue 3 (You may reserve all cards revealed as you activate this card. If at least three of them are exia and/or neos element, this card becomes imbued.)",
          keyword: {
            name: "imbue",
            value: 3,
            elementRequirement: {
              oneOf: ["EXIA", "NEOS"],
            },
          },
        },
        {
          id: "eDCnvWoGxf-a2",
          kind: "triggered",
          text: "On Enter: As a Spell, if Azrael is imbued, destroy another target non-regalia non-champion object with reserve cost 3 or less. Its controller summons a Spirit Shard token.",
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
              id: "target-object",
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
                      kind: "not-source",
                    },
                    {
                      kind: "not",
                      filter: {
                        kind: "supertype",
                        oneOf: ["REGALIA"],
                      },
                    },
                    {
                      kind: "not",
                      filter: {
                        kind: "type",
                        oneOf: ["CHAMPION"],
                      },
                    },
                    {
                      kind: "numeric",
                      comparison: {
                        left: {
                          kind: "property",
                          subject: {
                            kind: "candidate",
                          },
                          property: "reserve-cost",
                          basis: "base",
                        },
                        operator: "lte",
                        right: 3,
                      },
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
              kind: "conditional",
              condition: {
                kind: "activation-state",
                state: "imbued",
              },
              then: {
                kind: "reflexive",
                action: {
                  kind: "destroy",
                  subject: {
                    kind: "bound",
                    binding: "target-object",
                  },
                  bindResultAs: "destroyed-object",
                },
                consequence: {
                  kind: "summon",
                  object: "Spirit Shard",
                  controller: {
                    controllerOf: "destroyed-object",
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default azraelArchangelOfMateria;
