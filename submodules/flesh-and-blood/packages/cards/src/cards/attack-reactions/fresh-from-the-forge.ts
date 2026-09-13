import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/fresh-from-the-forge.generated.ts";

export const freshFromTheForge = definePitchFamily(fabPitchFamilies["fresh-from-the-forge"], {
  keywords: [{ name: "sharpen" }],
  // Grant the on-hit rider to every dagger you control so the next dagger
  // hit this turn can pay a +1{p} counter to mark (weapon attacks stay seated).
  abilities: () => ({
    sharpenEachDaggerThenMarkOnNextHit: {
      type: "sequence",
      steps: [
        {
          type: "sharpen",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["weapon", "permanent"],
            filter: { typeBox: { subtypes: ["Dagger"] } },
            count: { type: "all" },
          },
        },
        {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              kind: "static",
              staticKind: "triggered",
              id: "onHit",
              text: "",
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
                  type: "optional",
                  effect: {
                    type: "remove-counters",
                    counter: { kind: "numeric", value: 1, property: "power" },
                    count: 1,
                    target: { selector: "self" },
                  },
                  then: {
                    type: "mark",
                    target: { selector: "attack-target" },
                  },
                },
              },
            },
          },
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["weapon", "permanent"],
            filter: { typeBox: { subtypes: ["Dagger"] } },
            count: { type: "all" },
          },
          duration: "this-turn",
        },
      ],
    },
  }),
});

export const { red: freshFromTheForgeRed } = freshFromTheForge.cards;
