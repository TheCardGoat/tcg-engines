import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/smash-up.generated.ts";

export const smashUp = definePitchFamily(fabPitchFamilies["smash-up"], {
  abilities: () => ({
    whenHitsHeroTurnInTheirArsenalFaceUpBanishAttackAction: {
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
          type: "sequence",
          steps: [
            {
              type: "turn-face-up",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "attack-target",
                zones: ["arsenal"],
                count: 1,
              },
            },
            {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "attack-target",
                zones: ["arsenal"],
                filter: attackActionFilter(),
                count: 1,
              },
            },
          ],
        },
      },
    },
  }),
});

export const { red: smashUpRed } = smashUp.cards;
