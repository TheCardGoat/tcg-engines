import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const invokeDominance: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "PLljzdiMmq",
  slug: "invoke-dominance",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "PLljzdiMmq:face:default",
      catalogId: "PLljzdiMmq",
      name: "Invoke Dominance",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SPELL"],
      },
      elements: ["TERA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Preserve (Put this card into its owner's material deck preserved as it resolves. As you materialize, you may instead return a preserved card to your hand.)\n\nYour champion gets +3 level until end of turn. You can't activate non-ally cards this turn.",
      abilities: [
        {
          id: "PLljzdiMmq-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Preserve (Put this card into its owner's material deck preserved as it resolves. As you materialize, you may instead return a preserved card to your hand.)",
          keyword: {
            name: "preserve",
          },
        },
        {
          id: "PLljzdiMmq-a2",
          kind: "card-resolution",
          text: "Your champion gets +3 level until end of turn. You can't activate non-ally cards this turn.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "champion",
                  player: "controller",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "E",
                  modifies: "stat",
                  sublayer: "modifier",
                },
                change: {
                  kind: "numeric",
                  property: "level",
                  operation: "add",
                  amount: 3,
                },
              },
              {
                kind: "rule-modification",
                mode: "forbid",
                action: "activate",
                subject: {
                  kind: "player",
                  player: "controller",
                },
                filter: {
                  kind: "not",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                },
                duration: {
                  kind: "this-turn",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default invokeDominance;
