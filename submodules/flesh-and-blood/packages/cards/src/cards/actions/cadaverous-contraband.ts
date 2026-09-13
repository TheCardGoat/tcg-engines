import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/cadaverous-contraband.generated.ts";

export const cadaverousContraband = definePitchFamily(fabPitchFamilies["cadaverous-contraband"], {
  abilities: () => ({
    recycleNonAttack: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "attack" },
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
              filter: { typeBox: { types: ["Action"], excludeSubtypes: ["Attack"] } },
              count: 1,
            },
            to: { zone: "deck", position: "top" },
          },
        },
      },
    },
  }),
});

export const {
  red: cadaverousContrabandRed,
  yellow: cadaverousContrabandYellow,
  blue: cadaverousContrabandBlue,
} = cadaverousContraband.cards;
