import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/icy-encounter.generated.ts";

export const icyEncounter = definePitchFamily(fabPitchFamilies["icy-encounter"], {
  abilities: () => ({
    triggeredHitCreateTokenFrostbite: {
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
          type: "create-token",
          token: "frostbite",
          controller: "attack-target",
        },
      },
    },
  }),
});

export const {
  red: icyEncounterRed,
  yellow: icyEncounterYellow,
  blue: icyEncounterBlue,
} = icyEncounter.cards;
