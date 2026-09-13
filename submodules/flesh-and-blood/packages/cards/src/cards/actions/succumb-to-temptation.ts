import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/succumb-to-temptation.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const succumbToTemptation = definePitchFamily(fabPitchFamilies["succumb-to-temptation"], {
  keywords: [goAgain],
  abilities: () => ({
    veDealtArcaneDamageTurnPlayAsThoughWereInstant: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "damage-dealt",
        damageType: "arcane",
        player: "controller",
        per: "turn",
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
    },
    nextTimeRunebladeAttackActionControlHitsHeroTurnLookAtTheir: {
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
                  supertypes: ["Runeblade"],
                  types: ["Action"],
                  subtypes: ["Attack"],
                },
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
            type: "sequence",
            steps: [
              {
                type: "look",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "attack-target",
                  zones: ["hand"],
                  count: {
                    type: "all",
                  },
                },
              },
              {
                type: "discard",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "attack-target",
                  zones: ["hand"],
                  count: 1,
                },
              },
            ],
          },
        },
      },
    },
  }),
});

export const { yellow: succumbToTemptationYellow } = succumbToTemptation.cards;
