import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent, ReactNode } from "react";
import type { SimulatorEventLogEntry } from "@tcg/simulator-contract";
import { RefreshCw } from "lucide-react";

import { m } from "../../lib/i18n/messages.ts";
import { CardLinkedText } from "./CardLinkedText.tsx";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../primitives/index.ts";
import type { CardColor } from "./types.ts";

const MOM = {
  deep: "#e9eef5",
  surface: "#ffffff",
  surface2: "#fbfcfe",
  panel: "rgba(255,255,255,.96)",
  blue: "#2d6bff",
  blueHot: "#5a8dff",
  blueDeep: "#1c4cd1",
  blueDim: "rgba(45,107,255,.22)",
  red: "#ff2d7a",
  redDeep: "#c8155a",
  win: "#2ea65a",
  winDeep: "#1c7440",
  cyan: "#7bb7ff",
  text: "#1a2542",
  textDim: "#5c6b8a",
} as const;

interface OutcomeTheme {
  readonly accent: string;
  readonly accentDeep: string;
  readonly tagBg: string;
  readonly tagBorder: string;
  readonly glow: string;
  readonly labelKey: string;
  readonly defaultTitleKey: string;
  readonly defaultSubtitleKey: string;
  readonly bgWash: string;
}

type Outcome = "defeat" | "victory" | "draw";

const OUTCOME_THEMES: Record<Outcome, OutcomeTheme> = {
  defeat: {
    accent: MOM.red,
    accentDeep: MOM.redDeep,
    tagBg: "rgba(255,45,122,.14)",
    tagBorder: "rgba(255,45,122,.55)",
    glow: "rgba(255,45,122,.5)",
    labelKey: "sim.matchOverview.outcome.defeat.label",
    defaultTitleKey: "sim.matchOverview.outcome.defeat.title",
    defaultSubtitleKey: "sim.matchOverview.outcome.defeat.subtitle",
    bgWash: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,45,122,.18), transparent 60%)",
  },
  victory: {
    accent: MOM.win,
    accentDeep: MOM.winDeep,
    tagBg: "rgba(46,166,90,.14)",
    tagBorder: "rgba(46,166,90,.55)",
    glow: "rgba(46,166,90,.45)",
    labelKey: "sim.matchOverview.outcome.victory.label",
    defaultTitleKey: "sim.matchOverview.outcome.victory.title",
    defaultSubtitleKey: "sim.matchOverview.outcome.victory.subtitle",
    bgWash: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(46,166,90,.16), transparent 60%)",
  },
  draw: {
    accent: MOM.blue,
    accentDeep: MOM.blueDeep,
    tagBg: "rgba(45,107,255,.14)",
    tagBorder: "rgba(45,107,255,.55)",
    glow: "rgba(45,107,255,.4)",
    labelKey: "sim.matchOverview.outcome.draw.label",
    defaultTitleKey: "sim.matchOverview.outcome.draw.title",
    defaultSubtitleKey: "sim.matchOverview.outcome.draw.subtitle",
    bgWash: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(45,107,255,.14), transparent 60%)",
  },
};

export interface PlayerRecap {
  readonly name: string;
  readonly avatar?: string;
  readonly shields: number;
  readonly deck: number;
  readonly hand: number;
  readonly trash: number;
  readonly resourcesActive: number;
  readonly resourcesTotal: number;
  readonly colors?: readonly CardColor[];
  readonly unitsInPlay: number;
  readonly activeUnits: number;
  readonly restedUnits: number;
  readonly unitsDeployed: number;
  readonly basesDeployed: number;
  readonly commandsPlayed: number;
  readonly pilotsPaired: number;
  readonly attacks: number;
  readonly blocks: number;
  readonly moves: number;
  readonly effectsResolved: number;
}

export interface TimelineEvent {
  readonly turn: number;
  readonly who: "self" | "opp";
  readonly text: string;
  /** Card instances named in the event text, rendered as hoverable references. */
  readonly cardRefs?: SimulatorEventLogEntry["cardRefs"];
}

export interface MatchResult {
  readonly outcome: Outcome;
  readonly headline?: string;
  readonly subtitle?: string;
  readonly reason?: string;
  readonly turn: number;
  readonly duration: string;
  readonly moves: number;
  readonly self: PlayerRecap;
  readonly opponent: PlayerRecap;
  readonly timeline?: readonly TimelineEvent[];
  readonly notes?: string;
}

export interface MatchOverviewModalProps {
  readonly result: MatchResult | null;
  readonly onClose: () => void;
  readonly onBackToMatchmaking: () => void;
  /** Present only when the completed match has an exact bot-practice recipe. */
  readonly onRematch?: () => void;
  readonly onDownloadReplay: () => void;
  readonly onSaveReplay: () => void;
  readonly onWatchReplay?: () => void;
  /** Persists the viewer's private, match-level notes for a hosted game. */
  readonly onSaveNotes: (note: string) => Promise<NotesSaveResult>;
  /** Practice games have no hosted match record to attach notes to. */
  readonly canSaveNotes: boolean;
  readonly onReportBug: () => void;
  readonly onShareFeedback: () => void;
}

type Tab = "overview" | "timeline" | "notes";
type NotesSaveError = "unauthenticated" | "failed";
export type NotesSaveResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly error: NotesSaveError };

