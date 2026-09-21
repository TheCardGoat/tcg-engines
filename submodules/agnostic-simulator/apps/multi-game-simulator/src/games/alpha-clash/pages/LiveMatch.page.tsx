import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Group, Paper, Stack, Text } from "@mantine/core";
import type { ResolvedMatchViewer } from "@tcg/game-page-contract";
import {
  assertNeverInteractionInput,
  buildInteractionSubmissionForActionId,
  EngineInteractionView,
  type DropEligibility,
  type EngineInteractionView as EngineInteractionViewType,
  type InteractionAction,
  type InteractionInput,
  type InteractionSubmissionValue,
} from "@tcg/protocol";
import { DropClaimControl, SimulatorRouteStatus } from "@tcg/simulator-ui";
import { acquireRootGatewayHandle } from "../../../lib/gateway/root-socket";
import { useSimulatorRoute } from "../../../simulator/providers";
import {
  LiveBoard,
  type AcSeat,
  type LiveBoardCard,
  type LiveBoardPlayer,
  type LiveBoardState,
} from "../components/LiveBoard";
import classes from "./Practice.module.css";

/** Entity-selection inputs store ordered string lists until submission time. */
type ActionValues = Readonly<Record<string, InteractionSubmissionValue>>;
type SelectionsByAction = Readonly<Record<string, ActionValues>>;

const NO_SELECTIONS: SelectionsByAction = {};
const LOG_LIMIT = 200;

interface LiveLogLine {
  readonly id: number;
  readonly text: string;
}

/**
 * Server-authoritative Alpha Clash match surface. State is consumed
 * exclusively from the adapter's viewer projection; the browser never
 * hydrates a persisted engine snapshot.
 */
