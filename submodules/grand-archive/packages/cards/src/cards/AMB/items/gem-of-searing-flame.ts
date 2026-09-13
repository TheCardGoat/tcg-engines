import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gemOfSearingFlame: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "v1jaidvvz2",
  slug: "gem-of-searing-flame",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "v1jaidvvz2:face:default",
      catalogId: "v1jaidvvz2",
      name: "Gem of Searing Flame",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "CRYSTAL"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "As a Spell, whenever your Shifting Currents change from facing North to West, deal 2 damage to target champion.",
      abilities: [
        {
          id: "v1jaidvvz2-a1",
          kind: "triggered",
          text: "As a Spell, whenever your Shifting Currents change from facing North to West, deal 2 damage to target champion.",
          resolutionAs: "spell",
          trigger: {
            kind: "event",
            event: {
              name: "player-state-changed",
              actor: "controller",
              state: "shifting-currents",
              directionTransition: {
                from: "north",
                to: "west",
              },
            },
          },
          targets: [
            {
              id: "target-champion",
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
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-champion",
            },
            amount: 2,
          },
        },
      ],
    },
  },
};

export default gemOfSearingFlame;
