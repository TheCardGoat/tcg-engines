import {
  IconArrowLeft,
  IconArrowUpRight,
  IconCards,
  IconCheck,
  IconInfoCircle,
  IconPlayerPlay,
  IconShieldX,
  IconVolume,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { buildMountedHref } from "../routes/router-paths.ts";
import {
  ANIMATION_FIXTURE_GAMES,
  ANIMATION_SEQUENCE_FIXTURES,
  ANIMATION_STEP_INVENTORY,
  AUDIO_CUE_FIXTURES,
  FAB_MOTION_SURFACE_FIXTURES,
  FAB_TRANSFER_FIXTURES,
  type AudioCueFixture,
  type AnimationFixtureGameId,
  type AnimationFixtureInventoryItem,
  type FabMotionSurfaceFixture,
} from "./animation-fixtures/inventory.ts";
import {
  disposeSimulatorSoundService,
  playSimulatorSound,
  setSimulatorSoundPack,
} from "../simulator/audio/sound-service.ts";
import {
  SIMULATOR_SOUND_PACKS,
  type SimulatorSoundPackId,
} from "../simulator/audio/sound-packs.ts";

interface AnimationFixturesPageProps {
  onNavigate: (path: string) => void;
}

export default function AnimationFixturesPage({ onNavigate }: AnimationFixturesPageProps) {
  const [selectedGame, setSelectedGame] = useState<AnimationFixtureGameId>("cyberpunk");
  const [isClientReady, setIsClientReady] = useState(false);
  const [areSoundsReady, setAreSoundsReady] = useState(false);
  const [selectedSoundPack, setSelectedSoundPack] = useState<SimulatorSoundPackId>("original");
  const [soundPackError, setSoundPackError] = useState<string | null>(null);
  const game = ANIMATION_FIXTURE_GAMES.find((candidate) => candidate.id === selectedGame)!;
  const inventory = useMemo(
    () => ANIMATION_STEP_INVENTORY.map((item) => ({ ...item, fixture: item.games[selectedGame] })),
    [selectedGame],
  );
  const sequenceFixtures = useMemo(
    () =>
      ANIMATION_SEQUENCE_FIXTURES.flatMap((sequence) => {
        const fixture = sequence.games[selectedGame];
        return fixture &&
          !(selectedGame === "flesh-and-blood" && !sequence.stepTypes.includes("entityTransfer"))
          ? [
              {
                ...sequence,
                stepTypes:
                  selectedGame === "flesh-and-blood"
                    ? ["entityTransfer" as const]
                    : sequence.stepTypes,
                fixture,
              },
            ]
          : [];
      }),
    [selectedGame],
  );
  const audioFixtures = useMemo(
    () =>
      AUDIO_CUE_FIXTURES.flatMap((item) => {
        const fixture = item.games[selectedGame];
        return fixture ? [{ ...item, fixture }] : [];
      }),
    [selectedGame],
  );
  const runnableCount = inventory.filter(({ fixture }) => fixture.status === "ready").length;
  const partialCount = inventory.filter(({ fixture }) => fixture.status === "partial").length;

  useEffect(() => {
    document.title = `${game.label} Animation Fixtures | Simulator`;
  }, [game.label]);

  useEffect(() => {
    setSelectedGame(readSelectedGame());
    setIsClientReady(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setAreSoundsReady(false);
    setSoundPackError(null);
    void setSimulatorSoundPack(selectedSoundPack)
      .then(() => {
        if (!cancelled) setAreSoundsReady(true);
      })
      .catch(() => {
        if (!cancelled) setSoundPackError("This pack is not available from the CDN yet.");
      });
    return () => {
      cancelled = true;
    };
  }, [selectedSoundPack]);

  useEffect(() => () => disposeSimulatorSoundService(), []);

  const selectGame = (nextGame: AnimationFixtureGameId) => {
    setSelectedGame(nextGame);
    onNavigate(`${buildMountedHref("/animation-fixtures")}?game=${nextGame}`);
  };

  return (
    <main
      className="min-h-svh bg-[#11100f] px-4 py-5 text-[#f6f0e7] sm:px-6 lg:px-8"
      data-theme="dark"
      data-game="animation-fixtures"
      data-animation-fixture-ready={isClientReady ? "true" : "false"}
    >
      <div className="mx-auto max-w-[1480px]">
        <header className="mb-6 border-b border-[#45403a] pb-6">
          <button
            type="button"
            className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-md border border-[#45403a] bg-[#1d1b19] px-3 text-sm font-bold text-[#c9c0b5] transition hover:border-[#6b6258] hover:text-white"
            onClick={() => onNavigate(buildMountedHref("/"))}
          >
            <IconArrowLeft size={17} />
            All fixtures
          </button>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-4xl">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#e0aa57]">
                Real simulator animation bench
              </p>
              <h1 className="mt-2 text-3xl font-black leading-tight sm:text-5xl">
                Animation inventory
              </h1>
              <p className="mt-3 max-w-[76ch] text-sm leading-6 text-[#b9b0a6] sm:text-base">
                Every runnable case opens the owning game&apos;s real simulator, real engine
                fixture, real adapter, and real card renderer. Missing cases stay visible so this
                page never overstates runtime coverage.
              </p>
            </div>

            <dl className="grid grid-cols-3 overflow-hidden rounded-lg border border-[#45403a] bg-[#45403a]">
              <Metric label="step types" value={String(ANIMATION_STEP_INVENTORY.length)} />
              <Metric label="runnable" value={String(runnableCount)} />
              <Metric label="partial" value={String(partialCount)} />
            </dl>
          </div>
        </header>

        <section className="mb-6" aria-labelledby="game-selector-heading">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#8e867d]">
                Fixture scope
              </p>
              <h2 id="game-selector-heading" className="mt-1 text-lg font-black">
                Select a game
              </h2>
            </div>
            <p className="max-w-2xl text-right text-xs leading-5 text-[#9f968c]">{game.note}</p>
          </div>

          <div
            className="grid gap-px overflow-hidden rounded-lg border border-[#45403a] bg-[#45403a] sm:grid-cols-2 xl:grid-cols-4"
            role="group"
            aria-label="Animation fixture game"
          >
            {ANIMATION_FIXTURE_GAMES.map((candidate) => {
              const selected = candidate.id === selectedGame;
              return (
                <button
                  key={candidate.id}
                  type="button"
                  aria-pressed={selected}
                  data-testid={`animation-game-${candidate.id}`}
                  onClick={() => selectGame(candidate.id)}
                  className={`min-h-[94px] px-4 py-3 text-left transition ${
                    selected ? "bg-[#e0aa57] text-[#15110b]" : "bg-[#1d1b19] hover:bg-[#292622]"
                  }`}
                >
                  <span className="block text-sm font-black">{candidate.label}</span>
                  <span
                    className={`mt-2 block font-mono text-[11px] font-bold uppercase tracking-[0.12em] ${
                      selected ? "text-[#4e3c20]" : "text-[#9f968c]"
                    }`}
                  >
                    {candidate.summary}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section
          className="overflow-hidden rounded-lg border border-[#45403a] bg-[#1a1816]"
          aria-labelledby="inventory-heading"
        >
          <div className="flex flex-col gap-2 border-b border-[#45403a] px-4 py-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="inventory-heading"
                className="font-mono text-sm font-bold uppercase tracking-[0.16em]"
              >
                {game.label} runtime cases
              </h2>
              <p className="mt-1 text-sm text-[#9f968c]">
                Launch a deterministic engine state, then perform the listed action.
              </p>
            </div>
            <code className="w-fit rounded-md bg-[#100f0e] px-2.5 py-1.5 font-mono text-xs text-[#78c8dd]">
              animationPlan.version = 2
            </code>
          </div>

          <div className="divide-y divide-[#38332f]">
            {inventory.map(({ fixture, ...item }, index) => (
              <InventoryRow key={item.stepType} index={index} item={item} fixture={fixture} />
            ))}
          </div>
        </section>

        {selectedGame === "flesh-and-blood" ? (
          <section
            className="mt-6 overflow-hidden rounded-lg border border-[#45403a]"
            aria-label="FAB card transfers"
          >
            <div className="px-4 py-4">
              <h2 className="text-lg font-black">Card transfer checklist</h2>
              <p className="mt-1 text-sm text-[#b9b0a6]">
                One transfer primitive. Ready means a fixture is available; each listed interaction
                still needs to be exercised.
              </p>
            </div>
            <div className="divide-y divide-[#38332f]">
              {FAB_TRANSFER_FIXTURES.map((fixture) => (
                <FabMotionSurfaceRow key={fixture.id} fixture={fixture} />
              ))}
            </div>
          </section>
        ) : null}

        {sequenceFixtures.length > 0 ? (
          <section
            className="mt-6 overflow-hidden rounded-lg border border-[#45403a] bg-[#1a1816]"
            aria-labelledby="sequence-fixtures-heading"
          >
            <div className="border-b border-[#45403a] px-4 py-4">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#e0aa57]">
                Multi-step choreography
              </p>
              <h2 id="sequence-fixtures-heading" className="mt-1 text-lg font-black">
                {game.label} sequence fixtures
              </h2>
              <p className="mt-1 text-sm text-[#9f968c]">
                Real engine actions that combine several protocol steps into one readable sequence.
              </p>
            </div>
            <div className="divide-y divide-[#38332f]">
              {sequenceFixtures.map(({ fixture, ...sequence }, index) => (
                <SequenceFixtureRow
                  key={sequence.id}
                  index={index}
                  sequence={sequence}
                  fixture={fixture}
                />
              ))}
            </div>
          </section>
        ) : null}

        {selectedGame === "flesh-and-blood" ? (
          <section
            className="mt-6 overflow-hidden rounded-lg border border-[#45403a] bg-[#1a1816]"
            aria-labelledby="fab-motion-surfaces-heading"
          >
            <div className="border-b border-[#45403a] px-4 py-4">
              <h2 id="fab-motion-surfaces-heading" className="text-lg font-black">
                FAB-owned motion surfaces
              </h2>
              <p className="mt-1 max-w-[72ch] text-sm text-[#9f968c]">
                UI motion outside the shared protocol plan. Missing deterministic states stay in the
                catalog so a semantic-step audit cannot overstate simulator coverage.
              </p>
            </div>
            <div className="divide-y divide-[#38332f]">
              {FAB_MOTION_SURFACE_FIXTURES.map((fixture) => (
                <FabMotionSurfaceRow key={fixture.id} fixture={fixture} />
              ))}
            </div>
          </section>
        ) : null}

        {audioFixtures.length > 0 ? (
          <section
            className="mt-6 overflow-hidden rounded-lg border border-[#45403a] bg-[#1a1816]"
            aria-labelledby="audio-fixtures-heading"
          >
            <div className="flex flex-col gap-2 border-b border-[#45403a] px-4 py-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 id="audio-fixtures-heading" className="text-lg font-black">
                  Sound effects
                </h2>
                <p className="mt-1 max-w-[72ch] text-sm text-[#9f968c]">
                  Audition every shared cue in the selected pack. Runtime status separately records
                  whether a real FAB engine fixture schedules that cue.
                </p>
              </div>
              <span
                className="w-fit rounded-md bg-[#100f0e] px-2.5 py-1.5 font-mono text-xs text-[#78c8dd]"
                role="status"
              >
                {soundPackError
                  ? "Pack unavailable"
                  : areSoundsReady
                    ? `${audioFixtures.length} cues ready`
                    : "Preparing sounds…"}
              </span>
            </div>
            <div className="sticky top-0 z-10 border-b border-[#45403a] bg-[#151412] px-4 py-4 shadow-[0_8px_18px_rgba(0,0,0,0.28)]">
              <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h3 className="text-sm font-black text-[#f4eee7]">Choose a sound pack</h3>
                  <p className="mt-1 text-xs leading-5 text-[#9f968c]">
                    Switch packs, then replay any cue below to compare the same event.
                  </p>
                </div>
                {soundPackError ? (
                  <p className="text-xs font-bold text-[#ef9b8c]" role="alert">
                    {soundPackError}
                  </p>
                ) : null}
              </div>
              <div
                className="grid gap-px overflow-hidden rounded-lg border border-[#45403a] bg-[#45403a] sm:grid-cols-2 xl:grid-cols-4"
                role="group"
                aria-label="Simulator sound pack"
              >
                {SIMULATOR_SOUND_PACKS.map((pack) => {
                  const selected = pack.id === selectedSoundPack;
                  return (
                    <button
                      key={pack.id}
                      type="button"
                      aria-pressed={selected}
                      data-testid={`sound-pack-${pack.id}`}
                      onClick={() => setSelectedSoundPack(pack.id)}
                      className={`min-h-[78px] px-3 py-3 text-left transition ${
                        selected
                          ? "bg-[#78c8dd] text-[#0d1719]"
                          : "bg-[#1d1b19] text-[#f4eee7] hover:bg-[#292622]"
                      }`}
                    >
                      <span className="block text-sm font-black">{pack.label}</span>
                      <span
                        className={`mt-1 block text-xs leading-5 ${
                          selected ? "text-[#29464d]" : "text-[#9f968c]"
                        }`}
                      >
                        {pack.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="divide-y divide-[#38332f]">
              {audioFixtures.map(({ fixture, ...item }) => (
                <AudioCueRow
                  key={item.cue}
                  item={item}
                  fixture={fixture}
                  soundsReady={areSoundsReady}
                />
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-6 grid gap-3 lg:grid-cols-2">
          <Callout
            icon={<IconInfoCircle size={19} />}
            title="What this bench proves"
            text="A launch validates the real local simulator path. Live gateway equivalence remains a separate assertion when the server adapter maps fewer native events than the browser adapter."
          />
          <Callout
            icon={<IconShieldX size={19} />}
            title="No synthetic fallback"
            text="Fixtures use the owning simulator and card renderer. FAB transfers come from board snapshots; disabled animation types remain listed without claiming playback coverage."
          />
        </section>
      </div>
    </main>
  );
}

function FabMotionSurfaceRow({ fixture }: { readonly fixture: FabMotionSurfaceFixture }) {
  const href = fixture.route ? buildMountedHref(fixture.route) : null;

  return (
    <article
      className="grid min-w-0 gap-4 px-4 py-4 lg:grid-cols-[190px_minmax(220px,0.8fr)_minmax(300px,1.4fr)_150px] lg:items-center"
      data-fab-motion-surface={fixture.id}
    >
      <div className="min-w-0">
        <p className="text-sm font-black text-[#f4eee7]">{fixture.surface}</p>
        <p className="mt-1 text-xs leading-5 text-[#8e867d]">{fixture.role}</p>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={fixture.status} />
          {fixture.pathKind ? (
            <span className="rounded border border-[#45403a] px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#a9a097]">
              {fixture.pathKind}
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-sm font-black text-[#f4eee7]">{fixture.fixture}</p>
        <p className="mt-1 font-mono text-xs text-[#e0aa57]">{fixture.cards}</p>
      </div>
      <div className="min-w-0">
        <p className="text-sm leading-6 text-[#c7beb4]">{fixture.action}</p>
        {fixture.caveat ? (
          <p className="mt-2 text-xs leading-5 text-[#8e867d]">{fixture.caveat}</p>
        ) : null}
      </div>
      {href ? (
        <a
          href={href}
          data-testid={`open-fab-surface-${fixture.id}`}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#a77a35] bg-[#2c251b] px-3 text-sm font-black text-[#f2c77d] transition hover:bg-[#3a2f20]"
        >
          <IconPlayerPlay size={16} />
          Open fixture
          <IconArrowUpRight size={14} />
        </a>
      ) : (
        <span className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#3b3733] bg-[#151412] px-3 text-sm font-bold text-[#756e67]">
          <IconCards size={16} />
          Fixture needed
        </span>
      )}
    </article>
  );
}

function AudioCueRow({
  item,
  fixture,
  soundsReady,
}: {
  readonly item: Omit<AudioCueFixture, "games">;
  readonly fixture: NonNullable<AudioCueFixture["games"][AnimationFixtureGameId]>;
  readonly soundsReady: boolean;
}) {
  const href = fixture.route ? buildMountedHref(fixture.route) : null;

  return (
    <article
      className="grid min-w-0 gap-4 px-4 py-4 lg:grid-cols-[190px_minmax(220px,0.8fr)_minmax(300px,1.4fr)_140px_140px] lg:items-center"
      data-audio-cue={item.cue}
    >
      <div className="min-w-0">
        <code className="font-mono text-sm font-black text-[#78c8dd]">{item.cue}</code>
        <p className="mt-1 text-xs leading-5 text-[#8e867d]">{item.role}</p>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={fixture.status} />
          {fixture.pathKind ? (
            <span className="rounded border border-[#45403a] px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#a9a097]">
              {fixture.pathKind}
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-sm font-black text-[#f4eee7]">{fixture.fixture}</p>
        <p className="mt-1 font-mono text-xs text-[#e0aa57]">{fixture.cards}</p>
      </div>
      <div className="min-w-0">
        <p className="text-sm leading-6 text-[#c7beb4]">{fixture.action}</p>
        {fixture.caveat ? (
          <p className="mt-2 text-xs leading-5 text-[#8e867d]">{fixture.caveat}</p>
        ) : null}
      </div>
      <button
        type="button"
        disabled={!soundsReady}
        data-testid={`play-audio-${item.cue}`}
        onClick={() => playSimulatorSound(item.cue)}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#4b6d76] bg-[#17282d] px-3 text-sm font-black text-[#9ed9e8] transition hover:bg-[#20373e] disabled:cursor-wait disabled:border-[#3b3733] disabled:bg-[#151412] disabled:text-[#756e67]"
      >
        <IconVolume size={16} />
        Play sound
      </button>
      {href ? (
        <a
          href={href}
          data-testid={`open-audio-${item.cue}`}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#a77a35] bg-[#2c251b] px-3 text-sm font-black text-[#f2c77d] transition hover:bg-[#3a2f20]"
        >
          Open fixture
          <IconArrowUpRight size={14} />
        </a>
      ) : (
        <span className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#3b3733] bg-[#151412] px-3 text-sm font-bold text-[#756e67]">
          No runtime case
        </span>
      )}
    </article>
  );
}

function SequenceFixtureRow({
  index,
  sequence,
  fixture,
}: {
  readonly index: number;
  readonly sequence: Omit<(typeof ANIMATION_SEQUENCE_FIXTURES)[number], "games">;
  readonly fixture: NonNullable<
    (typeof ANIMATION_SEQUENCE_FIXTURES)[number]["games"][AnimationFixtureGameId]
  >;
}) {
  const href = fixture.route ? buildMountedHref(fixture.route) : null;

  return (
    <article className="grid min-w-0 gap-4 px-4 py-4 lg:grid-cols-[44px_190px_minmax(220px,0.8fr)_minmax(300px,1.4fr)_150px] lg:items-center">
      <span className="font-mono text-xs font-bold text-[#6f675f]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div>
        <p className="text-sm font-black text-[#f4eee7]">{sequence.label}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {sequence.stepTypes.map((stepType) => (
            <code
              key={stepType}
              className="rounded bg-[#100f0e] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#78c8dd]"
            >
              {stepType}
            </code>
          ))}
        </div>
      </div>
      <div>
        <StatusBadge status={fixture.status} />
        <p className="mt-2 text-sm font-black text-[#f4eee7]">{fixture.fixture}</p>
        <p className="mt-1 font-mono text-xs text-[#e0aa57]">{fixture.cards}</p>
      </div>
      <div>
        <p className="text-sm leading-6 text-[#c7beb4]">{fixture.action}</p>
        {fixture.caveat ? (
          <p className="mt-2 text-xs leading-5 text-[#8e867d]">{fixture.caveat}</p>
        ) : null}
      </div>
      {href ? (
        <a
          href={href}
          data-testid={`open-sequence-${sequence.id}`}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#a77a35] bg-[#2c251b] px-3 text-sm font-black text-[#f2c77d] transition hover:bg-[#3a2f20]"
        >
          <IconPlayerPlay size={16} />
          Open fixture
          <IconArrowUpRight size={14} />
        </a>
      ) : null}
    </article>
  );
}

function InventoryRow({
  index,
  item,
  fixture,
}: {
  index: number;
  item: Omit<AnimationFixtureInventoryItem, "games">;
  fixture: AnimationFixtureInventoryItem["games"][AnimationFixtureGameId];
}) {
  const runnable =
    (fixture.status === "ready" || fixture.status === "partial") && fixture.route !== null;
  const href = fixture.route ? buildMountedHref(fixture.route) : null;

  return (
    <article
      className="grid min-w-0 gap-4 px-4 py-4 lg:grid-cols-[44px_190px_minmax(220px,0.8fr)_minmax(300px,1.4fr)_150px] lg:items-center"
      data-animation-step={item.stepType}
    >
      <span className="font-mono text-xs font-bold text-[#6f675f]">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="min-w-0">
        <code className="font-mono text-sm font-black text-[#78c8dd]">{item.stepType}</code>
        <p className="mt-1 text-xs leading-5 text-[#8e867d]">{item.frameworkRole}</p>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={fixture.status} />
          {fixture.pathKind ? (
            <span className="rounded border border-[#45403a] px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#a9a097]">
              {fixture.pathKind}
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-sm font-black text-[#f4eee7]">{fixture.fixture}</p>
        <p className="mt-1 font-mono text-xs text-[#e0aa57]">{fixture.cards}</p>
      </div>

      <div className="min-w-0">
        <p className="text-sm leading-6 text-[#c7beb4]">{fixture.action}</p>
        {fixture.caveat ? (
          <p className="mt-2 text-xs leading-5 text-[#8e867d]">{fixture.caveat}</p>
        ) : null}
      </div>

      {runnable && href ? (
        <a
          href={href}
          data-testid={`open-${item.stepType}`}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#a77a35] bg-[#2c251b] px-3 text-sm font-black text-[#f2c77d] transition hover:bg-[#3a2f20]"
        >
          <IconPlayerPlay size={16} />
          Open fixture
          <IconArrowUpRight size={14} />
        </a>
      ) : (
        <span className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#3b3733] bg-[#151412] px-3 text-sm font-bold text-[#756e67]">
          <IconCards size={16} />
          Not emitted
        </span>
      )}
    </article>
  );
}

function StatusBadge({ status }: { status: "ready" | "partial" | "missing" | "disabled" }) {
  const styles = {
    ready: "border-[#3f7258] bg-[#173326] text-[#91d4aa]",
    partial: "border-[#7d6236] bg-[#332817] text-[#e9bf72]",
    disabled: "border-[#45403a] bg-[#151412] text-[#a9a097]",
    missing: "border-[#5b4742] bg-[#2b1d1a] text-[#ca9186]",
  }[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-[0.1em] ${styles}`}
    >
      {status === "ready" ? <IconCheck size={11} /> : null}
      {status}
    </span>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[96px] bg-[#24211e] px-3 py-3">
      <span className="block text-xl font-black leading-none">{value}</span>
      <span className="mt-1 block font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#8e867d]">
        {label}
      </span>
    </div>
  );
}

function Callout({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-lg border border-[#45403a] bg-[#1a1816] p-4">
      <span className="mt-0.5 text-[#e0aa57]">{icon}</span>
      <div>
        <h2 className="text-sm font-black">{title}</h2>
        <p className="mt-1 text-xs leading-5 text-[#9f968c]">{text}</p>
      </div>
    </div>
  );
}

function readSelectedGame(): AnimationFixtureGameId {
  if (typeof window === "undefined") return "cyberpunk";
  const requested = new URLSearchParams(window.location.search).get("game");
  return ANIMATION_FIXTURE_GAMES.some((game) => game.id === requested)
    ? (requested as AnimationFixtureGameId)
    : "cyberpunk";
}
