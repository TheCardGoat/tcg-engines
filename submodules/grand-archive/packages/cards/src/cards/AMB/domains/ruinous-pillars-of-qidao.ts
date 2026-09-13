import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ruinousPillarsOfQidao: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pmx99jrukm",
  slug: "ruinous-pillars-of-qidao",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pmx99jrukm:face:default",
      catalogId: "pmx99jrukm",
      name: "Ruinous Pillars of Qidao",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["DOMAIN"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPIRE"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText:
        "[Class Bonus] On Enter: Empower 2. Draw a card. (Apply this effect only if your champion's class matches this card's class.)\n\nWhenever your Shifting Currents change from facing West to East, sacrifice Ruinous Pillars of Qidao. When you do, destroy target non-champion object you don't control.",
      abilities: [
        {
          id: "pmx99jrukm-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Empower 2. Draw a card. (Apply this effect only if your champion's class matches this card's class.)",
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
                kind: "keyword-action",
                action: "empower",
                amount: 2,
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
            ],
          },
        },
        {
          id: "pmx99jrukm-a2",
          kind: "triggered",
          text: "Whenever your Shifting Currents change from facing West to East, sacrifice Ruinous Pillars of Qidao. When you do, destroy target non-champion object you don't control.",
          trigger: {
            kind: "event",
            event: {
              name: "player-state-changed",
              actor: "controller",
              state: "shifting-currents",
              directionTransition: {
                from: "west",
                to: "east",
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
                relationship: "controlled-by",
                player: "opponent",
                filter: {
                  kind: "not",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
              },
            },
          ],
          effect: {
            kind: "reflexive",
            action: {
              kind: "sacrifice",
              subject: {
                kind: "source",
              },
            },
            consequence: {
              kind: "destroy",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              bindResultAs: "destroyed-object",
            },
          },
        },
      ],
    },
  },
};

export default ruinousPillarsOfQidao;
