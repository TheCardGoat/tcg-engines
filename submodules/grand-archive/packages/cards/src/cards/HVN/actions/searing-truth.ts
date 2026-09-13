import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const searingTruth: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pfstbz0i63",
  slug: "searing-truth",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pfstbz0i63:face:default",
      catalogId: "pfstbz0i63",
      name: "Searing Truth",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deal 2 damage to target unit.\n\n[Guo Jia Bonus] Put a quest counter on your champion. (Apply this effect only if your champion is Guo Jia.)",
      abilities: [
        {
          id: "pfstbz0i63-a1",
          kind: "card-resolution",
          text: "Deal 2 damage to target unit.",
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
        },
        {
          id: "pfstbz0i63-a2",
          kind: "card-resolution",
          text: "[Guo Jia Bonus] Put a quest counter on your champion. (Apply this effect only if your champion is Guo Jia.)",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: {
              named: "quest",
            },
            amount: 1,
          },
        },
      ],
    },
  },
};

export default searingTruth;
