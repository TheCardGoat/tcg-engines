import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const buoyantDriftguard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "TrK2lroxkz",
  slug: "buoyant-driftguard",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "TrK2lroxkz:face:default",
      catalogId: "TrK2lroxkz",
      name: "Buoyant Driftguard",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 0,
        life: 4,
      },
      rulesText:
        "Taunt\n\nOn Enter: You may have target opponent gain control of Buoyant Driftguard. If you do, you gain the Crowd's Favor status.",
      abilities: [
        {
          id: "TrK2lroxkz-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Taunt",
          keyword: {
            name: "taunt",
          },
        },
        {
          id: "TrK2lroxkz-a2",
          kind: "triggered",
          text: "On Enter: You may have target opponent gain control of Buoyant Driftguard. If you do, you gain the Crowd's Favor status.",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "change-control",
                  subject: {
                    kind: "source",
                  },
                  controller: {
                    binding: "target-opponent",
                  },
                },
                {
                  kind: "set-player-state",
                  player: "controller",
                  state: {
                    named: "Crowd's Favor",
                  },
                  value: true,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default buoyantDriftguard;
