import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const illuminatingCharge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6ddfdn8y9f",
  slug: "illuminating-charge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6ddfdn8y9f:face:default",
      catalogId: "6ddfdn8y9f",
      name: "Illuminating Charge",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL"],
      },
      elements: ["LUXEM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Reveal all cards in your memory. You may put up to two Animal cards from among them onto the field.",
      abilities: [
        {
          id: "6ddfdn8y9f-a1",
          kind: "card-resolution",
          text: "Reveal all cards in your memory. You may put up to two Animal cards from among them onto the field.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "revealed-memory",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "all",
                  },
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                },
              },
              {
                kind: "choose",
                selection: {
                  id: "chosen-revealed-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 2,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    binding: "revealed-memory",
                    filter: {
                      kind: "subtype",
                      oneOf: ["ANIMAL"],
                    },
                  },
                },
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "chosen-revealed-cards",
                  },
                  from: "memory",
                  destination: {
                    zone: "field",
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

export default illuminatingCharge;
