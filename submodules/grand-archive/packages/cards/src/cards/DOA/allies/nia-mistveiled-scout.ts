import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const niaMistveiledScout: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "PZM9uvCFai",
  slug: "nia-mistveiled-scout",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "PZM9uvCFai:face:default",
      catalogId: "PZM9uvCFai",
      name: "Nia, Mistveiled Scout",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Stealth (This unit can't be targeted by attacks unless permitted by true sight.)\n\nOn Enter: Look at target opponent's memory, then choose any card name. \n\nCards with the chosen name cost 1 more to play.",
      abilities: [
        {
          id: "PZM9uvCFai-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Stealth (This unit can't be targeted by attacks unless permitted by true sight.)",
          keyword: {
            name: "stealth",
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
        {
          id: "PZM9uvCFai-a2",
          kind: "triggered",
          text: "On Enter: Look at target opponent's memory, then choose any card name.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "target-opponent",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["opponent"],
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
                  id: "inspected-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "all",
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: {
                      binding: "target-opponent",
                    },
                  },
                },
              },
              {
                kind: "choose-value",
                selection: {
                  id: "chosen-card-name",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "characteristic",
                    characteristic: "card-name",
                  },
                },
                trackAs: "chosen-card-name",
              },
            ],
          },
        },
        {
          id: "PZM9uvCFai-a3",
          kind: "static",
          staticKind: "effects",
          text: "Cards with the chosen name cost 1 more to play.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "play",
              filter: {
                kind: "matches-tracked-characteristic",
                key: "chosen-card-name",
                characteristic: "card-name",
              },
              costOperation: "add",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default niaMistveiledScout;
