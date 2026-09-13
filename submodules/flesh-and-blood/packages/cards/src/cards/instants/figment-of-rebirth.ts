import { legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/figment-of-rebirth.generated.ts";

export const figmentOfRebirth = definePitchFamily(fabPitchFamilies["figment-of-rebirth"], {
  keywords: [legendary],
  abilities: () => ({
    whenEntersArenaMayPutYellowActionFromGraveyard: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "enter-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: {
                typeBox: {
                  types: ["Action"],
                },
                color: ["yellow"],
              },
              count: 1,
            },
            to: {
              zone: "deck",
              position: "top",
            },
          },
        },
      },
    },
  }),
});

export const { yellow: figmentOfRebirthYellow } = figmentOfRebirth.cards;
