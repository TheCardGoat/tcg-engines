import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const pouvoirAbsolu: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "OylAWd6Tew",
  slug: "pouvoir-absolu",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "OylAWd6Tew:face:default",
      catalogId: "OylAWd6Tew",
      name: "Pouvoir Absolu",
      cost: {
        kind: "reserve",
        amount: 13,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "ULTIMATE", "SPELL"],
      },
      elements: ["UMBRA"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Ciel Bonus] Banish the top ten cards of your deck and put an omen counter on each of them. For the rest of the game, you may activate your omens.",
      abilities: [
        {
          id: "OylAWd6Tew-a1",
          kind: "card-resolution",
          text: "[Ciel Bonus] Banish the top ten cards of your deck and put an omen counter on each of them. For the rest of the game, you may activate your omens.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Ciel",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "banish",
                player: "controller",
                selection: {
                  id: "banished-omens",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 10,
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
                kind: "add-counter",
                subject: {
                  kind: "bound",
                  binding: "banished-omens",
                },
                counter: "omen",
                amount: 1,
              },
              {
                kind: "rule-modification",
                mode: "allow",
                action: "activate",
                subject: {
                  kind: "player",
                  player: "controller",
                },
                fromZone: "banishment",
                filter: {
                  kind: "has-counter",
                  counter: "omen",
                },
                duration: {
                  kind: "permanent",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default pouvoirAbsolu;
