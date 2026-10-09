import { expect, test } from "vite-plus/test";
import {
  AnimationPlanV2Schema,
  CinematicStyleSchema,
  EffectStepV2Schema,
} from "@tcg/protocol/animations";
import { compileAnimationPlan } from "@tcg/simulator-runtime/animation";
import { CINEMATIC_RECIPES, cinematicFixturePlan } from "./cinematic-recipes";

test.each(CINEMATIC_RECIPES)("$id is a valid, bounded shared-driver fixture", (recipe) => {
  const plan = AnimationPlanV2Schema.parse(cinematicFixturePlan(recipe, recipe.id));
  expect(new Set(plan.steps.map((step) => step.id)).size).toBe(plan.steps.length);
  const normal = compileAnimationPlan(plan, "normal");
  expect(normal.primaryDurationMs).toBeGreaterThan(0);
  expect(normal.primaryDurationMs + normal.reflowDurationMs).toBeLessThanOrEqual(4000);
  expect(compileAnimationPlan(plan, "off").primaryDurationMs).toBe(0);
  expect(compileAnimationPlan(plan, "normal", true).primaryDurationMs).toBe(0);
  expect(compileAnimationPlan(plan, "fast").primaryDurationMs).toBeLessThan(
    normal.primaryDurationMs,
  );
});

test("inventory covers every shared step and cinematic style without card-specific names", () => {
  const steps = CINEMATIC_RECIPES.flatMap((recipe) => recipe.steps);
  expect(new Set(steps.map((step) => step.type)).size).toBe(11);
  expect(
    new Set(
      steps.flatMap((step) => (step.type === "effect" && step.cinematic ? [step.cinematic] : [])),
    ).size,
  ).toBe(CinematicStyleSchema.options.length);
  expect(new Set(CINEMATIC_RECIPES.map((recipe) => recipe.id)).size).toBe(CINEMATIC_RECIPES.length);
  expect(EffectStepV2Schema.safeParse({ id: "legacy", type: "effect", targets: [] }).success).toBe(
    true,
  );
  expect(
    EffectStepV2Schema.safeParse({ id: "bad", type: "effect", cinematic: "ariel-sonic-warrior" })
      .success,
  ).toBe(false);
});

test("complete scenes cover all track kinds and pair effects with resolved exits and values", () => {
  const tracks = CINEMATIC_RECIPES.flatMap((recipe) =>
    recipe.steps.flatMap((step) => (step.type === "effect" ? (step.scene?.tracks ?? []) : [])),
  );
  expect(new Set(tracks.map((track) => track.kind))).toEqual(
    new Set([
      "backdrop",
      "actor",
      "travel",
      "particles",
      "area",
      "reaction",
      "material",
      "camera",
      "die",
    ]),
  );
  const volley = CINEMATIC_RECIPES.find((recipe) => recipe.id === "scene-volley")!;
  expect(volley.steps.some((step) => step.type === "valueDelta")).toBe(true);
  expect(
    volley.steps
      .flatMap((step) => (step.type === "effect" ? (step.scene?.tracks ?? []) : []))
      .find((track) => track.kind === "travel" && track.count === 5),
  ).toBeDefined();
  const wipe = CINEMATIC_RECIPES.find((recipe) => recipe.id === "scene-wipe")!;
  const exits = wipe.steps.filter((step) => step.type === "entityTransfer");
  expect(exits).toHaveLength(2);
  expect(exits[0]!.startAtMs).toBeLessThan(exits[1]!.startAtMs!);
});