export function AlphaClashLiveMatchPage() {
  const route = useSimulatorRoute();
  const bootstrap = route.matchPageData;
  const gameId = bootstrap?.game.gameId;
  const viewerSeat = viewerToSeat(bootstrap?.viewer);
  const participantNames = useMemo(() => {
    const participants = bootstrap?.match?.participants ?? [];
    const p1 = participants.find((participant) => participant.seat === 1)?.displayName;
    const p2 = participants.find((participant) => participant.seat === 2)?.displayName;
    return { ...(p1?.trim() ? { p1: p1.trim() } : {}), ...(p2?.trim() ? { p2: p2.trim() } : {}) };
  }, [bootstrap?.match?.participants]);

  const [state, setState] = useState<LiveBoardState | null>(() =>
    parseProjectedState(bootstrap?.game.view),
  );
  const [interactionView, setInteractionView] = useState<EngineInteractionViewType | null>(() =>
    parseInteractionView(bootstrap?.game.interactionView),
  );
  const [logLines, setLogLines] = useState<readonly LiveLogLine[]>(
    () => logLinesFromEngineLogs(bootstrap?.history.engineLogs ?? [], 0).lines,
  );
  const [selections, setSelections] = useState<SelectionsByAction>(NO_SELECTIONS);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [dropEligibility, setDropEligibility] = useState<DropEligibility | null>(
    bootstrap?.dropEligibility ?? null,
  );
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const logIdCounter = useRef(0);
  const interactionRef = useRef(interactionView);
  const activeActionRef = useRef(activeActionId);
  useEffect(() => {
    interactionRef.current = interactionView;
  }, [interactionView]);
  useEffect(() => {
    activeActionRef.current = activeActionId;
  }, [activeActionId]);

  // A new server state invalidates every in-flight selection.
  const viewVersion = interactionView?.stateVersion ?? null;
  useEffect(() => {
    setSelections(NO_SELECTIONS);
    setActiveActionId(null);
  }, [viewVersion]);

  const appendEngineLogs = useCallback((entries: unknown) => {
    const list = Array.isArray(entries) ? entries : [];
    if (list.length === 0) return;
    const { lines, nextId } = logLinesFromEngineLogs(list, logIdCounter.current);
    logIdCounter.current = nextId;
    if (lines.length === 0) return;
    setLogLines((current) => [...lines.slice().reverse(), ...current].slice(0, LOG_LIMIT));
  }, []);

  useEffect(() => {
    if (!gameId) return;
    const handle = acquireRootGatewayHandle("alpha-clash");
    const accept = (payload: {
      readonly gameId: string;
      readonly state?: unknown;
      readonly interactionView?: unknown;
      readonly engineLogs?: unknown;
    }) => {
      if (payload.gameId !== gameId) return;
      const nextState = parseProjectedState(payload.state);
      if (nextState) setState(nextState);
      if (payload.interactionView === null) setInteractionView(null);
      const view = parseInteractionView(payload.interactionView);
      if (view) setInteractionView(view);
      appendEngineLogs(payload.engineLogs);
    };
    const unsubscribers = [
      handle.on("game_joined", (payload) => {
        accept(payload);
        if (payload.gameId === gameId && payload.dropEligibility) {
          setDropEligibility(payload.dropEligibility);
        }
      }),
      handle.on("drop_eligibility", (payload) => {
        if (payload.gameId === gameId) setDropEligibility(payload.dropEligibility);
      }),
      handle.on("state_sync", accept),
      handle.on("state_update", accept),
      handle.on("move_accepted", accept),
      handle.on("move_rejected", (payload) => {
        if (payload.gameId !== gameId) return;
        setConnectionError(payload.reason ?? "The server rejected that action.");
        handle.emit("request_game_state_sync", { gameId });
      }),
      handle.on("submit_interaction:response", (payload) => {
        if (payload.status !== "err") return;
        const reason =
          typeof payload.data?.reason === "string"
            ? payload.data.reason
            : "The server rejected that action.";
        setConnectionError(reason);
        handle.emit("request_game_state_sync", { gameId });
      }),
    ];
    handle.join({ gameId });
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      handle.leave();
      handle.release();
    };
  }, [appendEngineLogs, gameId]);

  const submit = useCallback(
    (action: InteractionAction, values: ActionValues) => {
      const view = interactionRef.current;
      if (!gameId || !view) return;
      const submission = buildInteractionSubmissionForActionId({
        view,
        actionId: action.id,
        values: { ...values },
      });
      if (!submission) {
        setConnectionError("That action is no longer available — the board has moved on.");
        return;
      }
      const handle = acquireRootGatewayHandle("alpha-clash");
      if (handle.wouldHoldEmit()) {
        handle.release();
        return;
      }
      handle.emit("submit_interaction", {
        gameId,
        expectedVersion: submission.stateVersion,
        submission,
        correlationId: crypto.randomUUID(),
      });
      handle.release();
      setConnectionError(null);
      setSelections(NO_SELECTIONS);
    },
    [gameId],
  );

  const selectValue = useCallback(
    (actionId: string, inputId: string, value: InteractionSubmissionValue) => {
      setActiveActionId(actionId);
      setSelections((current) => ({
        ...current,
        [actionId]: { ...current[actionId], [inputId]: value },
      }));
    },
    [],
  );

  const onCardClick = useCallback((instanceId: string) => {
    const view = interactionRef.current;
    if (!view) return;
    const targets = view.actions.flatMap((action) =>
      action.inputs.flatMap((input) =>
        input.kind === "entity-selection" && candidatesInclude(input, instanceId)
          ? [{ actionId: action.id, input }]
          : [],
      ),
    );
    if (targets.length === 0) return;
    const chosen =
      targets.find((target) => target.actionId === activeActionRef.current) ?? targets[0];
    setActiveActionId(chosen.actionId);
    setSelections((current) => {
      const forAction = { ...current[chosen.actionId] };
      const existing = forAction[chosen.input.id];
      const list = Array.isArray(existing)
        ? existing.filter((id): id is string => typeof id === "string")
        : [];
      const max = chosen.input.max;
      const next =
        max === 1
          ? list.length === 1 && list[0] === instanceId
            ? []
            : [instanceId]
          : list.includes(instanceId)
            ? list.filter((id) => id !== instanceId)
            : [...list, instanceId].slice(-max);
      forAction[chosen.input.id] = next;
      return { ...current, [chosen.actionId]: forAction };
    });
  }, []);

  const selectableInstanceIds = useMemo(() => {
    const view = interactionView;
    if (!view) return null;
    const ids = new Set<string>();
    for (const action of view.actions) {
      for (const input of action.inputs) {
        if (input.kind !== "entity-selection") continue;
        for (const candidate of input.candidates) {
          if (candidate.enabled !== false) ids.add(candidate.entity.instanceId);
        }
      }
    }
    return ids.size > 0 ? ids : null;
  }, [interactionView]);

  const selectedInstanceIds = useMemo(() => {
    const active = activeActionId ? selections[activeActionId] : undefined;
    const ids = new Set<string>();
    if (!active) return ids;
    for (const value of Object.values(active)) {
      if (Array.isArray(value)) {
        for (const id of value) {
          if (typeof id === "string") ids.add(id);
        }
      } else if (typeof value === "string") {
        ids.add(value);
      }
    }
    return ids;
  }, [activeActionId, selections]);

  if (route.error) return <SimulatorRouteStatus title="Match unavailable" message={route.error} />;
  if (bootstrap?.viewer.role !== "player") {
    return (
      <SimulatorRouteStatus
        title="Spectating unavailable"
        message="Alpha Clash matches currently support seated players only."
      />
    );
  }
  if (!bootstrap || !gameId || !state || !viewerSeat) {
    return (
      <SimulatorRouteStatus
        title="Loading Alpha Clash match"
        message="Connecting to the match server."
      />
    );
  }

  const ended = state.phaseName === "complete";
  const labelFor = (instanceId: string): string => {
    const card = state.cards.find((entry) => entry.instanceId === instanceId);
    if (!card) return instanceId;
    return card.name ?? (card.faceDown ? "Set card" : instanceId);
  };

  return (
    <>
      {dropEligibility ? (
        <div className="pointer-events-auto absolute right-4 top-4 z-20">
          <DropClaimControl
            eligibility={dropEligibility}
            serverNowMs={dropEligibility.projectedAtMs}
            onClaim={() => {
              const handle = acquireRootGatewayHandle("alpha-clash");
              handle.emit("drop_player", { gameId });
              handle.release();
            }}
          />
        </div>
      ) : null}
      <main className={classes.page}>
        <div className={classes.tableArea}>
          {ended ? (
            <Paper withBorder p="sm" radius="md" className={classes.resultBanner}>
              <Text fw={700}>Match complete</Text>
            </Paper>
          ) : null}
          <LiveBoard
            board={state}
            viewerSeat={viewerSeat}
            participantNames={participantNames}
            selectableInstanceIds={selectableInstanceIds}
            selectedInstanceIds={selectedInstanceIds}
            onCardClick={onCardClick}
          />
          {connectionError ? (
            <Paper withBorder p="xs" radius="md" className={classes.errorBanner}>
              <Text size="sm" c="red">
                {connectionError}
              </Text>
            </Paper>
          ) : null}
        </div>
        <aside className={classes.sidePanel}>
          <LiveInteractionPanel
            view={interactionView}
            selections={selections}
            activeActionId={activeActionId}
            disabled={ended}
            labelFor={labelFor}
            onValue={selectValue}
            onSubmit={submit}
          />
          <Paper
            withBorder
            p="sm"
            radius="md"
            className={classes.logPanel}
            data-testid="ac-event-log"
          >
            <Text fw={600} size="sm" mb={4}>
              Event log
            </Text>
            <Stack gap={2}>
              {logLines.slice(0, 14).map((line) => (
                <Text key={line.id} size="xs" c="dimmed" data-testid="ac-event-log-line">
                  {line.text}
                </Text>
              ))}
              {logLines.length === 0 ? (
                <Text size="xs" c="dimmed">
                  The match has not started yet.
                </Text>
              ) : null}
            </Stack>
          </Paper>
        </aside>
      </main>
    </>
  );
}

