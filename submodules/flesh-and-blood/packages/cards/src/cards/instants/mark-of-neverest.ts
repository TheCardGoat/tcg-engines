import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/mark-of-neverest.generated.ts";

const turnBanishedCardFaceDownAndCreateCorpse = {
  type: "optional" as const,
  effect: {
    type: "turn-face-down" as const,
    target: {
      selector: "object" as const,
      declared: "at-resolution" as const,
      player: "controller" as const,
      zones: ["banished"] as const,
      filter: { hasStatus: "face-up" as const },
      count: 1,
    },
  },
  then: {
    type: "create-card" as const,
    name: "Corrupted Corpse",
    to: { zone: "banished" as const },
  },
};

export const markOfNeverest = definePitchFamily(fabPitchFamilies["mark-of-neverest"], {
  abilities: () => ({
    bindToAlly: {
      kind: "resolution",
      effect: {
        type: "bind-aura",
        target: {
          selector: "object",
          declared: "on-stack",
          player: "controller",
          zones: ["permanent"],
          filter: { typeBox: { subtypes: ["Ally"] } },
          count: 1,
        },
      },
    },
    boundAllyHasPowerAndNeverestRiders: {
      kind: "static",
      staticKind: "while",
      condition: { type: "source-is-subcard-of-host" },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: { selector: "host" },
            duration: "while-condition",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "markOfNeverestHit",
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
                resolution: { kind: "effect", effect: turnBanishedCardFaceDownAndCreateCorpse },
              },
            },
            target: { selector: "host" },
            duration: "while-condition",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "markOfNeverestDies",
                text: "",
                trigger: {
                  kind: "event",
                  event: {
                    name: "dies",
                    actor: { kind: "any" },
                    observes: { kind: "source", selector: "moved-object" },
                  },
                },
                resolution: { kind: "effect", effect: turnBanishedCardFaceDownAndCreateCorpse },
              },
            },
            target: { selector: "host" },
            duration: "while-condition",
          },
        ],
      },
    },
  }),
});
export const { blue: markOfNeverestBlue } = markOfNeverest.cards;
