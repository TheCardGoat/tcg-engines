import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const catalepticConstellation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lflzwiiewz",
  slug: "cataleptic-constellation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lflzwiiewz:face:default",
      catalogId: "lflzwiiewz",
      name: "Cataleptic Constellation",
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
      elements: ["ASTRA"],
      stats: {},
      rulesText:
        "Imbue 2\n\nOn Enter: Rest target ally. That ally can't wake up for as long as you control Cataleptic Constellation. If Cataleptic Constellation is imbued, summon two Astral Shard tokens.",
      abilities: [
        {
          id: "lflzwiiewz-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Imbue 2",
          keyword: {
            name: "imbue",
            value: 2,
            elementRequirement: "source-elements",
          },
        },
        {
          id: "lflzwiiewz-a2",
          kind: "triggered",
          text: "On Enter: Rest target ally. That ally can't wake up for as long as you control Cataleptic Constellation. If Cataleptic Constellation is imbued, summon two Astral Shard tokens.",
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
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "rest",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
              },
              {
                kind: "rule-modification",
                mode: "forbid",
                action: "wake",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                condition: {
                  kind: "all",
                  conditions: [
                    {
                      kind: "controls-subject",
                      player: "controller",
                      subject: {
                        kind: "source",
                      },
                    },
                  ],
                },
                duration: {
                  kind: "while-source-on-field",
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "activation-state",
                  state: "imbued",
                },
                then: {
                  kind: "summon",
                  object: "Astral Shard",
                  controller: "controller",
                  bindResultAs: "summoned-token",
                  amount: 2,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default catalepticConstellation;
