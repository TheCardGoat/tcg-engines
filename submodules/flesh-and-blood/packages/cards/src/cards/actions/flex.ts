import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/flex.generated.ts";

const flexBonus = {
  kind: "effect",
  effect: {
    type: "optional",
    effect: {
      type: "pay",
      cost: { class: "asset", type: "resources", amount: 2 },
      payer: "controller",
    },
    then: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount: 2,
      target: { selector: "self" },
      duration: "permanent",
    },
  },
} as const;

export const flex = definePitchFamily(fabPitchFamilies["flex"], {
  abilities: () => ({
    onAttack: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: { kind: "player", player: "ability-controller" },
          observes: {
            kind: "event-object",
            selector: "attack",
            relationship: { kind: "any" },
            filter: { name: "Flex" },
          },
        },
      },
      resolution: flexBonus,
    },
    onDefend: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: { kind: "player", player: "ability-controller" },
          observes: {
            kind: "event-object",
            selector: "defender",
            relationship: { kind: "any" },
            filter: { name: "Flex" },
          },
        },
      },
      resolution: flexBonus,
    },
  }),
});

export const { red: flexRed, yellow: flexYellow, blue: flexBlue } = flex.cards;
