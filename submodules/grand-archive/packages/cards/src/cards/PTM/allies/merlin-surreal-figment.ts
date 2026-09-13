import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const merlinSurrealFigment: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "P8RBSywC30",
  slug: "merlin-surreal-figment",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "P8RBSywC30:face:default",
      catalogId: "P8RBSywC30",
      name: "Merlin, Surreal Figment",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DISTORTION", "HUMAN"],
      },
      elements: ["CRUX"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Merlin Bonus] On Attack: Put a sheen counter on target unit.\n\n[Element Bonus] [Sheen 24+] Sacrifice Merlin: Put two sheen counters on target unit. Then wake up your champion.\n",
      abilities: [
        {
          id: "P8RBSywC30-a1",
          kind: "triggered",
          text: "[Merlin Bonus] On Attack: Put a sheen counter on target unit.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
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
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: {
              named: "sheen",
            },
            amount: 1,
          },
        },
        {
          id: "P8RBSywC30-a2",
          kind: "activated",
          text: "[Element Bonus] [Sheen 24+] Sacrifice Merlin: Put two sheen counters on target unit. Then wake up your champion.",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
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
          restrictions: [
            {
              kind: "static",
              name: "element-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "element",
              },
            },
            {
              kind: "static",
              name: "sheen-restriction",
              condition: {
                kind: "mastery-has-counter",
                mastery: "Fractured Memories",
                counter: {
                  named: "sheen",
                },
                minimum: 24,
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "add-counter",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                counter: {
                  named: "sheen",
                },
                amount: 2,
              },
              {
                kind: "wake",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default merlinSurrealFigment;
