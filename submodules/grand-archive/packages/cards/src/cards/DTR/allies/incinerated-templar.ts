import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const incineratedTemplar: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "26ya6zaae8",
  slug: "incinerated-templar",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "26ya6zaae8:face:default",
      catalogId: "26ya6zaae8",
      name: "Incinerated Templar",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC", "WARRIOR"],
        subtypes: ["CLERIC", "WARRIOR", "SPECTER"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] On Enter: Put target Specter ally card with reserve cost 3 or less from your graveyard onto the field. It becomes ephemeral. Sacrifice it at the beginning of your next end phase.",
      abilities: [
        {
          id: "26ya6zaae8-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Put target Specter ally card with reserve cost 3 or less from your graveyard onto the field. It becomes ephemeral. Sacrifice it at the beginning of your next end phase.",
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
              id: "target-specter",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["graveyard"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SPECTER"],
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
            kind: "sequence",
            effects: [
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "target-specter",
                },
                from: "graveyard",
                destination: {
                  zone: "field",
                },
              },
              {
                kind: "set-object-state",
                subject: {
                  kind: "bound",
                  binding: "target-specter",
                },
                state: "ephemeral",
                value: true,
              },
              {
                kind: "create-delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "phase-begins",
                    phase: "end",
                    actor: "controller",
                  },
                },
                effect: {
                  kind: "sacrifice",
                  subject: {
                    kind: "bound",
                    binding: "target-specter",
                  },
                },
                limit: 1,
                expires: {
                  kind: "until-end-of-next-phase",
                  phase: "end",
                  whose: "controller",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default incineratedTemplar;
