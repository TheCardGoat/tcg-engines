import type { FabCardDefinitionInput } from "../cards.ts";

/** Generated bounded definitions used by fixtures and automation smoke tests. */
export const generatedCatalogTestCards = {
  rhinar: {
    canonicalId: "wr9wBtTWwRrPrdhCRHCdN",
    slug: "rhinar-reckless-rampage",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Rhinar, Reckless Rampage"],
      activeFaceIds: ["wr9wBtTWwRrPrdhCRHCdN:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Brute"],
          types: ["Hero"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Brute"],
        types: ["Hero"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["wr9wBtTWwRrPrdhCRHCdN"],
      numeric: {
        life: 40,
        intellect: 4,
      },
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event-and-state",
            event: {
              name: "discard",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "event-object",
                selector: "discarded-card",
                relationship: {
                  kind: "any",
                },
                filter: {
                  numeric: [
                    {
                      property: "power",
                      basis: "current",
                      comparison: {
                        op: "gte",
                        value: 6,
                      },
                    },
                  ],
                },
              },
            },
            state: {
              type: "turn-player",
              who: "self",
            },
          },
          label: {
            name: "intimidate",
          },
          id: "wr9wBtTWwRrPrdhCRHCdN:wheneverDiscard6MorePowerDuringActionPhaseIntimidate",
          text: "Whenever you discard a card with 6 or more {p} during your action phase, intimidate.",
          resolution: {
            kind: "effect",
            effect: {
              type: "intimidate",
              target: "opponent",
            },
          },
        },
      ],
    },
  },
  bravo: {
    canonicalId: "NtLDgPBR7HqDqhDzJMHmk",
    slug: "bravo-showstopper",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Bravo, Showstopper"],
      activeFaceIds: ["NtLDgPBR7HqDqhDzJMHmk:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Guardian"],
          types: ["Hero"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Guardian"],
        types: ["Hero"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["NtLDgPBR7HqDqhDzJMHmk"],
      numeric: {
        life: 40,
        intellect: 4,
      },
      keywords: [],
      abilities: [
        {
          kind: "activated",
          abilityType: "action",
          cost: {
            class: "asset",
            type: "resources",
            amount: 2,
          },
          layerKeywords: [
            {
              name: "go-again",
            },
          ],
          effect: {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: {
                name: "dominate",
              },
            },
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["stack", "combat-chain"],
              filter: {
                numeric: [
                  {
                    property: "cost",
                    basis: "base",
                    comparison: {
                      op: "gte",
                      value: 3,
                    },
                  },
                ],
                typeBox: {
                  types: ["Action"],
                  subtypes: ["Attack"],
                },
              },
              count: {
                type: "all",
              },
            },
            duration: "this-turn",
          },
          id: "NtLDgPBR7HqDqhDzJMHmk:actionResourceResourceEndTurnAttackActionCost3GreaterGainsDominateGoAgain",
          text: "Action - {r}{r}: Until end of turn, your attack action cards with cost 3 or greater gains dominate. Go again",
        },
      ],
    },
  },
  gravy: {
    canonicalId: "wbjNnhBq6cMwDfwdtrkhn",
    slug: "gravy-bones-shipwrecked-looter",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Gravy Bones, Shipwrecked Looter"],
      activeFaceIds: ["wbjNnhBq6cMwDfwdtrkhn:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Necromancer", "Pirate"],
          types: ["Hero"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Necromancer", "Pirate"],
        types: ["Hero"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["wbjNnhBq6cMwDfwdtrkhn"],
      numeric: {
        life: 40,
        intellect: 4,
      },
      keywords: [],
      abilities: [
        {
          kind: "activated",
          abilityType: "instant",
          cost: {
            class: "mixed",
            type: "all",
            costs: [
              {
                class: "effect",
                type: "tap-self",
              },
              {
                class: "effect",
                type: "destroy",
                filter: {
                  name: "Gold",
                },
              },
            ],
          },
          effect: {
            type: "sequence",
            steps: [
              {
                type: "draw",
                count: 1,
                player: "controller",
              },
              {
                type: "discard",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hand"],
                  count: 1,
                },
                outputBinding: "it",
              },
            ],
          },
          id: "wbjNnhBq6cMwDfwdtrkhn:instantTapDestroyGoldDrawThenDiscard",
          text: "Instant - {t}, destroy a Gold you control: Draw a card, then discard a card.\nIf a blue card has been put into your graveyard this turn, you may play cards with watery grave from your graveyard.",
        },
        {
          kind: "static",
          staticKind: "play",
          condition: {
            type: "performed-this-turn",
            event: "put-blue-card-into-graveyard",
            player: "controller",
          },
          playEffect: {
            role: "permission",
            fromZones: ["graveyard"],
            filter: {
              hasKeyword: "watery-grave",
            },
            optional: true,
          },
          id: "wbjNnhBq6cMwDfwdtrkhn:bluePutGraveyardTurnPlayWateryGraveGraveyard",
          text: "Instant - {t}, destroy a Gold you control: Draw a card, then discard a card.\nIf a blue card has been put into your graveyard this turn, you may play cards with watery grave from your graveyard.",
        },
      ],
    },
  },
  marlynn: {
    canonicalId: "rTNChdmHbjN7HPNJJLzCt",
    slug: "marlynn-treasure-hunter",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Marlynn, Treasure Hunter"],
      activeFaceIds: ["rTNChdmHbjN7HPNJJLzCt:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Pirate", "Ranger"],
          types: ["Hero"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Pirate", "Ranger"],
        types: ["Hero"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["rTNChdmHbjN7HPNJJLzCt"],
      numeric: {
        life: 40,
        intellect: 4,
      },
      keywords: [],
      abilities: [
        {
          kind: "activated",
          abilityType: "action",
          cost: {
            class: "mixed",
            type: "all",
            costs: [
              {
                class: "effect",
                type: "tap-self",
              },
              {
                class: "effect",
                type: "destroy",
                filter: {
                  name: "Gold",
                },
              },
            ],
          },
          layerKeywords: [
            {
              name: "go-again",
            },
          ],
          effect: {
            type: "create-token",
            token: "goldfin-harpoon",
            controller: "controller",
            to: {
              zone: "hand",
            },
          },
          id: "rTNChdmHbjN7HPNJJLzCt:actionTapDestroyGoldCreateGoldfinHarpoonHandGoAgain",
          text: "Action - {t}, destroy a Gold you control: Create a Goldfin Harpoon in your hand. Go again\nWhenever you draw a card during your action phase, you may put an arrow from your hand face-up into your arsenal.",
        },
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event-and-state",
            event: {
              name: "draw",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "none",
              },
              during: {
                kind: "phase",
                phase: "action",
              },
            },
            state: {
              type: "turn-player",
              who: "self",
            },
          },
          id: "rTNChdmHbjN7HPNJJLzCt:wheneverDrawDuringActionPhasePutArrowHandFaceUpArsenal",
          text: "Action - {t}, destroy a Gold you control: Create a Goldfin Harpoon in your hand. Go again\nWhenever you draw a card during your action phase, you may put an arrow from your hand face-up into your arsenal.",
          resolution: {
            kind: "effect",
            effect: {
              type: "optional",
              effect: {
                type: "move-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hand"],
                  filter: {
                    typeBox: {
                      subtypes: ["Arrow"],
                    },
                  },
                  count: 1,
                },
                to: {
                  zone: "arsenal",
                  visibility: "face-up",
                },
                outputBinding: "it",
              },
            },
          },
        },
      ],
    },
  },
  puffin: {
    canonicalId: "DghbPmFhwLkT9whJJjL9f",
    slug: "puffin-hightail",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Puffin, Hightail"],
      activeFaceIds: ["DghbPmFhwLkT9whJJjL9f:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Mechanologist", "Pirate"],
          types: ["Hero"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Mechanologist", "Pirate"],
        types: ["Hero"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["DghbPmFhwLkT9whJJjL9f"],
      numeric: {
        life: 40,
        intellect: 4,
      },
      keywords: [],
      abilities: [
        {
          kind: "activated",
          abilityType: "action",
          cost: {
            class: "mixed",
            type: "all",
            costs: [
              {
                class: "effect",
                type: "tap-self",
              },
              {
                class: "effect",
                type: "destroy",
                filter: {
                  name: "Gold",
                },
              },
            ],
          },
          effect: {
            type: "create-token",
            token: "golden-cog",
            controller: "controller",
          },
          id: "DghbPmFhwLkT9whJJjL9f:actionTapDestroyGoldCreateGoldenCogToken",
          text: "Action - {t}, destroy a Gold you control: Create a Golden Cog token.\nThe second time you crank each turn, draw a card.",
        },
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "crank",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "none",
              },
            },
          },
          limit: {
            count: 1,
            per: "turn",
            ordinals: [2],
          },
          id: "DghbPmFhwLkT9whJJjL9f:secondTimeCrankTurnDraw",
          text: "Action - {t}, destroy a Gold you control: Create a Golden Cog token.\nThe second time you crank each turn, draw a card.",
          resolution: {
            kind: "effect",
            effect: {
              type: "draw",
              count: 1,
              player: "controller",
            },
          },
        },
      ],
    },
  },
  pleiades: {
    canonicalId: "JhgRJb6nfctWkndbzrgnj",
    slug: "pleiades-superstar",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Pleiades, Superstar"],
      activeFaceIds: ["JhgRJb6nfctWkndbzrgnj:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Guardian", "Revered"],
          types: ["Hero"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Guardian", "Revered"],
        types: ["Hero"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["JhgRJb6nfctWkndbzrgnj"],
      numeric: {
        life: 40,
        intellect: 4,
      },
      keywords: [],
      abilities: [
        {
          kind: "activated",
          abilityType: "instant",
          cost: {
            class: "mixed",
            type: "all",
            costs: [
              {
                class: "effect",
                type: "tap-self",
              },
              {
                class: "effect",
                type: "remove-counters",
                counter: {
                  kind: "named",
                  name: "suspense",
                },
                count: 1,
                filter: {
                  typeBox: {
                    subtypes: ["Aura"],
                  },
                },
              },
            ],
          },
          effect: {
            type: "optional",
            effect: {
              type: "add-counter",
              counter: {
                kind: "named",
                name: "suspense",
              },
              count: 1,
              target: {
                selector: "object",
                declared: "on-stack",
                player: "controller",
                zones: ["permanent"],
                filter: {
                  typeBox: {
                    subtypes: ["Aura"],
                  },
                  hasKeyword: "suspense",
                },
                count: 1,
              },
            },
          },
          id: "JhgRJb6nfctWkndbzrgnj:instantTapRemoveSuspenseCounterAuraPutSuspenseCounterAuraSuspense",
          text: "Instant - {t}, remove a suspense counter from an aura you control: You may put a suspense counter on an aura of suspense you control.\nWhenever the crowd cheers you, create a Confidence token.",
        },
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "crowd-cheers",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "none",
              },
            },
          },
          id: "JhgRJb6nfctWkndbzrgnj:wheneverCrowdCheersCreateConfidenceToken",
          text: "Instant - {t}, remove a suspense counter from an aura you control: You may put a suspense counter on an aura of suspense you control.\nWhenever the crowd cheers you, create a Confidence token.",
          resolution: {
            kind: "effect",
            effect: {
              type: "create-token",
              token: "confidence",
              controller: "controller",
            },
          },
        },
      ],
    },
  },
  kayo: {
    canonicalId: "fMDbBJHTPL7dcMMFNkCCm",
    slug: "kayo-underhanded-cheat",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Kayo, Underhanded Cheat"],
      activeFaceIds: ["fMDbBJHTPL7dcMMFNkCCm:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Brute", "Reviled"],
          types: ["Hero"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Brute", "Reviled"],
        types: ["Hero"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["fMDbBJHTPL7dcMMFNkCCm"],
      numeric: {
        life: 40,
        intellect: 4,
      },
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "meta",
          effect: {
            type: "start-game",
            setup: "zone-counts",
            zoneCounts: [
              {
                zone: "weapon",
                count: 1,
              },
            ],
          },
          id: "fMDbBJHTPL7dcMMFNkCCm:startGame1WeaponZone",
          text: "You start the game with 1 weapon zone.\nInstant - {r}{r}{r}{r}, {t}: Target attack action card you control has 6 base {p}.\nWhenever the crowd boos you, create a Vigor token.",
        },
        {
          kind: "activated",
          abilityType: "instant",
          cost: {
            class: "mixed",
            type: "all",
            costs: [
              {
                class: "asset",
                type: "resources",
                amount: 4,
              },
              {
                class: "effect",
                type: "tap-self",
              },
            ],
          },
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "set-base",
            amount: 6,
            target: {
              selector: "object",
              declared: "on-stack",
              player: "controller",
              zones: ["combat-chain"],
              filter: {
                typeBox: {
                  types: ["Action"],
                  subtypes: ["Attack"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
          },
          id: "fMDbBJHTPL7dcMMFNkCCm:instantResourceResourceResourceResourceTapTargetAttackAction6BasePower",
          text: "You start the game with 1 weapon zone.\nInstant - {r}{r}{r}{r}, {t}: Target attack action card you control has 6 base {p}.\nWhenever the crowd boos you, create a Vigor token.",
        },
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "crowd-boos",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "none",
              },
            },
          },
          id: "fMDbBJHTPL7dcMMFNkCCm:wheneverCrowdBoosCreateVigorToken",
          text: "You start the game with 1 weapon zone.\nInstant - {r}{r}{r}{r}, {t}: Target attack action card you control has 6 base {p}.\nWhenever the crowd boos you, create a Vigor token.",
          resolution: {
            kind: "effect",
            effect: {
              type: "create-token",
              token: "vigor",
              controller: "controller",
            },
          },
        },
      ],
    },
  },
  lyath: {
    canonicalId: "MgKprw8PQjNKC7JDmppHh",
    slug: "lyath-goldmane-vile-savant",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Lyath Goldmane, Vile Savant"],
      activeFaceIds: ["MgKprw8PQjNKC7JDmppHh:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Guardian", "Reviled"],
          types: ["Hero"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Guardian", "Reviled"],
        types: ["Hero"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["MgKprw8PQjNKC7JDmppHh"],
      numeric: {
        life: 40,
        intellect: 5,
      },
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "continuous",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "modify-numeric",
                property: "power",
                op: "divide",
                amount: 2,
                rounding: "up",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: [
                    "combat-chain",
                    "stack",
                    "hand",
                    "deck",
                    "arsenal",
                    "graveyard",
                    "banished",
                  ],
                  count: {
                    type: "all",
                  },
                },
                duration: "while-in-arena",
              },
              {
                type: "modify-numeric",
                property: "defense",
                op: "divide",
                amount: 2,
                rounding: "up",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: [
                    "combat-chain",
                    "stack",
                    "hand",
                    "deck",
                    "arsenal",
                    "graveyard",
                    "banished",
                  ],
                  count: {
                    type: "all",
                  },
                },
                duration: "while-in-arena",
              },
            ],
          },
          id: "MgKprw8PQjNKC7JDmppHh:basePowerDefenseHalvedRoundedUp",
          text: "The base {p} and {d} of cards you control are halved, rounded up.\nInstant - {r}{r}, {t}: The crowd boos you. Defending action cards you control get +1{d} this turn.\nWhenever the crowd boos you, create a Might token.",
        },
        {
          kind: "activated",
          abilityType: "instant",
          cost: {
            class: "mixed",
            type: "all",
            costs: [
              {
                class: "asset",
                type: "resources",
                amount: 2,
              },
              {
                class: "effect",
                type: "tap-self",
              },
            ],
          },
          effect: {
            type: "sequence",
            steps: [
              {
                type: "crowd-boos",
                target: "controller",
              },
              {
                type: "modify-numeric",
                property: "defense",
                op: "add",
                amount: 1,
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["permanent", "combat-chain"],
                  filter: {
                    typeBox: {
                      types: ["Action"],
                    },
                    defending: true,
                  },
                  count: {
                    type: "all",
                  },
                },
                duration: "this-turn",
              },
            ],
          },
          id: "MgKprw8PQjNKC7JDmppHh:instantResourceResourceTapCrowdBoosDefendingActionGet1DefenseTurn",
          text: "The base {p} and {d} of cards you control are halved, rounded up.\nInstant - {r}{r}, {t}: The crowd boos you. Defending action cards you control get +1{d} this turn.\nWhenever the crowd boos you, create a Might token.",
        },
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "crowd-boos",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "none",
              },
            },
          },
          id: "MgKprw8PQjNKC7JDmppHh:wheneverCrowdBoosCreateMightToken",
          text: "The base {p} and {d} of cards you control are halved, rounded up.\nInstant - {r}{r}, {t}: The crowd boos you. Defending action cards you control get +1{d} this turn.\nWhenever the crowd boos you, create a Might token.",
          resolution: {
            kind: "effect",
            effect: {
              type: "create-token",
              token: "might",
              controller: "controller",
            },
          },
        },
      ],
    },
  },
  teklovossen: {
    canonicalId: "ndKnMFtcDt8JmPFD6bfbk",
    slug: "teklovossen-esteemed-magnate",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Teklovossen, Esteemed Magnate"],
      activeFaceIds: ["ndKnMFtcDt8JmPFD6bfbk:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Mechanologist"],
          types: ["Hero"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Mechanologist"],
        types: ["Hero"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["ndKnMFtcDt8JmPFD6bfbk"],
      numeric: {
        life: 40,
        intellect: 4,
      },
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "play",
          playEffect: {
            role: "permission",
            fromZones: ["banished"],
            filter: {
              typeBox: {
                subtypes: ["Evo"],
              },
            },
          },
          id: "ndKnMFtcDt8JmPFD6bfbk:playEvosBanishedZone",
          text: "You may play Evos from your banished zone.\nOnce per Turn Instant - {r}{r}{r}: You may play your next Evo this turn as though it were an instant. When you do, draw a card.",
        },
        {
          kind: "activated",
          limit: {
            count: 1,
            per: "turn",
          },
          abilityType: "instant",
          cost: {
            class: "asset",
            type: "resources",
            amount: 3,
          },
          effect: {
            type: "sequence",
            steps: [
              {
                type: "play-card",
                source: {
                  selector: "self",
                },
                appliesTo: {
                  next: {
                    typeBox: {
                      subtypes: ["Evo"],
                    },
                  },
                  events: ["play", "attack"],
                },
                duration: "this-turn",
                asType: "instant",
              },
              {
                type: "delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "play",
                    actor: {
                      kind: "player",
                      player: "ability-controller",
                    },
                    observes: {
                      kind: "event-object",
                      selector: "played-card",
                      relationship: {
                        kind: "controller",
                        player: "ability-controller",
                      },
                      filter: {
                        typeBox: {
                          subtypes: ["Evo"],
                        },
                      },
                    },
                  },
                },
                policy: {
                  kind: "windowed",
                  duration: "this-turn",
                  matching: "first",
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "draw",
                    count: 1,
                    player: "controller",
                  },
                },
              },
            ],
          },
          id: "ndKnMFtcDt8JmPFD6bfbk:oncePerTurnInstantResourceResourceResourcePlayNextEvoTurnThoughWereInstantDraw",
          text: "You may play Evos from your banished zone.\nOnce per Turn Instant - {r}{r}{r}: You may play your next Evo this turn as though it were an instant. When you do, draw a card.",
        },
      ],
    },
  },
  arakni: {
    canonicalId: "rzm9GQbbBrrDzLQRcB6kK",
    slug: "arakni-marionette",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Arakni, Marionette"],
      activeFaceIds: ["rzm9GQbbBrrDzLQRcB6kK:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Assassin", "Chaos"],
          types: ["Hero"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Assassin", "Chaos"],
        types: ["Hero"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["rzm9GQbbBrrDzLQRcB6kK"],
      numeric: {
        life: 40,
        intellect: 4,
      },
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "continuous",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 1,
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["combat-chain"],
                  filter: {
                    typeBox: {
                      subtypes: ["Attack"],
                    },
                    hasKeyword: "stealth",
                    hasStatus: "attacking-a-marked-hero",
                  },
                  count: {
                    type: "all",
                  },
                },
                duration: "while-in-arena",
              },
              {
                type: "grant-property",
                property: {
                  kind: "ability",
                  ability: {
                    kind: "static",
                    staticKind: "triggered",
                    id: "rzm9GQbbBrrDzLQRcB6kK:attacksStealthAttackingMarkedGet1PowerHitsGetsGoAgain:hitsGetsGoAgain",
                    text: 'Your attacks with stealth that are attacking a marked hero get +1{p} and "When this hits, this gets go again."\nAt the beginning of your end phase, if an opponent is marked, you become a random Agent of Chaos.',
                    trigger: {
                      kind: "event",
                      event: {
                        name: "hit",
                        actor: {
                          kind: "player",
                          player: "ability-controller",
                        },
                        observes: {
                          kind: "source",
                          selector: "attack",
                        },
                      },
                    },
                    resolution: {
                      kind: "effect",
                      effect: {
                        type: "grant-property",
                        property: {
                          kind: "keyword",
                          keyword: {
                            name: "go-again",
                          },
                        },
                        target: {
                          selector: "self",
                        },
                        duration: "this-turn",
                      },
                    },
                  },
                },
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["combat-chain"],
                  filter: {
                    typeBox: {
                      subtypes: ["Attack"],
                    },
                    hasKeyword: "stealth",
                    hasStatus: "attacking-a-marked-hero",
                  },
                  count: {
                    type: "all",
                  },
                },
                duration: "while-in-arena",
              },
            ],
          },
          id: "rzm9GQbbBrrDzLQRcB6kK:attacksStealthAttackingMarkedGet1PowerHitsGetsGoAgain",
          text: 'Your attacks with stealth that are attacking a marked hero get +1{p} and "When this hits, this gets go again."\nAt the beginning of your end phase, if an opponent is marked, you become a random Agent of Chaos.',
        },
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event-and-state",
            event: {
              name: "end-phase",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "none",
              },
            },
            state: {
              type: "is-marked",
              target: {
                selector: "opponent",
              },
            },
          },
          id: "rzm9GQbbBrrDzLQRcB6kK:beginningEndPhaseOpponentMarkedBecomeRandomAgentChaos",
          text: 'Your attacks with stealth that are attacking a marked hero get +1{p} and "When this hits, this gets go again."\nAt the beginning of your end phase, if an opponent is marked, you become a random Agent of Chaos.',
          resolution: {
            kind: "effect",
            effect: {
              type: "copy",
              target: {
                selector: "controller",
              },
              source: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["inventory"],
                filter: {
                  typeBox: {
                    traits: ["Agent of Chaos"],
                  },
                },
                count: 1,
                random: true,
              },
              duration: "permanent",
              except: "base-life",
              observation: "become",
            },
          },
        },
      ],
    },
  },
  valda: {
    canonicalId: "bjLbTMgMm6QRWBRrw8chQ",
    slug: "valda-seismic-impact",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Valda, Seismic Impact"],
      activeFaceIds: ["bjLbTMgMm6QRWBRrw8chQ:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Guardian"],
          types: ["Hero"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Guardian"],
        types: ["Hero"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["bjLbTMgMm6QRWBRrw8chQ"],
      numeric: {
        life: 40,
        intellect: 4,
      },
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "draw",
              actor: {
                kind: "player",
                player: "opponent",
              },
              observes: {
                kind: "none",
              },
              during: {
                kind: "phase",
                phase: "action",
              },
              amount: {
                op: "gte",
                value: 1,
              },
            },
          },
          id: "bjLbTMgMm6QRWBRrw8chQ:wheneverOpponentDraws1MoreDuringActionPhaseCreateManySeismicSurgeTokens",
          text: "Whenever an opponent draws 1 or more cards during an action phase, create that many Seismic Surge tokens.\nAt the start of your turn, if you control 3 or more Siesmic Surge tokens, cards you own with crush get dominate this turn.",
          resolution: {
            kind: "effect",
            effect: {
              type: "create-token",
              token: "seismic-surge",
              controller: "controller",
              count: {
                type: "event-amount",
              },
            },
          },
        },
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event-and-state",
            event: {
              name: "start-phase",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "none",
              },
            },
            state: {
              type: "zone-count",
              zone: "permanent",
              player: "controller",
              filter: {
                name: "Seismic Surge",
                typeBox: {
                  metatypes: ["Token"],
                },
              },
              comparison: {
                op: "gte",
                value: 3,
              },
            },
          },
          id: "bjLbTMgMm6QRWBRrw8chQ:startTurn3MoreSeismicSurgeTokensCrushGetDominateTurn",
          text: "Whenever an opponent draws 1 or more cards during an action phase, create that many Seismic Surge tokens.\nAt the start of your turn, if you control 3 or more Siesmic Surge tokens, cards you own with crush get dominate this turn.",
          resolution: {
            kind: "effect",
            effect: {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: {
                  name: "dominate",
                },
              },
              duration: "this-turn",
              appliesTo: {
                next: {
                  hasLabel: "crush",
                },
                count: {
                  type: "all",
                },
                events: ["play", "attack"],
              },
            },
          },
        },
      ],
    },
  },
  aurora: {
    canonicalId: "WDhGzj9m8MWhkkfRMB7Jg",
    slug: "aurora-legacy-of-tempest",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Aurora, Legacy of Tempest"],
      activeFaceIds: ["WDhGzj9m8MWhkkfRMB7Jg:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Runeblade", "Lightning"],
          types: ["Hero"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Runeblade", "Lightning"],
        types: ["Hero"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["WDhGzj9m8MWhkkfRMB7Jg"],
      numeric: {
        life: 40,
        intellect: 4,
      },
      keywords: [],
      abilities: [
        {
          kind: "activated",
          abilityType: "instant",
          cost: {
            class: "mixed",
            type: "all",
            costs: [
              {
                class: "asset",
                type: "resources",
                amount: 2,
              },
              {
                class: "effect",
                type: "tap-self",
              },
              {
                class: "effect",
                type: "destroy",
                filter: {
                  name: "Lightning Flow",
                },
              },
            ],
          },
          effect: {
            type: "create-token",
            token: "embodiment-of-lightning",
            controller: "controller",
          },
          id: "WDhGzj9m8MWhkkfRMB7Jg:instantResourceResourceTapDestroyLightningFlowCreateEmbodimentLightningToken",
          text: "Instant - {r}{r}, {t}, destroy a Lightning Flow you control: Create an Embodiment of Lightning token.",
        },
      ],
    },
  },
  oscilio: {
    canonicalId: "nqbttmdCrgTbFBjJBzLtz",
    slug: "oscilio-forked-continuum",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Oscilio, Forked Continuum"],
      activeFaceIds: ["nqbttmdCrgTbFBjJBzLtz:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Wizard", "Lightning"],
          types: ["Hero"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Wizard", "Lightning"],
        types: ["Hero"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["nqbttmdCrgTbFBjJBzLtz"],
      numeric: {
        life: 38,
        intellect: 4,
      },
      keywords: [],
      abilities: [
        {
          kind: "activated",
          abilityType: "instant",
          cost: {
            class: "mixed",
            type: "all",
            costs: [
              {
                class: "asset",
                type: "resources",
                amount: 1,
              },
              {
                class: "effect",
                type: "tap-self",
              },
              {
                class: "effect",
                type: "destroy",
                filter: {
                  name: "Lightning Flow",
                },
              },
            ],
          },
          effect: {
            type: "sequence",
            steps: [
              {
                type: "discard",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hand"],
                  count: 1,
                },
                outputBinding: "it",
              },
              {
                type: "create-token",
                token: "ponder",
                controller: "controller",
              },
              {
                type: "conditional",
                condition: {
                  type: "binding-matches",
                  binding: "it",
                  filter: {
                    typeBox: {
                      types: ["Instant"],
                    },
                  },
                },
                then: {
                  type: "play-card",
                  fromZones: ["graveyard"],
                  source: {
                    selector: "binding",
                    binding: "it",
                  },
                  duration: "this-turn",
                },
              },
            ],
          },
          id: "nqbttmdCrgTbFBjJBzLtz:instantResourceTapDestroyLightningFlowDiscardCreatePonderTokenInstantDiscardWayPlayTurn",
          text: "Instant - {r}, {t}, destroy a Lightning Flow you control: Discard a card and create a Ponder token. If an instant is discard this way, you may play it this turn.",
        },
      ],
    },
  },
  zyggy: {
    canonicalId: "pnwGDgknLbHc96Ghg8f67",
    slug: "zyggy-starlight",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Zyggy Starlight"],
      activeFaceIds: ["pnwGDgknLbHc96Ghg8f67:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Illusionist", "Lightning"],
          types: ["Hero"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Illusionist", "Lightning"],
        types: ["Hero"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["pnwGDgknLbHc96Ghg8f67"],
      numeric: {
        life: 40,
        intellect: 4,
      },
      keywords: [],
      abilities: [
        {
          kind: "activated",
          abilityType: "instant",
          cost: {
            class: "mixed",
            type: "all",
            costs: [
              {
                class: "asset",
                type: "resources",
                amount: 2,
              },
              {
                class: "effect",
                type: "tap-self",
              },
              {
                class: "effect",
                type: "destroy",
                filter: {
                  name: "Lightning Flow",
                },
              },
              {
                class: "effect",
                type: "banish",
                from: "arena",
                count: 1,
                filter: {
                  typeBox: {
                    supertypes: ["Lightning"],
                    subtypes: ["Aura"],
                  },
                  lacksCounter: "holo",
                },
                outputBinding: "banished",
              },
            ],
          },
          effect: {
            type: "sequence",
            steps: [
              {
                type: "move-card",
                target: {
                  selector: "binding",
                  binding: "banished",
                },
                to: {
                  zone: "permanent",
                },
              },
              {
                type: "add-counter",
                counter: {
                  kind: "named",
                  name: "holo",
                },
                count: 1,
                target: {
                  selector: "binding",
                  binding: "banished",
                },
              },
            ],
          },
          id: "pnwGDgknLbHc96Ghg8f67:instantResourceResourceTapDestroyLightningFlowBanishAnotherLightningAuraPermanentNoHoloCountersReturnBanishedAuraArenaHoloCounter",
          text: "Instant - {r}{r}, {t}, destroy a Lightning Flow you control, banish another Lightning aura permanent you control with no holo counters: Return the banished aura to the arena with a holo counter.",
        },
      ],
    },
  },
  rompingClub: {
    canonicalId: "QT8JfjzmzqRR9MWgtgPLR",
    slug: "romping-club",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Romping Club"],
      activeFaceIds: ["QT8JfjzmzqRR9MWgtgPLR:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Brute"],
          types: ["Weapon"],
          subtypes: ["2H", "Club"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Brute"],
        types: ["Weapon"],
        subtypes: ["2H", "Club"],
      },
      traits: [],
      textBoxIds: ["QT8JfjzmzqRR9MWgtgPLR"],
      numeric: {
        power: 4,
      },
      keywords: [],
      abilities: [
        {
          kind: "activated",
          limit: {
            count: 1,
            per: "turn",
          },
          abilityType: "attack",
          cost: {
            class: "asset",
            type: "resources",
            amount: 2,
          },
          effect: {
            type: "attack-with",
            target: {
              selector: "self",
            },
          },
          id: "QT8JfjzmzqRR9MWgtgPLR:oncePerTurnActionResourceResourceAttack",
          text: "Once per Turn Action - {r}{r}: Attack\nOnce per Turn Effect - When you discard a card with 6 or more {p}, Romping Club gains +1{p} until end of turn.",
        },
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "discard",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "event-object",
                selector: "discarded-card",
                relationship: {
                  kind: "any",
                },
                filter: {
                  numeric: [
                    {
                      property: "power",
                      basis: "current",
                      comparison: {
                        op: "gte",
                        value: 6,
                      },
                    },
                  ],
                },
              },
            },
          },
          limit: {
            count: 1,
            per: "turn",
          },
          id: "QT8JfjzmzqRR9MWgtgPLR:oncePerTurnEffectDiscard6MorePowerRompingClubGains1PowerEndTurn",
          text: "Once per Turn Action - {r}{r}: Attack\nOnce per Turn Effect - When you discard a card with 6 or more {p}, Romping Club gains +1{p} until end of turn.",
          resolution: {
            kind: "effect",
            effect: {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 1,
              target: {
                selector: "self",
              },
              duration: "this-turn",
            },
          },
        },
      ],
    },
  },
  anothos: {
    canonicalId: "BFWbnQjgKgRBjw88jK8KH",
    slug: "anothos",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Anothos"],
      activeFaceIds: ["BFWbnQjgKgRBjw88jK8KH:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Guardian"],
          types: ["Weapon"],
          subtypes: ["2H", "Hammer"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Guardian"],
        types: ["Weapon"],
        subtypes: ["2H", "Hammer"],
      },
      traits: [],
      textBoxIds: ["BFWbnQjgKgRBjw88jK8KH"],
      numeric: {
        power: 4,
      },
      keywords: [],
      abilities: [
        {
          kind: "activated",
          limit: {
            count: 1,
            per: "turn",
          },
          abilityType: "attack",
          cost: {
            class: "asset",
            type: "resources",
            amount: 3,
          },
          effect: {
            type: "attack-with",
            target: {
              selector: "self",
            },
          },
          id: "BFWbnQjgKgRBjw88jK8KH:oncePerTurnActionResourceResourceResourceAttack",
          text: "Once per turn Action - {r}{r}{r}: Attack\nWhile there are 2 or more cards with cost 3 or greater in your pitch zone, Anothos has +2{p}.",
        },
        {
          kind: "static",
          staticKind: "while",
          condition: {
            type: "zone-count",
            zone: "pitch",
            player: "controller",
            filter: {
              numeric: [
                {
                  property: "cost",
                  basis: "base",
                  comparison: {
                    op: "gte",
                    value: 3,
                  },
                },
              ],
            },
            comparison: {
              op: "gte",
              value: 2,
            },
          },
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
          id: "BFWbnQjgKgRBjw88jK8KH:there2MoreCost3GreaterPitchZoneAnothos2Power",
          text: "Once per turn Action - {r}{r}{r}: Attack\nWhile there are 2 or more cards with cost 3 or greater in your pitch zone, Anothos has +2{p}.",
        },
      ],
    },
  },
  alphaRampage: {
    canonicalId: "GgDFFHhLh8Kc7tJK8nBLj",
    slug: "alpha-rampage-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Alpha Rampage"],
      activeFaceIds: ["GgDFFHhLh8Kc7tJK8nBLj:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Brute"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Brute"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["GgDFFHhLh8Kc7tJK8nBLj"],
      numeric: {
        pitch: 1,
        cost: 3,
        power: 9,
        defense: 3,
      },
      keywords: [
        {
          name: "specialization",
          hero: "Rhinar",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "play",
          playEffect: {
            role: "additional-cost",
            cost: {
              class: "effect",
              type: "discard",
              count: 1,
              random: true,
            },
          },
          label: {
            name: "intimidate",
          },
          id: "GgDFFHhLh8Kc7tJK8nBLj:asAdditionalCostPlayAlphaRampageDiscardRandom",
          text: "Rhinar Specialization\nAs an additional cost to play Alpha Rampage, discard a random card.\nWhen you attack with Alpha Rampage, intimidate.",
        },
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "attack",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "event-object",
                selector: "attack",
                relationship: {
                  kind: "any",
                },
                filter: {
                  name: "Alpha Rampage",
                },
              },
            },
          },
          label: {
            name: "intimidate",
          },
          id: "GgDFFHhLh8Kc7tJK8nBLj:whenAttackAlphaRampageIntimidate",
          text: "Rhinar Specialization\nAs an additional cost to play Alpha Rampage, discard a random card.\nWhen you attack with Alpha Rampage, intimidate.",
          resolution: {
            kind: "effect",
            effect: {
              type: "intimidate",
              target: "opponent",
            },
          },
        },
      ],
    },
  },
  wreckerRomp: {
    canonicalId: "nPdtpJ7BgkdccWhMGttWr",
    slug: "wrecker-romp-blue",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Wrecker Romp"],
      activeFaceIds: ["nPdtpJ7BgkdccWhMGttWr:face:front"],
      color: "blue",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Brute"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Brute"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["nPdtpJ7BgkdccWhMGttWr"],
      numeric: {
        pitch: 3,
        cost: 2,
        power: 6,
        defense: 3,
      },
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "play",
          playEffect: {
            role: "additional-cost",
            cost: {
              class: "effect",
              type: "discard",
              count: 1,
              random: true,
            },
          },
          id: "nPdtpJ7BgkdccWhMGttWr:additionalCost",
          text: "As an additional cost to play this, discard a random card.",
        },
      ],
    },
  },
  primevalBellow: {
    canonicalId: "HFHk96nMLCb7djccbnWpR",
    slug: "primeval-bellow-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Primeval Bellow"],
      activeFaceIds: ["HFHk96nMLCb7djccbnWpR:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Brute"],
          types: ["Action"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Brute"],
        types: ["Action"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["HFHk96nMLCb7djccbnWpR"],
      numeric: {
        pitch: 1,
        cost: 0,
        defense: 3,
      },
      keywords: [
        {
          name: "go-again",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "play",
          playEffect: {
            role: "additional-cost",
            cost: {
              class: "effect",
              type: "discard",
              count: 1,
              random: true,
            },
          },
          id: "HFHk96nMLCb7djccbnWpR:additionalCost",
          text: "As an additional cost to play Primeval Bellow, discard a random card.\nYour next Brute attack this turn gains +5{p}.\nGo again",
        },
        {
          kind: "resolution",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 5,
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  supertypes: ["Brute"],
                },
              },
              events: ["play", "attack"],
            },
          },
          id: "HFHk96nMLCb7djccbnWpR:nextBruteAttack",
          text: "As an additional cost to play Primeval Bellow, discard a random card.\nYour next Brute attack this turn gains +5{p}.\nGo again",
        },
      ],
    },
  },
  barragingBeatdown: {
    canonicalId: "WCgctGz6KWwfp9Dhd7H7c",
    slug: "barraging-beatdown-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Barraging Beatdown"],
      activeFaceIds: ["WCgctGz6KWwfp9Dhd7H7c:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Brute"],
          types: ["Action"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Brute"],
        types: ["Action"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["WCgctGz6KWwfp9Dhd7H7c"],
      numeric: {
        pitch: 1,
        cost: 0,
        defense: 3,
      },
      keywords: [
        {
          name: "go-again",
        },
      ],
      abilities: [
        {
          kind: "resolution",
          effect: {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                id: "WCgctGz6KWwfp9Dhd7H7c:resolutionGrantPropertyIntimidate:staticWhileHasStatusDefendedByFewerThan2Non",
                text: 'Your next Brute attack this turn gains "While this attack is defended by less than 2 non-equipment cards, it has +4{p}."\nIntimidate\nGo again',
                kind: "static",
                staticKind: "while",
                condition: {
                  type: "has-status",
                  status: "defended-by-fewer-than-2-non-equipment-cards",
                },
                effect: {
                  type: "modify-numeric",
                  property: "power",
                  op: "add",
                  amount: 4,
                  target: {
                    selector: "self",
                  },
                  duration: "permanent",
                },
              },
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  supertypes: ["Brute"],
                },
              },
              events: ["play", "attack"],
            },
          },
          label: {
            name: "intimidate",
          },
          id: "WCgctGz6KWwfp9Dhd7H7c:resolutionGrantPropertyIntimidate",
          text: 'Your next Brute attack this turn gains "While this attack is defended by less than 2 non-equipment cards, it has +4{p}."\nIntimidate\nGo again',
        },
      ],
    },
  },
  enlightenedStrike: {
    canonicalId: "QDrWjRHBmBWBnJHmmbzRM",
    slug: "enlightened-strike-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Enlightened Strike"],
      activeFaceIds: ["QDrWjRHBmBWBnJHmmbzRM:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: [],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: [],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["QDrWjRHBmBWBnJHmmbzRM"],
      numeric: {
        pitch: 1,
        cost: 0,
        power: 5,
        defense: 3,
      },
      keywords: [],
      abilities: [
        {
          kind: "modal",
          modal: {
            choose: 1,
          },
          modes: [
            {
              kind: "resolution",
              effect: {
                type: "delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "attack",
                    actor: {
                      kind: "player",
                      player: "ability-controller",
                    },
                    observes: {
                      kind: "source",
                      selector: "attack",
                    },
                  },
                },
                policy: {
                  kind: "windowed",
                  duration: "this-chain-link",
                  matching: "first",
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "draw",
                    count: 1,
                    player: "controller",
                  },
                },
              },
              id: "QDrWjRHBmBWBnJHmmbzRM:asAdditionalCostPlayEnlightenedStrikePutFromHand:whenAttackEnlightenedStrikeDraw",
              text: "When this attacks, draw a card.",
            },
            {
              kind: "resolution",
              effect: {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 2,
                target: {
                  selector: "self",
                },
                duration: "this-turn",
              },
              id: "QDrWjRHBmBWBnJHmmbzRM:asAdditionalCostPlayEnlightenedStrikePutFromHand:enlightenedStrikeGains2",
              text: "This gains +2{p}.",
            },
            {
              kind: "resolution",
              effect: {
                type: "grant-property",
                property: {
                  kind: "keyword",
                  keyword: {
                    name: "go-again",
                  },
                },
                target: {
                  selector: "self",
                },
                duration: "this-turn",
              },
              id: "QDrWjRHBmBWBnJHmmbzRM:asAdditionalCostPlayEnlightenedStrikePutFromHand:enlightenedStrikeGainsGoAgain",
              text: "This gains go again.",
            },
          ],
          additionalCost: {
            class: "effect",
            type: "move-to-deck",
            from: "hand",
            position: "bottom",
            count: 1,
          },
          id: "QDrWjRHBmBWBnJHmmbzRM:asAdditionalCostPlayEnlightenedStrikePutFromHand",
          text: "As an additional cost to play Enlightened Strike, put a card from your hand on the bottom of your deck.\nChoose 1;\n- When you attack with Enlightened Strike, draw a card.\n- Enlightened Strike gains +2{p}.\n- Enlightened Strike gains go again.",
        },
      ],
    },
  },
  snatch: {
    canonicalId: "PHktCwKzLmBMwmCBwb7Cw",
    slug: "snatch-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Snatch"],
      activeFaceIds: ["PHktCwKzLmBMwmCBwb7Cw:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: [],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: [],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["PHktCwKzLmBMwmCBwb7Cw"],
      numeric: {
        pitch: 1,
        cost: 0,
        power: 4,
        defense: 2,
      },
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "hit",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "attack",
              },
            },
          },
          id: "PHktCwKzLmBMwmCBwb7Cw:drawOnHit",
          text: "When this hits, draw a card.",
          resolution: {
            kind: "effect",
            effect: {
              type: "draw",
              count: 1,
              player: "controller",
            },
          },
        },
      ],
    },
  },
  nimblismBlue: {
    canonicalId: "cQD9DmppBQNGqb9CdqCRc",
    slug: "nimblism-blue",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Nimblism"],
      activeFaceIds: ["cQD9DmppBQNGqb9CdqCRc:face:front"],
      color: "blue",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: [],
          types: ["Action"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: [],
        types: ["Action"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["cQD9DmppBQNGqb9CdqCRc"],
      numeric: {
        pitch: 3,
        cost: 0,
        defense: 2,
      },
      keywords: [
        {
          name: "go-again",
        },
      ],
      abilities: [
        {
          kind: "resolution",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            duration: "this-turn",
            appliesTo: {
              next: {
                cost: {
                  op: "lte",
                  value: 1,
                },
                typeBox: {
                  types: ["Action"],
                  subtypes: ["Attack"],
                },
              },
              events: ["play", "attack"],
            },
          },
          id: "cQD9DmppBQNGqb9CdqCRc:buffNextLowCostAttack",
          text: "The next attack action card with cost 1 or less you play this turn gains +1{p}.\nGo again",
        },
      ],
    },
  },
  nimbleStrike: {
    canonicalId: "tfgqfmpf8PtwhJqcBKDwB",
    slug: "nimble-strike-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Nimble Strike"],
      activeFaceIds: ["tfgqfmpf8PtwhJqcBKDwB:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: [],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: [],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["tfgqfmpf8PtwhJqcBKDwB"],
      numeric: {
        pitch: 1,
        cost: 1,
        power: 4,
        defense: 2,
      },
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "play",
          playEffect: {
            role: "additional-cost",
            cost: {
              class: "effect",
              type: "banish",
              from: "graveyard",
              count: 1,
              filter: {
                name: "Nimblism",
              },
            },
            optional: true,
            then: {
              type: "sequence",
              steps: [
                {
                  type: "modify-numeric",
                  property: "power",
                  op: "add",
                  amount: 1,
                  target: {
                    selector: "self",
                  },
                  duration: "this-turn",
                },
                {
                  type: "grant-property",
                  property: {
                    kind: "keyword",
                    keyword: {
                      name: "go-again",
                    },
                  },
                  target: {
                    selector: "self",
                  },
                  duration: "this-turn",
                },
              ],
            },
          },
          id: "tfgqfmpf8PtwhJqcBKDwB:playBanishNimblismSequenceModifyNumericPowerThisTurnGrantPropertyThisTurn",
          text: "As an additional cost to play Nimble Strike, you may banish a card named Nimblism from your graveyard. If you do, Nimble Strike gain +1{p} and go again.",
        },
      ],
    },
  },
  cripplingCrush: {
    canonicalId: "j8jjnw6NmpTpf9cWThfgg",
    slug: "crippling-crush-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Crippling Crush"],
      activeFaceIds: ["j8jjnw6NmpTpf9cWThfgg:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Guardian"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Guardian"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["j8jjnw6NmpTpf9cWThfgg"],
      numeric: {
        pitch: 1,
        cost: 7,
        power: 11,
        defense: 3,
      },
      keywords: [
        {
          name: "crush",
        },
        {
          name: "specialization",
          hero: "Bravo",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          id: "j8jjnw6NmpTpf9cWThfgg:resolve",
          text: "Bravo Specialization\nCrush - If Crippling Crush deals 4 or more damage to a hero, they discard 2 random cards.",
          trigger: {
            kind: "event",
            event: {
              name: "dealt-damage",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "none",
              },
              amount: {
                op: "gte",
                value: 4,
              },
              target: {
                kind: "hero",
              },
            },
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "discard",
              random: true,
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "attack-target",
                zones: ["hand"],
                count: 2,
              },
            },
          },
          functionalZones: ["combat-chain"],
          label: {
            name: "crush",
          },
        },
      ],
    },
  },
  disable: {
    canonicalId: "7LPnw9zFRhGmKHzCzMpdJ",
    slug: "disable-blue",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Disable"],
      activeFaceIds: ["7LPnw9zFRhGmKHzCzMpdJ:face:front"],
      color: "blue",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Guardian"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Guardian"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["7LPnw9zFRhGmKHzCzMpdJ"],
      numeric: {
        pitch: 3,
        cost: 5,
        power: 7,
        defense: 3,
      },
      keywords: [
        {
          name: "crush",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          id: "7LPnw9zFRhGmKHzCzMpdJ:crush",
          text: "Crush - When this deals 4 or more damage to a hero, put a card from their arsenal on the bottom of their deck.",
          trigger: {
            kind: "event",
            event: {
              name: "dealt-damage",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "none",
              },
              amount: {
                op: "gte",
                value: 4,
              },
              target: {
                kind: "hero",
              },
            },
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "attack-target",
                zones: ["arsenal"],
                count: 1,
              },
              to: {
                zone: "deck",
                position: "bottom",
              },
            },
          },
          functionalZones: ["combat-chain"],
          label: {
            name: "crush",
          },
        },
      ],
    },
  },
  pummel: {
    canonicalId: "zzNQtc8QL8RcCwRcB6JP7",
    slug: "pummel-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Pummel"],
      activeFaceIds: ["zzNQtc8QL8RcCwRcB6JP7:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: [],
          types: ["Attack Reaction"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: [],
        types: ["Attack Reaction"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["zzNQtc8QL8RcCwRcB6JP7"],
      numeric: {
        pitch: 1,
        cost: 2,
        defense: 2,
      },
      keywords: [],
      abilities: [
        {
          kind: "modal",
          modal: {
            choose: 1,
          },
          modes: [
            {
              kind: "resolution",
              id: "zzNQtc8QL8RcCwRcB6JP7:chooseMode:weapon",
              text: "Weapon",
              effect: {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 4,
                target: {
                  selector: "object",
                  declared: "on-stack",
                  zones: ["combat-chain"],
                  filter: {
                    or: [
                      {
                        typeBox: {
                          subtypes: ["Club"],
                        },
                      },
                      {
                        and: [
                          {
                            typeBox: {
                              subtypes: ["Hammer"],
                            },
                          },
                          {
                            typeBox: {
                              types: ["Weapon"],
                            },
                          },
                        ],
                      },
                    ],
                  },
                  count: 1,
                },
                duration: "this-turn",
                outputBinding: "it",
              },
            },
            {
              kind: "resolution",
              id: "zzNQtc8QL8RcCwRcB6JP7:chooseMode:hitHero",
              text: "Hit Hero",
              effect: {
                type: "sequence",
                steps: [
                  {
                    type: "modify-numeric",
                    property: "power",
                    op: "add",
                    amount: 4,
                    target: {
                      selector: "object",
                      declared: "on-stack",
                      zones: ["combat-chain"],
                      filter: {
                        numeric: [
                          {
                            property: "cost",
                            basis: "base",
                            comparison: {
                              op: "gte",
                              value: 2,
                            },
                          },
                        ],
                        typeBox: {
                          types: ["Action"],
                          subtypes: ["Attack"],
                        },
                      },
                      count: 1,
                    },
                    duration: "this-turn",
                  },
                  {
                    type: "grant-property",
                    property: {
                      kind: "ability",
                      ability: {
                        kind: "static",
                        staticKind: "triggered",
                        id: "zzNQtc8QL8RcCwRcB6JP7:chooseMode:hitHero:onHit",
                        text: 'Choose 1;\n- Target club or hammer weapon attack gains +4{p}.\n- Target attack action card with cost 2 or more gets +4{p} and "When this hits a hero, they discard a card."',
                        trigger: {
                          kind: "event",
                          event: {
                            name: "hit",
                            actor: {
                              kind: "player",
                              player: "ability-controller",
                            },
                            observes: {
                              kind: "source",
                              selector: "attack",
                            },
                            target: {
                              kind: "hero",
                            },
                          },
                        },
                        resolution: {
                          kind: "effect",
                          effect: {
                            type: "discard",
                            target: {
                              selector: "object",
                              declared: "at-resolution",
                              player: "attack-target",
                              zones: ["hand"],
                              count: 1,
                            },
                          },
                        },
                      },
                    },
                    target: {
                      selector: "object",
                      declared: "on-stack",
                      zones: ["combat-chain"],
                      filter: {
                        numeric: [
                          {
                            property: "cost",
                            basis: "base",
                            comparison: {
                              op: "gte",
                              value: 2,
                            },
                          },
                        ],
                        typeBox: {
                          types: ["Action"],
                          subtypes: ["Attack"],
                        },
                      },
                      count: 1,
                    },
                    duration: "this-turn",
                  },
                ],
                outputBinding: "it",
              },
            },
          ],
          id: "zzNQtc8QL8RcCwRcB6JP7:chooseMode",
          text: 'Choose 1;\n- Target club or hammer weapon attack gains +4{p}.\n- Target attack action card with cost 2 or more gets +4{p} and "When this hits a hero, they discard a card."',
        },
      ],
    },
  },
  sinkBelow: {
    canonicalId: "LfddJTKKb9HwPzHMBH9w9",
    slug: "sink-below-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Sink Below"],
      activeFaceIds: ["LfddJTKKb9HwPzHMBH9w9:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: [],
          types: ["Defense Reaction"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: [],
        types: ["Defense Reaction"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["LfddJTKKb9HwPzHMBH9w9"],
      numeric: {
        pitch: 1,
        cost: 0,
        defense: 4,
      },
      keywords: [],
      abilities: [
        {
          kind: "resolution",
          effect: {
            type: "optional",
            effect: {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand"],
                count: 1,
              },
              to: {
                zone: "deck",
                position: "bottom",
              },
            },
            then: {
              type: "draw",
              count: 1,
              player: "controller",
            },
          },
          id: "LfddJTKKb9HwPzHMBH9w9:bottomAndDraw",
          text: "You may put a card from your hand on the bottom of your deck. If you do, draw a card.",
        },
      ],
    },
  },
  unmovable: {
    canonicalId: "Kkz6gDKJRbrTNTpRKggRq",
    slug: "unmovable-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Unmovable"],
      activeFaceIds: ["Kkz6gDKJRbrTNTpRKggRq:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: [],
          types: ["Defense Reaction"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: [],
        types: ["Defense Reaction"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["Kkz6gDKJRbrTNTpRKggRq"],
      numeric: {
        pitch: 1,
        cost: 3,
        defense: 7,
      },
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "play",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "played-card",
              },
              from: ["arsenal"],
            },
          },
          id: "Kkz6gDKJRbrTNTpRKggRq:arsenalDefense",
          text: "If this was played from arsenal, it gets +1{d}.",
          resolution: {
            kind: "effect",
            effect: {
              type: "modify-numeric",
              property: "defense",
              op: "add",
              amount: 1,
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
          },
        },
      ],
    },
  },
  sigilSolace: {
    canonicalId: "kzW8BKdWcm9LwtTCTdqRK",
    slug: "sigil-of-solace-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Sigil of Solace"],
      activeFaceIds: ["kzW8BKdWcm9LwtTCTdqRK:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: [],
          types: ["Instant"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: [],
        types: ["Instant"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["kzW8BKdWcm9LwtTCTdqRK"],
      numeric: {
        pitch: 1,
        cost: 0,
      },
      keywords: [],
      abilities: [
        {
          kind: "resolution",
          effect: {
            type: "gain-life",
            amount: 3,
            target: {
              selector: "controller",
            },
          },
          id: "kzW8BKdWcm9LwtTCTdqRK:gainLife",
          text: "Gain 3{h}",
        },
      ],
    },
  },
  crackedBauble: {
    canonicalId: "Dbhn6rRcrbdRnKbqdPdwh",
    slug: "cracked-bauble-yellow",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Cracked Bauble"],
      activeFaceIds: ["Dbhn6rRcrbdRnKbqdPdwh:face:front"],
      color: "yellow",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: [],
          types: ["Resource"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: [],
        types: ["Resource"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["Dbhn6rRcrbdRnKbqdPdwh"],
      numeric: {
        pitch: 2,
      },
      keywords: [],
      abilities: [],
    },
  },
  goldenTipple: {
    canonicalId: "6CpcdCrJKFkpkdkdLPQqT",
    slug: "golden-tipple-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Golden Tipple"],
      activeFaceIds: ["6CpcdCrJKFkpkdkdLPQqT:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Pirate"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Pirate"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["6CpcdCrJKFkpkdkdLPQqT"],
      numeric: {
        pitch: 1,
        cost: 1,
        power: 3,
        defense: 2,
      },
      keywords: [
        {
          name: "go-again",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "attack",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "attack",
              },
            },
          },
          id: "6CpcdCrJKFkpkdkdLPQqT:onAttackDiscardDrawCreateTokenGold",
          text: "When this attacks, you may discard a yellow card. If you do, draw a card and create a Gold token.\nGo again",
          resolution: {
            kind: "effect",
            effect: {
              type: "optional",
              effect: {
                type: "discard",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hand"],
                  filter: {
                    color: ["yellow"],
                  },
                  count: 1,
                },
                outputBinding: "it",
              },
              then: {
                type: "sequence",
                steps: [
                  {
                    type: "draw",
                    count: 1,
                    player: "controller",
                  },
                  {
                    type: "create-token",
                    token: "gold",
                    controller: "controller",
                  },
                ],
              },
            },
          },
        },
      ],
    },
  },
  lootTheHold: {
    canonicalId: "bthMFnn9GbPQBnBT8cNj8",
    slug: "loot-the-hold-blue",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Loot the Hold"],
      activeFaceIds: ["bthMFnn9GbPQBnBT8cNj8:face:front"],
      color: "blue",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Necromancer", "Pirate"],
          types: ["Action"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Necromancer", "Pirate"],
        types: ["Action"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["bthMFnn9GbPQBnBT8cNj8"],
      numeric: {
        pitch: 3,
        cost: 0,
        defense: 3,
      },
      keywords: [
        {
          name: "go-again",
        },
      ],
      abilities: [
        {
          kind: "resolution",
          effect: {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "bthMFnn9GbPQBnBT8cNj8:nextPirateAllyAttackTurnGetsHitsDiscardCreateGoldToken:hitsDiscardCreateGoldToken",
                text: 'Your next Pirate ally attack this turn gets "When this hits a hero, they discard a card. If they do, create a Gold token."\nGo again',
                trigger: {
                  kind: "event",
                  event: {
                    name: "hit",
                    actor: {
                      kind: "player",
                      player: "ability-controller",
                    },
                    observes: {
                      kind: "source",
                      selector: "attack",
                    },
                    target: {
                      kind: "hero",
                    },
                  },
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "if-you-do",
                    effect: {
                      type: "discard",
                      target: {
                        selector: "attack-target",
                      },
                    },
                    then: {
                      type: "create-token",
                      token: "gold",
                      controller: "controller",
                    },
                  },
                },
              },
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                and: [
                  {
                    typeBox: {
                      supertypes: ["Pirate"],
                    },
                  },
                  {
                    typeBox: {
                      subtypes: ["Ally"],
                    },
                  },
                ],
              },
              events: ["play", "attack"],
            },
          },
          id: "bthMFnn9GbPQBnBT8cNj8:nextPirateAllyAttackTurnGetsHitsDiscardCreateGoldToken",
          text: 'Your next Pirate ally attack this turn gets "When this hits a hero, they discard a card. If they do, create a Gold token."\nGo again',
        },
      ],
    },
  },
  saltwaterSwell: {
    canonicalId: "c9hrdrfn8dNhkBcfQmqWn",
    slug: "saltwater-swell-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Saltwater Swell"],
      activeFaceIds: ["c9hrdrfn8dNhkBcfQmqWn:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Pirate"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Pirate"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["c9hrdrfn8dNhkBcfQmqWn"],
      numeric: {
        pitch: 1,
        cost: 1,
        power: 3,
        defense: 3,
      },
      keywords: [
        {
          name: "go-again",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "attack",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "attack",
              },
            },
          },
          id: "c9hrdrfn8dNhkBcfQmqWn:createGoldWhenAttackMeetsRequirement",
          text: "When this attacks, reveal the top card of your deck. If it's blue, pitch it.\nGo again",
          resolution: {
            kind: "effect",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "reveal",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "controller",
                    zones: ["deck"],
                    position: "top",
                    count: 1,
                  },
                  outputBinding: "it",
                },
                {
                  type: "conditional",
                  condition: {
                    type: "binding-matches",
                    binding: "it",
                    filter: {
                      color: ["blue"],
                    },
                  },
                  then: {
                    type: "move-card",
                    target: {
                      selector: "binding",
                      binding: "it",
                    },
                    to: {
                      zone: "pitch",
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
  riggermortis: {
    canonicalId: "jrGCfgFzjRwjWMNCCPzmc",
    slug: "riggermortis-yellow",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Riggermortis"],
      activeFaceIds: ["jrGCfgFzjRwjWMNCCPzmc:face:front"],
      color: "yellow",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Necromancer", "Pirate"],
          types: ["Action"],
          subtypes: ["Ally"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Necromancer", "Pirate"],
        types: ["Action"],
        subtypes: ["Ally"],
      },
      traits: [],
      textBoxIds: ["jrGCfgFzjRwjWMNCCPzmc"],
      numeric: {
        pitch: 2,
        cost: 1,
        power: 6,
        life: 1,
      },
      keywords: [
        {
          name: "watery-grave",
        },
      ],
      abilities: [
        {
          kind: "activated",
          abilityType: "attack",
          cost: {
            class: "mixed",
            type: "all",
            costs: [
              {
                class: "asset",
                type: "resources",
                amount: 1,
              },
              {
                class: "effect",
                type: "tap-self",
              },
            ],
          },
          effect: {
            type: "attack-with",
            target: {
              selector: "self",
            },
          },
          id: "jrGCfgFzjRwjWMNCCPzmc:actionResourceTapAttack",
          text: "Action - {r}, {t}: Attack\nWatery Grave",
        },
      ],
    },
  },
  takeAim: {
    canonicalId: "hFhjbTW96DmWQPBP8C8HF",
    slug: "take-aim-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Take Aim"],
      activeFaceIds: ["hFhjbTW96DmWQPBP8C8HF:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Ranger"],
          types: ["Action"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Ranger"],
        types: ["Action"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["hFhjbTW96DmWQPBP8C8HF"],
      numeric: {
        pitch: 1,
        cost: 0,
        defense: 2,
      },
      keywords: [
        {
          name: "reload",
        },
        {
          name: "go-again",
        },
      ],
      abilities: [
        {
          kind: "resolution",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 3,
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  supertypes: ["Ranger"],
                  types: ["Action"],
                  subtypes: ["Attack"],
                },
              },
              events: ["play", "attack"],
            },
          },
          id: "hFhjbTW96DmWQPBP8C8HF:resolutionModifyNumeric",
          text: "The next Ranger attack action card you play this turn, gains +3{p}.\nReload\nGo again",
        },
      ],
    },
  },
  cogInTheMachine: {
    canonicalId: "jqrFDnJPwhw6bcQCcrLQT",
    slug: "cog-in-the-machine-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Cog in the Machine"],
      activeFaceIds: ["jqrFDnJPwhw6bcQCcrLQT:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Mechanologist"],
          types: ["Action"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Mechanologist"],
        types: ["Action"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["jqrFDnJPwhw6bcQCcrLQT"],
      numeric: {
        pitch: 1,
        cost: 1,
        defense: 3,
      },
      keywords: [],
      abilities: [
        {
          kind: "resolution",
          effect: {
            type: "create-token",
            token: "golden-cog",
            controller: "controller",
            count: 2,
          },
          id: "jqrFDnJPwhw6bcQCcrLQT:create2GoldenCogTokens",
          text: "Create 2 Golden Cog tokens.\nYou may {t} a cog you control. If you do, put this on the bottom of its owner's deck.",
        },
        {
          kind: "resolution",
          effect: {
            type: "optional",
            effect: {
              type: "tap",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["permanent"],
                filter: {
                  typeBox: {
                    subtypes: ["Cog"],
                  },
                },
                count: 1,
              },
            },
            then: {
              type: "move-card",
              target: {
                selector: "self",
              },
              to: {
                zone: "deck",
                position: "bottom",
              },
            },
          },
          id: "jqrFDnJPwhw6bcQCcrLQT:mayCogControlIfDoPutBottomOwnerS",
          text: "Create 2 Golden Cog tokens.\nYou may {t} a cog you control. If you do, put this on the bottom of its owner's deck.",
        },
      ],
    },
  },
  palantir: {
    canonicalId: "c9TrL6MwcrMKtmTbCHL76",
    slug: "palantir-aeronought-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Palantir Aeronought"],
      activeFaceIds: ["c9TrL6MwcrMKtmTbCHL76:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Mechanologist"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Mechanologist"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["c9TrL6MwcrMKtmTbCHL76"],
      numeric: {
        pitch: 1,
        cost: 2,
        power: 6,
        defense: 3,
      },
      keywords: [],
      abilities: [
        {
          kind: "resolution",
          effect: {
            type: "rule-modification",
            mode: "require",
            action: "defend",
            filter: {
              typeBox: {
                types: ["Equipment"],
              },
            },
            duration: "this-combat-chain",
          },
          id: "c9TrL6MwcrMKtmTbCHL76:defendingMustDefendEquipmentAble",
          text: "The defending hero must defend this with an equipment they control if able.\nThrice per Turn Instant - {t} a cog you control: This gets +1{p}. If this is the third time you've activated this ability, destroy a defending card.",
        },
        {
          kind: "activated",
          limit: {
            count: 3,
            per: "turn",
          },
          abilityType: "instant",
          cost: {
            class: "effect",
            type: "tap",
            filter: {
              typeBox: {
                subtypes: ["Cog"],
              },
            },
          },
          effect: {
            type: "sequence",
            steps: [
              {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 1,
                target: {
                  selector: "self",
                },
                duration: "this-turn",
              },
              {
                type: "conditional",
                condition: {
                  type: "compare-amount",
                  amount: {
                    type: "reference",
                    binding: "times-activated-this-ability",
                  },
                  comparison: {
                    op: "eq",
                    value: 3,
                  },
                },
                then: {
                  type: "destroy",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "any",
                    zones: ["combat-chain"],
                    filter: {
                      defending: true,
                    },
                    count: 1,
                  },
                },
              },
            ],
          },
          id: "c9TrL6MwcrMKtmTbCHL76:thricePerTurnInstantTapCogGets1PowerThirdTimeActivatedAbilityDestroyDefending",
          text: "The defending hero must defend this with an equipment they control if able.\nThrice per Turn Instant - {t} a cog you control: This gets +1{p}. If this is the third time you've activated this ability, destroy a defending card.",
        },
      ],
    },
  },
  whatHappensNext: {
    canonicalId: "zLcR9wbtJCfBQLFpntDFg",
    slug: "what-happens-next-blue",
    layout: {
      kind: "single",
    },
    base: {
      names: ["What Happens Next?"],
      activeFaceIds: ["zLcR9wbtJCfBQLFpntDFg:face:front"],
      color: "blue",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Guardian"],
          types: ["Instant"],
          subtypes: ["Aura"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Guardian"],
        types: ["Instant"],
        subtypes: ["Aura"],
      },
      traits: [],
      textBoxIds: ["zLcR9wbtJCfBQLFpntDFg"],
      numeric: {
        pitch: 3,
        cost: 0,
        defense: 2,
      },
      keywords: [
        {
          name: "suspense",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "continuous",
          effect: {
            type: "modify-numeric",
            property: "cost",
            op: "subtract",
            amount: 1,
            target: {
              selector: "this-attack",
            },
            duration: "while-in-arena",
            appliesTo: {
              next: {
                cost: {
                  op: "gte",
                  value: 1,
                },
              },
              events: ["play", "attack"],
            },
          },
          id: "zLcR9wbtJCfBQLFpntDFg:firstCost1MorePlayEachTurnCostsLess",
          text: "Suspense\nThe first card with cost 1 or more you play each turn costs {r} less to play.",
        },
      ],
    },
  },
  criesOfEncore: {
    canonicalId: "JdRffqrPCN9BQRd8gq9BW",
    slug: "cries-of-encore-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Cries of Encore"],
      activeFaceIds: ["JdRffqrPCN9BQRd8gq9BW:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Guardian", "Revered"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Guardian", "Revered"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["JdRffqrPCN9BQRd8gq9BW"],
      numeric: {
        pitch: 1,
        cost: 3,
        power: 7,
        defense: 3,
      },
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event-and-state",
            event: {
              name: "attack",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "attack",
              },
              target: {
                kind: "hero",
              },
            },
            state: {
              type: "life-comparison",
              player: "self",
              vs: "opponent",
              op: "lt",
            },
          },
          label: {
            name: "the-crowd-cheers",
          },
          id: "JdRffqrPCN9BQRd8gq9BW:whenAttacksHeroIfHaveLessThanThemCrowd",
          text: 'When this attacks a hero, if you have less {h} than them, the crowd cheers you.\nIf you\'ve been cheered this turn, this gets "When this hits a hero, you may plan an aura of suspense from your graveyard this turn."',
          resolution: {
            kind: "effect",
            effect: {
              type: "crowd-cheers",
              target: "controller",
            },
          },
        },
        {
          kind: "static",
          staticKind: "continuous",
          condition: {
            type: "performed-this-turn",
            event: "cheered",
            player: "controller",
          },
          effect: {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "JdRffqrPCN9BQRd8gq9BW:ifVeBeenCheeredTurnGetsWhenHitsHero:whenHitsHeroMayPlanAuraSuspenseFromGraveyard",
                text: 'When this attacks a hero, if you have less {h} than them, the crowd cheers you.\nIf you\'ve been cheered this turn, this gets "When this hits a hero, you may plan an aura of suspense from your graveyard this turn."',
                trigger: {
                  kind: "event",
                  event: {
                    name: "hit",
                    actor: {
                      kind: "player",
                      player: "ability-controller",
                    },
                    observes: {
                      kind: "source",
                      selector: "attack",
                    },
                    target: {
                      kind: "hero",
                    },
                  },
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "optional",
                    effect: {
                      type: "move-card",
                      target: {
                        selector: "object",
                        declared: "at-resolution",
                        player: "controller",
                        zones: ["graveyard"],
                        filter: {
                          typeBox: {
                            subtypes: ["Aura"],
                          },
                          hasKeyword: "suspense",
                        },
                        count: 1,
                      },
                      to: {
                        zone: "permanent",
                      },
                    },
                  },
                },
              },
            },
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          label: {
            name: "the-crowd-cheers",
          },
          id: "JdRffqrPCN9BQRd8gq9BW:ifVeBeenCheeredTurnGetsWhenHitsHero",
          text: 'When this attacks a hero, if you have less {h} than them, the crowd cheers you.\nIf you\'ve been cheered this turn, this gets "When this hits a hero, you may plan an aura of suspense from your graveyard this turn."',
        },
      ],
    },
  },
  mockingBlow: {
    canonicalId: "m7nLdbTgfJKmdQrmCDTcq",
    slug: "mocking-blow-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Mocking Blow"],
      activeFaceIds: ["m7nLdbTgfJKmdQrmCDTcq:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Reviled"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Reviled"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["m7nLdbTgfJKmdQrmCDTcq"],
      numeric: {
        pitch: 1,
        cost: 0,
        power: 1,
        defense: 3,
      },
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event-and-state",
            event: {
              name: "attack",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "attack",
              },
              target: {
                kind: "hero",
              },
            },
            state: {
              type: "life-comparison",
              player: "self",
              vs: "opponent",
              op: "gt",
            },
          },
          label: {
            name: "the-crowd-boos",
          },
          id: "m7nLdbTgfJKmdQrmCDTcq:triggeredAttackLifeComparisonCrowdBoosTheCrowdBoos",
          text: "When this attacks a hero, if you have more {h} than them, the crowd boos you.\nIf you've been booed this turn, this gets +4{p}.",
          resolution: {
            kind: "effect",
            effect: {
              type: "crowd-boos",
              target: "controller",
            },
          },
        },
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "crowd-boos",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "none",
              },
            },
          },
          label: {
            name: "the-crowd-boos",
          },
          id: "m7nLdbTgfJKmdQrmCDTcq:triggeredCrowdBoosModifyNumericPowerThisTurnTheCrowdBoos",
          text: "When this attacks a hero, if you have more {h} than them, the crowd boos you.\nIf you've been booed this turn, this gets +4{p}.",
          resolution: {
            kind: "effect",
            effect: {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 4,
              target: {
                selector: "self",
              },
              duration: "this-turn",
            },
          },
        },
      ],
    },
  },
  bigBully: {
    canonicalId: "QwPWQnB7zg7kBPkNT9Mqp",
    slug: "big-bully-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Big Bully"],
      activeFaceIds: ["QwPWQnB7zg7kBPkNT9Mqp:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Brute", "Reviled"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Brute", "Reviled"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["QwPWQnB7zg7kBPkNT9Mqp"],
      numeric: {
        pitch: 1,
        cost: 2,
        power: 4,
        defense: 3,
      },
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event-and-state",
            event: {
              name: "attack",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "attack",
              },
              target: {
                kind: "hero",
              },
            },
            state: {
              type: "life-comparison",
              player: "self",
              vs: "opponent",
              op: "gt",
            },
          },
          label: {
            name: "the-crowd-boos",
          },
          id: "QwPWQnB7zg7kBPkNT9Mqp:whenAttacksHeroIfHaveMoreThanThemCrowd",
          text: "When this attacks a hero, if you have more {h} than them, the crowd boos you.\nIf you've been booed this turn, this card's base {p} is doubled.",
          resolution: {
            kind: "effect",
            effect: {
              type: "crowd-boos",
              target: "controller",
            },
          },
        },
        {
          kind: "static",
          staticKind: "continuous",
          condition: {
            type: "performed-this-turn",
            event: "booed",
            player: "controller",
          },
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "multiply",
            amount: 2,
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
          label: {
            name: "the-crowd-boos",
          },
          id: "QwPWQnB7zg7kBPkNT9Mqp:ifVeBeenBooedTurnSBaseIsDoubled",
          text: "When this attacks a hero, if you have more {h} than them, the crowd boos you.\nIf you've been booed this turn, this card's base {p} is doubled.",
        },
      ],
    },
  },
  edgeOfTheirSeats: {
    canonicalId: "KGkThWpJmzJc6hDrhhCbH",
    slug: "edge-of-their-seats-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Edge of Their Seats"],
      activeFaceIds: ["KGkThWpJmzJc6hDrhhCbH:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Guardian"],
          types: ["Instant"],
          subtypes: ["Aura"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Guardian"],
        types: ["Instant"],
        subtypes: ["Aura"],
      },
      traits: [],
      textBoxIds: ["KGkThWpJmzJc6hDrhhCbH"],
      numeric: {
        pitch: 1,
        cost: 3,
        defense: 3,
      },
      keywords: [
        {
          name: "suspense",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "leave-arena",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "source",
                selector: "moved-object",
              },
            },
          },
          id: "KGkThWpJmzJc6hDrhhCbH:armNextAttack",
          text: "Suspense\nWhen this leaves the arena, your next attack this turn gets +5{p}.",
          resolution: {
            kind: "effect",
            effect: {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 5,
              duration: "this-turn",
              appliesTo: {
                next: {
                  typeBox: {
                    subtypes: ["Attack"],
                  },
                },
                events: ["play", "attack"],
              },
            },
          },
        },
      ],
    },
  },
  tearAsunder: {
    canonicalId: "C8r9mHpCfPTcgggPdbMLB",
    slug: "tear-asunder-blue",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Tear Asunder"],
      activeFaceIds: ["C8r9mHpCfPTcgggPdbMLB:face:front"],
      color: "blue",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Guardian"],
          types: ["Action"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Guardian"],
        types: ["Action"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["C8r9mHpCfPTcgggPdbMLB"],
      numeric: {
        pitch: 3,
        cost: 3,
        defense: 3,
      },
      keywords: [
        {
          name: "go-again",
        },
      ],
      abilities: [
        {
          kind: "resolution",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 1,
                duration: "this-turn",
                appliesTo: {
                  next: {
                    typeBox: {
                      supertypes: ["Guardian"],
                    },
                  },
                  events: ["play", "attack"],
                },
              },
              {
                type: "grant-property",
                property: {
                  kind: "keyword",
                  keyword: {
                    name: "dominate",
                  },
                },
                duration: "this-turn",
                appliesTo: {
                  next: {
                    typeBox: {
                      supertypes: ["Guardian"],
                    },
                  },
                  events: ["play", "attack"],
                },
              },
              {
                type: "grant-property",
                property: {
                  kind: "ability",
                  ability: {
                    kind: "static",
                    staticKind: "triggered",
                    id: "C8r9mHpCfPTcgggPdbMLB:nextGuardianAttackTurnGainsNumber1PowerDominateWhenHitsHeroThey:whenHitsHeroTheyDiscardNumber2",
                    text: 'Your next Guardian attack this turn gains +1{p}, dominate, and "When this hits a hero, they discard 2 cards."\nGo again',
                    trigger: {
                      kind: "event",
                      event: {
                        name: "hit",
                        actor: {
                          kind: "player",
                          player: "ability-controller",
                        },
                        observes: {
                          kind: "source",
                          selector: "attack",
                        },
                        target: {
                          kind: "hero",
                        },
                      },
                    },
                    resolution: {
                      kind: "effect",
                      effect: {
                        type: "discard",
                        target: {
                          selector: "object",
                          declared: "at-resolution",
                          player: "attack-target",
                          zones: ["hand"],
                          count: 2,
                        },
                      },
                    },
                  },
                },
                duration: "this-turn",
                appliesTo: {
                  next: {
                    typeBox: {
                      supertypes: ["Guardian"],
                    },
                  },
                  events: ["play", "attack"],
                },
              },
            ],
          },
          id: "C8r9mHpCfPTcgggPdbMLB:nextGuardianAttackTurnGainsNumber1PowerDominateWhenHitsHeroThey",
          text: 'Your next Guardian attack this turn gains +1{p}, dominate, and "When this hits a hero, they discard 2 cards."\nGo again',
        },
      ],
    },
  },
  twinDrive: {
    canonicalId: "BB6TLbtFwBCqtH7H7wBjj",
    slug: "twin-drive-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Twin Drive"],
      activeFaceIds: ["BB6TLbtFwBCqtH7H7wBjj:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Mechanologist"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Mechanologist"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["BB6TLbtFwBCqtH7H7wBjj"],
      numeric: {
        pitch: 1,
        cost: 2,
        power: 5,
        defense: 3,
      },
      keywords: [
        {
          name: "boost",
        },
      ],
      abilities: [],
    },
  },
  fabricate: {
    canonicalId: "cjJpkCtJwndP7FwzwDDQc",
    slug: "fabricate-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Fabricate"],
      activeFaceIds: ["cjJpkCtJwndP7FwzwDDQc:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Mechanologist"],
          types: ["Instant"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Mechanologist"],
        types: ["Instant"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["cjJpkCtJwndP7FwzwDDQc"],
      numeric: {
        pitch: 1,
        cost: 0,
      },
      keywords: [],
      abilities: [
        {
          kind: "modal",
          modal: {
            choose: 2,
          },
          modes: [
            {
              kind: "resolution",
              effect: {
                type: "equip",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["inventory"],
                  filter: {
                    typeBox: {
                      types: ["Equipment"],
                      subtypes: ["Base"],
                    },
                    nameContains: "Proto",
                  },
                  count: 1,
                },
              },
              id: "cjJpkCtJwndP7FwzwDDQc:chooseModes:equipBaseEquipmentProtoNameFromInventory",
              text: "Equip Base Equipment Proto Name From Inventory",
            },
            {
              kind: "resolution",
              effect: {
                type: "modify-numeric",
                property: "defense",
                op: "add",
                amount: 1,
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["permanent", "combat-chain"],
                  filter: {
                    typeBox: {
                      subtypes: ["Evo"],
                    },
                  },
                  count: {
                    type: "all",
                  },
                },
                duration: "this-turn",
              },
              id: "cjJpkCtJwndP7FwzwDDQc:chooseModes:evoPermanentsControlGet1Turn",
              text: "Evo Permanents Control Get 1 Turn",
            },
            {
              kind: "resolution",
              effect: {
                type: "move-card",
                target: {
                  selector: "self",
                },
                to: {
                  zone: "under",
                },
              },
              id: "cjJpkCtJwndP7FwzwDDQc:chooseModes:putUnderEvoPermanentControl",
              text: "Put Under Evo Permanent Control",
            },
            {
              kind: "resolution",
              effect: {
                type: "optional",
                effect: {
                  type: "banish",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "controller",
                    zones: ["hand"],
                    filter: {
                      typeBox: {
                        subtypes: ["Evo"],
                      },
                    },
                    count: 1,
                  },
                },
                then: {
                  type: "draw",
                  count: 1,
                  player: "controller",
                },
              },
              id: "cjJpkCtJwndP7FwzwDDQc:chooseModes:mayBanishEvoFromHandIfDoDraw",
              text: "May Banish Evo From Hand If Do Draw",
            },
          ],
          id: "cjJpkCtJwndP7FwzwDDQc:chooseModes",
          text: "Choose 2;\n\nEquip a base equipment with Proto in its name from your inventory.\nEvo permanents you control get +1{d} this turn.\nPut this under an Evo permanent you control.\nYou may banish an Evo from your hand. If you do, draw a card.",
        },
      ],
    },
  },
  terminatorTank: {
    canonicalId: "zknqNdwtDMrHbRpgKkBJw",
    slug: "terminator-tank-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Terminator Tank"],
      activeFaceIds: ["zknqNdwtDMrHbRpgKkBJw:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Mechanologist"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Mechanologist"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["zknqNdwtDMrHbRpgKkBJw"],
      numeric: {
        pitch: 1,
        cost: 6,
        power: 6,
        defense: 3,
      },
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "play",
          condition: {
            type: "equipped-count",
            filter: {
              typeBox: {
                subtypes: ["Evo"],
              },
            },
            comparison: {
              op: "gte",
              value: 2,
            },
          },
          playEffect: {
            role: "cost-reduction",
            cost: {
              class: "asset",
              type: "resources",
              amount: 3,
            },
          },
          id: "zknqNdwtDMrHbRpgKkBJw:haveNumber2MoreEvosEquippedCostsResourceResourceResourceLessPlay",
          text: 'If you have 1 or more Evos equipped, this gets "When this hits a hero, they discard a card,"\n\n2 or more, this costs {r}{r}{r} less to play,\n3 or more, this gets overpower,\n4 or more, this gets +3{p}.',
        },
        {
          kind: "static",
          staticKind: "continuous",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "conditional",
                condition: {
                  type: "equipped-count",
                  filter: {
                    typeBox: {
                      subtypes: ["Evo"],
                    },
                  },
                  comparison: {
                    op: "gte",
                    value: 1,
                  },
                },
                then: {
                  type: "grant-property",
                  property: {
                    kind: "ability",
                    ability: {
                      kind: "static",
                      staticKind: "triggered",
                      id: "zknqNdwtDMrHbRpgKkBJw:haveNumber1MoreEvosEquippedGetsWhenHitsHeroTheyDiscardNumber2:whenHitsHeroTheyDiscard",
                      text: 'If you have 1 or more Evos equipped, this gets "When this hits a hero, they discard a card,"\n\n2 or more, this costs {r}{r}{r} less to play,\n3 or more, this gets overpower,\n4 or more, this gets +3{p}.',
                      trigger: {
                        kind: "event",
                        event: {
                          name: "hit",
                          actor: {
                            kind: "player",
                            player: "ability-controller",
                          },
                          observes: {
                            kind: "source",
                            selector: "attack",
                          },
                          target: {
                            kind: "hero",
                          },
                        },
                      },
                      resolution: {
                        kind: "effect",
                        effect: {
                          type: "discard",
                          target: {
                            selector: "attack-target",
                          },
                        },
                      },
                    },
                  },
                  target: {
                    selector: "self",
                  },
                  duration: "permanent",
                },
              },
              {
                type: "conditional",
                condition: {
                  type: "equipped-count",
                  filter: {
                    typeBox: {
                      subtypes: ["Evo"],
                    },
                  },
                  comparison: {
                    op: "gte",
                    value: 3,
                  },
                },
                then: {
                  type: "grant-property",
                  property: {
                    kind: "keyword",
                    keyword: {
                      name: "overpower",
                    },
                  },
                  target: {
                    selector: "self",
                  },
                  duration: "this-turn",
                },
              },
              {
                type: "conditional",
                condition: {
                  type: "equipped-count",
                  filter: {
                    typeBox: {
                      subtypes: ["Evo"],
                    },
                  },
                  comparison: {
                    op: "gte",
                    value: 4,
                  },
                },
                then: {
                  type: "modify-numeric",
                  property: "power",
                  op: "add",
                  amount: 3,
                  target: {
                    selector: "self",
                  },
                  duration: "this-turn",
                },
              },
            ],
          },
          id: "zknqNdwtDMrHbRpgKkBJw:haveNumber1MoreEvosEquippedGetsWhenHitsHeroTheyDiscardNumber2",
          text: 'If you have 1 or more Evos equipped, this gets "When this hits a hero, they discard a card,"\n\n2 or more, this costs {r}{r}{r} less to play,\n3 or more, this gets overpower,\n4 or more, this gets +3{p}.',
        },
      ],
    },
  },
  leaveNoWitnesses: {
    canonicalId: "zWjNwt6zMt9hMq9TDKJWp",
    slug: "leave-no-witnesses-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Leave No Witnesses"],
      activeFaceIds: ["zWjNwt6zMt9hMq9TDKJWp:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Assassin"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Assassin"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["zWjNwt6zMt9hMq9TDKJWp"],
      numeric: {
        pitch: 1,
        cost: 0,
        power: 4,
        defense: 3,
      },
      keywords: [],
      abilities: [
        {
          kind: "resolution",
          effect: {
            type: "contract-task",
            task: "banish opponents' red cards",
            completeOn: "banish",
            filter: {
              color: ["red"],
            },
          },
          label: {
            name: "contract",
          },
          id: "zWjNwt6zMt9hMq9TDKJWp:contractedBanishOpponentsRed",
          text: "Contract - You are contracted to banish opponents' red cards. Whenever you complete this contract, create a Silver token.\nWhen this hits a hero, banish the top card of their deck and up to 1 card in their arsenal.",
        },
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "complete-contract",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "none",
              },
            },
          },
          label: {
            name: "contract",
          },
          id: "zWjNwt6zMt9hMq9TDKJWp:wheneverCompleteContractCreateSilverToken",
          text: "Contract - You are contracted to banish opponents' red cards. Whenever you complete this contract, create a Silver token.\nWhen this hits a hero, banish the top card of their deck and up to 1 card in their arsenal.",
          resolution: {
            kind: "effect",
            effect: {
              type: "create-token",
              token: "silver",
              controller: "controller",
            },
          },
        },
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "hit",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "attack",
              },
              target: {
                kind: "hero",
              },
            },
          },
          id: "zWjNwt6zMt9hMq9TDKJWp:hitsBanishTopDeckUp1Arsenal",
          text: "Contract - You are contracted to banish opponents' red cards. Whenever you complete this contract, create a Silver token.\nWhen this hits a hero, banish the top card of their deck and up to 1 card in their arsenal.",
          resolution: {
            kind: "effect",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "banish",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "opponent",
                    zones: ["deck"],
                    position: "top",
                    count: 1,
                  },
                },
                {
                  type: "banish",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "opponent",
                    zones: ["arsenal"],
                    count: {
                      type: "up-to",
                      amount: 1,
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
  tarantulaToxin: {
    canonicalId: "BfCHDqCQHfNgqQGckhq7d",
    slug: "tarantula-toxin-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Tarantula Toxin"],
      activeFaceIds: ["BfCHDqCQHfNgqQGckhq7d:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Assassin"],
          types: ["Attack Reaction"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Assassin"],
        types: ["Attack Reaction"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["BfCHDqCQHfNgqQGckhq7d"],
      numeric: {
        pitch: 1,
        cost: 0,
        defense: 3,
      },
      keywords: [],
      abilities: [
        {
          kind: "modal",
          modal: {
            choose: {
              type: "up-to",
              amount: 2,
            },
          },
          modes: [
            {
              kind: "resolution",
              effect: {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 3,
                target: {
                  selector: "object",
                  declared: "on-stack",
                  zones: ["combat-chain"],
                  filter: {
                    typeBox: {
                      subtypes: ["Dagger"],
                    },
                  },
                  count: 1,
                },
                duration: "this-turn",
                outputBinding: "it",
              },
              id: "BfCHDqCQHfNgqQGckhq7d:chooseDaggerOrDefenseMode:boostDagger",
              text: "Boost Dagger",
            },
            {
              kind: "resolution",
              effect: {
                type: "modify-numeric",
                property: "defense",
                op: "subtract",
                amount: 3,
                target: {
                  selector: "object",
                  declared: "on-stack",
                  zones: ["combat-chain"],
                  filter: {
                    defending: true,
                    defendingAgainst: {
                      typeBox: {
                        subtypes: ["Attack"],
                      },
                      hasKeyword: "stealth",
                    },
                  },
                  count: 1,
                },
                duration: "this-turn",
                outputBinding: "it",
              },
              id: "BfCHDqCQHfNgqQGckhq7d:chooseDaggerOrDefenseMode:reduceDefenderDefense",
              text: "Reduce Defender Defense",
            },
          ],
          id: "BfCHDqCQHfNgqQGckhq7d:chooseDaggerOrDefenseMode",
          text: "Choose 1 or both;\n\nTarget dagger attack gets +3{p}.\nTarget card defending an attack with stealth gets -3{d} this turn.",
        },
      ],
    },
  },
  spinalCrush: {
    canonicalId: "BwgjdFCGncmNwKPkrznN7",
    slug: "spinal-crush-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Spinal Crush"],
      activeFaceIds: ["BwgjdFCGncmNwKPkrznN7:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Guardian"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Guardian"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["BwgjdFCGncmNwKPkrznN7"],
      numeric: {
        pitch: 1,
        cost: 5,
        power: 9,
        defense: 3,
      },
      keywords: [
        {
          name: "crush",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          id: "BwgjdFCGncmNwKPkrznN7:crushAbility",
          text: "Crush - If Spinal Crush deals 4 or more damage to a hero, action cards, activated abilities, and attacks they control lose and can't gain go again during their next action phase.",
          trigger: {
            kind: "event",
            event: {
              name: "dealt-damage",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "none",
              },
              amount: {
                op: "gte",
                value: 4,
              },
              target: {
                kind: "hero",
              },
            },
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "remove-property",
                  property: {
                    kind: "keyword",
                    keyword: {
                      name: "go-again",
                    },
                  },
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "opponent",
                    zones: ["stack", "combat-chain"],
                    filter: {
                      or: [
                        {
                          typeBox: {
                            types: ["Action"],
                          },
                        },
                        {
                          typeBox: {
                            subtypes: ["Attack"],
                          },
                        },
                      ],
                    },
                    count: {
                      type: "all",
                    },
                  },
                  duration: "during-their-next-action-phase",
                },
                {
                  type: "rule-modification",
                  mode: "restrict",
                  action: "gain-keyword",
                  keyword: "go-again",
                  subject: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "opponent",
                    zones: ["stack", "combat-chain"],
                    filter: {
                      or: [
                        {
                          typeBox: {
                            types: ["Action"],
                          },
                        },
                        {
                          typeBox: {
                            subtypes: ["Attack"],
                          },
                        },
                      ],
                    },
                    count: {
                      type: "all",
                    },
                  },
                  duration: "during-their-next-action-phase",
                },
              ],
            },
          },
          functionalZones: ["combat-chain"],
          label: {
            name: "crush",
          },
        },
      ],
    },
  },
  leyLine: {
    canonicalId: "LWD8GBDqqgnWHmLBzdTh7",
    slug: "ley-line-of-the-old-ones-blue",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Ley Line of the Old Ones"],
      activeFaceIds: ["LWD8GBDqqgnWHmLBzdTh7:face:front"],
      color: "blue",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Guardian"],
          types: ["Instant"],
          subtypes: ["Aura"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Guardian"],
        types: ["Instant"],
        subtypes: ["Aura"],
      },
      traits: [],
      textBoxIds: ["LWD8GBDqqgnWHmLBzdTh7"],
      numeric: {
        pitch: 3,
        cost: 0,
      },
      keywords: [
        {
          name: "legendary",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event-and-state",
            event: {
              name: "end-phase",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "none",
              },
            },
            state: {
              type: "zone-count",
              zone: "permanent",
              player: "controller",
              filter: {
                name: "Seismic Surge",
                typeBox: {
                  metatypes: ["Token"],
                },
              },
              comparison: {
                op: "eq",
                value: 0,
              },
            },
          },
          id: "LWD8GBDqqgnWHmLBzdTh7:atBeginningEndPhaseIfControlNoSeismicSurge",
          text: "Legendary\nWhen this enters the arena and whenever you deal damage, create a Seismic Surge token. At the beginning of your end phase, if you control no Seismic Surge tokens, destroy this.",
          resolution: {
            kind: "effect",
            effect: {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
          },
        },
      ],
    },
  },
  seismicEruption: {
    canonicalId: "t9g6gbzgFL9RmRQBBNrP7",
    slug: "seismic-eruption-yellow",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Seismic Eruption"],
      activeFaceIds: ["t9g6gbzgFL9RmRQBBNrP7:face:front"],
      color: "yellow",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Guardian"],
          types: ["Instant"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Guardian"],
        types: ["Instant"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["t9g6gbzgFL9RmRQBBNrP7"],
      numeric: {
        pitch: 2,
        cost: 0,
      },
      keywords: [],
      abilities: [
        {
          kind: "resolution",
          effect: {
            type: "create-token",
            token: "seismic-surge",
            controller: "controller",
            count: 3,
          },
          id: "t9g6gbzgFL9RmRQBBNrP7:create3SeismicSurgeTokens",
          text: "Create 3 Seismic Surge tokens.",
        },
      ],
    },
  },
  disenchantment: {
    canonicalId: "CkHnpRcfgkcrmJqTpDztp",
    slug: "disenchantment-of-the-old-ones-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Disenchantment of the Old Ones"],
      activeFaceIds: ["CkHnpRcfgkcrmJqTpDztp:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Guardian"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Guardian"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["CkHnpRcfgkcrmJqTpDztp"],
      numeric: {
        pitch: 1,
        cost: 6,
        power: 10,
        defense: 3,
      },
      keywords: [
        {
          name: "heave",
          value: 2,
        },
        {
          name: "crush",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          id: "CkHnpRcfgkcrmJqTpDztp:crushDestroyAllGuardianAuras",
          text: "Crush - When this deals 4 or more damage to a Guardian hero, destroy all auras they control.\nHeave 2",
          trigger: {
            kind: "event",
            event: {
              name: "dealt-damage",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "event-object",
                selector: "damage-source",
                relationship: {
                  kind: "any",
                },
                filter: {
                  typeBox: {
                    supertypes: ["Guardian"],
                  },
                },
              },
              amount: {
                op: "gte",
                value: 4,
              },
              target: {
                kind: "hero",
              },
            },
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "destroy",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "attack-target",
                zones: ["permanent"],
                filter: {
                  typeBox: {
                    subtypes: ["Aura"],
                  },
                },
                count: {
                  type: "all",
                },
              },
            },
          },
          functionalZones: ["combat-chain"],
          label: {
            name: "crush",
          },
        },
      ],
    },
  },
  lightningSurge: {
    canonicalId: "8BFGd6LjfLGgTBrJdmdqf",
    slug: "lightning-surge-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Lightning Surge"],
      activeFaceIds: ["8BFGd6LjfLGgTBrJdmdqf:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Lightning"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Lightning"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["8BFGd6LjfLGgTBrJdmdqf"],
      numeric: {
        pitch: 1,
        cost: 0,
        power: 4,
        defense: 2,
      },
      keywords: [],
      abilities: [
        {
          kind: "resolution",
          condition: {
            type: "played-this",
            per: "turn",
            onlySource: true,
            filter: {
              playedFromZones: ["arsenal"],
            },
          },
          effect: {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: {
                name: "go-again",
              },
            },
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
          id: "8BFGd6LjfLGgTBrJdmdqf:playedThisGrantPropertyGoAgainThisTurn",
          text: "If this was played from arsenal, it gets go again.",
        },
      ],
    },
  },
  rushOfPower: {
    canonicalId: "jbmgCjPjGMC9g6688q8RM",
    slug: "rush-of-power-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Rush of Power"],
      activeFaceIds: ["jbmgCjPjGMC9g6688q8RM:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Runeblade", "Lightning"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Runeblade", "Lightning"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["jbmgCjPjGMC9g6688q8RM"],
      numeric: {
        pitch: 1,
        cost: 0,
        power: 3,
        defense: 3,
        arcane: 1,
      },
      keywords: [],
      abilities: [
        {
          kind: "resolution",
          condition: {
            type: "has-keyword",
            keyword: "go-again",
            target: {
              selector: "self",
            },
          },
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
          label: {
            name: "quickstrike",
          },
          id: "jbmgCjPjGMC9g6688q8RM:hasKeywordGoAgainModifyNumericPowerThisTurnQuickstrike",
          text: "Quickstrike - If this has go again, it gets +1{p}.\nWhen this hits a hero, deal 1 arcane damage to them.",
        },
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "hit",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "attack",
              },
              target: {
                kind: "hero",
              },
            },
          },
          id: "jbmgCjPjGMC9g6688q8RM:triggeredHitDealDamage",
          text: "Quickstrike - If this has go again, it gets +1{p}.\nWhen this hits a hero, deal 1 arcane damage to them.",
          resolution: {
            kind: "effect",
            effect: {
              type: "deal-damage",
              damageType: "arcane",
              amount: 1,
              target: {
                selector: "attack-target",
              },
            },
          },
        },
      ],
    },
  },
  goneInAFlash: {
    canonicalId: "DHfcJWbWWPdKWcGdtWmnQ",
    slug: "gone-in-a-flash-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Gone in a Flash"],
      activeFaceIds: ["DHfcJWbWWPdKWcGdtWmnQ:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Lightning"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Lightning"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["DHfcJWbWWPdKWcGdtWmnQ"],
      numeric: {
        pitch: 1,
        cost: 0,
        power: 4,
        defense: 3,
      },
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "attack",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "attack",
              },
            },
          },
          id: "DHfcJWbWWPdKWcGdtWmnQ:whenAttacksNextTimePlayInstantChainLinkMay",
          text: "When this attacks, the next time you play an instant card this chain link, you may return this to it's owner's hand.",
          resolution: {
            kind: "effect",
            effect: {
              type: "delayed-trigger",
              trigger: {
                kind: "event",
                event: {
                  name: "play",
                  actor: {
                    kind: "player",
                    player: "ability-controller",
                  },
                  observes: {
                    kind: "event-object",
                    selector: "played-card",
                    relationship: {
                      kind: "any",
                    },
                    filter: {
                      typeBox: {
                        types: ["Instant"],
                      },
                    },
                    bindAs: "it",
                  },
                },
              },
              policy: {
                kind: "windowed",
                duration: "this-chain-link",
                matching: "first",
              },
              resolution: {
                kind: "effect",
                effect: {
                  type: "optional",
                  effect: {
                    type: "move-card",
                    target: {
                      selector: "self",
                    },
                    to: {
                      zone: "hand",
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
  volatileFluxor: {
    canonicalId: "mLQbHGnCHtLpmJh6LWLbP",
    slug: "volatile-fluxor-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Volatile Fluxor"],
      activeFaceIds: ["mLQbHGnCHtLpmJh6LWLbP:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Lightning"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Lightning"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["mLQbHGnCHtLpmJh6LWLbP"],
      numeric: {
        pitch: 1,
        cost: 0,
        power: 0,
        defense: 3,
      },
      keywords: [
        {
          name: "go-again",
        },
      ],
      abilities: [
        {
          kind: "resolution",
          condition: {
            type: "played-this",
            per: "chain-link",
            filter: {
              typeBox: {
                types: ["Instant"],
              },
            },
            comparison: {
              op: "gte",
              value: 1,
            },
          },
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 3,
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
          id: "mLQbHGnCHtLpmJh6LWLbP:resolutionModifyNumeric",
          text: "If you've played an instant card this chain link, this gets +3{p}.\nWhen this hits, create a Lightning Flow token.\nGo again",
        },
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "hit",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "attack",
              },
            },
          },
          id: "mLQbHGnCHtLpmJh6LWLbP:triggeredEffect",
          text: "If you've played an instant card this chain link, this gets +3{p}.\nWhen this hits, create a Lightning Flow token.\nGo again",
          resolution: {
            kind: "effect",
            effect: {
              type: "create-token",
              token: "lightning-flow",
              controller: "controller",
            },
          },
        },
      ],
    },
  },
  enionSurge: {
    canonicalId: "dzMffTNHqjw8q8jkDjGwD",
    slug: "enion-surge-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Enion Surge"],
      activeFaceIds: ["dzMffTNHqjw8q8jkDjGwD:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Wizard", "Lightning"],
          types: ["Action"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Wizard", "Lightning"],
        types: ["Action"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["dzMffTNHqjw8q8jkDjGwD"],
      numeric: {
        pitch: 1,
        cost: 0,
        defense: 3,
        arcane: 3,
      },
      keywords: [],
      abilities: [
        {
          kind: "resolution",
          effect: {
            type: "deal-damage",
            damageType: "arcane",
            amount: 3,
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["hero", "permanent"],
              count: 1,
            },
          },
          id: "dzMffTNHqjw8q8jkDjGwD:resolutionDealDamageArcane",
          text: "Deal 2 arcane damage to any target.\nIf this deals damage, you may {t} your hero. If you do, create a Lightning Flow token.",
        },
        {
          kind: "resolution",
          condition: {
            type: "has-status",
            status: "this-dealt-damage",
          },
          effect: {
            type: "optional",
            effect: {
              type: "tap",
              target: {
                selector: "controller",
              },
            },
            then: {
              type: "create-token",
              token: "lightning-flow",
              controller: "controller",
            },
          },
          id: "dzMffTNHqjw8q8jkDjGwD:resolutionHasStatusDealtDamageOptionalTapCreateTokenLightning",
          text: "Deal 2 arcane damage to any target.\nIf this deals damage, you may {t} your hero. If you do, create a Lightning Flow token.",
        },
      ],
    },
  },
  nebulus: {
    canonicalId: "knQ7hzFBj6fFLH9LTd8MD",
    slug: "nebulus-cycle-yellow",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Nebulus Cycle"],
      activeFaceIds: ["knQ7hzFBj6fFLH9LTd8MD:face:front"],
      color: "yellow",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Illusionist", "Lightning"],
          types: ["Instant"],
          subtypes: ["Aura"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Illusionist", "Lightning"],
        types: ["Instant"],
        subtypes: ["Aura"],
      },
      traits: [],
      textBoxIds: ["knQ7hzFBj6fFLH9LTd8MD"],
      numeric: {
        pitch: 2,
        cost: 1,
      },
      keywords: [
        {
          name: "ward",
          value: 2,
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "leave-arena",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "source",
                selector: "moved-object",
              },
            },
          },
          id: "knQ7hzFBj6fFLH9LTd8MD:whenLeavesArenaCreatePonderToken",
          text: "When this leaves the arena, create a Ponder token.\nWard 2",
          resolution: {
            kind: "effect",
            effect: {
              type: "create-token",
              token: "ponder",
              controller: "controller",
            },
          },
        },
      ],
    },
  },
  phantasmaclasm: {
    canonicalId: "tPqfbKjpBmrNfBnFgDFMH",
    slug: "phantasmaclasm-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Phantasmaclasm"],
      activeFaceIds: ["tPqfbKjpBmrNfBnFgDFMH:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Illusionist"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Illusionist"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["tPqfbKjpBmrNfBnFgDFMH"],
      numeric: {
        pitch: 1,
        cost: 3,
        power: 9,
        defense: 3,
      },
      keywords: [
        {
          name: "phantasm",
        },
      ],
      abilities: [
        {
          kind: "resolution",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "sequence",
                steps: [
                  {
                    type: "look",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "opponent",
                      zones: ["hand"],
                      count: {
                        type: "all",
                      },
                    },
                  },
                  {
                    type: "choose-card",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "opponent",
                      chooser: "controller",
                      zones: ["hand"],
                      count: 1,
                    },
                    outputBinding: "it",
                  },
                ],
              },
              {
                type: "move-card",
                target: {
                  selector: "binding",
                  binding: "it",
                },
                to: {
                  zone: "deck",
                  position: "bottom",
                },
              },
              {
                type: "draw",
                count: 1,
                player: "opponent",
              },
            ],
          },
          id: "tPqfbKjpBmrNfBnFgDFMH:lookDefendingHerosHandChoosePutBottomDeckThenDraw",
          text: "Look at the defending hero's hand and choose a card. They put it on the bottom of their deck then draw a card.\nPhantasm",
        },
      ],
    },
  },
  astralEtchings: {
    canonicalId: "9zdPMfzWLFq7PWbjKmCc6",
    slug: "astral-etchings-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Astral Etchings"],
      activeFaceIds: ["9zdPMfzWLFq7PWbjKmCc6:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Illusionist"],
          types: ["Action"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Illusionist"],
        types: ["Action"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["9zdPMfzWLFq7PWbjKmCc6"],
      numeric: {
        pitch: 1,
        cost: 1,
        defense: 3,
      },
      keywords: [],
      abilities: [
        {
          kind: "resolution",
          effect: {
            type: "add-counter",
            counter: {
              kind: "numeric",
              value: 1,
              property: "power",
            },
            count: 3,
            target: {
              selector: "object",
              declared: "on-stack",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Aura"],
                },
                hasKeyword: "ward",
              },
              count: 1,
            },
          },
          id: "9zdPMfzWLFq7PWbjKmCc6:addCounterPower",
          text: "Put three +1{p} counters on target aura with ward you control.\nIf you control a Spectral Shield, you may play this as though it were an instant.",
        },
        {
          kind: "static",
          staticKind: "play",
          condition: {
            type: "control-object",
            filter: {
              name: "Spectral Shield",
            },
          },
          playEffect: {
            role: "permission",
            fromZones: ["hand", "arsenal"],
            asType: "instant",
            optional: true,
          },
          id: "9zdPMfzWLFq7PWbjKmCc6:playAsInstantWithSpectralShield",
          text: "Put three +1{p} counters on target aura with ward you control.\nIf you control a Spectral Shield, you may play this as though it were an instant.",
        },
      ],
    },
  },
  bloodrush: {
    canonicalId: "fTbpMzhTMBwFNCpGKCft7",
    slug: "bloodrush-bellow-yellow",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Bloodrush Bellow"],
      activeFaceIds: ["fTbpMzhTMBwFNCpGKCft7:face:front"],
      color: "yellow",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Brute"],
          types: ["Action"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Brute"],
        types: ["Action"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["fTbpMzhTMBwFNCpGKCft7"],
      numeric: {
        pitch: 2,
        cost: 1,
        defense: 3,
      },
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "play",
          playEffect: {
            role: "additional-cost",
            cost: {
              class: "effect",
              type: "discard",
              count: 1,
              random: true,
            },
          },
          id: "fTbpMzhTMBwFNCpGKCft7:asAdditionalCostPlayBloodrushBellowDiscardRandom",
          text: "As an additional cost to play Bloodrush Bellow, discard a random card.\nYour Brute attacks gain +2{p} this turn.\nIf the discarded card has 6 or more {p}, draw 2 cards and Bloodrush Bellow gains go again.",
        },
        {
          kind: "resolution",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  supertypes: ["Brute"],
                },
              },
              count: {
                type: "all",
              },
              events: ["play", "attack"],
            },
          },
          id: "fTbpMzhTMBwFNCpGKCft7:bruteAttacksGain2Turn",
          text: "As an additional cost to play Bloodrush Bellow, discard a random card.\nYour Brute attacks gain +2{p} this turn.\nIf the discarded card has 6 or more {p}, draw 2 cards and Bloodrush Bellow gains go again.",
        },
        {
          kind: "resolution",
          condition: {
            type: "binding-matches",
            binding: "discardedCard",
            filter: {
              power: {
                op: "gte",
                value: 6,
              },
            },
          },
          layerKeywords: [
            {
              name: "go-again",
            },
          ],
          effect: {
            type: "draw",
            count: 2,
            player: "controller",
          },
          id: "fTbpMzhTMBwFNCpGKCft7:ifDiscardedHas6MoreDraw2BloodrushBellow",
          text: "As an additional cost to play Bloodrush Bellow, discard a random card.\nYour Brute attacks gain +2{p} this turn.\nIf the discarded card has 6 or more {p}, draw 2 cards and Bloodrush Bellow gains go again.",
        },
      ],
    },
  },
  beastWithin: {
    canonicalId: "dHNcBPjwggj8GdFnqbkrD",
    slug: "beast-within-yellow",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Beast Within"],
      activeFaceIds: ["dHNcBPjwggj8GdFnqbkrD:face:front"],
      color: "yellow",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Brute"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Brute"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["dHNcBPjwggj8GdFnqbkrD"],
      numeric: {
        pitch: 2,
        cost: 3,
        power: 6,
        defense: 3,
      },
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "put-into-graveyard",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "source",
                selector: "moved-object",
              },
              excludeFrom: ["combat-chain"],
            },
          },
          id: "dHNcBPjwggj8GdFnqbkrD:ifBeastWithinIsPutIntoGraveyardFromAnywhere",
          text: "If Beast Within is put into a graveyard from anywhere other than the combat chain, banish the top card of your deck and lose 1{h}. If it has 6 or more {p}, put it into your hand, otherwise, repeat this process.",
          resolution: {
            kind: "effect",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "banish",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "controller",
                    zones: ["deck"],
                    position: "top",
                    count: 1,
                  },
                  outputBinding: "it",
                },
                {
                  type: "lose-life",
                  amount: 1,
                  target: {
                    selector: "controller",
                  },
                },
                {
                  type: "conditional",
                  condition: {
                    type: "binding-matches",
                    binding: "it",
                    filter: {
                      power: {
                        op: "gte",
                        value: 6,
                      },
                    },
                  },
                  then: {
                    type: "move-card",
                    target: {
                      selector: "binding",
                      binding: "it",
                    },
                    to: {
                      zone: "hand",
                    },
                  },
                  else: {
                    type: "repeat",
                    until: "declined",
                    effect: {
                      type: "sequence",
                      steps: [
                        {
                          type: "banish",
                          target: {
                            selector: "object",
                            declared: "at-resolution",
                            player: "controller",
                            zones: ["deck"],
                            position: "top",
                            count: 1,
                          },
                          outputBinding: "it",
                        },
                        {
                          type: "lose-life",
                          amount: 1,
                          target: {
                            selector: "controller",
                          },
                        },
                        {
                          type: "conditional",
                          condition: {
                            type: "binding-matches",
                            binding: "it",
                            filter: {
                              power: {
                                op: "gte",
                                value: 6,
                              },
                            },
                          },
                          then: {
                            type: "move-card",
                            target: {
                              selector: "binding",
                              binding: "it",
                            },
                            to: {
                              zone: "hand",
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
        },
      ],
    },
  },
  swingBig: {
    canonicalId: "jPMgW9kwNF8Cj69gwJntt",
    slug: "swing-big-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Swing Big"],
      activeFaceIds: ["jPMgW9kwNF8Cj69gwJntt:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Brute"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Brute"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["jPMgW9kwNF8Cj69gwJntt"],
      numeric: {
        pitch: 1,
        cost: 2,
        power: 8,
        defense: 3,
      },
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event-and-state",
            event: {
              name: "combat-chain-close",
              actor: {
                kind: "none",
              },
              observes: {
                kind: "none",
              },
            },
            state: {
              type: "has-status",
              status: "didnt-hit",
            },
          },
          id: "jPMgW9kwNF8Cj69gwJntt:whenCombatChainClosesDidnTHitDefendingHeroCreatesQuickenToken",
          text: "When the combat chain closes, if this didn't hit, the defending hero creates a Quicken token.",
          resolution: {
            kind: "effect",
            effect: {
              type: "create-token",
              token: "quicken",
              controller: "defending-hero",
            },
          },
        },
      ],
    },
  },
  sendPacking: {
    canonicalId: "WQtbdGwPbtmLmmkRjQzqj",
    slug: "send-packing-yellow",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Send Packing"],
      activeFaceIds: ["WQtbdGwPbtmLmmkRjQzqj:face:front"],
      color: "yellow",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Brute"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Brute"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["WQtbdGwPbtmLmmkRjQzqj"],
      numeric: {
        pitch: 2,
        cost: 3,
        power: 6,
        defense: 3,
      },
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "attack",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "attack",
              },
              target: {
                kind: "hero",
              },
            },
          },
          id: "WQtbdGwPbtmLmmkRjQzqj:whenAttacksHeroBanishFromTheirArsenalWhenChainLinkResolvesDidn",
          text: "When this attacks a hero, banish a card from their arsenal. When the chain link resolves, if this didn't hit, return the banished card to its owner's hand.",
          resolution: {
            kind: "effect",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "banish",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "attack-target",
                    zones: ["arsenal"],
                    count: 1,
                  },
                  outputBinding: "it",
                },
                {
                  type: "delayed-trigger",
                  trigger: {
                    kind: "event-and-state",
                    event: {
                      name: "chain-link-resolve",
                      actor: {
                        kind: "any",
                      },
                      observes: {
                        kind: "source",
                        selector: "attack",
                      },
                    },
                    state: {
                      type: "has-status",
                      status: "didnt-hit",
                    },
                  },
                  policy: {
                    kind: "windowed",
                    duration: "this-chain-link",
                    matching: "first",
                  },
                  resolution: {
                    kind: "effect",
                    effect: {
                      type: "move-card",
                      target: {
                        selector: "binding",
                        binding: "it",
                      },
                      to: {
                        zone: "hand",
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
  },
  sandSketched: {
    canonicalId: "BpjDRjGcMhFQkKQLnLLkQ",
    slug: "sand-sketched-plan-blue",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Sand Sketched Plan"],
      activeFaceIds: ["BpjDRjGcMhFQkKQLnLLkQ:face:front"],
      color: "blue",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Brute"],
          types: ["Action"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Brute"],
        types: ["Action"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["BpjDRjGcMhFQkKQLnLLkQ"],
      numeric: {
        pitch: 3,
        cost: 0,
        defense: 3,
      },
      keywords: [
        {
          name: "specialization",
          hero: "Rhinar",
        },
      ],
      abilities: [
        {
          kind: "resolution",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "search",
                zones: ["deck"],
                filter: {},
                mayFail: true,
                to: {
                  zone: "hand",
                },
              },
              {
                type: "discard",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hand"],
                  count: 1,
                  random: true,
                },
                outputBinding: "it",
              },
              {
                type: "shuffle",
                zone: "deck",
              },
            ],
          },
          id: "BpjDRjGcMhFQkKQLnLLkQ:searchDeckForPutIntoHandDiscardRandomShuffleDeck",
          text: "Rhinar Specialization\nSearch your deck for a card, put it into your hand, discard a random card, then shuffle your deck.\nIf the discarded card has 6 or more {p}, gain 2 action points.",
        },
        {
          kind: "resolution",
          condition: {
            type: "binding-matches",
            binding: "it",
            filter: {
              power: {
                op: "gte",
                value: 6,
              },
            },
          },
          effect: {
            type: "gain-action-points",
            amount: 2,
          },
          id: "BpjDRjGcMhFQkKQLnLLkQ:discardedHasNumber6MorePowerGainNumber2ActionPoints",
          text: "Rhinar Specialization\nSearch your deck for a card, put it into your hand, discard a random card, then shuffle your deck.\nIf the discarded card has 6 or more {p}, gain 2 action points.",
        },
      ],
    },
  },
  weakestLink: {
    canonicalId: "JjHcGC99TqTf6Mz697hng",
    slug: "the-weakest-link-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["The Weakest Link"],
      activeFaceIds: ["JjHcGC99TqTf6Mz697hng:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: [],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: [],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["JjHcGC99TqTf6Mz697hng"],
      numeric: {
        pitch: 1,
        cost: 2,
        power: 6,
        defense: 3,
      },
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "hit",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "attack",
              },
              target: {
                kind: "hero",
              },
            },
          },
          id: "JjHcGC99TqTf6Mz697hng:whenHitsHeroLookAtTheirHandChooseWithoutBaseDefenseDo",
          text: "When this hits a hero, look at their hand and choose a card without base {d}. If you do, they discard it and you draw a card.",
          resolution: {
            kind: "effect",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "look",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "opponent",
                    zones: ["hand"],
                    count: {
                      type: "all",
                    },
                  },
                },
                {
                  type: "choose-card",
                  target: {
                    selector: "binding",
                    binding: "revealed-this-way",
                    filter: {
                      lacksProperty: "defense",
                    },
                    count: 1,
                  },
                  outputBinding: "it",
                },
                {
                  type: "if-you-do",
                  effect: {
                    type: "discard",
                    target: {
                      selector: "binding",
                      binding: "it",
                    },
                  },
                  then: {
                    type: "draw",
                    count: 1,
                    player: "controller",
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
  quickstep: {
    canonicalId: "DmpnhzMR7WhCgkFWncRkk",
    slug: "quickstep",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Quickstep"],
      activeFaceIds: ["DmpnhzMR7WhCgkFWncRkk:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Bard"],
          types: ["Equipment"],
          subtypes: ["Legs"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Bard"],
        types: ["Equipment"],
        subtypes: ["Legs"],
      },
      traits: [],
      textBoxIds: ["DmpnhzMR7WhCgkFWncRkk"],
      numeric: {
        defense: 0,
      },
      keywords: [],
      abilities: [
        {
          kind: "activated",
          abilityType: "action",
          cost: {
            class: "effect",
            type: "destroy-self",
          },
          layerKeywords: [
            {
              name: "go-again",
            },
          ],
          effect: {
            type: "create-token",
            token: "quicken",
            controller: "each",
          },
          id: "DmpnhzMR7WhCgkFWncRkk:actionDestroyEachHeroCreatesQuickenTokenGoAgain",
          text: "Action - Destroy this: Each hero creates a Quicken token.  Go again",
        },
      ],
    },
  },
  kissOfDeath: {
    canonicalId: "rkRhTdHrdkwMhFwHnPGMk",
    slug: "kiss-of-death-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Kiss of Death"],
      activeFaceIds: ["rkRhTdHrdkwMhFwHnPGMk:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Assassin"],
          types: ["Action"],
          subtypes: ["Attack", "Dagger"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Assassin"],
        types: ["Action"],
        subtypes: ["Attack", "Dagger"],
      },
      traits: [],
      textBoxIds: ["rkRhTdHrdkwMhFwHnPGMk"],
      numeric: {
        pitch: 1,
        cost: 0,
        power: 3,
        defense: 3,
      },
      keywords: [
        {
          name: "stealth",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "hit",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "attack",
              },
              target: {
                kind: "hero",
              },
            },
          },
          id: "rkRhTdHrdkwMhFwHnPGMk:hitsLose1Life",
          text: "Stealth\nWhen this hits a hero, they lose 1{h}.",
          resolution: {
            kind: "effect",
            effect: {
              type: "lose-life",
              amount: 1,
              target: {
                selector: "attack-target",
              },
            },
          },
        },
      ],
    },
  },
  blackWidow: {
    canonicalId: "hCc9J9k6MLJPh7rgzRhwg",
    slug: "mark-of-the-black-widow-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Mark of the Black Widow"],
      activeFaceIds: ["hCc9J9k6MLJPh7rgzRhwg:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Assassin"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Assassin"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["hCc9J9k6MLJPh7rgzRhwg"],
      numeric: {
        pitch: 1,
        cost: 0,
        power: 3,
        defense: 3,
      },
      keywords: [
        {
          name: "stealth",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "hit",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "event-object",
                selector: "attack",
                relationship: {
                  kind: "any",
                },
                filter: {
                  hasStatus: "marked",
                },
              },
              target: {
                kind: "hero",
              },
            },
          },
          id: "hCc9J9k6MLJPh7rgzRhwg:triggeredHitBanish",
          text: "Stealth\nWhen this hits a marked hero, they banish a card from their hand.",
          resolution: {
            kind: "effect",
            effect: {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["hand"],
                count: 1,
              },
            },
          },
        },
      ],
    },
  },
  savor: {
    canonicalId: "nmc8wLKtTmPhJFb7FH8BG",
    slug: "savor-bloodshed-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Savor Bloodshed"],
      activeFaceIds: ["nmc8wLKtTmPhJFb7FH8BG:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypeSets: [["Assassin"], ["Warrior"]],
          supertypes: ["Assassin", "Warrior"],
          types: ["Action"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypeSets: [["Assassin"], ["Warrior"]],
        supertypes: ["Assassin", "Warrior"],
        types: ["Action"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["nmc8wLKtTmPhJFb7FH8BG"],
      numeric: {
        pitch: 1,
        cost: 0,
        defense: 3,
      },
      keywords: [
        {
          name: "go-again",
        },
      ],
      abilities: [
        {
          kind: "resolution",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 4,
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  subtypes: ["Dagger"],
                },
              },
              events: ["play", "attack"],
            },
          },
          id: "nmc8wLKtTmPhJFb7FH8BG:nextDaggerAttackTurnGetsNumber4Power",
          text: "Your next dagger attack this turn gets +4{p}.\nThe next time you hit a marked hero with a dagger this turn, draw a card.\nGo again",
        },
        {
          kind: "resolution",
          effect: {
            type: "delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "hit",
                actor: {
                  kind: "player",
                  player: "ability-controller",
                },
                observes: {
                  kind: "event-object",
                  selector: "attack",
                  relationship: {
                    kind: "any",
                  },
                  filter: {
                    typeBox: {
                      subtypes: ["Dagger"],
                    },
                    hasStatus: "marked",
                  },
                },
                target: {
                  kind: "hero",
                },
              },
            },
            policy: {
              kind: "windowed",
              duration: "this-turn",
              matching: "first",
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "draw",
                count: 1,
                player: "controller",
              },
            },
          },
          id: "nmc8wLKtTmPhJFb7FH8BG:nextTimeHitMarkedHeroWithDaggerTurnDraw",
          text: "Your next dagger attack this turn gets +4{p}.\nThe next time you hit a marked hero with a dagger this turn, draw a card.\nGo again",
        },
      ],
    },
  },
  kingShark: {
    canonicalId: "TGmtp7HrQ86JjWhcMfgrh",
    slug: "king-shark-harpoon-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["King Shark Harpoon"],
      activeFaceIds: ["TGmtp7HrQ86JjWhcMfgrh:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Pirate", "Ranger"],
          types: ["Action"],
          subtypes: ["Arrow", "Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Pirate", "Ranger"],
        types: ["Action"],
        subtypes: ["Arrow", "Attack"],
      },
      traits: [],
      textBoxIds: ["TGmtp7HrQ86JjWhcMfgrh"],
      numeric: {
        pitch: 1,
        cost: 2,
        power: 6,
        defense: 3,
      },
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "hit",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "attack",
              },
              target: {
                kind: "hero",
              },
            },
          },
          label: {
            name: "go-fish",
          },
          id: "TGmtp7HrQ86JjWhcMfgrh:hitsChooseRevealHandAttackActionDiscardCreateGoldTokenActivatedCannonTurnInsteadLookHandChoose",
          text: "Go Fish - When this hits a hero, they choose and reveal a card from their hand. If it's an attack action card, they discard it and you create a Gold token. If you've activated a cannon this turn, instead look at their hand and you choose the card.",
          resolution: {
            kind: "effect",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "reveal",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "opponent",
                    zones: ["hand"],
                    count: 1,
                  },
                  outputBinding: "it",
                },
                {
                  type: "conditional",
                  condition: {
                    type: "binding-matches",
                    binding: "it",
                    filter: {
                      typeBox: {
                        types: ["Action"],
                        subtypes: ["Attack"],
                      },
                    },
                  },
                  then: {
                    type: "sequence",
                    steps: [
                      {
                        type: "discard",
                        target: {
                          selector: "object",
                          declared: "at-resolution",
                          player: "each",
                          zones: ["hand"],
                          count: 1,
                        },
                      },
                      {
                        type: "create-token",
                        token: "gold",
                        controller: "controller",
                      },
                    ],
                  },
                },
                {
                  type: "self-replacement",
                  condition: {
                    type: "performed-this-turn",
                    event: "activate-cannon",
                    player: "controller",
                  },
                  modification: {
                    type: "look",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "opponent",
                      zones: ["hand"],
                      count: {
                        type: "all",
                      },
                    },
                    outputBinding: "it",
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
  seismicSurge: {
    canonicalId: "Rf8CHpzmhJNppCtDDKWDm",
    slug: "seismic-surge",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Seismic Surge"],
      activeFaceIds: ["Rf8CHpzmhJNppCtDDKWDm:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: ["Token"],
          supertypes: ["Guardian"],
          types: ["Token"],
          subtypes: ["Aura"],
        },
      ],
      typeBox: {
        metatypes: ["Token"],
        supertypes: ["Guardian"],
        types: ["Token"],
        subtypes: ["Aura"],
      },
      traits: [],
      textBoxIds: ["Rf8CHpzmhJNppCtDDKWDm"],
      numeric: {},
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "action-phase-start",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "none",
              },
            },
          },
          id: "Rf8CHpzmhJNppCtDDKWDm:reduceGuardianAttackCostAtActionPhase",
          text: "At the beginning of your action phase, destroy this, then the next Guardian attack action card you play this turn costs {r} less to play.",
          resolution: {
            kind: "effect",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "destroy",
                  target: {
                    selector: "self",
                  },
                },
                {
                  type: "modify-numeric",
                  property: "cost",
                  op: "subtract",
                  amount: 1,
                  duration: "this-turn",
                  appliesTo: {
                    next: {
                      and: [
                        {
                          typeBox: {
                            supertypes: ["Guardian"],
                          },
                        },
                        {
                          typeBox: {
                            subtypes: ["Attack"],
                          },
                        },
                        {
                          typeBox: {
                            types: ["Action"],
                          },
                        },
                      ],
                    },
                    events: ["play", "attack"],
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
  fry: {
    canonicalId: "JfqmwhFzQNjrQB8qTGHpN",
    slug: "fry-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Fry"],
      activeFaceIds: ["JfqmwhFzQNjrQB8qTGHpN:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Lightning"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Lightning"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["JfqmwhFzQNjrQB8qTGHpN"],
      numeric: {
        pitch: 1,
        cost: 0,
        power: 3,
        defense: 0,
      },
      keywords: [
        {
          name: "go-again",
        },
      ],
      abilities: [],
    },
  },
  embodiment: {
    canonicalId: "QBwTWNc9FMGQfwHRTTdHj",
    slug: "embodiment-of-lightning",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Embodiment of Lightning"],
      activeFaceIds: ["QBwTWNc9FMGQfwHRTTdHj:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: ["Token"],
          supertypes: ["Elemental"],
          types: ["Token"],
          subtypes: ["Aura"],
        },
      ],
      typeBox: {
        metatypes: ["Token"],
        supertypes: ["Elemental"],
        types: ["Token"],
        subtypes: ["Aura"],
      },
      traits: [],
      textBoxIds: ["QBwTWNc9FMGQfwHRTTdHj"],
      numeric: {},
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "play",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "event-object",
                selector: "played-card",
                relationship: {
                  kind: "any",
                },
                filter: {
                  typeBox: {
                    types: ["Action"],
                    subtypes: ["Attack"],
                  },
                },
                bindAs: "it",
              },
            },
          },
          id: "QBwTWNc9FMGQfwHRTTdHj:grantGoAgainToAttackAction",
          text: "When you play an attack action card, destroy this, then the attack gets go again.",
          resolution: {
            kind: "effect",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "destroy",
                  target: {
                    selector: "self",
                  },
                },
                {
                  type: "grant-property",
                  property: {
                    kind: "keyword",
                    keyword: {
                      name: "go-again",
                    },
                  },
                  target: {
                    selector: "binding",
                    binding: "it",
                  },
                  duration: "this-turn",
                },
              ],
            },
          },
        },
      ],
    },
  },
  blueFive: {
    canonicalId: "NdwNmwRFRBQ8hFnrRTJcG",
    slug: "vigorous-smashup-blue",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Vigorous Smashup"],
      activeFaceIds: ["NdwNmwRFRBQ8hFnrRTJcG:face:front"],
      color: "blue",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Brute"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Brute"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["NdwNmwRFRBQ8hFnrRTJcG"],
      numeric: {
        pitch: 3,
        cost: 3,
        power: 5,
        defense: 3,
      },
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "defend",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "defender",
              },
            },
          },
          label: {
            name: "clash",
          },
          id: "NdwNmwRFRBQ8hFnrRTJcG:triggeredStaticOnDefendEffect",
          text: "When this defends, clash with the attacking hero. The winner creates a Vigor token. You may put your revealed card on the bottom of its owner's deck.",
          resolution: {
            kind: "effect",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "clash",
                  with: {
                    selector: "attacking-hero",
                  },
                  prize: {
                    type: "create-token",
                    token: "vigor",
                    controller: "winner",
                  },
                },
                {
                  type: "optional",
                  effect: {
                    type: "move-card",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "controller",
                      zones: ["hero"],
                      filter: {
                        hasStatus: "revealed",
                      },
                      count: 1,
                    },
                    to: {
                      zone: "deck",
                      position: "bottom",
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
  zeroToSixty: {
    canonicalId: "FgPpQpjMRLqL88FKhFPq6",
    slug: "zero-to-sixty-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Zero to Sixty"],
      activeFaceIds: ["FgPpQpjMRLqL88FKhFPq6:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Mechanologist"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Mechanologist"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["FgPpQpjMRLqL88FKhFPq6"],
      numeric: {
        pitch: 1,
        cost: 0,
        power: 4,
        defense: 3,
      },
      keywords: [
        {
          name: "boost",
        },
      ],
      abilities: [],
    },
  },
  firewall: {
    canonicalId: "kHP6QW9GNhJzkDjq7nGpk",
    slug: "firewall-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Firewall"],
      activeFaceIds: ["kHP6QW9GNhJzkDjq7nGpk:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Mechanologist"],
          types: ["Block"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Mechanologist"],
        types: ["Block"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["kHP6QW9GNhJzkDjq7nGpk"],
      numeric: {
        pitch: 1,
        defense: 4,
      },
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "defend",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "defender",
              },
            },
          },
          id: "kHP6QW9GNhJzkDjq7nGpk:revealEvoToPreventDamage",
          text: "When this defends, reveal the top card of your deck. If it's an Evo, put it on top of your deck. Otherwise, put it on the bottom.",
          resolution: {
            kind: "effect",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "reveal",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "controller",
                    zones: ["deck"],
                    position: "top",
                    count: 1,
                  },
                  outputBinding: "it",
                },
                {
                  type: "conditional",
                  condition: {
                    type: "binding-matches",
                    binding: "it",
                    filter: {
                      typeBox: {
                        subtypes: ["Evo"],
                      },
                    },
                  },
                  then: {
                    type: "move-card",
                    target: {
                      selector: "binding",
                      binding: "it",
                    },
                    to: {
                      zone: "deck",
                      position: "top",
                    },
                  },
                  else: {
                    type: "move-card",
                    target: {
                      selector: "binding",
                      binding: "it",
                    },
                    to: {
                      zone: "deck",
                      position: "bottom",
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
  evoBetaLegs: {
    canonicalId: "GQDtpfrtDcDkPDFPwjRmf",
    slug: "evo-beta-base-legs-blue",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Evo Beta Base Legs"],
      activeFaceIds: ["GQDtpfrtDcDkPDFPwjRmf:face:front"],
      color: "blue",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Mechanologist"],
          types: ["Action", "Equipment"],
          subtypes: ["Base", "Evo", "Legs"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Mechanologist"],
        types: ["Action", "Equipment"],
        subtypes: ["Base", "Evo", "Legs"],
      },
      traits: [],
      textBoxIds: ["GQDtpfrtDcDkPDFPwjRmf"],
      numeric: {
        pitch: 3,
        cost: 0,
        defense: 1,
      },
      keywords: [
        {
          name: "battleworn",
        },
      ],
      abilities: [
        {
          kind: "resolution",
          condition: {
            type: "equipped-count",
            filter: {
              typeBox: {
                types: ["Equipment"],
                subtypes: ["Base", "Legs"],
              },
            },
            comparison: {
              op: "gte",
              value: 1,
            },
          },
          effect: {
            type: "sequence",
            steps: [
              {
                type: "transform",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["equipment-legs"],
                  filter: {
                    typeBox: {
                      types: ["Equipment"],
                      subtypes: ["Base", "Legs"],
                    },
                  },
                  count: 1,
                },
                into: "this",
              },
              {
                type: "equip",
                target: {
                  selector: "self",
                },
              },
            ],
          },
          label: {
            name: "transform",
          },
          id: "GQDtpfrtDcDkPDFPwjRmf:ifHaveBaseLegsEquippedTransformIntoThenEquip",
          text: "If you have a base legs equipped, transform it into this, then equip this.\nEvo legs cost you {r} less to play.\nBattleworn",
        },
        {
          kind: "static",
          staticKind: "play",
          playEffect: {
            role: "cost-reduction",
            filter: {
              typeBox: {
                subtypes: ["Evo", "Legs"],
              },
            },
            cost: {
              class: "asset",
              type: "resources",
              amount: 1,
            },
          },
          label: {
            name: "transform",
          },
          id: "GQDtpfrtDcDkPDFPwjRmf:evoLegsCostLessPlay",
          text: "If you have a base legs equipped, transform it into this, then equip this.\nEvo legs cost you {r} less to play.\nBattleworn",
        },
      ],
    },
  },
  evoSoulTower: {
    canonicalId: "tP6fcfbgwkrhMPdrrgqMw",
    slug: "evo-steel-soul-tower-blue",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Evo Steel Soul Tower"],
      activeFaceIds: ["tP6fcfbgwkrhMPdrrgqMw:face:front"],
      color: "blue",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Mechanologist"],
          types: ["Action", "Equipment"],
          subtypes: ["Base", "Evo", "Legs"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Mechanologist"],
        types: ["Action", "Equipment"],
        subtypes: ["Base", "Evo", "Legs"],
      },
      traits: [],
      textBoxIds: ["tP6fcfbgwkrhMPdrrgqMw"],
      numeric: {
        pitch: 3,
        cost: 4,
        defense: 3,
      },
      keywords: [
        {
          name: "temper",
        },
      ],
      abilities: [
        {
          kind: "resolution",
          condition: {
            type: "equipped-count",
            filter: {
              typeBox: {
                types: ["Equipment"],
                subtypes: ["Base", "Legs"],
              },
            },
            comparison: {
              op: "gte",
              value: 1,
            },
          },
          effect: {
            type: "sequence",
            steps: [
              {
                type: "transform",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["equipment-legs"],
                  filter: {
                    typeBox: {
                      types: ["Equipment"],
                      subtypes: ["Base", "Legs"],
                    },
                  },
                  count: 1,
                },
                into: "this",
              },
              {
                type: "equip",
                target: {
                  selector: "self",
                },
              },
            ],
          },
          label: {
            name: "transform",
          },
          id: "tP6fcfbgwkrhMPdrrgqMw:ifHaveBaseLegsEquippedTransformIntoThenEquip",
          text: "If you have a base legs equipped, transform it into this, then equip this.\nWhen this transforms from or into an Evo with a different name, gain 1 action point. If that Evo is a hero, instead this triggers twice.\nTemper",
        },
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              kind: "any-of",
              patterns: [
                {
                  name: "transform",
                  actor: {
                    kind: "any",
                  },
                  observes: {
                    kind: "source",
                    selector: "object",
                  },
                  transformPartner: {
                    typeBox: {
                      subtypes: ["Evo"],
                    },
                    hasStatus: "different-name",
                  },
                },
                {
                  name: "transform",
                  actor: {
                    kind: "any",
                  },
                  observes: {
                    kind: "source",
                    selector: "incoming-object",
                  },
                  transformPartner: {
                    typeBox: {
                      subtypes: ["Evo"],
                    },
                    hasStatus: "different-name",
                  },
                },
              ],
            },
          },
          label: {
            name: "transform",
          },
          id: "tP6fcfbgwkrhMPdrrgqMw:whenTransformsFromIntoEvoDifferentNameGain1",
          text: "If you have a base legs equipped, transform it into this, then equip this.\nWhen this transforms from or into an Evo with a different name, gain 1 action point. If that Evo is a hero, instead this triggers twice.\nTemper",
          resolution: {
            kind: "effect",
            effect: {
              type: "repeat",
              effect: {
                type: "gain-action-points",
                amount: 1,
              },
              times: {
                type: "conditional",
                condition: {
                  type: "has-status",
                  status: "transformed-evo-is-hero",
                },
                then: 2,
                else: 1,
              },
            },
          },
        },
      ],
    },
  },
  singularity: {
    canonicalId: "67zdgKFWD7qzcPppbRHNB",
    slug: "singularity-red",
    layout: {
      kind: "flip",
      family: "construct",
      front: {
        faceId: "67zdgKFWD7qzcPppbRHNB:face:front",
        name: "Singularity",
        typeText: "Mechanologist Action - Construct",
        types: ["Mechanologist", "Action", "Construct"],
        traits: [],
        text: "Legendary Teklovossen Specialization\nTransform your hero, your weapon, and 4 Evos you have equipped into Teklovossen, the Mechropotent. It enters the arena with {h} equal to the hero it transformed from.",
        keywords: [
          {
            name: "legendary",
          },
          {
            name: "specialization",
            hero: "Teklovossen",
          },
        ],
        abilities: [
          {
            kind: "resolution",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "sequence",
                  steps: [
                    {
                      type: "transform",
                      target: {
                        selector: "object",
                        declared: "at-resolution",
                        player: "controller",
                        zones: ["hero"],
                        count: 1,
                      },
                      into: "teklovossen-the-mechropotent",
                    },
                    {
                      type: "transform",
                      target: {
                        selector: "object",
                        declared: "at-resolution",
                        player: "controller",
                        zones: ["weapon"],
                        count: 1,
                      },
                      into: "teklovossen-the-mechropotent",
                    },
                    {
                      type: "transform",
                      target: {
                        selector: "object",
                        declared: "at-resolution",
                        player: "controller",
                        zones: ["permanent"],
                        filter: {
                          typeBox: {
                            subtypes: ["Evo"],
                          },
                        },
                        count: 4,
                      },
                      into: "teklovossen-the-mechropotent",
                    },
                  ],
                },
                {
                  type: "modify-numeric",
                  property: "life",
                  op: "set-base",
                  amount: {
                    type: "hero-property",
                    property: "life",
                    player: "controller",
                  },
                  target: {
                    selector: "self",
                  },
                  duration: "permanent",
                },
              ],
            },
            label: {
              name: "transform",
            },
            id: "67zdgKFWD7qzcPppbRHNB:transformHeroWeaponNumber4EvosHaveEquippedIntoTeklovossenMechropotentEntersArena",
            text: "Legendary Teklovossen Specialization\nTransform your hero, your weapon, and 4 Evos you have equipped into Teklovossen, the Mechropotent. It enters the arena with {h} equal to the hero it transformed from.",
          },
        ],
        color: "red",
        numeric: {
          pitch: 1,
          cost: 6,
          defense: 3,
        },
      },
      back: {
        faceId: "67zdgKFWD7qzcPppbRHNB:face:back",
        name: "Teklovossen, the Mechropotent",
        typeText: "Shadow Mechanologist Demi-Hero Equipment - Evo",
        types: ["Mechanologist", "Shadow", "Demi-Hero", "Equipment", "Evo"],
        traits: [],
        text: "Action - {r}{r}{r}, banish 2 cards from your soul: Attack\nWhenever this attacks a hero, they discard a card.\nYour Mechanologist attack action cards get go again.\nThis counts as having 4 Evos equipped.\nBattleworn",
        keywords: [
          {
            name: "battleworn",
          },
        ],
        abilities: [
          {
            kind: "activated",
            abilityType: "attack",
            cost: {
              class: "mixed",
              type: "all",
              costs: [
                {
                  class: "asset",
                  type: "resources",
                  amount: 3,
                },
                {
                  class: "effect",
                  type: "banish",
                  from: "soul",
                  count: 2,
                },
              ],
            },
            effect: {
              type: "attack-with",
              target: {
                selector: "self",
              },
            },
            id: "BRpMLJdMBPgfJNJLJWDFg:attack",
            text: "Action - {r}{r}{r}, banish 2 cards from your soul: Attack\nWhenever this attacks a hero, they discard a card.\nYour Mechanologist attack action cards get go again.\nThis counts as having 4 Evos equipped.\nBattleworn",
          },
          {
            kind: "static",
            staticKind: "triggered",
            trigger: {
              kind: "event",
              event: {
                name: "attack",
                actor: {
                  kind: "player",
                  player: "ability-controller",
                },
                observes: {
                  kind: "source",
                  selector: "attack",
                },
                target: {
                  kind: "hero",
                },
              },
            },
            id: "BRpMLJdMBPgfJNJLJWDFg:discardOnAttack",
            text: "Action - {r}{r}{r}, banish 2 cards from your soul: Attack\nWhenever this attacks a hero, they discard a card.\nYour Mechanologist attack action cards get go again.\nThis counts as having 4 Evos equipped.\nBattleworn",
            resolution: {
              kind: "effect",
              effect: {
                type: "discard",
                target: {
                  selector: "attack-target",
                },
              },
            },
          },
          {
            kind: "static",
            staticKind: "continuous",
            effect: {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: {
                  name: "go-again",
                },
              },
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["stack", "combat-chain"],
                filter: {
                  typeBox: {
                    supertypes: ["Mechanologist"],
                    types: ["Action"],
                    subtypes: ["Attack"],
                  },
                },
                count: {
                  type: "all",
                },
              },
              duration: "while-in-arena",
            },
            id: "BRpMLJdMBPgfJNJLJWDFg:grantMechanologistAttacksGoAgain",
            text: "Action - {r}{r}{r}, banish 2 cards from your soul: Attack\nWhenever this attacks a hero, they discard a card.\nYour Mechanologist attack action cards get go again.\nThis counts as having 4 Evos equipped.\nBattleworn",
          },
          {
            kind: "static",
            staticKind: "continuous",
            effect: {
              type: "rule-modification",
              mode: "allow",
              action: "count-as-equipped",
              filter: {
                typeBox: {
                  subtypes: ["Evo"],
                },
              },
              limit: {
                count: 4,
              },
              duration: "while-in-arena",
            },
            id: "BRpMLJdMBPgfJNJLJWDFg:countAsFourEvos",
            text: "Action - {r}{r}{r}, banish 2 cards from your soul: Attack\nWhenever this attacks a hero, they discard a card.\nYour Mechanologist attack action cards get go again.\nThis counts as having 4 Evos equipped.\nBattleworn",
          },
        ],
        numeric: {
          power: 6,
          defense: 6,
          intellect: 3,
        },
      },
    },
    base: {
      names: ["Singularity"],
      activeFaceIds: ["67zdgKFWD7qzcPppbRHNB:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Mechanologist"],
          types: ["Action"],
          subtypes: ["Construct"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Mechanologist"],
        types: ["Action"],
        subtypes: ["Construct"],
      },
      traits: [],
      textBoxIds: ["67zdgKFWD7qzcPppbRHNB"],
      numeric: {
        pitch: 1,
        cost: 6,
        defense: 3,
      },
      keywords: [
        {
          name: "legendary",
        },
        {
          name: "specialization",
          hero: "Teklovossen",
        },
      ],
      abilities: [
        {
          kind: "resolution",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "sequence",
                steps: [
                  {
                    type: "transform",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "controller",
                      zones: ["hero"],
                      count: 1,
                    },
                    into: "teklovossen-the-mechropotent",
                  },
                  {
                    type: "transform",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "controller",
                      zones: ["weapon"],
                      count: 1,
                    },
                    into: "teklovossen-the-mechropotent",
                  },
                  {
                    type: "transform",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "controller",
                      zones: ["permanent"],
                      filter: {
                        typeBox: {
                          subtypes: ["Evo"],
                        },
                      },
                      count: 4,
                    },
                    into: "teklovossen-the-mechropotent",
                  },
                ],
              },
              {
                type: "modify-numeric",
                property: "life",
                op: "set-base",
                amount: {
                  type: "hero-property",
                  property: "life",
                  player: "controller",
                },
                target: {
                  selector: "self",
                },
                duration: "permanent",
              },
            ],
          },
          label: {
            name: "transform",
          },
          id: "67zdgKFWD7qzcPppbRHNB:transformHeroWeaponNumber4EvosHaveEquippedIntoTeklovossenMechropotentEntersArena",
          text: "Legendary Teklovossen Specialization\nTransform your hero, your weapon, and 4 Evos you have equipped into Teklovossen, the Mechropotent. It enters the arena with {h} equal to the hero it transformed from.",
        },
      ],
    },
  },
  fluxor: {
    canonicalId: "mLQbHGnCHtLpmJh6LWLbP",
    slug: "volatile-fluxor-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Volatile Fluxor"],
      activeFaceIds: ["mLQbHGnCHtLpmJh6LWLbP:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Lightning"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Lightning"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["mLQbHGnCHtLpmJh6LWLbP"],
      numeric: {
        pitch: 1,
        cost: 0,
        power: 0,
        defense: 3,
      },
      keywords: [
        {
          name: "go-again",
        },
      ],
      abilities: [
        {
          kind: "resolution",
          condition: {
            type: "played-this",
            per: "chain-link",
            filter: {
              typeBox: {
                types: ["Instant"],
              },
            },
            comparison: {
              op: "gte",
              value: 1,
            },
          },
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 3,
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
          id: "mLQbHGnCHtLpmJh6LWLbP:resolutionModifyNumeric",
          text: "If you've played an instant card this chain link, this gets +3{p}.\nWhen this hits, create a Lightning Flow token.\nGo again",
        },
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "hit",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "attack",
              },
            },
          },
          id: "mLQbHGnCHtLpmJh6LWLbP:triggeredEffect",
          text: "If you've played an instant card this chain link, this gets +3{p}.\nWhen this hits, create a Lightning Flow token.\nGo again",
          resolution: {
            kind: "effect",
            effect: {
              type: "create-token",
              token: "lightning-flow",
              controller: "controller",
            },
          },
        },
      ],
    },
  },
  lightningGreaves: {
    canonicalId: "dpPzdRQgfkBRgcHbWMQpt",
    slug: "lightning-greaves",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Lightning Greaves"],
      activeFaceIds: ["dpPzdRQgfkBRgcHbWMQpt:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Lightning"],
          types: ["Equipment"],
          subtypes: ["Legs"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Lightning"],
        types: ["Equipment"],
        subtypes: ["Legs"],
      },
      traits: [],
      textBoxIds: ["dpPzdRQgfkBRgcHbWMQpt"],
      numeric: {
        defense: 1,
      },
      keywords: [
        {
          name: "arcane-barrier",
          value: 1,
        },
        {
          name: "battleworn",
        },
      ],
      abilities: [
        {
          kind: "activated",
          abilityType: "instant",
          cost: {
            class: "mixed",
            type: "all",
            costs: [
              {
                class: "asset",
                type: "resources",
                amount: 1,
              },
              {
                class: "effect",
                type: "destroy-self",
              },
            ],
          },
          effect: {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: {
                name: "go-again",
              },
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  types: ["Instant"],
                },
              },
              count: 32,
              events: ["play", "attack"],
            },
          },
          id: "dpPzdRQgfkBRgcHbWMQpt:instantDestroyInstantPlayTurnGetGoAgain",
          text: "Instant - {r}, destroy this: Instant cards you play this turn get go again.\nArcane Barrier 1\nBattleworn",
        },
      ],
    },
  },
  arakniDagger: {
    canonicalId: "QTkWJ8jqCgbMCTcNpmMmC",
    slug: "hunter-s-klaive",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Hunter's Klaive"],
      activeFaceIds: ["QTkWJ8jqCgbMCTcNpmMmC:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Assassin"],
          types: ["Weapon"],
          subtypes: ["1H", "Dagger"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Assassin"],
        types: ["Weapon"],
        subtypes: ["1H", "Dagger"],
      },
      traits: [],
      textBoxIds: ["QTkWJ8jqCgbMCTcNpmMmC"],
      numeric: {
        power: 1,
      },
      keywords: [
        {
          name: "piercing",
          value: 1,
        },
      ],
      abilities: [
        {
          kind: "activated",
          limit: {
            count: 1,
            per: "turn",
          },
          abilityType: "attack",
          cost: {
            class: "asset",
            type: "resources",
            amount: 2,
          },
          layerKeywords: [
            {
              name: "go-again",
            },
          ],
          effect: {
            type: "attack-with",
            target: {
              selector: "self",
            },
          },
          label: {
            name: "mark",
          },
          id: "QTkWJ8jqCgbMCTcNpmMmC:oncePerTurnActionResourceResourceAttackGoAgain",
          text: "Once per Turn Action - {r}{r}: Attack. Go again\nWhen this hits a hero, mark them.\nPiercing 1",
        },
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "hit",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "attack",
              },
              target: {
                kind: "hero",
              },
            },
          },
          label: {
            name: "mark",
          },
          id: "QTkWJ8jqCgbMCTcNpmMmC:hitsMark",
          text: "Once per Turn Action - {r}{r}: Attack. Go again\nWhen this hits a hero, mark them.\nPiercing 1",
          resolution: {
            kind: "effect",
            effect: {
              type: "mark",
              target: {
                selector: "attack-target",
              },
            },
          },
        },
      ],
    },
  },
  viseraiTheForsaken: {
    canonicalId: "RLJggjWTcq6NK9PD9zQGh",
    slug: "viserai-the-forsaken",
    layout: {
      kind: "twin",
      front: {
        faceId: "RLJggjWTcq6NK9PD9zQGh:face:front",
        name: "Viserai, the Forsaken",
        typeText: "Shadow Runeblade Hero",
        types: ["Runeblade", "Shadow", "Hero"],
        traits: [],
        text: "Whenever you create 1 or more Runechants, banish the top card of your deck. Then if you've created 3 or more Runechants this turn, traverse.",
        keywords: [
          {
            name: "traverse",
          },
        ],
        abilities: [
          {
            kind: "static",
            staticKind: "triggered",
            trigger: {
              kind: "event",
              event: {
                name: "create",
                actor: {
                  kind: "player",
                  player: "ability-controller",
                },
                observes: {
                  kind: "event-object",
                  selector: "created-object",
                  relationship: {
                    kind: "any",
                  },
                  filter: {
                    name: "Runechant",
                  },
                },
                amount: {
                  op: "gte",
                  value: 1,
                },
              },
            },
            id: "RLJggjWTcq6NK9PD9zQGh:wheneverCreate1MoreRunechantsBanishTopDeckThenCreated3MoreRunechantsTurnTraverse",
            text: "Whenever you create 1 or more Runechants, banish the top card of your deck. Then if you've created 3 or more Runechants this turn, traverse.",
            resolution: {
              kind: "effect",
              effect: {
                type: "sequence",
                steps: [
                  {
                    type: "banish",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "controller",
                      zones: ["deck"],
                      position: "top",
                      count: 1,
                    },
                    outputBinding: "it",
                  },
                  {
                    type: "conditional",
                    condition: {
                      type: "compare-amount",
                      amount: {
                        type: "count",
                        what: "runechants-created-this-turn",
                      },
                      comparison: {
                        op: "gte",
                        value: 3,
                      },
                    },
                    then: {
                      type: "transform",
                      target: {
                        selector: "self",
                      },
                      into: "traverse",
                    },
                  },
                ],
              },
            },
          },
        ],
        numeric: {
          life: 40,
          intellect: 4,
        },
      },
      back: {
        faceId: "RLJggjWTcq6NK9PD9zQGh:face:back",
        name: "Viserai, Usurper",
        typeText: "Shadow Runeblade Hero - Demon",
        types: ["Runeblade", "Shadow", "Hero", "Demon"],
        traits: [],
        text: "The first attack action card with blood debt you play each turn gets go again.\nAt the beginning of each end phase, if you've created or activated a Gate to i'Arathael this turn, you may traverse.",
        keywords: [
          {
            name: "traverse",
          },
        ],
        abilities: [
          {
            kind: "static",
            staticKind: "continuous",
            effect: {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: {
                  name: "go-again",
                },
              },
              target: {
                selector: "this-attack",
              },
              duration: "while-in-arena",
              appliesTo: {
                next: {
                  hasKeyword: "blood-debt",
                  typeBox: {
                    types: ["Action"],
                    subtypes: ["Attack"],
                  },
                },
                ordinal: 1,
                perTurn: true,
                events: ["play", "attack"],
              },
            },
            id: "QMGnHJqg6fhcKLfmpRQLz:firstAttackActionBloodDebtPlayTurnGetsGoAgain",
            text: "The first attack action card with blood debt you play each turn gets go again.\nAt the beginning of each end phase, if you've created or activated a Gate to i'Arathael this turn, you may traverse.",
          },
          {
            kind: "static",
            staticKind: "triggered",
            trigger: {
              kind: "event-and-state",
              event: {
                name: "end-phase",
                actor: {
                  kind: "any",
                },
                observes: {
                  kind: "none",
                },
              },
              state: {
                type: "performed-this-turn",
                event: "create-or-activate-gate-to-iarathael",
                player: "controller",
              },
            },
            id: "QMGnHJqg6fhcKLfmpRQLz:beginningEndPhaseCreatedActivatedGateIArathaelTurnTraverse",
            text: "The first attack action card with blood debt you play each turn gets go again.\nAt the beginning of each end phase, if you've created or activated a Gate to i'Arathael this turn, you may traverse.",
            resolution: {
              kind: "effect",
              effect: {
                type: "optional",
                effect: {
                  type: "transform",
                  target: {
                    selector: "self",
                  },
                  into: "traverse",
                },
              },
            },
          },
        ],
        numeric: {
          intellect: 4,
        },
      },
    },
    base: {
      names: ["Viserai, the Forsaken"],
      activeFaceIds: ["RLJggjWTcq6NK9PD9zQGh:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Runeblade", "Shadow"],
          types: ["Hero"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Runeblade", "Shadow"],
        types: ["Hero"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["RLJggjWTcq6NK9PD9zQGh"],
      numeric: {
        life: 40,
        intellect: 4,
      },
      keywords: [
        {
          name: "traverse",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "create",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "event-object",
                selector: "created-object",
                relationship: {
                  kind: "any",
                },
                filter: {
                  name: "Runechant",
                },
              },
              amount: {
                op: "gte",
                value: 1,
              },
            },
          },
          id: "RLJggjWTcq6NK9PD9zQGh:wheneverCreate1MoreRunechantsBanishTopDeckThenCreated3MoreRunechantsTurnTraverse",
          text: "Whenever you create 1 or more Runechants, banish the top card of your deck. Then if you've created 3 or more Runechants this turn, traverse.",
          resolution: {
            kind: "effect",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "banish",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "controller",
                    zones: ["deck"],
                    position: "top",
                    count: 1,
                  },
                  outputBinding: "it",
                },
                {
                  type: "conditional",
                  condition: {
                    type: "compare-amount",
                    amount: {
                      type: "count",
                      what: "runechants-created-this-turn",
                    },
                    comparison: {
                      op: "gte",
                      value: 3,
                    },
                  },
                  then: {
                    type: "transform",
                    target: {
                      selector: "self",
                    },
                    into: "traverse",
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
  bloodsongGloomblade: {
    canonicalId: "RKtGjjJjBqhkrfb9PkRHw",
    slug: "bloodsong-gloomblade-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Bloodsong Gloomblade"],
      activeFaceIds: ["RKtGjjJjBqhkrfb9PkRHw:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Runeblade", "Shadow"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Runeblade", "Shadow"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["RKtGjjJjBqhkrfb9PkRHw"],
      numeric: {
        pitch: 1,
        cost: 0,
        power: 2,
        defense: 3,
      },
      keywords: [
        {
          name: "usurp",
        },
        {
          name: "blood-debt",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "play",
          playEffect: {
            role: "permission",
            fromZones: ["banished"],
          },
          id: "RKtGjjJjBqhkrfb9PkRHw:banished",
          text: "You may play this from your banished zone.\nUsurp\nWhen this hits a hero, you may banish target aura permanent they control.\nBlood Debt",
        },
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "hit",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "attack",
              },
              target: {
                kind: "hero",
              },
            },
          },
          id: "RKtGjjJjBqhkrfb9PkRHw:hit",
          text: "You may play this from your banished zone.\nUsurp\nWhen this hits a hero, you may banish target aura permanent they control.\nBlood Debt",
          resolution: {
            kind: "effect",
            effect: {
              type: "optional",
              effect: {
                type: "banish",
                target: {
                  selector: "object",
                  declared: "on-stack",
                  player: "attack-target",
                  zones: ["permanent"],
                  filter: {
                    typeBox: {
                      subtypes: ["Aura"],
                    },
                  },
                  count: 1,
                },
              },
            },
          },
        },
      ],
    },
  },
  cullingsongGloomblade: {
    canonicalId: "Hbj86fDdmMwRkCMpwwfNw",
    slug: "cullingsong-gloomblade-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Cullingsong Gloomblade"],
      activeFaceIds: ["Hbj86fDdmMwRkCMpwwfNw:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Runeblade", "Shadow"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Runeblade", "Shadow"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["Hbj86fDdmMwRkCMpwwfNw"],
      numeric: {
        pitch: 1,
        cost: 0,
        power: 2,
        defense: 3,
      },
      keywords: [
        {
          name: "usurp",
        },
        {
          name: "blood-debt",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "play",
          playEffect: {
            role: "permission",
            fromZones: ["banished"],
          },
          id: "Hbj86fDdmMwRkCMpwwfNw:banished",
          text: "You may play this from your banished zone.\nUsurp\nWhen this hits a hero, they banish a card from their hand.\nBlood Debt",
        },
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "hit",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "attack",
              },
              target: {
                kind: "hero",
              },
            },
          },
          id: "Hbj86fDdmMwRkCMpwwfNw:hit",
          text: "You may play this from your banished zone.\nUsurp\nWhen this hits a hero, they banish a card from their hand.\nBlood Debt",
          resolution: {
            kind: "effect",
            effect: {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "attack-target",
                zones: ["hand"],
                count: 1,
              },
            },
          },
        },
      ],
    },
  },
  plundersongGloomblade: {
    canonicalId: "KKwgLK6Hhzbf9DTBbhJ8c",
    slug: "plundersong-gloomblade-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Plundersong Gloomblade"],
      activeFaceIds: ["KKwgLK6Hhzbf9DTBbhJ8c:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Runeblade", "Shadow"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Runeblade", "Shadow"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["KKwgLK6Hhzbf9DTBbhJ8c"],
      numeric: {
        pitch: 1,
        cost: 0,
        power: 2,
        defense: 3,
      },
      keywords: [
        {
          name: "usurp",
        },
        {
          name: "blood-debt",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "play",
          playEffect: {
            role: "permission",
            fromZones: ["banished"],
          },
          id: "KKwgLK6Hhzbf9DTBbhJ8c:banished",
          text: "You may play this from your banished zone.\nUsurp\nWhen this hits a hero, they banish a card in their arsenal.\nBlood Debt",
        },
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "hit",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "attack",
              },
              target: {
                kind: "hero",
              },
            },
          },
          id: "KKwgLK6Hhzbf9DTBbhJ8c:hit",
          text: "You may play this from your banished zone.\nUsurp\nWhen this hits a hero, they banish a card in their arsenal.\nBlood Debt",
          resolution: {
            kind: "effect",
            effect: {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "attack-target",
                zones: ["arsenal"],
                count: 1,
              },
            },
          },
        },
      ],
    },
  },
  embraceUrsur: {
    canonicalId: "BMWL86gpr7dDBCcfChgRg",
    slug: "embrace-ursur-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Embrace Ursur"],
      activeFaceIds: ["BMWL86gpr7dDBCcfChgRg:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Runeblade", "Shadow"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Runeblade", "Shadow"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["BMWL86gpr7dDBCcfChgRg"],
      numeric: {
        pitch: 1,
        cost: 1,
        power: 3,
        defense: 3,
      },
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "attack",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "attack",
              },
            },
          },
          id: "BMWL86gpr7dDBCcfChgRg:embrace",
          text: "When this attacks, you may banish a card from your hand. If it's Runeblade, create a Runechant token. If it's Shadow, this gets go again.",
          resolution: {
            kind: "effect",
            effect: {
              type: "optional",
              effect: {
                type: "banish",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hand"],
                  count: 1,
                },
                outputBinding: "it",
              },
              then: {
                type: "sequence",
                steps: [
                  {
                    type: "conditional",
                    condition: {
                      type: "binding-matches",
                      binding: "it",
                      filter: {
                        typeBox: {
                          supertypes: ["Runeblade"],
                        },
                      },
                    },
                    then: {
                      type: "create-token",
                      token: "runechant",
                      controller: "controller",
                    },
                  },
                  {
                    type: "conditional",
                    condition: {
                      type: "binding-matches",
                      binding: "it",
                      filter: {
                        typeBox: {
                          supertypes: ["Shadow"],
                        },
                      },
                    },
                    then: {
                      type: "grant-property",
                      property: {
                        kind: "keyword",
                        keyword: {
                          name: "go-again",
                        },
                      },
                      target: {
                        selector: "self",
                      },
                      duration: "this-turn",
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  },
  runeragerSwarm: {
    canonicalId: "66LHrpFckMQ8WNWhPjbD6",
    slug: "runerager-swarm-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Runerager Swarm"],
      activeFaceIds: ["66LHrpFckMQ8WNWhPjbD6:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Runeblade"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Runeblade"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["66LHrpFckMQ8WNWhPjbD6"],
      numeric: {
        pitch: 1,
        cost: 0,
        power: 3,
        defense: 3,
      },
      keywords: [],
      abilities: [
        {
          kind: "resolution",
          condition: {
            type: "performed-this-turn",
            event: "play-or-create-aura",
            player: "controller",
          },
          effect: {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: {
                name: "go-again",
              },
            },
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
          id: "66LHrpFckMQ8WNWhPjbD6:performedThisTurnPlayOrCreateAuraGrantPropertyThisTurn",
          text: "If you've played or created an aura this turn, this gets go again.",
        },
      ],
    },
  },
  goreBelching: {
    canonicalId: "mJbdJCLQD9jgQRMPjBrLB",
    slug: "gore-belching-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Gore Belching"],
      activeFaceIds: ["mJbdJCLQD9jgQRMPjBrLB:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: [],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: [],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["mJbdJCLQD9jgQRMPjBrLB"],
      numeric: {
        pitch: 1,
        cost: 0,
        power: 7,
      },
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "attack",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "attack",
              },
            },
          },
          id: "mJbdJCLQD9jgQRMPjBrLB:whenAttacksRevealFromTopDeckUntilRevealAttack",
          text: "When this attacks, reveal cards from the top of your deck until you reveal an attack action card. If you do, banish it and this gets -X{p}, where X is the {p} of the card banished this way. Otherwise, this gets -7{p}. Shuffle.",
          resolution: {
            kind: "effect",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "unless",
                  effect: {
                    type: "modify-numeric",
                    property: "power",
                    op: "subtract",
                    amount: 7,
                    target: {
                      selector: "self",
                    },
                    duration: "this-turn",
                  },
                  escape: {
                    type: "if-you-do",
                    effect: {
                      type: "reveal",
                      target: {
                        selector: "object",
                        declared: "at-resolution",
                        player: "controller",
                        zones: ["deck"],
                        position: "top",
                        filter: {
                          typeBox: {
                            types: ["Action"],
                            subtypes: ["Attack"],
                          },
                        },
                        count: {
                          type: "all",
                        },
                      },
                      outputBinding: "it",
                    },
                    then: {
                      type: "sequence",
                      steps: [
                        {
                          type: "banish",
                          target: {
                            selector: "binding",
                            binding: "it",
                          },
                        },
                        {
                          type: "modify-numeric",
                          property: "power",
                          op: "subtract",
                          amount: {
                            type: "reference",
                            binding: "it",
                            property: "power",
                            missing: "zero",
                          },
                          target: {
                            selector: "self",
                          },
                          duration: "this-turn",
                        },
                      ],
                    },
                  },
                },
                {
                  type: "shuffle",
                  zone: "deck",
                },
              ],
            },
          },
        },
      ],
    },
  },
  eloquentEulogy: {
    canonicalId: "zjjTKPFFzRh9fMGmR6jPR",
    slug: "eloquent-eulogy-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Eloquent Eulogy"],
      activeFaceIds: ["zjjTKPFFzRh9fMGmR6jPR:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Runeblade", "Shadow"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Runeblade", "Shadow"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["zjjTKPFFzRh9fMGmR6jPR"],
      numeric: {
        pitch: 1,
        cost: 1,
        power: 4,
        defense: 3,
      },
      keywords: [
        {
          name: "rune-gate",
        },
        {
          name: "blood-debt",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event-and-state",
            event: {
              name: "combat-chain-close",
              actor: {
                kind: "none",
              },
              observes: {
                kind: "none",
              },
            },
            state: {
              type: "compare-amount",
              amount: {
                type: "count",
                what: "heroes-lost-life-this-turn",
              },
              comparison: {
                op: "gte",
                value: 1,
              },
            },
          },
          id: "zjjTKPFFzRh9fMGmR6jPR:whenCombatChainClosesIfHeroHasLostTurn",
          text: "Rune Gate\nWhen the combat chain closes, if a hero has lost {h} this turn, create an Eloquence token.\nBlood Debt",
          resolution: {
            kind: "effect",
            effect: {
              type: "create-token",
              token: "eloquence",
              controller: "controller",
            },
          },
        },
      ],
    },
  },
  maleficIncantation: {
    canonicalId: "CwJMHg9zGWTRtRFhbWNbf",
    slug: "malefic-incantation-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Malefic Incantation"],
      activeFaceIds: ["CwJMHg9zGWTRtRFhbWNbf:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Runeblade"],
          types: ["Action"],
          subtypes: ["Aura"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Runeblade"],
        types: ["Action"],
        subtypes: ["Aura"],
      },
      traits: [],
      textBoxIds: ["CwJMHg9zGWTRtRFhbWNbf"],
      numeric: {
        pitch: 1,
        cost: 0,
        defense: 2,
      },
      keywords: [
        {
          name: "go-again",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "continuous",
          effect: {
            type: "replacement",
            replacementKind: "standard",
            replaces: {
              name: "enter-arena",
              subject: "self",
            },
            modification: {
              type: "add-counter",
              counter: {
                kind: "named",
                name: "verse",
              },
              count: 3,
              target: {
                selector: "self",
              },
            },
            duration: "while-in-arena",
          },
          id: "CwJMHg9zGWTRtRFhbWNbf:continuousReplacementEnterArenaAddCounterVerseWhileInArena",
          text: "Go again\nThis enters the arena with 3 verse counters. When it has none, destroy it.\nOnce per turn, when you play an attack action card, remove a verse counter from this. If you do, create a Runechant token.",
        },
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "counter-removed",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "source",
                selector: "object",
              },
              remaining: 0,
            },
          },
          id: "CwJMHg9zGWTRtRFhbWNbf:triggeredCounterRemovedDestroy",
          text: "Go again\nThis enters the arena with 3 verse counters. When it has none, destroy it.\nOnce per turn, when you play an attack action card, remove a verse counter from this. If you do, create a Runechant token.",
          resolution: {
            kind: "effect",
            effect: {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
          },
        },
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "play",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "event-object",
                selector: "played-card",
                relationship: {
                  kind: "any",
                },
                filter: {
                  typeBox: {
                    types: ["Action"],
                    subtypes: ["Attack"],
                  },
                },
                bindAs: "it",
              },
            },
          },
          limit: {
            count: 1,
            per: "turn",
          },
          id: "CwJMHg9zGWTRtRFhbWNbf:triggeredPlayIfYouDoRemoveCountersVerseCreateTokenRunechant",
          text: "Go again\nThis enters the arena with 3 verse counters. When it has none, destroy it.\nOnce per turn, when you play an attack action card, remove a verse counter from this. If you do, create a Runechant token.",
          resolution: {
            kind: "effect",
            effect: {
              type: "if-you-do",
              effect: {
                type: "remove-counters",
                counter: {
                  kind: "named",
                  name: "verse",
                },
                count: 1,
                target: {
                  selector: "self",
                },
              },
              then: {
                type: "create-token",
                token: "runechant",
                controller: "controller",
              },
            },
          },
        },
      ],
    },
  },
  runebloodIncantation: {
    canonicalId: "HP8HBbKwHCRChp7n7MgDB",
    slug: "runeblood-incantation-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Runeblood Incantation"],
      activeFaceIds: ["HP8HBbKwHCRChp7n7MgDB:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Runeblade"],
          types: ["Action"],
          subtypes: ["Aura"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Runeblade"],
        types: ["Action"],
        subtypes: ["Aura"],
      },
      traits: [],
      textBoxIds: ["HP8HBbKwHCRChp7n7MgDB"],
      numeric: {
        pitch: 1,
        cost: 1,
        defense: 2,
      },
      keywords: [
        {
          name: "go-again",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "continuous",
          effect: {
            type: "replacement",
            replacementKind: "standard",
            replaces: {
              name: "enter-arena",
              subject: "self",
            },
            modification: {
              type: "add-counter",
              counter: {
                kind: "named",
                name: "verse",
              },
              count: 3,
              target: {
                selector: "self",
              },
            },
            duration: "while-in-arena",
          },
          id: "HP8HBbKwHCRChp7n7MgDB:continuousReplacementEnterArenaAddCounterVerseWhileInArena",
          text: "Go again\nRuneblood Incantation enters the arena with 3 verse counters on it.\nAt the beginning of your action phase, remove a verse counter from Runeblood Incantation. If you do create a Runechant token. Otherwise, destroy Runeblood Incantation.",
        },
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "action-phase-start",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "none",
              },
            },
          },
          id: "HP8HBbKwHCRChp7n7MgDB:triggeredActionPhaseStartUnlessDestroyIfYouDoRemoveCountersVerseRunebloodIncantationCreateTokenRunechant",
          text: "Go again\nRuneblood Incantation enters the arena with 3 verse counters on it.\nAt the beginning of your action phase, remove a verse counter from Runeblood Incantation. If you do create a Runechant token. Otherwise, destroy Runeblood Incantation.",
          resolution: {
            kind: "effect",
            effect: {
              type: "unless",
              effect: {
                type: "destroy",
                target: {
                  selector: "self",
                },
              },
              escape: {
                type: "if-you-do",
                effect: {
                  type: "remove-counters",
                  counter: {
                    kind: "named",
                    name: "verse",
                  },
                  count: 1,
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "controller",
                    zones: ["permanent"],
                    filter: {
                      name: "Runeblood Incantation",
                    },
                    count: 1,
                  },
                },
                then: {
                  type: "create-token",
                  token: "runechant",
                  controller: "controller",
                },
              },
            },
          },
        },
      ],
    },
  },
  revelInRuneblood: {
    canonicalId: "z9Jm6MkWcjqRHwQWkgRDj",
    slug: "revel-in-runeblood-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Revel in Runeblood"],
      activeFaceIds: ["z9Jm6MkWcjqRHwQWkgRDj:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Runeblade"],
          types: ["Action"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Runeblade"],
        types: ["Action"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["z9Jm6MkWcjqRHwQWkgRDj"],
      numeric: {
        pitch: 1,
        cost: 0,
        defense: 2,
      },
      keywords: [
        {
          name: "go-again",
        },
      ],
      abilities: [
        {
          kind: "resolution",
          condition: {
            type: "and",
            conditions: [
              {
                type: "played-this",
                per: "turn",
                filter: {
                  typeBox: {
                    types: ["Action"],
                    subtypes: ["Attack"],
                  },
                },
                comparison: {
                  op: "gte",
                  value: 1,
                },
              },
              {
                type: "played-this",
                per: "turn",
                filter: {
                  typeBox: {
                    types: ["Action"],
                    excludeSubtypes: ["Attack"],
                  },
                },
                comparison: {
                  op: "gte",
                  value: 1,
                },
              },
            ],
          },
          effect: {
            type: "create-token",
            token: "runechant",
            controller: "controller",
            count: 4,
          },
          id: "z9Jm6MkWcjqRHwQWkgRDj:playedAttackActionAnotherNonAttackActionTurnCreate4RunechantTokens",
          text: "If you've played an attack action card and another non-attack action card this turn, create 4 Runechant tokens.\nAt the beginning of your end phase, destroy all Runechants you control.\nGo again",
        },
        {
          kind: "resolution",
          effect: {
            type: "delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "end-phase",
                actor: {
                  kind: "player",
                  player: "ability-controller",
                },
                observes: {
                  kind: "none",
                },
              },
            },
            policy: {
              kind: "windowed",
              duration: "this-turn",
              matching: "first",
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "destroy",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["permanent"],
                  filter: {
                    name: "Runechant",
                  },
                  count: {
                    type: "all",
                  },
                },
              },
            },
          },
          id: "z9Jm6MkWcjqRHwQWkgRDj:beginningEndPhaseDestroyAllRunechants",
          text: "If you've played an attack action card and another non-attack action card this turn, create 4 Runechant tokens.\nAt the beginning of your end phase, destroy all Runechants you control.\nGo again",
        },
      ],
    },
  },
  deadwoodDirge: {
    canonicalId: "r7fBPzjnf99MPwFc6F8b6",
    slug: "deadwood-dirge-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Deadwood Dirge"],
      activeFaceIds: ["r7fBPzjnf99MPwFc6F8b6:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Runeblade"],
          types: ["Action"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Runeblade"],
        types: ["Action"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["r7fBPzjnf99MPwFc6F8b6"],
      numeric: {
        pitch: 1,
        cost: 0,
        defense: 2,
      },
      keywords: [
        {
          name: "go-again",
        },
      ],
      abilities: [
        {
          kind: "resolution",
          effect: {
            type: "if-you-do",
            effect: {
              type: "destroy",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["permanent"],
                filter: {
                  typeBox: {
                    subtypes: ["Aura"],
                  },
                },
                count: 1,
              },
            },
            then: {
              type: "create-token",
              token: "runechant",
              controller: "controller",
              count: 3,
            },
          },
          id: "r7fBPzjnf99MPwFc6F8b6:resolutionIfDoDestroyCreateTokenRunechant",
          text: "Destroy an aura you control. If you do, create 3 Runechant tokens.\nGo again",
        },
      ],
    },
  },
  shadowPuppetry: {
    canonicalId: "97JfCpcf7hpfrDdQw8Btz",
    slug: "shadow-puppetry-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Shadow Puppetry"],
      activeFaceIds: ["97JfCpcf7hpfrDdQw8Btz:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Shadow"],
          types: ["Action"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Shadow"],
        types: ["Action"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["97JfCpcf7hpfrDdQw8Btz"],
      numeric: {
        pitch: 1,
        cost: 0,
        defense: 2,
      },
      keywords: [
        {
          name: "go-again",
        },
      ],
      abilities: [
        {
          kind: "resolution",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 1,
                duration: "this-turn",
                appliesTo: {
                  next: {
                    typeBox: {
                      types: ["Action"],
                      subtypes: ["Attack"],
                    },
                  },
                  events: ["play", "attack"],
                },
              },
              {
                type: "grant-property",
                property: {
                  kind: "keyword",
                  keyword: {
                    name: "go-again",
                  },
                },
                duration: "this-turn",
                appliesTo: {
                  next: {
                    typeBox: {
                      types: ["Action"],
                      subtypes: ["Attack"],
                    },
                  },
                  events: ["play", "attack"],
                },
              },
              {
                type: "grant-property",
                property: {
                  kind: "ability",
                  ability: {
                    kind: "static",
                    staticKind: "triggered",
                    id: "97JfCpcf7hpfrDdQw8Btz:nextAttackActionPlayTurnGainsNumber1PowerGoAgainHitsLook:whenHitsLookAtTopDeckBanish",
                    text: 'The next attack action card you play this turn gains +1 {p}, go again and "If this attack hits, look at the top card of your deck. You may banish it."\nGo again',
                    trigger: {
                      kind: "event",
                      event: {
                        name: "hit",
                        actor: {
                          kind: "player",
                          player: "ability-controller",
                        },
                        observes: {
                          kind: "source",
                          selector: "attack",
                        },
                      },
                    },
                    resolution: {
                      kind: "effect",
                      effect: {
                        type: "sequence",
                        steps: [
                          {
                            type: "look",
                            target: {
                              selector: "object",
                              declared: "at-resolution",
                              player: "controller",
                              zones: ["deck"],
                              position: "top",
                              count: 1,
                            },
                            outputBinding: "it",
                          },
                          {
                            type: "optional",
                            effect: {
                              type: "banish",
                              target: {
                                selector: "binding",
                                binding: "it",
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
                duration: "this-turn",
                appliesTo: {
                  next: {
                    typeBox: {
                      types: ["Action"],
                      subtypes: ["Attack"],
                    },
                  },
                  events: ["play", "attack"],
                },
              },
            ],
          },
          id: "97JfCpcf7hpfrDdQw8Btz:nextAttackActionPlayTurnGainsNumber1PowerGoAgainHitsLook",
          text: 'The next attack action card you play this turn gains +1 {p}, go again and "If this attack hits, look at the top card of your deck. You may banish it."\nGo again',
        },
      ],
    },
  },
  painfulPassage: {
    canonicalId: "hNMR9pM9djfm8m9FHdmRb",
    slug: "painful-passage-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Painful Passage"],
      activeFaceIds: ["hNMR9pM9djfm8m9FHdmRb:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Runeblade", "Shadow"],
          types: ["Action"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Runeblade", "Shadow"],
        types: ["Action"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["hNMR9pM9djfm8m9FHdmRb"],
      numeric: {
        pitch: 1,
        cost: 0,
        defense: 3,
      },
      keywords: [
        {
          name: "go-again",
        },
      ],
      abilities: [
        {
          kind: "resolution",
          effect: {
            type: "optional",
            effect: {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand"],
                filter: {
                  typeBox: {
                    types: ["Action"],
                    subtypes: ["Attack"],
                  },
                },
                count: 1,
              },
              outputBinding: "it",
            },
            then: {
              type: "choice",
              options: [
                {
                  type: "modify-numeric",
                  property: "power",
                  op: "add",
                  amount: 3,
                  target: {
                    selector: "binding",
                    binding: "it",
                  },
                  duration: "this-turn",
                },
                {
                  type: "grant-property",
                  property: {
                    kind: "keyword",
                    keyword: {
                      name: "go-again",
                    },
                  },
                  target: {
                    selector: "binding",
                    binding: "it",
                  },
                  duration: "this-turn",
                },
              ],
            },
          },
          id: "hNMR9pM9djfm8m9FHdmRb:banishAttackActionHandGets3PowerGoAgainEndTurn",
          text: "You may banish an attack action card from your hand. If you do, it gets +3{p} or go again until end of turn.\nGo again",
        },
      ],
    },
  },
  cullRed: {
    canonicalId: "7RhQ7rthWCfHkgfdHFFJm",
    slug: "cull-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Cull"],
      activeFaceIds: ["7RhQ7rthWCfHkgfdHFFJm:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Runeblade", "Shadow"],
          types: ["Action"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Runeblade", "Shadow"],
        types: ["Action"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["7RhQ7rthWCfHkgfdHFFJm"],
      numeric: {
        pitch: 1,
        cost: 0,
        defense: 3,
      },
      keywords: [
        {
          name: "blood-debt",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "play",
          playEffect: {
            role: "permission",
            fromZones: ["banished"],
          },
          id: "7RhQ7rthWCfHkgfdHFFJm:mayPlayFromBanishedZone",
          text: "You may play this from your banished zone.\nIf a hero has lost {h} this turn, you may play this as thought it were an instant.\nEach hero banishes a card from their hand.\nBlood Debt",
        },
        {
          kind: "static",
          staticKind: "play",
          condition: {
            type: "compare-amount",
            amount: {
              type: "count",
              what: "heroes-lost-life-this-turn",
            },
            comparison: {
              op: "gte",
              value: 1,
            },
          },
          playEffect: {
            role: "permission",
            fromZones: ["hand", "arsenal"],
            asType: "instant",
            optional: true,
          },
          id: "7RhQ7rthWCfHkgfdHFFJm:ifHeroHasLostTurnMayPlayAsThought",
          text: "You may play this from your banished zone.\nIf a hero has lost {h} this turn, you may play this as thought it were an instant.\nEach hero banishes a card from their hand.\nBlood Debt",
        },
        {
          kind: "resolution",
          effect: {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "each",
              zones: ["hand"],
              count: 1,
            },
          },
          id: "7RhQ7rthWCfHkgfdHFFJm:eachHeroBanishesFromTheirHand",
          text: "You may play this from your banished zone.\nIf a hero has lost {h} this turn, you may play this as thought it were an instant.\nEach hero banishes a card from their hand.\nBlood Debt",
        },
      ],
    },
  },
  hauntyRendition: {
    canonicalId: "qp7f9b6WNBmRWJfPbKtDm",
    slug: "haunting-rendition-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Haunting Rendition"],
      activeFaceIds: ["qp7f9b6WNBmRWJfPbKtDm:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Runeblade"],
          types: ["Block"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Runeblade"],
        types: ["Block"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["qp7f9b6WNBmRWJfPbKtDm"],
      numeric: {
        pitch: 1,
        defense: 4,
      },
      keywords: [],
      abilities: [
        {
          kind: "activated",
          abilityType: "instant",
          cost: {
            class: "effect",
            type: "discard-self",
          },
          effect: {
            type: "prevention",
            preventionKind: "fixed",
            amount: 2,
            shielded: {
              selector: "controller",
            },
            duration: "this-turn",
            additionalModification: {
              type: "create-token",
              token: "runechant",
              controller: "controller",
            },
          },
          id: "qp7f9b6WNBmRWJfPbKtDm:discardToPreventAndCreateRunechant",
          text: "Instant - Discard this: Prevent the next 2 damage that would be dealt to you this turn. The first time you prevent damage this way, create a Runechant token.",
        },
      ],
    },
  },
  becomeTheShadowLord: {
    canonicalId: "9DgdMqPdzCbJkLcqJKpNT",
    slug: "become-the-shadow-lord-blue",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Become the Shadow Lord"],
      activeFaceIds: ["9DgdMqPdzCbJkLcqJKpNT:face:front"],
      color: "blue",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Runeblade", "Shadow"],
          types: ["Action"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Runeblade", "Shadow"],
        types: ["Action"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["9DgdMqPdzCbJkLcqJKpNT"],
      numeric: {
        pitch: 3,
        cost: 0,
        defense: 3,
      },
      keywords: [
        {
          name: "go-again",
        },
      ],
      abilities: [
        {
          kind: "resolution",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "banish",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hand"],
                  count: 1,
                },
                outputBinding: "it",
              },
              {
                type: "conditional",
                condition: {
                  type: "binding-matches",
                  binding: "it",
                  filter: {
                    typeBox: {
                      supertypes: ["Runeblade"],
                    },
                  },
                },
                then: {
                  type: "create-token",
                  token: "runechant",
                  controller: "controller",
                },
              },
              {
                type: "conditional",
                condition: {
                  type: "binding-matches",
                  binding: "it",
                  filter: {
                    typeBox: {
                      supertypes: ["Shadow"],
                    },
                  },
                },
                then: {
                  type: "create-token",
                  token: "gate-to-i-arathael",
                  controller: "controller",
                },
              },
            ],
          },
          id: "9DgdMqPdzCbJkLcqJKpNT:banishFromHandIfSRunebladeCreateRunechantToken",
          text: "Banish a card from your hand. If it's Runeblade, create a Runechant token. If it's Shadow, create a Gate to i'Arathael token.\nGo again",
        },
      ],
    },
  },
  sevenSinNebula: {
    canonicalId: "6NCKgNWRrD7cqzzhw6Qtz",
    slug: "seven-sin-nebula",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Seven Sin Nebula"],
      activeFaceIds: ["6NCKgNWRrD7cqzzhw6Qtz:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Runeblade", "Shadow"],
          types: ["Weapon"],
          subtypes: ["2H", "Sword"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Runeblade", "Shadow"],
        types: ["Weapon"],
        subtypes: ["2H", "Sword"],
      },
      traits: [],
      textBoxIds: ["6NCKgNWRrD7cqzzhw6Qtz"],
      numeric: {
        power: 3,
      },
      keywords: [],
      abilities: [
        {
          kind: "activated",
          abilityType: "attack",
          cost: {
            class: "mixed",
            type: "all",
            costs: [
              {
                class: "asset",
                type: "resources",
                amount: 1,
              },
              {
                class: "effect",
                type: "tap-self",
              },
            ],
          },
          condition: {
            type: "played-this",
            per: "turn",
            filter: {
              playedFromZones: ["banished"],
            },
          },
          effect: {
            type: "attack-with",
            target: {
              selector: "self",
            },
          },
          id: "6NCKgNWRrD7cqzzhw6Qtz:actionResourceTapAttackActivateOnlyPlayedBanishedZoneTurn",
          text: "Action - {r}, {t}: Attack. Activate this only if you've played a card from a banished zone this turn.\nWhen this hits a hero, create a Runechant token.",
        },
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "hit",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "attack",
              },
              target: {
                kind: "hero",
              },
            },
          },
          id: "6NCKgNWRrD7cqzzhw6Qtz:hitsCreateRunechantToken",
          text: "Action - {r}, {t}: Attack. Activate this only if you've played a card from a banished zone this turn.\nWhen this hits a hero, create a Runechant token.",
          resolution: {
            kind: "effect",
            effect: {
              type: "create-token",
              token: "runechant",
              controller: "controller",
            },
          },
        },
      ],
    },
  },
  malice: {
    canonicalId: "cz8FPm7Rjjndfgb8jQBcT",
    slug: "malice-domina-of-the-dead",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Malice, Domina of the Dead"],
      activeFaceIds: ["cz8FPm7Rjjndfgb8jQBcT:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Necromancer", "Shadow"],
          types: ["Hero"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Necromancer", "Shadow"],
        types: ["Hero"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["cz8FPm7Rjjndfgb8jQBcT"],
      numeric: {
        life: 40,
        intellect: 4,
      },
      keywords: [],
      abilities: [
        {
          kind: "activated",
          abilityType: "action",
          cost: {
            class: "mixed",
            type: "all",
            costs: [
              {
                class: "asset",
                type: "resources",
                amount: 1,
              },
              {
                class: "effect",
                type: "tap-self",
              },
            ],
          },
          layerKeywords: [
            {
              name: "go-again",
            },
          ],
          effect: {
            type: "play-card",
            fromZones: ["graveyard"],
            source: {
              selector: "object",
              declared: "on-stack",
              player: "controller",
              zones: ["graveyard"],
              filter: {
                typeBox: {
                  subtypes: ["Zombie"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
          },
          id: "cz8FPm7Rjjndfgb8jQBcT:actionResourceTapEndTurnPlayTargetZombieGraveyardGoAgain",
          text: "Action - {r}, {t}: Until end of turn, you may play target zombie from your graveyard. Go again\nWhenever a zombie you control dies, banish it face-down and create a Corrupted Corpse in your banished Zone.",
        },
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "dies",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "event-object",
                selector: "moved-object",
                relationship: {
                  kind: "controller",
                  player: "ability-controller",
                },
                filter: {
                  typeBox: {
                    subtypes: ["Zombie"],
                  },
                },
                bindAs: "it",
              },
            },
          },
          id: "cz8FPm7Rjjndfgb8jQBcT:wheneverZombieDiesBanishFaceDownCreateCorruptedCorpseBanishedZone",
          text: "Action - {r}, {t}: Until end of turn, you may play target zombie from your graveyard. Go again\nWhenever a zombie you control dies, banish it face-down and create a Corrupted Corpse in your banished Zone.",
          resolution: {
            kind: "effect",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "banish",
                  target: {
                    selector: "binding",
                    binding: "it",
                  },
                  faceDown: true,
                },
                {
                  type: "create-card",
                  name: "Corrupted Corpse",
                  to: {
                    zone: "banished",
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
  restlessMagister: {
    canonicalId: "PRfhDbJzRtJD66DTGcccM",
    slug: "restless-magister-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Restless Magister"],
      activeFaceIds: ["PRfhDbJzRtJD66DTGcccM:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Necromancer", "Shadow"],
          types: ["Action"],
          subtypes: ["Ally", "Zombie"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Necromancer", "Shadow"],
        types: ["Action"],
        subtypes: ["Ally", "Zombie"],
      },
      traits: [],
      textBoxIds: ["PRfhDbJzRtJD66DTGcccM"],
      numeric: {
        pitch: 1,
        cost: 0,
        power: 3,
        life: 3,
      },
      keywords: [
        {
          name: "decay",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "hit",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "attack",
              },
              target: {
                kind: "hero",
              },
            },
          },
          id: "PRfhDbJzRtJD66DTGcccM:hitsBanishHand",
          text: "When this hits a hero, they banish a card from their hand.\nDecay",
          resolution: {
            kind: "effect",
            effect: {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["hand"],
                count: 1,
              },
            },
          },
        },
      ],
    },
  },
  restlessCommander: {
    canonicalId: "dRdWkMqh86cKpH7mpFnpC",
    slug: "restless-commander-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Restless Commander"],
      activeFaceIds: ["dRdWkMqh86cKpH7mpFnpC:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Necromancer", "Shadow"],
          types: ["Action"],
          subtypes: ["Ally", "Zombie"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Necromancer", "Shadow"],
        types: ["Action"],
        subtypes: ["Ally", "Zombie"],
      },
      traits: [],
      textBoxIds: ["dRdWkMqh86cKpH7mpFnpC"],
      numeric: {
        pitch: 1,
        cost: 0,
        power: 3,
        life: 3,
      },
      keywords: [
        {
          name: "decay",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "continuous",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Zombie"],
                },
              },
              count: {
                type: "all",
              },
            },
            duration: "while-in-arena",
          },
          id: "dRdWkMqh86cKpH7mpFnpC:zombies",
          text: "Zombies you control get +1{p}.\nDecay",
        },
      ],
    },
  },
  corruptedCorpse: {
    canonicalId: "qmC78MP6bjTHcDChc6RMJ",
    slug: "corrupted-corpse",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Corrupted Corpse"],
      activeFaceIds: ["qmC78MP6bjTHcDChc6RMJ:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Necromancer", "Shadow"],
          types: ["Action"],
          subtypes: ["Ally", "Zombie"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Necromancer", "Shadow"],
        types: ["Action"],
        subtypes: ["Ally", "Zombie"],
      },
      traits: [],
      textBoxIds: ["qmC78MP6bjTHcDChc6RMJ"],
      numeric: {
        cost: 2,
        power: 3,
        life: 3,
      },
      keywords: [
        {
          name: "incarnate",
        },
        {
          name: "go-again",
        },
        {
          name: "blood-debt",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "continuous",
          effect: {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: {
                name: "go-again",
              },
            },
            target: {
              selector: "this-attack",
            },
            duration: "while-in-arena",
          },
          id: "qmC78MP6bjTHcDChc6RMJ:sAttacksGetGoAgain",
          text: "Incarnate\nThis card's attacks get go again.\nBlood Debt",
        },
      ],
    },
  },
  voxNecropolis: {
    canonicalId: "PjHzdFtkjKpqTrDkwkJGK",
    slug: "vox-necropolis",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Vox Necropolis"],
      activeFaceIds: ["PjHzdFtkjKpqTrDkwkJGK:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Necromancer", "Shadow"],
          types: ["Weapon"],
          subtypes: ["2H", "Staff"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Necromancer", "Shadow"],
        types: ["Weapon"],
        subtypes: ["2H", "Staff"],
      },
      traits: [],
      textBoxIds: ["PjHzdFtkjKpqTrDkwkJGK"],
      numeric: {},
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "continuous",
          effect: {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                id: "PjHzdFtkjKpqTrDkwkJGK:zombiesGetActionResourceTapAttack:attack",
                kind: "activated",
                text: 'During your action phase, zombies you\'ve played from a graveyard or banished zone enter the arena tapped and get "When this enteres the arena, attack with it."\nZombies you control get "Action - {r}, {t}: Attack"',
                abilityType: "attack",
                cost: {
                  class: "mixed",
                  type: "all",
                  costs: [
                    {
                      class: "asset",
                      type: "resources",
                      amount: 1,
                    },
                    {
                      class: "effect",
                      type: "tap-self",
                    },
                  ],
                },
                effect: {
                  type: "attack-with",
                  target: {
                    selector: "self",
                  },
                },
              },
            },
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Zombie"],
                },
              },
              count: {
                type: "all",
              },
            },
            duration: "while-in-arena",
          },
          id: "PjHzdFtkjKpqTrDkwkJGK:zombiesGetActionResourceTapAttack",
          text: 'During your action phase, zombies you\'ve played from a graveyard or banished zone enter the arena tapped and get "When this enteres the arena, attack with it."\nZombies you control get "Action - {r}, {t}: Attack"',
        },
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event-and-state",
            event: {
              name: "enter-arena",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "event-object",
                selector: "moved-object",
                relationship: {
                  kind: "controller",
                  player: "ability-controller",
                },
                filter: {
                  typeBox: {
                    subtypes: ["Zombie"],
                  },
                  playedFromZones: ["graveyard", "banished"],
                },
                bindAs: "it",
              },
            },
            state: {
              type: "turn-player",
              who: "self",
            },
          },
          id: "PjHzdFtkjKpqTrDkwkJGK:duringActionPhaseZombiePlayedGraveyardBanishedZoneEntersArenaTapAttack",
          text: 'During your action phase, zombies you\'ve played from a graveyard or banished zone enter the arena tapped and get "When this enteres the arena, attack with it."\nZombies you control get "Action - {r}, {t}: Attack"',
          resolution: {
            kind: "effect",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "tap",
                  target: {
                    selector: "binding",
                    binding: "it",
                  },
                },
                {
                  type: "attack-with",
                  target: {
                    selector: "binding",
                    binding: "it",
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
  ominousToll: {
    canonicalId: "kqgmK6HhhfFrFq9zjgtQn",
    slug: "ominous-toll-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Ominous Toll"],
      activeFaceIds: ["kqgmK6HhhfFrFq9zjgtQn:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Necromancer", "Shadow"],
          types: ["Action"],
          subtypes: ["Attack"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Necromancer", "Shadow"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
      traits: [],
      textBoxIds: ["kqgmK6HhhfFrFq9zjgtQn"],
      numeric: {
        pitch: 1,
        cost: 0,
        power: 3,
        defense: 2,
      },
      keywords: [
        {
          name: "go-again",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "attack",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "attack",
              },
            },
          },
          id: "kqgmK6HhhfFrFq9zjgtQn:discard",
          text: "When this attacks, you may discard a zombie. If you do, create a Gate to i'Arathael token.\nGo again",
          resolution: {
            kind: "effect",
            effect: {
              type: "optional",
              effect: {
                type: "discard",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hand"],
                  filter: {
                    typeBox: {
                      subtypes: ["Zombie"],
                    },
                  },
                  count: 1,
                },
              },
              then: {
                type: "create-token",
                token: "gate-to-i-arathael",
                controller: "controller",
              },
            },
          },
        },
      ],
    },
  },
  tomeOfNecrosis: {
    canonicalId: "zQmwGLpLKkjtLTdpNdFK6",
    slug: "tome-of-necrosis-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Tome of Necrosis"],
      activeFaceIds: ["zQmwGLpLKkjtLTdpNdFK6:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Necromancer"],
          types: ["Action"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Necromancer"],
        types: ["Action"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["zQmwGLpLKkjtLTdpNdFK6"],
      numeric: {
        pitch: 1,
        cost: 0,
        defense: 3,
      },
      keywords: [
        {
          name: "go-again",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "play",
          playEffect: {
            role: "additional-cost",
            cost: {
              class: "mixed",
              type: "alternative",
              costs: [
                {
                  class: "effect",
                  type: "destroy",
                  filter: {
                    typeBox: {
                      subtypes: ["Ally"],
                    },
                  },
                  count: 1,
                },
                {
                  class: "effect",
                  type: "discard",
                  filter: {
                    typeBox: {
                      subtypes: ["Ally"],
                    },
                  },
                  count: 1,
                },
              ],
            },
          },
          id: "zQmwGLpLKkjtLTdpNdFK6:additionalCostDestroyAllyOrDiscardAlly",
          text: "As an additional cost to play this, destroy an ally you control or discard an ally.\nDraw a card and untap your hero.\nGo again",
        },
        {
          kind: "resolution",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "draw",
                count: 1,
                player: "controller",
              },
              {
                type: "untap",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hero"],
                  count: 1,
                },
              },
            ],
          },
          id: "zQmwGLpLKkjtLTdpNdFK6:drawAndUntapHero",
          text: "As an additional cost to play this, destroy an ally you control or discard an ally.\nDraw a card and untap your hero.\nGo again",
        },
      ],
    },
  },
  callToTheGrave: {
    canonicalId: "gDhFGHDrPKRwCP6qRF6zd",
    slug: "call-to-the-grave-blue",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Call to the Grave"],
      activeFaceIds: ["gDhFGHDrPKRwCP6qRF6zd:face:front"],
      color: "blue",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: [],
          types: ["Action"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: [],
        types: ["Action"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["gDhFGHDrPKRwCP6qRF6zd"],
      numeric: {
        pitch: 3,
        cost: 0,
        defense: 2,
      },
      keywords: [
        {
          name: "go-again",
        },
      ],
      abilities: [
        {
          kind: "resolution",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "search",
                zones: ["deck"],
                filter: {},
                mayFail: true,
                to: {
                  zone: "graveyard",
                },
              },
              {
                type: "shuffle",
                zone: "deck",
              },
            ],
          },
          id: "gDhFGHDrPKRwCP6qRF6zd:searchDeckPutIntoGraveyardThenShuffle",
          text: "Search your deck for a card, put it into your graveyard, then shuffle.\nGo again",
        },
      ],
    },
  },
  digForSouls: {
    canonicalId: "fgpQGzdLPhq6J6JJtczPm",
    slug: "dig-for-souls-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Dig for Souls"],
      activeFaceIds: ["fgpQGzdLPhq6J6JJtczPm:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Necromancer", "Shadow"],
          types: ["Action"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Necromancer", "Shadow"],
        types: ["Action"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["fgpQGzdLPhq6J6JJtczPm"],
      numeric: {
        pitch: 1,
        defense: 3,
      },
      keywords: [
        {
          name: "go-again",
        },
      ],
      abilities: [
        {
          kind: "resolution",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "look",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["deck"],
                  position: "top",
                  count: {
                    type: "x",
                  },
                },
                outputBinding: "looked",
              },
              {
                type: "search",
                zones: [],
                fromBinding: "looked",
                filter: {
                  typeBox: {
                    subtypes: ["Zombie"],
                  },
                },
                count: {
                  type: "up-to",
                  amount: 1,
                },
                mayFail: true,
                to: {
                  zone: "graveyard",
                },
                outputBinding: "zombie",
              },
              {
                type: "reorder-deck",
                target: {
                  selector: "binding",
                  binding: "looked",
                  exclude: "zombie",
                },
                position: "bottom",
              },
              {
                type: "grant-property",
                property: {
                  kind: "ability",
                  ability: {
                    kind: "static",
                    staticKind: "triggered",
                    id: "fgpQGzdLPhq6J6JJtczPm:sequence:staticTriggeredHitDestroy",
                    text: 'Look at the top X cards of your deck. You may put a zombie from among them into your graveyard, then put the rest on the bottom of your deck in any order.\nYour next zombie attack this turn gets +4{p} and "When this hits, destroy this zombie."\nGo again',
                    trigger: {
                      kind: "event",
                      event: {
                        name: "hit",
                        actor: {
                          kind: "player",
                          player: "ability-controller",
                        },
                        observes: {
                          kind: "source",
                          selector: "attack",
                        },
                      },
                    },
                    resolution: {
                      kind: "effect",
                      effect: {
                        type: "destroy",
                        target: {
                          selector: "self",
                        },
                      },
                    },
                  },
                },
                duration: "this-turn",
                appliesTo: {
                  next: {
                    typeBox: {
                      subtypes: ["Zombie"],
                    },
                  },
                  events: ["attack"],
                },
              },
              {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 4,
                duration: "this-turn",
                appliesTo: {
                  next: {
                    typeBox: {
                      subtypes: ["Zombie"],
                    },
                  },
                  events: ["attack"],
                },
              },
            ],
          },
          id: "fgpQGzdLPhq6J6JJtczPm:sequence",
          text: 'Look at the top X cards of your deck. You may put a zombie from among them into your graveyard, then put the rest on the bottom of your deck in any order.\nYour next zombie attack this turn gets +4{p} and "When this hits, destroy this zombie."\nGo again',
        },
      ],
    },
  },
  skeletalPuppetry: {
    canonicalId: "KPRGBpDBpzj8zNn9r7qMh",
    slug: "skeletal-puppetry-blue",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Skeletal Puppetry"],
      activeFaceIds: ["KPRGBpDBpzj8zNn9r7qMh:face:front"],
      color: "blue",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Necromancer"],
          types: ["Action"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Necromancer"],
        types: ["Action"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["KPRGBpDBpzj8zNn9r7qMh"],
      numeric: {
        pitch: 3,
        cost: 2,
        defense: 2,
      },
      keywords: [
        {
          name: "go-again",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "play",
          playEffect: {
            role: "alternative-cost",
            cost: {
              class: "effect",
              type: "discard",
              count: 1,
              filter: {
                typeBox: {
                  subtypes: ["Ally"],
                },
              },
            },
            optional: true,
          },
          id: "KPRGBpDBpzj8zNn9r7qMh:discardAllyRatherThanPay",
          text: "You may discard an ally rather than pay this card's {r} cost.\nYour next ally attack this turn gets +3{p} and go again.\nGo again",
        },
        {
          kind: "resolution",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 1,
                duration: "this-turn",
                appliesTo: {
                  next: {
                    typeBox: {
                      subtypes: ["Ally"],
                    },
                  },
                  events: ["play", "attack"],
                },
              },
              {
                type: "grant-property",
                property: {
                  kind: "keyword",
                  keyword: {
                    name: "go-again",
                  },
                },
                duration: "this-turn",
                appliesTo: {
                  next: {
                    typeBox: {
                      subtypes: ["Ally"],
                    },
                  },
                  events: ["play", "attack"],
                },
              },
            ],
          },
          id: "KPRGBpDBpzj8zNn9r7qMh:nextAllyAttackGetsPlusPowerAndGoAgain",
          text: "You may discard an ally rather than pay this card's {r} cost.\nYour next ally attack this turn gets +3{p} and go again.\nGo again",
        },
      ],
    },
  },
  boneBarrier: {
    canonicalId: "TKjfwJ6tqMrfNr6qWdMwR",
    slug: "bone-barrier-blue",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Bone Barrier"],
      activeFaceIds: ["TKjfwJ6tqMrfNr6qWdMwR:face:front"],
      color: "blue",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Necromancer"],
          types: ["Defense Reaction"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Necromancer"],
        types: ["Defense Reaction"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["TKjfwJ6tqMrfNr6qWdMwR"],
      numeric: {
        pitch: 3,
        cost: 0,
        defense: 2,
      },
      keywords: [],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "defend",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "defender",
              },
            },
          },
          id: "TKjfwJ6tqMrfNr6qWdMwR:defend",
          text: "When this defends, you may destroy an ally you control or discard an ally. If you do, this gets +2{d}.",
          resolution: {
            kind: "effect",
            effect: {
              type: "optional",
              effect: {
                type: "choice",
                options: [
                  {
                    type: "destroy",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "controller",
                      zones: ["permanent"],
                      filter: {
                        typeBox: {
                          subtypes: ["Ally"],
                        },
                      },
                      count: 1,
                    },
                  },
                  {
                    type: "discard",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "controller",
                      zones: ["hand"],
                      filter: {
                        typeBox: {
                          subtypes: ["Ally"],
                        },
                      },
                      count: 1,
                    },
                  },
                ],
              },
              then: {
                type: "modify-numeric",
                property: "defense",
                op: "add",
                amount: 2,
                target: {
                  selector: "self",
                },
                duration: "this-chain-link",
              },
            },
          },
        },
      ],
    },
  },
  corpseCover: {
    canonicalId: "TrNnBmGkm8qh7wwnBthWC",
    slug: "corpse-cover-blue",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Corpse Cover"],
      activeFaceIds: ["TrNnBmGkm8qh7wwnBthWC:face:front"],
      color: "blue",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Necromancer"],
          types: ["Block"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Necromancer"],
        types: ["Block"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["TrNnBmGkm8qh7wwnBthWC"],
      numeric: {
        pitch: 3,
        defense: 1,
      },
      keywords: [],
      abilities: [
        {
          kind: "activated",
          limit: {
            count: 1,
            per: "turn",
          },
          abilityType: "instant",
          functionalZones: ["combat-chain"],
          condition: {
            type: "has-status",
            status: "defending",
          },
          cost: {
            class: "mixed",
            type: "alternative",
            costs: [
              {
                class: "effect",
                type: "destroy",
                filter: {
                  typeBox: {
                    subtypes: ["Ally"],
                  },
                },
                count: 1,
              },
              {
                class: "effect",
                type: "discard",
                filter: {
                  typeBox: {
                    subtypes: ["Ally"],
                  },
                },
                count: 1,
              },
            ],
          },
          effect: {
            type: "prevention",
            preventionKind: "shielding",
            amount: 2,
            shielded: {
              selector: "controller",
            },
            duration: "this-turn",
          },
          id: "TrNnBmGkm8qh7wwnBthWC:oncePerTurnInstantDestroyOrDiscardAllyPreventNextTwoWhileDefending",
          text: "Once per Turn Instant - Destroy an ally you control or discard an ally: Prevent the next 2 damage that would be dealt to you this turn. Activate this only while this card is defending.",
        },
      ],
    },
  },
  arcanePolarity: {
    canonicalId: "p9rcH7g9C8Gt8WbPHbPWg",
    slug: "arcane-polarity-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Arcane Polarity"],
      activeFaceIds: ["p9rcH7g9C8Gt8WbPHbPWg:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: [],
          types: ["Instant"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: [],
        types: ["Instant"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["p9rcH7g9C8Gt8WbPHbPWg"],
      numeric: {
        pitch: 1,
        cost: 0,
      },
      keywords: [],
      abilities: [
        {
          kind: "resolution",
          effect: {
            type: "conditional",
            condition: {
              type: "damage-taken",
              damageType: "arcane",
              player: "controller",
              per: "turn",
              comparison: {
                op: "gte",
                value: 1,
              },
            },
            then: {
              type: "gain-life",
              amount: 4,
              target: {
                selector: "controller",
              },
            },
            else: {
              type: "gain-life",
              amount: 1,
              target: {
                selector: "controller",
              },
            },
          },
          id: "p9rcH7g9C8Gt8WbPHbPWg:gainLife",
          text: "Gain 1{h}\nIf you've been dealt arcane damage this turn, instead gain 4{h}.",
        },
      ],
    },
  },
  shadowrealmStrength: {
    canonicalId: "GTJwfppCK8hPcRGkKGPKC",
    slug: "shadowrealm-strength-red",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Shadowrealm Strength"],
      activeFaceIds: ["GTJwfppCK8hPcRGkKGPKC:face:front"],
      color: "red",
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Necromancer", "Shadow"],
          types: ["Action"],
          subtypes: [],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Necromancer", "Shadow"],
        types: ["Action"],
        subtypes: [],
      },
      traits: [],
      textBoxIds: ["GTJwfppCK8hPcRGkKGPKC"],
      numeric: {
        pitch: 1,
        cost: 0,
        defense: 3,
      },
      keywords: [
        {
          name: "go-again",
        },
      ],
      abilities: [
        {
          kind: "resolution",
          effect: {
            type: "optional",
            effect: {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["banished"],
                count: 1,
              },
              to: {
                zone: "graveyard",
              },
              outputBinding: "it",
            },
            then: {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  typeBox: {
                    subtypes: ["Zombie"],
                  },
                },
              },
              then: {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 3,
                duration: "this-turn",
                appliesTo: {
                  next: {
                    typeBox: {
                      subtypes: ["Attack"],
                    },
                  },
                  events: ["play", "attack"],
                },
              },
            },
          },
          id: "GTJwfppCK8hPcRGkKGPKC:move",
          text: "You may put a card from your banished zone into your graveyard. If it's a zombie, your next attack this turn gets +3{p}.\nGo again",
        },
      ],
    },
  },
  gateToIArathael: {
    canonicalId: "JtkWt6Kzpgz9qpPLPp8Ff",
    slug: "gate-to-i-arathael",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Gate to i'Arathael"],
      activeFaceIds: ["JtkWt6Kzpgz9qpPLPp8Ff:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: ["Token"],
          supertypes: ["Shadow"],
          types: ["Token"],
          subtypes: ["Aura"],
        },
      ],
      typeBox: {
        metatypes: ["Token"],
        supertypes: ["Shadow"],
        types: ["Token"],
        subtypes: ["Aura"],
      },
      traits: [],
      textBoxIds: ["JtkWt6Kzpgz9qpPLPp8Ff"],
      numeric: {},
      keywords: [],
      abilities: [
        {
          kind: "activated",
          abilityType: "instant",
          cost: {
            class: "mixed",
            type: "all",
            costs: [
              {
                class: "asset",
                type: "resources",
                amount: 1,
              },
              {
                class: "effect",
                type: "destroy-self",
              },
            ],
          },
          effect: {
            type: "play-card",
            fromZones: ["banished"],
            source: {
              selector: "object",
              declared: "on-stack",
              player: "controller",
              zones: ["banished"],
              filter: {
                typeBox: {
                  types: ["Action"],
                },
                hasKeyword: "blood-debt",
              },
              count: {
                type: "up-to",
                amount: 1,
              },
            },
            duration: "this-turn",
          },
          id: "JtkWt6Kzpgz9qpPLPp8Ff:playBloodDebtActionFromBanish",
          text: "Instant - {r}, destroy this: You may play target action card with blood debt from your banished zone this turn.",
        },
      ],
    },
  },
  undeadGrasp: {
    canonicalId: "mpJLbHkrWkkqqpGCRg8qF",
    slug: "undead-grasp",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Undead Grasp"],
      activeFaceIds: ["mpJLbHkrWkkqqpGCRg8qF:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Necromancer", "Shadow"],
          types: ["Equipment"],
          subtypes: ["Arms"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Necromancer", "Shadow"],
        types: ["Equipment"],
        subtypes: ["Arms"],
      },
      traits: [],
      textBoxIds: ["mpJLbHkrWkkqqpGCRg8qF"],
      numeric: {
        defense: 1,
      },
      keywords: [
        {
          name: "battleworn",
        },
      ],
      abilities: [
        {
          kind: "activated",
          abilityType: "action",
          cost: {
            class: "mixed",
            type: "all",
            costs: [
              {
                class: "asset",
                type: "resources",
                amount: 1,
              },
              {
                class: "effect",
                type: "discard",
                count: 1,
                filter: {
                  typeBox: {
                    subtypes: ["Zombie"],
                  },
                },
              },
              {
                class: "effect",
                type: "destroy-self",
              },
            ],
          },
          layerKeywords: [
            {
              name: "go-again",
            },
          ],
          effect: {
            type: "sequence",
            steps: [
              {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 3,
                duration: "this-turn",
                appliesTo: {
                  next: {
                    typeBox: {
                      subtypes: ["Zombie"],
                    },
                  },
                  events: ["attack", "activate"],
                },
              },
              {
                type: "grant-property",
                property: {
                  kind: "ability",
                  ability: {
                    kind: "static",
                    staticKind: "triggered",
                    id: "mpJLbHkrWkkqqpGCRg8qF:actionDiscardZombieDestroyNextZombieAttackTurnGets:onHit",
                    text: 'Action - {r}, discard a zombie, destroy this: Your next zombie attack this turn gets +3{p} and "When this hits, destroy this zombie." Go again\nBattleworn',
                    trigger: {
                      kind: "event",
                      event: {
                        name: "hit",
                        actor: {
                          kind: "player",
                          player: "ability-controller",
                        },
                        observes: {
                          kind: "source",
                          selector: "attack",
                        },
                        target: {
                          kind: "hero",
                        },
                      },
                    },
                    resolution: {
                      kind: "effect",
                      effect: {
                        type: "destroy",
                        target: {
                          selector: "self",
                        },
                      },
                    },
                  },
                },
                duration: "this-turn",
                appliesTo: {
                  next: {
                    typeBox: {
                      subtypes: ["Zombie"],
                    },
                  },
                  events: ["attack", "activate"],
                },
              },
            ],
          },
          id: "mpJLbHkrWkkqqpGCRg8qF:actionDiscardZombieDestroyNextZombieAttackTurnGets",
          text: 'Action - {r}, discard a zombie, destroy this: Your next zombie attack this turn gets +3{p} and "When this hits, destroy this zombie." Go again\nBattleworn',
        },
      ],
    },
  },
  carrionCrown: {
    canonicalId: "pFgDCjG98QkNLjGpgB7PH",
    slug: "carrion-crown",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Carrion Crown"],
      activeFaceIds: ["pFgDCjG98QkNLjGpgB7PH:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Necromancer"],
          types: ["Equipment"],
          subtypes: ["Head"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Necromancer"],
        types: ["Equipment"],
        subtypes: ["Head"],
      },
      traits: [],
      textBoxIds: ["pFgDCjG98QkNLjGpgB7PH"],
      numeric: {
        defense: 2,
      },
      keywords: [
        {
          name: "blade-break",
        },
      ],
      abilities: [
        {
          kind: "activated",
          abilityType: "action",
          cost: {
            class: "mixed",
            type: "all",
            costs: [
              {
                class: "effect",
                type: "discard",
                count: 1,
                filter: {
                  typeBox: {
                    subtypes: ["Ally"],
                  },
                },
              },
              {
                class: "effect",
                type: "destroy-self",
              },
            ],
          },
          layerKeywords: [
            {
              name: "go-again",
            },
          ],
          effect: {
            type: "draw",
            count: 1,
            player: "controller",
          },
          id: "pFgDCjG98QkNLjGpgB7PH:actionDiscardAllyDestroyDrawGoAgain",
          text: "Action - Discard an ally, destroy this: Draw a card. Go again\nBlade Break",
        },
      ],
    },
  },
  scabskin: {
    canonicalId: "nkCCKCB8ftPdMCHHWHWtk",
    slug: "scabskin-leathers",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Scabskin Leathers"],
      activeFaceIds: ["nkCCKCB8ftPdMCHHWHWtk:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Brute"],
          types: ["Equipment"],
          subtypes: ["Legs"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Brute"],
        types: ["Equipment"],
        subtypes: ["Legs"],
      },
      traits: [],
      textBoxIds: ["nkCCKCB8ftPdMCHHWHWtk"],
      numeric: {
        defense: 2,
      },
      keywords: [
        {
          name: "battleworn",
        },
      ],
      abilities: [
        {
          kind: "activated",
          limit: {
            count: 1,
            per: "turn",
          },
          abilityType: "action",
          cost: {
            class: "asset",
            type: "resources",
            amount: 0,
          },
          effect: {
            type: "sequence",
            steps: [
              {
                type: "roll",
                sides: 6,
              },
              {
                type: "gain-action-points",
                amount: {
                  type: "roll-result",
                  divisor: 2,
                  rounding: "down",
                },
              },
            ],
          },
          id: "nkCCKCB8ftPdMCHHWHWtk:oncePerTurnAction0Roll6SidedDie",
          text: "",
        },
      ],
    },
  },
  helmIron: {
    canonicalId: "rjhDRz7JGN7kpDdjHQfrg",
    slug: "helm-of-isen-s-peak",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Helm Of Isen's Peak"],
      activeFaceIds: ["rjhDRz7JGN7kpDdjHQfrg:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Guardian"],
          types: ["Equipment"],
          subtypes: ["Head"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Guardian"],
        types: ["Equipment"],
        subtypes: ["Head"],
      },
      traits: [],
      textBoxIds: ["rjhDRz7JGN7kpDdjHQfrg"],
      numeric: {
        defense: 1,
      },
      keywords: [
        {
          name: "battleworn",
        },
      ],
      abilities: [
        {
          kind: "activated",
          abilityType: "action",
          cost: {
            class: "mixed",
            type: "all",
            costs: [
              {
                class: "asset",
                type: "resources",
                amount: 1,
              },
              {
                class: "effect",
                type: "destroy-self",
              },
            ],
          },
          effect: {
            type: "modify-numeric",
            property: "intellect",
            op: "add",
            amount: 1,
            target: {
              selector: "controller",
            },
            duration: "this-turn",
          },
          id: "rjhDRz7JGN7kpDdjHQfrg:actionDestroyHeroGains1Turn",
          text: "",
        },
      ],
    },
  },
  fyendalTunic: {
    canonicalId: "RP6pJj9WtwbTT79qdHPkz",
    slug: "fyendal-s-spring-tunic",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Fyendal's Spring Tunic"],
      activeFaceIds: ["RP6pJj9WtwbTT79qdHPkz:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: [],
          types: ["Equipment"],
          subtypes: ["Chest"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: [],
        types: ["Equipment"],
        subtypes: ["Chest"],
      },
      traits: [],
      textBoxIds: ["RP6pJj9WtwbTT79qdHPkz"],
      numeric: {
        defense: 1,
      },
      keywords: [
        {
          name: "blade-break",
        },
      ],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event-and-state",
            event: {
              name: "start-phase",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "none",
              },
            },
            state: {
              type: "has-counter",
              counter: {
                kind: "named",
                name: "energy",
              },
              target: {
                selector: "self",
              },
              comparison: {
                op: "lt",
                value: 3,
              },
            },
          },
          id: "RP6pJj9WtwbTT79qdHPkz:atStartTurnIfHasFewerThan3Energy",
          text: "",
          resolution: {
            kind: "effect",
            effect: {
              type: "optional",
              effect: {
                type: "add-counter",
                counter: {
                  kind: "named",
                  name: "energy",
                },
                count: 1,
                target: {
                  selector: "self",
                },
              },
            },
          },
        },
        {
          kind: "activated",
          abilityType: "instant",
          cost: {
            class: "effect",
            type: "remove-counters",
            counter: {
              kind: "named",
              name: "energy",
            },
            count: 3,
          },
          effect: {
            type: "gain-resources",
            amount: 1,
          },
          id: "RP6pJj9WtwbTT79qdHPkz:instantRemove3EnergyCountersFromGain",
          text: "",
        },
      ],
    },
  },
  braveforgeBracers: {
    canonicalId: "GJBb8BW9zTQ8CkGbzFqmN",
    slug: "braveforge-bracers",
    layout: {
      kind: "single",
    },
    base: {
      names: ["Braveforge Bracers"],
      activeFaceIds: ["GJBb8BW9zTQ8CkGbzFqmN:face:front"],
      color: null,
      typeBoxes: [
        {
          metatypes: [],
          supertypes: ["Warrior"],
          types: ["Equipment"],
          subtypes: ["Arms"],
        },
      ],
      typeBox: {
        metatypes: [],
        supertypes: ["Warrior"],
        types: ["Equipment"],
        subtypes: ["Arms"],
      },
      traits: [],
      textBoxIds: ["GJBb8BW9zTQ8CkGbzFqmN"],
      numeric: {
        defense: 2,
      },
      keywords: [
        {
          name: "battleworn",
        },
      ],
      abilities: [
        {
          kind: "activated",
          limit: {
            count: 1,
            per: "turn",
          },
          abilityType: "action",
          cost: {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          condition: {
            type: "performed-this-turn",
            event: "weapon-hit",
            player: "controller",
          },
          layerKeywords: [
            {
              name: "go-again",
            },
          ],
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  types: ["Weapon"],
                },
              },
              events: ["play", "attack"],
            },
          },
          id: "GJBb8BW9zTQ8CkGbzFqmN:oncePerTurnActionNextWeaponAttackTurnGains",
          text: "",
        },
      ],
    },
  },
} as const satisfies Record<string, FabCardDefinitionInput>;
