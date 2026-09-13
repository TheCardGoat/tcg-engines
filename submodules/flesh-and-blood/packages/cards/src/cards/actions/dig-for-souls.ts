import { plusPower } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/dig-for-souls.generated.ts";
import { goAgain } from "../shared/keywords.ts";
export const digForSouls = definePitchFamily(fabPitchFamilies["dig-for-souls"], {
  keywords: [goAgain],
  abilities: () => ({
    sequence: {
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
            count: { type: "x" },
          },
          outputBinding: "looked",
        },
        {
          type: "search",
          zones: [],
          fromBinding: "looked",
          filter: { typeBox: { subtypes: ["Zombie"] } },
          count: { type: "up-to", amount: 1 },
          mayFail: true,
          to: { zone: "graveyard" },
          outputBinding: "zombie",
        },
        {
          type: "reorder-deck",
          target: { selector: "binding", binding: "looked", exclude: "zombie" },
          position: "bottom",
        },
        {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              kind: "static",
              staticKind: "triggered",
              id: "staticTriggeredHitDestroy",
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
                effect: { type: "destroy", target: { selector: "self" } },
              },
            },
          },
          duration: "this-turn",
          appliesTo: { next: { typeBox: { subtypes: ["Zombie"] } }, events: ["attack"] },
        },
        plusPower(4, {
          appliesTo: { next: { typeBox: { subtypes: ["Zombie"] } }, events: ["attack"] },
        }),
      ],
    },
  }),
});
export const { red: digForSoulsRed } = digForSouls.cards;
