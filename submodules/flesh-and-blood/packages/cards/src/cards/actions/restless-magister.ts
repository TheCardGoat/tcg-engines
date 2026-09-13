import { decay } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/restless-magister.generated.ts";

export const restlessMagister = definePitchFamily(fabPitchFamilies["restless-magister"], {
  keywords: [decay],
  abilities: () => ({
    hitsBanishHand: {
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
            zones: ["hand"],
            count: 1,
          },
        },
      },
    },
  }),
});

export const { red: restlessMagisterRed } = restlessMagister.cards;
