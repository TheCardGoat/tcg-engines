import type { FleshAndBloodCard } from "@tcg/flesh-and-blood-types";

/** Generated bounded authored definitions for simulator fixtures. */
export const ravenousRabbleRed = {
  canonicalId: "RpjM6dFbhwh7WPQkNLbbF",
  slug: "ravenous-rabble-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Ravenous Rabble"],
    activeFaceIds: ["RpjM6dFbhwh7WPQkNLbbF:face:front"],
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
    textBoxIds: ["RpjM6dFbhwh7WPQkNLbbF"],
    numeric: {
      pitch: 1,
      cost: 0,
      power: 5,
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
        id: "RpjM6dFbhwh7WPQkNLbbF:triggeredAttackSequenceRevealModifyNumericPowerReferencePitchThisTurn",
        text: "When this attacks, reveal the top card of your deck. This gets -X{p}, where X is the pitch value of the card revealed this way.\nGo again",
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
                type: "modify-numeric",
                property: "power",
                op: "subtract",
                amount: {
                  type: "reference",
                  binding: "it",
                  property: "pitch",
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
    ],
  },
} as const satisfies FleshAndBloodCard;

export const dash = {
  canonicalId: "kftPnNkrBLJ7rPmFGgQCm",
  slug: "dash",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Dash"],
    activeFaceIds: ["kftPnNkrBLJ7rPmFGgQCm:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Mechanologist"],
        types: ["Hero"],
        subtypes: ["Young"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Mechanologist"],
      types: ["Hero"],
      subtypes: ["Young"],
    },
    traits: [],
    textBoxIds: ["kftPnNkrBLJ7rPmFGgQCm"],
    numeric: {
      life: 20,
      intellect: 4,
    },
    keywords: [],
    abilities: [
      {
        kind: "static",
        staticKind: "meta",
        effect: {
          type: "start-game",
          setup: "place",
          filter: {
            and: [
              {
                typeBox: {
                  supertypes: ["Mechanologist"],
                },
              },
              {
                typeBox: {
                  subtypes: ["Item"],
                },
              },
            ],
            cost: {
              op: "lte",
              value: 2,
            },
          },
          to: {
            zone: "permanent",
          },
          optional: true,
        },
        id: "kftPnNkrBLJ7rPmFGgQCm:startGameMechanologistItemCost2LessArena",
        text: "You may start the game with a Mechanologist item with cost 2 or less in the arena.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const cosmicDualityBlue = {
  canonicalId: "WhggpfhhBLDnpKwCkjWDk",
  slug: "cosmic-duality-blue",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Cosmic Duality"],
    activeFaceIds: ["WhggpfhhBLDnpKwCkjWDk:face:front"],
    color: "blue",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Illusionist", "Lightning"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Illusionist", "Lightning"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["WhggpfhhBLDnpKwCkjWDk"],
    numeric: {
      pitch: 3,
      cost: 2,
      power: 5,
      defense: 3,
      arcane: 1,
    },
    keywords: [
      {
        name: "fragment",
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
              type: "discard-self",
            },
          ],
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "deal-damage",
              damageType: "arcane",
              amount: 1,
              target: {
                selector: "any-hero",
              },
            },
            {
              type: "create-token",
              token: "lightning-flow",
              controller: "controller",
            },
          ],
        },
        id: "WhggpfhhBLDnpKwCkjWDk:dealDamageCreateTokenLightningFlowActivation",
        text: "Instant - {r}, discard this: Deal 1 arcane damage to target hero. Create a Lightning Flow token.\nFragment",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const zyggyStarlight = {
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
} as const satisfies FleshAndBloodCard;

export const poisonTheWellBlue = {
  canonicalId: "BqMDcNR8b6m7L7QPtHgTB",
  slug: "poison-the-well-blue",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Poison the Well"],
    activeFaceIds: ["BqMDcNR8b6m7L7QPtHgTB:face:front"],
    color: "blue",
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
    textBoxIds: ["BqMDcNR8b6m7L7QPtHgTB"],
    numeric: {
      pitch: 3,
      cost: 0,
    },
    keywords: [],
    abilities: [
      {
        kind: "resolution",
        effect: {
          type: "replacement",
          replacementKind: "standard",
          replaces: {
            name: "gain-life",
          },
          modification: {
            type: "lose-life",
            amount: {
              type: "event-amount",
            },
            target: {
              selector: "each-hero",
            },
          },
          limit: {
            count: 1,
            per: "turn",
          },
          duration: "this-turn",
        },
        id: "BqMDcNR8b6m7L7QPtHgTB:nextTimeHeroWouldGainTurnInsteadTheyLose",
        text: "The next time a hero would gain {h} this turn, instead they lose that much {h}.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const mightyWindupRed = {
  canonicalId: "RGHRQgGJdBhBPgM9Pfgw7",
  slug: "mighty-windup-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Mighty Windup"],
    activeFaceIds: ["RGHRQgGJdBhBPgM9Pfgw7:face:front"],
    color: "red",
    typeBoxes: [
      {
        metatypes: [],
        supertypeSets: [["Brute"], ["Guardian"]],
        supertypes: ["Brute", "Guardian"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypeSets: [["Brute"], ["Guardian"]],
      supertypes: ["Brute", "Guardian"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["RGHRQgGJdBhBPgM9Pfgw7"],
    numeric: {
      pitch: 1,
      cost: 3,
      power: 7,
      defense: 2,
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
          type: "create-token",
          token: "might",
          controller: "controller",
        },
        id: "RGHRQgGJdBhBPgM9Pfgw7:instantDiscardSelfCreateTokenMight",
        text: "Instant - Discard this: Create a Might token.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const agileWindupRed = {
  canonicalId: "Rmm8PgnzKNNfLcnKh86jd",
  slug: "agile-windup-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Agile Windup"],
    activeFaceIds: ["Rmm8PgnzKNNfLcnKh86jd:face:front"],
    color: "red",
    typeBoxes: [
      {
        metatypes: [],
        supertypeSets: [["Brute"], ["Warrior"]],
        supertypes: ["Brute", "Warrior"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypeSets: [["Brute"], ["Warrior"]],
      supertypes: ["Brute", "Warrior"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["Rmm8PgnzKNNfLcnKh86jd"],
    numeric: {
      pitch: 1,
      cost: 3,
      power: 7,
      defense: 2,
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
          type: "create-token",
          token: "agility",
          controller: "controller",
        },
        id: "Rmm8PgnzKNNfLcnKh86jd:createTokenAgilityActivation",
        text: "Instant - Discard this: Create an Agility token.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const vigorousWindupRed = {
  canonicalId: "6DkjQLNmzwdBmwhfGWTJG",
  slug: "vigorous-windup-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Vigorous Windup"],
    activeFaceIds: ["6DkjQLNmzwdBmwhfGWTJG:face:front"],
    color: "red",
    typeBoxes: [
      {
        metatypes: [],
        supertypeSets: [["Guardian"], ["Warrior"]],
        supertypes: ["Guardian", "Warrior"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypeSets: [["Guardian"], ["Warrior"]],
      supertypes: ["Guardian", "Warrior"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["6DkjQLNmzwdBmwhfGWTJG"],
    numeric: {
      pitch: 1,
      cost: 3,
      power: 7,
      defense: 2,
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
          type: "create-token",
          token: "vigor",
          controller: "controller",
        },
        id: "6DkjQLNmzwdBmwhfGWTJG:activatedCreateToken",
        text: "Instant - Discard this: Create a Vigor token.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const startingStakeYellow = {
  canonicalId: "kD798qm7kWr9fhCLM9dDm",
  slug: "starting-stake-yellow",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Starting Stake"],
    activeFaceIds: ["kD798qm7kWr9fhCLM9dDm:face:front"],
    color: "yellow",
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
    textBoxIds: ["kD798qm7kWr9fhCLM9dDm"],
    numeric: {
      pitch: 2,
      cost: 0,
      defense: 3,
    },
    keywords: [],
    abilities: [
      {
        kind: "resolution",
        condition: {
          type: "zone-count",
          zone: "permanent",
          player: "controller",
          filter: {
            name: "Gold",
            typeBox: {
              metatypes: ["Token"],
            },
          },
          comparison: {
            op: "eq",
            value: 0,
          },
        },
        effect: {
          type: "create-token",
          token: "gold",
          controller: "controller",
        },
        id: "kD798qm7kWr9fhCLM9dDm:controlNoGoldTokensCreateGoldToken",
        text: "If you control no Gold tokens, create a Gold token.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const headJabBlue = {
  canonicalId: "CbngjC9FTFNdmTGT7ddCT",
  slug: "head-jab-blue",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Head Jab"],
    activeFaceIds: ["CbngjC9FTFNdmTGT7ddCT:face:front"],
    color: "blue",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Ninja"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Ninja"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["CbngjC9FTFNdmTGT7ddCT"],
    numeric: {
      pitch: 3,
      cost: 0,
      power: 1,
      defense: 2,
    },
    keywords: [
      {
        name: "go-again",
      },
    ],
    abilities: [],
  },
} as const satisfies FleshAndBloodCard;

export const ravenousMeataxe = {
  canonicalId: "Kfqdk6PhqBd9tKM8T8hmN",
  slug: "ravenous-meataxe",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Ravenous Meataxe"],
    activeFaceIds: ["Kfqdk6PhqBd9tKM8T8hmN:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Brute"],
        types: ["Weapon"],
        subtypes: ["2H", "Axe"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Brute"],
      types: ["Weapon"],
      subtypes: ["2H", "Axe"],
    },
    traits: [],
    textBoxIds: ["Kfqdk6PhqBd9tKM8T8hmN"],
    numeric: {
      power: 3,
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
        id: "Kfqdk6PhqBd9tKM8T8hmN:oncePerTurnActionResourceResourceAttack",
        text: "Once per Turn Action - {r}{r}: Attack\nWhenever you attack with Ravenous Meataxe, draw a card then discard a random card. If a card with 6 or more {p} is discarded this way, Ravenous Meataxe gains +2{p} until end of turn.",
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
                name: "Ravenous Meataxe",
              },
            },
          },
        },
        id: "Kfqdk6PhqBd9tKM8T8hmN:wheneverAttackRavenousMeataxeDrawThenDiscardRandom6MorePowerDiscardedWayRavenousMeataxeGains2PowerEndTurn",
        text: "Once per Turn Action - {r}{r}: Attack\nWhenever you attack with Ravenous Meataxe, draw a card then discard a random card. If a card with 6 or more {p} is discarded this way, Ravenous Meataxe gains +2{p} until end of turn.",
        resolution: {
          kind: "effect",
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
                  random: true,
                },
                outputBinding: "it",
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
                  type: "modify-numeric",
                  property: "power",
                  op: "add",
                  amount: 2,
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
    ],
  },
} as const satisfies FleshAndBloodCard;

export const flashBoltRed = {
  canonicalId: "TkpjjKgfzKLgjRMDJNpk7",
  slug: "flash-bolt-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Flash Bolt"],
    activeFaceIds: ["TkpjjKgfzKLgjRMDJNpk7:face:front"],
    color: "red",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Wizard", "Lightning"],
        types: ["Instant"],
        subtypes: [],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Wizard", "Lightning"],
      types: ["Instant"],
      subtypes: [],
    },
    traits: [],
    textBoxIds: ["TkpjjKgfzKLgjRMDJNpk7"],
    numeric: {
      pitch: 1,
      cost: 2,
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
            selector: "any-hero",
          },
        },
        id: "TkpjjKgfzKLgjRMDJNpk7:dealArcaneDamage",
        text: "Deal 3 arcane damage to target hero.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const pilferTheTombBlue = {
  canonicalId: "pQjcMbpRPhTG8DkHftnK9",
  slug: "pilfer-the-tomb-blue",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Pilfer the Tomb"],
    activeFaceIds: ["pQjcMbpRPhTG8DkHftnK9:face:front"],
    color: "blue",
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
    textBoxIds: ["pQjcMbpRPhTG8DkHftnK9"],
    numeric: {
      pitch: 3,
      cost: 0,
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
              type: "banish",
              target: {
                selector: "object",
                declared: "on-stack",
                player: "opponent",
                zones: ["graveyard"],
                filter: {
                  typeBox: {
                    types: ["Instant"],
                  },
                },
                count: 1,
              },
            },
            id: "pQjcMbpRPhTG8DkHftnK9:chooseModes:banishTargetInstantFromOpposingHeroSGraveyard",
            text: "Banish target instant from an opposing hero's graveyard",
          },
          {
            kind: "resolution",
            effect: {
              type: "banish",
              target: {
                selector: "object",
                declared: "on-stack",
                player: "opponent",
                zones: ["graveyard"],
                filter: {
                  color: ["yellow"],
                },
                count: 1,
              },
            },
            id: "pQjcMbpRPhTG8DkHftnK9:chooseModes:banishTargetYellowFromOpposingHeroSGraveyard",
            text: "Banish target yellow card from an opposing hero's graveyard",
          },
        ],
        id: "pQjcMbpRPhTG8DkHftnK9:chooseModes",
        text: "Choose 1 or both;\n\nBanish target instant from an opposing hero's graveyard.\nBanish target yellow card from an opposing hero's graveyard.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const ripOffTheTopYellow = {
  canonicalId: "NNFqk8C7PnFchKpGJMfph",
  slug: "rip-off-the-top-yellow",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Rip Off the Top"],
    activeFaceIds: ["NNFqk8C7PnFchKpGJMfph:face:front"],
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
    textBoxIds: ["NNFqk8C7PnFchKpGJMfph"],
    numeric: {
      pitch: 2,
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
              type: "pitch-card",
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
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 3,
                duration: "this-turn",
                appliesTo: {
                  next: {
                    or: [
                      {
                        typeBox: {
                          subtypes: ["Attack"],
                        },
                      },
                      {
                        typeBox: {
                          types: ["Weapon"],
                        },
                      },
                    ],
                  },
                  events: ["play", "attack"],
                },
              },
            },
          ],
        },
        id: "NNFqk8C7PnFchKpGJMfph:drawThenPitchRandomHand6MorePowerNextAttackTurnGets3Power",
        text: "Draw a card, then pitch a random card from your hand. If it has 6 or more {p}, your next attack this turn gets +3{p}.\nGo again",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const toughAsARokBlue = {
  canonicalId: "tcgLRpmfGcfgfDkBwGWbk",
  slug: "tough-as-a-rok-blue",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Tough as a Rok"],
    activeFaceIds: ["tcgLRpmfGcfgfDkBwGWbk:face:front"],
    color: "blue",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Brute", "Revered"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Brute", "Revered"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["tcgLRpmfGcfgfDkBwGWbk"],
    numeric: {
      pitch: 3,
      cost: 3,
      defense: 3,
    },
    keywords: [],
    abilities: [
      {
        kind: "static",
        staticKind: "property",
        property: "power",
        value: {
          type: "conditional",
          condition: {
            type: "life-comparison",
            player: "self",
            vs: "each-other-hero",
            op: "lt",
          },
          then: 6,
          else: 0,
        },
        id: "tcgLRpmfGcfgfDkBwGWbk:haveLessLifeThanEachOtherHeroSBasePowerNumber6Otherwise",
        text: "If you have less {h} than each other hero, this card's base {p} is 6, otherwise it's 0.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const rockyardRodeoBlue = {
  canonicalId: "wrwkrjbdCPTBpTKjrQNdJ",
  slug: "rockyard-rodeo-blue",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Rockyard Rodeo"],
    activeFaceIds: ["wrwkrjbdCPTBpTKjrQNdJ:face:front"],
    color: "blue",
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
    textBoxIds: ["wrwkrjbdCPTBpTKjrQNdJ"],
    numeric: {
      pitch: 3,
      cost: 3,
      defense: 2,
    },
    keywords: [],
    abilities: [
      {
        kind: "static",
        staticKind: "property",
        property: "power",
        value: {
          type: "max",
          property: "power",
          filter: {
            typeBox: {
              types: ["Weapon"],
            },
          },
          player: "controller",
        },
        id: "wrwkrjbdCPTBpTKjrQNdJ:powerEqualHighestBasePowerWeapons",
        text: "This card's {p} is equal to the highest base {p} of weapons you control.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const wreckerRompBlue = {
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
} as const satisfies FleshAndBloodCard;

export const rok = {
  canonicalId: "KrjrwRtnjcK7hNhcBdH9h",
  slug: "rok",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Rok"],
    activeFaceIds: ["KrjrwRtnjcK7hNhcBdH9h:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Brute"],
        types: ["Weapon"],
        subtypes: ["2H", "Rock"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Brute"],
      types: ["Weapon"],
      subtypes: ["2H", "Rock"],
    },
    traits: [],
    textBoxIds: ["KrjrwRtnjcK7hNhcBdH9h"],
    numeric: {
      power: 7,
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
        condition: {
          type: "zone-count",
          zone: "hand",
          player: "controller",
          comparison: {
            op: "eq",
            value: 0,
          },
        },
        effect: {
          type: "attack-with",
          target: {
            selector: "self",
          },
        },
        id: "KrjrwRtnjcK7hNhcBdH9h:oncePerTurnActionResourceResourceResourceAttackActivateRokOnlyNoHand",
        text: "Once per Turn Action - {r}{r}{r}: Attack\nActivate Rok only if you have no cards in hand.\nDamage that would be dealt by Rok can't be prevented.",
      },
      {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "rule-modification",
          mode: "restrict",
          action: "be-prevented",
          subject: {
            selector: "self",
          },
          duration: "permanent",
        },
        id: "KrjrwRtnjcK7hNhcBdH9h:damageDealtRokCantPrevented",
        text: "Once per Turn Action - {r}{r}{r}: Attack\nActivate Rok only if you have no cards in hand.\nDamage that would be dealt by Rok can't be prevented.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const spectralProcessionRed = {
  canonicalId: "qt6KzpDJ8JKfc9wNzgbmW",
  slug: "spectral-procession-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Spectral Procession"],
    activeFaceIds: ["qt6KzpDJ8JKfc9wNzgbmW:face:front"],
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
    textBoxIds: ["qt6KzpDJ8JKfc9wNzgbmW"],
    numeric: {
      pitch: 1,
      cost: 0,
      defense: 3,
    },
    keywords: [
      {
        name: "phantasm",
      },
    ],
    abilities: [
      {
        kind: "static",
        staticKind: "property",
        property: "power",
        value: {
          type: "count",
          what: "cards-in-zone",
          zone: "permanent",
          player: "controller",
          filter: {
            name: "Spectral Shield",
          },
        },
        id: "qt6KzpDJ8JKfc9wNzgbmW:spectralProcessionSPowerEqualNumberSpectralShieldsControl",
        text: "Spectral Procession's {p} is equal to the number of Spectral Shields you control.\nPhantasm",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const mutatedMassBlue = {
  canonicalId: "Fw7hr8tGFkDbJkJB8Gjhk",
  slug: "mutated-mass-blue",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Mutated Mass"],
    activeFaceIds: ["Fw7hr8tGFkDbJkJB8Gjhk:face:front"],
    color: "blue",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Shadow"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Shadow"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["Fw7hr8tGFkDbJkJB8Gjhk"],
    numeric: {
      pitch: 3,
      cost: 1,
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
        id: "Fw7hr8tGFkDbJkJB8Gjhk:playMutatedMassBanishedZone",
        text: "You may play Mutated Mass from your banished zone.\nMutated Mass's {p} and {d} is equal to twice the number of cards in your pitch zone with different costs.\nBlood Debt",
      },
      {
        kind: "static",
        staticKind: "property",
        property: "power",
        value: {
          type: "double",
          operands: [
            {
              type: "count",
              what: "distinct-costs",
              zone: "pitch",
              player: "controller",
            },
          ],
        },
        id: "Fw7hr8tGFkDbJkJB8Gjhk:mutatedMasssPowerDefenseEqualTwiceNumberPitchZoneDifferentCosts",
        text: "You may play Mutated Mass from your banished zone.\nMutated Mass's {p} and {d} is equal to twice the number of cards in your pitch zone with different costs.\nBlood Debt",
      },
      {
        kind: "static",
        staticKind: "property",
        property: "defense",
        value: {
          type: "double",
          operands: [
            {
              type: "count",
              what: "distinct-costs",
              zone: "pitch",
              player: "controller",
            },
          ],
        },
        id: "Fw7hr8tGFkDbJkJB8Gjhk:mutatedMasssPowerDefenseEqualTwiceNumberPitchZoneDifferentCostsPropertyDefenseDoubleCount",
        text: "You may play Mutated Mass from your banished zone.\nMutated Mass's {p} and {d} is equal to twice the number of cards in your pitch zone with different costs.\nBlood Debt",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const spectralShield = {
  canonicalId: "NwwnMqBg9tdRBp9NWHpgf",
  slug: "spectral-shield",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Spectral Shield"],
    activeFaceIds: ["NwwnMqBg9tdRBp9NWHpgf:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: ["Token"],
        supertypes: ["Illusionist"],
        types: ["Token"],
        subtypes: ["Aura"],
      },
    ],
    typeBox: {
      metatypes: ["Token"],
      supertypes: ["Illusionist"],
      types: ["Token"],
      subtypes: ["Aura"],
    },
    traits: [],
    textBoxIds: ["NwwnMqBg9tdRBp9NWHpgf"],
    numeric: {},
    keywords: [
      {
        name: "ward",
        value: 1,
      },
    ],
    abilities: [],
  },
} as const satisfies FleshAndBloodCard;

export const splatterSkull = {
  canonicalId: "LwHFKjjChb9JFQjLmrGMq",
  slug: "splatter-skull-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Splatter Skull"],
    activeFaceIds: ["LwHFKjjChb9JFQjLmrGMq:face:front"],
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
    textBoxIds: ["LwHFKjjChb9JFQjLmrGMq"],
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
        id: "LwHFKjjChb9JFQjLmrGMq:whenHitsHeroChooseFaceDownInTheirBanishedZoneWasBanished",
        text: "When this hits a hero, choose a face-down card in their banished zone that was banished by intimidate this turn. Put it into their graveyard.",
        resolution: {
          kind: "effect",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "on-stack",
              player: "opponent",
              zones: ["banished"],
              filter: {
                and: [
                  {
                    hasStatus: "face-down",
                  },
                  {
                    banishedByIntimidateThisTurn: true,
                  },
                ],
              },
              count: 1,
            },
            to: {
              zone: "graveyard",
            },
          },
        },
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const everbloomLifeBlue = {
  canonicalId: "nnQpNFFKqfMwJbRQ6brJ6",
  slug: "everbloom-life-blue",
  layout: {
    kind: "split",
    faces: [
      {
        name: "Everbloom",
        typeText: "Earth Action",
        types: ["Earth", "Action"],
        traits: [],
        text: "",
        keywords: [
          {
            name: "go-again",
          },
          {
            name: "meld",
          },
        ],
        abilities: [
          {
            kind: "resolution",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "choose-card",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    zones: ["graveyard"],
                    filter: {
                      typeBox: {
                        types: ["Action"],
                      },
                      numeric: [
                        {
                          property: "cost",
                          basis: "base",
                          comparison: {
                            op: "lt",
                            value: {
                              type: "count",
                              what: "life-gained-this-turn",
                            },
                          },
                        },
                      ],
                    },
                    count: 1,
                  },
                  outputBinding: "it",
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
              ],
            },
            id: "nnQpNFFKqfMwJbRQ6brJ6:returnAffordableActionToDeck",
            text: "Meld\nChoose an action card in a graveyard with cost less than the total {h} you've gained this turn. Put it on the bottom of its owner's deck.\nGo again\n//\nGain 1{h}",
          },
        ],
      },
      {
        name: "Life",
        typeText: "Instant",
        types: ["Instant"],
        traits: [],
        text: "",
        keywords: [],
        abilities: [
          {
            kind: "resolution",
            effect: {
              type: "gain-life",
              amount: 1,
              target: {
                selector: "controller",
              },
            },
            id: "nnQpNFFKqfMwJbRQ6brJ6:gainOneLife",
            text: "Meld\nChoose an action card in a graveyard with cost less than the total {h} you've gained this turn. Put it on the bottom of its owner's deck.\nGo again\n//\nGain 1{h}",
          },
        ],
      },
    ],
  },
  base: {
    names: ["Everbloom", "Life"],
    activeFaceIds: ["nnQpNFFKqfMwJbRQ6brJ6:face:left", "nnQpNFFKqfMwJbRQ6brJ6:face:right"],
    color: "blue",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Earth"],
        types: ["Action"],
        subtypes: [],
      },
      {
        metatypes: [],
        supertypes: [],
        types: ["Instant"],
        subtypes: [],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Earth"],
      types: ["Action", "Instant"],
      subtypes: [],
    },
    traits: [],
    textBoxIds: ["nnQpNFFKqfMwJbRQ6brJ6:textbox:left", "nnQpNFFKqfMwJbRQ6brJ6:textbox:right"],
    numeric: {
      pitch: 3,
      cost: 0,
      defense: 3,
    },
    keywords: [
      {
        name: "go-again",
      },
      {
        name: "meld",
      },
    ],
    abilities: [
      {
        kind: "resolution",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "choose-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                zones: ["graveyard"],
                filter: {
                  typeBox: {
                    types: ["Action"],
                  },
                  numeric: [
                    {
                      property: "cost",
                      basis: "base",
                      comparison: {
                        op: "lt",
                        value: {
                          type: "count",
                          what: "life-gained-this-turn",
                        },
                      },
                    },
                  ],
                },
                count: 1,
              },
              outputBinding: "it",
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
          ],
        },
        id: "nnQpNFFKqfMwJbRQ6brJ6:returnAffordableActionToDeck",
        text: "Meld\nChoose an action card in a graveyard with cost less than the total {h} you've gained this turn. Put it on the bottom of its owner's deck.\nGo again\n//\nGain 1{h}",
      },
      {
        kind: "resolution",
        effect: {
          type: "gain-life",
          amount: 1,
          target: {
            selector: "controller",
          },
        },
        id: "nnQpNFFKqfMwJbRQ6brJ6:gainOneLife",
        text: "Meld\nChoose an action card in a graveyard with cost less than the total {h} you've gained this turn. Put it on the bottom of its owner's deck.\nGo again\n//\nGain 1{h}",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const invokeYenduraiRed = {
  canonicalId: "9J9c98JJDc8mtKnRR9hhq",
  slug: "invoke-yendurai-red",
  layout: {
    kind: "flip",
    family: "invocation",
    front: {
      name: "Invoke Yendurai",
      typeText: "Draconic Illusionist Action - Invocation",
      types: ["Draconic", "Illusionist", "Action", "Invocation"],
      traits: [],
      text: "",
      keywords: [
        {
          name: "go-again",
        },
      ],
      abilities: [
        {
          kind: "resolution",
          layerKeywords: [
            {
              name: "go-again",
            },
          ],
          effect: {
            type: "transform-into-resolving-card",
            target: {
              selector: "object",
              declared: "on-stack",
              player: "controller",
              zones: ["permanent"],
              filter: {
                name: "Ash",
              },
              count: 1,
            },
          },
          label: {
            name: "transform",
          },
          id: "9J9c98JJDc8mtKnRR9hhq:transformAshIntoYendurai",
          text: "Transform target ash you control into Yendurai. Go again",
        },
      ],
      color: "red",
      numeric: {
        pitch: 1,
        cost: 1,
        defense: 3,
      },
      faceId: "9J9c98JJDc8mtKnRR9hhq:face:front",
    },
    back: {
      name: "Yendurai",
      typeText: "Draconic Illusionist - Dragon Ally",
      types: ["Illusionist", "Draconic", "Ally", "Dragon"],
      traits: [],
      text: "",
      keywords: [],
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
                name: "endurance",
              },
              count: 1,
              target: {
                selector: "self",
              },
            },
            duration: "while-in-arena",
          },
          id: "gqTpfTkztdLpN8W6TpRtR:enterWithEnduranceCounter",
          text: "Transform target ash you control into Yendurai. Go again",
        },
        {
          kind: "static",
          staticKind: "continuous",
          effect: {
            type: "prevention",
            preventionKind: "fixed",
            amount: 3,
            shielded: {
              selector: "self",
            },
            optionalCost: {
              class: "effect",
              type: "remove-counters",
              counter: {
                kind: "named",
                name: "endurance",
              },
              count: 1,
            },
            duration: "while-in-arena",
          },
          id: "gqTpfTkztdLpN8W6TpRtR:preventDamageWithEnduranceCounter",
          text: "Transform target ash you control into Yendurai. Go again",
        },
      ],
      numeric: {
        power: 3,
        life: 3,
      },
      faceId: "9J9c98JJDc8mtKnRR9hhq:face:back",
    },
  },
  base: {
    names: ["Invoke Yendurai"],
    activeFaceIds: ["9J9c98JJDc8mtKnRR9hhq:face:front"],
    color: "red",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Illusionist", "Draconic"],
        types: ["Action"],
        subtypes: ["Invocation"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Illusionist", "Draconic"],
      types: ["Action"],
      subtypes: ["Invocation"],
    },
    traits: [],
    textBoxIds: ["9J9c98JJDc8mtKnRR9hhq"],
    numeric: {
      pitch: 1,
      cost: 1,
      defense: 3,
    },
    keywords: [],
    abilities: [],
  },
} as const satisfies FleshAndBloodCard;

