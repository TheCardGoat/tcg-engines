import { Button } from "@mantine/core";
import SharedPromptFixture from "./SharedPromptFixture";
import InteractionMotionFixture from "./InteractionMotionFixture";
import classes from "./InteractionCatalogPage.module.css";
import { interactionGameAudit } from "./interaction-audit";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { Canvas } from "@react-three/fiber";
import { buildMountedHref } from "../routes/router-paths";
import {
  buildInteractionSubmission,
  validateInteractionSubmission,
  type InteractionSubmission,
  type InteractionSubmissionValue,
} from "@tcg/protocol";
import { InteractionResolutionPrompt } from "@tcg/simulator-ui";
import { interactionCatalog } from "./interaction-catalog";

export default function InteractionCatalogPage() {
  const { scenario } = useParams();
  const [search] = useSearchParams();
  const embedded = search.get("layout") === "panel";
  if (scenario === "shared-prompts") return <SharedPromptFixture />;
  if (scenario === "motion-lock") return <InteractionMotionFixture />;
  const fixture = interactionCatalog.find((item) => item.id === scenario);
  if (!fixture)
    return (
      <main className={classes.page}>
        <h1>Interaction test inventory</h1>
        <p>
          Seven shared input types and their boundary states. Each link opens a separate test page.
        </p>
        <p>
          <a href={buildMountedHref("/component-catalog")}>Back to component inventory</a>
        </p>
        <h2>Native game interaction tests</h2>
        <p>These pages use local engines and the production interaction UI.</p>
        <div className={classes.links}>
          <a href={buildMountedHref("/simulator-ui-fixtures/game-interactions/grand-archive")}>
            Grand Archive: interaction inventory
          </a>
          <a
            href={`${buildMountedHref("/simulator-ui-fixtures/game-interactions/grand-archive")}?scenario=materialization-hand`}
          >
            Grand Archive: materialization
          </a>
          <a
            href={`${buildMountedHref("/simulator-ui-fixtures/game-interactions/alpha-clash")}?mode=self`}
          >
            Alpha Clash: play both sides
          </a>
        </div>
        <h2>Shared game prompts</h2>
        <p>
          <a href={buildMountedHref("/simulator-ui-fixtures/interactions/shared-prompts")}>
            Target sheets, board selection, effects, ordering and prompt lifecycle
          </a>
        </p>
        <h2>Runtime integration</h2>
        <p>
          <a href={buildMountedHref("/simulator-ui-fixtures/interactions/motion-lock")}>
            Input lock during a board transition
          </a>
        </p>
        <h2>Game mapping audit</h2>
        <p>Source coverage only. The links below test shared shapes, not native game dispatch.</p>
        <div className={classes.games}>
          {interactionGameAudit.map((item) => (
            <section className={classes.game} key={item.game}>
              <h3>{item.game}</h3>
              <p>{item.boundary}</p>
              <p>{item.families}</p>
              <div className={classes.links}>
                {item.cases.map((id) => (
                  <a key={id} href={buildMountedHref(`/simulator-ui-fixtures/interactions/${id}`)}>
                    {interactionCatalog.find((entry) => entry.id === id)?.title}
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
        <h2>Shared test pages ({interactionCatalog.length})</h2>
        <ul>
          {interactionCatalog.map((item) => (
            <li key={item.id} style={{ marginBottom: 16 }}>
              <a href={buildMountedHref(`/simulator-ui-fixtures/interactions/${item.id}`)}>
                {item.title}
              </a>{" "}
              — {item.description}
            </li>
          ))}
        </ul>
      </main>
    );
  return <CatalogCase key={fixture.id} fixture={fixture} embedded={embedded} />;
}
function CatalogCase({
  fixture,
  embedded,
}: {
  fixture: (typeof interactionCatalog)[number];
  embedded: boolean;
}) {
  const [values, setValues] = useState<Record<string, InteractionSubmissionValue>>({});
  const [submission, setSubmission] = useState<InteractionSubmission>();
  const [reset, setReset] = useState(0);
  const [inputPaused, setInputPaused] = useState(false);
  const [lightTheme, setLightTheme] = useState(false);
  const action = fixture.view.actions[0];
  const selectSpatialTarget = (id: string) => {
    if (!action || inputPaused) return;
    const next = { cards: [id] };
    setValues(next);
    // The board owns immediate singleton commits; the prompt only gives guidance.
    const candidate = buildInteractionSubmission({ view: fixture.view, action, values: next });
    if (validateInteractionSubmission(fixture.view, candidate).ok) setSubmission(candidate);
  };
  return (
    <main className={classes.page} data-theme={lightTheme ? "light" : "dark"}>
      <h1>{fixture.title}</h1>
      <p>{fixture.description}</p>
      <p>
        Synthetic post-adapter fixture. This does not prove native engine dispatch or a complete
        game board.
      </p>
      <p>
        <a href={buildMountedHref("/simulator-ui-fixtures/interactions")}>
          All interaction test pages
        </a>
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 16 }}>
        <Button
          variant="light"
          onClick={() => {
            setInputPaused(false);
            setValues({});
            setSubmission(undefined);
            setReset((value) => value + 1);
          }}
        >
          Reset
        </Button>
        <a
          href={`${buildMountedHref(`/simulator-ui-fixtures/interactions/${fixture.id}`)}${embedded ? "" : "?layout=panel"}`}
        >
          {embedded ? "Test over board" : "Test in narrow panel"}
        </a>
        <Button
          variant="light"
          aria-pressed={inputPaused}
          onClick={() => setInputPaused((paused) => !paused)}
        >
          {inputPaused ? "Resume input" : "Pause input"}
        </Button>
        <Button
          variant="light"
          aria-pressed={lightTheme}
          onClick={() => setLightTheme((light) => !light)}
        >
          {lightTheme ? "Use dark theme" : "Use light theme"}
        </Button>
        {action && (
          <Button variant="light" onClick={() => setValues({ ...fixture.validValues })}>
            Load valid answer
          </Button>
        )}
      </div>
      {inputPaused && (
        <p role="status">Input is paused by the host. Resume to continue the current choice.</p>
      )}
      <section
        aria-label="Prompt preview"
        style={{
          minHeight: embedded
            ? undefined
            : action?.inputs.some((input) => input.kind === "entity-partition")
              ? 680
              : 420,
          width: embedded ? "min(100%, 350px)" : undefined,
          position: "relative",
          display: "grid",
          placeItems: "center",
          marginTop: 24,
          border: "1px solid #38506b",
          padding: embedded ? 0 : 16,
        }}
      >
        {fixture.spatial && (
          <div style={{ width: "100%", height: 180 }}>
            <Canvas frameloop="demand" camera={{ position: [0, 0, 4], fov: 40 }}>
              <ambientLight intensity={2} />
              {["alpha", "beta", "gamma"].map((id, index) => (
                <mesh
                  key={id}
                  position={[(index - 1) * 1.8, 0, 0]}
                  onClick={(event) => {
                    event.stopPropagation();
                    selectSpatialTarget(id);
                  }}
                >
                  <boxGeometry args={[1.1, 1.5, 0.05]} />
                  <meshStandardMaterial
                    color={
                      Array.isArray(values.cards) && values.cards.includes(id)
                        ? "#e8b74d"
                        : "#426d98"
                    }
                  />
                </mesh>
              ))}
            </Canvas>
          </div>
        )}
        {fixture.spatial && (
          <div
            aria-label="Board target stand-ins"
            style={{ display: "flex", flexWrap: "wrap", gap: 12, alignSelf: "start" }}
          >
            {["alpha", "beta", "gamma"].map((id) => (
              <Button
                variant="light"
                key={id}
                aria-pressed={Array.isArray(values.cards) && values.cards.includes(id)}
                disabled={inputPaused}
                onClick={() => selectSpatialTarget(id)}
              >
                Card {id}
              </Button>
            ))}
          </div>
        )}
        <InteractionResolutionPrompt
          key={reset}
          view={fixture.view}
          viewerId={fixture.viewerId ?? "player"}
          values={values}
          actionId={fixture.view.status === "ready" ? action?.id : undefined}
          visibleEntityIds={fixture.spatial ? new Set(["alpha", "beta", "gamma"]) : undefined}
          embedded={embedded}
          instructionOnly={inputPaused}
          renderCandidate={
            fixture.cardImages
              ? (_, id) => {
                  const card = fixture.cardImages?.[id];
                  return card ? (
                    <img
                      className={classes.cardArt}
                      src={card.imageUrl}
                      alt={card.name}
                      draggable={false}
                    />
                  ) : undefined;
                }
              : undefined
          }
          mobileDraggable={!embedded}
          onChange={(id, value) => setValues((current) => ({ ...current, [id]: value }))}
          onClearInput={(id) =>
            setValues((current) =>
              Object.fromEntries(Object.entries(current).filter(([key]) => key !== id)),
            )
          }
          onClear={() => setValues({})}
          onSubmit={inputPaused ? undefined : setSubmission}
        />
        {!fixture.view.resolution && !action && (
          <p role="status">
            Host state:{" "}
            {fixture.view.projectionFailure
              ? "projection failed — retry required"
              : fixture.view.status}
            . No resolution prompt expected.
          </p>
        )}
      </section>
      <p role="status">
        {submission
          ? `Submitted ${submission.actionId}: ${validateInteractionSubmission(fixture.view, submission).ok ? "valid" : "invalid"}`
          : "No submission"}
      </p>
      <details>
        <summary>Draft and submitted payload</summary>
        <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
          {JSON.stringify({ values, submission }, null, 2)}
        </pre>
      </details>
    </main>
  );
}
