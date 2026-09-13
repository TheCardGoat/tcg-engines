import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const perishingFlorets: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Vwc52lmFvi",
  slug: "perishing-florets",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Vwc52lmFvi:face:default",
      catalogId: "Vwc52lmFvi",
      name: "Perishing Florets",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText:
        "On Enter: Destroy target non-champion object with reserve cost 3 or less or memory cost 0.\n\n[Diao Chan Bonus] At the beginning of your recollection phase, up to one target opponent summons a Flowerbud token.",
      abilities: [
        {
          id: "Vwc52lmFvi-a1",
          kind: "triggered",
          text: "On Enter: Destroy target non-champion object with reserve cost 3 or less or memory cost 0.",
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
                      kind: "not",
                      filter: {
                        kind: "type",
                        oneOf: ["CHAMPION"],
                      },
                    },
                    {
                      kind: "any",
                      filters: [
                        {
                          kind: "numeric",
                          comparison: {
                            left: {
                              kind: "property",
                              subject: {
                                kind: "candidate",
                              },
                              property: "memory-cost",
                              basis: "base",
                            },
                            operator: "lte",
                            right: 0,
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
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "destroy",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            bindResultAs: "destroyed-object",
          },
        },
        {
          id: "Vwc52lmFvi-a2",
          kind: "triggered",
          text: "[Diao Chan Bonus] At the beginning of your recollection phase, up to one target opponent summons a Flowerbud token.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          targets: [
            {
              id: "target-opponent",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["opponent"],
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diao Chan",
              },
            },
          ],
          effect: {
            kind: "summon",
            object: "Flowerbud",
            controller: {
              binding: "target-opponent",
            },
          },
        },
      ],
    },
  },
};

export default perishingFlorets;
