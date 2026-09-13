import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/concealed-blade.generated.ts";

export const concealedBlade = definePitchFamily(fabPitchFamilies["concealed-blade"], {
  abilities: () => ({
    boostAndEquipDaggerOnHit: {
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
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: attackActionFilter({
                or: [
                  {
                    typeBox: {
                      supertypes: ["Assassin"],
                    },
                  },
                  {
                    typeBox: {
                      supertypes: ["Ninja"],
                    },
                  },
                ],
              }),
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
                id: "equipDaggerOnHit",
                text: "",
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
                    type: "equip",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "controller",
                      zones: ["inventory"],
                      filter: {
                        name: "Dagger",
                      },
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
              filter: attackActionFilter({
                or: [
                  {
                    typeBox: {
                      supertypes: ["Assassin"],
                    },
                  },
                  {
                    typeBox: {
                      supertypes: ["Ninja"],
                    },
                  },
                ],
              }),
              count: 1,
            },
            duration: "this-turn",
          },
        ],
        outputBinding: "it",
      },
    },
  }),
});

export const { blue: concealedBladeBlue } = concealedBlade.cards;
