import { stealth } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/persuasive-prognosis.generated.ts";

export const persuasivePrognosis = definePitchFamily(fabPitchFamilies["persuasive-prognosis"], {
  keywords: [stealth],
  abilities: () => ({
    hitsBanishTopDeckThenLookHandBanishSameColorBanished: {
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
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              outputBinding: "banished",
            },
            {
              type: "sequence",
              steps: [
                {
                  type: "look",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "opponent",
                    zones: ["hand"],
                    count: {
                      type: "all",
                    },
                  },
                },
                {
                  type: "banish",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "opponent",
                    zones: ["hand"],
                    filter: {
                      color: ["same-as-banished"],
                    },
                    count: 1,
                  },
                },
              ],
            },
          ],
        },
      },
    },
    wheneverBanishesActionGain1Life: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "banish",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "moved-object",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                types: ["Action"],
              },
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "gain-life",
          amount: 1,
          target: {
            selector: "controller",
          },
        },
      },
    },
  }),
});

export const { blue: persuasivePrognosisBlue } = persuasivePrognosis.cards;