export const sigilOfSolaceRed = {
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
} as const satisfies FleshAndBloodCard;

export const crackedBaubleYellow = {
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
} as const satisfies FleshAndBloodCard;

export const zeroToSixtyRed = {
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
} as const satisfies FleshAndBloodCard;

export const skullboneCrosswrap = {
  canonicalId: "pLT6mqkb86GG9jHh8kFRp",
  slug: "skullbone-crosswrap",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Skullbone Crosswrap"],
    activeFaceIds: ["pLT6mqkb86GG9jHh8kFRp:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Ranger"],
        types: ["Equipment"],
        subtypes: ["Head"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Ranger"],
      types: ["Equipment"],
      subtypes: ["Head"],
    },
    traits: [],
    textBoxIds: ["pLT6mqkb86GG9jHh8kFRp"],
    numeric: {
      defense: 1,
    },
    keywords: [
      {
        name: "arcane-barrier",
        value: 1,
      },
      {
        name: "blade-break",
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
          class: "effect",
          type: "turn-face-up",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["arsenal"],
            filter: {
              hasStatus: "face-down",
            },
            count: 1,
          },
          outputBinding: "it",
        },
        layerKeywords: [
          {
            name: "go-again",
          },
        ],
        effect: {
          type: "opt",
          count: 1,
        },
        id: "pLT6mqkb86GG9jHh8kFRp:oncePerTurnActionTurnFaceDownArsenalFace",
        text: "Once per Turn Action - Turn a face down card in your arsenal face up: Opt 1. Go again\nArcane Barrier 1\nBlade Break",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const talismanicLens = {
  canonicalId: "JTNgbmMDfnz69RKFpjrrR",
  slug: "talismanic-lens",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Talismanic Lens"],
    activeFaceIds: ["JTNgbmMDfnz69RKFpjrrR:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: [],
        supertypes: [],
        types: ["Equipment"],
        subtypes: ["Head"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: [],
      types: ["Equipment"],
      subtypes: ["Head"],
    },
    traits: [],
    textBoxIds: ["JTNgbmMDfnz69RKFpjrrR"],
    numeric: {
      defense: 0,
    },
    keywords: [],
    abilities: [
      {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        effect: {
          type: "opt",
          count: 2,
        },
        id: "JTNgbmMDfnz69RKFpjrrR:instantDestroyTalismanicLensOpt2",
        text: "Instant - Destroy Talismanic Lens: Opt 2",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const optekalMonocleBlue = {
  canonicalId: "6Wcpcb7DQ8GMGMTwjdQTR",
  slug: "optekal-monocle-blue",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Optekal Monocle"],
    activeFaceIds: ["6Wcpcb7DQ8GMGMTwjdQTR:face:front"],
    color: "blue",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Mechanologist"],
        types: ["Action"],
        subtypes: ["Item"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Mechanologist"],
      types: ["Action"],
      subtypes: ["Item"],
    },
    traits: [],
    textBoxIds: ["6Wcpcb7DQ8GMGMTwjdQTR"],
    numeric: {
      pitch: 3,
      cost: 0,
    },
    keywords: [],
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
              name: "steam",
            },
            count: 5,
            target: {
              selector: "self",
            },
          },
          duration: "while-in-arena",
        },
        id: "6Wcpcb7DQ8GMGMTwjdQTR:optekalMonocleEntersArena5SteamCounters",
        text: "Optekal Monocle enters the arena with 5 steam counters on it. When Optekal Monocle has no steam counters on it, destroy it.\nAction - Remove a steam counter from Optekal Monocle: Opt 1. Go again",
      },
      {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "state",
          state: {
            type: "has-counter",
            counter: {
              kind: "named",
              name: "steam",
            },
            target: {
              selector: "self",
            },
            comparison: {
              op: "eq",
              value: 0,
            },
          },
        },
        id: "6Wcpcb7DQ8GMGMTwjdQTR:optekalMonocleNoSteamCountersDestroy",
        text: "Optekal Monocle enters the arena with 5 steam counters on it. When Optekal Monocle has no steam counters on it, destroy it.\nAction - Remove a steam counter from Optekal Monocle: Opt 1. Go again",
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
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "effect",
          type: "remove-counters",
          counter: {
            kind: "named",
            name: "steam",
          },
          count: 1,
        },
        layerKeywords: [
          {
            name: "go-again",
          },
        ],
        effect: {
          type: "opt",
          count: 1,
        },
        id: "6Wcpcb7DQ8GMGMTwjdQTR:actionRemoveSteamCounterOptekalMonocleOpt1GoAgain",
        text: "Optekal Monocle enters the arena with 5 steam counters on it. When Optekal Monocle has no steam counters on it, destroy it.\nAction - Remove a steam counter from Optekal Monocle: Opt 1. Go again",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const whisperOfTheOracleRed = {
  canonicalId: "6MRRLJw7g9wgwWPMDhzmT",
  slug: "whisper-of-the-oracle-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Whisper of the Oracle"],
    activeFaceIds: ["6MRRLJw7g9wgwWPMDhzmT:face:front"],
    color: "red",
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
    textBoxIds: ["6MRRLJw7g9wgwWPMDhzmT"],
    numeric: {
      pitch: 1,
      cost: 0,
      defense: 3,
    },
    keywords: [
      {
        name: "opt",
        value: 4,
      },
      {
        name: "go-again",
      },
    ],
    abilities: [],
  },
} as const satisfies FleshAndBloodCard;