export function MatchOverviewModal({
  result,
  onClose,
  onBackToMatchmaking,
  onRematch,
  onDownloadReplay,
  onSaveReplay,
  onWatchReplay,
  onSaveNotes,
  canSaveNotes,
  onReportBug,
  onShareFeedback,
}: MatchOverviewModalProps) {
  const [tab, setTab] = useState<Tab>("overview");
  const [noteText, setNoteText] = useState("");
  const [savedNoteText, setSavedNoteText] = useState("");
  const [hasSavedNotes, setHasSavedNotes] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaveError, setNotesSaveError] = useState<NotesSaveError | null>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (result && !wasOpen.current) {
      const notes = result.notes ?? "";
      setNoteText(notes);
      setSavedNoteText(notes);
      setHasSavedNotes(result.notes !== undefined);
      setSavingNotes(false);
      setNotesSaveError(null);
    }
    wasOpen.current = result !== null;
  }, [result]);

  const open = result !== null;
  const theme = result
    ? (OUTCOME_THEMES[result.outcome] ?? OUTCOME_THEMES.draw)
    : OUTCOME_THEMES.draw;
  const title = result?.headline || m[theme.defaultTitleKey]();
  const subtitle = result?.subtitle || m[theme.defaultSubtitleKey]();

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose?.();
      }}
    >
      <DialogContent
        className="gd-match-overview-dialog hud-corner flex flex-col overflow-hidden w-full h-[100dvh] md:w-[min(980px,100%)] md:h-auto md:max-h-[calc(100dvh-56px)] md:clip-hud-16"
        style={{
          background: `${theme.bgWash}, linear-gradient(180deg, ${MOM.surface} 0%, ${MOM.deep} 100%)`,
          border: `1px solid ${theme.tagBorder}`,
          boxShadow: `0 0 48px ${theme.glow}, 0 20px 60px rgba(0,0,0,.7), inset 0 0 40px rgba(0,0,0,.05)`,
          paddingTop: "var(--safe-top)",
          paddingBottom: "var(--safe-bottom)",
        }}
      >
        <DialogTitle className="sr-only">
          {m["sim.matchOverview.aria.matchResult"]({
            outcome: result?.outcome ?? m["sim.matchOverview.aria.outcomeStalemate"](),
            title,
          })}
        </DialogTitle>
        <DialogDescription className="sr-only">{subtitle}</DialogDescription>

        {result && (
          <>
            {/* Subtle telemetric grid wash */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(${theme.accent} 1px, transparent 1px),
                             linear-gradient(90deg, ${theme.accent} 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
                opacity: 0.05,
                maskImage: "radial-gradient(ellipse 80% 80% at 50% 30%, #000 20%, transparent 80%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 80% 80% at 50% 30%, #000 20%, transparent 80%)",
              }}
            />

            <HeaderStrip
              result={result}
              theme={theme}
              title={title}
              subtitle={subtitle}
              onClose={onClose}
            />

            <StatStrip result={result} theme={theme} />

            <TabBar tab={tab} onTab={setTab} theme={theme} />

            <div className="gd-match-overview-content flex-1 min-h-0 overflow-y-auto pt-3.5 pr-[22px] pb-[18px] pl-[22px] relative z-[1]">
              {tab === "overview" && <OverviewTab result={result} theme={theme} />}
              {tab === "timeline" && <TimelineTab result={result} theme={theme} />}
              {tab === "notes" && (
                <NotesTab
                  text={noteText}
                  savedText={savedNoteText}
                  hasSavedNotes={hasSavedNotes}
                  saving={savingNotes}
                  saveError={notesSaveError}
                  onTextChange={setNoteText}
                  onSave={async () => {
                    if (!canSaveNotes || noteText === savedNoteText || savingNotes) return;
                    setSavingNotes(true);
                    setNotesSaveError(null);
                    try {
                      const saveResult = await onSaveNotes(noteText);
                      if (saveResult.ok) {
                        setSavedNoteText(noteText);
                        setHasSavedNotes(true);
                      } else {
                        setNotesSaveError(saveResult.error);
                      }
                    } catch {
                      setNotesSaveError("failed");
                    } finally {
                      setSavingNotes(false);
                    }
                  }}
                  canSaveNotes={canSaveNotes}
                />
              )}
            </div>

            <Footer
              theme={theme}
              onClose={onClose}
              onBackToMatchmaking={onBackToMatchmaking}
              {...(onRematch ? { onRematch } : {})}
              onDownloadReplay={onDownloadReplay}
              onSaveReplay={onSaveReplay}
              onWatchReplay={onWatchReplay}
              onReportBug={onReportBug}
              onShareFeedback={onShareFeedback}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface HeaderStripProps {
  readonly result: MatchResult;
  readonly theme: OutcomeTheme;
  readonly title: string;
  readonly subtitle: string;
  readonly onClose: () => void;
}

function HeaderStrip({ result, theme, title, subtitle, onClose }: HeaderStripProps) {
  return (
    <div
      className="pt-[20px] pr-[24px] pb-3.5 pl-[24px] relative z-[1] flex items-start gap-4"
      style={{ borderBottom: `1px solid ${MOM.blueDim}` }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
          <OutcomeTag theme={theme} />
          <ChipDivider />
          <MonoChip>
            {m["sim.matchOverview.chip.turn"]({ turn: String(result.turn).padStart(2, "0") })}
          </MonoChip>
          <ChipDivider />
          <MonoChip>{m["sim.matchOverview.chip.moves"]({ moves: result.moves })}</MonoChip>
          <ChipDivider />
          <MonoChip>{result.duration}</MonoChip>
        </div>

        <div
          className="gd-display font-extrabold tracking-hud-body"
          style={{
            fontSize: 32,
            color: MOM.text,
            textShadow: `0 0 22px ${theme.glow}`,
            lineHeight: 1.04,
          }}
        >
          {title}
        </div>

        <div className="mt-1.5 flex items-baseline gap-2.5 flex-wrap">
          <div className="text-hud-lg font-medium" style={{ color: MOM.text }}>
            {subtitle}
          </div>
          {result.reason && (
            <div
              className="gd-mono text-hud-sm uppercase tracking-hud-label"
              style={{ color: MOM.textDim }}
            >
              // {result.reason}
            </div>
          )}
        </div>
      </div>

      <Button
        onClick={onClose}
        title={m["sim.matchOverview.close.title"]()}
        variant="outline"
        size="icon"
        className="w-[32px] h-[32px] clip-hud-4"
        style={{
          background: "rgba(255,255,255,.85)",
          border: `1px solid ${MOM.blueDim}`,
          color: MOM.textDim,
        }}
        onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.color = MOM.blue;
          e.currentTarget.style.borderColor = "rgba(45,107,255,.55)";
        }}
        onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.color = MOM.textDim;
          e.currentTarget.style.borderColor = MOM.blueDim;
        }}
      >
        ✕
      </Button>
    </div>
  );
}

