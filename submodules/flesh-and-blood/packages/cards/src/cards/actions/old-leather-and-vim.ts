import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/old-leather-and-vim.generated.ts";

export const oldLeatherAndVim = definePitchFamily(fabPitchFamilies["old-leather-and-vim"], {
  abilities: () => ({
    toughnessVigorTokenGets1Power: {
      kind: "resolution",
      condition: {
        type: "control-object",
        filter: {
          name: "Toughness Or Vigor",
          typeBox: {
            metatypes: ["Token"],
          },
        },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
    hitsCreateToughnessVigorToken: {
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
              token: "toughness",
              controller: "controller",
            },
            {
              type: "create-token",
              token: "vigor",
              controller: "controller",
            },
          ],
        },
      },
    },
  }),
});

export const { red: oldLeatherAndVimRed } = oldLeatherAndVim.cards;
