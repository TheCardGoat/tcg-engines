import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rattle-bones.generated.ts";

export const rattleBones = definePitchFamily(fabPitchFamilies["rattle-bones"], {
  keywords: [goAgain],
  abilities: () => ({
    banishTargetRunebladeAttackActionGraveyardPlayTurn: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "object",
              declared: "on-stack",
              player: "controller",
              zones: ["graveyard"],
              filter: {
                typeBox: {
                  types: ["Action"],
                },
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
                ],
              },
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "optional",
            effect: {
              type: "play-card",
              fromZones: ["banished"],
              source: {
                selector: "binding",
                binding: "it",
              },
              duration: "this-turn",
            },
          },
        ],
      },
    },
    dealtArcaneDamageOpposingTurnPlayRattleBonesThoughWereInstant: {
      kind: "static",
      staticKind: "play",
      condition: { type: "performed-this-turn", event: "deal-arcane-damage", player: "controller" },
      playEffect: {
        role: "permission",
        fromZones: ["hand", "arsenal"],
        asType: "instant",
        optional: true,
      },
    },
  }),
});

export const { red: rattleBonesRed } = rattleBones.cards;
