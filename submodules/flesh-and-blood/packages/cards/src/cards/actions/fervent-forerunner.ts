import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/fervent-forerunner.generated.ts";
import { goAgain, opt } from "../shared/keywords.ts";

export const ferventForerunner = definePitchFamily(fabPitchFamilies["fervent-forerunner"], {
  keywords: [opt(2), goAgain],
  abilities: () => ({
    onHitOpt: {
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
      resolution: { kind: "effect", effect: { type: "opt", count: 2 } },
    },
    arsenalGoAgain: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "played-card" },
          from: ["arsenal"],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "grant-property",
          property: { kind: "keyword", keyword: goAgain },
          target: { selector: "self" },
          duration: "permanent",
        },
      },
    },
  }),
});

export const {
  red: ferventForerunnerRed,
  yellow: ferventForerunnerYellow,
  blue: ferventForerunnerBlue,
} = ferventForerunner.cards;
