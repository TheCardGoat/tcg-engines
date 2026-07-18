import {
  carlFredricksenLovingHusband,
  carlFredricksenRussellIntrepidExplorers,
  darkwingDuckLaunchpadStCanardsFinest,
  darkwingDuckShadowySuperhero,
  launchpadSkyPatrol,
  russellSeniorWildernessExplorer,
} from "@tcg/lorcana-cards/cards/013";
import { createFixture } from "../fixture-factory.js";

export const feedback20260713TeamShiftAlternativesFixture = createFixture({
  id: "feedback-2026-07-13-team-shift-alternatives",
  name: "Feedback 2026-07-13 - Team Shift alternatives",
  description:
    "Visual regression for feedback fbFhM5Ny8Cy546uOBJ00ot2 and fbQCRyeUXWhVvKqDxz_HTPL. Darkwing Duck & Launchpad must offer either Darkwing Duck or Launchpad as a Shift target; Carl Fredricksen & Russell must offer either Carl Fredricksen or Russell.",
  playerOne: {
    hand: [darkwingDuckLaunchpadStCanardsFinest, carlFredricksenRussellIntrepidExplorers],
    play: [
      darkwingDuckShadowySuperhero,
      launchpadSkyPatrol,
      carlFredricksenLovingHusband,
      russellSeniorWildernessExplorer,
    ],
    inkwell: 5,
    deck: [],
  },
  playerTwo: {},
  seed: "feedback-2026-07-13-team-shift-alternatives",
  skipPreGame: true,
});
