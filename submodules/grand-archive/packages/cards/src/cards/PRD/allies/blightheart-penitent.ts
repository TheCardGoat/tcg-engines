import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blightheartPenitent: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "v2OmQJWXqX",
  slug: "blightheart-penitent",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "v2OmQJWXqX:face:default",
      catalogId: "v2OmQJWXqX",
      name: "Blightheart Penitent",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "REST: If you control an Elysian object, cascade— \n• 1— Prevent the next 2 damage that would be dealt to target unit this turn.\n• 2 and 3— Put a buff counter on target ally.\n(This ability changes each cascade.)",
      abilities: [
        {
          id: "v2OmQJWXqX-a1",
          kind: "activated",
          text: "REST: If you control an Elysian object, cascade—\n• 1— Prevent the next 2 damage that would be dealt to target unit this turn.\n• 2 and 3— Put a buff counter on target ally.\n(This ability changes each cascade.)",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          condition: {
            kind: "controls",
            player: "controller",
            filter: {
              kind: "subtype",
              oneOf: ["ELYSIAN"],
            },
          },
          cascade: {
            kind: "cascade",
            advanceOn: "activation",
            tracking: {
              scope: "source-instance",
              includesCurrent: true,
              advancesIfStackEntryFailsToResolve: true,
            },
            copiedAbility: "repeat-pending-effect-without-advancing",
            modes: [
              {
                id: "cascade-1",
                counts: [1],
                text: "Prevent the next 2 damage that would be dealt to target unit this turn.",
                targets: [
                  {
                    id: "protected-unit",
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
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                    },
                  },
                ],
                effect: {
                  kind: "replacement",
                  event: {
                    name: "damage-dealt",
                    recipient: {
                      kind: "bound-object",
                      binding: "protected-unit",
                    },
                  },
                  operation: {
                    kind: "prevent",
                  },
                  capacity: {
                    amount: 2,
                    scope: "replacement-instance",
                  },
                  duration: {
                    kind: "this-turn",
                  },
                },
              },
              {
                id: "cascade-2-3",
                counts: [2, 3],
                text: "Put a buff counter on target ally.",
                targets: [
                  {
                    id: "buffed-ally",
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
                    binding: "buffed-ally",
                  },
                  counter: "buff",
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

export default blightheartPenitent;
