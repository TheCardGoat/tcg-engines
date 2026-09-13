import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/art-of-desire-soul.generated.ts";

import { stealth } from "../shared/keywords.ts";

export const artOfDesireSoul = definePitchFamily(fabPitchFamilies["art-of-desire-soul"], {
  keywords: [stealth],
  abilities: () => ({
    whenHitsHeroBanishTopTheirDeck: {
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
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "banish",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["deck"],
            position: "top",
            count: 1,
          },
          outputBinding: "banished",
        },
      },
    },
    wheneverBanishesYellowDrawGain1: {
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
            kind: "event-object",
            selector: "moved-object",
            relationship: {
              kind: "any",
            },
            filter: {
              color: ["yellow"],
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "draw",
              count: 1,
              player: "controller",
            },
            {
              type: "gain-life",
              amount: 1,
              target: {
                selector: "controller",
              },
            },
          ],
        },
      },
    },
  }),
});
export const { yellow: artOfDesireSoulYellow } = artOfDesireSoul.cards;
