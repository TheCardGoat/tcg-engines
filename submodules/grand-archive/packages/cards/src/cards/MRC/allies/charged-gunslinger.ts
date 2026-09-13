import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const chargedGunslinger: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "svdv3zb9p4",
  slug: "charged-gunslinger",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "svdv3zb9p4:face:default",
      catalogId: "svdv3zb9p4",
      name: "Charged Gunslinger",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AUTOMATON"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Ranged 2\n\n[Class Bonus] Whenever you sacrifice a Powercell, draw a card, then discard a card. If a fire element card was discarded, Charged Gunslinger becomes distant.",
      abilities: [
        {
          id: "svdv3zb9p4-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 2",
          keyword: {
            name: "ranged",
            value: 2,
          },
        },
        {
          id: "svdv3zb9p4-a2",
          kind: "triggered",
          text: "[Class Bonus] Whenever you sacrifice a Powercell, draw a card, then discard a card. If a fire element card was discarded, Charged Gunslinger becomes distant.",
          trigger: {
            kind: "event",
            event: {
              name: "object-sacrificed",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "subtype",
                  oneOf: ["POWERCELL"],
                },
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
                kind: "draw",
                player: "controller",
                amount: 1,
              },
              {
                kind: "discard",
                player: "controller",
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
                    zones: ["hand"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                },
                bindResultAs: "discarded-card",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "discarded-card",
                  },
                  filter: {
                    kind: "element",
                    oneOf: ["FIRE"],
                  },
                },
                then: {
                  kind: "set-object-state",
                  subject: {
                    kind: "source",
                  },
                  state: "distant",
                  value: true,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default chargedGunslinger;
