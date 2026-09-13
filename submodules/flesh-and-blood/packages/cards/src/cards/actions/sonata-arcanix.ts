import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sonata-arcanix.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const sonataArcanix = definePitchFamily(fabPitchFamilies["sonata-arcanix"], {
  keywords: [goAgain],
  abilities: () => ({
    revealTopXNumber3DeckForEachNonAttackActionRevealedWay: {
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
              count: {
                type: "sum",
                operands: [{ type: "x" }, 3],
              },
            },
          },
          {
            type: "repeat",
            times: {
              type: "count",
              what: "revealed-this-way",
              filter: {
                typeBox: {
                  types: ["Action"],
                  excludeSubtypes: ["Attack"],
                },
              },
            },
            effect: {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                filter: attackActionFilter({ inObjectBinding: "revealed-this-way" }),
                count: 1,
              },
              to: {
                zone: "hand",
              },
            },
          },
          {
            type: "deal-damage",
            damageType: "arcane",
            amount: {
              type: "count",
              what: "put-into-hand-this-way",
            },
            target: {
              selector: "object",
              declared: "on-stack",
              player: "any",
              zones: ["hero"],
              count: 1,
            },
          },
          {
            type: "shuffle",
            zone: "deck",
          },
          {
            type: "banish",
            target: {
              selector: "self",
            },
          },
        ],
      },
    },
  }),
});

export const { red: sonataArcanixRed } = sonataArcanix.cards;