function OutcomeTag({ theme }: { readonly theme: OutcomeTheme }) {
  return (
    <div
      className="gd-display flex items-center gap-[5px] font-extrabold tracking-hud-label pt-[3px] pr-[9px] pb-[3px] pl-[7px] text-[10px] clip-hud-4"
      style={{
        background: theme.tagBg,
        border: `1px solid ${theme.tagBorder}`,
        color: theme.accent,
        textShadow: `0 0 10px ${theme.glow}`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: theme.accent, boxShadow: `0 0 6px ${theme.accent}` }}
      />
      {m[theme.labelKey]()}
    </div>
  );
}

function ChipDivider() {
  return <span className="text-hud-sm text-hud-accent/25">◆</span>;
}

function MonoChip({ children }: { readonly children: ReactNode }) {
  return (
    <span
      className="gd-mono text-hud-sm font-bold tracking-hud-label"
      style={{ color: MOM.textDim }}
    >
      {children}
    </span>
  );
}

function StatStrip({
  result,
  theme,
}: {
  readonly result: MatchResult;
  readonly theme: OutcomeTheme;
}) {
  // Telemetric scale: how "long" was this match relative to a typical baseline.
  // Each cell shows 10 segments; segments fill proportionally up to a soft cap.
  const turnFillSegments = clampSegments(result.turn / 20);
  const movesFillSegments = clampSegments(result.moves / 100);
  const durationFillSegments = clampSegments(parseDurationFraction(result.duration) / 600);

  return (
    <div
      className="hidden gap-1.5 px-3 py-3.5 relative z-[1] grid-cols-3 sm:gap-2.5 sm:px-6 md:grid"
      style={{ borderBottom: `1px solid ${MOM.blueDim}` }}
    >
      <StripCell
        label={m["sim.matchOverview.strip.finalTurn"]()}
        value={result.turn}
        unit="TRN"
        accent={theme.accent}
        glow={theme.glow}
        fillSegments={turnFillSegments}
      />
      <StripCell
        label={m["sim.matchOverview.strip.duration"]()}
        value={result.duration}
        unit="M:S"
        accent={theme.accent}
        glow={theme.glow}
        fillSegments={durationFillSegments}
      />
      <StripCell
        label={m["sim.matchOverview.strip.totalMoves"]()}
        value={result.moves}
        unit="ACT"
        accent={theme.accent}
        glow={theme.glow}
        fillSegments={movesFillSegments}
      />
    </div>
  );
}

interface StripCellProps {
  readonly label: string;
  readonly value: string | number;
  readonly unit: string;
  readonly accent: string;
  readonly glow: string;
  readonly fillSegments: number;
}

