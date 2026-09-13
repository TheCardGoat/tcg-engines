import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rigForDetonation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Tx3kHOY6vh",
  slug: "rig-for-detonation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Tx3kHOY6vh:face:default",
      catalogId: "Tx3kHOY6vh",
      name: "Rig for Detonation",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Target unit becomes distant. (Units stay distant until the end of their controller’s turn.)\n\n[Class Bonus] You may sacrifice a VelTech item. If you do, that unit's next attack this turn gets +3POWER.",
      abilities: [
        {
          id: "Tx3kHOY6vh-a1",
          kind: "card-resolution",
          text: "Target unit becomes distant. (Units stay distant until the end of their controller’s turn.)",
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
          effect: {
            kind: "set-object-state",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            state: "distant",
            value: true,
          },
        },
        {
          id: "Tx3kHOY6vh-a2",
          kind: "card-resolution",
          text: "[Class Bonus] You may sacrifice a VelTech item. If you do, that unit's next attack this turn gets +3POWER.",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "choose",
                  selection: {
                    id: "sacrificed-object",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "object",
                      zones: ["field"],
                      relationship: "controlled-by",
                      player: "controller",
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ITEM"],
                          },
                          {
                            kind: "subtype",
                            oneOf: ["VELTECH"],
                          },
                        ],
                      },
                    },
                  },
                  effect: {
                    kind: "sacrifice",
                    subject: {
                      kind: "bound",
                      binding: "sacrificed-object",
                    },
                  },
                },
                {
                  kind: "create-delayed-trigger",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "attack-declared",
                      subject: {
                        kind: "bound-object",
                        binding: "target-1",
                      },
                    },
                  },
                  limit: 1,
                  expires: {
                    kind: "this-turn",
                  },
                  effect: {
                    kind: "continuous",
                    subjects: {
                      kind: "current-attack",
                    },
                    affectedSet: "locked",
                    duration: {
                      kind: "this-attack",
                    },
                    layer: {
                      layer: "E",
                      modifies: "stat",
                      sublayer: "modifier",
                    },
                    change: {
                      kind: "numeric",
                      property: "power",
                      operation: "add",
                      amount: 3,
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default rigForDetonation;
