import { handFanLayout } from "../hand-fan";
import { CardSurface } from "../dom";
import "@mantine/core/styles.css";
import { Button, MantineProvider, Switch } from "@mantine/core";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { cardSelection } from "../card-selection";
import { SimulatorEffectCanvas } from "../SimulatorEffectCanvas";
import { initSimulatorSoundService, playSimulatorSound } from "../audio/sound-service";
import { OpeningScene, type OpeningMetrics } from "./OpeningScene";
import { openingCardIndex } from "./layout";
import type { OpeningBeat, OpeningCard, OpeningFixture } from "./types";
import type { ReactNode } from "react";
import styles from "./opening.module.css";

const ready: OpeningBeat = {
  id: "ready",
  title: "A new game awaits",
  detail: "Prepare the table and decide who takes the first turn.",
  leaders: "hidden",
  hand: "deck",
  localCount: 0,
  rivalCount: 0,
};

export function OpeningPresentation({
  fixture,
  homeHref,
  switchHref,
  notes,
}: {
  fixture: OpeningFixture;
  homeHref?: string;
  switchHref?: string;
  notes?: ReactNode;
}) {
  return (
    <MantineProvider forceColorScheme="dark">
      <OpeningTable
        key={fixture.slug}
        fixture={fixture}
        homeHref={homeHref}
        switchHref={switchHref}
        notes={notes}
      />
    </MantineProvider>
  );
}

