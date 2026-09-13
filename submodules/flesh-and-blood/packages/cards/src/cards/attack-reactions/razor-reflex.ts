import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, modalAbility, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/razor-reflex.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const razorReflex = definePitchFamily(fabPitchFamilies["razor-reflex"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
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
                { typeBox: { subtypes: ["Dagger"] } },
                {
                  and: [{ typeBox: { subtypes: ["Sword"] } }, { typeBox: { types: ["Weapon"] } }],
                },
              ],
            },
            count: 1,
          },
          duration: "this-turn",
          outputBinding: "it",
        },
        attackAction: {
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
                    { property: "cost", basis: "base", comparison: { op: "lte", value: 1 } },
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
                  id: `${context.canonicalId}:chooseMode:attackAction:onHit`,
                  text: "",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "hit",
                      actor: { kind: "player", player: "ability-controller" },
                      observes: { kind: "source", selector: "attack" },
                    },
                  },
                  resolution: {
                    kind: "effect",
                    effect: {
                      type: "grant-property",
                      property: { kind: "keyword", keyword: goAgain },
                      target: { selector: "self" },
                      duration: "this-turn",
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
                    { property: "cost", basis: "base", comparison: { op: "lte", value: 1 } },
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

export const {
  red: razorReflexRed,
  yellow: razorReflexYellow,
  blue: razorReflexBlue,
} = razorReflex.cards;
