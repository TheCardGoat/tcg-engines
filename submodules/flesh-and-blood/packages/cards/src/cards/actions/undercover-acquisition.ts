import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/undercover-acquisition.generated.ts";
import { stealth } from "../shared/keywords.ts";

export const undercoverAcquisition = definePitchFamily(fabPitchFamilies["undercover-acquisition"], {
  keywords: [stealth],
  abilities: () => ({
    whenHitsHeroStealItemTheyControl: {
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
          type: "gain-control",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["permanent"],
            filter: {
              typeBox: {
                subtypes: ["Item"],
              },
            },
            count: 1,
          },
          controller: "controller",
          duration: "this-turn",
        },
      },
      label: {
        name: "steal",
      },
    },
  }),
});

export const { red: undercoverAcquisitionRed } = undercoverAcquisition.cards;