function OpeningTable({
  fixture,
  homeHref,
  switchHref,
  notes,
}: {
  fixture: OpeningFixture;
  homeHref?: string;
  switchHref?: string;
  notes?: ReactNode;
}) {
  const [beats, setBeats] = useState<readonly OpeningBeat[]>([ready]);
  const [selected, setSelected] = useState<number[]>([]);
  const [localFirst, setLocalFirst] = useState(true);
  const [sound, setSound] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<OpeningMetrics | null>(null);
  const [inspected, setInspected] = useState<number | null>(null);
  const [preview, setPreview] = useState<OpeningCard | null>(null);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hidePreview = () => {
    clearTimeout(previewTimer.current);
    setPreview(null);
  };
  const schedulePreview = (card: OpeningCard | undefined) => {
    clearTimeout(previewTimer.current);
    previewTimer.current = setTimeout(() => setPreview(card ?? null), 350);
  };
  useEffect(() => () => clearTimeout(previewTimer.current), []);
  const nodes = useRef(new Map<string, HTMLDivElement>());
  const actionLock = useRef(false);
  const generation = useRef(0);
  const soundReady = useRef(false);
  const lastDraw = useRef(0);
  const soundOn = useRef(sound);
  soundOn.current = sound;
  const beat = beats[0] ?? ready;
  const busy = Boolean(beat.duration);
  const review = beat.action === "hand";
  const final = beat.id === "play";
  const [viewReady, setViewReady] = useState(false);

  useEffect(() => {
    setViewReady(true);
    document.title = `${fixture.name} · Opening fixture`;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    let cancelled = false;
    const cards = [...fixture.leaders, ...fixture.cards];
    void Promise.all(
      cards.map(async (card) => {
        const image = new Image();
        image.src = card.imageUrl;
        let timeout: ReturnType<typeof setTimeout> | undefined;
        try {
          await Promise.race([
            image.decode(),
            new Promise<never>((_, reject) => {
              timeout = setTimeout(() => reject(new Error("Artwork timed out")), 8000);
            }),
          ]);
          return null;
        } catch {
          return card.name;
        } finally {
          clearTimeout(timeout);
        }
      }),
    ).then((results) => {
      if (cancelled) return;
      setFailed(results.filter((name): name is string => name !== null));
      setLoaded(true);
    });
    return () => {
      cancelled = true;
      generation.current++;
      query.removeEventListener("change", update);
    };
  }, [fixture]);

  useEffect(() => {
    actionLock.current = false;
    setInspected(null);
  }, [beat]);
  useEffect(() => {
    if (beat.cue && soundOn.current && soundReady.current && !document.hidden)
      playSimulatorSound(beat.cue, () => soundOn.current && !document.hidden);
  }, [beat]);
  const advance = useCallback(
    () => setBeats((current) => (current.length > 1 ? current.slice(1) : current)),
    [],
  );
  const draw = useCallback(() => {
    const now = performance.now();
    // Two players may draw together. Mix one soft cue per beat, never a doubled burst.
    if (soundOn.current && soundReady.current && !document.hidden && now - lastDraw.current > 75) {
      lastDraw.current = now;
      playSimulatorSound("card.draw", () => soundOn.current && !document.hidden);
    }
  }, []);
  const coinLand = useCallback(() => {
    if (soundOn.current && soundReady.current && !document.hidden)
      playSimulatorSound("random.coin", () => soundOn.current && !document.hidden);
  }, []);
  const chooseOrder = (first: boolean) => {
    if (actionLock.current || beat.action !== "order") return;
    actionLock.current = true;
    setLocalFirst(first);
    setBeats(fixture.afterOrder(first));
  };
  const finishHand = () => {
    if (actionLock.current || beat.action !== "hand") return;
    actionLock.current = true;
    hidePreview();
    setBeats(fixture.afterHand(localFirst, selected.length));
  };
  const start = async () => {
    if (actionLock.current || !loaded) return;
    actionLock.current = true;
    const run = generation.current;
    if (sound) {
      await initSimulatorSoundService();
      soundReady.current = true;
    }
    if (run !== generation.current) return;
    setBeats(fixture.initial);
  };
  // Grand Archive's first player is a fixture input to the random result, not a
  // player choice granted by the rules. The visible toss result has one continuation.
  const canSelect = review && fixture.canMulligan;
  const toggle = (slot: number) => {
    if (!canSelect) return;
    hidePreview();
    if (soundOn.current && soundReady.current)
      playSimulatorSound("resource.spend", () => soundOn.current && !document.hidden);
    setSelected((current) =>
      current.includes(slot)
        ? current.filter((x) => x !== slot)
        : [...current, slot].sort((a, b) => a - b),
    );
  };
  const bind = (id: string) => (node: HTMLDivElement | null) => {
    if (node) nodes.current.set(id, node);
    else nodes.current.delete(id);
  };
  const cardFace = (id: string, card: OpeningCard | undefined, selectable = false, slot = -1) => (
    <CardSurface
      key={id}
      ref={bind(id)}
      data-opening-card={id}
      imageUrl={card?.imageUrl}
      selected={selectable && canSelect && selected.includes(slot)}
      interactive={selectable}
      fallback={
        card && failed.includes(card.name) ? (
          <span className={styles.missing}>
            {card.name}
            <small>Artwork unavailable</small>
          </span>
        ) : undefined
      }
    >
      {id.startsWith("deck-aux-") && fixture.auxiliaryDeck && (
        <span className={styles.auxLabel}>
          {fixture.auxiliaryDeck.label} ·{" "}
          {beat.leaders === "hidden"
            ? fixture.auxiliaryDeck.beforeReveal
            : fixture.auxiliaryDeck.afterReveal}
        </span>
      )}
      {selectable && (
        <button
          type="button"
          className={styles.cardHit}
          disabled={!review && !final}
          aria-label={`${canSelect ? "Replace" : "Inspect"} ${card?.name}`}
          aria-pressed={canSelect ? selected.includes(slot) : undefined}
          onClick={() =>
            canSelect ? toggle(slot) : final ? setInspected(slot) : setPreview(card ?? null)
          }
          onPointerEnter={() => {
            if (!final) schedulePreview(card);
          }}
          onPointerLeave={hidePreview}
          onFocus={() => (final ? setInspected(slot) : schedulePreview(card))}
          onBlur={() => {
            hidePreview();
            setInspected(null);
          }}
        ></button>
      )}
    </CardSurface>
  );

  return (
    <main
      className={styles.root}
      style={
        {
          "--opening-accent": fixture.accent,
          "--selection-rim": cardSelection.rim,
          "--selection-glow": cardSelection.glow,
        } as CSSProperties
      }
      data-opening-game={fixture.slug}
      data-opening-beat={beat.id}
      data-opening-ready={loaded}
      data-reduced-motion={reduced}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          hidePreview();
          setInspected(null);
        }
      }}
    >
      <header className={styles.header}>
        <a href={homeHref} className={styles.brand}>
          TCG ONLINE <span>/ {fixture.name}</span>
        </a>
        <span className={styles.fixtureTag}>Opening visual fixture</span>
        <div className={styles.tools}>
          <Switch
            label="Sound"
            checked={sound}
            size="xs"
            onChange={async (event) => {
              const enabled = event.currentTarget.checked;
              setSound(enabled);
              if (enabled) {
                await initSimulatorSoundService();
                soundReady.current = true;
              }
            }}
          />
          <Switch
            label="Reduced motion"
            checked={reduced}
            size="xs"
            onChange={(event) => setReduced(event.currentTarget.checked)}
          />
          <Button
            variant="subtle"
            size="compact-sm"
            onClick={() => {
              generation.current++;
              actionLock.current = false;
              setSelected([]);
              hidePreview();
              setMetrics(null);
              setBeats([ready]);
            }}
          >
            Restart
          </Button>
        </div>
      </header>
      <section
        className={styles.table}
        aria-label={`${fixture.name} opening table`}
        onPointerMove={(event) => {
          if (!final || event.pointerType === "touch") return;
          const table = event.currentTarget;
          const rect = table.getBoundingClientRect();
          setInspected(
            handFanLayout(table.clientWidth, table.clientHeight, fixture.handSize).hit(
              event.clientX - rect.left - table.clientLeft,
              event.clientY - rect.top - table.clientTop,
              inspected,
            ),
          );
        }}
        onPointerLeave={() => setInspected(null)}
        onPointerDown={(event) => {
          if (
            final &&
            event.target instanceof Element &&
            !event.target.closest("[data-opening-card]")
          )
            setInspected(null);
        }}
      >
        {viewReady && (
          <SimulatorEffectCanvas active={busy}>
            <OpeningScene
              fixture={fixture}
              beat={beat}
              selected={selected}
              inspected={inspected}
              nodes={nodes}
              reduced={reduced}
              onDone={advance}
              onDraw={draw}
              onCoinLand={coinLand}
              onMetrics={setMetrics}
            />
          </SimulatorEffectCanvas>
        )}
        <div className={styles.tableGrain} aria-hidden="true" />
        <div className={styles.opponent}>
          <span className={styles.playerDot} /> OPPONENT{" "}
          <small>{beat.leaders === "hidden" ? "Preparing" : fixture.leaders[1].name}</small>
        </div>
        <div className={styles.you}>
          <span className={styles.playerDot} /> YOU{" "}
          <small>{beat.leaders === "hidden" ? "Preparing" : fixture.leaders[0].name}</small>
        </div>
        <div className={styles.centerMark} aria-hidden="true">
          ✧
        </div>
        <div
          className={`${styles.life} ${styles.rivalLife}`}
          aria-label={`Opponent health ${fixture.health}`}
        >
          {fixture.health}
        </div>
        <div
          className={`${styles.life} ${styles.localLife}`}
          aria-label={`Your health ${fixture.health}`}
        >
          {fixture.health}
        </div>
        <div className={`${styles.deckLabel} ${styles.rivalDeck}`}>
          DECK <strong>{fixture.deckSize - beat.rivalCount}</strong>
        </div>
        <div className={`${styles.deckLabel} ${styles.localDeck}`}>
          DECK{" "}
          <strong>
            {fixture.deckSize - beat.localCount + (beat.hand === "return" ? selected.length : 0)}
          </strong>
        </div>
        <div
          className={styles.turnOrb}
          data-active={final}
          aria-label={final ? `${localFirst ? "Your" : "Opponent's"} turn` : "Setup"}
        >
          <span>{final ? "TURN 01" : "PREPARE"}</span>
          <strong>{final ? (localFirst ? "YOUR\nTURN" : "OPPONENT\nTURN") : "✦"}</strong>
        </div>
        <div className={styles.cards}>
          {[true, false].map((rival) => cardFace(`deck-${rival}`, undefined))}
          {fixture.auxiliaryDeck &&
            [true, false].map((rival) => (
              <div key={`aux-${rival}`} className={styles.auxiliary}>
                {cardFace(`deck-aux-${rival}`, undefined)}
              </div>
            ))}
          {fixture.leaders.map((card, i) => cardFace(`leader-${i === 1}`, card))}
          {[true, false].flatMap((rival) =>
            Array.from({ length: fixture.handSize }, (_, slot) =>
              cardFace(
                `${rival}-${slot}`,
                rival
                  ? undefined
                  : fixture.cards[
                      openingCardIndex(
                        slot,
                        selected,
                        Boolean(beat.replacement),
                        fixture.handSize,
                        fixture.cards.length,
                      )
                    ],
                !rival && slot < beat.localCount && beat.hand !== "return",
                slot,
              ),
            ),
          )}
        </div>
        <div
          key={beat.id}
          className={`${styles.prompt} ${final ? styles.finalPrompt : ""}`}
          data-timed={busy || undefined}
          style={
            { "--prompt-exit": `${Math.max(0, (beat.duration ?? 0) - 180)}ms` } as CSSProperties
          }
          role="status"
          aria-live="polite"
        >
          <span className={styles.eyebrow}>
            {fixture.name} · {final ? "Opening complete" : "Start of game"}
          </span>
          <h1>{beat.title}</h1>
          <p>{beat.detail}</p>
        </div>
        {(beat.id === "ready" || beat.action) && (
          <div key={`actions-${beat.id}`} className={styles.actionRail}>
            {beat.id === "ready" && (
              <>
                {!fixture.orderChoice && (
                  <label className={styles.fixtureChoice}>
                    Toss result{" "}
                    <select
                      aria-label="Fixture first player"
                      value={localFirst ? "you" : "opponent"}
                      onChange={(event) => setLocalFirst(event.target.value === "you")}
                    >
                      <option value="you">You first</option>
                      <option value="opponent">Opponent first</option>
                    </select>
                  </label>
                )}
                <Button color="yellow" size="md" disabled={!loaded} onClick={() => void start()}>
                  {loaded ? "Begin opening" : "Loading cards…"}
                </Button>
              </>
            )}
            {beat.action === "order" &&
              (fixture.orderChoice ? (
                <>
                  <Button variant="default" size="md" onClick={() => chooseOrder(false)}>
                    Play second
                  </Button>
                  <Button color="yellow" size="md" onClick={() => chooseOrder(true)}>
                    Play first
                  </Button>
                </>
              ) : (
                <Button color="yellow" size="md" onClick={() => chooseOrder(localFirst)}>
                  {localFirst ? "You play first" : "Opponent plays first"} · Continue
                </Button>
              ))}
            {beat.action === "reveal" && (
              <Button color="yellow" size="md" onClick={advance}>
                Reveal Spirits
              </Button>
            )}
            {review && (
              <>
                {canSelect && (
                  <span className={styles.selectionCount}>
                    {selected.length} of {fixture.handSize} selected
                    {selected.length > 0 && <small>Confirm to replace</small>}
                  </span>
                )}
                {canSelect && selected.length > 0 && (
                  <Button variant="default" onClick={() => setSelected([])}>
                    Clear selection
                  </Button>
                )}
                <Button color="yellow" size="md" onClick={finishHand}>
                  {fixture.canMulligan
                    ? selected.length
                      ? `Replace ${selected.length} ${selected.length === 1 ? "card" : "cards"}`
                      : "Keep hand"
                    : "Begin game"}
                </Button>
              </>
            )}
          </div>
        )}
        {preview && (review || final) && (
          <aside className={styles.preview} aria-label="Card preview">
            <img src={preview.imageUrl} alt={preview.name} />
            <span>{preview.name}</span>
          </aside>
        )}
      </section>
      <footer className={styles.footer}>
        <span>{fixture.handSummary}</span>
        <details>
          <summary>Fixture notes{metrics ? ` · ${metrics.fps.toFixed(0)} FPS` : ""}</summary>
          <div>
            <p>
              Presentation fixture with fixed cards and toss result. Opponent keeps. No live match
              actions are sent.
            </p>
            <Button
              variant="light"
              size="xs"
              disabled={!loaded}
              onClick={() => {
                generation.current++;
                actionLock.current = false;
                hidePreview();
                setSelected([]);
                const settled = fixture
                  .afterHand(localFirst, 0)
                  .find((stage) => stage.id === "play");
                if (settled) setBeats([settled]);
              }}
            >
              Preview settled hand
            </Button>
            {fixture.canMulligan && (
              <>
                <Button
                  variant="light"
                  color="yellow"
                  size="xs"
                  disabled={!loaded}
                  onClick={() => {
                    generation.current++;
                    actionLock.current = false;
                    hidePreview();
                    setSelected([0, 1]);
                    setMetrics(null);
                    const hand = fixture
                      .afterOrder(localFirst)
                      .find((stage) => stage.action === "hand");
                    if (hand) setBeats([hand]);
                  }}
                >
                  Preview selected mulligan
                </Button>
              </>
            )}
            {notes}
            {metrics && (
              <p data-testid="opening-performance">
                {metrics.frames} frames · average {metrics.fps.toFixed(1)} FPS · p95{" "}
                {metrics.p95.toFixed(1)} ms · {metrics.slow} frames over 20 ms · {metrics.calls}{" "}
                draw calls. Local browser sample; hardware affects results.
              </p>
            )}
            {failed.length > 0 && <p>Artwork failed: {failed.join(", ")}</p>}
            <a href={fixture.rulesUrl} target="_blank" rel="noreferrer">
              Opening rules
            </a>
          </div>
        </details>
        {switchHref && <a href={switchHref}>Switch game ↗</a>}
      </footer>
    </main>
  );
}
