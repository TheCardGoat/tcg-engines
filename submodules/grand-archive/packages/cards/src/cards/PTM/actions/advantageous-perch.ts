import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const advantageousPerch: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "oLzsAj9mKl",
  slug: "advantageous-perch",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "oLzsAj9mKl:face:default",
      catalogId: "oLzsAj9mKl",
      name: "Advantageous Perch",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["EXALTED", "WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\nYour champion becomes distant. Then return up to one target Ranger action card from your graveyard to your hand. Banish Advantageous Perch.",
      abilities: [
        {
          id: "oLzsAj9mKl-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "oLzsAj9mKl-a2",
          kind: "card-resolution",
          text: "Your champion becomes distant. Then return up to one target Ranger action card from your graveyard to your hand. Banish Advantageous Perch.",
          targets: [
            {
              id: "target-card",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["graveyard"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ACTION"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "set-object-state",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                state: "distant",
                value: true,
              },
              {
                kind: "sequence",
                effects: [
                  {
                    kind: "move",
                    subject: {
                      kind: "bound",
                      binding: "target-card",
                    },
                    from: "graveyard",
                    destination: {
                      zone: "hand",
                    },
                  },
                  {
                    kind: "banish-object",
                    subject: {
                      kind: "source",
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  },
};

export default advantageousPerch;
