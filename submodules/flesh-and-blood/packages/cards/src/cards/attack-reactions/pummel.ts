import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, modalAbility, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/pummel.generated.ts";

export const pummel = definePitchFamily(fabPitchFamilies.pummel, {
  parameters: pitchMap({ red: 4, yellow: 3, blue: 2 }),
  abilities: (amount, context) => ({
    chooseMode: modalAbility({
      kind: "modal",
      modal: { choose: 1 },
      modes: {
        weapon: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount,
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: {
              or: [
                { typeBox: { subtypes: ["Club"] } },
                {
                  and: [{ typeBox: { subtypes: ["Hammer"] } }, { typeBox: { types: ["Weapon"] } }],
                },
              ],
            },
            count: 1,
          },
          duration: "this-turn",
          outputBinding: "it",
        },
        hitHero: {
          type: "sequence",
          steps: [
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount,
              target: {
                selector: "object",
                declared: "on-stack",
                zones: ["combat-chain"],
                filter: attackActionFilter({
                  numeric: [
                    { property: "cost", basis: "base", comparison: { op: "gte", value: 2 } },
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
                  id: `${context.canonicalId}:chooseMode:hitHero:onHit`,
                  text: "",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "hit",
                      actor: { kind: "player", player: "ability-controller" },
                      observes: { kind: "source", selector: "attack" },
                      target: { kind: "hero" },
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
                filter: attackActionFilter({
                  numeric: [
                    { property: "cost", basis: "base", comparison: { op: "gte", value: 2 } },
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
  }),
});

export const { red: pummelRed, yellow: pummelYellow, blue: pummelBlue } = pummel.cards;