function LiveInteractionPanel({
  view,
  selections,
  activeActionId,
  disabled,
  labelFor,
  onValue,
  onSubmit,
}: {
  view: EngineInteractionViewType | null;
  selections: SelectionsByAction;
  activeActionId: string | null;
  disabled: boolean;
  labelFor: (instanceId: string) => string;
  onValue: (actionId: string, inputId: string, value: InteractionSubmissionValue) => void;
  onSubmit: (action: InteractionAction, values: ActionValues) => void;
}) {
  if (!view) {
    return (
      <Paper withBorder p="sm" radius="md" className={classes.actionPanel}>
        <Text fw={600} size="sm" mb={6}>
          Available actions
        </Text>
        <Text size="sm" c="dimmed">
          Waiting for the game server…
        </Text>
      </Paper>
    );
  }
  const concede = view.actions.find((action) => action.intent === "concede") ?? null;
  const actions = view.actions.filter((action) => action.intent !== "concede");
  return (
    <Paper withBorder p="sm" radius="md" className={classes.actionPanel}>
      <Text fw={600} size="sm" mb={6}>
        Available actions
      </Text>
      {disabled ? (
        <Text size="sm" c="dimmed">
          The match is over.
        </Text>
      ) : actions.length === 0 && !concede ? (
        <Text size="sm" c="dimmed">
          Waiting for the other player…
        </Text>
      ) : (
        <Stack gap="sm">
          {actions.map((action) => (
            <LiveActionCard
              key={action.id}
              action={action}
              armed={action.id === activeActionId}
              values={selections[action.id] ?? NO_SELECTIONS}
              labelFor={labelFor}
              onValue={onValue}
              onSubmit={onSubmit}
            />
          ))}
          {concede ? (
            <LiveActionCard
              key={concede.id}
              action={concede}
              armed={false}
              values={selections[concede.id] ?? NO_SELECTIONS}
              labelFor={labelFor}
              onValue={onValue}
              onSubmit={onSubmit}
            />
          ) : null}
        </Stack>
      )}
    </Paper>
  );
}