export const bonebreakerBellowRed = {
  canonicalId: "NdJfHMk8nMjh67drcwMK7",
  slug: "bonebreaker-bellow-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Bonebreaker Bellow"],
    activeFaceIds: ["NdJfHMk8nMjh67drcwMK7:face:front"],
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
    textBoxIds: ["NdJfHMk8nMjh67drcwMK7"],
    numeric: {
      pitch: 1,
      cost: 1,
      defense: 3,
    },
    keywords: [
      {
        name: "beat-chest",
      },
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
              amount: 3,
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
            {
              type: "self-replacement",
              condition: {
                type: "performed-this-turn",
                event: "beat-chest",
                player: "controller",
              },
              modification: {
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
            },
          ],
        },
        id: "NdJfHMk8nMjh67drcwMK7:resolutionSequence",
        text: "Beat Chest\nYour next Brute attack this turn gains +3{p}. If you've beaten chest this turn, instead it gains +5{p}.\nGo again",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const wageMightBlue = {
  canonicalId: "wGwjNqdjmKwqgzKrPhMn9",
  slug: "wage-might-blue",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Wage Might"],
    activeFaceIds: ["wGwjNqdjmKwqgzKrPhMn9:face:front"],
    color: "blue",
    typeBoxes: [
      {
        metatypes: [],
        supertypeSets: [["Brute"], ["Guardian"]],
        supertypes: ["Brute", "Guardian"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypeSets: [["Brute"], ["Guardian"]],
      supertypes: ["Brute", "Guardian"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["wGwjNqdjmKwqgzKrPhMn9"],
    numeric: {
      pitch: 3,
      cost: 3,
      power: 5,
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
        label: {
          name: "wager",
        },
        id: "wGwjNqdjmKwqgzKrPhMn9:triggeredStaticOnAttackEffect",
        text: "When this attacks a hero, you may wager a Might token with them.",
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "wager",
              stake: "might",
              with: {
                selector: "attack-target",
              },
            },
          },
        },
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const alphaRampageRed = {
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
} as const satisfies FleshAndBloodCard;

export const snatchRed = {
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
} as const satisfies FleshAndBloodCard;

export const nimblismYellow = {
  canonicalId: "M6j9KrDRqMMHwGqw9QLKz",
  slug: "nimblism-yellow",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Nimblism"],
    activeFaceIds: ["M6j9KrDRqMMHwGqw9QLKz:face:front"],
    color: "yellow",
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
    textBoxIds: ["M6j9KrDRqMMHwGqw9QLKz"],
    numeric: {
      pitch: 2,
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
          amount: 2,
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
        id: "M6j9KrDRqMMHwGqw9QLKz:buffNextLowCostAttack",
        text: "The next attack action card with cost 1 or less you play this turn gains +2{p}.\nGo again",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const braveforgeBracers = {
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
        text: "Once per turn Action - {r}: Your next weapon attack this turn gains +1{p}. Activate this ability only if a weapon you control has hit this turn. Go again\nBattleworn",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const icebindRed = {
  canonicalId: "6wknmpgBbdgQBjD7LR6rb",
  slug: "icebind-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Icebind"],
    activeFaceIds: ["6wknmpgBbdgQBjD7LR6rb:face:front"],
    color: "red",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Wizard", "Elemental"],
        types: ["Action"],
        subtypes: [],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Wizard", "Elemental"],
      types: ["Action"],
      subtypes: [],
    },
    traits: [],
    textBoxIds: ["6wknmpgBbdgQBjD7LR6rb"],
    numeric: {
      pitch: 1,
      cost: 0,
      defense: 3,
      arcane: 3,
    },
    keywords: [
      {
        name: "fusion",
        supertypes: ["Ice"],
        mode: "and",
      },
    ],
    abilities: [
      {
        kind: "resolution",
        effect: {
          type: "sequence",
          steps: [
            {
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
            {
              type: "conditional",
              condition: {
                type: "and",
                conditions: [
                  {
                    type: "has-status",
                    status: "fused",
                  },
                  {
                    type: "has-status",
                    status: "dealt-damage-to-hero",
                  },
                ],
              },
              then: {
                type: "freeze",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "target-controller",
                  zones: ["arsenal"],
                  count: 1,
                },
                duration: "until-start-of-own-next-turn",
              },
            },
          ],
        },
        id: "6wknmpgBbdgQBjD7LR6rb:sequenceDealDamageConditionalAndHasStatusFusedHasStatusDealtDamageToHeroFreezeUntilStartOfOwnNext",
        text: "Ice Fusion\nDeal 1 arcane damage to any target. If Icebind was fused and deals damage to a hero, freeze a card in their arsenal until the start of your next turn.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const blizzardBlue = {
  canonicalId: "FgqfGWQfPqmQFNpn8cPMW",
  slug: "blizzard-blue",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Blizzard"],
    activeFaceIds: ["FgqfGWQfPqmQFNpn8cPMW:face:front"],
    color: "blue",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Ice"],
        types: ["Instant"],
        subtypes: [],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Ice"],
      types: ["Instant"],
      subtypes: [],
    },
    traits: [],
    textBoxIds: ["FgqfGWQfPqmQFNpn8cPMW"],
    numeric: {
      pitch: 3,
      cost: 0,
    },
    keywords: [],
    abilities: [
      {
        kind: "resolution",
        effect: {
          type: "unless",
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
                  declared: "on-stack",
                  player: "any",
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
              {
                type: "rule-modification",
                mode: "restrict",
                action: "gain-keyword",
                filter: {
                  hasKeyword: "go-again",
                },
                duration: "this-turn",
              },
            ],
          },
          escape: {
            type: "pay",
            cost: {
              class: "asset",
              type: "resources",
              amount: 2,
            },
            payer: "attacking-hero",
          },
        },
        id: "FgqfGWQfPqmQFNpn8cPMW:targetAttackLosesCanTGainGoAgainUnless",
        text: "Target attack loses and can't gain go again unless its controller pays {r}{r}.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const entwineIceRed = {
  canonicalId: "jHLRPPQDpFDLGHJkPKQtz",
  slug: "entwine-ice-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Entwine Ice"],
    activeFaceIds: ["jHLRPPQDpFDLGHJkPKQtz:face:front"],
    color: "red",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Elemental"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Elemental"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["jHLRPPQDpFDLGHJkPKQtz"],
    numeric: {
      pitch: 1,
      cost: 1,
      power: 5,
      defense: 2,
    },
    keywords: [
      {
        name: "fusion",
        supertypes: ["Ice"],
        mode: "and",
      },
      {
        name: "dominate",
      },
    ],
    abilities: [
      {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "has-status",
          status: "fused",
        },
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: {
              name: "dominate",
            },
          },
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
        id: "jHLRPPQDpFDLGHJkPKQtz:continuousGrantProperty",
        text: "Ice Fusion\nIf Entwine Ice was fused, it gains dominate.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const spearsOfSurrealityRed = {
  canonicalId: "gGNMr8mcpnDbqBpGLfMrN",
  slug: "spears-of-surreality-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Spears of Surreality"],
    activeFaceIds: ["gGNMr8mcpnDbqBpGLfMrN:face:front"],
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
    textBoxIds: ["gGNMr8mcpnDbqBpGLfMrN"],
    numeric: {
      pitch: 1,
      cost: 1,
      power: 5,
      defense: 3,
    },
    keywords: [
      {
        name: "phantasm",
      },
      {
        name: "go-again",
      },
    ],
    abilities: [],
  },
} as const satisfies FleshAndBloodCard;

export const holoShieldRed = {
  canonicalId: "f9C7rd9WgL9b8bgFMrP9h",
  slug: "holo-shield-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Holo Shield"],
    activeFaceIds: ["f9C7rd9WgL9b8bgFMrP9h:face:front"],
    color: "red",
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
    textBoxIds: ["f9C7rd9WgL9b8bgFMrP9h"],
    numeric: {
      pitch: 1,
      cost: 1,
    },
    keywords: [
      {
        name: "ward",
        value: {
          type: "x",
        },
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
              name: "ward",
              value: {
                type: "conditional",
                condition: {
                  type: "has-counter",
                  counter: {
                    kind: "named",
                    name: "holo",
                  },
                  target: {
                    selector: "self",
                  },
                },
                then: 4,
                else: 1,
              },
            },
          },
          target: {
            selector: "self",
          },
          duration: "while-in-arena",
        },
        id: "f9C7rd9WgL9b8bgFMrP9h:wardValue",
        text: "Ward X, where X is 4 if this has a holo counter. Otherwise, X is 1.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const leaveNoWitnessesRed = {
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
} as const satisfies FleshAndBloodCard;

export const plunderThePoorRed = {
  canonicalId: "6QdjhDLqHJ9DB8GHD6fmf",
  slug: "plunder-the-poor-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Plunder the Poor"],
    activeFaceIds: ["6QdjhDLqHJ9DB8GHD6fmf:face:front"],
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
    textBoxIds: ["6QdjhDLqHJ9DB8GHD6fmf"],
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
          task: "banish opponents' cards with cost 1 or less",
          completeOn: "banish",
          filter: {
            cost: {
              op: "lte",
              value: 1,
            },
          },
        },
        label: {
          name: "contract",
        },
        id: "6QdjhDLqHJ9DB8GHD6fmf:contractTaskContract",
        text: "Contract - You are contracted to banish opponents' cards with cost 1 or less. Whenever you complete this contract, create a Silver token.\nWhen this hits a hero, banish the top card of their deck.",
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
        id: "6QdjhDLqHJ9DB8GHD6fmf:triggeredCompleteContractCreateTokenSilverContract",
        text: "Contract - You are contracted to banish opponents' cards with cost 1 or less. Whenever you complete this contract, create a Silver token.\nWhen this hits a hero, banish the top card of their deck.",
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
        id: "6QdjhDLqHJ9DB8GHD6fmf:triggeredHitBanish",
        text: "Contract - You are contracted to banish opponents' cards with cost 1 or less. Whenever you complete this contract, create a Silver token.\nWhen this hits a hero, banish the top card of their deck.",
        resolution: {
          kind: "effect",
          effect: {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["deck"],
              position: "top",
              count: 1,
            },
            outputBinding: "banished",
          },
        },
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const alphaInstinctBlue = {
  canonicalId: "kBJJjzp8KMrRWcwMwKWcW",
  slug: "alpha-instinct-blue",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Alpha Instinct"],
    activeFaceIds: ["kBJJjzp8KMrRWcwMwKWcW:face:front"],
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
    traits: ["Rhinar Specialization"],
    textBoxIds: ["kBJJjzp8KMrRWcwMwKWcW"],
    numeric: {
      pitch: 3,
      cost: 3,
      power: 6,
      defense: 0,
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
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "beat-chest",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "none",
            },
          },
        },
        id: "kBJJjzp8KMrRWcwMwKWcW:whenIsDiscardedBeatChestCreateMightToken",
        text: "Rhinar Specialization\nWhen this is discarded to beat chest, create a Might token.",
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
} as const satisfies FleshAndBloodCard;

export const hulkUpBlue = {
  canonicalId: "mJKcWjzzzGmbTchphggNT",
  slug: "hulk-up-blue",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Hulk Up"],
    activeFaceIds: ["mJKcWjzzzGmbTchphggNT:face:front"],
    color: "blue",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Revered"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Revered"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["mJKcWjzzzGmbTchphggNT"],
    numeric: {
      pitch: 3,
      cost: 4,
      power: 6,
      defense: 2,
    },
    keywords: [],
    abilities: [
      {
        kind: "static",
        staticKind: "play",
        condition: {
          type: "life-comparison",
          player: "self",
          vs: "each-other-hero",
          op: "lt",
        },
        playEffect: {
          role: "cost-reduction",
          cost: {
            class: "asset",
            type: "resources",
            amount: 1,
          },
        },
        id: "mJKcWjzzzGmbTchphggNT:playLifeComparisonResources",
        text: "If you have less {h} than each other hero, this costs {r} less to play.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const windUpTheCrowdBlue = {
  canonicalId: "H7QLKkw7fPCLfntKj86qp",
  slug: "wind-up-the-crowd-blue",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Wind Up the Crowd"],
    activeFaceIds: ["H7QLKkw7fPCLfntKj86qp:face:front"],
    color: "blue",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Brute", "Revered"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Brute", "Revered"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["H7QLKkw7fPCLfntKj86qp"],
    numeric: {
      pitch: 3,
      cost: 3,
      power: 6,
      defense: 0,
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
          type: "sequence",
          steps: [
            {
              type: "create-token",
              token: "toughness",
              controller: "controller",
            },
            {
              type: "create-token",
              token: "vigor",
              controller: "controller",
            },
          ],
        },
        id: "H7QLKkw7fPCLfntKj86qp:instantDiscardCreateToughnessVigorToken",
        text: "Instant - Discard this: Create a Toughness and a Vigor token.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const silverstrideDodgers = {
  canonicalId: "qLHCbFDHBQbzKGTTBq8PW",
  slug: "silverstride-dodgers",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Silverstride Dodgers"],
    activeFaceIds: ["qLHCbFDHBQbzKGTTBq8PW:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Warrior"],
        types: ["Equipment"],
        subtypes: ["Legs"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Warrior"],
      types: ["Equipment"],
      subtypes: ["Legs"],
    },
    traits: [],
    textBoxIds: ["qLHCbFDHBQbzKGTTBq8PW"],
    numeric: {
      defense: 1,
    },
    keywords: [
      {
        name: "temper",
      },
    ],
    abilities: [
      {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "control-object",
          filter: {
            name: "Flurry",
            typeBox: {
              metatypes: ["Token"],
            },
          },
        },
        effect: {
          type: "modify-numeric",
          property: "defense",
          op: "add",
          amount: 1,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
        id: "qLHCbFDHBQbzKGTTBq8PW:ifControlFlurryTokenGets1",
        text: "If you control a Flurry token, this gets +1{d}.\nTemper",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const hadronColliderRed = {
  canonicalId: "cjBPdpPNhzkzgdRCtKGPG",
  slug: "hadron-collider-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Hadron Collider"],
    activeFaceIds: ["cjBPdpPNhzkzgdRCtKGPG:face:front"],
    color: "red",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Mechanologist"],
        types: ["Action"],
        subtypes: ["Item"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Mechanologist"],
      types: ["Action"],
      subtypes: ["Item"],
    },
    traits: [],
    textBoxIds: ["cjBPdpPNhzkzgdRCtKGPG"],
    numeric: {
      pitch: 1,
      cost: 1,
    },
    keywords: [
      {
        name: "crank",
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
              name: "steam",
            },
            count: 4,
            target: {
              selector: "self",
            },
          },
          duration: "while-in-arena",
        },
        id: "cjBPdpPNhzkzgdRCtKGPG:continuousReplacementEnterArenaAddCounterSteamWhileInArena",
        text: "Crank\nThis enters the arena with 4 steam counters. At the start of your turn, destroy this unless you remove a steam counter from it.\nWhen you boost an attack, destroy this. If you do, the attack gets +X{p}, where X is the number of steam counters on this.",
      },
      {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
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
        },
        id: "cjBPdpPNhzkzgdRCtKGPG:triggeredStartPhaseUnlessDestroyRemoveCountersSteam",
        text: "Crank\nThis enters the arena with 4 steam counters. At the start of your turn, destroy this unless you remove a steam counter from it.\nWhen you boost an attack, destroy this. If you do, the attack gets +X{p}, where X is the number of steam counters on this.",
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
              type: "remove-counters",
              counter: {
                kind: "named",
                name: "steam",
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
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "boost",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "event-object",
              selector: "boosted-card",
              relationship: {
                kind: "any",
              },
              filter: {
                typeBox: {
                  subtypes: ["Attack"],
                },
              },
            },
          },
        },
        id: "cjBPdpPNhzkzgdRCtKGPG:triggeredBoostIfYouDoDestroyModifyNumericPowerCountSteamThisTurn",
        text: "Crank\nThis enters the arena with 4 steam counters. At the start of your turn, destroy this unless you remove a steam counter from it.\nWhen you boost an attack, destroy this. If you do, the attack gets +X{p}, where X is the number of steam counters on this.",
        resolution: {
          kind: "effect",
          effect: {
            type: "if-you-do",
            effect: {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            then: {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: {
                type: "count",
                what: "counters-on-source",
                counter: {
                  kind: "named",
                  name: "steam",
                },
              },
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
            },
          },
        },
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const dawnblade = {
  canonicalId: "NDjHqNJrckK6pjK7LwfMW",
  slug: "dawnblade",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Dawnblade"],
    activeFaceIds: ["NDjHqNJrckK6pjK7LwfMW:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Warrior"],
        types: ["Weapon"],
        subtypes: ["2H", "Sword"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Warrior"],
      types: ["Weapon"],
      subtypes: ["2H", "Sword"],
    },
    traits: [],
    textBoxIds: ["NDjHqNJrckK6pjK7LwfMW"],
    numeric: {
      power: 3,
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
          amount: 1,
        },
        effect: {
          type: "attack-with",
          target: {
            selector: "self",
          },
        },
        id: "NDjHqNJrckK6pjK7LwfMW:oncePerTurnActionResourceAttack",
        text: "Once per Turn Action - {r}: Attack\nThe second time this hits each turn, put a +1{p} counter on it.\nAt the beginning of your end phase, if this hasn't hit this turn, remove all +1{p} counters from it.",
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
        limit: {
          count: 1,
          per: "turn",
          ordinals: [2],
        },
        id: "NDjHqNJrckK6pjK7LwfMW:secondTimeHitsTurnPut1PowerCounter",
        text: "Once per Turn Action - {r}: Attack\nThe second time this hits each turn, put a +1{p} counter on it.\nAt the beginning of your end phase, if this hasn't hit this turn, remove all +1{p} counters from it.",
        resolution: {
          kind: "effect",
          effect: {
            type: "add-counter",
            counter: {
              kind: "numeric",
              value: 1,
              property: "power",
            },
            count: 1,
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
            type: "not",
            condition: {
              type: "has-status",
              status: "this-dealt-damage",
            },
          },
        },
        id: "NDjHqNJrckK6pjK7LwfMW:beginningEndPhaseHasntHitTurnRemoveAll1PowerCounters",
        text: "Once per Turn Action - {r}: Attack\nThe second time this hits each turn, put a +1{p} counter on it.\nAt the beginning of your end phase, if this hasn't hit this turn, remove all +1{p} counters from it.",
        resolution: {
          kind: "effect",
          effect: {
            type: "remove-counters",
            counter: {
              kind: "numeric",
              value: 1,
              property: "power",
            },
            count: {
              type: "all",
            },
            target: {
              selector: "self",
            },
          },
        },
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const theSuspenseIsKillingMeBlue = {
  canonicalId: "RBWKndBPqQHwdWCzPnj8k",
  slug: "the-suspense-is-killing-me-blue",
  layout: {
    kind: "single",
  },
  base: {
    names: ["The Suspense is Killing Me"],
    activeFaceIds: ["RBWKndBPqQHwdWCzPnj8k:face:front"],
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
    textBoxIds: ["RBWKndBPqQHwdWCzPnj8k"],
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
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "this-attack",
          },
          duration: "while-in-arena",
          appliesTo: {
            next: {
              typeBox: {
                subtypes: ["Attack"],
              },
            },
            events: ["play", "attack"],
          },
        },
        id: "RBWKndBPqQHwdWCzPnj8k:firstAttackEachTurnGets1",
        text: "Suspense\nYour first attack each turn gets +1{p}.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const indefensiblyHonedBlue = {
  canonicalId: "NnJrnKHWM6F8hLqrD6QW9",
  slug: "indefensibly-honed-blue",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Indefensibly Honed"],
    activeFaceIds: ["NnJrnKHWM6F8hLqrD6QW9:face:front"],
    color: "blue",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Warrior"],
        types: ["Action"],
        subtypes: [],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Warrior"],
      types: ["Action"],
      subtypes: [],
    },
    traits: [],
    textBoxIds: ["NnJrnKHWM6F8hLqrD6QW9"],
    numeric: {
      pitch: 3,
      cost: 0,
      defense: 3,
    },
    keywords: [
      {
        name: "sharpen",
      },
      {
        name: "go-again",
      },
    ],
    abilities: [
      {
        kind: "resolution",
        effect: {
          type: "sharpen",
          target: {
            selector: "object",
            declared: "on-stack",
            player: "controller",
            zones: ["weapon", "permanent"],
            filter: {
              typeBox: {
                subtypes: ["Sword"],
              },
            },
            count: 1,
          },
          outputBinding: "it",
        },
        id: "NnJrnKHWM6F8hLqrD6QW9:sharpenTargetSword",
        text: 'Sharpen target sword you control.\nIf it has 3 or more +1{p} counters, your next attack with it this turn gets "When this is defended by 1 or more cards, deal 1 damage to the defending hero." Go again',
      },
      {
        kind: "resolution",
        condition: {
          type: "has-counter",
          counter: {
            kind: "numeric",
            value: 1,
            property: "power",
          },
          target: {
            selector: "binding",
            binding: "it",
          },
          comparison: {
            op: "gte",
            value: 3,
          },
        },
        effect: {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              kind: "static",
              staticKind: "triggered",
              id: "NnJrnKHWM6F8hLqrD6QW9:ability3More1PowerCountersNextAttackTurnGetsDefended1MoreDeal1DamageDefendingGoAgain:defended1MoreDeal1DamageDefending",
              text: 'Sharpen target sword you control.\nIf it has 3 or more +1{p} counters, your next attack with it this turn gets "When this is defended by 1 or more cards, deal 1 damage to the defending hero." Go again',
              trigger: {
                kind: "event",
                event: {
                  name: "defend",
                  actor: {
                    kind: "player",
                    player: "defending-hero",
                  },
                  observes: {
                    kind: "source",
                    selector: "defended-attack",
                  },
                  amount: {
                    op: "gte",
                    value: 1,
                  },
                },
              },
              resolution: {
                kind: "effect",
                effect: {
                  type: "deal-damage",
                  damageType: "generic",
                  amount: 1,
                  target: {
                    selector: "defending-hero",
                  },
                },
              },
            },
          },
          target: {
            selector: "binding",
            binding: "it",
          },
          duration: "this-turn",
          appliesTo: {
            attacksOf: true,
            count: 1,
            next: {
              typeBox: {
                types: ["Weapon"],
              },
            },
            events: ["attack"],
          },
        },
        id: "NnJrnKHWM6F8hLqrD6QW9:ability3More1PowerCountersNextAttackTurnGetsDefended1MoreDeal1DamageDefendingGoAgain",
        text: 'Sharpen target sword you control.\nIf it has 3 or more +1{p} counters, your next attack with it this turn gets "When this is defended by 1 or more cards, deal 1 damage to the defending hero." Go again',
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const songOfSinewYellow = {
  canonicalId: "gG6NLRhhPKLPh6Q7nJHBT",
  slug: "song-of-sinew-yellow",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Song of Sinew"],
    activeFaceIds: ["gG6NLRhhPKLPh6Q7nJHBT:face:front"],
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
    textBoxIds: ["gG6NLRhhPKLPh6Q7nJHBT"],
    numeric: {
      pitch: 2,
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
              type: "reveal",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                position: "top",
                count: 4,
              },
              outputBinding: "them",
            },
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: {
                type: "count",
                what: "cards-revealed-this-way",
                filter: {
                  power: {
                    op: "gte",
                    value: 6,
                  },
                },
              },
              duration: "this-turn",
              appliesTo: {
                next: {
                  or: [
                    {
                      typeBox: {
                        subtypes: ["Attack"],
                      },
                    },
                    {
                      typeBox: {
                        types: ["Weapon"],
                      },
                    },
                  ],
                },
                events: ["play", "attack"],
              },
            },
            {
              type: "reorder-deck",
              target: {
                selector: "binding",
                binding: "them",
              },
              position: "top",
            },
          ],
        },
        id: "gG6NLRhhPKLPh6Q7nJHBT:revealTopNumber4DeckNextAttackTurnGetsXPowerWhereX",
        text: "Reveal the top 4 cards of your deck. Your next attack this turn gets +X{p}, where X is the number of cards with 6 or more {p} revealed this way. Put them back in any order.\nGo again",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const brutalAssaultBlue = {
  canonicalId: "qhPfDmWPHpHT8gpFmNkkr",
  slug: "brutal-assault-blue",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Brutal Assault"],
    activeFaceIds: ["qhPfDmWPHpHT8gpFmNkkr:face:front"],
    color: "blue",
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
    textBoxIds: ["qhPfDmWPHpHT8gpFmNkkr"],
    numeric: {
      pitch: 3,
      cost: 2,
      power: 4,
      defense: 3,
    },
    keywords: [],
    abilities: [],
  },
} as const satisfies FleshAndBloodCard;

