import { plusPower } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/crimson-waltz.generated.ts";
import { goAgain } from "../shared/keywords.ts";
export const crimsonWaltz = definePitchFamily(fabPitchFamilies["crimson-waltz"], {
  keywords: [goAgain],
  abilities: () => ({
    sequence: {
      type: "sequence",
      steps: [
        plusPower(4, {
          appliesTo: { next: { typeBox: { subtypes: ["Sword"] } }, events: ["attack", "activate"] },
        }),
        {
          type: "delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "attack",
              actor: { kind: "player", player: "ability-controller" },
              observes: {
                kind: "event-object",
                selector: "attack",
                relationship: { kind: "any" },
                filter: { typeBox: { subtypes: ["Sword"] } },
              },
            },
          },
          policy: { kind: "windowed", duration: "this-turn", matching: "first" },
          resolution: {
            kind: "effect",
            effect: {
              type: "sequence",
              steps: [
                { type: "draw", count: 1, player: "controller" },
                {
                  type: "move-card",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "controller",
                    zones: ["hand"],
                    count: 1,
                  },
                  to: { zone: "deck", position: "top" },
                },
              ],
            },
          },
        },
      ],
    },
  }),
});
export const { yellow: crimsonWaltzYellow } = crimsonWaltz.cards;
