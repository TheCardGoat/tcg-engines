import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import type { AnimationSpeed } from "@tcg/simulator-runtime/animation";
import {
  useAnimationNode,
  useOptionalAnimationRuntime,
  AnimatedEntitySlot,
  AnimatedZoneSlot,
  AnimationAnchor,
  createSimulatorAnimationScope,
  simulatorBoardCenterAnimationRef,
  type SimulatorEntityVisualProps,
} from "@tcg/simulator-ui";
import { CINEMATIC_RECIPES, cinematicFixturePlan, type CinematicRecipe } from "./cinematic-recipes";
import classes from "./CinematicBench.module.css";

interface BenchState {
  moved: boolean;
  hidden: boolean;
  rotated: boolean;
  exited: readonly string[];
  values: Readonly<Record<string, number>>;
}
const initialState: BenchState = {
  moved: false,
  hidden: false,
  rotated: false,
  exited: [],
  values: { "cinematic-source": 2, "cinematic-target": 8, "cinematic-other": 8 },
};
const Scope = createSimulatorAnimationScope<BenchState>();
const ids = ["cinematic-source", "cinematic-target", "cinematic-other", "cinematic-host"];

function getEntity(
  state: BenchState,
  id: string,
  face: "public" | "hidden",
): SimulatorEntity | null {
  if (!ids.includes(id)) return null;
  const hidden = face === "hidden" || (id === ids[0] && state.hidden);
  return {
    id,
    title: hidden
      ? "Hidden card"
      : id === ids[0]
        ? "Source"
        : id === ids[1]
          ? "Target A"
          : id === ids[2]
            ? "Target B"
            : "Host",
    subtitle: "",
    kind: "card",
    ownerId: "fixture",
    face: hidden ? "hidden" : "public",
    states: id === ids[0] && state.rotated ? ["rested"] : ["ready"],
    stats: [{ label: "Value", value: String(state.values[id] ?? 0) }],
    traits: [],
    imageAspectRatio: 0.714,
  };
}

function FixtureCard({ entity, presentation }: SimulatorEntityVisualProps) {
  const runtime = useOptionalAnimationRuntime();
  const delta =
    runtime?.activeTransition?.phase === "running"
      ? runtime.compiledPlan?.steps.find(
          (item) => item.step.type === "valueDelta" && item.step.subject.id === entity.id,
        )
      : undefined;
  const before = delta?.step.type === "valueDelta" ? delta.step.fromValue : undefined;
  return (
    <div
      className={classes.card}
      data-face={entity.face}
      data-sim-entity-id={entity.id}
      style={{
        transform:
          (!presentation || presentation === "default") && entity.states.includes("rested")
            ? "rotate(90deg)"
            : undefined,
      }}
    >
      <svg className={classes.cardArt} viewBox="0 0 100 100" aria-hidden>
        <path
          d="M 50 8 L 86 32 L 90 70 L 50 95 L 10 70 L 14 32 Z"
          fill="#253649"
          stroke="#e0b967"
          strokeWidth="2"
        />
        <path
          d="M 50 8 V 95 M 14 32 L 50 62 L 86 32 M 10 70 H 90"
          fill="none"
          stroke="#78d8c2"
          strokeWidth="2"
        />
      </svg>
      <span className={classes.cardMark} aria-hidden>
        {entity.face === "hidden" ? "◇" : "✦"}
      </span>
      <strong>{entity.title}</strong>
      <small>Shared renderer fixture</small>
      <span className={classes.counter} aria-label={`${entity.title} value`}>
        {before !== undefined && delta ? (
          <>
            <motion.span
              className={classes.oldCounter}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: delta.startAtMs / 1000, duration: 0.08 }}
            >
              {before}
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delta.startAtMs / 1000, duration: 0.08 }}
            >
              {entity.stats[0]?.value}
            </motion.span>
          </>
        ) : (
          entity.stats[0]?.value
        )}
      </span>
    </div>
  );
}

export function CinematicBench() {
  const [speed, setSpeed] = useState<AnimationSpeed>("normal");
  return (
    <Scope.Root
      sessionKey="cinematic-bench"
      initialState={initialState}
      initialVersion={0}
      projection={{ getEntity, getZone: () => null }}
      entityRenderer={FixtureCard}
      viewerSeatId="fixture"
      animationSpeed={speed}
    >
      <BenchControls speed={speed} setSpeed={setSpeed} />
    </Scope.Root>
  );
}

