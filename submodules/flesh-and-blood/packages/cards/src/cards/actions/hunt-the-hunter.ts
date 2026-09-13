import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/hunt-the-hunter.generated.ts";

export const huntTheHunter = definePitchFamily(fabPitchFamilies["hunt-the-hunter"], {
  abilities: () => ({
    attacksPlayedAnotherRedTurnMark: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "attack",
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
        state: {
          type: "performed-this-turn",
          event: "play-another-red-card",
          player: "controller",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "mark",
          target: {
            selector: "attack-target",
          },
        },
      },
      label: {
        name: "mark",
      },
    },
  }),
});

export const { red: huntTheHunterRed } = huntTheHunter.cards;
