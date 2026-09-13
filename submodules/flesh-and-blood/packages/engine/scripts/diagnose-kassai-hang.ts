import { fleshAndBloodDeckCardLibrary } from "../../cards/src/deck-library.ts";
import { playFabMatch } from "../src/automation/bench/play-match.ts";

const played = playFabMatch({
  cardLibrary: fleshAndBloodDeckCardLibrary,
  seed: "improve-kassai-1-0",
  p1Strategy: "hero-profile",
  p2Strategy: "value-extract",
  p1Deck: "cc-las-vegas-1st-kassai",
  p2Deck: "cc-edinburgh-1st-gravy-bones",
  maxActions: 400,
  recordFrames: true,
});
const counts = new Map<string, number>();
for (const frame of played.frames) {
  const key = `${frame.chosen.move}|${frame.chosen.label.slice(0, 55)}`;
  counts.set(key, (counts.get(key) ?? 0) + 1);
}
const last = played.frames.at(-1);
const passFrames = played.frames.filter(
  (frame) => frame.chosen.move === "pass" && frame.chosen.label === "Pass",
);
const converting = (label: string) =>
  label.startsWith("Play ") ||
  label.startsWith("End turn") ||
  (label.startsWith("Activate ") && /attack/i.test(label)) ||
  (label.startsWith("Defend with") && label !== "Do not defend");
const passWithProgress = passFrames.filter((frame) => frame.legal.some(converting));
console.log(
  JSON.stringify(
    {
      termination: played.termination,
      actionCount: played.actionCount,
      turnCount: played.turnCount,
      life: last?.life,
      opponentLife: last?.opponentLife,
      passes: passFrames.length,
      passWithProgress: passWithProgress.length,
      samplePassLegal: passFrames[10]?.legal.slice(0, 12),
      samplePassWithProgress: passWithProgress[0]?.legal.filter(converting).slice(0, 8),
      top: [...counts.entries()].sort((left, right) => right[1] - left[1]).slice(0, 12),
    },
    null,
    2,
  ),
);
