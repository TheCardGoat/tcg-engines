import {
  Suspense,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from "react";
import { buildMountedHref } from "../../../../routes/router-paths";
import { Button, Modal } from "@mantine/core";
import { createSimulatorExternalCommandGate } from "@tcg/simulator-runtime/animation";
import { CyberpunkSimulatorProviders } from "../../App";
import { EngineProvider, useEngine, useSideZones } from "../../engine";
import { Card } from "../GameBoard/Card";
import { CardKnobControls, defaultKnobs } from "../../../../components/component-catalog/Workbench";
import type { BoardProjection } from "./viewport";
import type { CardInteractionAppearance } from "../GameBoard/Card";
import { CardImage, CARD_BACK } from "../GameBoard/CardImage";
import { DieDisplay } from "../GameBoard/DieDisplay";
import { EddiesZone } from "../GameBoard/EddiesZone";
import { DeckZone } from "../GameBoard/DeckZone";
import { TrashZone } from "../GameBoard/TrashZone";
import {
  AttackSelectionProvider,
  MoveSelectionProvider,
  DragDropProvider,
  GameStateProvider,
  ClockDisplay,
  CenterRow,
  PassTurnControl,
} from "../GameBoard";
import { GameClockProvider } from "../GameBoard/useGameClock";
import { PaymentSelectionProvider } from "../PaymentSelection/PaymentSelectionContext";
import { PromptSkinContext } from "../Prompt/PromptSkin";
import { PlayerNameplate } from "./PlayerNameplate";
import { SeatStatus, CardHit } from "./CyberpunkBoardV2";
import Scene from "./Scene";
import type { WorldCard } from "./layout";
import { boardSurfaceTextureUrl, resolveBoardSurface } from "./boardSurface";
import board from "./board.module.css";
import styles from "./ComponentCatalog.module.css";
import ProductionBoardPreview from "../../../../components/component-catalog/ProductionBoardPreview";

const emptyIds = new Set<string>();

function Specimen({
  title,
  source,
  children,
}: {
  title: string;
  source: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.specimen}>
      <header>
        <h3>{title}</h3>
        <code>{source}</code>
      </header>
      {children}
    </section>
  );
}

