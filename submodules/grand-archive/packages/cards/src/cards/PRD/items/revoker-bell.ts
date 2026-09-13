import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const revokerBell: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "YGNgrHBAh2",
  slug: "revoker-bell",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "YGNgrHBAh2:face:default",
      catalogId: "YGNgrHBAh2",
      name: "Revoker Bell",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Revoker Bell can't wake up.\n\nREST: Banish target card in a graveyard until Revoker Bell leaves the field.",
      abilities: [
        {
          id: "YGNgrHBAh2-a1",
          kind: "static",
          staticKind: "effects",
          text: "Revoker Bell can't wake up.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "wake",
              subject: {
                kind: "source",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "YGNgrHBAh2-a2",
          kind: "activated",
          text: "REST: Banish target card in a graveyard until Revoker Bell leaves the field.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "target-card",
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
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "banish-object",
                subject: {
                  kind: "bound",
                  binding: "target-card",
                },
                bindResultAs: "banished-object",
              },
              {
                kind: "create-delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "object-left-field",
                    subject: {
                      kind: "source",
                    },
                  },
                },
                limit: 1,
                effect: {
                  kind: "move",
                  subject: {
                    kind: "tracked",
                    key: "banished-object",
                  },
                  from: "banishment",
                  destination: {
                    zone: "graveyard",
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

export default revokerBell;
