import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const freezingHail: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "SrBA7h2a1N",
  slug: "freezing-hail",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "SrBA7h2a1N:face:default",
      catalogId: "SrBA7h2a1N",
      name: "Freezing Hail",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deal 2 damage to target unit. That unit doesn't wake up during its controller's next wake up phase. ",
      abilities: [
        {
          id: "SrBA7h2a1N-a1",
          kind: "card-resolution",
          text: "Deal 2 damage to target unit. That unit doesn't wake up during its controller's next wake up phase.",
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
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "bound",
                  binding: "target-1",
                },
                amount: 2,
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
                      kind: "phase",
                      phase: "wake-up",
                    },
                    {
                      kind: "turn-player",
                      player: {
                        controllerOf: "target-1",
                      },
                    },
                  ],
                },
                duration: {
                  kind: "until-end-of-next-phase",
                  phase: "wake-up",
                  whose: {
                    controllerOf: "target-1",
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

export default freezingHail;