function Contents({ category, version }: { category: string; version: "v1" | "v2" }) {
  const engine = useEngine();
  const [knobs, setKnobs] = useState(defaultKnobs);
  const [cardId, setCardId] = useState("");
  const [lag, setLag] = useState(false);
  const [gear, setGear] = useState(true);
  const [projection, setProjection] = useState<BoardProjection | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [textures, setTextures] = useState<ReadonlySet<string>>(new Set());
  const [appearances, setAppearances] = useState<
    Readonly<Record<string, CardInteractionAppearance>>
  >({});
  const reportAppearance = useCallback(
    (id: string, appearance: CardInteractionAppearance) =>
      setAppearances((current) =>
        current[id] === appearance ? current : { ...current, [id]: appearance },
      ),
    [],
  );
  const textureReady = useCallback(
    (url: string) =>
      setTextures((current) => (current.has(url) ? current : new Set([...current, url]))),
    [],
  );
  const zones = useSideZones(engine.humanSide);
  const catalogCards = [
    ...zones.field.map((card) => ({ card, zone: "p-field" })),
    ...zones.hand.map((card) => ({ card, zone: "p-hand" })),
    ...zones.legendArea.map((card) => ({ card, zone: "p-legendArea" })),
    ...zones.trash.map((card) => ({ card, zone: "p-trash" })),
  ];
  const chosen = catalogCards.find((entry) => entry.card.cardId === cardId);
  const [inspector, setInspector] = useState<"trash" | "resources" | null>(null);
  const resourceCards = Math.max(zones.eddieCardCount, zones.eddies + zones.spentEddies);
  const [artError, setArtError] = useState(false);
  const show = (name: string) => category === "All components" || category === name;
  const worldCards = useMemo<WorldCard[]>(
    () =>
      (chosen ? [chosen.card] : zones.field.slice(0, 4)).map((card, index) => ({
        card: {
          ...card,
          spent: knobs.rested || card.spent,
          faceDown: knobs.hidden,
          hasLag: lag,
          effectivePower: card.power == null ? card.effectivePower : card.power + knobs.bonus,
          attachedGear: gear ? card.attachedGear : [],
        },
        side: engine.humanSide,
        rival: false,
        zone: "p-field",
        lane: "field",
        rect: [180 + index * 310, 260, 230, 322],
        angle: knobs.rested || card.spent ? 45 : 0,
        stackIndex: index,
        zoneIndex: index,
        hidden: knobs.hidden,
        peeked: false,
        url: knobs.hidden ? CARD_BACK : (card.imageUrl ?? ""),
      })),
    [
      zones.field,
      engine.humanSide,
      knobs.rested,
      knobs.hidden,
      lag,
      gear,
      chosen?.card,
      knobs.bonus,
    ],
  );
  return (
    <div
      className={`${version === "v2" ? board.root : ""} ${styles.root}`}
      data-testid="cyberpunk-production-catalog"
    >
      <div className={styles.intro}>
        <strong>Cyberpunk {version.toUpperCase()} · production components</strong>
        <p>
          Live components from the real combat fixture. Card controls affect this preview. The scene
          uses the same card renderer and interaction layer as the board.
        </p>
        <a
          href={buildMountedHref(
            `/cyberpunk/simulator/tests/retailCombatGigBench?ui=${version}&ai=off`,
          )}
          target="_blank"
          rel="noreferrer"
        >
          Open the complete {version.toUpperCase()} board ↗
        </a>
      </div>
      {show("Cards") && (
        <>
          <CardKnobControls
            value={knobs}
            onChange={setKnobs}
            supported={["rested", "hidden", "bonus"]}
          />
          <label className={styles.options}>
            Card / type
            <select value={cardId} onChange={(e) => setCardId(e.target.value)}>
              <option value="">Field card gallery</option>
              {catalogCards.map(({ card, zone }) => (
                <option key={card.cardId} value={card.cardId}>
                  {card.name} · {card.cardType} · {zone}
                </option>
              ))}
            </select>
          </label>
          <div className={styles.options}>
            <label>
              <input type="checkbox" checked={lag} onChange={(e) => setLag(e.target.checked)} /> Lag
            </label>
            <label>
              <input type="checkbox" checked={gear} onChange={(e) => setGear(e.target.checked)} />{" "}
              Attached Gear
            </label>
          </div>
          {version === "v2" && (
            <Specimen
              title="Physical field cards and attached Gear"
              source="BoardV2/Scene.tsx · CardMesh"
            >
              <div className={styles.scene}>
                <Suspense fallback={<p>Loading card artwork…</p>}>
                  <Scene
                    fallbackMessage="3D is unavailable. Select V1 above or use the live card controls below."
                    cards={worldCards}
                    cardAppearances={appearances}
                    hovered={hovered}
                    reduced={false}
                    motion={null}
                    surfaceSrc={boardSurfaceTextureUrl(resolveBoardSurface("default"))}
                    onReady={textureReady}
                    onProjection={setProjection}
                    onContextLost={() => setArtError(true)}
                    onArtworkError={() => setArtError(true)}
                  />
                </Suspense>
                <div
                  className={board.projected}
                  style={
                    {
                      transform: projection?.transform,
                      "--hud-scale": projection?.hudScale ?? 1,
                    } as CSSProperties
                  }
                >
                  {worldCards.map((placed) => (
                    <CardHit
                      key={placed.card.cardId}
                      placed={placed}
                      ready={!artError && textures.has(placed.url)}
                      hovered={hovered === placed.card.cardId}
                      onHover={setHovered}
                      onInteractionAppearanceChange={reportAppearance}
                    />
                  ))}
                </div>
              </div>
              {artError && (
                <p role="alert">
                  Some 3D artwork could not load. The card controls below remain available.
                </p>
              )}
            </Specimen>
          )}
          <Specimen
            title="Card controls, inspection, and hidden cards"
            source="GameBoard/Card.tsx · CardImage.tsx"
          >
            <div className={styles.cardRow}>
              {(chosen ? [chosen.card] : catalogCards.slice(0, 6).map((entry) => entry.card)).map(
                (card) => (
                  <div key={card.cardId} className={styles.card}>
                    <Card
                      {...card}
                      name={card.name}
                      side={engine.humanSide}
                      zone={
                        chosen?.zone ??
                        catalogCards.find((entry) => entry.card.cardId === card.cardId)?.zone
                      }
                      tapped={knobs.rested || card.spent}
                      faceDown={knobs.hidden}
                      hasLag={lag}
                      effectivePower={
                        card.power == null ? card.effectivePower : card.power + knobs.bonus
                      }
                      gear={gear ? card.attachedGear : []}
                    />
                  </div>
                ),
              )}
              <div className={styles.card}>
                <CardImage faceDown alt="Hidden card" disablePreview />
              </div>
            </div>
          </Specimen>
        </>
      )}
      {show("Dice") && (
        <Specimen
          title="Fixer dice and rolled Gig faces"
          source="GameBoard/DieDisplay.tsx · player dice preference"
        >
          <div className={styles.dice}>
            {(["d4", "d6", "d8", "d10", "d12", "d20"] as const).map((dieType) => (
              <div key={dieType}>
                <DieDisplay dieType={dieType} label={dieType.toUpperCase()} size="sm" />
                <span className={styles.caption}>{dieType} · reserve</span>
              </div>
            ))}
          </div>
          <div className={styles.dice}>
            {zones.gigArea.map((die) => (
              <div key={die.id}>
                <DieDisplay
                  dieType={die.dieType}
                  faceValue={die.faceValue}
                  label={die.dieType}
                  side="friendly"
                  size="md"
                />
                <span className={styles.caption}>
                  {die.dieType} · {die.faceValue}
                </span>
              </div>
            ))}
          </div>
        </Specimen>
      )}
      <div
        className={`${version === "v2" ? board.table : ""} ${styles.table}`}
        data-human-side={engine.humanSide}
      >
        {show("Counters") && (
          <Specimen
            title="Street Cred, Eddies, and player identity"
            source={
              version === "v2"
                ? "BoardV2/SeatStatus · PlayerNameplate"
                : "GameBoard/CenterRow · Gig and Street Cred counters"
            }
          >
            {version === "v1" ? (
              <CenterRow gigsOnly />
            ) : (
              <div className={styles.counters}>
                <SeatStatus
                  rival={false}
                  side={engine.humanSide}
                  zones={zones}
                  sales={[]}
                  movingIds={emptyIds}
                  onResources={() => setInspector("resources")}
                />
              </div>
            )}
            {version === "v2" && (
              <div className={styles.identity}>
                <PlayerNameplate playerId="catalog-player" rival={false} turn priority />
                <PlayerNameplate playerId="catalog-rival" rival turn={false} priority={false} />
              </div>
            )}
          </Specimen>
        )}
        {show("Zones") && (
          <Specimen title="Deck and Trash piles" source="GameBoard/DeckZone.tsx · TrashZone.tsx">
            <div className={`${version === "v2" ? board.localPiles : ""} ${styles.piles}`}>
              <DeckZone side={engine.humanSide} count={zones.deckCount} />
              <TrashZone
                side={engine.humanSide}
                count={zones.trashCount}
                cards={zones.trash}
                topCard={zones.trashTop ?? undefined}
                onOpen={() => setInspector("trash")}
              />
            </div>
          </Specimen>
        )}
        {show("Controls") && (
          <Specimen
            title="Clock console and primary action"
            source={`GameBoard/ClockDisplay · PassTurnControl${version === "v2" ? " + V2 skin" : ""}`}
          >
            <div className={styles.controls}>
              <div className={`${version === "v2" ? board.clock : ""} ${styles.clock}`}>
                <ClockDisplay compact combatSteps overtimeBand />
              </div>
              <div className={`${version === "v2" ? board.pass : ""} ${styles.pass}`}>
                <PassTurnControl docked actionsOnly />
              </div>
            </div>
          </Specimen>
        )}
      </div>
      <Modal
        opened={inspector !== null}
        onClose={() => setInspector(null)}
        title={inspector === "trash" ? "Your Trash" : "Your Eddies"}
        classNames={{ content: board.modal, header: board.modalHeader }}
        size="lg"
      >
        {inspector === "trash" ? (
          <div className={board.trashCards}>
            {zones.trash.map((card) => (
              <div key={card.cardId}>
                <Card
                  {...card}
                  side={engine.humanSide}
                  zone="p-trash"
                  tapped={card.spent}
                  gear={card.attachedGear}
                />
              </div>
            ))}
          </div>
        ) : (
          <EddiesZone
            side={engine.humanSide}
            cards={zones.eddieCards}
            count={zones.eddies}
            cardCount={resourceCards}
            spentCardCount={zones.spentEddies}
            availableCount={zones.eddies + zones.legendArea.filter((card) => !card.spent).length}
            totalCount={resourceCards + zones.legendArea.length}
            soldThisTurn={zones.soldThisTurn}
          />
        )}
      </Modal>
      <p className={styles.status} role="status" aria-label="Production preview result">
        Hover a card to inspect its full artwork. Pass advances this local fixture.
      </p>
      {category === "Production board" && (
        <ProductionBoardPreview
          game={`Cyberpunk ${version.toUpperCase()}`}
          href={`/cyberpunk/simulator/tests/retailCombatGigBench?ui=${version}&ai=off`}
        />
      )}
    </div>
  );
}

