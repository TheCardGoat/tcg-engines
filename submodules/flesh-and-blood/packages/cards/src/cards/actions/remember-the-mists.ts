import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/remember-the-mists.generated.ts";

export const rememberTheMists = definePitchFamily(fabPitchFamilies["remember-the-mists"], {
  abilities: () => ({
    hit: {
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
          type: "sequence",
          steps: [
            {
              type: "look",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "attack-target",
                zones: ["hand"],
                count: { type: "all" },
              },
            },
            {
              type: "choose-card",
              target: { selector: "binding", binding: "revealed-this-way", count: 1 },
              outputBinding: "chosen",
            },
            { type: "banish", target: { selector: "binding", binding: "chosen" } },
            {
              type: "grant-property",
              property: {
                kind: "ability",
                ability: {
                  kind: "static",
                  staticKind: "play",
                  id: "playBanishedCard",
                  text: "",
                  playEffect: { role: "permission", fromZones: ["banished"] },
                },
              },
              target: { selector: "binding", binding: "chosen" },
              duration: "until-end-of-next-turn",
            },
          ],
        },
      },
    },
    bonus: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "not",
        condition: {
          type: "played-this",
          per: "turn",
          onlySource: true,
          filter: { playedFromZones: ["hand", "arsenal"] },
        },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: { selector: "self" },
        duration: "while-condition",
      },
    },
  }),
});

export const { blue: rememberTheMistsBlue } = rememberTheMists.cards;
