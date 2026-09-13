import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const luciaReclaimedBlight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fIQR28QmYg",
  slug: "lucia-reclaimed-blight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fIQR28QmYg:face:default",
      catalogId: "fIQR28QmYg",
      name: "Lucia, Reclaimed Blight",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ELYSIAN", "HUMAN"],
      },
      elements: ["EXALTED", "NORM"],
      stats: {
        power: 0,
        life: 2,
      },
      rulesText:
        "Elysian Aura, Stealth\n\n[Dante Bonus] Your champion's activated abilities cost (2) less to activate.\n\n[Class Bonus] On Enter: Look at the top six cards of your deck. You may reveal a Spell card from among them and put it into your memory. Put the rest on the bottom of your deck in any order.\n\n",
      abilities: [
        {
          id: "fIQR28QmYg-a1",
          kind: "keyword-group",
          text: "Elysian Aura, Stealth",
          keywords: [
            {
              name: "elysian-aura",
            },
            {
              name: "stealth",
            },
          ],
        },
        {
          id: "fIQR28QmYg-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Dante Bonus] Your champion's activated abilities cost (2) less to activate.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Dante",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              activationKind: "ability",
              subject: {
                kind: "champion",
                player: "controller",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "fIQR28QmYg-a3",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Look at the top six cards of your deck. You may reveal a Spell card from among them and put it into your memory. Put the rest on the bottom of your deck in any order.",
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
                kind: "look-at",
                player: "controller",
                selection: {
                  id: "referenced-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 6,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["main-deck"],
                    relationship: "zone-of",
                    player: "controller",
                    fromTop: true,
                  },
                },
              },
              {
                kind: "choose",
                selection: {
                  id: "chosen-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    binding: "referenced-cards",
                    filter: {
                      kind: "subtype",
                      oneOf: ["SPELL"],
                    },
                  },
                },
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "reveal",
                      player: "controller",
                      selection: {
                        id: "revealed-card",
                        kind: "choice",
                        declared: "resolution",
                        chooser: "controller",
                        count: {
                          kind: "all",
                        },
                        unique: true,
                        candidates: {
                          kind: "card",
                          binding: "chosen-card",
                        },
                      },
                    },
                    {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "chosen-card",
                      },
                      destination: {
                        zone: "memory",
                      },
                    },
                  ],
                },
              },
              {
                kind: "choose",
                selection: {
                  id: "ordered-remainder",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "all",
                  },
                  ordered: true,
                  unique: true,
                  candidates: {
                    kind: "card",
                    binding: "referenced-cards",
                    excluding: ["chosen-card"],
                  },
                },
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "ordered-remainder",
                  },
                  destination: {
                    zone: "main-deck",
                    placement: {
                      kind: "bottom",
                    },
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

export default luciaReclaimedBlight;