export const digInYellow = {
  canonicalId: "RhkhMcbkCpRhLmpfqmbDF",
  slug: "dig-in-yellow",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Dig In"],
    activeFaceIds: ["RhkhMcbkCpRhLmpfqmbDF:face:front"],
    color: "yellow",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Revered"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Revered"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["RhkhMcbkCpRhLmpfqmbDF"],
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
        id: "RhkhMcbkCpRhLmpfqmbDF:onDefendPayCreateTokenToughness",
        text: "When this defends, you may pay up to {r}{r}{r}. Create that many Toughness tokens.",
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "optional",
                effect: {
                  type: "pay",
                  cost: {
                    class: "asset",
                    type: "resources",
                    amount: {
                      type: "up-to",
                      amount: 3,
                    },
                  },
                  payer: "controller",
                },
              },
              {
                type: "create-token",
                token: "toughness",
                controller: "controller",
                count: {
                  type: "count",
                  what: "resources-paid-this-way",
                },
              },
            ],
          },
        },
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const noHeroStandsAloneYellow = {
  canonicalId: "FtL6dWRqtnwQzBnQGPRhT",
  slug: "no-hero-stands-alone-yellow",
  layout: {
    kind: "single",
  },
  base: {
    names: ["No Hero Stands Alone"],
    activeFaceIds: ["FtL6dWRqtnwQzBnQGPRhT:face:front"],
    color: "yellow",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Revered"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Revered"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["FtL6dWRqtnwQzBnQGPRhT"],
    numeric: {
      pitch: 2,
      cost: 3,
      power: 6,
      defense: 0,
    },
    keywords: [],
    abilities: [
      {
        kind: "static",
        staticKind: "while",
        condition: {
          type: "performed-this-turn",
          event: "control-toughness",
          player: "controller",
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "modify-numeric",
              property: "defense",
              op: "add",
              amount: 3,
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
            {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: {
                  name: "ambush",
                },
              },
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
          ],
        },
        id: "FtL6dWRqtnwQzBnQGPRhT:anyZoneToughnessTokenTurnGets3DefenseAmbush",
        text: "While this is in any zone, if you've controlled a Toughness token this turn, this gets +3{d} and ambush.\nWhen this defends, clash with the attacking hero. The winner may choose an attacking or defending card to get -3{p} -3{d} this chain link.",
      },
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
        id: "FtL6dWRqtnwQzBnQGPRhT:defendsClashAttackingWinnerChooseAttackingDefendingGet3Power3DefenseChainLink",
        text: "While this is in any zone, if you've controlled a Toughness token this turn, this gets +3{d} and ambush.\nWhen this defends, clash with the attacking hero. The winner may choose an attacking or defending card to get -3{p} -3{d} this chain link.",
        resolution: {
          kind: "effect",
          effect: {
            type: "clash",
            with: {
              selector: "attacking-hero",
            },
            prize: {
              type: "optional",
              effect: {
                type: "sequence",
                steps: [
                  {
                    type: "choose-card",
                    target: {
                      selector: "object",
                      declared: "on-stack",
                      zones: ["combat-chain"],
                      filter: {
                        or: [
                          {
                            hasStatus: "attacking",
                          },
                          {
                            defending: true,
                          },
                        ],
                      },
                      count: 1,
                    },
                    outputBinding: "it",
                  },
                  {
                    type: "modify-numeric",
                    property: "power",
                    op: "subtract",
                    amount: 3,
                    target: {
                      selector: "binding",
                      binding: "it",
                    },
                    duration: "this-chain-link",
                  },
                  {
                    type: "modify-numeric",
                    property: "defense",
                    op: "subtract",
                    amount: 3,
                    target: {
                      selector: "binding",
                      binding: "it",
                    },
                    duration: "this-chain-link",
                  },
                ],
              },
            },
          },
        },
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const tuffnut = {
  canonicalId: "wKnhnNTHKHqFfjgdn9LLP",
  slug: "tuffnut",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Tuffnut"],
    activeFaceIds: ["wKnhnNTHKHqFfjgdn9LLP:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Brute", "Revered"],
        types: ["Hero"],
        subtypes: ["Young"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Brute", "Revered"],
      types: ["Hero"],
      subtypes: ["Young"],
    },
    traits: [],
    textBoxIds: ["wKnhnNTHKHqFfjgdn9LLP"],
    numeric: {
      life: 20,
      intellect: 3,
    },
    keywords: [],
    abilities: [
      {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "tap-self",
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "pitch-card",
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
                  power: {
                    op: "gte",
                    value: 6,
                  },
                },
              },
              then: {
                type: "crowd-cheers",
                target: "controller",
              },
            },
          ],
        },
        id: "wKnhnNTHKHqFfjgdn9LLP:instantTapPitchTopDeck6MorePowerCrowdCheers",
        text: "Instant - {t}: Pitch the top card of your deck. If it has 6 or more {p}, the crowd cheers you.\nWhenever the crowd cheers you, create a Toughness token.",
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
        id: "wKnhnNTHKHqFfjgdn9LLP:wheneverCrowdCheersCreateToughnessToken",
        text: "Instant - {t}: Pitch the top card of your deck. If it has 6 or more {p}, the crowd cheers you.\nWhenever the crowd cheers you, create a Toughness token.",
        resolution: {
          kind: "effect",
          effect: {
            type: "create-token",
            token: "toughness",
            controller: "controller",
          },
        },
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const toughness = {
  canonicalId: "Cn8tK9KRm7d9KbcQk6Pqm",
  slug: "toughness",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Toughness"],
    activeFaceIds: ["Cn8tK9KRm7d9KbcQk6Pqm:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: ["Token"],
        supertypes: [],
        types: ["Token"],
        subtypes: ["Aura"],
      },
    ],
    typeBox: {
      metatypes: ["Token"],
      supertypes: [],
      types: ["Token"],
      subtypes: ["Aura"],
    },
    traits: [],
    textBoxIds: ["Cn8tK9KRm7d9KbcQk6Pqm"],
    numeric: {},
    keywords: [],
    abilities: [
      {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "start-phase",
            actor: {
              kind: "player",
              player: "opponent",
            },
            observes: {
              kind: "none",
            },
          },
        },
        id: "Cn8tK9KRm7d9KbcQk6Pqm:increaseNextActionDefense",
        text: "At the start of your opponent's turn, destroy this, then the next action card you defend with this turn gets +1{d} this chain link.",
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
                property: "defense",
                op: "add",
                amount: 1,
                target: {
                  selector: "this-attack",
                },
                duration: "this-chain-link",
                appliesTo: {
                  next: {
                    typeBox: {
                      types: ["Action"],
                    },
                    defending: true,
                  },
                  events: ["defend"],
                },
              },
            ],
          },
        },
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const boltyn = {
  canonicalId: "Fmf8trg9w8B8BBbWrf8w9",
  slug: "boltyn",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Boltyn"],
    activeFaceIds: ["Fmf8trg9w8B8BBbWrf8w9:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Warrior", "Light"],
        types: ["Hero"],
        subtypes: ["Young"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Warrior", "Light"],
      types: ["Hero"],
      subtypes: ["Young"],
    },
    traits: [],
    textBoxIds: ["Fmf8trg9w8B8BBbWrf8w9"],
    numeric: {
      life: 20,
      intellect: 4,
    },
    keywords: [],
    abilities: [
      {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "performed-this-turn",
          event: "charge",
          player: "controller",
        },
        effect: {
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
              hasStatus: "defended-by-attack-action",
            },
            count: {
              type: "all",
            },
          },
          duration: "while-in-arena",
        },
        id: "Fmf8trg9w8B8BBbWrf8w9:chargedTurnAttacksGet1PowerDefendedAttackAction",
        text: "If you've charged this turn, your attacks get +1{p} while defended by an attack action card.\nAttack Reaction - Banish a card from Boltyn's soul: Target attack with {p} greater than its base {p} gains go again.",
      },
      {
        kind: "activated",
        abilityType: "attack-reaction",
        cost: {
          class: "effect",
          type: "banish",
          from: "soul",
          count: 1,
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
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: {
              and: [
                {
                  hasStatus: "attacking",
                },
                {
                  hasStatus: "power-greater-than-base",
                },
              ],
            },
            count: 1,
          },
          duration: "this-turn",
          outputBinding: "it",
        },
        id: "Fmf8trg9w8B8BBbWrf8w9:attackReactionBanishBoltynsSoulTargetAttackPowerGreaterThanBasePowerGainsGoAgain",
        text: "If you've charged this turn, your attacks get +1{p} while defended by an attack action card.\nAttack Reaction - Banish a card from Boltyn's soul: Target attack with {p} greater than its base {p} gains go again.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const boltOfCourageRed = {
  canonicalId: "qh6Ww9QDjpGFfHG8gJgb7",
  slug: "bolt-of-courage-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Bolt of Courage"],
    activeFaceIds: ["qh6Ww9QDjpGFfHG8gJgb7:face:front"],
    color: "red",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Warrior", "Light"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Warrior", "Light"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["qh6Ww9QDjpGFfHG8gJgb7"],
    numeric: {
      pitch: 1,
      cost: 0,
      power: 3,
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
            type: "charge",
          },
          optional: true,
        },
        label: {
          name: "charge",
        },
        id: "qh6Ww9QDjpGFfHG8gJgb7:charge",
        text: "As an additional cost to play Bolt of Courage, you may charge your hero's soul.\nIf you've charged this turn, Bolt of Courage gains \"If this hits, draw a card.\"",
      },
      {
        kind: "resolution",
        condition: {
          type: "performed-this-turn",
          event: "charge",
          player: "controller",
        },
        effect: {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              kind: "static",
              staticKind: "triggered",
              id: "qh6Ww9QDjpGFfHG8gJgb7:drawOnHitIfCharged:drawCardOnHit",
              text: "As an additional cost to play Bolt of Courage, you may charge your hero's soul.\nIf you've charged this turn, Bolt of Courage gains \"If this hits, draw a card.\"",
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
                  type: "draw",
                  count: 1,
                  player: "controller",
                },
              },
            },
          },
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
        label: {
          name: "charge",
        },
        id: "qh6Ww9QDjpGFfHG8gJgb7:drawOnHitIfCharged",
        text: "As an additional cost to play Bolt of Courage, you may charge your hero's soul.\nIf you've charged this turn, Bolt of Courage gains \"If this hits, draw a card.\"",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const beamingBravadoYellow = {
  canonicalId: "pWf6dmb99RqhghkdKGgT8",
  slug: "beaming-bravado-yellow",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Beaming Bravado"],
    activeFaceIds: ["pWf6dmb99RqhghkdKGgT8:face:front"],
    color: "yellow",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Warrior", "Light"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Warrior", "Light"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["pWf6dmb99RqhghkdKGgT8"],
    numeric: {
      pitch: 2,
      cost: 0,
      power: 2,
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
            type: "charge",
          },
          optional: true,
        },
        label: {
          name: "charge",
        },
        id: "pWf6dmb99RqhghkdKGgT8:additionalCostStatic",
        text: "As an additional cost to play this, you may charge your hero's soul.\nIf a yellow card is charged this way, this gets +1{p}",
      },
      {
        kind: "resolution",
        condition: {
          type: "binding-matches",
          binding: "chargedCard",
          filter: {
            color: ["yellow"],
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
          name: "charge",
        },
        id: "pWf6dmb99RqhghkdKGgT8:modifyNumericPower",
        text: "As an additional cost to play this, you may charge your hero's soul.\nIf a yellow card is charged this way, this gets +1{p}",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const battlefieldBlitzYellow = {
  canonicalId: "Wg7zz9866gDH6BmjMNGd8",
  slug: "battlefield-blitz-yellow",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Battlefield Blitz"],
    activeFaceIds: ["Wg7zz9866gDH6BmjMNGd8:face:front"],
    color: "yellow",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Warrior", "Light"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Warrior", "Light"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["Wg7zz9866gDH6BmjMNGd8"],
    numeric: {
      pitch: 2,
      cost: 1,
      power: 4,
      defense: 3,
    },
    keywords: [],
    abilities: [
      {
        kind: "resolution",
        condition: {
          type: "performed-this-turn",
          event: "charge",
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
        id: "Wg7zz9866gDH6BmjMNGd8:grantProperty",
        text: "If you've charged this turn, Battlefield Blitz gains go again.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const battlefieldBeaconYellow = {
  canonicalId: "pNc7mQN79mQRRB86pnwGt",
  slug: "battlefield-beacon-yellow",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Battlefield Beacon"],
    activeFaceIds: ["pNc7mQN79mQRRB86pnwGt:face:front"],
    color: "yellow",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Warrior", "Light"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Warrior", "Light"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["pNc7mQN79mQRRB86pnwGt"],
    numeric: {
      pitch: 2,
      cost: 0,
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
        id: "pNc7mQN79mQRRB86pnwGt:whenAttacksChoose1EachVeBanishedFromSoul",
        text: "When this attacks, choose 1 for each card you've banished from your soul this combat chain. You may choose the same mode up to 3 times;\n- Create a Courage token.\n- Create a Toughness token.\n- Create a Vigor token.",
        resolution: {
          kind: "modal",
          choose: {
            type: "count",
            what: "cards-banished-from-soul-this-combat-chain",
          },
          allowRepeat: true,
          modes: [
            {
              kind: "resolution",
              effect: {
                type: "create-token",
                token: "courage",
                controller: "controller",
              },
              id: "pNc7mQN79mQRRB86pnwGt:whenAttacksChoose1EachVeBanishedFromSoul:createCourageToken",
              text: "Create Courage Token",
            },
            {
              kind: "resolution",
              effect: {
                type: "create-token",
                token: "toughness",
                controller: "controller",
              },
              id: "pNc7mQN79mQRRB86pnwGt:whenAttacksChoose1EachVeBanishedFromSoul:createToughnessToken",
              text: "Create Toughness Token",
            },
            {
              kind: "resolution",
              effect: {
                type: "create-token",
                token: "vigor",
                controller: "controller",
              },
              id: "pNc7mQN79mQRRB86pnwGt:whenAttacksChoose1EachVeBanishedFromSoul:createVigorToken",
              text: "Create Vigor Token",
            },
          ],
        },
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const expressLightningYellow = {
  canonicalId: "DCdPb6ccGkkjwDprnLRPF",
  slug: "express-lightning-yellow",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Express Lightning"],
    activeFaceIds: ["DCdPb6ccGkkjwDprnLRPF:face:front"],
    color: "yellow",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Warrior", "Light"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Warrior", "Light"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["DCdPb6ccGkkjwDprnLRPF"],
    numeric: {
      pitch: 2,
      cost: 0,
      power: 3,
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
            type: "charge",
          },
          optional: true,
        },
        label: {
          name: "charge",
        },
        id: "DCdPb6ccGkkjwDprnLRPF:additionalCostStatic",
        text: "As an additional cost to play Express Lightning, you may charge your hero's soul.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const illuminateYellow = {
  canonicalId: "mqMmPJg9kbn7gBJfzkwqH",
  slug: "illuminate-yellow",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Illuminate"],
    activeFaceIds: ["mqMmPJg9kbn7gBJfzkwqH:face:front"],
    color: "yellow",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Light"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Light"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["mqMmPJg9kbn7gBJfzkwqH"],
    numeric: {
      pitch: 2,
      cost: 0,
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
        id: "mqMmPJg9kbn7gBJfzkwqH:triggeredHitMoveCard",
        text: "If Illuminate hits, put it into your hero's soul.",
        resolution: {
          kind: "effect",
          effect: {
            type: "move-card",
            target: {
              selector: "self",
            },
            to: {
              zone: "soul",
            },
          },
        },
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const takeFlightYellow = {
  canonicalId: "nQ8twtLDzDb9JFmDCdG7j",
  slug: "take-flight-yellow",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Take Flight"],
    activeFaceIds: ["nQ8twtLDzDb9JFmDCdG7j:face:front"],
    color: "yellow",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Warrior", "Light"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Warrior", "Light"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["nQ8twtLDzDb9JFmDCdG7j"],
    numeric: {
      pitch: 2,
      cost: 1,
      power: 3,
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
            type: "charge",
          },
          optional: true,
        },
        label: {
          name: "charge",
        },
        id: "nQ8twtLDzDb9JFmDCdG7j:playUndefined",
        text: "As an additional cost to play Take Flight, you may charge your hero's soul.\nIf you've charged this turn, Take Flight gains go again.",
      },
      {
        kind: "resolution",
        condition: {
          type: "performed-this-turn",
          event: "charge",
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
        label: {
          name: "charge",
        },
        id: "nQ8twtLDzDb9JFmDCdG7j:resolutionGrantProperty",
        text: "As an additional cost to play Take Flight, you may charge your hero's soul.\nIf you've charged this turn, Take Flight gains go again.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const courageOfBladehold = {
  canonicalId: "cH7LdkrKdFnjP7PLwFDhD",
  slug: "courage-of-bladehold",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Courage of Bladehold"],
    activeFaceIds: ["cH7LdkrKdFnjP7PLwFDhD:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Warrior"],
        types: ["Equipment"],
        subtypes: ["Chest"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Warrior"],
      types: ["Equipment"],
      subtypes: ["Chest"],
    },
    traits: [],
    textBoxIds: ["cH7LdkrKdFnjP7PLwFDhD"],
    numeric: {
      defense: 2,
    },
    keywords: [
      {
        name: "temper",
      },
    ],
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
          type: "modify-activation-cost",
          op: "subtract",
          amount: 1,
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: {
            next: {
              typeBox: {
                subtypes: ["Sword"],
              },
            },
            count: 32,
            events: ["activate"],
          },
        },
        id: "cH7LdkrKdFnjP7PLwFDhD:actionDestroyCourageBladeholdSwordAttacksCostLessTurn",
        text: "Action - Destroy Courage of Bladehold: Your sword attacks cost {r} less this turn. Go again\nTemper",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const courageousSteelhandRed = {
  canonicalId: "BtzBqJcHbCptkMJMBchgQ",
  slug: "courageous-steelhand-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Courageous Steelhand"],
    activeFaceIds: ["BtzBqJcHbCptkMJMBchgQ:face:front"],
    color: "red",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Warrior", "Light"],
        types: ["Attack Reaction"],
        subtypes: [],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Warrior", "Light"],
      types: ["Attack Reaction"],
      subtypes: [],
    },
    traits: [],
    textBoxIds: ["BtzBqJcHbCptkMJMBchgQ"],
    numeric: {
      pitch: 1,
      cost: 0,
      defense: 2,
    },
    keywords: [],
    abilities: [
      {
        kind: "resolution",
        condition: {
          type: "performed-this-turn",
          event: "charge",
          player: "controller",
        },
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
                subtypes: ["Attack"],
              },
            },
            count: 1,
          },
          duration: "this-turn",
          outputBinding: "it",
        },
        id: "BtzBqJcHbCptkMJMBchgQ:chargedBoost",
        text: "If you've charged this turn, target attack gains +3{p}.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const cintariSaber = {
  canonicalId: "PpwQBBjqmBbgBrKMPbbBr",
  slug: "cintari-saber",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Cintari Saber"],
    activeFaceIds: ["PpwQBBjqmBbgBrKMPbbBr:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Warrior"],
        types: ["Weapon"],
        subtypes: ["1H", "Sword"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Warrior"],
      types: ["Weapon"],
      subtypes: ["1H", "Sword"],
    },
    traits: [],
    textBoxIds: ["PpwQBBjqmBbgBrKMPbbBr"],
    numeric: {
      power: 2,
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
          amount: 1,
        },
        effect: {
          type: "attack-with",
          target: {
            selector: "self",
          },
        },
        id: "PpwQBBjqmBbgBrKMPbbBr:oncePerTurnActionResourceAttack",
        text: "Once per Turn Action - {r}: Attack\nWhenever Cintari Saber is defended by 1 or more attack action cards, it gains +1{p} until end of turn.",
      },
      {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "defend",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "event-object",
              selector: "defender",
              relationship: {
                kind: "any",
              },
              filter: {
                typeBox: {
                  types: ["Action"],
                  subtypes: ["Attack"],
                },
              },
            },
            amount: {
              op: "gte",
              value: 1,
            },
          },
        },
        id: "PpwQBBjqmBbgBrKMPbbBr:wheneverCintariSaberDefended1MoreAttackActionGains1PowerEndTurn",
        text: "Once per Turn Action - {r}: Attack\nWhenever Cintari Saber is defended by 1 or more attack action cards, it gains +1{p} until end of turn.",
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
} as const satisfies FleshAndBloodCard;

export const engulfingLightRed = {
  canonicalId: "kpbCBbCmP8KqqggdhPRtj",
  slug: "engulfing-light-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Engulfing Light"],
    activeFaceIds: ["kpbCBbCmP8KqqggdhPRtj:face:front"],
    color: "red",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Warrior", "Light"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Warrior", "Light"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["kpbCBbCmP8KqqggdhPRtj"],
    numeric: {
      pitch: 1,
      cost: 0,
      power: 3,
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
            type: "charge",
          },
          optional: true,
        },
        label: {
          name: "charge",
        },
        id: "kpbCBbCmP8KqqggdhPRtj:charge",
        text: "As an additional cost to play Engulfing Light, you may charge your hero's soul.\nIf you've charged this turn, Engulfing Light gains \"If this hits, put it into your hero's soul.\"",
      },
      {
        kind: "resolution",
        condition: {
          type: "performed-this-turn",
          event: "charge",
          player: "controller",
        },
        effect: {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              kind: "static",
              staticKind: "triggered",
              id: "kpbCBbCmP8KqqggdhPRtj:moveToSoulOnHitIfCharged:moveToSoulOnHit",
              text: "As an additional cost to play Engulfing Light, you may charge your hero's soul.\nIf you've charged this turn, Engulfing Light gains \"If this hits, put it into your hero's soul.\"",
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
                  type: "move-card",
                  target: {
                    selector: "self",
                  },
                  to: {
                    zone: "soul",
                  },
                },
              },
            },
          },
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
        label: {
          name: "charge",
        },
        id: "kpbCBbCmP8KqqggdhPRtj:moveToSoulOnHitIfCharged",
        text: "As an additional cost to play Engulfing Light, you may charge your hero's soul.\nIf you've charged this turn, Engulfing Light gains \"If this hits, put it into your hero's soul.\"",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const engulfingLightYellow = {
  canonicalId: "tf7BQQcnH9LR6jFQTKJrC",
  slug: "engulfing-light-yellow",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Engulfing Light"],
    activeFaceIds: ["tf7BQQcnH9LR6jFQTKJrC:face:front"],
    color: "yellow",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Warrior", "Light"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Warrior", "Light"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["tf7BQQcnH9LR6jFQTKJrC"],
    numeric: {
      pitch: 2,
      cost: 0,
      power: 2,
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
            type: "charge",
          },
          optional: true,
        },
        label: {
          name: "charge",
        },
        id: "tf7BQQcnH9LR6jFQTKJrC:charge",
        text: "As an additional cost to play Engulfing Light, you may charge your hero's soul.\nIf you've charged this turn, Engulfing Light gains \"If this hits, put it into your hero's soul.\"",
      },
      {
        kind: "resolution",
        condition: {
          type: "performed-this-turn",
          event: "charge",
          player: "controller",
        },
        effect: {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              kind: "static",
              staticKind: "triggered",
              id: "tf7BQQcnH9LR6jFQTKJrC:moveToSoulOnHitIfCharged:moveToSoulOnHit",
              text: "As an additional cost to play Engulfing Light, you may charge your hero's soul.\nIf you've charged this turn, Engulfing Light gains \"If this hits, put it into your hero's soul.\"",
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
                  type: "move-card",
                  target: {
                    selector: "self",
                  },
                  to: {
                    zone: "soul",
                  },
                },
              },
            },
          },
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
        label: {
          name: "charge",
        },
        id: "tf7BQQcnH9LR6jFQTKJrC:moveToSoulOnHitIfCharged",
        text: "As an additional cost to play Engulfing Light, you may charge your hero's soul.\nIf you've charged this turn, Engulfing Light gains \"If this hits, put it into your hero's soul.\"",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const luminaAscensionYellow = {
  canonicalId: "L8wq9HzdqTwM8tLWCRGcR",
  slug: "lumina-ascension-yellow",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Lumina Ascension"],
    activeFaceIds: ["L8wq9HzdqTwM8tLWCRGcR:face:front"],
    color: "yellow",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Warrior", "Light"],
        types: ["Action"],
        subtypes: [],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Warrior", "Light"],
      types: ["Action"],
      subtypes: [],
    },
    traits: [],
    textBoxIds: ["L8wq9HzdqTwM8tLWCRGcR"],
    numeric: {
      pitch: 2,
      cost: 0,
      defense: 3,
    },
    keywords: [
      {
        name: "specialization",
        hero: "Boltyn",
      },
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
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["weapon"],
                filter: {
                  typeBox: {
                    types: ["Weapon"],
                  },
                },
                count: {
                  type: "all",
                },
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
                  id: "L8wq9HzdqTwM8tLWCRGcR:endTurnWeaponsGain1PowerHitsRevealTopDeckLightPutHerosSoulGain1LifeOtherwisePutBottomDeck:hitsRevealTopDeckLightPutHerosSoulGain1LifeOtherwisePutBottomDeck",
                  text: "Boltyn Specialization\nUntil end of turn, weapons you control gain +1{p} and \"If this hits, reveal the top card of your deck. If it's a Light card, put it into your hero's soul and gain 1{h}, otherwise put it on the bottom of your deck.\"\nIf you've charged this turn, you may attack an additional time with each weapon you control.\nGo again",
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
                                supertypes: ["Light"],
                              },
                            },
                          },
                          then: {
                            type: "sequence",
                            steps: [
                              {
                                type: "move-card",
                                target: {
                                  selector: "binding",
                                  binding: "it",
                                },
                                to: {
                                  zone: "soul",
                                },
                              },
                              {
                                type: "gain-life",
                                amount: 1,
                                target: {
                                  selector: "controller",
                                },
                              },
                            ],
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
              },
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["weapon"],
                filter: {
                  typeBox: {
                    types: ["Weapon"],
                  },
                },
                count: {
                  type: "all",
                },
              },
              duration: "this-turn",
            },
          ],
        },
        id: "L8wq9HzdqTwM8tLWCRGcR:endTurnWeaponsGain1PowerHitsRevealTopDeckLightPutHerosSoulGain1LifeOtherwisePutBottomDeck",
        text: "Boltyn Specialization\nUntil end of turn, weapons you control gain +1{p} and \"If this hits, reveal the top card of your deck. If it's a Light card, put it into your hero's soul and gain 1{h}, otherwise put it on the bottom of your deck.\"\nIf you've charged this turn, you may attack an additional time with each weapon you control.\nGo again",
      },
      {
        kind: "resolution",
        condition: {
          type: "performed-this-turn",
          event: "charge",
          player: "controller",
        },
        effect: {
          type: "optional",
          effect: {
            type: "modify-activation-limit",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["weapon"],
              count: {
                type: "all",
              },
            },
            operation: "additional",
            count: 1,
            duration: "this-turn",
          },
        },
        id: "L8wq9HzdqTwM8tLWCRGcR:chargedTurnAttackAdditionalTimeWeapon",
        text: "Boltyn Specialization\nUntil end of turn, weapons you control gain +1{p} and \"If this hits, reveal the top card of your deck. If it's a Light card, put it into your hero's soul and gain 1{h}, otherwise put it on the bottom of your deck.\"\nIf you've charged this turn, you may attack an additional time with each weapon you control.\nGo again",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const serBoltynBreakerOfDawn = {
  canonicalId: "QrKGJL7bHCFKbr9N9MNpm",
  slug: "ser-boltyn-breaker-of-dawn",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Ser Boltyn, Breaker of Dawn"],
    activeFaceIds: ["QrKGJL7bHCFKbr9N9MNpm:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Warrior", "Light"],
        types: ["Hero"],
        subtypes: [],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Warrior", "Light"],
      types: ["Hero"],
      subtypes: [],
    },
    traits: [],
    textBoxIds: ["QrKGJL7bHCFKbr9N9MNpm"],
    numeric: {
      life: 40,
      intellect: 4,
    },
    keywords: [],
    abilities: [
      {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "performed-this-turn",
          event: "charge",
          player: "controller",
        },
        effect: {
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
              hasStatus: "defended-by-attack-action",
            },
            count: {
              type: "all",
            },
          },
          duration: "while-in-arena",
        },
        id: "QrKGJL7bHCFKbr9N9MNpm:chargedTurnAttacksGet1PowerDefendedAttackAction",
        text: "If you've charged this turn, your attacks get +1{p} while defended by an attack action card.\nAttack Reaction - Banish a card from Boltyn's soul: Target attack with {p} greater than its base {p} gains go again.",
      },
      {
        kind: "activated",
        abilityType: "attack-reaction",
        cost: {
          class: "effect",
          type: "banish",
          from: "soul",
          count: 1,
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
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: {
              and: [
                {
                  hasStatus: "attacking",
                },
                {
                  hasStatus: "power-greater-than-base",
                },
              ],
            },
            count: 1,
          },
          duration: "this-turn",
          outputBinding: "it",
        },
        id: "QrKGJL7bHCFKbr9N9MNpm:attackReactionBanishBoltynsSoulTargetAttackPowerGreaterThanBasePowerGainsGoAgain",
        text: "If you've charged this turn, your attacks get +1{p} while defended by an attack action card.\nAttack Reaction - Banish a card from Boltyn's soul: Target attack with {p} greater than its base {p} gains go again.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const snapdragonScalers = {
  canonicalId: "gGmbgrQrzhKpFdtcRTF9h",
  slug: "snapdragon-scalers",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Snapdragon Scalers"],
    activeFaceIds: ["gGmbgrQrzhKpFdtcRTF9h:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: [],
        supertypes: [],
        types: ["Equipment"],
        subtypes: ["Legs"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: [],
      types: ["Equipment"],
      subtypes: ["Legs"],
    },
    traits: [],
    textBoxIds: ["gGmbgrQrzhKpFdtcRTF9h"],
    numeric: {
      defense: 0,
    },
    keywords: [],
    abilities: [
      {
        kind: "activated",
        abilityType: "attack-reaction",
        cost: {
          class: "effect",
          type: "destroy-self",
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
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: {
              cost: {
                op: "lte",
                value: 1,
              },
              typeBox: {
                types: ["Action"],
                subtypes: ["Attack"],
              },
            },
            count: 1,
          },
          duration: "this-turn",
          outputBinding: "it",
        },
        id: "gGmbgrQrzhKpFdtcRTF9h:attackReactionDestroyTargetAttackActionCost1Less",
        text: "Attack Reaction - Destroy this: Target attack action card with cost 1 or less gets go again.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const nimblismBlue = {
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
} as const satisfies FleshAndBloodCard;

export const spireSnipingRed = {
  canonicalId: "Ngbkbt7KfrCHnQkTPJRb8",
  slug: "spire-sniping-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Spire Sniping"],
    activeFaceIds: ["Ngbkbt7KfrCHnQkTPJRb8:face:front"],
    color: "red",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Ranger"],
        types: ["Action"],
        subtypes: ["Arrow", "Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Ranger"],
      types: ["Action"],
      subtypes: ["Arrow", "Attack"],
    },
    traits: [],
    textBoxIds: ["Ngbkbt7KfrCHnQkTPJRb8"],
    numeric: {
      pitch: 1,
      cost: 1,
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
            kind: "any-of",
            patterns: [
              {
                name: "move-zone",
                actor: {
                  kind: "any",
                },
                observes: {
                  kind: "event-object",
                  selector: "moved-object",
                  relationship: {
                    kind: "any",
                  },
                  filter: {
                    hasStatus: "face-up",
                  },
                  bindAs: "it",
                },
                to: "arsenal",
              },
              {
                name: "turn-face-up",
                actor: {
                  kind: "any",
                },
                observes: {
                  kind: "source",
                  selector: "object",
                },
              },
            ],
          },
        },
        id: "Ngbkbt7KfrCHnQkTPJRb8:triggeredStaticEffect",
        text: "When Spire Sniping is put or turned face up in arsenal, look at the top 2 cards of your deck, then put them back in any order.",
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
                  count: 2,
                },
                outputBinding: "them",
              },
              {
                type: "reorder-deck",
                target: {
                  selector: "binding",
                  binding: "them",
                },
                position: "top",
              },
            ],
          },
        },
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const barbedCastaway = {
  canonicalId: "jPfMCnKDptNbCbp6T96dT",
  slug: "barbed-castaway",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Barbed Castaway"],
    activeFaceIds: ["jPfMCnKDptNbCbp6T96dT:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Ranger"],
        types: ["Weapon"],
        subtypes: ["2H", "Bow"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Ranger"],
      types: ["Weapon"],
      subtypes: ["2H", "Bow"],
    },
    traits: [],
    textBoxIds: ["jPfMCnKDptNbCbp6T96dT"],
    numeric: {},
    keywords: [],
    abilities: [
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
          amount: 1,
        },
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
        id: "jPfMCnKDptNbCbp6T96dT:oncePerTurnInstantResourcePutArrowHandFaceUpArsenal",
        text: "Once per Turn Instant - {r}: You may put an arrow card from your hand face up into your arsenal.\nOnce per Turn Instant - {r}: You may turn a face down arrow in your arsenal face up. If you do, put an aim counter on it.",
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
          amount: 1,
        },
        effect: {
          type: "optional",
          effect: {
            type: "turn-face-up",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["arsenal"],
              filter: {
                hasStatus: "face-down",
                typeBox: {
                  subtypes: ["Arrow"],
                },
              },
              count: 1,
            },
            outputBinding: "it",
          },
          then: {
            type: "add-counter",
            counter: {
              kind: "named",
              name: "aim",
            },
            count: 1,
            target: {
              selector: "binding",
              binding: "it",
            },
          },
        },
        id: "jPfMCnKDptNbCbp6T96dT:oncePerTurnInstantResourceTurnFaceDownArrowArsenalFaceUpPutAimCounter",
        text: "Once per Turn Instant - {r}: You may put an arrow card from your hand face up into your arsenal.\nOnce per Turn Instant - {r}: You may turn a face down arrow in your arsenal face up. If you do, put an aim counter on it.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const sutcliffeSResearchNotesRed = {
  canonicalId: "QQMpBBLgqWwtCHqdfRBkR",
  slug: "sutcliffe-s-research-notes-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Sutcliffe's Research Notes"],
    activeFaceIds: ["QQMpBBLgqWwtCHqdfRBkR:face:front"],
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
    textBoxIds: ["QQMpBBLgqWwtCHqdfRBkR"],
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
        kind: "resolution",
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
                count: 3,
              },
              outputBinding: "them",
            },
            {
              type: "create-token",
              token: "runechant",
              controller: "controller",
              count: {
                type: "count",
                what: "revealed-this-way",
                filter: {
                  and: [
                    {
                      typeBox: {
                        supertypes: ["Runeblade"],
                      },
                    },
                    {
                      typeBox: {
                        subtypes: ["Attack"],
                      },
                    },
                    {
                      typeBox: {},
                    },
                  ],
                },
              },
            },
            {
              type: "reorder-deck",
              target: {
                selector: "binding",
                binding: "them",
              },
              position: "top",
            },
          ],
        },
        id: "QQMpBBLgqWwtCHqdfRBkR:resolutionSequence",
        text: "Reveal the top 3 cards of your deck. Create a Runechant token for each Runeblade attack action card revealed this way, then put the cards on top of your deck in any order.\nGo again",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const coerciveTendencyBlue = {
  canonicalId: "KP7QFDQPWfTW9DwmgBJq9",
  slug: "coercive-tendency-blue",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Coercive Tendency"],
    activeFaceIds: ["KP7QFDQPWfTW9DwmgBJq9:face:front"],
    color: "blue",
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
    textBoxIds: ["KP7QFDQPWfTW9DwmgBJq9"],
    numeric: {
      pitch: 3,
      cost: 0,
      defense: 3,
    },
    keywords: [
      {
        name: "specialization",
        hero: "Arakni",
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
                player: "defending-hero",
                zones: ["deck"],
                position: "top",
                count: 3,
              },
              outputBinding: "them",
            },
            {
              type: "reorder-deck",
              target: {
                selector: "binding",
                binding: "them",
              },
              position: "top",
            },
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
              outputBinding: "banished",
            },
            {
              type: "conditional",
              condition: {
                type: "binding-numeric",
                binding: "completed-contract-this-way",
                comparison: {
                  op: "eq",
                  value: 1,
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
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["combat-chain"],
                  filter: {
                    typeBox: {
                      supertypes: ["Assassin"],
                    },
                  },
                  count: {
                    type: "all",
                  },
                },
                duration: "this-combat-chain",
              },
            },
          ],
        },
        id: "KP7QFDQPWfTW9DwmgBJq9:reorderAndBanishTopCard",
        text: "Arakni Specialization\nLook at the top 3 cards of the defending hero's deck. Put them back in any order, then banish the top card of their deck.\nIf you complete a contract this way, your Assassin attacks get go again this combat chain.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const arakni = {
  canonicalId: "9F7RHWjLgCDRqwMww99GN",
  slug: "arakni",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Arakni"],
    activeFaceIds: ["9F7RHWjLgCDRqwMww99GN:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Assassin"],
        types: ["Hero"],
        subtypes: ["Young"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Assassin"],
      types: ["Hero"],
      subtypes: ["Young"],
    },
    traits: [],
    textBoxIds: ["9F7RHWjLgCDRqwMww99GN"],
    numeric: {
      life: 20,
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
                hasLabel: "contract",
              },
            },
          },
        },
        id: "9F7RHWjLgCDRqwMww99GN:wheneverPlayContractLookTopTargetOpponentsDeckPutBottom",
        text: "Whenever you play a card with contract, you may look at the top card of target opponent's deck. You may put it on the bottom.",
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "look",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              outputBinding: "it",
            },
            then: {
              type: "optional",
              effect: {
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
          },
        },
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const malignRed = {
  canonicalId: "dhMB8PhdHndJLzwgtF9t7",
  slug: "malign-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Malign"],
    activeFaceIds: ["dhMB8PhdHndJLzwgtF9t7:face:front"],
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
    textBoxIds: ["dhMB8PhdHndJLzwgtF9t7"],
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
        staticKind: "continuous",
        effect: {
          type: "rule-modification",
          mode: "restrict",
          action: "be-prevented",
          subject: {
            name: "Malign",
          },
          duration: "permanent",
        },
        id: "dhMB8PhdHndJLzwgtF9t7:continuousRuleModificationRestrictBePreventedMalignPermanent",
        text: "Stealth\nDamage that would be dealt by Malign can't be prevented.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const azaleaAceInTheHole = {
  canonicalId: "PTFnJCdhWD9cFgMMNPqQj",
  slug: "azalea-ace-in-the-hole",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Azalea, Ace in the Hole"],
    activeFaceIds: ["PTFnJCdhWD9cFgMMNPqQj:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Ranger"],
        types: ["Hero"],
        subtypes: [],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Ranger"],
      types: ["Hero"],
      subtypes: [],
    },
    traits: [],
    textBoxIds: ["PTFnJCdhWD9cFgMMNPqQj"],
    numeric: {
      life: 40,
      intellect: 4,
    },
    keywords: [],
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
        layerKeywords: [
          {
            name: "go-again",
          },
        ],
        effect: {
          type: "if-you-do",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["arsenal"],
              count: 1,
            },
            to: {
              zone: "deck",
              position: "bottom",
            },
          },
          then: {
            type: "sequence",
            steps: [
              {
                type: "move-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["deck"],
                  position: "top",
                  count: 1,
                },
                to: {
                  zone: "arsenal",
                  visibility: "face-up",
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
                      subtypes: ["Arrow"],
                    },
                  },
                },
                then: {
                  type: "grant-property",
                  property: {
                    kind: "keyword",
                    keyword: {
                      name: "dominate",
                    },
                  },
                  target: {
                    selector: "binding",
                    binding: "it",
                  },
                  duration: "this-turn",
                },
              },
            ],
          },
        },
        id: "PTFnJCdhWD9cFgMMNPqQj:oncePerTurnAction0PutArsenalBottomDeckPutTopDeckFaceUpArsenalArrowGainsDominateEndTurnGoAgain",
        text: "Once per Turn Action - 0: Put a card from your arsenal on the bottom of your deck. If you do, put the top card of your deck face up into your arsenal. If it's an arrow card, it gains dominate until end of turn. Go again",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const becomeTheBottleRed = {
  canonicalId: "HfC6DCG8tfLwCTmzrwfzt",
  slug: "become-the-bottle-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Become the Bottle"],
    activeFaceIds: ["HfC6DCG8tfLwCTmzrwfzt:face:front"],
    color: "red",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Ninja"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Ninja"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["HfC6DCG8tfLwCTmzrwfzt"],
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
        id: "HfC6DCG8tfLwCTmzrwfzt:onAttackGrantProperty",
        text: "When this attacks, choose a card on the combat chain. This gets the chosen card's name.\nGo again",
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "choose-card",
                target: {
                  selector: "object",
                  declared: "on-stack",
                  zones: ["combat-chain"],
                  count: 1,
                },
              },
              {
                type: "grant-property",
                property: {
                  kind: "name",
                  value: "chosen",
                },
                target: {
                  selector: "self",
                },
                duration: "this-combat-chain",
              },
            ],
          },
        },
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const crouchingTiger = {
  canonicalId: "fw9LtHDQTMHgTrdcK9gP6",
  slug: "crouching-tiger",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Crouching Tiger"],
    activeFaceIds: ["fw9LtHDQTMHgTrdcK9gP6:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Ninja"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Ninja"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["fw9LtHDQTMHgTrdcK9gP6"],
    numeric: {
      cost: 0,
      power: 0,
    },
    keywords: [
      {
        name: "ephemeral",
      },
      {
        name: "go-again",
      },
    ],
    abilities: [],
  },
} as const satisfies FleshAndBloodCard;