function LiveActionCard({
  action,
  armed,
  values,
  labelFor,
  onValue,
  onSubmit,
}: {
  action: InteractionAction;
  armed: boolean;
  values: ActionValues;
  labelFor: (instanceId: string) => string;
  onValue: (actionId: string, inputId: string, value: InteractionSubmissionValue) => void;
  onSubmit: (action: InteractionAction, values: ActionValues) => void;
}) {
  const setValue = (inputId: string, value: InteractionSubmissionValue) =>
    onValue(action.id, inputId, value);
  const readyValues = action.inputs.length === 0 ? {} : collectValues(action, values);
  const isConcede = action.intent === "concede";
  const confirmedConcede = isConcede && values.confirm === true;
  return (
    <Paper
      withBorder
      p="xs"
      radius="sm"
      className={classes.actionCard}
      data-testid={`ac-action-card:${action.id}`}
      {...(armed ? { "data-armed": "true" } : {})}
    >
      <Text size="sm" fw={600}>
        {action.text.key}
      </Text>
      <Stack gap={4} mt={4}>
        {action.inputs.map((input) => (
          <LiveInputControl
            key={input.id}
            input={input}
            value={values[input.id]}
            labelFor={labelFor}
            onValue={setValue}
          />
        ))}
        <Button
          size="compact-sm"
          variant={isConcede ? "outline" : "light"}
          color={isConcede ? "red" : undefined}
          disabled={isConcede ? !confirmedConcede : readyValues === null}
          data-testid={`ac-action-submit:${action.id}`}
          onClick={() => {
            if (action.inputs.length === 0) {
              onSubmit(action, {});
              return;
            }
            if (readyValues !== null) onSubmit(action, readyValues);
          }}
        >
          {action.inputs.length === 0 ? action.text.key : "Confirm"}
        </Button>
      </Stack>
    </Paper>
  );
}

