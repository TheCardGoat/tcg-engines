import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sonata-dystopia.generated.ts";
import { goAgain, overpower } from "../shared/keywords.ts";

export const sonataDystopia = definePitchFamily(fabPitchFamilies["sonata-dystopia"], {
  keywords: [goAgain],
  abilities: () => ({
    destroy: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "destroy",
          filter: { name: "Runechant" },
          count: { type: "x" },
        },
      },
    },
    nextAttack: {
      type: "sequence",
      steps: [
        {
          type: "modify-numeric",
          property: "cost",
          op: "subtract",
          amount: { type: "x" },
          duration: "this-turn",
          appliesTo: {
            next: attackActionFilter(),
            events: ["play"],
          },
        },
        {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: { type: "x" },
          target: { selector: "this-attack" },
          duration: "this-turn",
          appliesTo: { next: attackActionFilter() },
        },
        {
          type: "grant-property",
          property: { kind: "keyword", keyword: overpower },
          target: { selector: "this-attack" },
          duration: "this-turn",
          appliesTo: { next: attackActionFilter() },
        },
        {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              id: "replenish",
              text: "",
              kind: "static",
              staticKind: "triggered",
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
                  type: "create-token",
                  token: "runechant",
                  count: { type: "x" },
                  controller: "controller",
                },
              },
            },
          },
          target: { selector: "this-attack" },
          duration: "this-turn",
          appliesTo: { next: attackActionFilter() },
        },
      ],
    },
  }),
});
export const { blue: sonataDystopiaBlue } = sonataDystopia.cards;