export const surgingStrikeRed = {
  canonicalId: "GqNTpPW79fHNzj7kB8Kkb",
  slug: "surging-strike-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Surging Strike"],
    activeFaceIds: ["GqNTpPW79fHNzj7kB8Kkb:face:front"],
    color: "red",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Ninja"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Ninja"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["GqNTpPW79fHNzj7kB8Kkb"],
    numeric: {
      pitch: 1,
      cost: 2,
      power: 5,
      defense: 2,
    },
    keywords: [
      {
        name: "go-again",
      },
    ],
    abilities: [],
  },
} as const satisfies FleshAndBloodCard;

export const gustwaveOfTheSecondWindRed = {
  canonicalId: "NCG7Gj8FnzJfDbmHQF6gF",
  slug: "gustwave-of-the-second-wind-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Gustwave of the Second Wind"],
    activeFaceIds: ["NCG7Gj8FnzJfDbmHQF6gF:face:front"],
    color: "red",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Ninja"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Ninja"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["NCG7Gj8FnzJfDbmHQF6gF"],
    numeric: {
      pitch: 1,
      cost: 0,
      power: 4,
      defense: 3,
    },
    keywords: [
      {
        name: "combo",
      },
    ],
    abilities: [
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
        label: {
          name: "combo",
          params: {
            names: ["Surging Strike"],
          },
        },
        id: "NCG7Gj8FnzJfDbmHQF6gF:surgingStrikeComboGoAgain",
        text: "Combo - If Surging Strike was the last attack this combat chain, this gets go again.",
        condition: {
          type: "last-attack-this-combat-chain",
          names: ["Surging Strike"],
        },
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const retraceThePastBlue = {
  canonicalId: "RTbHRmf96T8Pz7MD7KLc7",
  slug: "retrace-the-past-blue",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Retrace the Past"],
    activeFaceIds: ["RTbHRmf96T8Pz7MD7KLc7:face:front"],
    color: "blue",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Ninja"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Ninja"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["RTbHRmf96T8Pz7MD7KLc7"],
    numeric: {
      pitch: 3,
      cost: 0,
      power: 2,
      defense: 3,
    },
    keywords: [
      {
        name: "specialization",
        hero: "Katsu",
      },
      {
        name: "combo",
      },
    ],
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
          },
          state: {
            type: "last-attack-this-combat-chain",
            nameIncludes: ["Gustwave"],
          },
        },
        label: {
          name: "combo",
          params: {
            names: ["*Gustwave*"],
          },
        },
        id: "RTbHRmf96T8Pz7MD7KLc7:attacksGustwaveNameLastAttackCombatChainNameThenGetsName2PowerGoAgain",
        text: "Katsu Specialization\nCombo - When this attacks, if a card with Gustwave in its name was the last attack this combat chain, name a card, then this gets that name, +2{p}, and go again.",
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "name-card",
                suggestions: ["your-hand"],
              },
              {
                type: "sequence",
                steps: [
                  {
                    type: "grant-property",
                    property: {
                      kind: "name",
                      value: "chosen",
                    },
                    target: {
                      selector: "self",
                    },
                    duration: "permanent",
                  },
                  {
                    type: "modify-numeric",
                    property: "power",
                    op: "add",
                    amount: 2,
                    target: {
                      selector: "self",
                    },
                    duration: "permanent",
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
                    duration: "permanent",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const tigrineReflexRed = {
  canonicalId: "DmG6qBFhfRpqfBGbC8dnG",
  slug: "tigrine-reflex-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Tigrine Reflex"],
    activeFaceIds: ["DmG6qBFhfRpqfBGbC8dnG:face:front"],
    color: "red",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Ninja"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Ninja"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["DmG6qBFhfRpqfBGbC8dnG"],
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
      {
        name: "combo",
      },
    ],
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
                selector: "self",
              },
              duration: "permanent",
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
              duration: "permanent",
            },
          ],
        },
        label: {
          name: "combo",
          params: {
            names: ["Crouching Tiger"],
          },
        },
        id: "DmG6qBFhfRpqfBGbC8dnG:comboStatic",
        text: "Combo - If Crouching Tiger was the last attack this combat chain, this gets +1{p} and go again.\nAttack Reaction - Discard this: Target Ninja attack gets +1{p}. Create a Crouching Tiger in your hand.",
        condition: {
          type: "last-attack-this-combat-chain",
          names: ["Crouching Tiger"],
        },
      },
      {
        kind: "activated",
        abilityType: "attack-reaction",
        cost: {
          class: "effect",
          type: "discard-self",
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
                selector: "object",
                declared: "on-stack",
                zones: ["combat-chain"],
                filter: {
                  typeBox: {
                    supertypes: ["Ninja"],
                  },
                },
                count: 1,
              },
              duration: "this-turn",
              outputBinding: "it",
            },
            {
              type: "create-token",
              token: "crouching-tiger",
              controller: "controller",
              to: {
                zone: "hand",
              },
            },
          ],
        },
        id: "DmG6qBFhfRpqfBGbC8dnG:attackReactionDiscardNinjaAttackGetsNumber1PowerCreateCrouchingTigerIn",
        text: "Combo - If Crouching Tiger was the last attack this combat chain, this gets +1{p} and go again.\nAttack Reaction - Discard this: Target Ninja attack gets +1{p}. Create a Crouching Tiger in your hand.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const whelmingGustwaveRed = {
  canonicalId: "zgP9HWNCqbrQPLMNP8Bwf",
  slug: "whelming-gustwave-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Whelming Gustwave"],
    activeFaceIds: ["zgP9HWNCqbrQPLMNP8Bwf:face:front"],
    color: "red",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Ninja"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Ninja"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["zgP9HWNCqbrQPLMNP8Bwf"],
    numeric: {
      pitch: 1,
      cost: 0,
      power: 3,
      defense: 3,
    },
    keywords: [
      {
        name: "combo",
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
            {
              type: "grant-property",
              property: {
                kind: "ability",
                ability: {
                  kind: "static",
                  staticKind: "triggered",
                  id: "zgP9HWNCqbrQPLMNP8Bwf:comboResolution:triggeredStaticOnHitEffect",
                  text: 'Combo - If Surging Strike was the last attack this combat chain, this has "When this hits, draw a card."',
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
                      type: "draw",
                      count: 1,
                      player: "controller",
                    },
                  },
                },
              },
              target: {
                selector: "self",
              },
              duration: "this-turn",
            },
          ],
        },
        label: {
          name: "combo",
          params: {
            names: ["Surging Strike"],
          },
        },
        id: "zgP9HWNCqbrQPLMNP8Bwf:comboResolution",
        text: 'Combo - If Surging Strike was the last attack this combat chain, this has "When this hits, draw a card."',
        condition: {
          type: "last-attack-this-combat-chain",
          names: ["Surging Strike"],
        },
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const iraCrimsonHaze = {
  canonicalId: "GCRQMpBtqBHWrk68GqnGP",
  slug: "ira-crimson-haze",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Ira, Crimson Haze"],
    activeFaceIds: ["GCRQMpBtqBHWrk68GqnGP:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Ninja"],
        types: ["Hero"],
        subtypes: ["Young"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Ninja"],
      types: ["Hero"],
      subtypes: ["Young"],
    },
    traits: [],
    textBoxIds: ["GCRQMpBtqBHWrk68GqnGP"],
    numeric: {
      life: 20,
      intellect: 4,
    },
    keywords: [],
    abilities: [
      {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          duration: "this-turn",
          appliesTo: {
            next: {
              typeBox: {
                subtypes: ["Attack"],
              },
            },
            ordinal: 2,
            events: ["play", "attack"],
          },
        },
        id: "GCRQMpBtqBHWrk68GqnGP:secondAttackTurnGets1Power",
        text: "Your second attack each turn gets +1{p}.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const katsu = {
  canonicalId: "QnGJNBGBFw98q9n9NCdRW",
  slug: "katsu",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Katsu"],
    activeFaceIds: ["QnGJNBGBFw98q9n9NCdRW:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Ninja"],
        types: ["Hero"],
        subtypes: ["Young"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Ninja"],
      types: ["Hero"],
      subtypes: ["Young"],
    },
    traits: [],
    textBoxIds: ["QnGJNBGBFw98q9n9NCdRW"],
    numeric: {
      life: 20,
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
          ordinals: [1],
        },
        id: "QnGJNBGBFw98q9n9NCdRW:firstTimeAttackActionHitsTurnDiscardCost0SearchDeckComboBanishFaceUpThenShuffleDeckPlayTurn",
        text: "The first time an attack action card you control hits each turn, you may discard a card with cost 0. If you do, search your deck for a card with combo, banish it face up, then shuffle your deck. You may play it this turn.",
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
                  cost: {
                    op: "eq",
                    value: 0,
                  },
                },
                count: 1,
              },
            },
            then: {
              type: "sequence",
              steps: [
                {
                  type: "search",
                  zones: ["deck"],
                  filter: {
                    hasKeyword: "combo",
                  },
                  mayFail: true,
                  to: {
                    zone: "banished",
                  },
                  outputBinding: "it",
                },
                {
                  type: "play-card",
                  fromZones: ["banished"],
                  source: {
                    selector: "binding",
                    binding: "it",
                  },
                  duration: "this-turn",
                },
              ],
            },
          },
        },
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const blessingOfThemisYellow = {
  canonicalId: "dbBBGHkdzwBz9QBG8MzHh",
  slug: "blessing-of-themis-yellow",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Blessing of Themis"],
    activeFaceIds: ["dbBBGHkdzwBz9QBG8MzHh:face:front"],
    color: "yellow",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Light"],
        types: ["Action"],
        subtypes: ["Aura"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Light"],
      types: ["Action"],
      subtypes: ["Aura"],
    },
    traits: [],
    textBoxIds: ["dbBBGHkdzwBz9QBG8MzHh"],
    numeric: {
      pitch: 2,
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
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "enter-arena",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "source",
              selector: "moved-object",
            },
          },
        },
        id: "dbBBGHkdzwBz9QBG8MzHh:whenEntersArenaNameTurnAllNameBanishedZones",
        text: "Go again\nWhen this enters the arena, name a card. Turn all cards with that name in banished zones face-down. Whenever a card with that name is banished while this is in the arena, turn that card face-down.\nAt the start of your turn, put this into your soul.",
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "name-card",
                suggestions: ["face-up-banished"],
              },
              {
                type: "turn-face-down",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "each",
                  zones: ["banished"],
                  filter: {
                    hasStatus: "named-card",
                  },
                  count: {
                    type: "all",
                  },
                },
              },
            ],
          },
        },
      },
      {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "banish",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "event-object",
              selector: "moved-object",
              relationship: {
                kind: "any",
              },
              filter: {
                hasStatus: "named-card",
              },
              bindAs: "it",
            },
          },
        },
        id: "dbBBGHkdzwBz9QBG8MzHh:wheneverNameIsBanishedWhileIsArenaTurnFace",
        text: "Go again\nWhen this enters the arena, name a card. Turn all cards with that name in banished zones face-down. Whenever a card with that name is banished while this is in the arena, turn that card face-down.\nAt the start of your turn, put this into your soul.",
        resolution: {
          kind: "effect",
          effect: {
            type: "turn-face-down",
            target: {
              selector: "binding",
              binding: "it",
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
            name: "start-phase",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "none",
            },
          },
        },
        id: "dbBBGHkdzwBz9QBG8MzHh:atStartTurnPutIntoSoul",
        text: "Go again\nWhen this enters the arena, name a card. Turn all cards with that name in banished zones face-down. Whenever a card with that name is banished while this is in the arena, turn that card face-down.\nAt the start of your turn, put this into your soul.",
        resolution: {
          kind: "effect",
          effect: {
            type: "move-card",
            target: {
              selector: "self",
            },
            to: {
              zone: "soul",
            },
          },
        },
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const censorRed = {
  canonicalId: "gNqK8KBP7kPKcnpWrmq8p",
  slug: "censor-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Censor"],
    activeFaceIds: ["gNqK8KBP7kPKcnpWrmq8p:face:front"],
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
    textBoxIds: ["gNqK8KBP7kPKcnpWrmq8p"],
    numeric: {
      pitch: 1,
      cost: 1,
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
        id: "gNqK8KBP7kPKcnpWrmq8p:whenHitsHeroNameTheyCanTPlayNamed",
        text: "When this hits a hero, name a card. They can't play the named card until the end of their next turn.",
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "name-card",
                suggestions: ["visible-cards"],
              },
              {
                type: "rule-modification",
                mode: "restrict",
                action: "play",
                filter: {
                  name: "chosen",
                },
                duration: "until-end-of-next-turn",
              },
            ],
          },
        },
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const chainsOfEminenceRed = {
  canonicalId: "kmWrWK6PhLjLdr86QDDWP",
  slug: "chains-of-eminence-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Chains of Eminence"],
    activeFaceIds: ["kmWrWK6PhLjLdr86QDDWP:face:front"],
    color: "red",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: [],
        types: ["Action"],
        subtypes: ["Aura"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: [],
      types: ["Action"],
      subtypes: ["Aura"],
    },
    traits: [],
    textBoxIds: ["kmWrWK6PhLjLdr86QDDWP"],
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
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "enter-arena",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "none",
            },
          },
        },
        id: "kmWrWK6PhLjLdr86QDDWP:whenChainsEminenceEntersArenaNameNamedCanT",
        text: "Go again\nWhen Chains of Eminence enters the arena, name a card. The named card can't be pitched, played or used to defend while Chains of Eminence is in the arena.\nAt the beginning of your action phase, destroy Chains of Eminence",
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "name-card",
                suggestions: ["your-hand", "visible-cards"],
              },
              {
                type: "sequence",
                steps: [
                  {
                    type: "rule-modification",
                    mode: "restrict",
                    action: "pitch",
                    filter: {
                      name: "chosen",
                    },
                    duration: "while-in-arena",
                  },
                  {
                    type: "rule-modification",
                    mode: "restrict",
                    action: "play",
                    filter: {
                      name: "chosen",
                    },
                    duration: "while-in-arena",
                  },
                  {
                    type: "rule-modification",
                    mode: "restrict",
                    action: "defend",
                    filter: {
                      name: "chosen",
                    },
                    duration: "while-in-arena",
                  },
                ],
              },
            ],
          },
        },
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
        id: "kmWrWK6PhLjLdr86QDDWP:atBeginningActionPhaseDestroyChainsEminence",
        text: "Go again\nWhen Chains of Eminence enters the arena, name a card. The named card can't be pitched, played or used to defend while Chains of Eminence is in the arena.\nAt the beginning of your action phase, destroy Chains of Eminence",
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
} as const satisfies FleshAndBloodCard;

