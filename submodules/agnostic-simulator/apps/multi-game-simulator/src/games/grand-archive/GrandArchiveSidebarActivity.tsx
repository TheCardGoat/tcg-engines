import { getGrandArchiveCard, searchGrandArchiveCards } from "@tcg/grand-archive-cards";
import { Loader } from "@mantine/core";
import type {
  SimulatorCardReference,
  SimulatorEntity,
  SimulatorInteraction,
  SimulatorMatchHistoryRow,
  SimulatorSeat,
} from "@tcg/simulator-contract";
import { copyTextToClipboard, safeStringify } from "@tcg/simulator-runtime/debug";
import {
  EventLogPanel,
  FixtureNavigation,
  MatchHistoryPanel,
  RunbookPanel,
  type SimulatorActivityTab,
  type SimulatorMatchActivity,
} from "@tcg/simulator-ui";
import { Check, ClipboardCopy, FlaskConical } from "lucide-react";
import { useState, type ReactNode } from "react";

import type { GrandArchiveHarnessFixture } from "./fixtureProjection";
import { useGrandArchiveCardPreview } from "./GrandArchiveCardPreview";

export interface GrandArchiveNowState {
  readonly title: string;
  readonly detail: string;
  readonly context: string;
  readonly sessionLabel: string;
  readonly controlLabel: string;
  readonly tone: "ready" | "thinking" | "waiting" | "error" | "complete";
  readonly pendingDecision?: string;
}

export interface GrandArchiveSidebarActivityProps {
  readonly fixture: GrandArchiveHarnessFixture;
  readonly fixtures?: readonly GrandArchiveHarnessFixture[];
  readonly onSelectFixture?: (fixtureId: string) => void;
  readonly onBeginAction?: (actionId: string) => void;
  readonly chat?: ReactNode;
  readonly historyAccessory?: ReactNode;
  readonly errorMessage?: string;
  readonly activeTab?: SimulatorActivityTab;
  readonly onActiveTabChange?: (tab: SimulatorActivityTab) => void;
}

export function createGrandArchiveSidebarActivity({
  fixture,
  fixtures,
  onSelectFixture,
  onBeginAction,
  chat,
  historyAccessory,
  errorMessage,
  activeTab,
  onActiveTabChange,
}: GrandArchiveSidebarActivityProps): SimulatorMatchActivity {
  const selfSeat = fixture.table.seats.find((seat) => seat.perspective === "bottom");
  if (!selfSeat) throw new Error("Grand Archive activity requires a viewer seat.");

  const modeLabel = fixtures ? "Local fixture" : "Match";
  const now = grandArchiveNowState(fixture, selfSeat, modeLabel, errorMessage);
  const showLab = Boolean(fixtures) || import.meta.env.DEV;

  return {
    combined: (
      <GrandArchiveHistory
        fixture={fixture}
        viewerSeatId={selfSeat.id}
        historyAccessory={historyAccessory}
      />
    ),
    combinedLabel: "History",
    log: <GrandArchiveNow fixture={fixture} now={now} onBeginAction={onBeginAction} />,
    logLabel: "Now",
    chat,
    chatLabel: chat ? "Chat" : undefined,
    secondary: showLab ? (
      <GrandArchiveLab
        fixture={fixture}
        fixtures={fixtures}
        onSelectFixture={onSelectFixture}
        modeLabel={modeLabel}
      />
    ) : undefined,
    secondaryLabel: showLab ? "Lab" : undefined,
    defaultTab: "combined",
    activeTab,
    onActiveTabChange,
  };
}

