import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/countdown-to-extinction.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const countdownToExtinction = definePitchFamily(
  fabPitchFamilies["countdown-to-extinction"],
  {
    keywords: [bloodDebt],
    abilities: () => ({
      gate: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "attack",
            actor: { kind: "player", player: "ability-controller" },
            observes: { kind: "source", selector: "attack" },
          },
        },
        resolution: {
          kind: "effect",
          effect: { type: "create-token", token: "gate-to-i-arathael", controller: "controller" },
        },
      },
      search: {
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
            type: "optional",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "search",
                  zones: ["deck"],
                  filter: { name: "Darkest Hour" },
                  count: 1,
                  mayFail: true,
                  to: { zone: "banished" },
                },
                { type: "shuffle", player: "controller" },
              ],
            },
          },
        },
      },
    }),
  },
);
export const {
  red: countdownToExtinctionRed,
  yellow: countdownToExtinctionYellow,
  blue: countdownToExtinctionBlue,
} = countdownToExtinction.cards;
