import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const kraalStonescaleTyrant: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "572j3oda2h",
  slug: "kraal-stonescale-tyrant",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "572j3oda2h:face:default",
      catalogId: "572j3oda2h",
      name: "Kraal, Stonescale Tyrant",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "DRAGON"],
      },
      elements: ["TERA"],
      stats: {
        power: 6,
        life: 8,
      },
      rulesText:
        "As an additional cost to activate this card, banish two preserved cards from your material deck.\n\nIntercept, Spellshroud, True Sight, Vigor\n\n[Class Bonus] On Attack: Reveal the top two cards of your deck and put them into your material deck preserved. ",
      abilities: [
        {
          id: "572j3oda2h-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, banish two preserved cards from your material deck.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-move",
                player: "controller",
                from: "material-deck",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 2,
                },
                filter: {
                  kind: "object-state",
                  state: "preserved",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "572j3oda2h-a2",
          kind: "keyword-group",
          text: "Intercept, Spellshroud, True Sight, Vigor",
          keywords: [
            {
              name: "intercept",
            },
            {
              name: "spellshroud",
            },
            {
              name: "true-sight",
            },
            {
              name: "vigor",
            },
          ],
        },
        {
          id: "572j3oda2h-a3",
          kind: "triggered",
          text: "[Class Bonus] On Attack: Reveal the top two cards of your deck and put them into your material deck preserved.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
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
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "revealed-top-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 2,
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
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "revealed-top-cards",
                },
                from: "main-deck",
                destination: {
                  zone: "material-deck",
                },
              },
              {
                kind: "set-object-state",
                subject: {
                  kind: "bound",
                  binding: "revealed-top-cards",
                },
                state: "preserved",
                value: true,
              },
            ],
          },
        },
      ],
    },
  },
};

export default kraalStonescaleTyrant;
