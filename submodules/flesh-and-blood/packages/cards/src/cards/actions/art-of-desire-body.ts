import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/art-of-desire-body.generated.ts";

import { stealth } from "../shared/keywords.ts";

export const artOfDesireBody = definePitchFamily(fabPitchFamilies["art-of-desire-body"], {
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
    wheneverBanishesRedDrawGain1: {
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
              color: ["red"],
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
export const { red: artOfDesireBodyRed } = artOfDesireBody.cards;
