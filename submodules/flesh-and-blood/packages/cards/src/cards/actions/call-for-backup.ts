import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/call-for-backup.generated.ts";

import { attackActionFilter } from "@tcg/flesh-and-blood-types";

export const callForBackup = definePitchFamily(fabPitchFamilies["call-for-backup"], {
  abilities: () => ({
    whenDefendsChoose2AttackActionDifferentNamesGraveyard: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "choose-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["graveyard"],
                filter: attackActionFilter({ differentNames: true }),
                count: 2,
              },
              outputBinding: "them",
            },
            {
              type: "choose-card",
              chooser: "opponent",
              target: {
                selector: "binding",
                binding: "them",
              },
              outputBinding: "that-card",
            },
            {
              type: "sequence",
              steps: [
                {
                  type: "banish",
                  target: {
                    selector: "binding",
                    binding: "that-card",
                  },
                },
                {
                  type: "move-card",
                  target: {
                    selector: "binding",
                    binding: "them",
                    exclude: "that-card",
                  },
                  to: {
                    zone: "deck",
                    position: "top",
                  },
                },
              ],
            },
          ],
        },
      },
    },
  }),
});
export const { red: callForBackupRed } = callForBackup.cards;
