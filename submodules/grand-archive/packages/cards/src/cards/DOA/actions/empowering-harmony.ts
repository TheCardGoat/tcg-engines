import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const empoweringHarmony: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Kc5Bktw0yK",
  slug: "empowering-harmony",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Kc5Bktw0yK:face:default",
      catalogId: "Kc5Bktw0yK",
      name: "Empowering Harmony",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL", "HARMONY"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Your champion gets +2 level until end of turn.\n\n[Class Bonus] Harmonize — If you've activated a Melody card this turn, draw a card.",
      abilities: [
        {
          id: "Kc5Bktw0yK-a1",
          kind: "card-resolution",
          text: "Your champion gets +2 level until end of turn.",
          effect: {
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
              amount: 2,
            },
          },
        },
        {
          id: "Kc5Bktw0yK-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Harmonize — If you've activated a Melody card this turn, draw a card.",
          effect: {
            kind: "conditional",
            condition: {
              kind: "history",
              event: "card-activated",
              window: "this-turn",
              actor: "controller",
              filter: {
                kind: "subtype",
                oneOf: ["MELODY"],
              },
              minimum: 1,
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
            },
          },
          label: {
            name: "Harmonize",
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
      ],
    },
  },
};

export default empoweringHarmony;