function LiveInputControl({
  input,
  value,
  labelFor,
  onValue,
}: {
  input: InteractionInput;
  value: InteractionSubmissionValue | undefined;
  labelFor: (instanceId: string) => string;
  onValue: (inputId: string, value: InteractionSubmissionValue) => void;
}) {
  switch (input.kind) {
    case "boolean":
      return (
        <Group gap="xs">
          <Button
            size="compact-xs"
            variant={value === true ? "filled" : "light"}
            onClick={() => onValue(input.id, true)}
          >
            {input.trueText.key}
          </Button>
          <Button
            size="compact-xs"
            variant={value === false ? "filled" : "light"}
            onClick={() => onValue(input.id, false)}
          >
            {input.falseText.key}
          </Button>
        </Group>
      );
    case "option-selection":
      return (
        <Group gap={4} wrap="wrap">
          {input.options
            .filter((option) => option.enabled !== false)
            .map((option) => (
              <Button
                key={option.id}
                size="compact-xs"
                variant={value === option.id ? "filled" : "light"}
                onClick={() => onValue(input.id, option.id)}
              >
                {option.text.key}
              </Button>
            ))}
        </Group>
      );
    case "number": {
      const min = input.min ?? 0;
      const current = typeof value === "number" ? value : min;
      const step = input.step && input.step > 0 ? input.step : 1;
      const atMax = input.max !== undefined && current >= input.max;
      return (
        <Group gap={4}>
          <Button
            size="compact-xs"
            variant="light"
            aria-label={`Decrease ${input.text.key}`}
            disabled={current <= min}
            onClick={() => onValue(input.id, Math.max(min, current - step))}
          >
            −
          </Button>
          <Text size="xs" fw={700} miw={16} ta="center">
            {current}
          </Text>
          <Button
            size="compact-xs"
            variant="light"
            aria-label={`Increase ${input.text.key}`}
            disabled={atMax}
            onClick={() =>
              onValue(
                input.id,
                input.max !== undefined ? Math.min(input.max, current + step) : current + step,
              )
            }
          >
            +
          </Button>
        </Group>
      );
    }
    case "entity-selection":
      return (
        <Group gap={4} wrap="wrap">
          {input.candidates
            .filter((candidate) => candidate.enabled !== false)
            .map((candidate) => {
              const instanceId = candidate.entity.instanceId;
              const list = Array.isArray(value)
                ? value.filter((id): id is string => typeof id === "string")
                : [];
              return (
                <Button
                  key={instanceId}
                  size="compact-xs"
                  variant={list.includes(instanceId) ? "filled" : "light"}
                  onClick={() => {
                    if (input.max === 1) {
                      onValue(
                        input.id,
                        list.length === 1 && list[0] === instanceId ? [] : [instanceId],
                      );
                      return;
                    }
                    const next = list.includes(instanceId)
                      ? list.filter((id) => id !== instanceId)
                      : [...list, instanceId].slice(-input.max);
                    onValue(input.id, next);
                  }}
                >
                  {labelFor(instanceId)}
                </Button>
              );
            })}
        </Group>
      );
    case "entity-allocation": {
      const allocation = allocationFromValue(value);
      const total = Object.values(allocation).reduce((sum, amount) => sum + amount, 0);
      return (
        <Group gap={4} wrap="wrap">
          {input.candidates.map((candidate) => {
            const instanceId = candidate.entity.instanceId;
            const amount = allocation[instanceId] ?? 0;
            return (
              <Button
                key={instanceId}
                size="compact-xs"
                variant={amount > 0 ? "filled" : "light"}
                disabled={amount >= candidate.max}
                onClick={() => onValue(input.id, { ...allocation, [instanceId]: amount + 1 })}
              >
                {labelFor(instanceId)}
                {amount > 0 ? ` ×${amount}` : ""}
              </Button>
            );
          })}
          {total > 0 ? (
            <Button size="compact-xs" variant="subtle" onClick={() => onValue(input.id, {})}>
              Clear
            </Button>
          ) : null}
          <Text size="xs" c="dimmed">
            {total} / {input.totalMin}
          </Text>
        </Group>
      );
    }
    // The Alpha Clash adapter never advertises ordering or partition inputs.
    case "ordering":
    case "entity-partition":
      return (
        <Text size="xs" c="dimmed">
          This input kind is not supported here.
        </Text>
      );
    default:
      return assertNeverInteractionInput(input);
  }
}

