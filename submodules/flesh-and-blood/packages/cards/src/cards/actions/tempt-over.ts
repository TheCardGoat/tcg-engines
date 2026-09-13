import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tempt-over.generated.ts";

export const temptOver = definePitchFamily(fabPitchFamilies["tempt-over"], {
  abilities: () => ({
    whenAttacksHeroStealAuraTokenTheyControlUntilEndTurn: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
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
                subtypes: ["Aura"],
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

export const { yellow: temptOverYellow } = temptOver.cards;
