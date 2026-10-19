import { Profiler, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { notifications } from "@mantine/notifications";
import {
  buildCyberpunkInteractionView,
  cyberpunkSubmissionToPayload,
} from "@tcg/cyberpunk-server-adapter/interaction-protocol";
import { PLAYER_SIDE_TO_ID } from "../engine";
import { getScenario, P1, type ScenarioId } from "../engine/fixtures/scenarios";
import type { RawEngineEventEntry } from "../engine/EngineProvider";
import { createLiveMatchViewerEngine } from "../engine/live/liveState";
import { BoardSharedPage, type BoardSharedPageProps } from "../pages/BoardShared.page";

/** Development-only transport stand-in. Uses the real remote dispatch and animation UI. */
export default function DelayedCommandFixture({ scenarioId }: { scenarioId: ScenarioId }) {
  const [source] = useState(() => getScenario(scenarioId).build());
  const [state, setState] = useState(() => source.getState());
  const [events, setEvents] = useState<RawEngineEventEntry[]>([]);
  const [pending, setPending] = useState<string | null>(null);
  const [rejectNext, setRejectNext] = useState(false);
  const [responseDelay, setResponseDelay] = useState(150);
  const samples = useRef<CommandSample[]>([]);
  const timingOutput = useRef<HTMLOutputElement>(null);
  const longFrames = useRef<HTMLOutputElement>(null);
  useEffect(() => {
    if (!PerformanceObserver.supportedEntryTypes.includes("long-animation-frame")) return;
    const observer = new PerformanceObserver((list) => {
      if (longFrames.current)
        longFrames.current.textContent = JSON.stringify(
          list.getEntries().map((entry) => entry.toJSON()),
        );
    });
    observer.observe({ type: "long-animation-frame" });
    return () => observer.disconnect();
  }, []);
  const frames = useRef(new Set<number>());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      for (const id of frames.current) cancelAnimationFrame(id);
    },
    [],
  );
  const builder = useCallback(() => createLiveMatchViewerEngine(state), [state]);
  const prompt = useMemo(() => source.getPrompt(P1), [source, state]);
  const interactionView = useMemo(
    () =>
      buildCyberpunkInteractionView({
        actorId: P1,
        stateVersion: state.ctx.stateID,
        prompt,
        state,
      }),
    [prompt, state],
  );
  const moveLogs = useMemo(() => events.flatMap((entry) => entry.moveLogs), [events]);
  const dispatch = useCallback<NonNullable<BoardSharedPageProps["remoteDispatch"]>>(
    (_action, _state, actor) => {
      if (timer.current) return false;
      const sample: CommandSample = {
        action: actor.submission.actionId,
        phaseAtDispatch: document.querySelector<HTMLElement>("[data-cyberpunk-input-ready]")
          ?.dataset.cyberpunkAnimationPhase,
        responseDelayMs: responseDelay,
        startedAt: performance.now(),
        maxFrameMs: 0,
        renderMs: [],
      };
      samples.current = [...samples.current.slice(-9), sample];
      let previousFrame = sample.startedAt;
      const scheduleFrame = () => {
        const id = requestAnimationFrame((now) => {
          frames.current.delete(id);
          measureFrame(now);
        });
        frames.current.add(id);
      };
      const measureFrame = (now: number) => {
        sample.maxFrameMs = Math.max(sample.maxFrameMs, now - previousFrame);
        previousFrame = now;
        sample.firstFrameMs ??= now - sample.startedAt;
        const board = document.querySelector<HTMLElement>("[data-cyberpunk-input-ready]");
        const phase = board?.dataset.cyberpunkAnimationPhase;
        const current =
          sample.version !== undefined &&
          Number(board?.dataset.cyberpunkPresentationVersion) >= sample.version;
        if (current && board?.dataset.cyberpunkInputReady === "true") {
          sample.readyMs ??= now - sample.startedAt;
          sample.readyPhase ??= phase;
        }
        if (sample.responseMs !== undefined && (sample.rejected || (current && phase === "idle"))) {
          sample.settledMs = now - sample.startedAt;
          if (timingOutput.current)
            timingOutput.current.textContent = JSON.stringify(samples.current, (_key, value) =>
              typeof value === "number" ? Math.round(value) : value,
            );

          return;
        }
        scheduleFrame();
      };
      scheduleFrame();
      setPending(actor.submission.actionId);
      timer.current = setTimeout(() => {
        timer.current = null;
        setPending(null);
        sample.responseMs = performance.now() - sample.startedAt;
        if (rejectNext) {
          sample.rejected = true;
          setRejectNext(false);
          notifications.show({
            color: "red",
            message: "Local fixture rejected the move. Try again.",
          });
          return;
        }
        const beforeState = source.getState();
        const command = cyberpunkSubmissionToPayload(actor.submission);
        const executionStartedAt = performance.now();
        const result = source.executeMove(
          command.moveType,
          { args: command.payload },
          PLAYER_SIDE_TO_ID[actor.side],
        );
        sample.engineMs = performance.now() - executionStartedAt;
        if (!result.success) {
          sample.rejected = true;
          notifications.show({ color: "red", message: result.error });
          return;
        }
        sample.version = result.stateID;
        setState(result.state);
        setEvents((previous) => [
          ...previous,
          {
            id: previous.length + 1,
            timestamp: Date.now(),
            side: actor.side,
            move: command.moveType,
            input: command.payload,
            stateID: result.stateID,
            beforeState,
            afterState: result.state,
            events: result.gameEvents,
            moveLogs: result.moveLogs,
            animationScript: result.animationScript,
          },
        ]);
      }, responseDelay);
      return true;
    },
    [rejectNext, source, responseDelay],
  );
  return (
    <>
      <Profiler
        id="board"
        onRender={(_id, _phase, duration) => {
          for (const sample of samples.current)
            if (sample.settledMs === undefined) sample.renderMs.push(duration);
        }}
      >
        <BoardSharedPage
          initialEngineBuilder={builder}
          initialHumanSide="player"
          initialAi={{ player: null, opponent: null }}
          initialAiMode="step"
          remoteDispatch={dispatch}
          remoteInteractionView={interactionView}
          remotePrompt={prompt}
          hasPendingRemoteMove={pending !== null}
          pendingRemoteActionId={pending}
          remoteEngineEvents={events}
          remoteMoveLogs={moveLogs}
        />
      </Profiler>
      <details
        style={{
          position: "fixed",
          top: 48,
          right: 8,
          zIndex: 500,
          background: "#10171c",
          color: "#fff",
          padding: 8,
          fontSize: 12,
        }}
      >
        <summary>Local command fixture</summary>
        <label>
          Response delay
          <select
            aria-label="Response delay"
            value={responseDelay}
            disabled={pending !== null}
            onChange={(event) => setResponseDelay(Number(event.currentTarget.value))}
          >
            <option value={0}>0 ms</option>
            <option value={150}>150 ms</option>
            <option value={800}>800 ms</option>
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            checked={rejectNext}
            disabled={pending !== null}
            onChange={(event) => setRejectNext(event.currentTarget.checked)}
          />{" "}
          Reject next move
        </label>
        <output
          ref={timingOutput}
          data-testid="command-timings"
          style={{ display: "block", maxWidth: 320, maxHeight: 180, overflow: "auto" }}
        ></output>
        <output
          data-testid="long-frames"
          ref={longFrames}
          style={{
            display: "block",
            maxWidth: 320,
            maxHeight: 180,
            overflow: "auto",
            overflowWrap: "anywhere",
          }}
        />
      </details>
    </>
  );
}

interface CommandSample {
  renderMs: number[];
  action: string;
  phaseAtDispatch?: string;
  responseDelayMs: number;
  startedAt: number;
  firstFrameMs?: number;
  responseMs?: number;
  engineMs?: number;
  version?: number;
  readyMs?: number;
  readyPhase?: string;
  settledMs?: number;
  maxFrameMs: number;
  rejected?: boolean;
}