export default function CyberpunkComponentCatalog({ category }: { category: string }) {
  const [version, setVersion] = useState<"v1" | "v2">(() =>
    new URLSearchParams(window.location.search).get("version") === "v1" ? "v1" : "v2",
  );
  const [revision, setRevision] = useState(0);
  const commandGate = useMemo(() => createSimulatorExternalCommandGate(), []);
  return (
    <>
      <label className={styles.version}>
        Cyberpunk UI version
        <select
          value={version}
          onChange={(event) => {
            const next = event.target.value === "v1" ? "v1" : "v2";
            setVersion(next);
            const url = new URL(window.location.href);
            url.searchParams.set("version", next);
            window.history.replaceState({}, "", url);
          }}
        >
          <option value="v1">V1 · classic board</option>
          <option value="v2">V2 · physical tabletop</option>
        </select>
      </label>
      <Button variant="subtle" onClick={() => setRevision((value) => value + 1)}>
        Reset local fixture
      </Button>
      <CyberpunkSimulatorProviders>
        <EngineProvider
          key={revision}
          initialScenario="retailCombatGigBench"
          initialAi={{ player: null, opponent: null }}
          initialAiMode="step"
          animationCommandGate={commandGate}
        >
          <GameClockProvider>
            <PaymentSelectionProvider>
              <GameStateProvider>
                <AttackSelectionProvider>
                  <MoveSelectionProvider>
                    <DragDropProvider>
                      <PromptSkinContext.Provider value={version}>
                        <Contents key={version} category={category} version={version} />
                      </PromptSkinContext.Provider>
                    </DragDropProvider>
                  </MoveSelectionProvider>
                </AttackSelectionProvider>
              </GameStateProvider>
            </PaymentSelectionProvider>
          </GameClockProvider>
        </EngineProvider>
      </CyberpunkSimulatorProviders>
    </>
  );
}