export function grandArchiveNowState(
  fixture: GrandArchiveHarnessFixture,
  selfSeat: SimulatorSeat,
  sessionLabel: string,
  errorMessage?: string,
): GrandArchiveNowState {
  const phase = fixture.table.status.phase;
  const phaseLabel = phase.split(" · ")[0] ?? phase;
  const { waitState } = fixture;
  const actingPlayerId = "playerId" in waitState ? waitState.playerId : undefined;
  const viewerHasControl = actingPlayerId === selfSeat.id;
  const pendingDecision =
    waitState.kind === "decision"
      ? fixture.interactions.find((interaction) => interaction.input.kind !== "action")
      : undefined;
  const contextualActionCount = fixture.interactions.filter(
    (interaction) => !isGrandArchiveDockInteraction(interaction),
  ).length;

  if (errorMessage) {
    return {
      title: "Action needs attention",
      detail: errorMessage,
      context: `Turn ${fixture.table.status.turn} · ${phaseLabel}`,
      sessionLabel,
      controlLabel: "Review the message, then choose another legal action.",
      tone: "error",
    };
  }

  switch (waitState.kind) {
    case "game-over":
      return {
        title: "Match complete",
        detail: "Review the result or inspect the final match state.",
        context: `Turn ${fixture.table.status.turn} · ${phaseLabel}`,
        sessionLabel,
        controlLabel: "No further actions are available.",
        tone: "complete",
      };
    case "resolving":
      return {
        title: "Resolving effects",
        detail: "The current effect sequence is resolving.",
        context: `Turn ${fixture.table.status.turn} · ${phaseLabel}`,
        sessionLabel,
        controlLabel: "The game engine is resolving the current sequence.",
        tone: "thinking",
      };
    case "decision":
    case "pregame-action":
    case "materialization-choice":
    case "opportunity": {
      const title =
        pendingDecision?.label ??
        (viewerHasControl ? `Your ${phaseLabel}` : `Opponent · ${phaseLabel}`);
      return {
        title,
        detail:
          pendingDecision?.prompt ??
          (waitState.kind === "pregame-action"
            ? viewerHasControl
              ? "Complete your pre-game actions to continue."
              : "Waiting for the opponent to complete pre-game actions."
            : waitState.kind === "materialization-choice"
              ? viewerHasControl
                ? "Choose a card to materialize."
                : "Waiting for the opponent to materialize a card."
              : viewerHasControl
                ? "Choose a legal action or pass priority."
                : "Waiting for the opponent to act or pass priority."),
        context: `Turn ${fixture.table.status.turn} · ${phaseLabel}`,
        sessionLabel,
        controlLabel: viewerHasControl
          ? `${contextualActionCount} legal ${contextualActionCount === 1 ? "action" : "actions"}`
          : "Opponent has control",
        tone: viewerHasControl ? "ready" : "waiting",
        ...(pendingDecision ? { pendingDecision: pendingDecision.label } : {}),
      };
    }
    default:
      return assertNever(waitState);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unsupported Grand Archive wait state: ${JSON.stringify(value)}`);
}

function GrandArchiveNow({
  fixture,
  now,
  onBeginAction,
}: {
  readonly fixture: GrandArchiveHarnessFixture;
  readonly now: GrandArchiveNowState;
  readonly onBeginAction?: (actionId: string) => void;
}) {
  return (
    <section
      className="ga-sidebar-now"
      data-tone={now.tone}
      aria-label="Current match state"
      data-testid="ga-sidebar-now"
    >
      <header className="ga-sidebar-now-header">
        {now.tone === "thinking" ? (
          <Loader
            className="ga-sidebar-now-signal ga-sidebar-now-loader"
            size="xs"
            color="yellow"
            aria-hidden="true"
          />
        ) : (
          <span className="ga-sidebar-now-signal" aria-hidden="true" />
        )}
        <div>
          <strong>{now.title}</strong>
          <span>{now.context}</span>
        </div>
      </header>
      <p className="ga-sidebar-now-detail" aria-live="polite">
        {now.detail}
      </p>
      <div className="ga-sidebar-control-state">
        <span>{now.controlLabel}</span>
        {now.pendingDecision ? <span>Decision · {now.pendingDecision}</span> : null}
      </div>
      <div className="ga-sidebar-now-actions">
        <GrandArchiveNowActions fixture={fixture} onBeginAction={onBeginAction} />
      </div>
      <p className="ga-sidebar-now-disclosure">
        Only actions currently accepted by the game engine are available.
      </p>
    </section>
  );
}

function GrandArchiveNowActions({
  fixture,
  onBeginAction,
}: {
  readonly fixture: GrandArchiveHarnessFixture;
  readonly onBeginAction?: (actionId: string) => void;
}) {
  const legalActions = fixture.interactions.filter(
    (interaction) => !isGrandArchiveDockInteraction(interaction),
  );
  const sourceCounts = new Map<string, number>();
  for (const interaction of legalActions) {
    if (!interaction.sourceEntityId) continue;
    const source = fixture.entities.find((entity) => entity.id === interaction.sourceEntityId);
    if (!source) continue;
    sourceCounts.set(source.title, (sourceCounts.get(source.title) ?? 0) + 1);
  }
  const sourcePositions = new Map<string, number>();

  if (legalActions.length === 0) {
    return <p className="ga-sidebar-no-actions">No contextual action is available.</p>;
  }

  return (
    <div className="ga-sidebar-action-menu" aria-label="Legal actions">
      {legalActions.map((interaction) => {
        const source = interaction.sourceEntityId
          ? fixture.entities.find((entity) => entity.id === interaction.sourceEntityId)
          : undefined;
        const sourceCount = source ? (sourceCounts.get(source.title) ?? 1) : 1;
        const sourcePosition = source ? (sourcePositions.get(source.title) ?? 0) + 1 : undefined;
        if (source && sourcePosition) sourcePositions.set(source.title, sourcePosition);
        const sourceContext = source
          ? sourceCount > 1
            ? `${source.title} · copy ${sourcePosition} of ${sourceCount}`
            : `${source.title} · ${source.subtitle}`
          : undefined;
        return (
          <button
            key={interaction.id}
            type="button"
            aria-label={
              sourceContext ? `${interaction.label}, ${sourceContext}` : interaction.label
            }
            disabled={
              !onBeginAction ||
              !fixture.interactionView?.actions.some(
                (action) => action.id === interaction.id && action.enabled,
              )
            }
            onClick={() => onBeginAction?.(interaction.id)}
          >
            <strong>{interaction.label}</strong>
            {sourceContext ? <span>{sourceContext}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

function isGrandArchiveDockInteraction(interaction: SimulatorInteraction): boolean {
  return (
    interaction.movePreview.command === "pass" ||
    interaction.movePreview.command === "skip-materialization" ||
    interaction.movePreview.command === "concede"
  );
}

function GrandArchiveHistory({
  fixture,
  viewerSeatId,
  historyAccessory,
}: {
  readonly fixture: GrandArchiveHarnessFixture;
  readonly viewerSeatId: string;
  readonly historyAccessory?: ReactNode;
}) {
  const rows = projectGrandArchiveMatchHistory(fixture);
  return (
    <section
      className="ga-sidebar-history-surface"
      data-has-accessory={historyAccessory ? "true" : "false"}
    >
      <div className="ga-sidebar-activity" data-testid="ga-sidebar-history">
        <MatchHistoryPanel
          rows={rows}
          embedded
          viewerSeatId={viewerSeatId}
          rowAlignment="left"
          rowVariant={(row) =>
            !row.actorSeatId ? "system" : row.actorSeatId === viewerSeatId ? "viewer" : "opponent"
          }
          turnOwnerLabel={(turn, turnRows) =>
            grandArchiveTurnOwnerLabel(turn, turnRows, viewerSeatId)
          }
          renderCardReference={(reference) => (
            <GrandArchiveHistoryCardReference fixture={fixture} reference={reference} />
          )}
          renderTitle={(row) => <GrandArchiveLogMessage fixture={fixture} row={row} />}
        />
      </div>
      {historyAccessory}
    </section>
  );
}

export function projectGrandArchiveMatchHistory(
  fixture: GrandArchiveHarnessFixture,
): readonly SimulatorMatchHistoryRow[] {
  const viewerSeatId = fixture.table.seats.find((seat) => seat.perspective === "bottom")?.id;
  const rows: SimulatorMatchHistoryRow[] = (fixture.eventLog ?? [])
    .map((entry) => ({
      id: entry.id,
      turn: entry.turn,
      timestamp: entry.timestamp,
      ...(entry.seatId ? { actorSeatId: entry.seatId } : {}),
      ...(entry.section?.actorSeatId ? { turnOwnerSeatId: entry.section.actorSeatId } : {}),
      kind: grandArchiveHistoryKind(entry),
      title: grandArchiveNarrativeMessage(entry.message, entry.seatId, fixture, viewerSeatId),
      ...(entry.entityIds ? { entityIds: entry.entityIds } : {}),
      ...(entry.cardRefs ? { cardRefs: entry.cardRefs } : {}),
    }))
    .filter((row) => row.title.trim().replaceAll(".", "").length > 0);
  const distilled: SimulatorMatchHistoryRow[] = [];
  for (const row of rows) {
    const isHiddenDraw = /^(You|Opponent|.+) drew a hidden card\.$/.test(row.title);
    const previous = distilled.at(-1);
    if (
      isHiddenDraw &&
      previous?.turn === row.turn &&
      previous.actorSeatId === row.actorSeatId &&
      /^(You|Opponent|.+) drew (?:a hidden card|\d+ hidden cards)\.$/.test(previous.title)
    ) {
      const previousCount = Number(previous.title.match(/drew (\d+) hidden cards/)?.[1] ?? 1);
      distilled[distilled.length - 1] = {
        ...previous,
        id: `${previous.id}:${row.id}`,
        timestamp: row.timestamp,
        title: `${grandArchiveActorLabel(row.actorSeatId, fixture, viewerSeatId)} drew ${previousCount + 1} hidden cards.`,
      };
      continue;
    }
    distilled.push(row);
  }
  if (distilled.length > 0 && !distilled.some((row) => row.kind === "match-start")) {
    const first = distilled[0]!;
    distilled.unshift({
      id: `match-start:${fixture.id}`,
      turn: first.turn,
      timestamp: first.timestamp,
      kind: "match-start",
      title: "Match started.",
      ...(first.turnOwnerSeatId ? { turnOwnerSeatId: first.turnOwnerSeatId } : {}),
    });
  }
  return distilled;
}

function grandArchiveNarrativeMessage(
  message: string,
  actorSeatId: string | undefined,
  fixture: GrandArchiveHarnessFixture,
  viewerSeatId: string | undefined,
): string {
  const actor = grandArchiveActorLabel(actorSeatId, fixture, viewerSeatId);
  const materializedCard = message.match(/^.+ moved (.+) from material-deck to field\.$/);
  if (materializedCard?.[1]) return `${actor} materialized ${materializedCard[1]}.`;
  const hiddenDraw = message.match(/^.+ moved a card from main-deck to hand\.$/);
  if (hiddenDraw) return `${actor} drew a hidden card.`;
  const namedDraw = message.match(/^.+ moved (.+) from main-deck to hand\.$/);
  if (namedDraw?.[1]) return `${actor} drew ${namedDraw[1]}.`;
  const stackedCard = message.match(/^.+ added (.+) to the Effects Stack\.$/);
  if (stackedCard?.[1]) return `${actor} put ${stackedCard[1]} on the Effects Stack.`;
  if (message === "The top item of the Effects Stack resolved.") return "The top effect resolved.";
  if (!actorSeatId) return message;
  const seat = fixture.table.seats.find((candidate) => candidate.id === actorSeatId);
  const prefixes = [actorSeatId, seat?.label].filter((value): value is string => Boolean(value));
  const prefix = prefixes.find((value) => message.startsWith(`${value} `));
  return prefix ? `${actor}${message.slice(prefix.length)}` : message;
}

function grandArchiveActorLabel(
  actorSeatId: string | undefined,
  fixture: GrandArchiveHarnessFixture,
  viewerSeatId: string | undefined,
): string {
  if (!actorSeatId) return "A player";
  if (actorSeatId === viewerSeatId) return "You";
  return fixture.table.seats.some((seat) => seat.id === actorSeatId) ? "Opponent" : actorSeatId;
}

function grandArchiveHistoryKind(
  entry: NonNullable<GrandArchiveHarnessFixture["eventLog"]>[number],
): SimulatorMatchHistoryRow["kind"] {
  if (entry.tags.includes("combat")) return "combat";
  if (entry.tags.includes("system") && entry.turn === 0) return "match-start";
  if (
    entry.sourceKey === "grand-archive.match.finished" ||
    entry.sourceKey === "grand-archive.player.lost"
  )
    return "outcome";
  if (entry.message.includes("passed Opportunity")) return "priority-pass";
  return "activity";
}

function grandArchiveTurnOwnerLabel(
  turn: number,
  rows: readonly SimulatorMatchHistoryRow[],
  viewerSeatId: string,
): string {
  if (turn === 0) return "Pregame";
  const ownerId = rows.find((row) => row.turnOwnerSeatId)?.turnOwnerSeatId;
  if (!ownerId) return "Match";
  return ownerId === viewerSeatId ? "You" : "Opponent";
}

function GrandArchiveLogMessage({
  fixture,
  row,
}: {
  readonly fixture: GrandArchiveHarnessFixture;
  readonly row: SimulatorMatchHistoryRow;
}) {
  const referencesByName = new Map<string, SimulatorCardReference[]>();
  for (const reference of row.cardRefs ?? []) {
    const references = referencesByName.get(reference.name) ?? [];
    references.push(reference);
    referencesByName.set(reference.name, references);
  }
  const names = [...referencesByName.keys()].sort((left, right) => right.length - left.length);
  if (names.length === 0) return row.title;
  const matcher = new RegExp(`(${names.map(escapeRegExp).join("|")})`, "g");
  return row.title.split(matcher).map((segment, index) => {
    const reference = referencesByName.get(segment)?.shift();
    return reference ? (
      <GrandArchiveHistoryCardReference
        key={`${segment}-${index}`}
        fixture={fixture}
        reference={reference}
      />
    ) : (
      segment
    );
  });
}

function GrandArchiveHistoryCardReference({
  fixture,
  reference,
}: {
  readonly fixture: GrandArchiveHarnessFixture;
  readonly reference: SimulatorCardReference;
}) {
  const entity =
    (reference.entityId
      ? fixture.entities.find((candidate) => candidate.id === reference.entityId)
      : undefined) ??
    fixture.entities.find(
      (candidate) => candidate.face === "public" && candidate.title === reference.name,
    );

  const definition =
    (reference.definitionId ? getGrandArchiveCard(reference.definitionId) : undefined) ??
    searchGrandArchiveCards(reference.name).find((card) => card.name === reference.name);
  const imageUrl = entity?.imageUrl ?? definition?.printings[0]?.imageUrl;
  const title = entity?.title ?? definition?.name ?? reference.name;
  const subtitle = entity?.subtitle ?? definition?.types.join(" · ");
  const { previewedEntityId, show, hide } = useGrandArchiveCardPreview();
  if (!imageUrl) return <strong className="ga-history-card-label">{reference.name}</strong>;

  const previewEntity: SimulatorEntity = entity ?? {
    id: `history:${reference.definitionId ?? reference.name}`,
    title,
    subtitle: subtitle ?? "Grand Archive card",
    kind: "card",
    ownerId: "history",
    face: "public",
    imageUrl,
    imageAspectRatio: 5 / 7,
    states: [],
    stats: [],
    traits: [...(definition?.types ?? [])],
  };

  return (
    <button
      type="button"
      className="ga-history-card-reference"
      aria-label={`Preview ${reference.name}`}
      aria-controls="ga-card-preview"
      aria-expanded={previewedEntityId === previewEntity.id}
      onMouseEnter={() => show(previewEntity)}
      onMouseLeave={hide}
      onFocus={() => show(previewEntity)}
      onBlur={hide}
      onClick={() => (previewedEntityId === previewEntity.id ? hide() : show(previewEntity))}
      onKeyDown={(event) => {
        if (event.key === "Escape") hide();
      }}
    >
      {reference.name}
    </button>
  );
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function GrandArchiveLab({
  fixture,
  fixtures,
  onSelectFixture,
  modeLabel,
}: {
  readonly fixture: GrandArchiveHarnessFixture;
  readonly fixtures?: readonly GrandArchiveHarnessFixture[];
  readonly onSelectFixture?: (fixtureId: string) => void;
  readonly modeLabel: string;
}) {
  const selfSeat = fixture.table.seats.find((seat) => seat.perspective === "bottom");
  return (
    <section className="ga-sidebar-lab" data-testid="ga-sidebar-lab">
      <header className="ga-sidebar-lab-heading">
        <span>
          <FlaskConical aria-hidden="true" size={15} strokeWidth={1.8} />
          <strong>Grand Archive Lab</strong>
        </span>
        <small>
          {fixture.interactions.length} legal{" "}
          {fixture.interactions.length === 1 ? "action" : "actions"}
        </small>
      </header>
      <div className="ga-sidebar-lab-content">
        <section aria-labelledby="ga-lab-trace-heading">
          <LabHeading id="ga-lab-trace-heading" title="Detailed trace">
            Viewer-safe events grouped by turn and engine section
          </LabHeading>
          <EventLogPanel
            entries={fixture.eventLog ?? []}
            embedded
            turnExpansion="latest"
            sectionExpansion="latest"
            rawCopyText={safeStringify(fixture.eventLog ?? [])}
          />
        </section>

        <section aria-labelledby="ga-lab-session-heading">
          <LabHeading id="ga-lab-session-heading" title="Session">
            Current simulator projection
          </LabHeading>
          <dl className="ga-sidebar-session-details">
            <div>
              <dt>Mode</dt>
              <dd>{modeLabel}</dd>
            </div>
            <div>
              <dt>Scenario</dt>
              <dd>{fixture.name}</dd>
            </div>
            <div>
              <dt>Viewer</dt>
              <dd>{selfSeat?.label ?? "Unknown"}</dd>
            </div>
            <div>
              <dt>Turn</dt>
              <dd>{fixture.table.status.turn}</dd>
            </div>
            <div>
              <dt>Phase</dt>
              <dd>{fixture.table.status.phase}</dd>
            </div>
            <div>
              <dt>State</dt>
              <dd>{fixture.table.status.stateVersion}</dd>
            </div>
          </dl>
        </section>

        {fixtures && fixtures.length > 1 && onSelectFixture ? (
          <section aria-labelledby="ga-lab-fixtures-heading">
            <LabHeading id="ga-lab-fixtures-heading" title="Fixture controls">
              Local scenario navigation and verification steps
            </LabHeading>
            <FixtureNavigation
              fixtures={[...fixtures]}
              activeFixture={fixture}
              onSelectFixture={onSelectFixture}
            />
            <RunbookPanel fixture={fixture} />
          </section>
        ) : null}

        <section aria-labelledby="ga-lab-decisions-heading">
          <LabHeading id="ga-lab-decisions-heading" title="Current decisions">
            Authoritative commands accepted in this state
          </LabHeading>
          <GrandArchiveDecisionLog interactions={fixture.interactions} />
        </section>

        <section aria-labelledby="ga-lab-debug-heading">
          <LabHeading id="ga-lab-debug-heading" title="Debug snapshots">
            Viewer-safe table and interaction projections
          </LabHeading>
          <div className="ga-sidebar-debug">
            <GrandArchiveDebugPayload
              key={`viewer:${fixture.table.status.stateVersion}`}
              label="Viewer projection"
              value={{ table: fixture.table, entities: fixture.entities }}
            />
            <GrandArchiveDebugPayload
              key={`interactions:${fixture.table.status.stateVersion}`}
              label="Interaction projection"
              value={fixture.interactions}
            />
          </div>
        </section>
      </div>
    </section>
  );
}

function LabHeading({
  id,
  title,
  children,
}: {
  readonly id: string;
  readonly title: string;
  readonly children: ReactNode;
}) {
  return (
    <header className="ga-sidebar-lab-section-heading">
      <h4 id={id}>{title}</h4>
      <span>{children}</span>
    </header>
  );
}

function GrandArchiveDecisionLog({
  interactions,
}: {
  readonly interactions: readonly SimulatorInteraction[];
}) {
  if (interactions.length === 0) {
    return <p className="ga-sidebar-empty">No player decision is pending.</p>;
  }
  return (
    <ol className="ga-sidebar-decisions" aria-label="Current legal decisions">
      {interactions.map((interaction) => (
        <li key={interaction.id}>
          <strong>{interaction.label}</strong>
          <span>{interaction.prompt}</span>
          <small>
            {interaction.input.kind} · {interaction.movePreview.command}
          </small>
        </li>
      ))}
    </ol>
  );
}

function GrandArchiveDebugPayload({
  label,
  value,
}: {
  readonly label: string;
  readonly value: unknown;
}) {
  const [feedback, setFeedback] = useState<"idle" | "copied" | "failed">("idle");
  const [payload, setPayload] = useState<string>();
  const revealPayload = () => setPayload((current) => current ?? safeStringify(value));
  const copy = async () => {
    const serialized = payload ?? safeStringify(value);
    setPayload(serialized);
    setFeedback((await copyTextToClipboard(serialized)) ? "copied" : "failed");
  };
  return (
    <details className="ga-sidebar-debug-payload" onToggle={revealPayload}>
      <summary>{label}</summary>
      <div>
        <button type="button" onClick={() => void copy()}>
          {feedback === "copied" ? (
            <Check aria-hidden="true" size={14} />
          ) : (
            <ClipboardCopy aria-hidden="true" size={14} />
          )}
          Copy {label.toLocaleLowerCase()}
        </button>
        {feedback !== "idle" ? (
          <span role="status">{feedback === "copied" ? "Copied." : "Clipboard unavailable."}</span>
        ) : null}
      </div>
      {payload ? <pre>{payload}</pre> : null}
    </details>
  );
}
