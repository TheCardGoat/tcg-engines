import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { Canvas, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "three";
import { InteractionWorkspace, useInteractionSurface } from "@tcg/simulator-ui";
import {
  SceneCard,
  CardSelectionRim,
  useSceneTextures,
  useCardPose,
} from "@tcg/simulator-presentation/three";
import { CardInspectionControls, useCardInspection } from "@tcg/simulator-presentation/inspection";
import { inspectionPose, inspectionMotion } from "@tcg/simulator-presentation/inspection-pose";
import type { TargetCard } from "@tcg/simulator-presentation/target-modal";
import {
  validateInteractionSubmission,
  type EngineInteractionView,
  type InteractionInput,
  type InteractionSubmission,
} from "@tcg/protocol";
import { SharedInteractionPrompt } from "./SharedInteractionPrompt";
import { interactionArtCards, interactionCatalog } from "./interaction-catalog";
import { buildMountedHref } from "../routes/router-paths";
import "./shared-prompt-fixture.css";

const scenarios = [
  ["multi-target", "1 · Target sheet"],
  ["spatial", "2 · Board targeting"],
  ["disabled-target", "3 · Unavailable targets"],
  ["options", "4 · Effect choices"],
  ["boolean", "5 · Optional effect"],
  ["ordering", "6 · Card order"],
  ["partition", "7 · Destinations"],
  ["allocation", "8 · Distribution"],
  ["conditional", "9 · Multi-step decision"],
  ["empty-target", "10 · Empty results"],
  ["player-target", "11 · Player target"],
] as const;
const art = interactionArtCards.map((card) => card.imageUrl);
const cards = new Map<string, TargetCard>([
  ["alpha", { id: "alpha", label: "Spirit of Fire", imageUrl: art[0], group: "Your field" }],
  ["beta", { id: "beta", label: "Spirit of Wind", imageUrl: art[1], group: "Your field" }],
  ["gamma", { id: "gamma", label: "Hasty Messenger", imageUrl: art[2], group: "Your graveyard" }],
  ["opponent", { id: "opponent", label: "Opponent", group: "Players" }],
]);
const source: TargetCard = {
  id: "source",
  label: "Fixture effect",
  imageUrl: art[2],
  detail: "Choose how this effect resolves.",
};

export default function SharedPromptFixture() {
  const [search, setSearch] = useSearchParams();
  const id = search.get("case") ?? "multi-target";
  const [generation, setGeneration] = useState(1);
  return (
    <main className="prompt-lab">
      <header className="prompt-lab__header">
        <div>
          <small>SHARED PRESENTATION · QA</small>
          <h1>Game prompts</h1>
        </div>
        <a href={buildMountedHref("/simulator-ui-fixtures/interactions")}>Interaction inventory</a>
        <label>
          Scenario{" "}
          <select value={id} onChange={(event) => setSearch({ case: event.target.value })}>
            {scenarios.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <button onClick={() => setGeneration((n) => n + 1)}>New request / reset</button>
      </header>
      <FixtureCase key={id + generation} id={id} generation={generation} />
    </main>
  );
}
function fixtureCandidateNames(input: InteractionInput): InteractionInput {
  const label = <T extends { entity: { instanceId: string } }>(candidate: T) => ({
    ...candidate,
    text: { key: cards.get(candidate.entity.instanceId)?.label ?? "Target" },
  });
  // Allocation candidates also carry individual bounds. Preserve that subtype.
  if (input.kind === "entity-allocation")
    return { ...input, candidates: input.candidates.map(label) };
  return "candidates" in input ? { ...input, candidates: input.candidates.map(label) } : input;
}
function FixtureCase({ id, generation }: { id: string; generation: number }) {
  const base =
    interactionCatalog.find((fixture) => fixture.id === (id === "spatial" ? "multi-target" : id)) ??
    interactionCatalog[0];
  const [paused, setPaused] = useState(false);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [reject, setReject] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const view = useMemo<EngineInteractionView>(
    () => ({
      ...base.view,
      gameSlug: "grand-archive",
      stateVersion: generation,
      status: done ? "ready" : "choosing",
      actions: done
        ? []
        : base.view.actions.map((action) => ({
            ...action,
            requestId: `${action.requestId}:qa:${generation}`,
            inputs: action.inputs.map((input) =>
              id === "player-target" ? input : fixtureCandidateNames(input),
            ),
          })),
      resolution: done ? undefined : base.view.resolution,
    }),
    [base, generation, done, id],
  );
  const submit = useCallback(
    (submission: InteractionSubmission) => {
      const valid = validateInteractionSubmission(view, submission);
      if (!valid.ok) {
        setLog((rows) => [...rows, "Blocked: invalid submission."]);
        return false;
      }
      setLog((rows) => [
        ...rows,
        `${reject ? "Rejected" : "Submitted"}: ${JSON.stringify(submission.values)}`,
      ]);
      if (reject) {
        setReject(false);
        return false;
      }
      setPending(true);
      return true;
    },
    [view, reject],
  );
  return (
    <>
      <div className="prompt-lab__tools">
        <label>
          <input
            type="checkbox"
            checked={paused}
            onChange={(event) => setPaused(event.target.checked)}
          />{" "}
          Pause input
        </label>
        <label>
          <input
            type="checkbox"
            checked={reject}
            onChange={(event) => setReject(event.target.checked)}
          />{" "}
          Reject next submission
        </label>
        <button
          disabled={!pending}
          onClick={() => {
            setDone(true);
            setPending(false);
          }}
        >
          Acknowledge result
        </button>
        <span>
          {done
            ? "Completed"
            : pending
              ? "Awaiting authoritative update"
              : paused
                ? "Input paused"
                : "Decision active"}
        </span>
      </div>
      <InteractionWorkspace
        view={view}
        viewerId="player"
        onSubmit={submit}
        disabled={paused || pending}
      >
        <FixtureBoard view={view} spatial={id === "spatial"} disabled={paused || pending} />
      </InteractionWorkspace>
      <footer className="prompt-lab__evidence">
        <p>
          {base.description} Minimize to view the board, then restore to continue. Board targeting
          uses the same selection as the sheet. Closing never skips a required choice.
        </p>
        <details open>
          <summary>Submission evidence ({log.length})</summary>
          <pre aria-live="polite">{log.join("\n") || "No submission yet."}</pre>
        </details>
        <small>
          Presentation/protocol fixture. No native game rules or hosted match are executed.
        </small>
      </footer>
    </>
  );
}
function FixtureBoard({
  view,
  spatial,
  disabled,
}: {
  view: EngineInteractionView;
  spatial: boolean;
  disabled: boolean;
}) {
  const surface = useInteractionSurface(view, {
    visibleEntityIds: new Set(spatial ? ["alpha", "beta", "gamma"] : []),
    disabled,
  });
  const inspection = useCardInspection<TargetCard>();
  const [reduced, setReduced] = useState(false);
  return (
    <section className="prompt-lab__board" aria-label="Three Fiber prompt fixture">
      <label className="prompt-lab__motion">
        <input
          type="checkbox"
          checked={reduced}
          onChange={(event) => setReduced(event.target.checked)}
        />{" "}
        Reduced motion
      </label>
      <Canvas
        orthographic
        camera={{ position: [0, 0, 10], near: 0.1, far: 100, zoom: 65 }}
        frameloop="demand"
        dpr={[1, 1.5]}
      >
        <FixtureScene surface={surface} reduced={reduced} inspectionId={inspection.card?.id} />
      </Canvas>
      {!inspection.card && (
        <div className="prompt-lab__board-actions">
          {["alpha", "beta", "gamma"].map((id) => (
            <button
              key={id}
              disabled={surface.locked || !surface.candidateIds.has(id)}
              aria-pressed={surface.selectedIds.has(id)}
              onClick={() => surface.select(id)}
            >
              {surface.selectedIds.has(id) ? "Selected: " : "Select: "}
              {cards.get(id)?.label}
            </button>
          ))}
        </div>
      )}
      {!inspection.card && (
        <SharedInteractionPrompt
          surface={surface}
          view={view}
          viewerId="player"
          cards={cards}
          source={source}
          onInspect={(card) => {
            surface.minimize();
            inspection.inspect(card);
          }}
        />
      )}
      {inspection.card && (
        <CardInspectionControls label={inspection.card.label} onClose={inspection.dismiss} />
      )}
    </section>
  );
}
function FixtureScene({
  surface,
  reduced,
  inspectionId,
}: {
  surface: ReturnType<typeof useInteractionSurface>;
  reduced: boolean;
  inspectionId?: string;
}) {
  const { camera, size, invalidate } = useThree();
  const textures = useSceneTextures(art);
  useLayoutEffect(() => {
    if (!(camera instanceof OrthographicCamera)) return;
    camera.zoom = Math.min(size.width / 10, size.height / 7);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size, invalidate]);
  return (
    <>
      <ambientLight intensity={2} />
      <directionalLight position={[0, 5, 10]} intensity={2} />
      <mesh position={[0, 0, -0.2]}>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial color="#101e26" roughness={0.85} />
      </mesh>
      {["alpha", "beta", "gamma"].map((id, i) => (
        <FixtureCard
          key={id}
          id={id}
          index={i}
          texture={textures.get(art[i])?.texture}
          selected={surface.selectedIds.has(id)}
          active={!inspectionId && !surface.locked && surface.candidateIds.has(id)}
          onPick={() => surface.select(id)}
          inspecting={inspectionId === id}
          reduced={reduced}
        />
      ))}
    </>
  );
}
function FixtureCard({
  id,
  index,
  texture,
  selected,
  active,
  onPick,
  inspecting,
  reduced,
}: {
  id: string;
  index: number;
  texture?: import("three").Texture;
  selected: boolean;
  active: boolean;
  onPick: () => void;
  inspecting: boolean;
  reduced: boolean;
}) {
  const { camera, size } = useThree();
  const focused = inspectionPose(camera, {
    distance: 5,
    aspect: 5 / 7,
    viewportAspect: size.width / size.height,
  });
  const pose = useCardPose(
    inspecting
      ? focused
      : {
          x: (index - 1) * 2.65,
          y: 0.45,
          z: selected ? 0.3 : 0,
          scale: selected ? 1.65 : 1.5,
          turn: 0,
        },
    {
      reduced,
      rotationX: 0,
      resetKey: id,
      transition: { key: inspecting, duration: inspectionMotion.enterSeconds, lift: 0.4 },
    },
  );
  return (
    <group
      ref={pose}
      onClick={(event) => {
        event.stopPropagation();
        if (active) onPick();
      }}
    >
      <SceneCard rounded texture={texture} edgeColor="#182027" />
      {selected && !inspecting && <CardSelectionRim selected aspect={5 / 7} />}
    </group>
  );
}
