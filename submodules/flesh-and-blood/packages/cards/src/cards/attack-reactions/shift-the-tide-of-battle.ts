import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/shift-the-tide-of-battle.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const shiftTheTideOfBattle = definePitchFamily(
  fabPitchFamilies["shift-the-tide-of-battle"],
  {
    abilities: () => ({
      grantGoAgainToEmpoweredWarriorAttack: {
        kind: "resolution",
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: {
              and: [
                {
                  typeBox: {
                    supertypes: ["Warrior"],
                  },
                },
                {
                  typeBox: {
                    subtypes: ["Attack"],
                  },
                },
                {
                  numeric: [
                    {
                      property: "power",
                      basis: "base",
                      comparison: {
                        op: "gt",
                        value: 0,
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
      createAgilityAfterDamage: {
        kind: "resolution",
        effect: {
          type: "delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "dealt-damage",
              actor: {
                kind: "player",
                player: "opponent",
              },
              observes: {
                kind: "none",
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
              type: "create-token",
              token: "agility",
              controller: "controller",
            },
          },
        },
      },
    }),
  },
);

export const { yellow: shiftTheTideOfBattleYellow } = shiftTheTideOfBattle.cards;