/**
 * Collects the wire values for one action; null when a required input is
 * still missing. Mirrors the adapter's submission vocabulary: every advertised
 * action id submits through `buildInteractionSubmissionForActionId` verbatim.
 */
function collectValues(
  action: InteractionAction,
  values: ActionValues,
): Record<string, InteractionSubmissionValue> | null {
  const collected: Record<string, InteractionSubmissionValue> = {};
  for (const input of action.inputs) {
    const value = values[input.id];
    switch (input.kind) {
      case "boolean":
        collected[input.id] = value === true;
        break;
      case "number":
        collected[input.id] = typeof value === "number" ? value : (input.min ?? 0);
        break;
      case "option-selection":
        if (typeof value !== "string") return null;
        collected[input.id] = value;
        break;
      case "entity-selection": {
        const list = Array.isArray(value)
          ? value.filter((id): id is string => typeof id === "string")
          : [];
        if (list.length === 0) {
          if (input.required === true) return null;
          break;
        }
        collected[input.id] = input.max === 1 ? list[0] : list;
        break;
      }
      case "entity-allocation": {
        const allocation = allocationFromValue(value);
        const total = Object.values(allocation).reduce((sum, amount) => sum + amount, 0);
        if (total !== input.totalMin) return null;
        collected[input.id] = allocation;
        break;
      }
      case "ordering":
      case "entity-partition":
        return null;
      default:
        return assertNeverInteractionInput(input);
    }
  }
  return collected;
}

function candidatesInclude(
  input: Extract<InteractionInput, { kind: "entity-selection" }>,
  instanceId: string,
): boolean {
  return input.candidates.some(
    (candidate) => candidate.enabled !== false && candidate.entity.instanceId === instanceId,
  );
}

