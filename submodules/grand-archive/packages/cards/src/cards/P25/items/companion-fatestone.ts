import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const companionFatestone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "izf4wdsbz9",
  slug: "companion-fatestone",
  definitionKind: "card",
  layout: {
    kind: "double-faced",
    defaultFace: {
      id: "izf4wdsbz9:face:default",
      catalogId: "izf4wdsbz9",
      name: "Companion Fatestone",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FATESTONE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "On Enter: Put a buff counter on Companion Fatestone or a Fatebound ally you control.\n\nWhenever a Fatebound ally you control dies, you may transform Companion Fatestone.",
      abilities: [
        {
          id: "izf4wdsbz9-a1",
          kind: "triggered",
          text: "On Enter: Put a buff counter on Companion Fatestone or a Fatebound ally you control.",
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "buff",
            amount: 1,
          },
        },
        {
          id: "izf4wdsbz9-a2",
          kind: "triggered",
          text: "Whenever a Fatebound ally you control dies, you may transform Companion Fatestone.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["FATEBOUND"],
                    },
                  ],
                },
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "transform",
              subject: {
                kind: "source",
              },
            },
          },
        },
      ],
    },
    flipFace: {
      id: "izf4wdsbz9:face:flip",
      catalogId: "vb9xebivoe",
      name: "Fatebound Caracal",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "FATEBOUND", "CAT"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.)\n\nRetort 2 (As long as this ally is retaliating, it gets +2 POWER.)",
      abilities: [
        {
          id: "vb9xebivoe-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.)",
          keyword: {
            name: "intercept",
          },
        },
        {
          id: "vb9xebivoe-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Retort 2 (As long as this ally is retaliating, it gets +2 POWER.)",
          keyword: {
            name: "retort",
            value: 2,
          },
        },
      ],
    },
  },
};

export default companionFatestone;
