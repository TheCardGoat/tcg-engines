import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bladeOfCreation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "iqs2hipwsc",
  slug: "blade-of-creation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "iqs2hipwsc:face:default",
      catalogId: "iqs2hipwsc",
      name: "Blade of Creation",
      cost: {
        kind: "reserve",
        amount: 7,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["NEOS"],
      stats: {
        power: 4,
      },
      rulesText:
        "[Class Bonus] This card costs 1 less to activate for each token object you control.\n\nCleave (Attack all units a chosen opponent controls. This attack can’t be intercepted.)",
      abilities: [
        {
          id: "iqs2hipwsc-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate for each token object you control.",
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
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "token",
                    value: true,
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "iqs2hipwsc-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Cleave (Attack all units a chosen opponent controls. This attack can’t be intercepted.)",
          keyword: {
            name: "cleave",
          },
        },
      ],
    },
  },
};

export default bladeOfCreation;
