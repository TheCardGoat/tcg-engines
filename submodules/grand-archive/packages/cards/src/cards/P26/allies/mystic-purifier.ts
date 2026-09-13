import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mysticPurifier: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "s9qtcq0rzh",
  slug: "mystic-purifier",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "s9qtcq0rzh:face:default",
      catalogId: "s9qtcq0rzh",
      name: "Mystic Purifier",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText: "On Enter: You may pay (2). When you do, destroy target phantasia.",
      abilities: [
        {
          id: "s9qtcq0rzh-a1",
          kind: "triggered",
          text: "On Enter: You may pay (2). When you do, destroy target phantasia.",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "reflexive",
              action: {
                kind: "pay",
                player: "controller",
                cost: {
                  kind: "pay-reserve",
                  amount: 2,
                },
              },
              consequence: {
                kind: "destroy",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                bindResultAs: "destroyed-object",
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
                      oneOf: ["PHANTASIA"],
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default mysticPurifier;
