import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const extortionScheme: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "WdkZU2wwnw",
  slug: "extortion-scheme",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "WdkZU2wwnw:face:default",
      catalogId: "WdkZU2wwnw",
      name: "Extortion Scheme",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Suppress up to one target ally an opponent controls. (To suppress an ally, banish it and return it to the field under its owner's control at the beginning of the next end phase.)\n\n[Class Bonus] Put a preparation counter on your champion.",
      abilities: [
        {
          id: "WdkZU2wwnw-a1",
          kind: "card-resolution",
          text: "Suppress up to one target ally an opponent controls. (To suppress an ally, banish it and return it to the field under its owner's control at the beginning of the next end phase.)",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
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
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "keyword-action",
            action: "suppress",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
          },
        },
        {
          id: "WdkZU2wwnw-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Put a preparation counter on your champion.",
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
              kind: "champion",
              player: "controller",
            },
            counter: "preparation",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default extortionScheme;
