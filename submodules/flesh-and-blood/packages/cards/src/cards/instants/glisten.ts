import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/glisten.generated.ts";

export const glisten = definePitchFamily(fabPitchFamilies["glisten"], {
  parameters: pitchMap({ red: { amount: 4 }, yellow: { amount: 3 }, blue: { amount: 2 } }),
  abilities: ({ amount }) => ({
    distributePowerCounters: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "distribute-counters",
            counter: { kind: "numeric", value: 1, property: "power" },
            count: { type: "up-to", amount },
            among: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: { typeBox: { types: ["Weapon"] } },
              count: { type: "all" },
            },
          },
          {
            type: "delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "end-phase",
                actor: { kind: "player", player: "ability-controller" },
                observes: { kind: "none" },
              },
            },
            policy: { kind: "windowed", duration: "this-turn", matching: "first" },
            resolution: {
              kind: "effect",
              effect: {
                type: "remove-all-counters",
                counter: { kind: "numeric", value: 1, property: "power" },
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["permanent"],
                  filter: { typeBox: { types: ["Weapon"] } },
                  count: { type: "all" },
                },
              },
            },
          },
        ],
      },
    },
  }),
});

export const { red: glistenRed, yellow: glistenYellow, blue: glistenBlue } = glisten.cards;
