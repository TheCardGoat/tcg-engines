import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/runner-runner.generated.ts";

export const runnerRunner = definePitchFamily(fabPitchFamilies["runner-runner"], {
  supertypeSets: [["Brute"], ["Warrior"]],
  abilities: () => ({
    attacksGoAgainCreateAgilityToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
        state: {
          type: "has-keyword",
          keyword: "go-again",
          target: {
            selector: "binding",
            binding: "it",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "agility",
          controller: "controller",
        },
      },
    },
  }),
});

export const { red: runnerRunnerRed } = runnerRunner.cards;
