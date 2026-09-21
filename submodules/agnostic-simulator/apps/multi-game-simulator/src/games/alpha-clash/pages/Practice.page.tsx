import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Group, Paper, Stack, Text, Title } from "@mantine/core";
import type { ProjectedState } from "@tcg/alpha-clash-engine";
import {
  alphaClashCreateServerEngine,
  alphaClashServerAdapter,
  type AlphaClashServerEngine,
} from "@tcg/alpha-clash-server-adapter";
import {
  buildInteractionSubmission,
  type EngineInteractionView,
  type InteractionAction,
  type InteractionInput,
  type InteractionSubmission,
} from "@tcg/protocol";
import { Tabletop } from "../components/Tabletop";
import classes from "./Practice.module.css";
import { practiceModeFromSearch } from "../../../simulator/practiceMode";

const HUMAN = "human";
const BOT = "bot";

type Values = Record<string, string[] | string | number | boolean | Record<string, number>>;

interface LogLine {
  readonly id: number;
  readonly text: string;
}

/** Local practice match on the tabletop: you versus a practice bot. */
export function AlphaClashPracticePage() {
  const mode = practiceModeFromSearch(window.location.search);
  const [engine, setEngine] = useState<AlphaClashServerEngine | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [log, setLog] = useState<LogLine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selections, setSelections] = useState<Values>({});
  const logCounter = useRef(0);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        // Deck presets are query-param selectable (?deckA=<preset>@<seed>&deckB=…)
        // so practice matches can rotate decks; defaults keep the original table.
        const params = new URLSearchParams(window.location.search);
        const deckIdA = params.get("deckA") ?? "starter-titan";
        const deckIdB = params.get("deckB") ?? "starter-warden";
        const deckA = alphaClashServerAdapter.practiceDecks?.getDeck(deckIdA);
        const deckB = alphaClashServerAdapter.practiceDecks?.getDeck(deckIdB);
        if (!deckA || !deckB) throw new Error("Practice decks are unavailable.");
        const owners = [HUMAN, BOT];
        const cardsMaps = alphaClashServerAdapter.buildCardInstances(
          [deckA, deckB].map((deck, index) => ({
            owner: owners[index] ?? `owner-${index}`,
            deck: deck.map((entry) => ({
              cardId: entry.cardId,
              qty: entry.quantity,
              ...(entry.sectionId ? { sectionId: entry.sectionId } : {}),
            })),
          })),
        );
        const created = await alphaClashCreateServerEngine({
          gameSlug: "alpha-clash",
          seed: "1",
          player1Id: HUMAN,
          player2Id: BOT,
          cardsMaps,
        });
        if (!cancelled) setEngine(created as AlphaClashServerEngine);
      } catch (loadError) {
        if (!cancelled) {
          setLoadError(loadError instanceof Error ? loadError.message : String(loadError));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const context = useMemo(
    () => ({ gameId: "alpha-clash-local-practice", sourceAuthority: "server" as const }),
    [],
  );

  const logLinesOf = useCallback((result: { engineLogRecords?: readonly unknown[] }): string[] => {
    return practiceLogLines(result.engineLogRecords ?? []);
  }, []);

  const applyResult = useCallback(
    (result: { success: boolean; error?: string; engineLogRecords?: readonly unknown[] }) => {
      if (!engine) return false;
      if (!result.success) {
        setError(result.error ?? "That action is not legal right now.");
        return false;
      }
      setError(null);
      const lines = logLinesOf(result);
      if (lines.length > 0) {
        setLog((current) =>
          [...lines.map((text) => ({ id: (logCounter.current += 1), text })), ...current].slice(
            0,
            60,
          ),
        );
      }
      // Drive the practice bot synchronously until it is the human's turn
      // again (mirrors the adapter's headless automation loop; the engine
      // validates every action at the dispatch boundary).
      let guard = 0;
      if (mode === "self") {
        setVersion(engine.getStateID());
        return true;
      }
      while (!engine.hasGameEnded() && guard < 200) {
        const actor = engine.getActivePlayerId();
        if (actor !== BOT) break;
        const botResult = engine.takeAutomatedAction({ strategyId: "default" }, context);
        if (!botResult.finalResult.success) {
          setError(botResult.finalResult.error ?? "The practice bot could not act.");
          break;
        }
        const botLines = logLinesOf(botResult.finalResult);
        if (botLines.length > 0) {
          setLog((current) =>
            [
              ...botLines.map((text) => ({ id: (logCounter.current += 1), text })),
              ...current,
            ].slice(0, 60),
          );
        }
        guard += 1;
      }
      setVersion(engine.getStateID());
      return true;
    },
    [engine, context, logLinesOf, mode],
  );

  const submit = useCallback(
    (submission: InteractionSubmission) => {
      if (!engine) return;
      const actor = mode === "self" ? (engine.getActivePlayerId() ?? HUMAN) : HUMAN;
      const result = engine.submitInteraction(actor, submission, context);
      setSelections({});
      applyResult(result);
    },
    [engine, context, applyResult, mode],
  );

  if (loadError) {
    return (
      <main className={classes.page}>
        <Title order={2}>Alpha Clash practice</Title>
        <Text c="red">Unable to load the practice match: {loadError}</Text>
      </main>
    );
  }
  if (!engine) {
    return (
      <main className={classes.page}>
        <Title order={2}>Alpha Clash practice</Title>
        <Text>Setting the table…</Text>
      </main>
    );
  }

  const controlledPlayer = mode === "self" ? (engine.getActivePlayerId() ?? HUMAN) : HUMAN;
  const board = engine.getViewerState({
    role: "player",
    actorId: controlledPlayer,
  }) as ProjectedState;
  const view = engine.getInteractionView(controlledPlayer);
  const ended = engine.hasGameEnded();
  const endResult = engine.getGameEndResult();
  const labelFor = (instanceId: string): string => {
    const card = board.cards.find((entry) => entry.instanceId === instanceId);
    if (!card) return instanceId;
    return card.name ?? (card.faceDown ? "Set card" : instanceId);
  };

  return (
    <main
      className={classes.page}
      data-version={version}
      data-practice-mode={mode}
      data-controlled-player={controlledPlayer}
    >
      <div className={classes.tableArea}>
        {mode === "self" ? (
          <Paper withBorder p="xs" radius="md" role="status" aria-live="polite">
            <Text size="sm" fw={600}>
              Play both sides · controlling {controlledPlayer === HUMAN ? "Player 1" : "Player 2"}
            </Text>
          </Paper>
        ) : null}
        {ended ? (
          <Paper
            withBorder
            p="sm"
            radius="md"
            className={`${classes.resultBanner} ${
              endResult?.winnerId === HUMAN ? classes.resultWin : classes.resultLose
            }`}
            data-testid="ac-result"
          >
            <Text fw={700}>
              {mode === "self"
                ? `${endResult?.winnerId === HUMAN ? "Player 1" : "Player 2"} wins`
                : endResult?.winnerId === HUMAN
                  ? "You win"
                  : "You lose"}{" "}
              · {endResult?.reason}
            </Text>
          </Paper>
        ) : null}
        <Tabletop board={board} />
        {error ? (
          <Paper withBorder p="xs" radius="md" className={classes.errorBanner}>
            <Text size="sm" c="red">
              {error}
            </Text>
          </Paper>
        ) : null}
      </div>
      <aside className={classes.sidePanel}>
        <InteractionPanel
          view={view}
          selections={selections}
          setSelections={setSelections}
          onSubmit={submit}
          disabled={ended}
          labelFor={labelFor}
        />
        <Paper withBorder p="sm" radius="md" className={classes.logPanel}>
          <Text fw={600} size="sm" mb={4}>
            Event log
          </Text>
          <Stack gap={2} data-testid="ac-event-log">
            {log.slice(0, 14).map((line) => (
              <Text key={line.id} size="xs" c="dimmed" data-testid="ac-event-log-line">
                {line.text}
              </Text>
            ))}
            {log.length === 0 ? (
              <Text size="xs" c="dimmed">
                The match has not started yet.
              </Text>
            ) : null}
          </Stack>
        </Paper>
      </aside>
    </main>
  );
}

function InteractionPanel({
  view,
  selections,
  setSelections,
  onSubmit,
  disabled,
  labelFor,
}: {
  view: EngineInteractionView;
  selections: Values;
  setSelections: (update: Values) => void;
  onSubmit: (submission: InteractionSubmission) => void;
  disabled: boolean;
  labelFor: (instanceId: string) => string;
}) {
  const actions = view.actions.filter((action) => action.id !== "concede");
  const concede = view.actions.find((action) => action.id === "concede");
  return (
    <Paper withBorder p="sm" radius="md" className={classes.actionPanel}>
      <Text fw={600} size="sm" mb={6}>
        Available actions
      </Text>
      {disabled ? (
        <Text size="sm" c="dimmed">
          The match is over.
        </Text>
      ) : actions.length === 0 ? (
        <Text size="sm" c="dimmed">
          Waiting for the other player…
        </Text>
      ) : (
        <Stack gap="sm">
          {actions.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              selections={selections}
              setSelections={setSelections}
              onSubmit={onSubmit}
              view={view}
              labelFor={labelFor}
            />
          ))}
          {concede ? (
            <ActionCard
              action={concede}
              selections={selections}
              setSelections={setSelections}
              onSubmit={onSubmit}
              view={view}
              labelFor={labelFor}
            />
          ) : null}
        </Stack>
      )}
    </Paper>
  );
}

