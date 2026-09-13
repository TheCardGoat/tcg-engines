import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const stonescaleBand: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "sphwpjsznn",
  slug: "stonescale-band",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "sphwpjsznn:face:default",
      catalogId: "sphwpjsznn",
      name: "Stonescale Band",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ARTIFACT"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText:
        "[Class Bonus] On Enter: Discard up to three ally cards from your hand and/or memory, then draw that many cards.\n\n(2), REST: The next ally card you activate this turn can be activated as though it had fast activation.",
      abilities: [
        {
          id: "sphwpjsznn-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Discard up to three ally cards from your hand and/or memory, then draw that many cards.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
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
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "discard",
                player: "controller",
                selection: {
                  id: "discarded-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 3,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["hand"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                  },
                },
              },
              {
                kind: "draw",
                player: "controller",
                amount: {
                  kind: "modified-ability-result-amount",
                  metric: "cards-moved",
                },
              },
            ],
          },
        },
        {
          id: "sphwpjsznn-a2",
          kind: "activated",
          text: "(2), REST: The next ally card you activate this turn can be activated as though it had fast activation.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          effect: {
            kind: "rule-modification",
            mode: "allow",
            action: "activate-fast",
            filter: {
              kind: "type",
              oneOf: ["ALLY"],
            },
            duration: {
              kind: "for-next-event",
              event: "card-activated",
            },
          },
        },
      ],
    },
  },
};

export default stonescaleBand;