function BenchControls({
  speed,
  setSpeed,
}: {
  speed: AnimationSpeed;
  setSpeed: (speed: AnimationSpeed) => void;
}) {
  const [selected, setSelected] = useState(CINEMATIC_RECIPES[0]!);
  const [category, setCategory] = useState("All");
  const [missingTarget, setMissingTarget] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("Ready");
  const generation = useRef(0);
  const version = useRef(0);
  const actions = Scope.useActions();
  const status = Scope.useStatus();
  const snapshot = Scope.useState();
  const state = snapshot.presentationState ?? initialState;
  const boardRef = useAnimationNode(
    { kind: "anchor", id: "cinematic-board" },
    { presence: "present" },
  );
  useEffect(
    () => () => {
      generation.current++;
    },
    [],
  );

  const reset = () => {
    generation.current++;
    actions.replaceFromSync({ state: initialState, version: ++version.current });
    setBusy(false);
    setProgress("Reset; overlays cleared");
  };
  const run = async (recipes: readonly CinematicRecipe[]) => {
    const runId = ++generation.current;
    setBusy(true);
    for (const [index, recipe] of recipes.entries()) {
      if (runId !== generation.current) return;
      setSelected(recipe);
      setProgress(`Playing ${index + 1}/${recipes.length}: ${recipe.title}`);
      const valuesBefore = { ...initialState.values },
        valuesAfter = { ...initialState.values };
      for (const step of recipe.steps)
        if (step.type === "valueDelta" && step.subject.kind === "entity") {
          if (step.fromValue !== undefined) valuesBefore[step.subject.id] = step.fromValue;
          if (step.toValue !== undefined) valuesAfter[step.subject.id] = step.toValue;
        }
      actions.replaceFromSync({
        state: { ...initialState, hidden: recipe.id === "reveal-move", values: valuesBefore },
        version: ++version.current,
      });
      // Let baseline anchors commit before the driver captures source geometry.
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );
      if (runId !== generation.current) return;
      const nextVersion = ++version.current;
      const accepted = actions.enqueue({
        state: {
          moved: recipe.moved ?? false,
          hidden: recipe.hidden ?? false,
          rotated: recipe.rotation === 90,
          exited: recipe.exited ?? [],
          values: valuesAfter,
        },
        version: nextVersion,
        plan: cinematicFixturePlan(recipe, `cinematic:${nextVersion}`),
        source: "local",
      });
      if (!accepted || (await actions.whenIdle(10000)) === "timeout") {
        setProgress(`Did not settle: ${recipe.title}`);
        setBusy(false);
        return;
      }
    }
    if (runId !== generation.current) return;
    setProgress(`Settled ${recipes.length}/${recipes.length}. Inspect visuals separately.`);
    setBusy(false);
  };

  const categories = [...new Set(CINEMATIC_RECIPES.map((item) => item.category))];
  const filtered = CINEMATIC_RECIPES.filter(
    (item) => category === "All" || item.category === category,
  );
  const source = getEntity(state, ids[0]!, "public")!;
  const renderCard = (entity: SimulatorEntity, zoneId?: string) => (
    <AnimatedEntitySlot
      key={entity.id}
      entity={entity}
      density="normal"
      zoneRef={zoneId ? { kind: "zone", id: zoneId } : undefined}
      className={classes.cardSlot}
    >
      <FixtureCard entity={entity} density="normal" />
    </AnimatedEntitySlot>
  );

  return (
    <section
      className={classes.bench}
      aria-labelledby="cinematic-bench-heading"
      data-cinematic-bench
      data-playback-phase={status.phase ?? "idle"}
    >
      <header className={classes.header}>
        <div>
          <p className={classes.eyebrow}>GAME-AGNOSTIC VISUAL FIXTURES</p>
          <h2 id="cinematic-bench-heading">Cinematic inventory</h2>
        </div>
        <span>
          {CINEMATIC_RECIPES.length} recipes · {categories.length} categories
        </span>
      </header>
      <p className={classes.muted}>
        Inspect complete motion sequences and reusable effects with original artwork. Game event
        mappings are validated separately.
      </p>
      <div className={classes.controls}>
        <label>
          Category
          <select
            aria-label="Cinematic category"
            value={category}
            disabled={busy}
            onChange={(event) => {
              setCategory(event.target.value);
              setSelected(
                CINEMATIC_RECIPES.find(
                  (item) => event.target.value === "All" || item.category === event.target.value,
                )!,
              );
            }}
          >
            <option>All</option>
            {categories.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label>
          Recipe
          <select
            aria-label="Cinematic recipe"
            value={selected.id}
            disabled={busy}
            onChange={(event) =>
              setSelected(CINEMATIC_RECIPES.find((item) => item.id === event.target.value)!)
            }
          >
            {(busy ? CINEMATIC_RECIPES : filtered).map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Speed
          <select
            aria-label="Cinematic speed"
            value={speed}
            onChange={(event) => {
              const next = event.target.value;
              if (next === "off" || next === "fast" || next === "normal" || next === "slow")
                setSpeed(next);
            }}
          >
            {["normal", "slow", "fast", "off"].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label className={classes.check}>
          <input
            type="checkbox"
            checked={missingTarget}
            disabled={busy}
            onChange={(event) => setMissingTarget(event.target.checked)}
          />
          Missing targets
        </label>
        <button disabled={busy} onClick={() => void run([selected])}>
          Play recipe
        </button>
        <button disabled={busy} onClick={() => void run(filtered)}>
          Run category
        </button>
        <button
          disabled={!busy && !status.isAnimating}
          onClick={() => {
            generation.current++;
            actions.skipActive("fixture-skip");
            setBusy(false);
            setProgress("Skipped; overlays cleared");
          }}
        >
          Skip
        </button>
        <button onClick={reset}>Reset</button>
      </div>
      <p className={classes.description}>
        <strong>
          {selected.category} / {selected.title}
        </strong>{" "}
        — {selected.description}
      </p>
      <div ref={boardRef} className={classes.stage} data-cinematic-stage>
        <AnimationAnchor
          animationRef={simulatorBoardCenterAnimationRef}
          style={{ position: "absolute", left: "50%", top: "50%", width: 1, height: 1 }}
        />
        <div className={classes.row}>
          {!missingTarget && (
            <>
              <AnimatePresence>
                {!state.exited.includes(ids[1]!) &&
                  renderCard(getEntity(state, ids[1]!, "public")!)}
                {!state.exited.includes(ids[2]!) &&
                  renderCard(getEntity(state, ids[2]!, "public")!)}
              </AnimatePresence>
            </>
          )}
          {missingTarget && <span className={classes.muted}>Target nodes removed</span>}
        </div>
        <div className={classes.row}>
          <AnimatedZoneSlot
            animationRef={{ kind: "zone", id: "cinematic-origin" }}
            className={classes.zone}
          >
            <span className={classes.zoneLabel}>Origin</span>
            <AnimatePresence>
              {!state.moved && renderCard(source, "cinematic-origin")}
            </AnimatePresence>
          </AnimatedZoneSlot>
          <AnimatedZoneSlot
            animationRef={{ kind: "zone", id: "cinematic-destination" }}
            className={classes.zone}
          >
            <span className={classes.zoneLabel}>Destination</span>
            {selected.id === "underlay" && (
              <div className={classes.host}>{renderCard(getEntity(state, ids[3]!, "public")!)}</div>
            )}
            <AnimatePresence>
              {state.moved && renderCard(source, "cinematic-destination")}
            </AnimatePresence>
          </AnimatedZoneSlot>
        </div>
        <AnimatedZoneSlot
          animationRef={{ kind: "zone", id: "cinematic-discard" }}
          className={classes.discard}
        >
          <span className={classes.zoneLabel}>Discard</span>
          <AnimatePresence>
            {state.exited.map((id) =>
              renderCard(getEntity(state, id, "public")!, "cinematic-discard"),
            )}
          </AnimatePresence>
        </AnimatedZoneSlot>
      </div>
      <p className={classes.progress} data-cinematic-progress aria-live="polite">
        {progress} · Playback: {status.phase ?? "idle"}
      </p>
    </section>
  );
}
