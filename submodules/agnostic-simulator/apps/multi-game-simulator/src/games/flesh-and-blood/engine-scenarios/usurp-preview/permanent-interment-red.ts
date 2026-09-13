import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/permanent-interment.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { satiateBloodthirstRed as satiateBloodthirstRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/satiate-bloodthirst";
import { satiateBloodthirstYellow as satiateBloodthirstYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/satiate-bloodthirst";
import { permanentIntermentRed as permanentIntermentRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/permanent-interment";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const chane = previewCard(chaneRules);
const dash = previewCard(dashRules);
const satiateBloodthirstRed = previewCard(satiateBloodthirstRedRules);
const satiateBloodthirstYellow = previewCard(satiateBloodthirstYellowRules);
const permanentIntermentRed = previewCard(permanentIntermentRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-permanent-interment-red",
  label: "Permanent Interment (red)",
  description:
    "happy: paying 2{r} turns two Shadow cards face-down and this gets +2{p}. When this attacks, you may pay up to {r}{r}{r}. Turn that many Shadow cards in your banished zone face-down. This gets +1{p} for each card turned face-down this way.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "permanent-interment-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: chane,
        hand: [permanentIntermentRed],
        banished: [
          { card: satiateBloodthirstRed, state: { faceDown: false } },
          { card: satiateBloodthirstYellow, state: { faceDown: false } },
        ],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Chane = game.as(chane);
    Chane.playAttack(permanentIntermentRed, { stopAt: "on-attack" });
    Chane.accept();
    Chane.chooseNumeric(2);
    Chane.target(
      Chane.cardIn("banished", satiateBloodthirstRed),
      Chane.cardIn("banished", satiateBloodthirstYellow),
    );
    return matchFromEngine(engine, "usurp-preview-permanent-interment-red");
  },
};
