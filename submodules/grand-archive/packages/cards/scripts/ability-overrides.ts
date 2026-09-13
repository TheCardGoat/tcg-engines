import type { GrandArchiveAbilityDefinition } from "@tcg/grand-archive-types";

/**
 * Explicit semantic exceptions retained from reviewed executable card definitions.
 * Each entry is keyed by the official Index card UUID and is applied by the compiler.
 */
export const GRAND_ARCHIVE_ABILITY_OVERRIDES: Readonly<
  Record<
    string,
    {
      readonly provenance: string;
      readonly abilities: readonly GrandArchiveAbilityDefinition[];
    }
  >
> = {
  sbierp5k1v: {
    provenance:
      "Reviewed card behavior: Steady Verse discounts only the next Harmony action, not every action.",
    abilities: [
      {
        id: "sbierp5k1v-a1",
        kind: "card-resolution",
        text: "[Class Bonus] The next Harmony action card you activate this turn costs 1 less to activate.",
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
          kind: "rule-modification",
          mode: "modify-cost",
          action: "activate",
          filter: {
            kind: "all",
            filters: [
              {
                kind: "type",
                oneOf: ["ACTION"],
              },
              {
                kind: "subtype",
                oneOf: ["HARMONY"],
              },
            ],
          },
          costKind: "reserve",
          costOperation: "subtract",
          amount: 1,
          duration: {
            kind: "for-next-event",
            event: "card-activated",
          },
        },
      },
      {
        id: "sbierp5k1v-a2",
        kind: "card-resolution",
        text: "Draw a card into your memory.",
        effect: {
          kind: "draw",
          player: "controller",
          amount: 1,
          to: "memory",
        },
      },
    ],
  },
  "29lqrve8fz": {
    provenance:
      "Migrated from the previously maintained generated definition for nico-raptures-embrace.",
    abilities: [
      {
        id: "29lqrve8fz-a1",
        kind: "static",
        staticKind: "effects",
        text: 'Nico can only level up into another "Nico" champion.',
        effects: [
          {
            kind: "rule-modification",
            mode: "require",
            action: "level-up",
            subject: {
              kind: "source",
            },
            destinationFilter: {
              kind: "champion-name",
              value: "Nico",
            },
            duration: {
              kind: "while-source-in-functional-zone",
            },
          },
        ],
      },
      {
        id: "29lqrve8fz-a2",
        kind: "triggered",
        text: "On Enter: If there's another water element card in Nico's lineage, look at the top two cards of your deck. Put one of those cards into your graveyard and the other on the bottom of your deck.",
        trigger: {
          kind: "event",
          event: {
            name: "object-entered-field",
            subject: {
              kind: "source",
            },
          },
        },
        effect: {
          kind: "conditional",
          condition: {
            kind: "collection-exists",
            collection: {
              zones: ["inner-lineage"],
              host: {
                kind: "champion",
                player: "controller",
              },
              relationship: "lineage-of",
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "element",
                    oneOf: ["WATER"],
                  },
                  {
                    kind: "not-source",
                  },
                ],
              },
            },
          },
          then: {
            kind: "sequence",
            effects: [
              {
                kind: "look-at",
                player: "controller",
                selection: {
                  id: "looked-cards",
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
                kind: "choose",
                selection: {
                  id: "graveyard-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    binding: "looked-cards",
                  },
                },
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "graveyard-card",
                      },
                      from: "main-deck",
                      destination: {
                        zone: "graveyard",
                      },
                    },
                    {
                      kind: "move",
                      subject: {
                        kind: "binding-remainder",
                        binding: "looked-cards",
                        excluding: "graveyard-card",
                      },
                      from: "main-deck",
                      destination: {
                        zone: "main-deck",
                        placement: {
                          kind: "bottom",
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    ],
  },
  "8eyeqhc37y": {
    provenance:
      "Migrated from the previously maintained generated definition for polkhawk-boisterous-riot.",
    abilities: [
      {
        id: "8eyeqhc37y-a1",
        kind: "static",
        staticKind: "effects",
        text: 'Polkhawk can only level up into another "Polkhawk" champion.',
        effects: [
          {
            kind: "rule-modification",
            mode: "require",
            action: "level-up",
            subject: {
              kind: "source",
            },
            destinationFilter: {
              kind: "champion-name",
              value: "Polkhawk",
            },
            duration: {
              kind: "while-source-in-functional-zone",
            },
          },
        ],
      },
      {
        id: "8eyeqhc37y-a2",
        kind: "triggered",
        text: "On Enter: If there's another fire element card in Polkhawk's lineage, the next Ranger ally card you activate this turn enters the field distant.",
        trigger: {
          kind: "event",
          event: {
            name: "object-entered-field",
            subject: {
              kind: "source",
            },
          },
        },
        effect: {
          kind: "rule-modification",
          mode: "allow",
          action: "activate",
          subject: {
            kind: "player",
            player: "controller",
          },
          filter: {
            kind: "all",
            filters: [
              {
                kind: "type",
                oneOf: ["ALLY"],
              },
              {
                kind: "subtype",
                oneOf: ["RANGER"],
              },
            ],
          },
          condition: {
            kind: "collection-exists",
            collection: {
              zones: ["inner-lineage"],
              host: {
                kind: "champion",
                player: "controller",
              },
              relationship: "lineage-of",
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "element",
                    oneOf: ["FIRE"],
                  },
                  {
                    kind: "not-source",
                  },
                ],
              },
            },
          },
          occurrence: {
            count: 1,
            window: "this-turn",
            actorScope: "same-player",
          },
          activationResult: {
            entryState: {
              state: "distant",
              value: true,
            },
          },
          duration: {
            kind: "for-next-event",
            event: "card-activated",
            expires: {
              kind: "this-turn",
            },
          },
        },
      },
    ],
  },
  x8bd7ozuj6: {
    provenance:
      "Migrated from the previously maintained generated definition for vanitas-obliviate-schemer.",
    abilities: [
      {
        id: "x8bd7ozuj6-a1",
        kind: "static",
        staticKind: "effects",
        text: 'Vanitas can only level up into another "Vanitas" champion.',
        effects: [
          {
            kind: "rule-modification",
            mode: "require",
            action: "level-up",
            subject: {
              kind: "source",
            },
            destinationFilter: {
              kind: "champion-name",
              value: "Vanitas",
            },
            duration: {
              kind: "while-source-in-functional-zone",
            },
          },
        ],
      },
      {
        id: "x8bd7ozuj6-a2",
        kind: "triggered",
        text: "On Enter: If there's another wind element card in Vanitas' lineage, glimpse 4.",
        trigger: {
          kind: "event",
          event: {
            name: "object-entered-field",
            subject: {
              kind: "source",
            },
          },
        },
        effect: {
          kind: "conditional",
          condition: {
            kind: "collection-exists",
            collection: {
              zones: ["inner-lineage"],
              host: {
                kind: "champion",
                player: "controller",
              },
              relationship: "lineage-of",
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "element",
                    oneOf: ["WIND"],
                  },
                  {
                    kind: "not-source",
                  },
                ],
              },
            },
          },
          then: {
            kind: "keyword-action",
            action: "glimpse",
            amount: 4,
          },
        },
      },
    ],
  },
  ii17fzcyfr: {
    provenance: "Migrated from the previously maintained generated definition for anathemas-end.",
    abilities: [
      {
        id: "ii17fzcyfr-a1",
        kind: "activated",
        text: "REST: Load Anathema's End into target unloaded Gun weapon you control.",
        activation: "ability",
        cost: {
          kind: "rest",
          subject: {
            kind: "source",
          },
        },
        targets: [
          {
            id: "target-weapon",
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
              player: "controller",
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "type",
                    oneOf: ["WEAPON"],
                  },
                  { kind: "subtype", oneOf: ["GUN"] },
                  {
                    kind: "not",
                    filter: {
                      kind: "object-state",
                      state: "loaded",
                    },
                  },
                ],
              },
            },
          },
        ],
        effect: {
          kind: "move",
          subject: {
            kind: "source",
          },
          destination: {
            zone: "loaded",
            host: {
              kind: "bound",
              binding: "target-weapon",
            },
          },
        },
      },
      {
        id: "ii17fzcyfr-a2",
        kind: "triggered",
        text: "[Class Bonus] On Champion Hit: Banish all Curse cards in the hit champion's lineage. For each card banished this way, deal 2 unpreventable damage to that champion.",
        trigger: {
          kind: "event",
          event: {
            name: "attack-hit",
            subject: {
              kind: "source",
            },
            recipient: {
              kind: "event-object",
              bindAs: "trigger-recipient",
              filter: {
                kind: "type",
                oneOf: ["CHAMPION"],
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
          kind: "choose",
          selection: {
            id: "banished-curses",
            kind: "choice",
            declared: "resolution",
            chooser: "controller",
            count: {
              kind: "all",
            },
            unique: true,
            candidates: {
              kind: "card",
              zones: ["inner-lineage"],
              host: {
                kind: "event-recipient",
              },
              relationship: "lineage-of",
              filter: {
                kind: "subtype",
                oneOf: ["CURSE"],
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "banished-curses",
                },
                from: "inner-lineage",
                destination: {
                  zone: "banishment",
                },
                bindResultAs: "banished-curse-count",
              },
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "event-recipient",
                },
                amount: {
                  kind: "calculate",
                  operator: "multiply",
                  operands: [
                    {
                      kind: "binding-count",
                      binding: "banished-curse-count",
                    },
                    2,
                  ],
                },
                preventable: false,
              },
            ],
          },
        },
      },
    ],
  },
  l8ao8bls6g: {
    provenance:
      "Migrated from the previously maintained generated definition for convalescent-tonic.",
    abilities: [
      {
        id: "l8ao8bls6g-a1",
        kind: "static",
        staticKind: "intrinsic",
        text: "Brew — One Fraysia (You may sacrifice the listed objects rather than pay this card's reserve cost.)",
        keyword: {
          name: "brew",
          requirements: [
            {
              kind: "name",
              value: "Fraysia",
              count: 1,
            },
          ],
        },
      },
      {
        id: "l8ao8bls6g-a2",
        kind: "activated",
        text: "Sacrifice Convalescent Tonic: Put up to two cards from your hand on the bottom of your deck then draw that many cards. Recover 3.",
        activation: "ability",
        cost: {
          kind: "sacrifice",
          subject: {
            kind: "source",
          },
        },
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "choose",
              selection: {
                id: "moved-cards",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "up-to",
                  amount: 2,
                },
                candidates: {
                  kind: "card",
                  zones: ["hand"],
                  relationship: "zone-of",
                  player: "controller",
                },
              },
              effect: {
                kind: "sequence",
                effects: [
                  {
                    kind: "move",
                    subject: {
                      kind: "bound",
                      binding: "moved-cards",
                    },
                    from: "hand",
                    destination: {
                      zone: "main-deck",
                      placement: {
                        kind: "bottom",
                        orderChosenBy: "controller",
                      },
                    },
                    bindResultAs: "moved-card-count",
                  },
                  {
                    kind: "draw",
                    player: "controller",
                    amount: {
                      kind: "binding-count",
                      binding: "moved-card-count",
                    },
                  },
                ],
              },
            },
            {
              kind: "recover",
              player: "controller",
              amount: 3,
            },
          ],
        },
      },
    ],
  },
  tjot4nmxqs: {
    provenance:
      "Migrated from the previously maintained generated definition for wildgrowth-elixir.",
    abilities: [
      {
        id: "tjot4nmxqs-a1",
        kind: "static",
        staticKind: "intrinsic",
        text: "Brew — Two Herbs",
        keyword: {
          name: "brew",
          requirements: [
            {
              kind: "subtype",
              value: "Herb",
              count: 2,
            },
          ],
        },
      },
      {
        id: "tjot4nmxqs-a2",
        kind: "triggered",
        text: "At the beginning of your recollection phase, put an age counter on Wildgrowth Elixir.",
        trigger: {
          kind: "event",
          event: {
            name: "phase-begins",
            phase: "recollection",
            actor: "controller",
          },
        },
        effect: {
          kind: "add-counter",
          subject: {
            kind: "source",
          },
          counter: {
            named: "age",
          },
          amount: 1,
        },
      },
      {
        id: "tjot4nmxqs-a3",
        kind: "activated",
        text: "Sacrifice Wildgrowth Elixir: Put X buff counters on target ally, where X is the amount of age counters on Wildgrowth Elixir.",
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
                oneOf: ["ALLY"],
              },
            },
          },
        ],
        variables: [
          {
            symbol: "X",
            kind: "derived",
            amount: {
              kind: "counter-count",
              subject: {
                kind: "source",
              },
              counter: {
                named: "age",
              },
              basis: "last-known",
              missing: "zero",
            },
          },
        ],
        effect: {
          kind: "add-counter",
          subject: {
            kind: "bound",
            binding: "target-1",
          },
          counter: "buff",
          amount: {
            kind: "variable",
            symbol: "X",
          },
        },
      },
    ],
  },
  vmqe225jkb: {
    provenance: "Migrated from the previously maintained generated definition for intervention.",
    abilities: [
      {
        id: "vmqe225jkb-a1",
        kind: "static",
        staticKind: "effects",
        text: "[Class Bonus] While paying for this card's reserve cost, you may rest your champion to pay for 2 of that cost. (Apply this effect only if your champion's class matches this card's class)",
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
        effects: [
          {
            kind: "rule-modification",
            mode: "payment-contribution",
            action: "pay-cost",
            subject: {
              kind: "source",
            },
            costKind: "reserve",
            cost: {
              kind: "rest",
              subject: {
                kind: "champion",
                player: "controller",
              },
            },
            amount: 2,
            contributionBasis: "total",
            duration: {
              kind: "while-source-in-functional-zone",
            },
          },
        ],
      },
      {
        id: "vmqe225jkb-a2",
        kind: "card-resolution",
        text: "Prevent the next 4 damage that would be dealt to target unit this turn.",
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
          kind: "replacement",
          event: {
            name: "damage-dealt",
            recipient: {
              kind: "bound-object",
              binding: "target-1",
            },
          },
          operation: {
            kind: "prevent",
          },
          capacity: {
            amount: 4,
            scope: "replacement-instance",
          },
          duration: {
            kind: "this-turn",
          },
        },
      },
    ],
  },
  by8145w2u2: {
    provenance: "Migrated from the previously maintained generated definition for imperial-seal.",
    abilities: [
      {
        id: "by8145w2u2-a1",
        kind: "static",
        staticKind: "intrinsic",
        text: "Divine Relic (You can only have one card with this keyword in your material deck.)",
        keyword: {
          name: "divine-relic",
        },
      },
      {
        id: "by8145w2u2-a2",
        kind: "activated",
        text: "Banish Imperial Seal: All basic elements are enabled for you until end of turn. (Fire, water, and wind are basic elements.)",
        activation: "ability",
        cost: {
          kind: "banish-self",
        },
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "set-player-state",
              player: "controller",
              state: {
                named: "enabled-element",
                value: "FIRE",
              },
              value: true,
              duration: {
                kind: "this-turn",
              },
            },
            {
              kind: "set-player-state",
              player: "controller",
              state: {
                named: "enabled-element",
                value: "WATER",
              },
              value: true,
              duration: {
                kind: "this-turn",
              },
            },
            {
              kind: "set-player-state",
              player: "controller",
              state: {
                named: "enabled-element",
                value: "WIND",
              },
              value: true,
              duration: {
                kind: "this-turn",
              },
            },
          ],
        },
      },
    ],
  },
  qyRKqSkAQX: {
    provenance: "Migrated from the previously maintained generated definition for freeze-stiff.",
    abilities: [
      {
        id: "qyRKqSkAQX-a1",
        kind: "card-resolution",
        text: "Rest up to two target allies. If either of those allies are attacking, negate their attacks and end the combat phase. Class Bonus: Those allies don't wake up during their controller's next wake up phase. (Apply the additional effect only if your champion's class matches this card's class.)",
        targets: [
          {
            id: "target-allies",
            kind: "target",
            declared: "announcement",
            chooser: "controller",
            count: {
              kind: "up-to",
              amount: 2,
            },
            unique: true,
            candidates: {
              kind: "object",
              zones: ["field"],
              filter: {
                kind: "type",
                oneOf: ["ALLY"],
              },
            },
          },
        ],
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "rest",
              subject: {
                kind: "bound",
                binding: "target-allies",
              },
            },
            {
              kind: "conditional",
              condition: {
                kind: "collection-exists",
                collection: {
                  binding: "target-allies",
                  filter: {
                    kind: "object-state",
                    state: "attacking",
                  },
                },
              },
              then: {
                kind: "sequence",
                effects: [
                  {
                    kind: "negate",
                    subject: {
                      kind: "attacks-by",
                      attacker: {
                        kind: "bound",
                        binding: "target-allies",
                      },
                    },
                  },
                  {
                    kind: "end-phase",
                    phase: "combat",
                  },
                ],
              },
            },
            {
              kind: "conditional",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
              then: {
                kind: "for-each",
                collection: {
                  binding: "target-allies",
                },
                bindEachAs: "frozen-ally",
                effect: {
                  kind: "rule-modification",
                  mode: "forbid",
                  action: "wake",
                  subject: {
                    kind: "bound",
                    binding: "frozen-ally",
                  },
                  duration: {
                    kind: "until-end-of-next-phase",
                    phase: "wake-up",
                    whose: {
                      controllerOf: "frozen-ally",
                    },
                  },
                },
              },
            },
          ],
        },
      },
    ],
  },
  hw8dxKAnMX: {
    provenance: "Migrated from the previously maintained generated definition for mist-resonance.",
    abilities: [
      {
        id: "hw8dxKAnMX-a1",
        kind: "card-resolution",
        text: "Allies you control get +1 LIFE until end of turn.",
        effect: {
          kind: "continuous",
          subjects: {
            kind: "each",
            collection: {
              zones: ["field"],
              player: "controller",
              filter: {
                kind: "type",
                oneOf: ["ALLY"],
              },
            },
          },
          affectedSet: "locked",
          duration: {
            kind: "this-turn",
          },
          layer: {
            layer: "E",
            modifies: "stat",
            sublayer: "modifier",
          },
          change: {
            kind: "numeric",
            property: "life",
            operation: "add",
            amount: 1,
          },
        },
      },
      {
        id: "hw8dxKAnMX-a2",
        kind: "card-resolution",
        text: "[Class Bonus] Harmonize — If you've activated a Melody card this turn, allies you control assign damage with their life stat instead of power stat until end of turn.",
        effect: {
          kind: "conditional",
          condition: {
            kind: "history",
            event: "card-activated",
            window: "this-turn",
            actor: "controller",
            filter: {
              kind: "subtype",
              oneOf: ["MELODY"],
            },
            minimum: 1,
          },
          then: {
            kind: "rule-modification",
            mode: "use-property",
            action: "assign-combat-damage",
            affectedSet: "locked",
            subject: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
            valueProperty: "life",
            duration: {
              kind: "this-turn",
            },
          },
        },
        label: {
          name: "Harmonize",
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
    ],
  },
  "1BkfdFqCrG": {
    provenance:
      "Migrated from the previously maintained generated definition for revitalizing-cleanse.",
    abilities: [
      {
        id: "1BkfdFqCrG-a1",
        kind: "card-resolution",
        text: "Reveal all cards in your memory. Recover X where X is the amount of water element cards revealed this way. Draw a card. (To recover, remove that many damage counters from your champion.)",
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "reveal",
              player: "controller",
              selection: {
                id: "revealed-memory",
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
                  player: "controller",
                },
              },
            },
            {
              kind: "recover",
              player: "controller",
              amount: {
                kind: "count",
                collection: {
                  binding: "revealed-memory",
                  filter: {
                    kind: "element",
                    oneOf: ["WATER"],
                  },
                },
              },
            },
            {
              kind: "draw",
              player: "controller",
              amount: 1,
            },
          ],
        },
      },
    ],
  },
  R9UFbI4Fsh: {
    provenance:
      "Migrated from the previously maintained generated definition for camelot-impenetrable.",
    abilities: [
      {
        id: "R9UFbI4Fsh-a1",
        kind: "triggered",
        text: "Upkeep — Whenever you materialize a card, sacrifice Camelot.",
        trigger: {
          kind: "event",
          event: {
            name: "card-materialized",
            actor: "controller",
            subject: {
              kind: "event-object",
            },
          },
        },
        effect: {
          kind: "sacrifice",
          subject: {
            kind: "source",
          },
        },
        label: {
          name: "Upkeep",
        },
      },
      {
        id: "R9UFbI4Fsh-a2",
        kind: "triggered",
        text: "Whenever you activate a wind element card, you may negate its activation. If you do, choose an ally and suppress it.",
        trigger: {
          kind: "event",
          event: {
            name: "card-activated",
            actor: "controller",
            subject: {
              kind: "event-object",
              filter: {
                kind: "element",
                oneOf: ["WIND"],
              },
            },
          },
        },
        effect: {
          kind: "optional",
          player: "controller",
          allOrNothing: true,
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "negate",
                subject: {
                  kind: "event-subject",
                },
              },
              {
                kind: "choose",
                selection: {
                  id: "chosen-ally",
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
                    relationship: "zone-of",
                    player: "each-player",
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                  },
                },
                effect: {
                  kind: "keyword-action",
                  action: "suppress",
                  subject: {
                    kind: "bound",
                    binding: "chosen-ally",
                  },
                },
              },
            ],
          },
        },
      },
    ],
  },
  BY0E8si926: {
    provenance: "Migrated from the previously maintained generated definition for orb-of-regret.",
    abilities: [
      {
        id: "BY0E8si926-a1",
        kind: "activated",
        text: "Banish Orb of Regret: Shuffle up to three cards from your hand into your deck, then draw that many cards.",
        activation: "ability",
        cost: {
          kind: "banish-self",
        },
        effect: {
          kind: "choose",
          selection: {
            id: "shuffled-cards",
            kind: "choice",
            declared: "resolution",
            chooser: "controller",
            count: {
              kind: "up-to",
              amount: 3,
            },
            candidates: {
              kind: "card",
              zones: ["hand"],
              relationship: "zone-of",
              player: "controller",
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "shuffled-cards",
                },
                from: "hand",
                destination: {
                  zone: "main-deck",
                  placement: {
                    kind: "unordered",
                  },
                },
                bindResultAs: "shuffled-card-count",
              },
              {
                kind: "shuffle",
                player: "controller",
                zone: "main-deck",
              },
              {
                kind: "draw",
                player: "controller",
                amount: {
                  kind: "binding-count",
                  binding: "shuffled-card-count",
                },
              },
            ],
          },
        },
      },
    ],
  },
  FxYwR2azTt: {
    provenance: "Migrated from the previously maintained generated definition for prismatic-edge.",
    abilities: [
      {
        id: "FxYwR2azTt-a1",
        kind: "triggered",
        text: "[Class Bonus] On Enter: Each player reveals all cards in their memory. If a fire element card was revealed, choose a unit and deal 3 damage to it. If a water element card was revealed, draw a card. If a wind element card was revealed, each opponent banishes a card at random from their memory.",
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
              kind: "reveal",
              player: "controller",
              selection: {
                id: "revealed-memory-cards",
                kind: "choice",
                declared: "resolution",
                chooser: "each-player",
                count: {
                  kind: "all",
                },
                unique: true,
                candidates: {
                  kind: "card",
                  zones: ["memory"],
                  relationship: "zone-of",
                  player: "each-player",
                },
              },
            },
            {
              kind: "conditional",
              condition: {
                kind: "collection-exists",
                collection: {
                  binding: "revealed-memory-cards",
                  filter: {
                    kind: "element",
                    oneOf: ["FIRE"],
                  },
                },
              },
              then: {
                kind: "choose",
                selection: {
                  id: "chosen-unit",
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
                    relationship: "zone-of",
                    player: "each-player",
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                  },
                },
                effect: {
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "bound",
                    binding: "chosen-unit",
                  },
                  amount: 3,
                },
              },
            },
            {
              kind: "conditional",
              condition: {
                kind: "collection-exists",
                collection: {
                  binding: "revealed-memory-cards",
                  filter: {
                    kind: "element",
                    oneOf: ["WATER"],
                  },
                },
              },
              then: {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
            },
            {
              kind: "conditional",
              condition: {
                kind: "collection-exists",
                collection: {
                  binding: "revealed-memory-cards",
                  filter: {
                    kind: "element",
                    oneOf: ["WIND"],
                  },
                },
              },
              then: {
                kind: "banish",
                player: "each-opponent",
                selection: {
                  id: "random-opponent-memory-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "each-opponent",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  unique: true,
                  method: "random",
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: "each-opponent",
                  },
                },
              },
            },
          ],
        },
      },
    ],
  },
  wiztyu6o24: {
    provenance:
      "Migrated from the previously maintained generated definition for diana-judgments-arrow.",
    abilities: [
      {
        id: "wiztyu6o24-a1",
        kind: "static",
        staticKind: "intrinsic",
        text: "Diana Lineage",
        keyword: {
          name: "lineage",
          lineageName: "Diana",
        },
      },
      {
        id: "wiztyu6o24-a2",
        kind: "triggered",
        text: "On Enter: Load up to two Aethercharge cards from your hand and/or memory into an Aetherwing weapon you control. For each card loaded this way, draw a card into your memory.",
        trigger: {
          kind: "event",
          event: {
            name: "object-entered-field",
            subject: {
              kind: "source",
            },
          },
        },
        effect: {
          kind: "choose",
          selection: {
            id: "loaded-aethercharge-cards",
            kind: "choice",
            declared: "resolution",
            chooser: "controller",
            count: {
              kind: "up-to",
              amount: 2,
            },
            unique: true,
            candidates: {
              kind: "card",
              zones: ["hand", "memory"],
              relationship: "zone-of",
              player: "controller",
              filter: {
                kind: "subtype",
                oneOf: ["AETHERCHARGE"],
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "collection-exists",
              collection: {
                binding: "loaded-aethercharge-cards",
              },
            },
            then: {
              kind: "choose",
              selection: {
                id: "aetherwing-weapon",
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
                        oneOf: ["WEAPON"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["AETHERWING"],
                      },
                    ],
                  },
                },
              },
              effect: {
                kind: "sequence",
                effects: [
                  {
                    kind: "move",
                    subject: {
                      kind: "bound",
                      binding: "loaded-aethercharge-cards",
                    },
                    destination: {
                      zone: "loaded",
                      host: {
                        kind: "bound",
                        binding: "aetherwing-weapon",
                      },
                    },
                    bindResultAs: "loaded-card-count",
                  },
                  {
                    kind: "draw",
                    player: "controller",
                    amount: {
                      kind: "binding-count",
                      binding: "loaded-card-count",
                    },
                    to: "memory",
                  },
                ],
              },
            },
          },
        },
      },
      {
        id: "wiztyu6o24-a3",
        kind: "static",
        staticKind: "intrinsic",
        text: "Inherited Effect — Ranged 1",
        keyword: {
          name: "ranged",
          value: 1,
        },
        label: {
          name: "Inherited Effect",
        },
        functionalZones: ["inner-lineage"],
        executionSource: "lineage-host",
      },
    ],
  },
  fhomy86084: {
    provenance:
      "Migrated from the previously maintained generated definition for candlelight-hourglass.",
    abilities: [
      {
        id: "fhomy86084-a1",
        kind: "triggered",
        text: "On Enter: Draw a card.",
        trigger: {
          kind: "event",
          event: {
            name: "object-entered-field",
            subject: {
              kind: "source",
            },
          },
        },
        effect: {
          kind: "draw",
          player: "controller",
          amount: 1,
        },
      },
      {
        id: "fhomy86084-a2",
        kind: "triggered",
        text: "On Charge 2: Candlelight Hourglass gains ”Activated abilities of allies you don't control cost (2) more to activate.” (At the beginning of your recollection phase, put a charge counter on each object you control with an untriggered on charge ability. Trigger this ability the first time two charge counters are on it.)",
        label: {
          name: "On Charge",
          parameters: {
            threshold: 2,
          },
        },
        trigger: {
          kind: "event",
          event: {
            name: "counter-added",
            subject: {
              kind: "source",
            },
            counter: {
              named: "charge",
            },
          },
        },
        limit: {
          count: 1,
          per: "source-instance",
        },
        interveningCondition: {
          kind: "has-counter",
          subject: {
            kind: "source",
          },
          counter: {
            named: "charge",
          },
          comparison: {
            left: {
              kind: "counter-count",
              subject: {
                kind: "source",
              },
              counter: {
                named: "charge",
              },
            },
            operator: "eq",
            right: 2,
          },
        },
        effect: {
          kind: "continuous",
          subjects: {
            kind: "source",
          },
          affectedSet: "locked",
          duration: {
            kind: "permanent",
          },
          layer: {
            layer: "D",
            modifies: "ability",
          },
          change: {
            kind: "grant-ability",
            ability: {
              id: "granted-1grjigy-a1",
              kind: "static",
              staticKind: "effects",
              text: "Activated abilities of allies you don't control cost (2) more to activate.",
              effects: [
                {
                  kind: "rule-modification",
                  mode: "add-cost",
                  action: "activate",
                  activationKind: "ability",
                  subject: {
                    kind: "each",
                    collection: {
                      zones: ["field"],
                      player: "each-opponent",
                      filter: {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                    },
                  },
                  cost: {
                    kind: "pay-reserve",
                    amount: 2,
                  },
                  duration: {
                    kind: "while-source-in-functional-zone",
                  },
                },
              ],
            },
          },
        },
      },
    ],
  },
  "6v374coy34": {
    provenance: "Migrated from the previously maintained generated definition for slay-the-king.",
    abilities: [
      {
        id: "6v374coy34-a1",
        kind: "triggered",
        text: '[Class Bonus] On Attack: You may banish a card from your material deck. If you do, Slay the King gains "On Kill: You may play the banished card."',
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
          kind: "optional",
          player: "controller",
          allOrNothing: true,
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "banish",
                player: "controller",
                selection: {
                  id: "banished-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["material-deck"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "source",
                },
                affectedSet: "locked",
                duration: {
                  kind: "permanent",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-ability",
                  ability: {
                    id: "granted-ye5b4p-a1",
                    kind: "triggered",
                    text: "On Kill: You may play the banished card.",
                    trigger: {
                      kind: "event",
                      event: {
                        name: "object-killed",
                        subject: {
                          kind: "source",
                        },
                      },
                    },
                    effect: {
                      kind: "optional",
                      player: "controller",
                      allOrNothing: true,
                      effect: {
                        kind: "play-card",
                        subject: {
                          kind: "each",
                          collection: {
                            zones: ["banishment"],
                            host: {
                              kind: "source",
                            },
                            relationship: "banished-by",
                          },
                        },
                        payCosts: true,
                      },
                    },
                  },
                },
              },
            ],
          },
        },
      },
    ],
  },
  cxyky280mt: {
    provenance:
      "Migrated from the previously maintained generated definition for quicksilver-grail.",
    abilities: [
      {
        id: "cxyky280mt-a1",
        kind: "static",
        staticKind: "intrinsic",
        text: "Divine Relic (You can only have one card with this keyword in your material deck.)",
        keyword: {
          name: "divine-relic",
        },
      },
      {
        id: "cxyky280mt-a2",
        kind: "triggered",
        text: "On Enter: Banish a non-champion card from your material deck face down.",
        trigger: {
          kind: "event",
          event: {
            name: "object-entered-field",
            subject: {
              kind: "source",
            },
          },
        },
        effect: {
          kind: "banish",
          player: "controller",
          selection: {
            id: "banished-cards",
            kind: "choice",
            declared: "resolution",
            chooser: "controller",
            count: {
              kind: "exactly",
              amount: 1,
            },
            candidates: {
              kind: "card",
              zones: ["material-deck"],
              relationship: "zone-of",
              player: "controller",
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                  {
                    kind: "not",
                    filter: {
                      kind: "type",
                      oneOf: ["CHAMPION"],
                    },
                  },
                ],
              },
            },
          },
          faceDown: true,
        },
      },
      {
        id: "cxyky280mt-a3",
        kind: "activated",
        text: "Banish Quicksilver Grail: You may play the banished card. (You still pay for its costs.)",
        activation: "ability",
        cost: {
          kind: "banish-self",
        },
        effect: {
          kind: "optional",
          player: "controller",
          allOrNothing: true,
          effect: {
            kind: "play-card",
            subject: {
              kind: "each",
              collection: {
                zones: ["banishment"],
                host: {
                  kind: "source",
                },
                relationship: "banished-by",
              },
            },
            payCosts: true,
          },
        },
      },
    ],
  },
  c4sy8u49sk: {
    provenance:
      "Migrated from the previously maintained generated definition for stabilizing-capacitance.",
    abilities: [
      {
        id: "c4sy8u49sk-a1",
        kind: "card-resolution",
        text: "Put any amount of cards from your memory on the bottom of your deck in any order. Then draw that many cards into your memory.",
        effect: {
          kind: "choose",
          selection: {
            id: "returned-cards",
            kind: "choice",
            declared: "resolution",
            chooser: "controller",
            count: {
              kind: "any-number",
            },
            candidates: {
              kind: "card",
              zones: ["memory"],
              relationship: "zone-of",
              player: "controller",
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "returned-cards",
                },
                from: "memory",
                destination: {
                  zone: "main-deck",
                  placement: {
                    kind: "bottom",
                    orderChosenBy: "controller",
                  },
                },
                bindResultAs: "returned-card-count",
              },
              {
                kind: "draw",
                player: "controller",
                amount: {
                  kind: "binding-count",
                  binding: "returned-card-count",
                },
                to: "memory",
              },
            ],
          },
        },
      },
      {
        id: "c4sy8u49sk-a2",
        kind: "card-resolution",
        text: "[Class Bonus] [Level 7+] Draw a card.",
        restrictions: [
          {
            kind: "static",
            name: "class-bonus",
            condition: {
              kind: "champion-matches-source",
              characteristic: "class",
            },
          },
          {
            kind: "static",
            name: "level-restriction",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "property",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  property: "level",
                  basis: "current",
                },
                operator: "gte",
                right: 7,
              },
            },
          },
        ],
        effect: {
          kind: "draw",
          player: "controller",
          amount: 1,
        },
      },
    ],
  },
  d7l6i5thdy: {
    provenance:
      "Migrated from the previously maintained generated definition for diao-chan-idyll-corsage.",
    abilities: [
      {
        id: "d7l6i5thdy-a1",
        kind: "static",
        staticKind: "intrinsic",
        text: "Diao Chan Lineage",
        keyword: {
          name: "lineage",
          lineageName: "Diao Chan",
        },
      },
      {
        id: "d7l6i5thdy-a2",
        kind: "triggered",
        text: "On Enter: Choose any amount of non-champion objects and put a wither counter on each of them.",
        trigger: {
          kind: "event",
          event: {
            name: "object-entered-field",
            subject: {
              kind: "source",
            },
          },
        },
        effect: {
          kind: "choose",
          selection: {
            id: "chosen-objects",
            kind: "choice",
            declared: "resolution",
            chooser: "controller",
            count: {
              kind: "any-number",
            },
            candidates: {
              kind: "object",
              zones: ["field"],
              relationship: "controlled-by",
              player: "each-player",
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                  {
                    kind: "not",
                    filter: {
                      kind: "type",
                      oneOf: ["CHAMPION"],
                    },
                  },
                ],
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "chosen-objects",
            },
            counter: "wither",
            amount: 1,
          },
        },
      },
      {
        id: "d7l6i5thdy-a3",
        kind: "triggered",
        text: "Whenever a non-token object an opponent controls is destroyed, you may banish it. If you do, that opponent summons a Flowerbud token.",
        trigger: {
          kind: "event",
          event: {
            name: "object-destroyed",
            subject: {
              kind: "event-object",
              controller: "opponent",
              filter: {
                kind: "token",
                value: false,
              },
              bindAs: "destroyed-object",
            },
          },
        },
        effect: {
          kind: "optional",
          player: "controller",
          allOrNothing: true,
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "attempt",
                bindSucceededAs: "destroyed-object-banished",
                effect: {
                  kind: "banish-object",
                  subject: {
                    kind: "bound",
                    binding: "destroyed-object",
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "effect-succeeded",
                  binding: "destroyed-object-banished",
                },
                then: {
                  kind: "summon",
                  object: "Flowerbud",
                  controller: "event-subject-controller",
                },
              },
            ],
          },
        },
      },
    ],
  },
  btjuxztaug: {
    provenance:
      "Migrated from the previously maintained generated definition for stargazers-portent.",
    abilities: [
      {
        id: "btjuxztaug-a1",
        kind: "static",
        staticKind: "effects",
        text: "[Class Bonus] This card costs 1 less to activate.",
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
        effects: [
          {
            kind: "rule-modification",
            mode: "modify-cost",
            action: "activate",
            subject: {
              kind: "source",
            },
            costKind: "reserve",
            costOperation: "subtract",
            amount: 1,
            duration: {
              kind: "while-source-in-functional-zone",
            },
          },
        ],
      },
      {
        id: "btjuxztaug-a2",
        kind: "card-resolution",
        text: "The next time you starcall a card this turn, copy that activation. You may choose new targets for the copy.",
        effect: {
          kind: "create-delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
              },
              activationState: "starcalled",
              isCopy: false,
            },
          },
          limit: 1,
          expires: {
            kind: "this-turn",
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "copy",
                subject: {
                  kind: "event-subject",
                },
                copy: "card-activation",
                bindResultAs: "copied-activation",
              },
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "retarget",
                  subject: {
                    kind: "bound",
                    binding: "copied-activation",
                  },
                  chooser: "controller",
                },
              },
            ],
          },
        },
      },
    ],
  },
  jozihslnhz: {
    provenance:
      "Migrated from the previously maintained generated definition for sinister-mindreaver.",
    abilities: [
      {
        id: "jozihslnhz-a1",
        kind: "static",
        staticKind: "intrinsic",
        text: "[Class Bonus] Fast Activation",
        keyword: {
          name: "fast-activation",
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
        id: "jozihslnhz-a2",
        kind: "static",
        staticKind: "intrinsic",
        text: "Ambush (This ally may retaliate against attackers while not defending.)",
        keyword: {
          name: "ambush",
        },
      },
      {
        id: "jozihslnhz-a3",
        kind: "triggered",
        text: "On Champion Hit: Look at that opponent’s memory. You may discard up to two cards from it. If you do, they draw that many cards into their memory.",
        trigger: {
          kind: "event",
          event: {
            name: "attack-hit",
            subject: {
              kind: "source",
            },
            recipient: {
              kind: "event-object",
              bindAs: "trigger-recipient",
              filter: {
                kind: "type",
                oneOf: ["CHAMPION"],
              },
            },
          },
        },
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "look-at",
              player: "event-recipient-controller",
              selection: {
                id: "looked-memory",
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
                id: "discarded-cards",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "up-to",
                  amount: 2,
                },
                unique: true,
                candidates: {
                  kind: "card",
                  binding: "looked-memory",
                },
              },
              effect: {
                kind: "sequence",
                effects: [
                  {
                    kind: "move",
                    subject: {
                      kind: "bound",
                      binding: "discarded-cards",
                    },
                    from: "memory",
                    destination: {
                      zone: "graveyard",
                    },
                    bindResultAs: "discarded-card-count",
                  },
                  {
                    kind: "draw",
                    player: "event-recipient-controller",
                    amount: {
                      kind: "binding-count",
                      binding: "discarded-card-count",
                    },
                    to: "memory",
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
  y5ttkat9hr: {
    provenance: "Migrated from the previously maintained generated definition for aqua-vitae.",
    abilities: [
      {
        id: "y5ttkat9hr-a1",
        kind: "static",
        staticKind: "intrinsic",
        text: "Brew — One Springleaf",
        keyword: {
          name: "brew",
          requirements: [
            {
              kind: "name",
              value: "Springleaf",
              count: 1,
            },
          ],
        },
      },
      {
        id: "y5ttkat9hr-a2",
        kind: "triggered",
        text: "[Class Bonus] At the beginning of your recollection phase, put an age counter on Aqua Vitae.",
        trigger: {
          kind: "event",
          event: {
            name: "phase-begins",
            phase: "recollection",
            actor: "controller",
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
          kind: "add-counter",
          subject: {
            kind: "source",
          },
          counter: {
            named: "age",
          },
          amount: 1,
        },
      },
      {
        id: "y5ttkat9hr-a3",
        kind: "activated",
        text: "Sacrifice Aqua Vitae: Draw a card. Then if there were three or more age counters on Aqua Vitae, draw an additional card.",
        activation: "ability",
        cost: {
          kind: "sacrifice",
          subject: {
            kind: "source",
          },
        },
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "draw",
              player: "controller",
              amount: 1,
            },
            {
              kind: "conditional",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "source",
                    },
                    counter: {
                      named: "age",
                    },
                    basis: "last-known",
                    missing: "zero",
                  },
                  operator: "gte",
                  right: 3,
                },
              },
              then: {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
            },
          ],
        },
      },
    ],
  },
  XgzTexcCSA: {
    provenance:
      "Migrated from the previously maintained generated definition for punishing-cartridge.",
    abilities: [
      {
        id: "XgzTexcCSA-a1",
        kind: "static",
        staticKind: "intrinsic",
        text: "Renewable",
        keyword: {
          name: "renewable",
        },
      },
      {
        id: "XgzTexcCSA-a2",
        kind: "activated",
        text: "[Class Bonus] REST: Load Punishing Cartridge into target unloaded Gun weapon you control.",
        activation: "ability",
        cost: {
          kind: "rest",
          subject: {
            kind: "source",
          },
        },
        targets: [
          {
            id: "target-weapon",
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
              player: "controller",
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "type",
                    oneOf: ["WEAPON"],
                  },
                  {
                    kind: "not",
                    filter: {
                      kind: "object-state",
                      state: "loaded",
                    },
                  },
                ],
              },
            },
          },
        ],
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
          kind: "move",
          subject: {
            kind: "source",
          },
          destination: {
            zone: "loaded",
            host: {
              kind: "bound",
              binding: "target-weapon",
            },
          },
        },
      },
      {
        id: "XgzTexcCSA-a3",
        kind: "triggered",
        text: 'On Attack: Discard up to two cards, then choose that many—\n• Change the target of this attack to another unit.\n• Punishing Cartridge gains "On Champion Hit: That opponent sacrifices an ally."',
        trigger: {
          kind: "event",
          event: {
            name: "attack-declared",
            subject: {
              kind: "source",
            },
          },
        },
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "discard",
              player: "controller",
              selection: {
                id: "discarded-cards",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "up-to",
                  amount: 2,
                },
                candidates: {
                  kind: "card",
                  zones: ["hand"],
                  relationship: "zone-of",
                  player: "controller",
                },
              },
              bindResultAs: "discarded-card-count",
            },
            {
              kind: "select-modes",
              choose: {
                kind: "exactly",
                amount: {
                  kind: "binding-count",
                  binding: "discarded-card-count",
                },
              },
              modes: [
                {
                  id: "change-target",
                  text: "Change the target of this attack to another unit.",
                  effect: {
                    kind: "choose",
                    selection: {
                      id: "new-defender",
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
                        relationship: "zone-of",
                        player: "each-player",
                        filter: {
                          kind: "all",
                          filters: [
                            {
                              kind: "type",
                              oneOf: ["ALLY", "CHAMPION"],
                            },
                            {
                              kind: "not-subject",
                              subject: {
                                kind: "event-recipient",
                              },
                            },
                          ],
                        },
                      },
                    },
                    effect: {
                      kind: "retarget",
                      subject: {
                        kind: "current-attack",
                      },
                      chooser: "controller",
                      newTarget: {
                        kind: "bound",
                        binding: "new-defender",
                      },
                    },
                  },
                },
                {
                  id: "gain-on-champion-hit",
                  text: 'Punishing Cartridge gains "On Champion Hit: That opponent sacrifices an ally."',
                  effect: {
                    kind: "continuous",
                    subjects: {
                      kind: "source",
                    },
                    affectedSet: "locked",
                    duration: {
                      kind: "this-attack",
                    },
                    layer: {
                      layer: "D",
                      modifies: "ability",
                    },
                    change: {
                      kind: "grant-ability",
                      ability: {
                        id: "granted-57t56v-a1",
                        kind: "triggered",
                        text: "On Champion Hit: That opponent sacrifices an ally.",
                        trigger: {
                          kind: "event",
                          event: {
                            name: "attack-hit",
                            subject: {
                              kind: "ability-bearer",
                            },
                            recipient: {
                              kind: "event-object",
                              filter: {
                                kind: "type",
                                oneOf: ["CHAMPION"],
                              },
                            },
                          },
                        },
                        effect: {
                          kind: "choose",
                          selection: {
                            id: "sacrificed-ally",
                            kind: "choice",
                            declared: "resolution",
                            chooser: "event-recipient-controller",
                            count: {
                              kind: "exactly",
                              amount: 1,
                            },
                            candidates: {
                              kind: "object",
                              zones: ["field"],
                              relationship: "controlled-by",
                              player: "event-recipient-controller",
                              filter: {
                                kind: "type",
                                oneOf: ["ALLY"],
                              },
                            },
                          },
                          effect: {
                            kind: "sacrifice",
                            subject: {
                              kind: "bound",
                              binding: "sacrificed-ally",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  },
  "1dfhbt3yna": {
    provenance: "Migrated from the previously maintained generated definition for gather-slimes.",
    abilities: [
      {
        id: "1dfhbt3yna-a1",
        kind: "static",
        staticKind: "intrinsic",
        text: "[Class Bonus] Fast Activation",
        keyword: {
          name: "fast-activation",
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
        id: "1dfhbt3yna-a2",
        kind: "card-resolution",
        text: "Reveal the top five cards of your deck. Recover X where X is the amount of Slime ally cards revealed this way. Put a Slime ally card from among them into your hand and the rest on the bottom of your deck in any order.",
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "reveal",
              player: "controller",
              selection: {
                id: "referenced-cards",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 5,
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
              kind: "recover",
              player: "controller",
              amount: {
                kind: "count",
                collection: {
                  binding: "referenced-cards",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["SLIME"],
                      },
                    ],
                  },
                },
              },
            },
            {
              kind: "choose",
              selection: {
                id: "selected-referenced-card",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                unique: true,
                candidates: {
                  kind: "card",
                  binding: "referenced-cards",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["SLIME"],
                      },
                    ],
                  },
                },
              },
              effect: {
                kind: "sequence",
                effects: [
                  {
                    kind: "move",
                    subject: {
                      kind: "bound",
                      binding: "selected-referenced-card",
                    },
                    destination: {
                      zone: "hand",
                    },
                  },
                  {
                    kind: "move",
                    subject: {
                      kind: "binding-remainder",
                      binding: "referenced-cards",
                      excluding: "selected-referenced-card",
                    },
                    destination: {
                      zone: "main-deck",
                      placement: {
                        kind: "bottom",
                        orderChosenBy: "controller",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
  af098kmoi0: {
    provenance: "Migrated from the previously maintained generated definition for orb-of-hubris.",
    abilities: [
      {
        id: "af098kmoi0-a1",
        kind: "activated",
        text: "Banish Orb of Hubris: Draw up to three cards, then shuffle that amount of cards from your hand into your deck.",
        activation: "ability",
        cost: {
          kind: "banish-self",
        },
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "choose-value",
              selection: {
                id: "draw-count",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                unique: true,
                candidates: {
                  kind: "number",
                  minimum: 0,
                  maximum: 3,
                },
              },
              trackAs: "draw-count",
            },
            {
              kind: "draw",
              player: "controller",
              amount: {
                kind: "binding",
                binding: "draw-count",
              },
            },
            {
              kind: "choose",
              selection: {
                id: "returned-cards",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: {
                    kind: "binding",
                    binding: "draw-count",
                  },
                },
                candidates: {
                  kind: "card",
                  zones: ["hand"],
                  relationship: "zone-of",
                  player: "controller",
                },
              },
              effect: {
                kind: "sequence",
                effects: [
                  {
                    kind: "move",
                    subject: {
                      kind: "bound",
                      binding: "returned-cards",
                    },
                    from: "hand",
                    destination: {
                      zone: "main-deck",
                      placement: {
                        kind: "unordered",
                      },
                    },
                  },
                  {
                    kind: "shuffle",
                    player: "controller",
                    zone: "main-deck",
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
  gmnmp5af09: {
    provenance: "Migrated from the previously maintained generated definition for blastshot-pump.",
    abilities: [
      {
        id: "gmnmp5af09-a1",
        kind: "static",
        staticKind: "intrinsic",
        text: "(Gun — Must be loaded to use for an attack and can't be used with an attack card.)",
        keyword: {
          name: "gun",
        },
      },
      {
        id: "gmnmp5af09-a2",
        kind: "static",
        staticKind: "effects",
        text: "[Class Bonus] If combat damage would be dealt to a unit by an attack using Blastshot Pump, that damage is dealt to that unit and an additional unit you don't control instead.",
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
        effects: [
          {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
              using: {
                kind: "source",
              },
              combatDamage: true,
            },
            operation: {
              kind: "replace-with",
              effect: {
                kind: "choose",
                selection: {
                  id: "additional-unit",
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
                    relationship: "zone-of",
                    player: "each-opponent",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["ALLY", "CHAMPION"],
                        },
                        {
                          kind: "not-subject",
                          subject: {
                            kind: "event-recipient",
                          },
                        },
                      ],
                    },
                  },
                },
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "deal-damage",
                      source: {
                        kind: "event-source",
                      },
                      recipient: {
                        kind: "event-recipient",
                      },
                      amount: {
                        kind: "event-amount",
                      },
                    },
                    {
                      kind: "deal-damage",
                      source: {
                        kind: "event-source",
                      },
                      recipient: {
                        kind: "bound",
                        binding: "additional-unit",
                      },
                      amount: {
                        kind: "event-amount",
                      },
                    },
                  ],
                },
              },
            },
            duration: {
              kind: "while-source-in-functional-zone",
            },
          },
        ],
      },
    ],
  },
  "1wqqUKG6pD": {
    provenance:
      "Migrated from the previously maintained generated definition for materialize-the-soul.",
    abilities: [
      {
        id: "1wqqUKG6pD-a1",
        kind: "static",
        staticKind: "effects",
        text: "[Merlin Bonus] [Sheen 15+] This card costs 3 less to activate.",
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
              minimum: 15,
            },
          },
        ],
        effects: [
          {
            kind: "rule-modification",
            mode: "modify-cost",
            action: "activate",
            subject: {
              kind: "source",
            },
            costKind: "reserve",
            costOperation: "subtract",
            amount: 3,
            duration: {
              kind: "while-source-in-functional-zone",
            },
          },
        ],
      },
      {
        id: "1wqqUKG6pD-a2",
        kind: "card-resolution",
        text: "[Merlin Bonus] Your champion becomes all class types of target opponent's champion in addition to their other types. Then look at that opponent's material deck. You may materialize a regalia card from among them, ignoring its elemental requirements. (The class changing effect lasts indefinitely.)",
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
          kind: "sequence",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "champion",
                player: "controller",
              },
              affectedSet: "locked",
              duration: {
                kind: "permanent",
              },
              layer: {
                layer: "B",
                modifies: "type",
              },
              change: {
                kind: "copy-characteristic",
                from: {
                  kind: "champion",
                  player: {
                    binding: "target-opponent",
                  },
                },
                characteristic: "class",
              },
            },
            {
              kind: "look-at",
              player: "controller",
              selection: {
                id: "looked-material-deck",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "all",
                },
                candidates: {
                  kind: "card",
                  zones: ["material-deck"],
                  relationship: "zone-of",
                  player: {
                    binding: "target-opponent",
                  },
                },
              },
            },
            {
              kind: "optional",
              player: "controller",
              allOrNothing: true,
              effect: {
                kind: "choose",
                selection: {
                  id: "regalia-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    binding: "looked-material-deck",
                    filter: {
                      kind: "supertype",
                      oneOf: ["REGALIA"],
                    },
                  },
                },
                effect: {
                  kind: "materialize-card",
                  subject: {
                    kind: "bound",
                    binding: "regalia-card",
                  },
                  payCosts: true,
                  ignoreElementRequirements: true,
                },
              },
            },
          ],
        },
      },
    ],
  },
  TL19V7lU6A: {
    provenance:
      "Migrated from the previously maintained generated definition for sacramental-rite.",
    abilities: [
      {
        id: "TL19V7lU6A-a1",
        kind: "static",
        staticKind: "intrinsic",
        text: "Divine Relic",
        keyword: {
          name: "divine-relic",
        },
      },
      {
        id: "TL19V7lU6A-a2",
        kind: "triggered",
        text: "On Enter: Banish a non-champion card from your material deck face down.",
        trigger: {
          kind: "event",
          event: {
            name: "object-entered-field",
            subject: {
              kind: "source",
            },
          },
        },
        effect: {
          kind: "banish",
          player: "controller",
          selection: {
            id: "banished-cards",
            kind: "choice",
            declared: "resolution",
            chooser: "controller",
            count: {
              kind: "exactly",
              amount: 1,
            },
            candidates: {
              kind: "card",
              zones: ["material-deck"],
              relationship: "zone-of",
              player: "controller",
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                  {
                    kind: "not",
                    filter: {
                      kind: "type",
                      oneOf: ["CHAMPION"],
                    },
                  },
                ],
              },
            },
          },
          faceDown: true,
        },
      },
      {
        id: "TL19V7lU6A-a3",
        kind: "activated",
        text: "Banish Sacramental Rite: Your champion becomes an Ascendant in addition to its other types. You may play the banished card.",
        activation: "ability",
        cost: {
          kind: "banish-self",
        },
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "champion",
                player: "controller",
              },
              affectedSet: "locked",
              duration: {
                kind: "permanent",
              },
              layer: {
                layer: "B",
                modifies: "type",
              },
              change: {
                kind: "add-characteristic",
                characteristic: {
                  kind: "subtype",
                  value: "ASCENDANT",
                },
              },
            },
            {
              kind: "optional",
              player: "controller",
              allOrNothing: true,
              effect: {
                kind: "play-card",
                subject: {
                  kind: "each",
                  collection: {
                    zones: ["banishment"],
                    host: {
                      kind: "source",
                    },
                    relationship: "banished-by",
                  },
                },
                payCosts: true,
              },
            },
          ],
        },
      },
    ],
  },
  "0d93t7bfwc": {
    provenance:
      "Migrated from the previously maintained generated definition for servile-possessions.",
    abilities: [
      {
        id: "0d93t7bfwc-a1",
        kind: "triggered",
        text: "[Ciel Bonus] Whenever your champion attacks, depending on the amount of omens you have—\n• 1 to 2— That attack gets +1POWER.\n• 3 to 4— That attack gets +2POWER.\n• 5 or more— That attack gets +3POWER. Draw a card into your memory.",
        trigger: {
          kind: "event",
          event: {
            name: "attack-declared",
            subject: {
              kind: "event-object",
              controller: "controller",
              filter: {
                kind: "type",
                oneOf: ["CHAMPION"],
              },
            },
          },
        },
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
          kind: "conditional",
          condition: {
            kind: "compare",
            comparison: {
              left: {
                kind: "variable",
                symbol: "X",
              },
              operator: "gte",
              right: 1,
            },
          },
          then: {
            kind: "sequence",
            effects: [
              {
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
                  amount: {
                    kind: "conditional",
                    condition: {
                      kind: "compare",
                      comparison: {
                        left: {
                          kind: "variable",
                          symbol: "X",
                        },
                        operator: "gte",
                        right: 5,
                      },
                    },
                    then: 3,
                    else: {
                      kind: "conditional",
                      condition: {
                        kind: "compare",
                        comparison: {
                          left: {
                            kind: "variable",
                            symbol: "X",
                          },
                          operator: "gte",
                          right: 3,
                        },
                      },
                      then: 2,
                      else: 1,
                    },
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "variable",
                      symbol: "X",
                    },
                    operator: "gte",
                    right: 5,
                  },
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
              },
            ],
          },
        },
        variables: [
          {
            symbol: "X",
            kind: "derived",
            amount: {
              kind: "player-property",
              player: "controller",
              property: "omens",
            },
          },
        ],
      },
    ],
  },
  y8BNOi4rwD: {
    provenance:
      "Migrated from the previously maintained generated definition for luminescent-slash.",
    abilities: [
      {
        id: "y8BNOi4rwD-a1",
        kind: "static",
        staticKind: "effects",
        text: "[Mordred Bonus] This card costs 2 less to activate for each other attack card you've activated this turn.",
        restrictions: [
          {
            kind: "static",
            name: "champion-bonus",
            condition: {
              kind: "champion-lineage-is",
              name: "Mordred",
            },
          },
        ],
        effects: [
          {
            kind: "rule-modification",
            mode: "modify-cost",
            action: "activate",
            subject: {
              kind: "source",
            },
            costKind: "reserve",
            costOperation: "subtract",
            amount: {
              kind: "calculate",
              operator: "multiply",
              operands: [
                {
                  kind: "count",
                  collection: {
                    excludingSource: true,
                    filter: {
                      kind: "type",
                      oneOf: ["ATTACK"],
                    },
                    history: {
                      event: "card-activated",
                      window: "this-turn",
                    },
                  },
                },
                2,
              ],
            },
            duration: {
              kind: "while-source-in-functional-zone",
            },
          },
        ],
      },
      {
        id: "y8BNOi4rwD-a2",
        kind: "static",
        staticKind: "effects",
        text: "[Mordred Bonus] Luminescent Slash gets +2POWER for each other attack card you've activated this turn.",
        restrictions: [
          {
            kind: "static",
            name: "champion-bonus",
            condition: {
              kind: "champion-lineage-is",
              name: "Mordred",
            },
          },
        ],
        effects: [
          {
            kind: "continuous",
            subjects: {
              kind: "source",
            },
            affectedSet: "dynamic",
            duration: {
              kind: "while-source-in-functional-zone",
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
              amount: {
                kind: "calculate",
                operator: "multiply",
                operands: [
                  {
                    kind: "count",
                    collection: {
                      excludingSource: true,
                      filter: {
                        kind: "type",
                        oneOf: ["ATTACK"],
                      },
                      history: {
                        event: "card-activated",
                        window: "this-turn",
                      },
                    },
                  },
                  2,
                ],
              },
            },
          },
        ],
      },
    ],
  },
  tAiiMGZJXp: {
    provenance:
      "Migrated from the previously maintained generated definition for transcendental-rite.",
    abilities: [
      {
        id: "tAiiMGZJXp-a1",
        kind: "static",
        staticKind: "intrinsic",
        text: "Divine Relic",
        keyword: {
          name: "divine-relic",
        },
      },
      {
        id: "tAiiMGZJXp-a2",
        kind: "activated",
        text: "Banish Transcendental Rite: Your champion becomes an Ascendant in addition to its other types. All basic elements are enabled for you until end of turn.",
        activation: "ability",
        cost: {
          kind: "banish-self",
        },
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "champion",
                player: "controller",
              },
              affectedSet: "locked",
              duration: {
                kind: "permanent",
              },
              layer: {
                layer: "B",
                modifies: "type",
              },
              change: {
                kind: "add-characteristic",
                characteristic: {
                  kind: "subtype",
                  value: "ASCENDANT",
                },
              },
            },
            {
              kind: "sequence",
              effects: [
                {
                  kind: "set-player-state",
                  player: "controller",
                  state: {
                    named: "enabled-element",
                    value: "FIRE",
                  },
                  value: true,
                  duration: {
                    kind: "this-turn",
                  },
                },
                {
                  kind: "set-player-state",
                  player: "controller",
                  state: {
                    named: "enabled-element",
                    value: "WATER",
                  },
                  value: true,
                  duration: {
                    kind: "this-turn",
                  },
                },
                {
                  kind: "set-player-state",
                  player: "controller",
                  state: {
                    named: "enabled-element",
                    value: "WIND",
                  },
                  value: true,
                  duration: {
                    kind: "this-turn",
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  },
  R4IZe3rh4V: {
    provenance: "Migrated from the previously maintained generated definition for ovation-guide.",
    abilities: [
      {
        id: "R4IZe3rh4V-a1",
        kind: "triggered",
        text: "On Enter: Target opponent may materialize a champion card from their material deck. If they do, you draw a card and gain the Crowd's Favor status.",
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
          player: {
            binding: "target-opponent",
          },
          allOrNothing: true,
          effect: {
            kind: "choose",
            selection: {
              id: "chosen-champion-card",
              kind: "choice",
              declared: "resolution",
              chooser: {
                binding: "target-opponent",
              },
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "card",
                zones: ["material-deck"],
                relationship: "zone-of",
                player: {
                  binding: "target-opponent",
                },
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  bindSucceededAs: "champion-materialized",
                  effect: {
                    kind: "materialize-card",
                    subject: {
                      kind: "bound",
                      binding: "chosen-champion-card",
                    },
                    materializer: {
                      binding: "target-opponent",
                    },
                    payCosts: true,
                  },
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "champion-materialized",
                  },
                  then: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "draw",
                        player: "controller",
                        amount: 1,
                      },
                      {
                        kind: "set-player-state",
                        player: "controller",
                        state: {
                          named: "crowds-favor",
                        },
                        value: true,
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      },
    ],
  },
  NidqQ6MOuy: {
    provenance:
      "Migrated from the previously maintained generated definition for lesser-boon-of-parvati.",
    abilities: [
      {
        id: "NidqQ6MOuy-a1",
        kind: "triggered",
        text: "As you gain this boon, put six durability counters on a Siegeable domain you control or put three durability counters on a Siegeable domain you don't control.",
        trigger: {
          kind: "event",
          event: {
            name: "boon-gained",
            subject: {
              kind: "source",
            },
          },
        },
        effect: {
          kind: "choose",
          selection: {
            id: "siegeable-domain",
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
              relationship: "zone-of",
              player: "controller",
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "type",
                    oneOf: ["DOMAIN"],
                  },
                  {
                    kind: "has-keyword",
                    keyword: "siegeable",
                  },
                ],
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "siegeable-domain",
            },
            counter: "durability",
            amount: {
              kind: "conditional",
              condition: {
                kind: "controls-subject",
                player: "controller",
                subject: {
                  kind: "bound",
                  binding: "siegeable-domain",
                },
              },
              then: 6,
              else: 3,
            },
          },
        },
      },
    ],
  },
  uQeQhFl5Qm: {
    provenance:
      "Migrated from the previously maintained generated definition for lesser-boon-of-regret.",
    abilities: [
      {
        id: "uQeQhFl5Qm-a1",
        kind: "triggered",
        text: "As you gain this boon, put up to seven cards from your hand on the bottom of your deck in any order. Then draw that many cards.",
        trigger: {
          kind: "event",
          event: {
            name: "boon-gained",
            subject: {
              kind: "source",
            },
          },
        },
        effect: {
          kind: "choose",
          selection: {
            id: "moved-cards",
            kind: "choice",
            declared: "resolution",
            chooser: "controller",
            count: {
              kind: "up-to",
              amount: 7,
            },
            candidates: {
              kind: "card",
              zones: ["hand"],
              relationship: "zone-of",
              player: "controller",
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "moved-cards",
                },
                from: "hand",
                destination: {
                  zone: "main-deck",
                  placement: {
                    kind: "bottom",
                    orderChosenBy: "controller",
                  },
                },
                bindResultAs: "moved-card-count",
              },
              {
                kind: "draw",
                player: "controller",
                amount: {
                  kind: "binding-count",
                  binding: "moved-card-count",
                },
              },
            ],
          },
        },
      },
    ],
  },
  ooGvrzxTmr: {
    provenance:
      "Migrated from the previously maintained generated definition for piccarda-night-rider.",
    abilities: [
      {
        id: "ooGvrzxTmr-a1",
        kind: "static",
        staticKind: "effects",
        text: "While paying for this card’s reserve cost, you may remove up to four static counters from among objects you control. Each counter removed this way pays for 1 of that cost.",
        effects: [
          {
            kind: "rule-modification",
            mode: "payment-contribution",
            action: "pay-cost",
            subject: {
              kind: "source",
            },
            costKind: "reserve",
            cost: {
              kind: "select-and-remove-counters",
              player: "controller",
              counter: "static",
              count: {
                kind: "up-to",
                amount: 4,
              },
            },
            amount: 1,
            contributionBasis: "per-paid-object",
            duration: {
              kind: "while-source-in-functional-zone",
            },
          },
        ],
      },
      {
        id: "ooGvrzxTmr-a2",
        kind: "keyword-group",
        text: "[Class Bonus] Spellshroud, Stealth",
        keywords: [
          {
            name: "spellshroud",
          },
          {
            name: "stealth",
          },
        ],
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
        id: "ooGvrzxTmr-a3",
        kind: "static",
        staticKind: "effects",
        text: "As long as Piccarda is attacking a champion, she gets +4POWER.",
        effects: [
          {
            kind: "continuous",
            subjects: {
              kind: "source",
            },
            affectedSet: "dynamic",
            condition: {
              kind: "combat-relation",
              relation: "attacking",
              subject: {
                kind: "source",
              },
              otherFilter: {
                kind: "type",
                oneOf: ["CHAMPION"],
              },
            },
            duration: {
              kind: "while-source-in-functional-zone",
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
              amount: 4,
            },
          },
        ],
      },
    ],
  },
  vxzsjRxMIn: {
    provenance:
      "Migrated from the previously maintained generated definition for zena-echo-weaver.",
    abilities: [
      {
        id: "vxzsjRxMIn-a1",
        kind: "static",
        staticKind: "effects",
        text: "While paying for this card's reserve cost, you may banish up to two Harmony and/or Melody cards from your graveyard. Each card banished this way pays for 2 of that cost.",
        effects: [
          {
            kind: "rule-modification",
            mode: "payment-contribution",
            action: "pay-cost",
            subject: {
              kind: "source",
            },
            costKind: "reserve",
            cost: {
              kind: "select-and-move",
              player: "controller",
              from: "graveyard",
              to: "banishment",
              count: {
                kind: "up-to",
                amount: 2,
              },
              filter: {
                kind: "subtype",
                oneOf: ["HARMONY", "MELODY"],
              },
            },
            amount: 2,
            contributionBasis: "per-paid-object",
            duration: {
              kind: "while-source-in-functional-zone",
            },
          },
        ],
      },
      {
        id: "vxzsjRxMIn-a2",
        kind: "triggered",
        intrinsic: true,
        text: "[Level 1+] Vigor (This ally wakes up at the beginning of your end phase.)",
        keyword: {
          name: "vigor",
        },
        restrictions: [
          {
            kind: "static",
            name: "level-restriction",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "property",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  property: "level",
                  basis: "current",
                },
                operator: "gte",
                right: 1,
              },
            },
          },
        ],
      },
    ],
  },
  x9sSpjpP3G: {
    provenance:
      "Migrated from the previously maintained generated definition for lorraine-arclight-saber.",
    abilities: [
      {
        id: "x9sSpjpP3G-a1",
        kind: "static",
        staticKind: "intrinsic",
        text: "Lorraine Lineage",
        keyword: {
          name: "lineage",
          lineageName: "Lorraine",
        },
      },
      {
        id: "x9sSpjpP3G-a2",
        kind: "triggered",
        text: "On Enter: Put LV static counters on Lorraine. Then for each of up to seven arcane element cards in your banishment, put another static counter on Lorraine. (Whenever an arcane element unit deals combat damage to an object, you may remove a static counter from this unit and deal 1 damage to the object that was dealt damage.)",
        trigger: {
          kind: "event",
          event: {
            name: "object-entered-field",
            subject: {
              kind: "source",
            },
          },
        },
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "add-counter",
              subject: {
                kind: "source",
              },
              counter: "static",
              amount: {
                kind: "property",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                property: "level",
                basis: "current",
              },
            },
            {
              kind: "choose",
              selection: {
                id: "selected-arcane-cards",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "up-to",
                  amount: 7,
                },
                candidates: {
                  kind: "card",
                  zones: ["banishment"],
                  relationship: "zone-of",
                  player: "controller",
                  filter: {
                    kind: "element",
                    oneOf: ["ARCANE"],
                  },
                },
              },
              effect: {
                kind: "add-counter",
                subject: {
                  kind: "source",
                },
                counter: "static",
                amount: {
                  kind: "binding-count",
                  binding: "selected-arcane-cards",
                },
              },
            },
          ],
        },
      },
    ],
  },
  Tx8noEw78s: {
    provenance:
      "Migrated from the previously maintained generated definition for extinguishing-synchron.",
    abilities: [
      {
        id: "Tx8noEw78s-a1",
        kind: "triggered",
        text: "Whenever your champion is dealt non-combat damage by a fire element source, put a refinement counter on Extinguishing Synchron.",
        trigger: {
          kind: "event",
          event: {
            name: "damage-dealt",
            recipient: {
              kind: "event-object",
              controller: "controller",
              filter: {
                kind: "type",
                oneOf: ["CHAMPION"],
              },
            },
            combatDamage: false,
            subject: {
              kind: "event-object",
              filter: {
                kind: "element",
                oneOf: ["FIRE"],
              },
            },
          },
        },
        effect: {
          kind: "add-counter",
          subject: {
            kind: "source",
          },
          counter: {
            named: "refinement",
          },
          amount: 1,
        },
      },
      {
        id: "Tx8noEw78s-a2",
        kind: "activated",
        text: "Sacrifice Extinguishing Synchron: Recover 2+X, where X is the amount of refinement counters that was on Extinguishing Synchron.",
        activation: "ability",
        cost: {
          kind: "sacrifice",
          subject: {
            kind: "source",
          },
        },
        variables: [
          {
            symbol: "X",
            kind: "derived",
            amount: {
              kind: "counter-count",
              subject: {
                kind: "source",
              },
              counter: {
                named: "refinement",
              },
              basis: "last-known",
              missing: "zero",
            },
          },
        ],
        effect: {
          kind: "recover",
          player: "controller",
          amount: {
            kind: "calculate",
            operator: "add",
            operands: [
              2,
              {
                kind: "variable",
                symbol: "X",
              },
            ],
          },
        },
      },
    ],
  },
  A9c8tb7LKD: {
    provenance:
      "Migrated from the previously maintained generated definition for exhilarating-plume.",
    abilities: [
      {
        id: "A9c8tb7LKD-a1",
        kind: "static",
        staticKind: "effects",
        text: "[Class Bonus] This card costs 2 less to activate.",
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
        effects: [
          {
            kind: "rule-modification",
            mode: "modify-cost",
            action: "activate",
            subject: {
              kind: "source",
            },
            costKind: "reserve",
            costOperation: "subtract",
            amount: 2,
            duration: {
              kind: "while-source-in-functional-zone",
            },
          },
        ],
      },
      {
        id: "A9c8tb7LKD-a2",
        kind: "static",
        staticKind: "effects",
        text: "Human ally cards you activate enter the field with an additional buff counter on them.",
        effects: [
          {
            kind: "replacement",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["HUMAN"],
                    },
                  ],
                },
              },
              cause: {
                kind: "card-activation",
                controller: "controller",
              },
            },
            operation: {
              kind: "add-object-counters",
              counters: [
                {
                  counter: "buff",
                  amount: 1,
                },
              ],
            },
            duration: {
              kind: "while-source-in-functional-zone",
            },
          },
        ],
      },
    ],
  },
  THjSE7caau: {
    provenance:
      "Migrated from the previously maintained generated definition for gleaming-smolder.",
    abilities: [
      {
        id: "THjSE7caau-a1",
        kind: "card-resolution",
        text: "Draw a card and discard a card.",
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
            },
          ],
        },
      },
      {
        id: "THjSE7caau-a2",
        kind: "ability-modifier",
        text: "[Merlin Bonus] If a fire element card was discarded, choose a unit and put two sheen counters on it.",
        modifies: {
          kind: "preceding-non-modifier-ability",
        },
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
        operation: {
          kind: "append-effect",
          effect: {
            kind: "conditional",
            condition: {
              kind: "history",
              event: "card-discarded",
              window: "this-resolution",
              filter: {
                kind: "element",
                oneOf: ["FIRE"],
              },
              minimum: 1,
            },
            then: {
              kind: "choose",
              selection: {
                id: "chosen-unit",
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
                  relationship: "zone-of",
                  player: "controller",
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
                  binding: "chosen-unit",
                },
                counter: {
                  named: "sheen",
                },
                amount: 2,
              },
            },
          },
        },
      },
    ],
  },
  Tst4WbM6O8: {
    provenance: "Migrated from the previously maintained generated definition for redirect-orbit.",
    abilities: [
      {
        id: "Tst4WbM6O8-a1",
        kind: "card-resolution",
        text: "Shuffle any amount of cards from your hand and/or memory into your deck. Then draw that many cards into your memory.",
        effect: {
          kind: "choose",
          selection: {
            id: "shuffled-cards",
            kind: "choice",
            declared: "resolution",
            chooser: "controller",
            count: {
              kind: "any-number",
            },
            unique: true,
            candidates: {
              kind: "card",
              zones: ["hand", "memory"],
              relationship: "zone-of",
              player: "controller",
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "shuffled-cards",
                },
                destination: {
                  zone: "main-deck",
                  placement: {
                    kind: "unordered",
                  },
                },
                bindResultAs: "shuffled-card-count",
              },
              {
                kind: "shuffle",
                player: "controller",
                zone: "main-deck",
              },
              {
                kind: "draw",
                player: "controller",
                amount: {
                  kind: "binding-count",
                  binding: "shuffled-card-count",
                },
                to: "memory",
              },
            ],
          },
        },
      },
    ],
  },
  "4GFKcHg9NU": {
    provenance:
      "Migrated from the previously maintained generated definition for argus-allseeing-giant.",
    abilities: [
      {
        id: "4GFKcHg9NU-a1",
        kind: "static",
        staticKind: "effects",
        text: "While paying for this card's reserve cost, you may banish one or more cards named Crystal of Argus or Eye of Argus from your material deck. Each card banished this way pays for 3 of that cost.",
        effects: [
          {
            kind: "rule-modification",
            mode: "payment-contribution",
            action: "pay-cost",
            subject: {
              kind: "source",
            },
            costKind: "reserve",
            cost: {
              kind: "select-and-move",
              player: "controller",
              from: "material-deck",
              to: "banishment",
              count: {
                kind: "at-least",
                amount: 1,
              },
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "any",
                    filters: [
                      {
                        kind: "name",
                        value: "Crystal of Argus",
                      },
                      {
                        kind: "name",
                        value: "Eye of Argus",
                      },
                    ],
                  },
                  {
                    kind: "subtype",
                    oneOf: ["ARGUS"],
                  },
                ],
              },
            },
            amount: 3,
            contributionBasis: "per-paid-object",
            duration: {
              kind: "while-source-in-functional-zone",
            },
          },
        ],
      },
      {
        id: "4GFKcHg9NU-a2",
        kind: "keyword-group",
        text: "Taunt, True Sight, Vigor",
        keywords: [
          {
            name: "taunt",
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
        id: "4GFKcHg9NU-a3",
        kind: "static",
        staticKind: "effects",
        text: "As long as Argus is awake, it has omnishroud.",
        effects: [
          {
            kind: "continuous",
            subjects: {
              kind: "source",
            },
            affectedSet: "dynamic",
            condition: {
              kind: "object-state",
              subject: {
                kind: "source",
              },
              state: "awake",
            },
            duration: {
              kind: "while-source-in-functional-zone",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-keyword",
              keyword: {
                name: "omnishroud",
              },
            },
          },
        ],
      },
    ],
  },
  jjGLZKfRn5: {
    provenance:
      "Migrated from the previously maintained generated definition for avatar-of-suzaku.",
    abilities: [
      {
        id: "jjGLZKfRn5-a1",
        kind: "static",
        staticKind: "effects",
        text: "[Guo Jia Bonus] While paying for this card’s reserve cost, you may remove up to two quest counters from your champion. Each counter removed this way pays for 1 of that cost.",
        restrictions: [
          {
            kind: "static",
            name: "champion-bonus",
            condition: {
              kind: "champion-lineage-is",
              name: "Guo Jia",
            },
          },
        ],
        effects: [
          {
            kind: "rule-modification",
            mode: "payment-contribution",
            action: "pay-cost",
            subject: {
              kind: "source",
            },
            costKind: "reserve",
            cost: {
              kind: "select-and-remove-counters",
              player: "controller",
              objectFilter: {
                kind: "type",
                oneOf: ["CHAMPION"],
              },
              counter: {
                named: "quest",
              },
              count: {
                kind: "up-to",
                amount: 2,
              },
            },
            amount: 1,
            contributionBasis: "per-paid-object",
            duration: {
              kind: "while-source-in-functional-zone",
            },
          },
        ],
      },
      {
        id: "jjGLZKfRn5-a2",
        kind: "activated",
        text: "[Guo Jia Bonus] (2), Sacrifice Avatar of Suzaku: Put two quest counters on your champion. Then you may put a card named Fabled Ruby Fatestone from your material deck or banishment onto the field.",
        activation: "ability",
        cost: {
          kind: "all",
          costs: [
            {
              kind: "pay-reserve",
              amount: 2,
            },
            {
              kind: "sacrifice",
              subject: {
                kind: "source",
              },
            },
          ],
        },
        restrictions: [
          {
            kind: "static",
            name: "champion-bonus",
            condition: {
              kind: "champion-lineage-is",
              name: "Guo Jia",
            },
          },
        ],
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "add-counter",
              subject: {
                kind: "champion",
                player: "controller",
              },
              counter: {
                named: "quest",
              },
              amount: 2,
            },
            {
              kind: "optional",
              player: "controller",
              allOrNothing: true,
              effect: {
                kind: "choose",
                selection: {
                  id: "chosen-multi-zone-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    zones: ["material-deck", "banishment"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "name",
                      value: "Fabled Ruby Fatestone",
                    },
                  },
                },
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "chosen-multi-zone-card",
                  },
                  destination: {
                    zone: "field",
                  },
                },
              },
            },
          ],
        },
      },
    ],
  },
  YGz8gN8M69: {
    provenance: "Migrated from the previously maintained generated definition for eight-of-hearts.",
    abilities: [
      {
        id: "YGz8gN8M69-a1",
        kind: "static",
        staticKind: "effects",
        text: "While paying for this card's reserve cost, you may sacrifice up to two Suited allies with reserve cost 4 or less. Each ally sacrificed this way pays for 3 of that cost.",
        effects: [
          {
            kind: "rule-modification",
            mode: "payment-contribution",
            action: "pay-cost",
            subject: {
              kind: "source",
            },
            costKind: "reserve",
            cost: {
              kind: "select-and-sacrifice",
              player: "controller",
              count: {
                kind: "up-to",
                amount: 2,
              },
              bindResultAs: "sacrificed-objects",
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                  {
                    kind: "numeric",
                    comparison: {
                      left: {
                        kind: "property",
                        subject: {
                          kind: "candidate",
                        },
                        property: "reserve-cost",
                        basis: "base",
                      },
                      operator: "lte",
                      right: 4,
                    },
                  },
                  {
                    kind: "subtype",
                    oneOf: ["SUITED"],
                  },
                ],
              },
            },
            amount: 3,
            contributionBasis: "per-paid-object",
            duration: {
              kind: "while-source-in-functional-zone",
            },
          },
        ],
      },
      {
        id: "YGz8gN8M69-a2",
        kind: "activated",
        text: "Cardistry — (8): Draw two cards. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
        label: {
          name: "Cardistry",
        },
        activation: "ability",
        cost: {
          kind: "pay-reserve",
          amount: {
            kind: "calculate",
            operator: "maximum",
            operands: [
              {
                kind: "calculate",
                operator: "subtract",
                operands: [
                  8,
                  {
                    kind: "count",
                    collection: {
                      zones: ["field"],
                      player: "controller",
                      filter: {
                        kind: "subtype",
                        oneOf: ["SUITED"],
                      },
                    },
                    distinctBy: "reserve-cost",
                  },
                ],
              },
              0,
            ],
          },
        },
        limit: {
          count: 1,
          per: "source-instance",
        },
        effect: {
          kind: "draw",
          player: "controller",
          amount: 2,
        },
      },
    ],
  },
  UE6g95C1nZ: {
    provenance: "Migrated from the previously maintained generated definition for equinox-hour.",
    abilities: [
      {
        id: "UE6g95C1nZ-a1",
        kind: "activated",
        text: "Banish Equinox Hour: Draw a card. Then target opponent may materialize a card from their material deck. (That opponent still pays for its costs.)",
        activation: "ability",
        cost: {
          kind: "banish-self",
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
              kind: "draw",
              player: "controller",
              amount: 1,
            },
            {
              kind: "choose",
              selection: {
                id: "chosen-material-card",
                kind: "choice",
                declared: "resolution",
                chooser: {
                  binding: "target-opponent",
                },
                count: {
                  kind: "up-to",
                  amount: 1,
                },
                unique: true,
                candidates: {
                  kind: "card",
                  zones: ["material-deck"],
                  relationship: "zone-of",
                  player: {
                    binding: "target-opponent",
                  },
                },
              },
              effect: {
                kind: "materialize-card",
                subject: {
                  kind: "bound",
                  binding: "chosen-material-card",
                },
                materializer: {
                  binding: "target-opponent",
                },
                payCosts: true,
              },
            },
          ],
        },
      },
    ],
  },
  yBDxSHkT1s: {
    provenance: "Migrated from the previously maintained generated definition for twinstar-tonic.",
    abilities: [
      {
        id: "yBDxSHkT1s-a1",
        kind: "static",
        staticKind: "intrinsic",
        text: "[Arisanna Bonus] Brew — Two Blightroot, Two Silvershine, Two Razorvine",
        keyword: {
          name: "brew",
          requirements: [
            {
              kind: "name",
              value: "Blightroot",
              count: 2,
            },
            {
              kind: "name",
              value: "Silvershine",
              count: 2,
            },
            {
              kind: "name",
              value: "Razorvine",
              count: 2,
            },
          ],
        },
        restrictions: [
          {
            kind: "static",
            name: "champion-bonus",
            condition: {
              kind: "champion-lineage-is",
              name: "Arisanna",
            },
          },
        ],
      },
      {
        id: "yBDxSHkT1s-a2",
        kind: "activated",
        text: "Sacrifice Twinstar Tonic: For the rest of the game, whenever you starcall a card, you may copy that activation. If you do, you may choose new targets for that copy.",
        activation: "ability",
        cost: {
          kind: "sacrifice",
          subject: {
            kind: "source",
          },
        },
        effect: {
          kind: "create-delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              activationState: "starcalled",
              isCopy: false,
            },
          },
          expires: {
            kind: "permanent",
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "copy",
              subject: {
                kind: "event-subject",
              },
              copy: "card-activation",
              amount: 1,
              mayChooseNewTargets: true,
            },
          },
        },
      },
    ],
  },
  QX72P4Xx1A: {
    provenance:
      "Migrated from the previously maintained generated definition for seraphic-legions-descent.",
    abilities: [
      {
        id: "QX72P4Xx1A-a1",
        kind: "triggered",
        text: "On Enter: Search your deck for any amount of Angel ally cards. Banish those cards along with any amount of Angel ally cards from your hand, memory, and/or graveyard. Shuffle your deck. Then draw a card into your memory for each card banished from your hand and memory this way.",
        trigger: {
          kind: "event",
          event: {
            name: "object-entered-field",
            subject: {
              kind: "source",
            },
          },
        },
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "search",
              player: "controller",
              zone: "main-deck",
              selection: {
                id: "searched-angels",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "any-number",
                },
                candidates: {
                  kind: "card",
                  zones: ["main-deck"],
                  relationship: "zone-of",
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["ANGEL"],
                      },
                    ],
                  },
                },
              },
              reveal: true,
            },
            {
              kind: "move",
              subject: {
                kind: "bound",
                binding: "searched-angels",
              },
              from: "main-deck",
              destination: {
                zone: "banishment",
              },
            },
            {
              kind: "choose",
              selection: {
                id: "hand-memory-angels",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "any-number",
                },
                unique: true,
                candidates: {
                  kind: "card",
                  zones: ["hand", "memory"],
                  relationship: "zone-of",
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["ANGEL"],
                      },
                    ],
                  },
                },
              },
              effect: {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "hand-memory-angels",
                },
                destination: {
                  zone: "banishment",
                },
                bindResultAs: "banished-hand-memory-count",
              },
            },
            {
              kind: "choose",
              selection: {
                id: "graveyard-angels",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "any-number",
                },
                candidates: {
                  kind: "card",
                  zones: ["graveyard"],
                  relationship: "zone-of",
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["ANGEL"],
                      },
                    ],
                  },
                },
              },
              effect: {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "graveyard-angels",
                },
                from: "graveyard",
                destination: {
                  zone: "banishment",
                },
              },
            },
            {
              kind: "shuffle",
              player: "controller",
              zone: "main-deck",
            },
            {
              kind: "draw",
              player: "controller",
              amount: {
                kind: "binding-count",
                binding: "banished-hand-memory-count",
              },
              to: "memory",
            },
          ],
        },
      },
      {
        id: "QX72P4Xx1A-a2",
        kind: "activated",
        text: "[Level 3+] (1), REST: Until end of turn, you may activate target card banished by Seraphic Legion's Descent.",
        activation: "ability",
        cost: {
          kind: "all",
          costs: [
            {
              kind: "pay-reserve",
              amount: 1,
            },
            {
              kind: "rest",
              subject: {
                kind: "source",
              },
            },
          ],
        },
        targets: [
          {
            id: "target-banished-card",
            kind: "target",
            declared: "announcement",
            chooser: "controller",
            count: {
              kind: "exactly",
              amount: 1,
            },
            unique: true,
            candidates: {
              kind: "card",
              zones: ["banishment"],
              relationship: "banished-by",
              host: {
                kind: "source",
              },
            },
          },
        ],
        restrictions: [
          {
            kind: "static",
            name: "level-restriction",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "property",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  property: "level",
                  basis: "current",
                },
                operator: "gte",
                right: 3,
              },
            },
          },
        ],
        effect: {
          kind: "rule-modification",
          mode: "allow",
          action: "activate",
          subject: {
            kind: "bound",
            binding: "target-banished-card",
          },
          duration: {
            kind: "this-turn",
          },
        },
      },
    ],
  },
  qhBecpDUO9: {
    provenance:
      "Migrated from the previously maintained generated definition for supernova-divination.",
    abilities: [
      {
        id: "qhBecpDUO9-a1",
        kind: "static",
        staticKind: "intrinsic",
        text: "Spellshroud",
        keyword: {
          name: "spellshroud",
        },
      },
      {
        id: "qhBecpDUO9-a2",
        kind: "triggered",
        text: "[Arisanna Bonus] At the beginning of each player's recollection phase and whenever you starcall a card, put a divination counter on Supernova Divination. Then if there are ten divination counters on Supernova Divination, sacrifice it. If you do, all units you don't control lose all abilities until end of turn. Then deal 25 unpreventable damage to each of them.",
        trigger: {
          kind: "event",
          event: {
            anyOf: [
              {
                name: "phase-begins",
                phase: "recollection",
              },
              {
                name: "card-activated",
                actor: "controller",
                activationState: "starcalled",
                isCopy: false,
              },
            ],
          },
        },
        restrictions: [
          {
            kind: "static",
            name: "champion-bonus",
            condition: {
              kind: "champion-lineage-is",
              name: "Arisanna",
            },
          },
        ],
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "add-counter",
              subject: {
                kind: "source",
              },
              counter: {
                named: "divination",
              },
              amount: 1,
            },
            {
              kind: "conditional",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "divination",
                },
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "source",
                    },
                    counter: {
                      named: "divination",
                    },
                  },
                  operator: "eq",
                  right: 10,
                },
              },
              then: {
                kind: "reflexive",
                action: {
                  kind: "sacrifice",
                  subject: {
                    kind: "source",
                  },
                },
                consequence: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "continuous",
                      subjects: {
                        kind: "each",
                        collection: {
                          zones: ["field"],
                          player: "each-opponent",
                          filter: {
                            kind: "type",
                            oneOf: ["ALLY", "CHAMPION"],
                          },
                        },
                      },
                      affectedSet: "locked",
                      duration: {
                        kind: "this-turn",
                      },
                      layer: {
                        layer: "D",
                        modifies: "ability",
                      },
                      change: {
                        kind: "remove-abilities",
                      },
                    },
                    {
                      kind: "deal-damage",
                      source: {
                        kind: "source",
                      },
                      recipient: {
                        kind: "each",
                        collection: {
                          zones: ["field"],
                          player: "each-opponent",
                          filter: {
                            kind: "type",
                            oneOf: ["ALLY", "CHAMPION"],
                          },
                        },
                      },
                      amount: 25,
                      preventable: false,
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    ],
  },
} as const;

export function assertGrandArchiveAbilityOverrideKeys(liveCanonicalIds: ReadonlySet<string>): void {
  for (const canonicalId of Object.keys(GRAND_ARCHIVE_ABILITY_OVERRIDES)) {
    if (!liveCanonicalIds.has(canonicalId)) {
      throw new Error(
        `Grand Archive ability override ${canonicalId} does not match a face in the current catalog.`,
      );
    }
  }
}
