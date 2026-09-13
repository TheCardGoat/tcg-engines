import { bloodDebt } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/open-the-gate-to-i-arathael.generated.ts";

export const openTheGateToIArathael = definePitchFamily(
  fabPitchFamilies["open-the-gate-to-i-arathael"],
  {
    keywords: [bloodDebt],
    abilities: () => ({
      hitsBanishedHandDeckCreateGateIArathaelToken: {
        kind: "static",
        staticKind: "triggered",
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
            type: "create-token",
            token: "gate-to-i-arathael",
            controller: "controller",
          },
        },
      },
      hitsBanishedHandDeckCreateGateIArathaelTokenTriggeredBanishCreateTokenGateToIArathael: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "banish",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "none",
            },
            from: ["hand", "deck"],
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "create-token",
            token: "gate-to-i-arathael",
            controller: "controller",
          },
        },
      },
    }),
  },
);

export const { red: openTheGateToIArathaelRed } = openTheGateToIArathael.cards;
