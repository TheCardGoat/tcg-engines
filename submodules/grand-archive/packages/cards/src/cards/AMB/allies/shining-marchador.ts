import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shiningMarchador: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lnl94ijbi1",
  slug: "shining-marchador",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lnl94ijbi1:face:default",
      catalogId: "lnl94ijbi1",
      name: "Shining Marchador",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "HORSE"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "On Enter: You may pay (2). When you do, put a buff counter on target ally you control. (Allies get +1 POWER and +1 LIFE for each buff counter on them.)",
      abilities: [
        {
          id: "lnl94ijbi1-a1",
          kind: "triggered",
          text: "On Enter: You may pay (2). When you do, put a buff counter on target ally you control. (Allies get +1 POWER and +1 LIFE for each buff counter on them.)",
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
                kind: "add-counter",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                counter: "buff",
                amount: 1,
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
            },
          },
        },
      ],
    },
  },
};

export default shiningMarchador;
