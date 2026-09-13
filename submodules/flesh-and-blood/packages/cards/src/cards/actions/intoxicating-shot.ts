import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/intoxicating-shot.generated.ts";

export const intoxicatingShot = definePitchFamily(fabPitchFamilies["intoxicating-shot"], {
  keywords: [
    {
      name: "specialization",
      hero: "Riptide",
    },
  ],
  abilities: () => ({
    hitsCreateCourageQuickenToken: {
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
              type: "create-token",
              token: "courage",
              controller: "attack-target",
            },
            {
              type: "create-token",
              token: "quicken",
              controller: "attack-target",
            },
          ],
        },
      },
    },
  }),
});

export const { blue: intoxicatingShotBlue } = intoxicatingShot.cards;
