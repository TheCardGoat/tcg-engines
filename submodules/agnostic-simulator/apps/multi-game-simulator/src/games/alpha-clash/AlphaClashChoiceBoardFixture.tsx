import { useCallback, useEffect, useMemo, useState } from "react";
import { getPrintedCard as getCard } from "@tcg/alpha-clash-cards";
import {
  ChoiceDragProvider,
  ChoiceDraggable,
  ChoiceDropSlot,
  ChoiceValueControl,
  choiceProblems,
  removeChoice,
  type ChoiceAssignments,
} from "@tcg/simulator-presentation/choice-drag";
import { ArenaScene, type CardAnchor } from "./components/Arena3D/Scene";
import { arenaLayout } from "./components/Arena3D/layout";
import { arenaZones } from "./components/Arena3D/zones";
import { cardArtwork } from "./components/Arena3D/card-artwork";
import {
  buildBoardChoice,
  choiceBoard,
  variants,
  type BoardChoiceCase,
} from "./choice-board-fixtures";
import type { LiveBoardCard } from "./components/board-types";
import "./choice-board-fixture.css";
const noop = () => {};
export default function AlphaClashChoiceBoardFixture({ kind }: { kind: BoardChoiceCase }) {
  const [variant, setVariant] = useState<string>(variants[kind][0]);
  const [generation, setGeneration] = useState(0);
  return (
    <main className="choice-lab">
      <header>
        <strong>REAL BOARD · CHOICE QA</strong>
        <label>
          Variant{" "}
          <select value={variant} onChange={(e) => setVariant(e.target.value)}>
            {variants[kind].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <button onClick={() => setGeneration((n) => n + 1)}>Reset fixture</button>
        <small>Local presentation test · no engine command</small>
      </header>
      <Case key={`${kind}:${variant}:${generation}`} kind={kind} variant={variant} />
    </main>
  );
}
function Case({ kind, variant }: { kind: BoardChoiceCase; variant: string }) {
  const [board, setBoard] = useState(() => {
    const board = choiceBoard();
    const source = getCard(buildBoardChoice(kind, variant, board).sourceId);
    if (source.cardType !== "contender")
      return {
        ...board,
        cards: [
          ...board.cards,
          {
            instanceId: "acting-card",
            definitionId: source.id,
            imageUrl: `https://tcgplayer-cdn.tcgplayer.com/product/${source.printings[0]?.productId}_400w.jpg`,
            name: source.name,
            zone:
              kind === "costs" || kind === "resources"
                ? "hand"
                : source.cardType === "clashground"
                  ? "clashground"
                  : source.cardType === "accessory"
                    ? "accessory"
                    : source.cardType === "clash"
                      ? "clash"
                      : "hand",
            controller: "player-one",
            ready: true,
            faceDown: false,
            clashDamage: 0,
            phaseDamage: 0,
          },
        ],
      };
    return board;
  });
  const [initialBoard] = useState(board);
  const initial = useMemo(() => buildBoardChoice(kind, variant, board), []);
  const [value, setValue] = useState<ChoiceAssignments>(initial.initial ?? {});
  const route = value.route?.[0] ?? value.branch?.[0];
  const fixture = useMemo(
    () => buildBoardChoice(kind, variant, initialBoard, route),
    [kind, variant, initialBoard, route],
  );
  const [amount, setAmount] = useState(0);
  const [query, setQuery] = useState("");
  const [locked, setLocked] = useState(false);
  const [done, setDone] = useState(false);
  // Keep the server and first client render equal; browser preferences load after hydration.
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  const [inspect, setInspect] = useState<LiveBoardCard | null>(null);
  const [anchors, setAnchors] = useState<CardAnchor[]>([]);
  const [counters, setCounters] = useState<Record<string, number>>({});
  const [events, setEvents] = useState<string[]>([]);
  const [failure, setFailure] = useState(false);
  const [assets, setAssets] = useState(0);
  const selected = new Set([
    ...Object.values(value).flat(),
    ...Object.entries(value)
      .filter(([, ids]) => ids.length > 0)
      .map(([id]) => id),
  ]);
  const cards = useMemo(
    () => [
      ...arenaLayout(board, "player-one", false, 0, 1000),
      ...board.cards
        .filter((card) => card.zone === "oblivion" && card.controller === "player-one")
        .map((card, index) => ({
          card,
          x: 805,
          y: -300,
          z: 18 - index * 0.3,
          height: 72,
          angle: 0,
          hand: false,
        })),
    ],
    [board],
  );
  const zones = useMemo(() => arenaZones(board, "player-one", false, 1000), [board]);
  const slots = fixture.slots;
  const problems = choiceProblems(slots, value);
  const count = Object.values(value).flat().length;
  if (fixture.requiredTotal !== undefined && count !== fixture.requiredTotal)
    problems.push(`${fixture.requiredTotal - count} selections remaining.`);
  const tokens = fixture.tokens.filter((t) => t.label.toLowerCase().includes(query.toLowerCase()));
  const update = (next: ChoiceAssignments) => {
    if (locked || done) return;
    if (next.route?.[0] !== value.route?.[0]) next = { route: next.route ?? [] };
    if (next.branch?.[0] !== value.branch?.[0]) next = { branch: next.branch ?? [] };
    setValue(next);
    if (kind === "inspect" && variant !== "Hand order")
      setInspect(board.cards.find((c) => c.instanceId === next.inspection?.[0]) ?? null);
  };
  const commit = () => {
    if (locked || done || problems.length) return;
    const ids = new Set(Object.values(value).flat());
    setBoard((current) => {
      let next = current.cards.map((card) => {
        if (
          (kind === "resources" || kind === "costs") &&
          [...ids].some((id) => `resource-${id.split("-").at(-1)}` === card.instanceId)
        )
          return { ...card, ready: false };
        if (kind === "destination" && ids.has(card.instanceId)) {
          const zone =
            variant === "Discard" || variant === "Send"
              ? "oblivion"
              : variant === "Banish"
                ? "banish"
                : variant === "Return"
                  ? "hand"
                  : card.zone;
          return { ...card, zone };
        }
        if (kind === "costs" && route !== "normal" && value.payment?.includes(card.instanceId))
          return { ...card, zone: "oblivion" };
        if (kind === "search" && ids.has(card.instanceId)) return { ...card, zone: "hand" };
        if (
          kind === "optional" &&
          route === "Use" &&
          (variant === "Restore" || variant === "Wrath") &&
          value.followup?.includes(card.instanceId)
        )
          return { ...card, zone: "deck" };
        if (
          kind === "optional" &&
          variant === "Wrath" &&
          value[card.instanceId]?.includes("Target")
        )
          return { ...card, phaseDamage: card.phaseDamage + 3 };
        if (kind === "optional" && variant === "Void" && card.instanceId === "look-1")
          return { ...card, zone: "hand" };
        if (kind === "allocation" && variant === "Barrage")
          return { ...card, phaseDamage: card.phaseDamage + (value[card.instanceId]?.length ?? 0) };
        return card;
      });
      if (kind === "inspect" && variant === "Hand order") {
        const order = value.inspection ?? [];
        next = [
          ...next.filter((c) => !order.includes(c.instanceId)),
          ...order.flatMap((id) => next.filter((c) => c.instanceId === id)),
        ];
      }
      return {
        ...current,
        cards: next,
        players: {
          ...current.players,
          "player-one": {
            ...current.players["player-one"],
            health:
              current.players["player-one"].health -
              (kind === "number" && variant === "Health" ? amount : 0),
            handSize: next.filter((c) => c.zone === "hand" && c.controller === "player-one").length,
            deckSize:
              current.players["player-one"].deckSize +
              next.filter((c) => c.zone === "deck" && c.controller === "player-one").length -
              current.cards.filter((c) => c.zone === "deck" && c.controller === "player-one")
                .length,
          },
        },
      };
    });
    if (kind === "allocation" && variant === "Counters")
      setCounters(Object.fromEntries(Object.entries(value).map(([id, ids]) => [id, ids.length])));
    if (kind === "optional" && variant === "Temper" && route === "Use") setCounters({ weapon: 1 });
    setDone(true);
    setEvents((previous) => [
      `${fixture.title}: ${fixture.numeric ? amount : JSON.stringify(value)}${variant === "Reveal" ? " · revealed; zone preserved" : ""}`,
      ...previous,
    ]);
  };
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") setInspect(null);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  const source = getCard(fixture.sourceId);
  const onAssets = useCallback(
    (status: { failed: readonly unknown[] }) => setAssets(status.failed.length),
    [],
  );
  return (
    <ChoiceDragProvider
      tokens={fixture.tokens}
      slots={slots}
      value={value}
      onChange={update}
      locked={locked || done}
    >
      <div className="choice-lab__layout">
        <section className="choice-lab__board" aria-label="Alpha Clash board">
          <ArenaScene
            board={board}
            viewer="player-one"
            cards={cards}
            zones={zones}
            compact={false}
            highlightedZone={null}
            inspectedCard={inspect}
            hovered={null}
            selected={inspect ? new Set() : selected}
            selectable={inspect ? null : new Set(fixture.tokens.map((t) => t.id))}
            reducedMotion={reduced}
            onAnchors={setAnchors}
            onZoneAnchors={noop}
            onTurnPosition={noop}
            onFailure={() => setFailure(true)}
            onAssets={onAssets}
            retryKey={0}
          />
          {!inspect &&
            anchors.map((anchor) => {
              const style = {
                position: "absolute" as const,
                left: anchor.left,
                top: anchor.top,
                width: anchor.width,
                height: anchor.height,
              };
              const token = fixture.tokens.find(
                (t) =>
                  t.id === anchor.id ||
                  (anchor.id.startsWith("resource-") &&
                    t.id.split("-").at(-1) === anchor.id.split("-").at(-1) &&
                    /^(white|green|red|black|blue)-/.test(t.id)),
              );
              const slot = slots.find((s) => s.id === anchor.id);
              if (slot)
                return (
                  <ChoiceDropSlot
                    key={anchor.id}
                    id={slot.id}
                    className="choice-lab__hit"
                    style={style}
                  >
                    <span className="choice-lab__badge">
                      {kind === "allocation"
                        ? `${value[slot.id]?.length ?? 0} ${variant === "Barrage" ? "damage" : "counters"}`
                        : value[slot.id]?.join(", ") || "Target"}
                    </span>
                  </ChoiceDropSlot>
                );
              if (token)
                return (
                  <ChoiceDraggable
                    key={anchor.id}
                    id={token.id}
                    className="choice-lab__hit"
                    style={style}
                  >
                    <span
                      className={
                        anchor.id.startsWith("resource-") ? "choice-lab__badge" : "choice-sr"
                      }
                    >
                      {token.label}
                    </span>
                  </ChoiceDraggable>
                );
              return null;
            })}
          {anchors
            .filter((anchor) => counters[anchor.id])
            .map((anchor) => (
              <span
                key={anchor.id}
                className="choice-lab__counter"
                style={{ position: "absolute", left: anchor.left, top: anchor.top }}
              >
                {counters[anchor.id]} counter
              </span>
            ))}
          {inspect && (
            <button className="choice-lab__return" onClick={() => setInspect(null)}>
              Return to board · Esc
            </button>
          )}
          <div className="choice-lab__status" role="status">
            {failure
              ? "WebGL failed"
              : assets
                ? `${assets} image assets failed`
                : done
                  ? "Preview committed"
                  : locked
                    ? "Input paused"
                    : "Draft · board changes on confirm"}
          </div>
        </section>
        <aside className="choice-lab__panel">
          <h1>{fixture.title}</h1>
          <p>{fixture.instruction}</p>
          <details>
            <summary>Source · {source.name}</summary>
            <img
              className="choice-lab__source"
              src={cardArtwork({
                instanceId: "source",
                imageUrl: `https://tcgplayer-cdn.tcgplayer.com/product/${source.printings[0]?.productId}_400w.jpg`,
                definitionId: source.id,
                name: source.name,
                zone: "hand",
                controller: "player-one",
                ready: true,
                faceDown: false,
                clashDamage: 0,
                phaseDamage: 0,
              })}
              alt={source.name}
            />
            <p>{source.text}</p>
            <p>{fixture.note}</p>
          </details>
          <div className="choice-lab__switches">
            <label>
              <input
                type="checkbox"
                checked={locked}
                onChange={(e) => setLocked(e.target.checked)}
              />{" "}
              Pause input
            </label>
            <label>
              <input
                type="checkbox"
                checked={reduced}
                onChange={(e) => setReduced(e.target.checked)}
              />{" "}
              Reduce motion
            </label>
          </div>
          {fixture.numeric && (
            <ChoiceValueControl
              label={fixture.numeric.label}
              value={amount}
              min={fixture.numeric.min}
              max={fixture.numeric.max}
              disabled={locked || done}
              onChange={setAmount}
            />
          )}
          {fixture.tokens.length > 5 && (
            <input
              aria-label="Search permitted choices"
              placeholder="Search permitted choices…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          )}
          <div className="choice-lab__tokens">
            {tokens.map((token) => (
              <ChoiceDraggable key={token.id} id={token.id} />
            ))}
            {!tokens.length && !fixture.numeric && <p>No permitted cards match.</p>}
          </div>
          <div className="choice-lab__slots">
            {slots.map((slot) => (
              <section key={slot.id}>
                <ChoiceDropSlot id={slot.id} />
                <ol>
                  {(value[slot.id] ?? []).map((id, index) => (
                    <li key={id}>
                      <div className="choice-lab__selection">
                        <ChoiceDraggable id={id}>
                          {slot.ordered ? `${index + 1}. ` : ""}
                          {fixture.tokens.find((t) => t.id === id)?.label}
                        </ChoiceDraggable>
                        {slot.ordered && (
                          <ChoiceDropSlot id={slot.id} before={id}>
                            Insert before {index + 1}
                          </ChoiceDropSlot>
                        )}
                        <button
                          disabled={locked || done}
                          aria-label={`Remove ${fixture.tokens.find((t) => t.id === id)?.label}`}
                          onClick={() => update(removeChoice(value, id))}
                        >
                          ×
                        </button>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
          <p role="status">
            {done
              ? "Confirmed. Reset to repeat."
              : problems.length
                ? problems.join(" ")
                : "Ready to confirm."}
          </p>
          <footer>
            <button disabled={locked || done || problems.length > 0} onClick={commit}>
              Confirm preview
            </button>
            <button
              disabled={locked || done}
              onClick={() => {
                setValue(initial.initial ?? {});
                setInspect(null);
                setAmount(0);
              }}
            >
              Clear draft
            </button>
          </footer>
          <details open={events.length > 0}>
            <summary>Result log</summary>
            <ol>
              {events.map((event, i) => (
                <li key={i}>{event}</li>
              ))}
            </ol>
          </details>
        </aside>
      </div>
    </ChoiceDragProvider>
  );
}