function ActionCard({
  action,
  selections,
  setSelections,
  onSubmit,
  view,
  labelFor,
}: {
  action: InteractionAction;
  selections: Values;
  setSelections: (update: Values) => void;
  onSubmit: (submission: InteractionSubmission) => void;
  view: EngineInteractionView;
  labelFor: (instanceId: string) => string;
}) {
  const toggleEntity = (inputId: string, instanceId: string, max: number) => {
    const current = selections[inputId];
    const list = Array.isArray(current) ? current : [];
    const next = list.includes(instanceId)
      ? list.filter((id) => id !== instanceId)
      : [...list, instanceId].slice(-max);
    setSelections({ ...selections, [inputId]: next });
  };

  const ready = () => {
    const values: Record<string, string | string[] | number | boolean | Record<string, number>> =
      {};
    for (const input of action.inputs) {
      const value = selections[input.id];
      if (input.kind === "boolean") {
        values[input.id] = value === true;
      } else if (input.kind === "number") {
        values[input.id] = typeof value === "number" ? value : (input.min ?? 0);
      } else if (input.kind === "entity-selection") {
        const list = Array.isArray(value) ? value : [];
        if (list.length === 0) {
          if (input.required) return undefined;
          continue;
        }
        values[input.id] = input.max === 1 ? list[0] : list;
      } else if (input.kind === "option-selection") {
        if (typeof value !== "string") return undefined;
        values[input.id] = value;
      } else if (input.kind === "entity-allocation") {
        const allocation: Record<string, number> = {};
        if (value && typeof value === "object" && !Array.isArray(value)) {
          for (const [instanceId, amount] of Object.entries(value as Record<string, number>)) {
            if (typeof amount === "number" && amount > 0) allocation[instanceId] = amount;
          }
        }
        const total = Object.values(allocation).reduce((sum, amount) => sum + amount, 0);
        if (total !== ("totalMin" in input ? input.totalMin : 0)) return undefined;
        values[input.id] = allocation;
      }
    }
    return buildInteractionSubmission({ view, action, values });
  };

  return (
    <Paper
      withBorder
      p="xs"
      radius="sm"
      className={classes.actionCard}
      data-testid={`ac-action-card:${action.id}`}
    >
      <Text size="sm" fw={600}>
        {action.text.key}
      </Text>
      <Stack gap={4} mt={4}>
        {action.inputs.map((input) => (
          <InputControl
            key={input.id}
            input={input}
            selection={selections[input.id]}
            onSelect={(value) => setSelections({ ...selections, [input.id]: value })}
            onToggle={(instanceId, max) => toggleEntity(input.id, instanceId, max)}
            labelFor={labelFor}
          />
        ))}
        <Button
          size="compact-sm"
          variant={action.id === "concede" ? "outline" : "light"}
          color={action.id === "concede" ? "red" : undefined}
          disabled={
            action.id === "concede" && action.inputs.length > 0 && selections.confirm !== true
          }
          data-testid={`ac-action-submit:${action.id}`}
          onClick={() => {
            const submission =
              action.inputs.length === 0 ? buildInteractionSubmission({ view, action }) : ready();
            if (submission) onSubmit(submission);
          }}
        >
          {action.inputs.length === 0 ? action.text.key : "Confirm"}
        </Button>
      </Stack>
    </Paper>
  );
}

