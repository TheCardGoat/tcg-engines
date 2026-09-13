import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sighingCrownwing: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "CfU2EmuKwY",
  slug: "sighing-crownwing",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "CfU2EmuKwY:face:default",
      catalogId: "CfU2EmuKwY",
      name: "Sighing Crownwing",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "BIRD"],
      },
      elements: ["EXALTED", "WIND"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\n[Class Bonus] Stealth\n\n[Class Bonus] On Attack: Put a buff counter on target Animal or Beast ally you control without a buff counter on it.",
      abilities: [
        {
          id: "CfU2EmuKwY-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "CfU2EmuKwY-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Stealth",
          keyword: {
            name: "stealth",
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
        },
        {
          id: "CfU2EmuKwY-a3",
          kind: "triggered",
          text: "[Class Bonus] On Attack: Put a buff counter on target Animal or Beast ally you control without a buff counter on it.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "not",
                      filter: {
                        kind: "has-counter",
                        counter: "buff",
                      },
                    },
                    {
                      kind: "any",
                      filters: [
                        {
                          kind: "subtype",
                          oneOf: ["ANIMAL"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["BEAST"],
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
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
      ],
    },
  },
};

export default sighingCrownwing;
