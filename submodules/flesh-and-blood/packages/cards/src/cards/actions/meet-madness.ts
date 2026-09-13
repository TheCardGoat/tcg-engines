import { semanticTriggeredModalResolution } from "../../authoring/card.ts";
import { stealth } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/meet-madness.generated.ts";

export const meetMadness = definePitchFamily(fabPitchFamilies["meet-madness"], {
  keywords: [stealth],
  abilities: () => ({
    hitsChoose1RandomChooseHandBanishChooseArsenalBanishBanishTopDeck: {
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
      resolution: semanticTriggeredModalResolution({
        kind: "modal",
        choose: 1,
        random: true,
        modes: {
          chooseHandBanish: {
            kind: "resolution",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "choose-card",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "attack-target",
                    zones: ["hand"],
                    count: 1,
                  },
                  outputBinding: "it",
                },
                {
                  type: "banish",
                  target: {
                    selector: "binding",
                    binding: "it",
                  },
                },
              ],
            },
          },
          chooseArsenalBanish: {
            kind: "resolution",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "choose-card",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "attack-target",
                    zones: ["arsenal"],
                    count: 1,
                  },
                  outputBinding: "it",
                },
                {
                  type: "banish",
                  target: {
                    selector: "binding",
                    binding: "it",
                  },
                },
              ],
            },
          },
          banishTopDeck: {
            kind: "resolution",
            effect: {
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
          },
        },
      }),
    },
  }),
});

export const { red: meetMadnessRed } = meetMadness.cards;
