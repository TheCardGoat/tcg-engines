import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const seepIntoTheMind: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7mHiO4YySz",
  slug: "seep-into-the-mind",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7mHiO4YySz:face:default",
      catalogId: "7mHiO4YySz",
      name: "Seep Into the Mind",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "Target opponent puts three sheen counters on a unit they control.\n\n[Merlin Bonus] [Sheen 6+] Look at that opponent's memory and discard a card from it. (Apply this effect only if there are six or more sheen counters on your Fractured Memories.)",
      abilities: [
        {
          id: "7mHiO4YySz-a1",
          kind: "card-resolution",
          text: "Target opponent puts three sheen counters on a unit they control.",
          targets: [
            {
              id: "target-player",
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
            kind: "choose",
            selection: {
              id: "chosen-object",
              kind: "choice",
              declared: "resolution",
              chooser: {
                binding: "target-player",
              },
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: {
                  binding: "target-player",
                },
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
            effect: {
              kind: "add-counter",
              subject: {
                kind: "bound",
                binding: "chosen-object",
              },
              counter: {
                named: "sheen",
              },
              amount: 3,
            },
          },
        },
        {
          id: "7mHiO4YySz-a2",
          kind: "card-resolution",
          text: "[Merlin Bonus] [Sheen 6+] Look at that opponent's memory and discard a card from it. (Apply this effect only if there are six or more sheen counters on your Fractured Memories.)",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
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
                minimum: 6,
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
                  id: "looked-at-memory",
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
                    player: "event-recipient-controller",
                  },
                },
              },
              {
                kind: "choose",
                selection: {
                  id: "discarded-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: "event-recipient-controller",
                  },
                },
                effect: {
                  kind: "discard-object",
                  subject: {
                    kind: "bound",
                    binding: "discarded-card",
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

export default seepIntoTheMind;
