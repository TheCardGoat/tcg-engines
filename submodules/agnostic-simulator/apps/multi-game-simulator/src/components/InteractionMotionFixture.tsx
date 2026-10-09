import { Button, Group } from "@mantine/core";
import { useRef, useState } from "react";
import {
  createSimulatorAnimationScope,
  InteractionWorkspace,
  InteractionActionMenu,
  InteractionDraftPrompt,
  useInteractionBoard,
} from "@tcg/simulator-ui";
import { validateInteractionSubmission, type InteractionSubmission } from "@tcg/protocol";
import { interactionCatalog } from "./interaction-catalog";
import { buildMountedHref } from "../routes/router-paths";
import classes from "./InteractionCatalogPage.module.css";

const Motion = createSimulatorAnimationScope<Record<string, never>>();
const projection = { getEntity: () => null, getZone: () => null };
const EmptyEntity = () => null;
const view = interactionCatalog.find((entry) => entry.id === "single-target")!.view;

export default function InteractionMotionFixture() {
  return (
    <Motion.Root
      sessionKey="interaction-motion-test"
      initialState={{}}
      initialVersion={0}
      projection={projection}
      entityRenderer={EmptyEntity}
      viewerSeatId="player"
      animationSpeed="normal"
    >
      <MotionCase />
    </Motion.Root>
  );
}
function MotionCase() {
  const actions = Motion.useActions();
  const status = Motion.useStatus();
  const version = useRef(0);
  const [result, setResult] = useState("No submission");
  const submit = (submission: InteractionSubmission) => {
    const valid = validateInteractionSubmission(view, submission).ok;
    setResult(valid ? "Target submitted: valid" : "Target rejected");
    return valid;
  };
  return (
    <main className={classes.page}>
      <h1>Interaction during a board transition</h1>
      <p>
        <a href={buildMountedHref("/simulator-ui-fixtures/interactions")}>
          All interaction test pages
        </a>
      </p>
      <p>
        Uses the shared animation runtime with an eight-second hold. This checks input gating, not a
        game's motion artwork or engine dispatch.
      </p>
      <Group>
        <Button
          disabled={status.isAnimating}
          onClick={() => {
            version.current += 1;
            setResult("No submission");
            actions.enqueue({
              state: {},
              version: version.current,
              plan: {
                id: `hold-${version.current}`,
                version: 2,
                steps: [{ id: "hold", type: "hold", durationMs: 8000 }],
              },
            });
          }}
        >
          Start transition
        </Button>
        <Button
          variant="light"
          disabled={!status.isAnimating}
          onClick={() => actions.skipActive("inventory-test")}
        >
          Finish transition
        </Button>
      </Group>
      <p role="status">
        {status.isAnimating ? "Transition active — input locked" : "Ready — input available"}
      </p>
      <InteractionWorkspace view={view} viewerId="player" onSubmit={submit}>
        <InteractionActionMenu view={view} viewerId="player" />
        <BoardTargets />
        <div style={{ position: "relative", minHeight: 260, marginTop: 16 }}>
          <InteractionDraftPrompt view={view} viewerId="player" onSubmit={submit} />
        </div>
      </InteractionWorkspace>
      <p role="status">{result}</p>
    </main>
  );
}
function BoardTargets() {
  const board = useInteractionBoard(view);
  return (
    <Group mt="md" aria-label="Board targets">
      {["alpha", "beta", "gamma"].map((id) => (
        <Button
          key={id}
          variant="outline"
          disabled={!board.candidateIds.has(id)}
          onClick={() => board.selectEntity(id)}
        >
          Board {id}
        </Button>
      ))}
    </Group>
  );
}
