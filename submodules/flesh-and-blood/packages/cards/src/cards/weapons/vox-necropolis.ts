import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/vox-necropolis.generated.ts";

const voxGrantedAttack = {
  id: "attack",
  kind: "activated" as const,
  text: "",
  abilityType: "attack" as const,
  cost: {
    class: "mixed" as const,
    type: "all" as const,
    costs: [
      {
        class: "asset" as const,
        type: "resources" as const,
        amount: 1,
      },
      {
        class: "effect" as const,
        type: "tap-self" as const,
      },
    ],
  },
  effect: {
    type: "attack-with" as const,
    target: {
      selector: "self" as const,
    },
  },
};

const voxGrantedEnterArenaAttack = {
  id: "attackWhenEnteringFromGraveyardOrBanished",
  kind: "static" as const,
  staticKind: "triggered" as const,
  trigger: {
    kind: "event" as const,
    event: {
      name: "enter-arena" as const,
      actor: { kind: "any" as const },
      observes: { kind: "source" as const, selector: "moved-object" as const },
    },
  },
  resolution: {
    kind: "effect" as const,
    effect: { type: "attack-with" as const, target: { selector: "self" as const } },
  },
};

const duringYourActionPhase = {
  type: "and" as const,
  conditions: [
    { type: "turn-player" as const, who: "self" as const },
    { type: "phase-is" as const, phase: "action" as const },
  ],
};

/** IAR055 Vox Necropolis — grants zombies Attack and ETB attack-with from GY/banished. */
export const voxNecropolis = defineCard(fabCardIdentitiesByCanonicalId["PjHzdFtkjKpqTrDkwkJGK"], {
  abilities: {
    zombiesGetActionResourceTapAttack: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: voxGrantedAttack,
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
    },
    duringActionPhaseZombiePlayedGraveyardBanishedZoneEntersArenaTapped: {
      kind: "static",
      staticKind: "continuous",
      condition: duringYourActionPhase,
      effect: {
        type: "replacement",
        replacementKind: "identity",
        replaces: {
          name: "enter-arena",
          player: "controller",
          subject: {
            typeBox: { subtypes: ["Zombie"] },
            playedFromZones: ["graveyard", "banished"],
          },
        },
        modification: {
          type: "tap",
          target: { selector: "self" },
        },
        duration: "while-in-arena",
      },
    },
    duringActionPhaseZombiePlayedGraveyardBanishedZoneGetsEnterArenaAttack: {
      kind: "static",
      staticKind: "continuous",
      condition: duringYourActionPhase,
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: voxGrantedEnterArenaAttack,
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          // CR 1.7.4h: the ability must be present at the enter boundary.
          zones: ["stack", "permanent"],
          filter: {
            typeBox: { subtypes: ["Zombie"] },
            playedFromZones: ["graveyard", "banished"],
          },
          count: { type: "all" },
        },
        duration: "while-in-arena",
      },
    },
  },
});