function StripCell({ label, value, unit, accent, glow, fillSegments }: StripCellProps) {
  return (
    <div
      className="hud-corner relative min-w-0 pt-3 px-2 pb-3.5 sm:px-3.5 clip-hud-6 bg-[linear-gradient(180deg,rgba(248,250,254,.85),rgba(255,255,255,.6))] overflow-hidden"
      style={{ border: `1px solid ${MOM.blueDim}` }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5"
        style={{ background: `linear-gradient(180deg, ${accent}, transparent)` }}
      />
      <div
        className="gd-mono font-bold tracking-normal min-h-[2.5em] leading-tight [overflow-wrap:anywhere] sm:min-h-0 sm:tracking-hud-label"
        style={{ color: MOM.textDim, fontSize: 10, marginBottom: 6 }}
      >
        {label}
      </div>
      <div
        className="gd-display font-extrabold tracking-hud-body flex flex-wrap items-baseline gap-1.5 text-[20px] sm:text-[26px]"
        style={{ color: MOM.text, lineHeight: 1 }}
      >
        <span>{value}</span>
        <span
          className="gd-mono"
          style={{
            color: MOM.textDim,
            fontSize: 10,
            letterSpacing: "0.2em",
          }}
        >
          {unit}
        </span>
      </div>
      <div className="mt-2.5 flex gap-[2px]" style={{ height: 8 }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const filled = i < fillSegments;
          const odd = i % 2 === 1;
          return (
            <span
              key={i}
              className="flex-1"
              style={{
                background: filled ? accent : odd ? "rgba(45,107,255,.25)" : "rgba(45,107,255,.15)",
                borderBottom: `1px solid ${filled ? accent : "rgba(45,107,255,.4)"}`,
                boxShadow: filled ? `0 0 6px ${glow}` : "none",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

interface TabBarProps {
  readonly tab: Tab;
  readonly onTab: (t: Tab) => void;
  readonly theme: OutcomeTheme;
}

function TabBar({ tab, onTab, theme }: TabBarProps) {
  const tabs: readonly { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: m["sim.matchOverview.tab.overview"](), icon: "◆" },
    { id: "timeline", label: m["sim.matchOverview.tab.timeline"](), icon: "≡" },
    { id: "notes", label: m["sim.matchOverview.tab.notes"](), icon: "✎" },
  ];
  return (
    <div
      className="gd-match-overview-tabs grid grid-cols-3 gap-1.5 px-3 py-2.5 relative z-[1] sm:px-6"
      style={{ borderBottom: `1px solid ${MOM.blueDim}` }}
    >
      {tabs.map((t) => {
        const active = t.id === tab;
        return (
          <Button
            key={t.id}
            onClick={() => onTab(t.id)}
            variant="outline"
            className="min-w-0 h-auto min-h-11 gap-1 py-[10px] px-1 text-[length:var(--text-hud-md)] tracking-normal clip-hud-8 sm:px-[14px] sm:text-base sm:tracking-hud-label"
            style={{
              background: active
                ? `linear-gradient(180deg, ${theme.accent}30, ${theme.accent}14)`
                : "linear-gradient(180deg, rgba(255,255,255,.85), rgba(248,250,254,.95))",
              border: active ? `1px solid ${theme.tagBorder}` : `1px solid ${MOM.blueDim}`,
              color: active ? theme.accent : MOM.textDim,
              textShadow: active ? `0 0 8px ${theme.glow}` : "none",
            }}
          >
            <span style={{ opacity: active ? 1 : 0.7 }}>{t.icon}</span>
            <span>{t.label}</span>
          </Button>
        );
      })}
    </div>
  );
}

function OverviewTab({
  result,
  theme,
}: {
  readonly result: MatchResult;
  readonly theme: OutcomeTheme;
}) {
  const { self, opponent } = result;
  const selfWon = result.outcome === "victory";
  const oppWon = result.outcome === "defeat";

  // Compute paired comparison ratios for every stat. The larger value
  // gets a 100% bar; the smaller side fills proportionally. Equal values
  // give both sides full bars (the "you weren't behind" signal still reads).
  const ratios = computeStatRatios(self, opponent);

  return (
    <div className="grid gap-3.5 grid-cols-1 md:grid-cols-2">
      <PlayerRecapCard
        label={m["sim.matchOverview.player.you"]()}
        labelColor={MOM.cyan}
        player={self}
        winner={selfWon}
        theme={theme}
        ratioSide="self"
        ratios={ratios}
      />
      <PlayerRecapCard
        label={m["sim.matchOverview.player.opponent"]()}
        labelColor="#f87171"
        player={opponent}
        winner={oppWon}
        theme={theme}
        ratioSide="opp"
        ratios={ratios}
      />
    </div>
  );
}

interface PairedRatios {
  readonly deck: readonly [number, number];
  readonly hand: readonly [number, number];
  readonly trash: readonly [number, number];
  readonly resources: readonly [number, number];
  readonly units: readonly [number, number];
  readonly activeRested: readonly [number, number];
  readonly deployments: readonly [number, number];
  readonly commands: readonly [number, number];
  readonly paired: readonly [number, number];
  readonly combat: readonly [number, number];
  readonly moves: readonly [number, number];
  readonly effects: readonly [number, number];
}

interface PlayerRecapCardProps {
  readonly label: string;
  readonly labelColor: string;
  readonly player: PlayerRecap;
  readonly winner: boolean;
  readonly theme: OutcomeTheme;
  readonly ratioSide: "self" | "opp";
  readonly ratios: PairedRatios;
}

function PlayerRecapCard({
  label,
  labelColor,
  player,
  winner,
  theme,
  ratioSide,
  ratios,
}: PlayerRecapCardProps) {
  const idx = ratioSide === "self" ? 0 : 1;
  const barColor = winner ? MOM.win : theme.accent;
  const barGlow = winner ? "rgba(46,166,90,.4)" : theme.glow;

  return (
    <div
      className="hud-corner relative pt-3.5 pr-4 pb-4 pl-4 clip-hud-8 bg-[linear-gradient(180deg,rgba(255,255,255,.88),rgba(248,250,254,.95))]"
      style={{
        border: `1px solid ${winner ? "rgba(46,166,90,.6)" : MOM.blueDim}`,
        boxShadow: winner ? "inset 0 0 28px rgba(46,166,90,.15)" : "none",
      }}
    >
      <div
        className="absolute left-0 top-2 bottom-2 w-0.5"
        style={{ background: `linear-gradient(180deg, ${labelColor}, transparent)` }}
      />

      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-2.5 gap-y-2 mb-3 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
        <Avatar name={player.name} color={labelColor} />
        <div className="flex-1 min-w-0">
          <div
            className="gd-mono text-hud-xs font-bold tracking-hud-wide"
            style={{ color: labelColor }}
          >
            {label}
          </div>
          <div
            className="gd-display font-extrabold whitespace-normal [overflow-wrap:anywhere] tracking-hud-body text-[16px]"
            style={{ color: MOM.text }}
          >
            {player.name}
          </div>
        </div>
        {winner && (
          <div className="col-start-2 justify-self-start sm:col-start-3 sm:row-start-1">
            <WinnerBadge />
          </div>
        )}
      </div>

      <div
        className="flex items-baseline gap-2 mb-3 pt-2.5 pr-2.5 pb-2.5 pl-2.5 clip-hud-4"
        style={{
          background: winner
            ? "linear-gradient(90deg, rgba(46,166,90,.16), transparent)"
            : `linear-gradient(90deg, ${theme.accent}1f, transparent)`,
          border: `1px solid ${winner ? "rgba(46,166,90,.5)" : MOM.blueDim}`,
        }}
      >
        <div
          className="gd-display font-black tracking-hud-body text-[30px] leading-none"
          style={{
            color: winner ? MOM.win : theme.accent,
            textShadow: winner ? "0 0 14px rgba(46,166,90,.5)" : `0 0 14px ${theme.glow}`,
          }}
        >
          {player.shields}
        </div>
        <div
          className="gd-mono text-hud-sm font-bold tracking-hud-wide"
          style={{ color: MOM.textDim }}
        >
          {m["sim.matchOverview.player.shields"]()}
        </div>
        <div className="flex-1" />
        <ColorChips colors={player.colors} />
      </div>

      <div className="grid gap-1.5 grid-cols-2 sm:grid-cols-3">
        <StatBox
          label={m["sim.matchOverview.stat.deck"]()}
          value={player.deck}
          ratio={ratios.deck[idx]}
          barColor={barColor}
          barGlow={barGlow}
        />
        <StatBox
          label={m["sim.matchOverview.stat.hand"]()}
          value={player.hand}
          ratio={ratios.hand[idx]}
          barColor={barColor}
          barGlow={barGlow}
        />
        <StatBox
          label={m["sim.matchOverview.stat.trash"]()}
          value={player.trash}
          ratio={ratios.trash[idx]}
          barColor={barColor}
          barGlow={barGlow}
        />
        <StatBox
          label={m["sim.matchOverview.stat.resources"]()}
          value={`${player.resourcesActive}/${player.resourcesTotal}`}
          ratio={ratios.resources[idx]}
          barColor={barColor}
          barGlow={barGlow}
        />
        <StatBox
          label={m["sim.matchOverview.stat.units"]()}
          value={player.unitsInPlay}
          ratio={ratios.units[idx]}
          barColor={barColor}
          barGlow={barGlow}
        />
        <StatBox
          label={m["sim.matchOverview.stat.activeRested"]()}
          value={`${player.activeUnits}/${player.restedUnits}`}
          ratio={ratios.activeRested[idx]}
          barColor={barColor}
          barGlow={barGlow}
        />
        <StatBox
          label={m["sim.matchOverview.stat.deployments"]()}
          value={`${player.unitsDeployed}/${player.basesDeployed}`}
          ratio={ratios.deployments[idx]}
          barColor={barColor}
          barGlow={barGlow}
        />
        <StatBox
          label={m["sim.matchOverview.stat.commands"]()}
          value={player.commandsPlayed}
          ratio={ratios.commands[idx]}
          barColor={barColor}
          barGlow={barGlow}
        />
        <StatBox
          label={m["sim.matchOverview.stat.paired"]()}
          value={player.pilotsPaired}
          ratio={ratios.paired[idx]}
          barColor={barColor}
          barGlow={barGlow}
        />
        <StatBox
          label={m["sim.matchOverview.stat.combat"]()}
          value={`${player.attacks}/${player.blocks}`}
          ratio={ratios.combat[idx]}
          barColor={barColor}
          barGlow={barGlow}
        />
        <StatBox
          label={m["sim.matchOverview.stat.moves"]()}
          value={player.moves}
          ratio={ratios.moves[idx]}
          barColor={barColor}
          barGlow={barGlow}
        />
        <StatBox
          label={m["sim.matchOverview.stat.effects"]()}
          value={player.effectsResolved}
          ratio={ratios.effects[idx]}
          barColor={barColor}
          barGlow={barGlow}
        />
      </div>
    </div>
  );
}

function Avatar({ name, color }: { readonly name: string; readonly color: string }) {
  const initials = (name || "?")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className="gd-display w-[38px] h-[38px] flex-shrink-0 grid place-items-center font-extrabold tracking-hud-body"
      style={{
        background: `linear-gradient(135deg, ${color}33, rgba(248,250,254,.9))`,
        border: `1px solid ${color}88`,
        color,
        fontSize: 13,
        clipPath:
          "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
        boxShadow: `inset 0 0 12px rgba(0,0,0,.06), 0 0 8px ${color}44`,
      }}
    >
      {initials}
    </div>
  );
}

function WinnerBadge() {
  return (
    <div
      className="gd-display font-black tracking-hud-label py-[4px] px-2.5 text-[10px] text-white clip-hud-4"
      style={{
        background: `linear-gradient(180deg, ${MOM.win}, ${MOM.winDeep})`,
        boxShadow: "0 0 12px rgba(46,166,90,.55)",
      }}
    >
      {m["sim.matchOverview.player.winner"]()}
    </div>
  );
}

function ColorChips({ colors }: { readonly colors?: readonly CardColor[] }) {
  if (!colors?.length) return null;
  const TINT: Record<CardColor, string> = {
    blue: "#1e49c7",
    green: "#2ea65a",
    red: "#d7263d",
    white: "#cfd6e2",
    purple: "#7b4182",
  };
  return (
    <div className="flex gap-[3px]">
      {colors.map((c, i) => (
        <span
          key={i}
          title={c}
          className="w-2.5 h-2.5 border border-black/40 [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)]"
          style={{
            background: TINT[c] ?? "#97a3af",
            boxShadow: `0 0 6px ${TINT[c] ?? "#97a3af"}88`,
          }}
        />
      ))}
    </div>
  );
}

interface StatBoxProps {
  readonly label: string;
  readonly value: number | string;
  readonly ratio: number;
  readonly barColor: string;
  readonly barGlow: string;
}

function StatBox({ label, value, ratio, barColor, barGlow }: StatBoxProps) {
  const widthPct = Math.max(0, Math.min(100, ratio * 100));
  return (
    <div
      className="pt-[7px] pr-[9px] pb-[8px] pl-[9px] bg-[rgba(248,250,254,.7)] clip-hud-4"
      style={{ border: `1px solid rgba(45,107,255,.18)` }}
    >
      <div
        className="gd-mono min-h-[2.5em] sm:min-h-[1.25em] font-bold whitespace-normal [overflow-wrap:anywhere] tracking-normal"
        style={{ color: MOM.textDim, fontSize: "var(--text-hud-xs)", lineHeight: 1.25 }}
      >
        {label}
      </div>
      <div
        className="gd-display font-extrabold tracking-hud-body"
        style={{ color: MOM.text, fontSize: 16, lineHeight: 1.1, marginTop: 2, marginBottom: 5 }}
      >
        {value}
      </div>
      <div className="relative" style={{ height: 3, background: "rgba(45,107,255,.12)" }}>
        <div
          className="absolute left-0 top-0 bottom-0"
          style={{
            width: `${widthPct}%`,
            background: `linear-gradient(90deg, ${barColor}, ${barColor}66)`,
            boxShadow: `0 0 4px ${barGlow}`,
          }}
        />
      </div>
    </div>
  );
}

function TimelineTab({
  result,
  theme,
}: {
  readonly result: MatchResult;
  readonly theme: OutcomeTheme;
}) {
  const events = result.timeline || [];
  if (!events.length) {
    return <EmptyState label={m["sim.matchOverview.timeline.empty"]()} theme={theme} />;
  }

  const byTurn: Record<number, TimelineEvent[]> = {};
  for (const e of events) {
    (byTurn[e.turn] ||= []).push(e);
  }
  const turns = Object.keys(byTurn)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="relative pl-7">
      <div
        className="absolute top-1 bottom-1 w-0.5 left-2.5"
        style={{
          background: `linear-gradient(180deg, ${theme.accent}88, ${MOM.blueDim} 50%, transparent)`,
        }}
      />
      {turns.map((t) => (
        <div key={t} className="mb-3.5 relative">
          <div
            className="absolute grid place-items-center font-extrabold tracking-hud-body -left-6 top-1 w-5 h-5 text-hud-xs clip-hud-4 bg-[linear-gradient(135deg,rgba(255,255,255,.95),rgba(248,250,254,.95))]"
            style={{
              border: `1px solid ${theme.tagBorder}`,
              color: theme.accent,
            }}
          >
            {t}
          </div>
          <div
            className="gd-mono text-hud-xs font-bold mb-1 tracking-hud-label"
            style={{ color: theme.accent }}
          >
            {m["sim.matchOverview.timeline.turnHeader"]({ turn: String(t).padStart(2, "0") })}
          </div>
          {byTurn[t]!.map((e, i) => (
            <div
              key={i}
              className="text-xs pl-1"
              style={{
                lineHeight: 1.5,
                color: MOM.text,
              }}
            >
              <span
                className="gd-mono text-hud-xs font-bold mr-2 tracking-hud-label"
                style={{
                  color: e.who === "self" ? MOM.cyan : "#f87171",
                }}
              >
                {e.who === "self"
                  ? m["sim.matchOverview.timeline.selfTag"]()
                  : m["sim.matchOverview.timeline.oppTag"]()}
              </span>
              <CardLinkedText
                message={e.text}
                cardRefs={e.cardRefs}
                referenceKey={`timeline-${e.turn}-${i}`}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

interface NotesTabProps {
  readonly text: string;
  readonly savedText: string;
  readonly hasSavedNotes: boolean;
  readonly saving: boolean;
  readonly saveError: NotesSaveError | null;
  readonly onTextChange: (text: string) => void;
  readonly onSave: () => Promise<void>;
  readonly canSaveNotes: boolean;
}

function NotesTab({
  text,
  savedText,
  hasSavedNotes,
  saving,
  saveError,
  onTextChange,
  onSave,
  canSaveNotes,
}: NotesTabProps) {
  const dirty = text !== savedText;

  return (
    <div>
      <div
        className="gd-mono text-hud-sm font-bold mb-2 tracking-hud-label"
        style={{ color: MOM.textDim }}
      >
        {m["sim.matchOverview.notes.private"]()}
      </div>
      <textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={m["sim.matchOverview.notes.placeholder"]()}
        className="w-full pt-3 pr-3.5 pb-3 pl-3.5 outline-none min-h-[220px] resize-y bg-[rgba(248,250,254,.6)] text-[13px] leading-normal clip-hud-6"
        style={{
          border: `1px solid ${MOM.blueDim}`,
          color: MOM.text,
        }}
      />
      <div className="flex items-center justify-between gap-3 mt-2.5 flex-wrap">
        <p
          aria-live="polite"
          className="gd-mono text-hud-xs font-bold tracking-hud-label"
          style={{ color: saveError ? MOM.redDeep : MOM.textDim }}
        >
          {(saveError === "unauthenticated"
            ? m["sim.matchOverview.notes.signIn"]()
            : saveError === "failed"
              ? m["sim.matchOverview.notes.saveFailed"]()
              : null) ??
            (canSaveNotes
              ? dirty
                ? m["sim.matchOverview.notes.unsaved"]()
                : hasSavedNotes
                  ? m["sim.matchOverview.notes.saved"]()
                  : m["sim.matchOverview.notes.ready"]()
              : m["sim.matchOverview.notes.unavailable"]())}
        </p>
        <Button
          type="button"
          variant="primary"
          disabled={!canSaveNotes || !dirty || saving}
          onClick={() => void onSave()}
          className="h-auto px-[14px] py-2 text-hud-md tracking-hud-display clip-hud-6"
          style={{
            background: `linear-gradient(180deg, ${MOM.blue}, ${MOM.blueDeep})`,
            color: "#fff",
            border: `1px solid ${MOM.blue}`,
            boxShadow: `0 0 14px ${MOM.blue}55`,
          }}
        >
          {saving ? m["sim.matchOverview.notes.saving"]() : m["sim.matchOverview.notes.save"]()}
        </Button>
      </div>
    </div>
  );
}

function EmptyState({ label, theme }: { readonly label: string; readonly theme: OutcomeTheme }) {
  return (
    <div
      className="text-center text-hud-lg pt-8 pr-5 pb-8 pl-5 border border-dashed"
      style={{
        color: MOM.textDim,
        borderColor: MOM.blueDim,
      }}
    >
      <div
        className="gd-mono text-hud-sm font-bold mb-1.5 tracking-hud-wide"
        style={{ color: theme.accent }}
      >
        {m["sim.matchOverview.empty.noData"]()}
      </div>
      {label}
    </div>
  );
}

interface FooterProps {
  readonly theme: OutcomeTheme;
  readonly onClose: () => void;
  readonly onBackToMatchmaking: () => void;
  readonly onRematch?: () => void;
  readonly onDownloadReplay: () => void;
  readonly onSaveReplay: () => void;
  readonly onWatchReplay?: () => void;
  readonly onReportBug: () => void;
  readonly onShareFeedback: () => void;
}

function Footer({
  theme,
  onClose,
  onBackToMatchmaking,
  onRematch,
  onDownloadReplay,
  onSaveReplay,
  onWatchReplay,
  onReportBug,
  onShareFeedback,
}: FooterProps) {
  return (
    <div
      className="gd-match-overview-footer flex items-center gap-2.5 px-3 py-3 sm:px-6 relative z-[1] bg-[rgba(248,250,254,.6)] flex-wrap"
      style={{ borderTop: `1px solid ${MOM.blueDim}` }}
    >
      <div className="gd-match-overview-feedback flex w-full flex-wrap items-center gap-2.5 sm:w-auto">
        <div
          className="gd-mono text-hud-xs font-bold tracking-hud-label"
          style={{ color: MOM.textDim }}
        >
          {m["sim.matchOverview.footer.helpUsImprove"]()}
        </div>
        <div className="grid w-full grid-cols-2 gap-1.5 sm:flex sm:w-auto sm:flex-wrap">
          <ChipButton onClick={onReportBug} icon="⚠" accent={MOM.red}>
            {m["sim.matchOverview.footer.reportBug"]()}
          </ChipButton>
          <ChipButton onClick={onShareFeedback} icon="✉" accent={MOM.blue}>
            {m["sim.matchOverview.footer.shareFeedback"]()}
          </ChipButton>
        </div>
      </div>

      <div className="hidden flex-1 sm:block" />

      <div className="gd-match-overview-actions grid w-full grid-cols-2 items-stretch gap-1.5 sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:justify-end">
        <FooterBtn onClick={onClose}>{m["sim.matchOverview.footer.close"]()}</FooterBtn>
        {onWatchReplay ? (
          <FooterBtn onClick={onWatchReplay}>
            {m["sim.matchOverview.footer.watchReplay"]()}
          </FooterBtn>
        ) : null}
        <FooterBtn onClick={onDownloadReplay} icon="⬇">
          {m["sim.matchOverview.footer.downloadReplay"]()}
        </FooterBtn>
        <FooterBtn onClick={onSaveReplay} icon="❒">
          {m["sim.matchOverview.footer.saveReplay"]()}
        </FooterBtn>
        <FooterBtn
          primary={!onRematch}
          {...(!onRematch ? { accent: theme.accent, accentDeep: theme.accentDeep } : {})}
          onClick={onBackToMatchmaking}
        >
          {m["sim.matchOverview.footer.backToMatchmaking"]()}
        </FooterBtn>
        {onRematch ? (
          <FooterBtn
            primary
            accent={theme.accent}
            accentDeep={theme.accentDeep}
            onClick={onRematch}
            icon={<RefreshCw className="size-4" aria-hidden="true" />}
          >
            {m["sim.matchOverview.footer.rematch"]()}
          </FooterBtn>
        ) : null}
      </div>
    </div>
  );
}

interface ChipButtonProps {
  readonly children: ReactNode;
  readonly onClick: () => void;
  readonly icon: string;
  readonly accent: string;
}

function ChipButton({ children, onClick, icon, accent }: ChipButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="sm"
      className="h-auto px-2.5 py-[5px] text-hud-sm tracking-hud-label clip-hud-4"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,.9), rgba(248,250,254,.95))",
        border: `1px solid ${accent}55`,
        color: accent,
      }}
      onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.filter = "brightness(1.06)";
      }}
      onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.filter = "none";
      }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </Button>
  );
}

interface FooterBtnProps {
  readonly children: ReactNode;
  readonly onClick: () => void;
  readonly primary?: boolean;
  readonly accent?: string;
  readonly accentDeep?: string;
  readonly icon?: ReactNode;
}

function FooterBtn({ children, onClick, primary, accent, accentDeep, icon }: FooterBtnProps) {
  // Primary button picks up the outcome accent for tonal cohesion: green
  // gradient on victory, magenta on defeat, blue on draw / no-theme. Falls
  // back to brand blue when called without theme props.
  const primaryAccent = accent ?? MOM.blue;
  const primaryAccentDeep = accentDeep ?? MOM.blueDeep;
  const style: CSSProperties = primary
    ? {
        background: `linear-gradient(180deg, ${primaryAccent}, ${primaryAccentDeep})`,
        color: "#fff",
        border: `1px solid ${primaryAccent}`,
        boxShadow: `0 0 14px ${primaryAccent}55`,
      }
    : {
        background: "linear-gradient(180deg, rgba(255,255,255,.9), rgba(248,250,254,.95))",
        color: MOM.text,
        border: `1px solid ${MOM.blueDim}`,
      };
  return (
    <Button
      onClick={onClick}
      variant={primary ? "primary" : "outline"}
      className="h-auto px-[14px] py-2 text-hud-md tracking-hud-display clip-hud-6"
      style={style}
      onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.filter = "brightness(1.12)";
      }}
      onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.filter = "none";
      }}
    >
      {icon && <span className="opacity-85">{icon}</span>}
      {children}
    </Button>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────

function clampSegments(fraction: number): number {
  if (!Number.isFinite(fraction) || fraction <= 0) return 0;
  return Math.max(1, Math.min(10, Math.round(fraction * 10)));
}

function parseDurationFraction(duration: string): number {
  // Returns total seconds, or 0 if unparseable. "8:42" → 522.
  const match = /^(\d+):(\d{1,2})$/.exec(duration.trim());
  if (!match) return 0;
  return Number(match[1]) * 60 + Number(match[2]);
}

function pairRatio(a: number, b: number): readonly [number, number] {
  if (a <= 0 && b <= 0) return [0, 0];
  const max = Math.max(a, b);
  return [a / max, b / max];
}

function effectiveResourceTotal(player: PlayerRecap): number {
  return player.resourcesTotal > 0 ? player.resourcesTotal : player.resourcesActive;
}

function computeStatRatios(self: PlayerRecap, opp: PlayerRecap): PairedRatios {
  return {
    deck: pairRatio(self.deck, opp.deck),
    hand: pairRatio(self.hand, opp.hand),
    trash: pairRatio(self.trash, opp.trash),
    resources: pairRatio(effectiveResourceTotal(self), effectiveResourceTotal(opp)),
    units: pairRatio(self.unitsInPlay, opp.unitsInPlay),
    activeRested: pairRatio(self.activeUnits + self.restedUnits, opp.activeUnits + opp.restedUnits),
    deployments: pairRatio(
      self.unitsDeployed + self.basesDeployed,
      opp.unitsDeployed + opp.basesDeployed,
    ),
    commands: pairRatio(self.commandsPlayed, opp.commandsPlayed),
    paired: pairRatio(self.pilotsPaired, opp.pilotsPaired),
    combat: pairRatio(self.attacks + self.blocks, opp.attacks + opp.blocks),
    moves: pairRatio(self.moves, opp.moves),
    effects: pairRatio(self.effectsResolved, opp.effectsResolved),
  };
}
