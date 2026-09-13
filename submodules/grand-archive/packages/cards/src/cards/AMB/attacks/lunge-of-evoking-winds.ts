import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lungeOfEvokingWinds: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "kDCEtGnZZe",
  slug: "lunge-of-evoking-winds",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "kDCEtGnZZe:face:default",
      catalogId: "kDCEtGnZZe",
      name: "Lunge of Evoking Winds",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "POLEARM"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
      },
      rulesText:
        "[Jin Bonus] On Hit: Reveal up to two wind element cards from your memory and return them to your hand. \n\nFloating Memory",
      abilities: [
        {
          id: "kDCEtGnZZe-a1",
          kind: "triggered",
          text: "[Jin Bonus] On Hit: Reveal up to two wind element cards from your memory and return them to your hand.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Jin",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "reveal-selection",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 2,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "element",
                      oneOf: ["WIND"],
                    },
                  },
                },
              },
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "reveal-selection",
                },
                from: "memory",
                destination: {
                  zone: "hand",
                },
              },
            ],
          },
        },
        {
          id: "kDCEtGnZZe-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default lungeOfEvokingWinds;
