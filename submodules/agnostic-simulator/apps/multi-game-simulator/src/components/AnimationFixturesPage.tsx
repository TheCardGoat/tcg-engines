import {
  IconArrowLeft,
  IconCards,
  IconEye,
  IconRefresh,
  IconSwitchHorizontal,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { AnimationPlanStepV1, AnimationPlanV1, AnimationZoneRef } from "@tcg/protocol";
import type {
  BoardLayout,
  SimulatorEntity,
  SimulatorTable,
  SimulatorZone,
} from "@tcg/simulator-contract";
import { Board, MotionAnimationSurface } from "@tcg/simulator-ui";
import { buildMountedHref } from "../routes/router-paths.ts";
import { useSimulatorAudio } from "../simulator/audio";

type ViewerSeatId = "human-seat" | "opponent-seat" | "spectator-seat";
type PublicCardZone = "human-battlefield" | "shared-discard" | "human-hand";

interface AnimationFixturesPageProps {
  onNavigate: (path: string) => void;
}

const HUMAN_SEAT_ID: ViewerSeatId = "human-seat";
const OPPONENT_SEAT_ID: ViewerSeatId = "opponent-seat";
const SPECTATOR_SEAT_ID: ViewerSeatId = "spectator-seat";
const CYBERPUNK_ALPHA_CARD_URL = "https://r2.tcg.online/public/cyberpunk/cards/alpha";
const CYBERPUNK_CARD_BACK_URL = "https://r2.tcg.online/public/cyberpunk/cards/back/card-back.webp";
const SINGLE_DRAW_DURATION_MS = 720;
const OPENING_HAND_DRAW_DURATION_MS = 300;
const OPENING_HAND_DRAW_STAGGER_MS = 150;

const DRAW_CARD = cyberpunkFixtureEntity({
  id: "floor-it",
  title: "Floor It",
  kind: "card",
  imageId: "a023",
  states: ["ready"],
  stats: [
    { label: "Cost", value: "3" },
    { label: "Type", value: "Program" },
  ],
  traits: ["Plan", "Merc"],
  frameColor: "#2c7be5",
});

const OPENING_HAND_DRAW_CARDS: SimulatorEntity[] = [
  DRAW_CARD,
  cyberpunkFixtureEntity({
    id: "dying-night",
    title: "Dying Night",
    kind: "card",
    imageId: "a022",
    states: ["ready"],
    stats: [
      { label: "Cost", value: "2" },
      { label: "Type", value: "Gear" },
    ],
    traits: ["Weapon"],
    frameColor: "#f4c430",
  }),
  cyberpunkFixtureEntity({
    id: "sandevistan",
    title: "Sandevistan",
    kind: "card",
    imageId: "a024",
    states: ["ready"],
    stats: [
      { label: "Cost", value: "3" },
      { label: "Type", value: "Gear" },
    ],
    traits: ["Cyberware"],
    frameColor: "#f4c430",
  }),
  cyberpunkFixtureEntity({
    id: "industrial-assembly",
    title: "Industrial Assembly",
    kind: "card",
    imageId: "a021",
    states: ["ready"],
    stats: [
      { label: "Cost", value: "4" },
      { label: "Type", value: "Program" },
    ],
    traits: ["Plan"],
    frameColor: "#2c7be5",
  }),
  cyberpunkFixtureEntity({
    id: "corporate-surveillance",
    title: "Corporate Surveillance",
    kind: "card",
    imageId: "a025",
    states: ["ready"],
    stats: [
      { label: "Cost", value: "2" },
      { label: "Type", value: "Program" },
    ],
    traits: ["Intel"],
    frameColor: "#2c7be5",
  }),
];

const SECRET_ZONE_CARD = cyberpunkFixtureEntity({
  id: "classified-contract",
  title: "Classified Contract",
  kind: "card",
  imageId: "a024",
  states: ["hidden"],
  stats: [
    { label: "Cost", value: "4" },
    { label: "Type", value: "Operation" },
  ],
  traits: ["Contract"],
  frameColor: "#8c5cff",
});

const HAND_NEIGHBOR_CARDS: SimulatorEntity[] = [
  cyberpunkFixtureEntity({
    id: "reboot-optics",
    title: "Reboot Optics",
    kind: "card",
    imageId: "a028",
    states: ["ready"],
    stats: [
      { label: "Cost", value: "2" },
      { label: "Type", value: "Program" },
    ],
    traits: ["Hack"],
    frameColor: "#2c7be5",
  }),
  cyberpunkFixtureEntity({
    id: "kiroshi-optics",
    title: "Kiroshi Optics",
    kind: "card",
    imageId: "a026",
    states: ["ready"],
    stats: [
      { label: "Cost", value: "1" },
      { label: "Type", value: "Gear" },
    ],
    traits: ["Cyberware"],
    frameColor: "#f4c430",
  }),
];

const PUBLIC_CARD = cyberpunkFixtureEntity({
  id: "ruthless-lowlife",
  title: "Ruthless Lowlife",
  kind: "unit",
  imageId: "a008",
  states: ["active"],
  stats: [
    { label: "Power", value: "1" },
    { label: "Cost", value: "2" },
  ],
  traits: ["Arasaka", "Merc"],
  frameColor: "#d33f49",
});

const BATTLEFIELD_NEIGHBOR_CARDS: SimulatorEntity[] = [
  cyberpunkFixtureEntity({
    id: "armored-minotaur",
    title: "Armored Minotaur",
    kind: "unit",
    imageId: "a007",
    states: ["ready"],
    stats: [
      { label: "Power", value: "9" },
      { label: "Cost", value: "6" },
    ],
    traits: ["Arasaka"],
    frameColor: "#d33f49",
  }),
  cyberpunkFixtureEntity({
    id: "swordwise-huscle",
    title: "Swordwise Huscle",
    kind: "unit",
    imageId: "a009",
    states: ["ready"],
    stats: [
      { label: "Power", value: "5" },
      { label: "Cost", value: "4" },
    ],
    traits: ["Merc"],
    frameColor: "#d33f49",
  }),
];

const DISCARD_NEIGHBOR_CARDS: SimulatorEntity[] = [
  cyberpunkFixtureEntity({
    id: "delamain-cab",
    title: "Delamain Cab",
    kind: "unit",
    imageId: "a010",
    states: ["active"],
    stats: [
      { label: "Power", value: "2" },
      { label: "Cost", value: "2" },
    ],
    traits: ["Service"],
    frameColor: "#7cdaef",
  }),
  cyberpunkFixtureEntity({
    id: "secondhand-bombus",
    title: "Secondhand Bombus",
    kind: "unit",
    imageId: "a014",
    states: ["ready"],
    stats: [
      { label: "Power", value: "3" },
      { label: "Cost", value: "3" },
    ],
    traits: ["Drone"],
    frameColor: "#7cdaef",
  }),
];

const baseZones: Record<string, SimulatorZone> = {
  deck: {
    id: "human-deck",
    label: "Secret deck",
    role: "deck",
    ownerId: HUMAN_SEAT_ID,
    visibility: "secret",
    entityIds: [],
    count: 24,
    hint: "Source is a count-only secret zone; the exact card is hidden at launch.",
    layoutHint: "stack",
  },
  secret: {
    id: "secret-cache",
    label: "Secret zone",
    role: "custom",
    ownerId: HUMAN_SEAT_ID,
    visibility: "secret",
    entityIds: [],
    count: 1,
    hint: "Secret zone cards stay hidden from every perspective.",
    layoutHint: "row",
  },
  hand: {
    id: "human-hand",
    label: "Your hand",
    role: "hand",
    ownerId: HUMAN_SEAT_ID,
    visibility: "private",
    entityIds: HAND_NEIGHBOR_CARDS.map((card) => card.id),
    count: HAND_NEIGHBOR_CARDS.length,
    hint: "Destination is private and already occupied, so the draw must land beside neighbors.",
    layoutHint: "fan",
  },
  battlefield: {
    id: "human-battlefield",
    label: "Battlefield",
    role: "battlefield",
    ownerId: HUMAN_SEAT_ID,
    visibility: "public",
    entityIds: [PUBLIC_CARD.id, ...BATTLEFIELD_NEIGHBOR_CARDS.map((card) => card.id)],
    count: BATTLEFIELD_NEIGHBOR_CARDS.length + 1,
    hint: "Public source starts occupied so the moving card leaves a real row behind.",
    layoutHint: "row",
  },
  discard: {
    id: "shared-discard",
    label: "Discard",
    role: "discard",
    visibility: "public",
    entityIds: DISCARD_NEIGHBOR_CARDS.map((card) => card.id),
    count: DISCARD_NEIGHBOR_CARDS.length,
    hint: "Public destination already has cards, so the moving card lands into a crowded zone.",
    layoutHint: "row",
  },
};

const ALL_FIXTURE_ENTITIES = [
  DRAW_CARD,
  ...OPENING_HAND_DRAW_CARDS,
  SECRET_ZONE_CARD,
  ...HAND_NEIGHBOR_CARDS,
  PUBLIC_CARD,
  ...BATTLEFIELD_NEIGHBOR_CARDS,
  ...DISCARD_NEIGHBOR_CARDS,
];

const boardLayout: BoardLayout = {
  title: "Animation fixture table",
  summary: "Game-agnostic zones used to validate card transfer motion.",
  appearance: {
    variant: "lanes",
    density: "compact",
    labelPlacement: "hidden",
  },
  buildingBlocks: [],
  sections: [
    {
      id: "animation-table",
      label: "Animation table",
      role: "shared",
      layout: { columns: 12, labelPlacement: "hidden" },
      blocks: [
        {
          id: "deck-block",
          kind: "stack",
          label: "Secret deck",
          size: "compact",
          zoneId: baseZones.deck.id,
        },
        {
          id: "secret-zone-block",
          kind: "zone",
          label: "Secret zone",
          size: "normal",
          zoneId: baseZones.secret.id,
        },
        {
          id: "battlefield-block",
          kind: "zone",
          label: "Battlefield",
          size: "wide",
          zoneId: baseZones.battlefield.id,
        },
        {
          id: "discard-block",
          kind: "zone",
          label: "Discard",
          size: "wide",
          zoneId: baseZones.discard.id,
        },
        {
          id: "hand-block",
          kind: "zone",
          label: "Your hand",
          size: "wide",
          zoneId: baseZones.hand.id,
        },
      ],
    },
  ],
};

export default function AnimationFixturesPage({ onNavigate }: AnimationFixturesPageProps) {
  const [viewerSeatId, setViewerSeatId] = useState<ViewerSeatId>(HUMAN_SEAT_ID);
  const [drawnCardIds, setDrawnCardIds] = useState<string[]>([]);
  const [publicCardZone, setPublicCardZone] = useState<PublicCardZone>("human-battlefield");
  const [secretCardMoved, setSecretCardMoved] = useState(false);
  const [discardLayoutShifted, setDiscardLayoutShifted] = useState(false);
  const [animationPlans, setAnimationPlans] = useState<AnimationPlanV1[]>([]);
  const [lastEvent, setLastEvent] = useState("Ready");
  const sequenceRef = useRef(0);
  const { scheduleAnimationSteps, cancelScheduledCues } = useSimulatorAudio();

  useEffect(() => {
    document.title = "Animation Fixtures | Multi-Game Simulator Harness";
  }, []);

  useEffect(() => () => cancelScheduledCues(), [cancelScheduledCues]);

  const { table, entities } = useMemo(
    () =>
      createAnimationFixtureState(
        viewerSeatId,
        drawnCardIds,
        publicCardZone,
        secretCardMoved,
        discardLayoutShifted,
      ),
    [viewerSeatId, drawnCardIds, publicCardZone, secretCardMoved, discardLayoutShifted],
  );
  const entityById = useMemo(() => {
    return new Map([...ALL_FIXTURE_ENTITIES, ...entities].map((entity) => [entity.id, entity]));
  }, [entities]);
  const zoneById = useMemo(
    () => new Map(table.zones.map((zone) => [zone.id, zone])),
    [table.zones],
  );

  const switchPerspective = () => {
    const nextViewerSeatId = viewerSeatId === HUMAN_SEAT_ID ? OPPONENT_SEAT_ID : HUMAN_SEAT_ID;
    setViewerSeatId(nextViewerSeatId);
    setAnimationPlans([]);
    cancelScheduledCues();
    setLastEvent(nextViewerSeatId === HUMAN_SEAT_ID ? "Viewing as you" : "Viewing as opponent");
  };

  const nextTransferId = (prefix: string) => {
    sequenceRef.current += 1;
    return `${prefix}-${viewerSeatId}-${sequenceRef.current}`;
  };

  const createDrawTransfer = (
    entity: SimulatorEntity,
    idPrefix: string,
    durationMs: number,
    delayMs = 0,
  ): AnimationPlanV1 =>
    fixtureAnimationPlan(
      nextTransferId(idPrefix),
      moveEntityStep({
        id: `${idPrefix}:${entity.id}`,
        entityId: entity.id,
        fromZone: baseZones.deck,
        toZone: baseZones.hand,
        durationMs,
        delayMs,
        audioCue: "card.draw",
      }),
    );

  const runDraw = () => {
    cancelScheduledCues();
    setDrawnCardIds((current) =>
      current.includes(DRAW_CARD.id) ? current : [...current, DRAW_CARD.id],
    );
    setLastEvent("Drawing from secret deck");
    setAnimationPlans([createDrawTransfer(DRAW_CARD, "draw", SINGLE_DRAW_DURATION_MS)]);
  };

  const runOpeningHandDraw = () => {
    const cardsToDraw = OPENING_HAND_DRAW_CARDS.filter((card) => !drawnCardIds.includes(card.id));
    if (cardsToDraw.length === 0) {
      return;
    }

    cancelScheduledCues();
    setDrawnCardIds((current) =>
      Array.from(new Set([...current, ...cardsToDraw.map((card) => card.id)])),
    );
    setLastEvent("Drawing opening hand");
    setAnimationPlans(
      cardsToDraw.map((card, index) =>
        createDrawTransfer(
          card,
          "opening-hand",
          OPENING_HAND_DRAW_DURATION_MS,
          index * OPENING_HAND_DRAW_STAGGER_MS,
        ),
      ),
    );
  };

  const runPublicMove = () => {
    cancelScheduledCues();
    const nextZone: PublicCardZone =
      publicCardZone === "human-battlefield" ? "shared-discard" : "human-battlefield";
    setPublicCardZone(nextZone);
    setLastEvent(nextZone === "shared-discard" ? "Moving to discard" : "Returning to battlefield");
    setAnimationPlans([
      fixtureAnimationPlan(
        nextTransferId("move-zone"),
        moveEntityStep({
          id: `move-zone:${PUBLIC_CARD.id}`,
          entityId: PUBLIC_CARD.id,
          fromZone:
            publicCardZone === "human-battlefield" ? baseZones.battlefield : baseZones.discard,
          toZone: nextZone === "human-battlefield" ? baseZones.battlefield : baseZones.discard,
          durationMs: 760,
          audioCue: "card.move",
        }),
      ),
    ]);
  };

  const runPublicToPrivateMove = () => {
    cancelScheduledCues();
    const fromZone =
      publicCardZone === "shared-discard" ? baseZones.discard : baseZones.battlefield;
    setPublicCardZone("human-hand");
    setLastEvent("Moving public card to private hand");
    setAnimationPlans([
      fixtureAnimationPlan(
        nextTransferId("public-to-private"),
        moveEntityStep({
          id: `public-to-private:${PUBLIC_CARD.id}`,
          entityId: PUBLIC_CARD.id,
          fromZone,
          toZone: baseZones.hand,
          durationMs: 760,
          audioCue: "card.move",
        }),
      ),
    ]);
  };

  const runSharedPrimitives = () => {
    cancelScheduledCues();
    setSecretCardMoved(true);
    setDiscardLayoutShifted((current) => !current);
    setLastEvent("Running shared primitives");
    setAnimationPlans([
      fixtureAnimationPlan(nextTransferId("shared-primitive-layout-shift"), {
        id: "shared-primitive-layout-shift",
        type: "layoutShift",
        entities: DISCARD_NEIGHBOR_CARDS.map((card) => ({ kind: "entity", id: card.id })),
        durationMs: 420,
        audioCue: "deck.shuffle",
      }),
      fixtureAnimationPlan(
        nextTransferId("empty-zone-transfer"),
        moveEntityStep({
          id: `empty-zone-transfer:${SECRET_ZONE_CARD.id}`,
          entityId: SECRET_ZONE_CARD.id,
          fromZone: baseZones.secret,
          toZone: baseZones.discard,
          durationMs: 420,
          audioCue: "card.move",
        }),
      ),
      fixtureAnimationPlan(nextTransferId("shared-primitive-zone-exit"), {
        id: `shared-primitive-zone-exit:${PUBLIC_CARD.id}`,
        type: "exitEntity",
        entity: { kind: "entity", id: PUBLIC_CARD.id },
        from: zoneRef(
          publicCardZone === "human-battlefield" ? baseZones.battlefield : baseZones.discard,
        ),
        durationMs: 420,
      }),
      fixtureAnimationPlan(nextTransferId("shared-primitive-zone-enter"), {
        id: `shared-primitive-zone-enter:${OPENING_HAND_DRAW_CARDS[1].id}`,
        type: "enterEntity",
        entity: { kind: "entity", id: OPENING_HAND_DRAW_CARDS[1].id },
        to: zoneRef(baseZones.discard),
        delayMs: 60,
        durationMs: 420,
      }),
      fixtureAnimationPlan(
        nextTransferId("shared-primitive-attach"),
        moveEntityStep({
          id: `shared-primitive-attach:${HAND_NEIGHBOR_CARDS[1].id}`,
          entityId: HAND_NEIGHBOR_CARDS[1].id,
          fromZone: baseZones.hand,
          toEntityId: BATTLEFIELD_NEIGHBOR_CARDS[0].id,
          delayMs: 90,
          durationMs: 420,
        }),
      ),
      fixtureAnimationPlan(nextTransferId("shared-primitive-flip"), {
        id: `shared-primitive-flip:${HAND_NEIGHBOR_CARDS[0].id}`,
        type: "effect",
        source: { kind: "entity", id: HAND_NEIGHBOR_CARDS[0].id },
        targets: [{ kind: "entity", id: HAND_NEIGHBOR_CARDS[0].id }],
        label: "REVEAL",
        delayMs: 180,
        durationMs: 420,
      }),
      fixtureAnimationPlan(
        nextTransferId("shared-primitive-resource"),
        {
          id: "shared-primitive-resource",
          type: "resourceDelta",
          player: { kind: "player", id: HUMAN_SEAT_ID },
          anchor: { kind: "anchor", id: "fixture-resource-anchor" },
          delta: 2,
          label: "EDDIES",
          delayMs: 220,
          durationMs: 520,
        },
        [
          {
            id: "fixture-resource-anchor",
            role: "custom",
            target: zoneRef(baseZones.hand),
          },
        ],
      ),
      fixtureAnimationPlan(nextTransferId("shared-primitive-phase"), {
        id: "shared-primitive-phase",
        type: "phaseChange",
        from: "main",
        to: "end",
        delayMs: 260,
        durationMs: 560,
      }),
    ]);
  };

  const reset = () => {
    setDrawnCardIds([]);
    setPublicCardZone("human-battlefield");
    setSecretCardMoved(false);
    setDiscardLayoutShifted(false);
    setAnimationPlans([]);
    cancelScheduledCues();
    setLastEvent("Ready");
  };

  const viewerIsOwner = useMemo(() => viewerSeatId === HUMAN_SEAT_ID, [viewerSeatId]);
  const viewerIsSpectator = useMemo(() => viewerSeatId === SPECTATOR_SEAT_ID, [viewerSeatId]);
  const transferInFlight = animationPlans.length > 0;
  const allOpeningHandCardsDrawn = OPENING_HAND_DRAW_CARDS.every((card) =>
    drawnCardIds.includes(card.id),
  );
  const mountedHarnessRootHref = useMemo(() => buildMountedHref("/"), []);

  return (
    <main
      className="grid h-svh w-full grid-rows-[auto_minmax(0,1fr)] gap-3 overflow-hidden p-3"
      data-theme="dark"
      data-game="animation-fixtures"
    >
      <header className="grid min-h-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[var(--shadow)] max-[1100px]:grid-cols-1">
        <button
          type="button"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-sm font-semibold text-[var(--muted)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
          onClick={() => onNavigate(mountedHarnessRootHref)}
        >
          <IconArrowLeft size={16} />
          All games
        </button>

        <div className="min-w-0">
          <p className="text-[11px] font-extrabold uppercase tracking-normal text-[var(--game-accent)]">
            animation fixtures
          </p>
          <h1 className="mt-1 truncate text-2xl font-extrabold leading-tight tracking-normal text-[var(--text)]">
            Card transfer building blocks
          </h1>
          <p className="mt-1 line-clamp-1 max-w-[820px] text-sm leading-relaxed text-[var(--muted)]">
            FLIP movement resolves from normalized zones. Perspective controls secret, private, and
            public card visibility.
          </p>
        </div>

        <div
          className="grid min-w-[220px] gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-2.5 text-sm"
          data-testid="animation-status"
        >
          <span className="font-black text-[var(--text)]">{lastEvent}</span>
          <span className="truncate text-[var(--muted)]">
            {viewerIsOwner
              ? "You see private hand cards; secret stays hidden"
              : viewerIsSpectator
                ? "Spectator sees private and secret zones redacted"
                : "Opponent sees private zones redacted; public stays face-up"}
          </span>
        </div>
      </header>

      <section className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-3 overflow-hidden">
        <aside className="grid grid-cols-[minmax(220px,310px)_minmax(360px,1fr)_minmax(320px,460px)] gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[var(--shadow)] max-[1100px]:grid-cols-1">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase text-[var(--game-accent)]">
              perspective
            </p>
            <div
              className="mt-1.5 grid grid-cols-3 gap-2"
              role="group"
              aria-label="Player perspective"
            >
              <FixtureButton
                active={viewerSeatId === HUMAN_SEAT_ID}
                icon={<IconUser size={16} />}
                label="You"
                onClick={() => setViewerSeatId(HUMAN_SEAT_ID)}
                disabled={transferInFlight}
                testId="viewer-owner"
              />
              <FixtureButton
                active={viewerSeatId === OPPONENT_SEAT_ID}
                icon={<IconUsers size={16} />}
                label="Opponent"
                onClick={() => setViewerSeatId(OPPONENT_SEAT_ID)}
                disabled={transferInFlight}
                testId="viewer-opponent"
              />
              <FixtureButton
                active={viewerSeatId === SPECTATOR_SEAT_ID}
                icon={<IconEye size={16} />}
                label="Spectator"
                onClick={() => setViewerSeatId(SPECTATOR_SEAT_ID)}
                disabled={transferInFlight}
                testId="viewer-spectator"
              />
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-7 gap-2 max-[1180px]:grid-cols-3 max-[920px]:grid-cols-2 max-[720px]:grid-cols-1">
            <FixtureButton
              icon={<IconEye size={16} />}
              label={viewerIsOwner ? "View as opponent" : "View as you"}
              onClick={switchPerspective}
              disabled={transferInFlight}
              testId="switch-perspective"
            />
            <FixtureButton
              icon={<IconCards size={16} />}
              label="Draw card"
              onClick={runDraw}
              disabled={drawnCardIds.includes(DRAW_CARD.id) || transferInFlight}
              testId="run-draw"
            />
            <FixtureButton
              icon={<IconCards size={16} />}
              label="Draw opening hand"
              onClick={runOpeningHandDraw}
              disabled={allOpeningHandCardsDrawn || transferInFlight}
              testId="run-opening-hand-draw"
            />
            <FixtureButton
              icon={<IconSwitchHorizontal size={16} />}
              label="Move public card"
              onClick={runPublicMove}
              disabled={transferInFlight || publicCardZone === "human-hand"}
              testId="run-public-move"
            />
            <FixtureButton
              icon={<IconSwitchHorizontal size={16} />}
              label="Public to private"
              onClick={runPublicToPrivateMove}
              disabled={transferInFlight || publicCardZone === "human-hand"}
              testId="run-public-to-private"
            />
            <FixtureButton
              icon={<IconCards size={16} />}
              label="Run primitives"
              onClick={runSharedPrimitives}
              disabled={transferInFlight}
              testId="run-shared-primitives"
            />
            <FixtureButton
              icon={<IconRefresh size={16} />}
              label="Reset"
              onClick={reset}
              testId="reset-animation-fixture"
            />
          </div>

          <dl className="grid min-w-0 grid-cols-3 gap-2 text-sm max-[720px]:grid-cols-1">
            <div className="grid gap-0.5 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2">
              <dt className="font-bold text-[var(--muted)]">Secret</dt>
              <dd className="truncate text-[var(--text)]">hidden from every perspective</dd>
            </div>
            <div className="grid gap-0.5 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2">
              <dt className="font-bold text-[var(--muted)]">Private</dt>
              <dd className="truncate text-[var(--text)]">visible only to the owner</dd>
            </div>
            <div className="grid gap-0.5 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2">
              <dt className="font-bold text-[var(--muted)]">Public</dt>
              <dd className="inline-flex min-w-0 items-center gap-1 text-[var(--text)]">
                <IconEye size={15} />
                <span className="truncate">face-up for both players</span>
              </dd>
            </div>
          </dl>
        </aside>

        <section
          className="min-h-0 min-w-0 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[var(--shadow)] [&_.board]:h-full [&_.board]:content-start [&_.board-block]:min-h-[96px] [&_.card-grid]:grid-cols-[repeat(auto-fit,minmax(96px,1fr))] [&_.sim-card-face[data-card-density='normal']]:min-h-[112px]"
          aria-label="Animation table"
        >
          <MotionAnimationSurface
            animationPlans={animationPlans}
            viewerSeatId={viewerSeatId}
            resolveEntity={(entityId) => entityById.get(entityId)}
            resolveZone={(ref) => zoneById.get(ref.id)}
            onAnimationStepsScheduled={scheduleAnimationSteps}
            onPlanComplete={(completedPlanId) => {
              setAnimationPlans((current) => {
                const completedPlan = current.find((plan) => plan.id === completedPlanId);
                const nextPlans = current.filter((plan) => plan.id !== completedPlanId);
                const completedOpeningHandStep = completedPlanId.startsWith("opening-hand-");
                const openingHandStillAnimating = nextPlans.some((plan) =>
                  plan.id.startsWith("opening-hand-"),
                );
                const completedSharedPrimitive = completedPlanId.startsWith("shared-primitive-");
                const sharedPrimitiveStillAnimating = nextPlans.some((plan) =>
                  plan.id.startsWith("shared-primitive-"),
                );
                const completedStep = completedPlan?.steps[0];

                if (
                  completedPlanId.startsWith("move-zone-") &&
                  completedStep?.type === "moveEntity" &&
                  completedStep.to.kind === "zone"
                ) {
                  setLastEvent("Move complete: public to public");
                  setPublicCardZone(
                    completedStep.to.id === "human-battlefield"
                      ? "human-battlefield"
                      : completedStep.to.id === "human-hand"
                        ? "human-hand"
                        : "shared-discard",
                  );
                } else if (
                  completedPlanId.startsWith("public-to-private-") &&
                  completedStep?.type === "moveEntity"
                ) {
                  setLastEvent(
                    viewerIsOwner
                      ? "Move complete: public to private"
                      : "Move complete: public to hidden",
                  );
                  setPublicCardZone("human-hand");
                } else if (completedSharedPrimitive && !sharedPrimitiveStillAnimating) {
                  setLastEvent("Shared primitives complete");
                } else if (completedOpeningHandStep && !openingHandStillAnimating) {
                  setLastEvent("Opening hand drawn");
                } else if (!completedOpeningHandStep) {
                  setLastEvent(
                    viewerIsOwner
                      ? "Draw complete: hidden to public"
                      : "Draw complete: hidden to hidden",
                  );
                }

                return nextPlans;
              });
            }}
          >
            <Board table={table} entities={entities} layout={boardLayout} />
          </MotionAnimationSurface>
        </section>
      </section>
    </main>
  );
}

interface FixtureButtonProps {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  testId?: string;
}

function FixtureButton({
  label,
  icon,
  onClick,
  active = false,
  disabled = false,
  testId,
}: FixtureButtonProps) {
  return (
    <button
      type="button"
      data-testid={testId}
      aria-pressed={active}
      disabled={disabled}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-black transition-colors ${
        active
          ? "border-[var(--game-accent)] bg-[var(--game-accent)] text-[#07110f]"
          : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text)] hover:border-[var(--border-strong)]"
      } disabled:cursor-not-allowed disabled:opacity-45`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function fixtureAnimationPlan(
  id: string,
  step: AnimationPlanStepV1,
  anchors: AnimationPlanV1["anchors"] = [],
): AnimationPlanV1 {
  return { id, version: 1, anchors, steps: [step] };
}

function moveEntityStep({
  id,
  entityId,
  fromZone,
  toZone,
  toEntityId,
  durationMs,
  delayMs,
  audioCue,
}: {
  id: string;
  entityId: string;
  fromZone: SimulatorZone;
  toZone?: SimulatorZone;
  toEntityId?: string;
  durationMs: number;
  delayMs?: number;
  audioCue?: AnimationPlanStepV1["audioCue"];
}): AnimationPlanStepV1 {
  return {
    id,
    type: "moveEntity",
    entity: { kind: "entity", id: entityId },
    from: zoneRef(fromZone),
    to: toEntityId ? { kind: "entity", id: toEntityId } : zoneRef(requiredZone(toZone)),
    durationMs,
    delayMs,
    audioCue,
  };
}

function requiredZone(zone: SimulatorZone | undefined): SimulatorZone {
  if (!zone) {
    throw new Error("Fixture move plan requires a destination zone.");
  }
  return zone;
}

function zoneRef(zone: SimulatorZone): AnimationZoneRef {
  return {
    kind: "zone",
    id: zone.id,
    ...(zone.ownerId ? { ownerId: zone.ownerId } : {}),
  };
}

function projectFixtureEntityForZoneViewer(
  entity: SimulatorEntity,
  zone: SimulatorZone,
  viewerSeatId: ViewerSeatId,
): SimulatorEntity {
  const isVisible =
    zone.visibility === "public" ||
    (zone.visibility === "private" && zone.ownerId === viewerSeatId);
  if (isVisible) {
    return { ...entity, face: "public" };
  }
  return {
    ...entity,
    title: "Hidden card",
    subtitle: zone.label,
    face: "hidden",
    imageUrl: undefined,
    stats: [],
    traits: [],
    states: Array.from(new Set([...entity.states, "hidden" as const])),
  };
}

function createAnimationFixtureState(
  viewerSeatId: ViewerSeatId,
  drawnCardIds: string[],
  publicCardZone: PublicCardZone,
  secretCardMoved: boolean,
  discardLayoutShifted: boolean,
): { table: SimulatorTable; entities: SimulatorEntity[] } {
  const secretCards = secretCardMoved
    ? []
    : [projectFixtureEntityForZoneViewer(SECRET_ZONE_CARD, baseZones.secret, viewerSeatId)];
  const drawnCards = OPENING_HAND_DRAW_CARDS.filter((card) => drawnCardIds.includes(card.id));
  const nativeHandCards = [...HAND_NEIGHBOR_CARDS, ...drawnCards];
  const handCards = [
    ...nativeHandCards,
    ...(publicCardZone === "human-hand" ? [PUBLIC_CARD] : []),
  ].map((card) => projectFixtureEntityForZoneViewer(card, baseZones.hand, viewerSeatId));
  const battlefieldCards =
    publicCardZone === "human-battlefield"
      ? [PUBLIC_CARD, ...BATTLEFIELD_NEIGHBOR_CARDS]
      : BATTLEFIELD_NEIGHBOR_CARDS;
  const battlefieldEntities = battlefieldCards.map((card) =>
    projectFixtureEntityForZoneViewer(card, baseZones.battlefield, viewerSeatId),
  );
  const discardCards =
    publicCardZone === "shared-discard"
      ? [...DISCARD_NEIGHBOR_CARDS, PUBLIC_CARD]
      : DISCARD_NEIGHBOR_CARDS;
  const shiftedDiscardCards = discardLayoutShifted ? [...discardCards].reverse() : discardCards;
  const discardEntities = (
    secretCardMoved
      ? [
          ...shiftedDiscardCards,
          projectFixtureEntityForZoneViewer(SECRET_ZONE_CARD, baseZones.discard, viewerSeatId),
        ]
      : shiftedDiscardCards
  ).map((card) => projectFixtureEntityForZoneViewer(card, baseZones.discard, viewerSeatId));
  const zones: SimulatorZone[] = [
    {
      ...baseZones.deck,
      count: 24 - drawnCards.length,
    },
    {
      ...baseZones.secret,
      count: secretCards.length,
      entityIds: secretCards.map((card) => card.id),
    },
    {
      ...baseZones.hand,
      count: handCards.length,
      entityIds: handCards.map((card) => card.id),
    },
    {
      ...baseZones.battlefield,
      count: battlefieldEntities.length,
      entityIds: battlefieldEntities.map((card) => card.id),
    },
    {
      ...baseZones.discard,
      count: discardEntities.length,
      entityIds: discardEntities.map((card) => card.id),
    },
  ];

  const entities = [...secretCards, ...handCards, ...battlefieldEntities, ...discardEntities];

  return {
    table: {
      status: {
        activeSeatId: HUMAN_SEAT_ID,
        phase: "Animation fixture",
        turn: 1,
        stateVersion: 1 + drawnCards.length,
      },
      seats: [
        {
          id: OPPONENT_SEAT_ID,
          label: "Opponent",
          role: "agent",
          perspective: "top",
          counters: [{ label: "Hand", value: "4" }],
        },
        {
          id: HUMAN_SEAT_ID,
          label: "You",
          role: "human",
          perspective: "bottom",
          counters: [
            { label: "Deck", value: (24 - drawnCards.length).toString() },
            { label: "Hand", value: handCards.length.toString() },
          ],
        },
      ],
      zones,
    },
    entities,
  };
}

function cyberpunkFixtureEntity({
  id,
  title,
  kind,
  imageId,
  states,
  stats,
  traits,
  frameColor,
}: {
  id: string;
  title: string;
  kind: SimulatorEntity["kind"];
  imageId: string;
  states: SimulatorEntity["states"];
  stats: SimulatorEntity["stats"];
  traits: SimulatorEntity["traits"];
  frameColor: string;
}): SimulatorEntity {
  return {
    id,
    title,
    subtitle: "Cyberpunk Alpha",
    kind,
    ownerId: HUMAN_SEAT_ID,
    face: "public",
    states,
    imageUrl: `${CYBERPUNK_ALPHA_CARD_URL}/${imageId}.webp`,
    backImageUrl: CYBERPUNK_CARD_BACK_URL,
    stats,
    traits,
    frameStyle: { color: frameColor },
  };
}
