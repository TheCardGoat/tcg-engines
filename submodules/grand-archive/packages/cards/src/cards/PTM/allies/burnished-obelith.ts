import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const burnishedObelith: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mz1dJZExOk",
  slug: "burnished-obelith",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mz1dJZExOk:face:default",
      catalogId: "mz1dJZExOk",
      name: "Burnished Obelith",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "MEMORITE", "GOLEM"],
      },
      elements: ["WATER"],
      stats: {
        power: 0,
        life: 2,
      },
      rulesText:
        "[Sheen 8+] Taunt\n\n[Merlin Bonus] On Enter: Put two sheen counters on target unit you don't control. If that unit is a champion, the next card its controller activates this turn costs (2) more to activate.",
      abilities: [
        {
          id: "mz1dJZExOk-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Sheen 8+] Taunt",
          keyword: {
            name: "taunt",
          },
          restrictions: [
            {
              kind: "static",
              name: "sheen-restriction",
              condition: {
                kind: "mastery-has-counter",
                mastery: "Fractured Memories",
                counter: {
                  named: "sheen",
                },
                minimum: 8,
              },
            },
          ],
        },
        {
          id: "mz1dJZExOk-a2",
          kind: "triggered",
          text: "[Merlin Bonus] On Enter: Put two sheen counters on target unit you don't control. If that unit is a champion, the next card its controller activates this turn costs (2) more to activate.",
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
                player: "opponent",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "add-counter",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                counter: {
                  named: "sheen",
                },
                amount: 2,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
                then: {
                  kind: "rule-modification",
                  mode: "modify-cost",
                  action: "activate",
                  subject: {
                    kind: "player",
                    player: {
                      controllerOf: "target-1",
                    },
                  },
                  costKind: "reserve",
                  costOperation: "add",
                  amount: 2,
                  occurrence: {
                    count: 1,
                    window: "this-turn",
                    actorScope: "same-player",
                  },
                  duration: {
                    kind: "for-next-event",
                    event: "card-activated",
                    expires: {
                      kind: "this-turn",
                    },
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

export default burnishedObelith;
