import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfElysianBlood: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Ss991TWKR9",
  slug: "lesser-boon-of-elysian-blood",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Ss991TWKR9:face:default",
      catalogId: "Ss991TWKR9",
      name: "Lesser Boon of Elysian Blood",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        'Class Locked\n\nElysian objects you control have "REST: Empower 1."\n\n(2): Put target Elysian card from your graveyard on top of your deck. This ability costs (1) more to activate for each time you\'ve activated it this game.',
      abilities: [
        {
          id: "Ss991TWKR9-a1",
          kind: "static",
          staticKind: "effects",
          text: "Class Locked",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "play",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "Ss991TWKR9-a2",
          kind: "static",
          staticKind: "effects",
          text: 'Elysian objects you control have "REST: Empower 1."',
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "subtype",
                    oneOf: ["ELYSIAN"],
                  },
                },
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-ability",
                ability: {
                  id: "granted-hs6az3-a1",
                  kind: "activated",
                  text: "REST: Empower 1.",
                  activation: "ability",
                  cost: {
                    kind: "rest",
                    subject: {
                      kind: "source",
                    },
                  },
                  effect: {
                    kind: "keyword-action",
                    action: "empower",
                    amount: 1,
                  },
                },
              },
            },
          ],
        },
        {
          id: "Ss991TWKR9-a3",
          kind: "activated",
          text: "(2): Put target Elysian card from your graveyard on top of your deck. This ability costs (1) more to activate for each time you've activated it this game.",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 2,
          },
          costModifiers: [
            {
              operation: "add",
              amount: {
                kind: "event-total",
                event: {
                  name: "ability-activated",
                  subject: {
                    kind: "source",
                  },
                },
                window: "game",
                metric: "event-count",
              },
            },
          ],
          targets: [
            {
              id: "target-card",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["graveyard"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["ELYSIAN"],
                },
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "bound",
              binding: "target-card",
            },
            from: "graveyard",
            destination: {
              zone: "main-deck",
              placement: {
                kind: "top",
              },
            },
          },
        },
      ],
    },
  },
};

export default lesserBoonOfElysianBlood;