function allocationFromValue(
  value: InteractionSubmissionValue | undefined,
): Record<string, number> {
  if (value === undefined || value === null || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  const allocation: Record<string, number> = {};
  for (const [instanceId, amount] of Object.entries(value)) {
    if (typeof amount === "number" && Number.isInteger(amount) && amount > 0) {
      allocation[instanceId] = amount;
    }
  }
  return allocation;
}

function viewerToSeat(viewer: ResolvedMatchViewer | undefined): AcSeat | null {
  if (!viewer || viewer.role !== "player") return null;
  return viewer.seat === 1 ? "player-one" : "player-two";
}

function parseInteractionView(value: unknown): EngineInteractionViewType | null {
  const parsed = EngineInteractionView.safeParse(value);
  return parsed.success ? parsed.data : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSeat(value: unknown): value is AcSeat {
  return value === "player-one" || value === "player-two";
}

/**
 * Validates the adapter's seated viewer projection into the board's view
 * model. Anything the game server could not have produced is rejected rather
 * than rendered.
 */
export function parseProjectedState(raw: unknown): LiveBoardState | null {
  if (!isRecord(raw)) return null;
  if (!Array.isArray(raw.cards) || typeof raw.turnNumber !== "number") return null;
  if (!isSeat(raw.activePlayer) || typeof raw.portalOpen !== "boolean") return null;
  if (!isRecord(raw.phase) || typeof raw.phase.name !== "string") return null;
  if (raw.standby !== undefined && !Array.isArray(raw.standby)) return null;

  const players = parsePlayers(raw.players);
  if (!players) return null;

  const cards: LiveBoardCard[] = [];
  for (const entry of raw.cards) {
    const card = parseCard(entry);
    if (!card) return null;
    cards.push(card);
  }

  let clash: LiveBoardState["clash"] = null;
  if (raw.clash !== null && raw.clash !== undefined) {
    if (
      !isRecord(raw.clash) ||
      typeof raw.clash.attackerId !== "string" ||
      typeof raw.clash.targetId !== "string" ||
      typeof raw.clash.step !== "string"
    ) {
      return null;
    }
    clash = {
      attackerId: raw.clash.attackerId,
      targetId: raw.clash.targetId,
      step: raw.clash.step,
    };
  }

  return {
    cards,
    players,
    activePlayer: raw.activePlayer,
    turnNumber: raw.turnNumber,
    phaseName: raw.phase.name,
    portalOpen: raw.portalOpen,
    clash,
    standbyCount: Array.isArray(raw.standby) ? raw.standby.length : 0,
  };
}

function parsePlayers(raw: unknown): Record<AcSeat, LiveBoardPlayer> | null {
  if (!isRecord(raw)) return null;
  const one = parsePlayer(raw["player-one"]);
  const two = parsePlayer(raw["player-two"]);
  return one && two ? { "player-one": one, "player-two": two } : null;
}

function parsePlayer(raw: unknown): LiveBoardPlayer | null {
  if (
    !isRecord(raw) ||
    typeof raw.name !== "string" ||
    typeof raw.health !== "number" ||
    typeof raw.maxHealth !== "number" ||
    typeof raw.handSize !== "number" ||
    typeof raw.deckSize !== "number"
  ) {
    return null;
  }
  return {
    name: raw.name,
    health: raw.health,
    maxHealth: raw.maxHealth,
    handSize: raw.handSize,
    deckSize: raw.deckSize,
  };
}

function parseCard(raw: unknown): LiveBoardCard | null {
  if (
    !isRecord(raw) ||
    typeof raw.instanceId !== "string" ||
    typeof raw.zone !== "string" ||
    typeof raw.controller !== "string" ||
    typeof raw.ready !== "boolean" ||
    typeof raw.faceDown !== "boolean" ||
    typeof raw.clashDamage !== "number" ||
    typeof raw.phaseDamage !== "number" ||
    (raw.definitionId !== null && typeof raw.definitionId !== "string") ||
    (raw.name !== null && typeof raw.name !== "string")
  ) {
    return null;
  }
  return {
    instanceId: raw.instanceId,
    zone: raw.zone,
    controller: raw.controller,
    ready: raw.ready,
    faceDown: raw.faceDown,
    definitionId: raw.definitionId,
    name: raw.name,
    clashDamage: raw.clashDamage,
    phaseDamage: raw.phaseDamage,
  };
}

/** Extracts concise player-facing lines from the engine log stream. */
function logLinesFromEngineLogs(
  entries: readonly unknown[],
  startId: number,
): { lines: LiveLogLine[]; nextId: number } {
  const lines: LiveLogLine[] = [];
  let nextId = startId;
  for (const entry of entries) {
    const text = logTextFromEngineLog(entry);
    if (!text) continue;
    nextId += 1;
    lines.push({ id: nextId, text });
  }
  return { lines, nextId };
}

function logTextFromEngineLog(entry: unknown): string | null {
  if (typeof entry === "string") {
    return entry.trim().length > 0 ? entry : null;
  }
  if (!isRecord(entry)) return null;
  const payload = "data" in entry ? entry.data : entry;
  const messages = readLogMessages(payload);
  if (messages) return messages;
  if (typeof entry.tag === "string") return humanizeLogTag(entry.tag);
  return null;
}

function readLogMessages(value: unknown): string | null {
  if (!isRecord(value) || !isRecord(value.log) || !Array.isArray(value.log.messages)) return null;
  const parts = value.log.messages
    .map((message) => (isRecord(message) ? message.defaultMessage : undefined))
    .filter((text): text is string => typeof text === "string" && text.length > 0);
  return parts.length > 0 ? parts.join(" ") : null;
}

function humanizeLogTag(tag: string): string {
  const short = tag.startsWith("alpha-clash:") ? tag.slice("alpha-clash:".length) : tag;
  return short.replace(/[-_]/g, " ");
}
