import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const nightframeHoundsBike: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "PboHrwPZgP",
  slug: "nightframe-hounds-bike",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "PboHrwPZgP:face:default",
      catalogId: "PboHrwPZgP",
      name: "Nightframe, Hound's Bike",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ITEM"],
        classes: ["ASSASSIN", "WARRIOR"],
        subtypes: ["ASSASSIN", "WARRIOR", "VELTECH", "VEHICLE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Fast Activation, Ally Link\n\nOn Enter: For each activation and trigger targeting linked ally, negate it unless the controller of the activation or trigger pays (3). \n\nWhenever you activate a fast speed action card or a card with fast activation, you may put a buff counter on linked ally if it has two or less buff counters on it.",
      abilities: [
        {
          id: "PboHrwPZgP-a1",
          kind: "keyword-group",
          text: "Fast Activation, Ally Link",
          keywords: [
            {
              name: "fast-activation",
            },
            {
              name: "link",
              target: "ally",
            },
          ],
        },
        {
          id: "PboHrwPZgP-a2",
          kind: "triggered",
          text: "On Enter: For each activation and trigger targeting linked ally, negate it unless the controller of the activation or trigger pays (3).",
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
            kind: "choose",
            selection: {
              id: "targeting-stack-items",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "all",
              },
              unique: true,
              candidates: {
                kind: "stack-item",
                itemTypes: ["ability", "card-activation"],
                abilityKinds: ["activated", "triggered"],
                targeting: {
                  subject: {
                    kind: "linked-object",
                  },
                },
              },
            },
            effect: {
              kind: "for-each",
              collection: {
                binding: "targeting-stack-items",
              },
              bindEachAs: "targeting-stack-item",
              effect: {
                kind: "unless-paid",
                player: {
                  controllerOf: "targeting-stack-item",
                },
                cost: {
                  kind: "pay-reserve",
                  amount: 3,
                },
                otherwise: {
                  kind: "negate",
                  subject: {
                    kind: "bound",
                    binding: "targeting-stack-item",
                  },
                },
              },
            },
          },
        },
        {
          id: "PboHrwPZgP-a3",
          kind: "triggered",
          text: "Whenever you activate a fast speed action card or a card with fast activation, you may put a buff counter on linked ally if it has two or less buff counters on it.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["ACTION"],
                },
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
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
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
        },
      ],
    },
  },
};

export default nightframeHoundsBike;