export const headLeadsTheTailRed = {
  canonicalId: "p8tbQ7KL7G8RwQTtdKnNH",
  slug: "head-leads-the-tail-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Head Leads the Tail"],
    activeFaceIds: ["p8tbQ7KL7G8RwQTtdKnNH:face:front"],
    color: "red",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Ninja"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Ninja"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["p8tbQ7KL7G8RwQTtdKnNH"],
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
        id: "p8tbQ7KL7G8RwQTtdKnNH:attacksNameAnotherAttackActionName1PowerCombatChain",
        text: "When this attacks, name another card. Attack action cards with that name have +1{p} this combat chain.\nGo again",
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "name-card",
                restriction: "another-card",
                suggestions: ["your-hand", "combat-chain"],
              },
              {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 1,
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "any",
                  zones: ["combat-chain", "stack"],
                  filter: {
                    name: "chosen",
                    typeBox: {
                      types: ["Action"],
                      subtypes: ["Attack"],
                    },
                  },
                  count: {
                    type: "all",
                  },
                },
                duration: "this-combat-chain",
              },
            ],
          },
        },
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const imperialEdictRed = {
  canonicalId: "rFBm6FppdwTJDPRbrgqcg",
  slug: "imperial-edict-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Imperial Edict"],
    activeFaceIds: ["rFBm6FppdwTJDPRbrgqcg:face:front"],
    color: "red",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: [],
        types: ["Action"],
        subtypes: ["Item"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: [],
      types: ["Action"],
      subtypes: ["Item"],
    },
    traits: [],
    textBoxIds: ["rFBm6FppdwTJDPRbrgqcg"],
    numeric: {
      pitch: 1,
      cost: 1,
    },
    keywords: [
      {
        name: "legendary",
      },
    ],
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
          type: "sequence",
          steps: [
            {
              type: "conditional",
              condition: {
                type: "has-status",
                status: "hero-is-royal",
              },
              then: {
                type: "reveal",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "each-other-hero",
                  zones: ["hand"],
                  count: {
                    type: "all",
                  },
                },
              },
            },
            {
              type: "name-card",
              suggestions: ["revealed-this-resolution"],
            },
            {
              type: "rule-modification",
              mode: "restrict",
              action: "play",
              filter: {
                name: "chosen",
              },
              duration: "until-start-of-own-next-turn",
            },
          ],
        },
        id: "rFBm6FppdwTJDPRbrgqcg:actionDestroyImperialEdictNameNamedCantPlayedStartNextTurnRoyalInsteadOpponentRevealsHandThenNameGoAgain",
        text: "Legendary\nAction - Destroy Imperial Edict: Name a card. The named card can't be played until the start of your next turn. If you are Royal, instead each opponent reveals their hand, then name a card. Go again",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const leaveEmSpeechlessBlue = {
  canonicalId: "FB7cMqjrQpWQqFhmPn7Hk",
  slug: "leave-em-speechless-blue",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Leave 'Em Speechless"],
    activeFaceIds: ["FB7cMqjrQpWQqFhmPn7Hk:face:front"],
    color: "blue",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Reviled"],
        types: ["Action"],
        subtypes: ["Aura"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Reviled"],
      types: ["Action"],
      subtypes: ["Aura"],
    },
    traits: [],
    textBoxIds: ["FB7cMqjrQpWQqFhmPn7Hk"],
    numeric: {
      pitch: 3,
      cost: 0,
      defense: 2,
    },
    keywords: [],
    abilities: [
      {
        kind: "static",
        staticKind: "play",
        condition: {
          type: "life-comparison",
          player: "self",
          vs: "each-other-hero",
          op: "gt",
        },
        playEffect: {
          role: "permission",
          fromZones: ["hand", "arsenal"],
          asType: "instant",
          optional: true,
        },
        id: "FB7cMqjrQpWQqFhmPn7Hk:moreLifeThanOtherPlayThoughWereInstant",
        text: "If you have more {h} than each other hero, you may play this as though it were an instant.\nWhen this enters the arena, name a card. The named card can't be played from hand while this is in the arena.\nAt the beginning of your action phase, destroy this.",
      },
      {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "enter-arena",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "source",
              selector: "moved-object",
            },
          },
        },
        id: "FB7cMqjrQpWQqFhmPn7Hk:entersArenaNameNamedCantPlayedHandArena",
        text: "If you have more {h} than each other hero, you may play this as though it were an instant.\nWhen this enters the arena, name a card. The named card can't be played from hand while this is in the arena.\nAt the beginning of your action phase, destroy this.",
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "name-card",
                suggestions: ["visible-cards"],
              },
              {
                type: "rule-modification",
                mode: "restrict",
                action: "play",
                filter: {
                  name: "chosen",
                  playedFromZones: ["hand"],
                },
                duration: "while-in-arena",
              },
            ],
          },
        },
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
        id: "FB7cMqjrQpWQqFhmPn7Hk:beginningActionPhaseDestroy",
        text: "If you have more {h} than each other hero, you may play this as though it were an instant.\nWhen this enters the arena, name a card. The named card can't be played from hand while this is in the arena.\nAt the beginning of your action phase, destroy this.",
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
} as const satisfies FleshAndBloodCard;

