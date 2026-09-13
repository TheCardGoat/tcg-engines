import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/blanch.generated.ts";

export const blanch = definePitchFamily(fabPitchFamilies["blanch"], {
  abilities: () => ({
    removeColors: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "attack" },
          target: { kind: "hero" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "remove-property",
          property: { kind: "color", value: "all" },
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["permanent", "hand", "arsenal", "pitch", "graveyard", "banished", "deck"],
            count: { type: "all" },
          },
          duration: "until-end-of-next-turn",
        },
      },
    },
  }),
});

export const { red: blanchRed, yellow: blanchYellow, blue: blanchBlue } = blanch.cards;
