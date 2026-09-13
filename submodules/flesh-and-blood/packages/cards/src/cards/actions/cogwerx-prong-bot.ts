import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/cogwerx-prong-bot.generated.ts";

export const cogwerxProngBot = definePitchFamily(fabPitchFamilies["cogwerx-prong-bot"], {
  abilities: () => ({
    onHitHeroPutSteamOnCrankItem: {
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
          type: "optional",
          effect: {
            type: "add-counter",
            counter: { kind: "named", name: "steam" },
            count: 1,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: { subtypes: ["Item"] },
                hasKeyword: "crank",
              },
              count: 1,
            },
          },
        },
      },
    },
    instant: {
      kind: "activated",
      functionalZones: ["hand"],
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          { class: "asset", type: "resources", amount: 1 },
          { class: "effect", type: "discard-self" },
        ],
      },
      effect: {
        type: "create-token",
        token: "golden-cog",
        controller: "controller",
      },
    },
  }),
});

export const { yellow: cogwerxProngBotYellow } = cogwerxProngBot.cards;