export const nullTimeZoneBlue = {
  canonicalId: "gtRTcjNQwPdRpHrndrhMq",
  slug: "null-time-zone-blue",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Null Time Zone"],
    activeFaceIds: ["gtRTcjNQwPdRpHrndrhMq:face:front"],
    color: "blue",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Mechanologist"],
        types: ["Action"],
        subtypes: ["Item"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Mechanologist"],
      types: ["Action"],
      subtypes: ["Item"],
    },
    traits: [],
    textBoxIds: ["gtRTcjNQwPdRpHrndrhMq"],
    numeric: {
      pitch: 3,
      cost: 0,
    },
    keywords: [
      {
        name: "crank",
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
              name: "steam",
            },
            count: 2,
            target: {
              selector: "self",
            },
          },
          duration: "while-in-arena",
        },
        id: "gtRTcjNQwPdRpHrndrhMq:entersArena2SteamCounters",
        text: "Crank\nThis enters the arena with 2 steam counters. At the start of your turn, destroy this unless you remove a steam counter from it.\nWhen this enters the arena, name a card. The named card can't be pitched or played from hand while this is in the arena.",
      },
      {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
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
        },
        id: "gtRTcjNQwPdRpHrndrhMq:startTurnDestroyUnlessRemoveSteamCounter",
        text: "Crank\nThis enters the arena with 2 steam counters. At the start of your turn, destroy this unless you remove a steam counter from it.\nWhen this enters the arena, name a card. The named card can't be pitched or played from hand while this is in the arena.",
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
              type: "remove-counters",
              counter: {
                kind: "named",
                name: "steam",
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
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "enter-arena",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "source",
              selector: "moved-object",
            },
          },
        },
        id: "gtRTcjNQwPdRpHrndrhMq:entersArenaNameNamedCantPitchedPlayedHandArena",
        text: "Crank\nThis enters the arena with 2 steam counters. At the start of your turn, destroy this unless you remove a steam counter from it.\nWhen this enters the arena, name a card. The named card can't be pitched or played from hand while this is in the arena.",
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "name-card",
                suggestions: ["your-hand", "visible-cards"],
              },
              {
                type: "sequence",
                steps: [
                  {
                    type: "rule-modification",
                    mode: "restrict",
                    action: "pitch",
                    filter: {
                      name: "chosen",
                      playedFromZones: ["hand"],
                    },
                    duration: "while-in-arena",
                  },
                  {
                    type: "rule-modification",
                    mode: "restrict",
                    action: "play",
                    filter: {
                      name: "chosen",
                      playedFromZones: ["hand"],
                    },
                    duration: "while-in-arena",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const phantasmalSymbiosisYellow = {
  canonicalId: "MMzFRrNNFDjrbKDjtpNzL",
  slug: "phantasmal-symbiosis-yellow",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Phantasmal Symbiosis"],
    activeFaceIds: ["MMzFRrNNFDjrbKDjtpNzL:face:front"],
    color: "yellow",
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
    textBoxIds: ["MMzFRrNNFDjrbKDjtpNzL"],
    numeric: {
      pitch: 2,
      cost: 1,
      power: 6,
      defense: 3,
    },
    keywords: [
      {
        name: "phantasm",
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
        id: "MMzFRrNNFDjrbKDjtpNzL:attacksNameNameIllusionistEndTurn",
        text: "When this attacks, name a card.  Cards with that name are Illusionist until end of turn.\nPhantasm",
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "name-card",
                suggestions: ["combat-chain", "visible-cards"],
              },
              {
                type: "grant-property",
                property: {
                  kind: "supertype",
                  value: "Illusionist",
                },
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "any",
                  zones: ["hero", "permanent", "combat-chain", "stack"],
                  filter: {
                    name: "chosen",
                  },
                  count: {
                    type: "all",
                  },
                },
                duration: "this-turn",
              },
            ],
          },
        },
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const pickACardAnyCardRed = {
  canonicalId: "bLmknjcbt6Bjn6RTmTBMF",
  slug: "pick-a-card-any-card-red",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Pick a Card, Any Card"],
    activeFaceIds: ["bLmknjcbt6Bjn6RTmTBMF:face:front"],
    color: "red",
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
    textBoxIds: ["bLmknjcbt6Bjn6RTmTBMF"],
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
              type: "name-card",
              suggestions: ["revealed-this-resolution"],
            },
          ],
        },
        id: "bLmknjcbt6Bjn6RTmTBMF:nameAndReveal",
        text: "Look at target opponent's hand then name a card.\nChoose a random card from their hand and reveal it. If it's the named card, create a Silver token. Repeat this process thrice.\nGo again",
      },
      {
        kind: "resolution",
        effect: {
          type: "repeat",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "choose-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "opponent",
                  zones: ["hand"],
                  count: 1,
                },
                random: true,
                outputBinding: "it",
              },
              {
                type: "reveal",
                target: {
                  selector: "binding",
                  binding: "it",
                },
              },
              {
                type: "conditional",
                condition: {
                  type: "has-status",
                  status: "named-card",
                },
                then: {
                  type: "create-token",
                  token: "Silver",
                  controller: "controller",
                },
              },
            ],
          },
          times: 3,
        },
        id: "bLmknjcbt6Bjn6RTmTBMF:revealRandomCards",
        text: "Look at target opponent's hand then name a card.\nChoose a random card from their hand and reveal it. If it's the named card, create a Silver token. Repeat this process thrice.\nGo again",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const shapelessFormBlue = {
  canonicalId: "bQPW8LTTB7jJdTjprpGtm",
  slug: "shapeless-form-blue",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Shapeless Form"],
    activeFaceIds: ["bQPW8LTTB7jJdTjprpGtm:face:front"],
    color: "blue",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Ninja", "Mystic"],
        types: ["Action"],
        subtypes: ["Attack"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Ninja", "Mystic"],
      types: ["Action"],
      subtypes: ["Attack"],
    },
    traits: [],
    textBoxIds: ["bQPW8LTTB7jJdTjprpGtm"],
    numeric: {
      pitch: 3,
      cost: 0,
      power: 1,
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
                hasKeyword: "ephemeral",
                typeBox: {
                  types: ["Action"],
                  subtypes: ["Attack"],
                },
              },
              bindAs: "it",
            },
          },
        },
        id: "bQPW8LTTB7jJdTjprpGtm:wheneverPlayAttackActionWithEphemeralChooseNameGetsChosenName",
        text: "Whenever you play an attack action card with ephemeral, choose a name. It gets the chosen name.\nGo again",
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "name-card",
                suggestions: ["your-hand"],
              },
              {
                type: "grant-property",
                property: {
                  kind: "name",
                  value: "chosen",
                },
                target: {
                  selector: "binding",
                  binding: "it",
                },
                duration: "permanent",
              },
            ],
          },
        },
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const shiftingWindsOfTheMysticBeastBlue = {
  canonicalId: "WznLQmk7B6QQKMmT6TJJC",
  slug: "shifting-winds-of-the-mystic-beast-blue",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Shifting Winds of the Mystic Beast"],
    activeFaceIds: ["WznLQmk7B6QQKMmT6TJJC:face:front"],
    color: "blue",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Ninja", "Mystic"],
        types: ["Action"],
        subtypes: [],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Ninja", "Mystic"],
      types: ["Action"],
      subtypes: [],
    },
    traits: [],
    textBoxIds: ["WznLQmk7B6QQKMmT6TJJC"],
    numeric: {
      pitch: 3,
      cost: 1,
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
                  name: "Crouching Tiger",
                },
                bindAs: "it",
              },
            },
          },
          policy: {
            kind: "windowed",
            duration: "this-turn",
            matching: "every",
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "name-card",
                  suggestions: ["your-hand"],
                },
                {
                  type: "grant-property",
                  property: {
                    kind: "name",
                    value: "chosen",
                  },
                  target: {
                    selector: "binding",
                    binding: "it",
                  },
                  duration: "permanent",
                },
              ],
            },
          },
        },
        id: "WznLQmk7B6QQKMmT6TJJC:wheneverPlayCrouchingTigerTurnNameGetsName",
        text: "Whenever you play a Crouching Tiger this turn, name a card. It gets that name.\nIf a Chi was pitched to play this, create 2 Crouching Tigers in your hand.\nGo again",
      },
      {
        kind: "resolution",
        condition: {
          type: "binding-numeric",
          binding: "pitched-this-way-chi-card",
          comparison: {
            op: "eq",
            value: 1,
          },
        },
        effect: {
          type: "create-token",
          token: "crouching-tiger",
          controller: "controller",
          count: 2,
          to: {
            zone: "hand",
          },
        },
        id: "WznLQmk7B6QQKMmT6TJJC:chiWasPitchedPlayCreateNumber2CrouchingTigersInHand",
        text: "Whenever you play a Crouching Tiger this turn, name a card. It gets that name.\nIf a Chi was pitched to play this, create 2 Crouching Tigers in your hand.\nGo again",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const talismanOfCremationBlue = {
  canonicalId: "gndDzrf8p9pprWwb6HwtL",
  slug: "talisman-of-cremation-blue",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Talisman of Cremation"],
    activeFaceIds: ["gndDzrf8p9pprWwb6HwtL:face:front"],
    color: "blue",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: [],
        types: ["Action"],
        subtypes: ["Item"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: [],
      types: ["Action"],
      subtypes: ["Item"],
    },
    traits: [],
    textBoxIds: ["gndDzrf8p9pprWwb6HwtL"],
    numeric: {
      pitch: 3,
      cost: 0,
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
              bindAs: "it",
            },
          },
        },
        id: "gndDzrf8p9pprWwb6HwtL:whenPlayFromBanishedZoneDestroyTalismanCremationNameBanishAllWith",
        text: "Go again\nWhen you play a card from your banished zone, destroy Talisman of Cremation and name a card. Banish all cards with the chosen name from each opposing hero's graveyard.",
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "sequence",
                steps: [
                  {
                    type: "destroy",
                    target: {
                      selector: "self",
                    },
                  },
                  {
                    type: "name-card",
                    suggestions: ["opponent-graveyard"],
                  },
                ],
              },
              {
                type: "banish",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "opponent",
                  zones: ["graveyard"],
                  filter: {
                    hasStatus: "chosen-name",
                  },
                  count: {
                    type: "all",
                  },
                },
              },
            ],
          },
        },
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const hunterOrHuntedBlue = {
  canonicalId: "9ktNWqbdPNrBJPNnCQCgb",
  slug: "hunter-or-hunted-blue",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Hunter or Hunted?"],
    activeFaceIds: ["9ktNWqbdPNrBJPNnCQCgb:face:front"],
    color: "blue",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Assassin"],
        types: ["Defense Reaction"],
        subtypes: [],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Assassin"],
      types: ["Defense Reaction"],
      subtypes: [],
    },
    traits: [],
    textBoxIds: ["9ktNWqbdPNrBJPNnCQCgb"],
    numeric: {
      pitch: 3,
      cost: 3,
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
        id: "9ktNWqbdPNrBJPNnCQCgb:nameAndBanishCards",
        text: "When this defends, name a card. The attacking hero reveals the top card of their deck. If it's the named card, banish it, search their hand, deck, and arsenal for up to 3 cards with that name and banish them, then they shuffle.\nContract - While this is defending, you are contracted to banish opponents' cards with the chosen name. Whenever you complete this contract, create a Silver token.",
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "name-card",
                suggestions: ["visible-cards"],
              },
              {
                type: "contract-task",
                task: "banish opponents' cards with the chosen name",
                completeOn: "banish",
                filter: {
                  hasStatus: "named-card",
                },
              },
              {
                type: "reveal",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "attacking-hero",
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
                    hasStatus: "named-card",
                  },
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
                      type: "search",
                      zones: ["hand", "deck", "arsenal"],
                      player: "attacking-hero",
                      filter: {
                        hasStatus: "named-card",
                      },
                      count: {
                        type: "up-to",
                        amount: 3,
                      },
                      to: {
                        zone: "banished",
                      },
                    },
                  ],
                },
              },
              {
                type: "shuffle",
              },
            ],
          },
        },
      },
      {
        kind: "static",
        staticKind: "while",
        condition: {
          type: "has-status",
          status: "defending",
        },
        effect: {
          type: "contract-task",
          task: "banish opponents' cards with the chosen name",
          completeOn: "banish",
          filter: {
            hasStatus: "named-card",
          },
        },
        label: {
          name: "contract",
        },
        id: "9ktNWqbdPNrBJPNnCQCgb:chosenNameContract",
        text: "When this defends, name a card. The attacking hero reveals the top card of their deck. If it's the named card, banish it, search their hand, deck, and arsenal for up to 3 cards with that name and banish them, then they shuffle.\nContract - While this is defending, you are contracted to banish opponents' cards with the chosen name. Whenever you complete this contract, create a Silver token.",
      },
      {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event-and-state",
          event: {
            name: "complete-contract",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "none",
            },
          },
          state: {
            type: "has-status",
            status: "defending",
          },
        },
        label: {
          name: "contract",
        },
        id: "9ktNWqbdPNrBJPNnCQCgb:createSilverOnContract",
        text: "When this defends, name a card. The attacking hero reveals the top card of their deck. If it's the named card, banish it, search their hand, deck, and arsenal for up to 3 cards with that name and banish them, then they shuffle.\nContract - While this is defending, you are contracted to banish opponents' cards with the chosen name. Whenever you complete this contract, create a Silver token.",
        resolution: {
          kind: "effect",
          effect: {
            type: "create-token",
            token: "silver",
            controller: "controller",
          },
        },
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const maskOfManyFaces = {
  canonicalId: "7qrdPcNmtPt9HN6TQHNJR",
  slug: "mask-of-many-faces",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Mask of Many Faces"],
    activeFaceIds: ["7qrdPcNmtPt9HN6TQHNJR:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Ninja"],
        types: ["Equipment"],
        subtypes: ["Head"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Ninja"],
      types: ["Equipment"],
      subtypes: ["Head"],
    },
    traits: [],
    textBoxIds: ["7qrdPcNmtPt9HN6TQHNJR"],
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
          type: "sequence",
          steps: [
            {
              type: "name-card",
              suggestions: ["your-hand"],
            },
            {
              type: "grant-property",
              property: {
                kind: "name",
                value: "chosen",
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
        id: "7qrdPcNmtPt9HN6TQHNJR:instantDestroyMaskManyFacesNameNextAttackAction",
        text: "Instant - {r}, destroy Mask of Many Faces: Name a card. The next attack action card you play this turn gains that name.\nBlade Break",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const embodyGreatnessYellow = {
  canonicalId: "MNDjrGBMKh8LtjTdhPrfz",
  slug: "embody-greatness-yellow",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Embody Greatness"],
    activeFaceIds: ["MNDjrGBMKh8LtjTdhPrfz:face:front"],
    color: "yellow",
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Shapeshifter"],
        types: ["Instant"],
        subtypes: [],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Shapeshifter"],
      types: ["Instant"],
      subtypes: [],
    },
    traits: [],
    textBoxIds: ["MNDjrGBMKh8LtjTdhPrfz"],
    numeric: {
      pitch: 2,
      cost: 0,
    },
    keywords: [
      {
        name: "specialization",
        hero: "Shiyana",
      },
    ],
    abilities: [
      {
        kind: "resolution",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "name-card",
              restriction: "living-legend-hero",
            },
            {
              type: "become",
              source: "named-hero",
              duration: "until-start-of-own-next-turn",
              except: "base-life",
            },
          ],
        },
        id: "MNDjrGBMKh8LtjTdhPrfz:nameLivingLegendHeroBecomeHeroUntilStartNext",
        text: "Shiyana Specialization\nName a living legend hero. Become that hero until the start of your next turn, except your base {h} doesn't change.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const benjiThePiercingWind = {
  canonicalId: "HT8r8mg8rHmbWJthCFHfH",
  slug: "benji-the-piercing-wind",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Benji, the Piercing Wind"],
    activeFaceIds: ["HT8r8mg8rHmbWJthCFHfH:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Ninja"],
        types: ["Hero"],
        subtypes: ["Young"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Ninja"],
      types: ["Hero"],
      subtypes: ["Young"],
    },
    traits: [],
    textBoxIds: ["HT8r8mg8rHmbWJthCFHfH"],
    numeric: {
      life: 17,
      intellect: 4,
    },
    keywords: [],
    abilities: [
      {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "rule-modification",
          mode: "restrict",
          action: "defend",
          subject: {
            numeric: [
              {
                property: "power",
                basis: "current",
                comparison: {
                  op: "lte",
                  value: 2,
                },
              },
            ],
            typeBox: {
              types: ["Action"],
              subtypes: ["Attack"],
            },
          },
          filter: {
            playedFromZones: ["hand"],
          },
          duration: "while-in-arena",
        },
        id: "HT8r8mg8rHmbWJthCFHfH:attackAction2LessPowerCantDefendedHand",
        text: "Your attack action cards with 2 or less {p} can't be defended by cards from hand.\nThe first time an attack action card you control hits each turn, your next attack gains +1{p}.",
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
              kind: "event-object",
              selector: "attack",
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
          ordinals: [1],
        },
        id: "HT8r8mg8rHmbWJthCFHfH:firstTimeAttackActionHitsTurnNextAttackGains1Power",
        text: "Your attack action cards with 2 or less {p} can't be defended by cards from hand.\nThe first time an attack action card you control hits each turn, your next attack gains +1{p}.",
        resolution: {
          kind: "effect",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
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
} as const satisfies FleshAndBloodCard;

export const bravoShowstopper = {
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
} as const satisfies FleshAndBloodCard;

export const emperorDracaiOfAesir = {
  canonicalId: "QgqNQGbtcF6NNBMDbDMhh",
  slug: "emperor-dracai-of-aesir",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Emperor, Dracai of Aesir"],
    activeFaceIds: ["QgqNQGbtcF6NNBMDbDMhh:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Warrior", "Wizard", "Draconic", "Royal"],
        types: ["Hero"],
        subtypes: ["Young"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Warrior", "Wizard", "Draconic", "Royal"],
      types: ["Hero"],
      subtypes: ["Young"],
    },
    traits: [],
    textBoxIds: ["QgqNQGbtcF6NNBMDbDMhh"],
    numeric: {
      life: 15,
      intellect: 4,
    },
    keywords: [],
    abilities: [
      {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "rule-modification",
          mode: "restrict",
          action: "have-in-deck",
          subject: {
            color: ["red"],
          },
          duration: "permanent",
        },
        id: "QgqNQGbtcF6NNBMDbDMhh:allowOnlyRedCardsInDeck",
        text: "You may only have red cards in your deck.\nAction - {r}{r}{r}: Search your deck for Command and Conquer, attack with it, then shuffle.",
      },
      {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "asset",
          type: "resources",
          amount: 3,
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "sequence",
              steps: [
                {
                  type: "search",
                  zones: ["deck"],
                  filter: {
                    name: "Command And Conquer",
                  },
                  mayFail: true,
                  to: {
                    zone: "permanent",
                  },
                  outputBinding: "it",
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
            {
              type: "shuffle",
              zone: "deck",
            },
          ],
        },
        id: "QgqNQGbtcF6NNBMDbDMhh:actionResourceResourceResourceSearchDeckCommandConquerAttackThenShuffle",
        text: "You may only have red cards in your deck.\nAction - {r}{r}{r}: Search your deck for Command and Conquer, attack with it, then shuffle.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const prism = {
  canonicalId: "NGkHQHjzkFqfmGLKmRCpj",
  slug: "prism",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Prism"],
    activeFaceIds: ["NGkHQHjzkFqfmGLKmRCpj:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Illusionist", "Light"],
        types: ["Hero"],
        subtypes: ["Young"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Illusionist", "Light"],
      types: ["Hero"],
      subtypes: ["Young"],
    },
    traits: [],
    textBoxIds: ["NGkHQHjzkFqfmGLKmRCpj"],
    numeric: {
      life: 20,
      intellect: 4,
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
              type: "banish",
              from: "soul",
              count: 1,
            },
          ],
        },
        effect: {
          type: "create-token",
          token: "spectral-shield",
          controller: "controller",
        },
        id: "NGkHQHjzkFqfmGLKmRCpj:oncePerTurnInstantResourceResourceBanishPrismsSoulCreateSpectralShieldToken",
        text: "Once per Turn Instant - {r}{r}, banish a card from Prism's soul: Create a Spectral Shield token.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const shiyanaDiamondGemini = {
  canonicalId: "n9r77QwMzdWJmnfhPLN9J",
  slug: "shiyana-diamond-gemini",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Shiyana, Diamond Gemini"],
    activeFaceIds: ["n9r77QwMzdWJmnfhPLN9J:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Shapeshifter"],
        types: ["Hero"],
        subtypes: ["Young"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Shapeshifter"],
      types: ["Hero"],
      subtypes: ["Young"],
    },
    traits: [],
    textBoxIds: ["n9r77QwMzdWJmnfhPLN9J"],
    numeric: {
      life: 20,
      intellect: 4,
    },
    keywords: [],
    abilities: [
      {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "rule-modification",
          mode: "allow",
          action: "have-in-deck",
          filter: {
            hasStatus: "deckbuilding-exception",
          },
          duration: "permanent",
        },
        id: "n9r77QwMzdWJmnfhPLN9J:specializationAnyDeck",
        text: 'You may have specialization cards of any hero in your deck.\nAt the beginning of your action phase, Shiyana becomes a copy of target hero until the start of your next turn, and gains "Cards you own are the class of your hero in addition to their other class types."',
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
        id: "n9r77QwMzdWJmnfhPLN9J:beginningActionPhaseShiyanaBecomesCopyTargetStartNextTurnGainsClassAdditionOtherClassTypes",
        text: 'You may have specialization cards of any hero in your deck.\nAt the beginning of your action phase, Shiyana becomes a copy of target hero until the start of your next turn, and gains "Cards you own are the class of your hero in addition to their other class types."',
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "copy",
                target: {
                  selector: "self",
                },
                source: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "any",
                  zones: ["hero"],
                  count: 1,
                },
                duration: "until-start-of-own-next-turn",
              },
              {
                type: "grant-property",
                property: {
                  kind: "ability",
                  ability: {
                    id: "n9r77QwMzdWJmnfhPLN9J:beginningActionPhaseShiyanaBecomesCopyTargetStartNextTurnGainsClassAdditionOtherClassTypes:classAdditionOtherClassTypes",
                    text: 'You may have specialization cards of any hero in your deck.\nAt the beginning of your action phase, Shiyana becomes a copy of target hero until the start of your next turn, and gains "Cards you own are the class of your hero in addition to their other class types."',
                    kind: "static",
                    staticKind: "continuous",
                    effect: {
                      type: "grant-property",
                      property: {
                        kind: "supertype",
                        value: "hero-class",
                      },
                      target: {
                        selector: "object",
                        declared: "at-resolution",
                        player: "controller",
                        zones: [
                          "hand",
                          "deck",
                          "graveyard",
                          "banished",
                          "permanent",
                          "arsenal",
                          "stack",
                        ],
                        count: {
                          type: "all",
                        },
                      },
                      duration: "while-condition",
                    },
                  },
                },
                target: {
                  selector: "self",
                },
                duration: "until-start-of-own-next-turn",
              },
            ],
          },
        },
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const teklovossen = {
  canonicalId: "6PPFnJ8tNtPKN6Km7NWpp",
  slug: "teklovossen",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Teklovossen"],
    activeFaceIds: ["6PPFnJ8tNtPKN6Km7NWpp:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Mechanologist"],
        types: ["Hero"],
        subtypes: ["Young"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Mechanologist"],
      types: ["Hero"],
      subtypes: ["Young"],
    },
    traits: [],
    textBoxIds: ["6PPFnJ8tNtPKN6Km7NWpp"],
    numeric: {
      life: 20,
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
        id: "6PPFnJ8tNtPKN6Km7NWpp:playEvosBanishedZone",
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
        id: "6PPFnJ8tNtPKN6Km7NWpp:oncePerTurnInstantResourceResourceResourcePlayNextEvoTurnThoughWereInstantDraw",
        text: "You may play Evos from your banished zone.\nOnce per Turn Instant - {r}{r}{r}: You may play your next Evo this turn as though it were an instant. When you do, draw a card.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;

export const zen = {
  canonicalId: "7FHM67fkfjCjzwWzKfFKH",
  slug: "zen",
  layout: {
    kind: "single",
  },
  base: {
    names: ["Zen"],
    activeFaceIds: ["7FHM67fkfjCjzwWzKfFKH:face:front"],
    color: null,
    typeBoxes: [
      {
        metatypes: [],
        supertypes: ["Ninja", "Mystic"],
        types: ["Hero"],
        subtypes: ["Young"],
      },
    ],
    typeBox: {
      metatypes: [],
      supertypes: ["Ninja", "Mystic"],
      types: ["Hero"],
      subtypes: ["Young"],
    },
    traits: [],
    textBoxIds: ["7FHM67fkfjCjzwWzKfFKH"],
    numeric: {
      life: 20,
      intellect: 4,
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
        cost: {
          class: "asset",
          type: "chi",
          amount: 3,
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "create-token",
              token: "crouching-tiger",
              controller: "controller",
              to: {
                zone: "hand",
              },
            },
            {
              type: "search",
              zones: ["deck"],
              filter: {
                hasKeyword: "combo",
              },
              mayFail: true,
              to: {
                zone: "banished",
              },
              outputBinding: "it",
            },
            {
              type: "shuffle",
              zone: "deck",
            },
            {
              type: "play-card",
              fromZones: ["banished"],
              source: {
                selector: "binding",
                binding: "it",
              },
              duration: "this-turn",
            },
          ],
        },
        id: "7FHM67fkfjCjzwWzKfFKH:oncePerTurnInstantChiChiChiCreateCrouchingTigerHandSearchDeckComboBanishThenShufflePlayTurn",
        text: "Once per Turn Instant - {c}{c}{c}: Create a Crouching Tiger in your hand. Search your deck for a card with combo, banish it, then shuffle. You may play it this turn.",
      },
    ],
  },
} as const satisfies FleshAndBloodCard;
