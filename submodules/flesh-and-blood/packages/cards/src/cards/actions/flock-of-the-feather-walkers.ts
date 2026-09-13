import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/flock-of-the-feather-walkers.generated.ts";

export const flockOfTheFeatherWalkers = definePitchFamily(
  fabPitchFamilies["flock-of-the-feather-walkers"],
  {
    abilities: () => ({
      revealCost: {
        kind: "static",
        staticKind: "play",
        playEffect: {
          role: "additional-cost",
          cost: {
            class: "effect",
            type: "reveal",
            from: "hand",
            filter: { cost: { op: "lte", value: 1 } },
          },
        },
      },
      createQuicken: {
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
              filter: { name: "Flock Of The Feather Walkers" },
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: { type: "create-token", token: "quicken", controller: "controller" },
        },
      },
    }),
  },
);

export const {
  red: flockOfTheFeatherWalkersRed,
  yellow: flockOfTheFeatherWalkersYellow,
  blue: flockOfTheFeatherWalkersBlue,
} = flockOfTheFeatherWalkers.cards;