function InputControl({
  input,
  selection,
  onSelect,
  onToggle,
  labelFor,
}: {
  input: InteractionInput;
  selection: Values[string] | undefined;
  onSelect: (value: string | number | boolean | Record<string, number>) => void;
  onToggle: (instanceId: string, max: number) => void;
  labelFor: (instanceId: string) => string;
}) {
  if (input.kind === "boolean") {
    return (
      <Group gap="xs">
        <Button
          size="compact-xs"
          variant={selection === true ? "filled" : "light"}
          onClick={() => onSelect(true)}
        >
          {input.trueText.key}
        </Button>
        <Button
          size="compact-xs"
          variant={selection === false ? "filled" : "light"}
          onClick={() => onSelect(false)}
        >
          {input.falseText.key}
        </Button>
      </Group>
    );
  }
  if (input.kind === "option-selection") {
    return (
      <Group gap={4}>
        {input.options.map((option) => (
          <Button
            key={option.id}
            size="compact-xs"
            variant={selection === option.id ? "filled" : "light"}
            onClick={() => onSelect(option.id)}
          >
            {option.text.key}
          </Button>
        ))}
      </Group>
    );
  }
  if (input.kind === "number") {
    return (
      <Group gap={4}>
        {Array.from(
          { length: (input.max ?? 0) - (input.min ?? 0) + 1 },
          (_, index) => (input.min ?? 0) + index,
        ).map((value) => (
          <Button
            key={value}
            size="compact-xs"
            variant={selection === value ? "filled" : "light"}
            onClick={() => onSelect(value)}
          >
            {value}
          </Button>
        ))}
      </Group>
    );
  }
  if (input.kind === "entity-selection" || input.kind === "entity-allocation") {
    return (
      <Group gap={4} wrap="wrap">
        {input.candidates.map((candidate) => {
          const instanceId = candidate.entity.instanceId;
          if (input.kind === "entity-allocation") {
            const amount =
              selection && typeof selection === "object" && !Array.isArray(selection)
                ? (selection as Record<string, number>)[instanceId]
                : undefined;
            return (
              <Button
                key={instanceId}
                size="compact-xs"
                variant={amount ? "filled" : "light"}
                onClick={() => {
                  const current =
                    selection && typeof selection === "object" && !Array.isArray(selection)
                      ? { ...(selection as Record<string, number>) }
                      : {};
                  onSelect({ ...current, [instanceId]: (amount ?? 0) + 1 });
                }}
              >
                {labelFor(instanceId)}
                {amount ? ` ×${amount}` : ""}
              </Button>
            );
          }
          const list = Array.isArray(selection) ? selection : [];
          return (
            <Button
              key={instanceId}
              size="compact-xs"
              variant={list.includes(instanceId) ? "filled" : "light"}
              onClick={() => onToggle(instanceId, input.max ?? 1)}
            >
              {labelFor(instanceId)}
            </Button>
          );
        })}
      </Group>
    );
  }
  return null;
}

export default AlphaClashPracticePage;

/**
 * Extracts concise player-facing lines from adapter EngineLogRecords: each
 * record envelopes the canonical log on `.log`, whose `public` messages carry
 * the player-readable `defaultMessage`.
 */
export function practiceLogLines(records: readonly unknown[]): string[] {
  const wrapped = records as ReadonlyArray<
    { log?: { public?: readonly { defaultMessage?: string }[] } } | null | undefined
  >;
  return wrapped
    .flatMap((record) => record?.log?.public ?? [])
    .map((message) => message.defaultMessage ?? "")
    .filter((text) => text.length > 0);
}
