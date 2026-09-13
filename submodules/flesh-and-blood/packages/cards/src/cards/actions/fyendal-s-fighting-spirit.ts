import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/fyendal-s-fighting-spirit.generated.ts";

export const fyendalSFightingSpirit = definePitchFamily(
  fabPitchFamilies["fyendal-s-fighting-spirit"],
  {
    abilities: () => ({
      onAttackGainLife: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event-and-state",
          event: {
            name: "attack",
            actor: { kind: "player", player: "ability-controller" },
            observes: { kind: "source", selector: "attack" },
          },
          state: { type: "life-comparison", player: "self", vs: "opponent", op: "lt" },
        },
        resolution: {
          kind: "effect",
          effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
        },
      },
      onDefendGainLife: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event-and-state",
          event: {
            name: "defend",
            actor: { kind: "player", player: "ability-controller" },
            observes: { kind: "source", selector: "defender" },
          },
          state: { type: "life-comparison", player: "self", vs: "opponent", op: "lt" },
        },
        resolution: {
          kind: "effect",
          effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
        },
      },
    }),
  },
);

export const {
  red: fyendalSFightingSpiritRed,
  yellow: fyendalSFightingSpiritYellow,
  blue: fyendalSFightingSpiritBlue,
} = fyendalSFightingSpirit.cards;
