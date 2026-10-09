import { useState } from "react";
import {
  Button,
  Checkbox,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
} from "@dnd-kit/core";
import type { Side } from "../../engine";
import {
  creatorCards,
  emptySetup,
  setupSchema,
  zoneLabels,
  type CreatorCard,
  type CreatorSetup,
  type CreatorZone,
} from "./setup";
import { placeCard, type CardSource, type CardDestination, type CardLocation } from "./placement";
import { CreatorHelp } from "./CreatorHelp";
import classes from "./creator.module.css";

const sides = ["opponent", "player"] as const;
const dice = ["d4", "d6", "d8", "d10", "d12", "d20"] as const;
const cardById = new Map(creatorCards.map((card) => [card.id, card]));
const seatName = (side: Side) => (side === "player" ? "Player 1" : "Player 2");
const collisions: CollisionDetection = (args) => {
  const hits = pointerWithin(args);
  return (hits.length ? hits : rectIntersection(args)).sort(
    (a, b) => Number(String(b.id).startsWith("host:")) - Number(String(a.id).startsWith("host:")),
  );
};

export function SetupEditor({
  setup,
  onChange,
  onStart,
  error,
  onCancel,
}: {
  setup: CreatorSetup;
  onChange: (setup: CreatorSetup) => void;
  onStart: () => void;
  error: string | null;
  onCancel?: () => void;
}) {
  const [side, setSide] = useState<Side>("player");
  const [tab, setTab] = useState("cards");
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [cost, setCost] = useState<number | string>("");
  const [limit, setLimit] = useState(36);
  const [selected, setSelected] = useState<CardSource | null>(null);
  const [dragging, setDragging] = useState<CardSource | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [json, setJson] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );
  const seat = setup[side];
  const updateSeat = (patch: Partial<typeof seat>) =>
    onChange({ ...setup, [side]: { ...seat, ...patch } });
  const place = (source: CardSource | null, target: CardDestination) => {
    if (!source) {
      setNotice("Choose a card on the left, then choose a zone.");
      return;
    }
    try {
      onChange(placeCard(setup, source, target));
      setNotice(
        `${cardById.get(source.id)?.displayName} ${target.hostIndex !== undefined ? "attached" : "placed"} · ${seatName(target.side)}`,
      );
      if (source.location) setSelected(null);
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : "Could not place card.");
    }
  };
  const location = selected?.location;
  const inspected = location ? setup[location.side][location.zone][location.index] : undefined;
  const updateInspected = (patch: Partial<CreatorCard>) => {
    if (!location || !inspected) return;
    onChange({
      ...setup,
      [location.side]: {
        ...setup[location.side],
        [location.zone]: setup[location.side][location.zone].map((card, index) =>
          index === location.index ? { ...card, ...patch } : card,
        ),
      },
    });
  };
  const filtered = creatorCards.filter(
    (card) =>
      (!type || card.type === type) &&
      (!color || card.color === color) &&
      (cost === "" || card.cost === Number(cost)) &&
      `${card.displayName} ${card.slug}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisions}
      onDragStart={({ active }) => {
        const source: CardSource = active.data.current?.source;
        if (source) {
          setDragging(source);
          setSelected(source);
        }
      }}
      onDragCancel={() => setDragging(null)}
      onDragEnd={({ active, over }) => {
        const source: CardSource | undefined = active.data.current?.source;
        const target: CardDestination | undefined = over?.data.current?.target;
        if (source && target) place(source, target);
        setDragging(null);
      }}
    >
      <main className={classes.workbench} data-game="cyberpunk">
        <header className={classes.editorHeader}>
          <div>
            <Text size="xs" c="yellow" fw={700}>
              CYBERPUNK · CREATOR TABLE
            </Text>
            <h1>Set the scene</h1>
          </div>
          <Group gap="xs">
            {onCancel && (
              <Button variant="subtle" onClick={onCancel}>
                Cancel edits
              </Button>
            )}
            <Button color="yellow" c="black" onClick={onStart}>
              Play table · bot off
            </Button>
          </Group>
        </header>
        <div className={classes.workspace}>
          <aside className={classes.sideboard} aria-label="Scene tools">
            <CreatorHelp />
            <Group grow gap="xs">
              {(["cards", "eddies", "gigs"] as const).map((value) => (
                <Button
                  key={value}
                  variant={tab === value ? "filled" : "light"}
                  color="yellow"
                  c={tab === value ? "black" : undefined}
                  aria-pressed={tab === value}
                  onClick={() => setTab(value)}
                >
                  {value[0].toUpperCase() + value.slice(1)}
                </Button>
              ))}
            </Group>
            {tab === "cards" ? (
              <>
                <Text size="sm" className={classes.hint}>
                  Drag cards into either player's zones. Drop gear onto a Unit or Legend. Or select
                  a card, then click a zone.
                </Text>
                <TextInput
                  label="Find cards"
                  placeholder="Search card name"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.currentTarget.value);
                    setLimit(36);
                  }}
                />
                <Group grow gap="xs">
                  <Select
                    label="Type"
                    placeholder="All types"
                    clearable
                    value={type}
                    data={["unit", "legend", "gear", "program"]}
                    onChange={(value) => {
                      setType(value);
                      setLimit(36);
                    }}
                  />
                  <Select
                    label="Color"
                    placeholder="All colors"
                    clearable
                    value={color}
                    data={[...new Set(creatorCards.map((card) => card.color))]}
                    onChange={(value) => {
                      setColor(value);
                      setLimit(36);
                    }}
                  />
                </Group>
                <Group justify="space-between">
                  <Text size="xs" c="dimmed">
                    {filtered.length} cards
                  </Text>
                  <NumberInput
                    aria-label="Filter by cost"
                    placeholder="Any cost"
                    value={cost}
                    min={0}
                    max={99}
                    allowDecimal={false}
                    w={100}
                    onChange={(value) => {
                      setCost(value);
                      setLimit(36);
                    }}
                  />
                </Group>
                {selected && (
                  <div className={classes.selection}>
                    <Text size="sm">Selected: {cardById.get(selected.id)?.displayName}</Text>
                    <Button size="compact-xs" variant="subtle" onClick={() => setSelected(null)}>
                      Clear selection
                    </Button>
                  </div>
                )}
                {inspected && location && (
                  <div className={classes.inspector}>
                    <Text fw={600} size="sm">
                      {seatName(location.side)} · {zoneLabels[location.zone]}
                    </Text>
                    <Group>
                      <Checkbox
                        label="Spent"
                        checked={inspected.spent}
                        onChange={(e) => updateInspected({ spent: e.currentTarget.checked })}
                      />
                      <Checkbox
                        label="Face down"
                        checked={inspected.faceDown}
                        onChange={(e) => updateInspected({ faceDown: e.currentTarget.checked })}
                      />
                    </Group>
                    {inspected.gearIds.map((id, index) => (
                      <Group key={`${id}-${index}`} justify="space-between">
                        <Text size="xs">{cardById.get(id)?.displayName}</Text>
                        <Button
                          size="compact-xs"
                          variant="subtle"
                          onClick={() =>
                            updateInspected({
                              gearIds: inspected.gearIds.filter((_, i) => i !== index),
                            })
                          }
                        >
                          Detach {index + 1}
                        </Button>
                      </Group>
                    ))}
                    <Group>
                      {location.zone === "deck" && location.index > 0 && (
                        <Button
                          size="xs"
                          variant="light"
                          onClick={() => {
                            const cards = [...setup[location.side].deck];
                            const [card] = cards.splice(location.index, 1);
                            cards.unshift(card);
                            onChange({
                              ...setup,
                              [location.side]: { ...setup[location.side], deck: cards },
                            });
                            setSelected({ id: inspected.id, location: { ...location, index: 0 } });
                          }}
                        >
                          Move to deck top
                        </Button>
                      )}
                      <Button
                        size="xs"
                        color="red"
                        variant="light"
                        onClick={() => {
                          onChange({
                            ...setup,
                            [location.side]: {
                              ...setup[location.side],
                              [location.zone]: setup[location.side][location.zone].filter(
                                (_, i) => i !== location.index,
                              ),
                            },
                          });
                          setSelected(null);
                        }}
                      >
                        Remove card
                      </Button>
                    </Group>
                  </div>
                )}
                <div className={classes.catalog} aria-label="Card catalog">
                  {filtered.slice(0, limit).map((card) => (
                    <EditorCard
                      key={card.id}
                      source={{ id: card.id }}
                      selected={selected?.id === card.id && !selected.location}
                      onSelect={() => setSelected({ id: card.id })}
                    />
                  ))}
                </div>
                {!filtered.length && <Text size="sm">No cards match these filters.</Text>}
                {filtered.length > limit && (
                  <Button variant="light" onClick={() => setLimit(limit + 36)}>
                    Show more cards
                  </Button>
                )}
              </>
            ) : (
              <>
                <Group grow gap="xs">
                  {(["player", "opponent"] as const).map((value) => (
                    <Button
                      key={value}
                      variant={side === value ? "filled" : "light"}
                      onClick={() => setSide(value)}
                    >
                      {seatName(value)}
                    </Button>
                  ))}
                </Group>
                {tab === "eddies" ? (
                  <Stack>
                    <Text size="sm">Set available and spent Eddies. Both update on the board.</Text>
                    <NumberInput
                      label="Eddies"
                      min={0}
                      max={999}
                      allowDecimal={false}
                      value={seat.eddies}
                      onChange={(value) => updateSeat({ eddies: Number(value) || 0 })}
                    />
                    <NumberInput
                      label="Spent Eddies"
                      min={0}
                      max={999}
                      allowDecimal={false}
                      value={seat.spentEddies}
                      onChange={(value) => updateSeat({ spentEddies: Number(value) || 0 })}
                    />
                  </Stack>
                ) : (
                  <Stack>
                    <Text size="sm">
                      Add a Gig die, then set its face. Each player can use each die size once.
                    </Text>
                    <Group gap="xs">
                      {dice.map((dieType) => (
                        <Button
                          key={dieType}
                          size="xs"
                          variant="light"
                          disabled={seat.gigArea.some((gig) => gig.dieType === dieType)}
                          onClick={() =>
                            updateSeat({ gigArea: [...seat.gigArea, { dieType, faceValue: 1 }] })
                          }
                        >
                          + {dieType}
                        </Button>
                      ))}
                    </Group>
                    {seat.gigArea.map((gig, index) => (
                      <Group key={gig.dieType} align="end" wrap="nowrap">
                        <NumberInput
                          label={`${gig.dieType} face`}
                          min={1}
                          max={Number(gig.dieType.slice(1))}
                          allowDecimal={false}
                          value={gig.faceValue}
                          onChange={(value) =>
                            updateSeat({
                              gigArea: seat.gigArea.map((g, i) =>
                                i === index
                                  ? {
                                      ...g,
                                      faceValue: Math.max(
                                        1,
                                        Math.min(Number(g.dieType.slice(1)), Number(value) || 1),
                                      ),
                                    }
                                  : g,
                              ),
                            })
                          }
                        />
                        <Button
                          size="xs"
                          variant="subtle"
                          onClick={() =>
                            updateSeat({ gigArea: seat.gigArea.filter((_, i) => i !== index) })
                          }
                        >
                          Remove {gig.dieType}
                        </Button>
                      </Group>
                    ))}
                  </Stack>
                )}
              </>
            )}
            <details className={classes.settings}>
              <summary>Scene settings · save and load</summary>
              <Stack gap="sm" mt="sm">
                <TextInput
                  label="Scene name"
                  maxLength={100}
                  value={setup.name}
                  onChange={(e) => onChange({ ...setup, name: e.currentTarget.value })}
                />
                <Select
                  label="Starting player"
                  value={setup.activeSide}
                  allowDeselect={false}
                  data={[
                    { value: "player", label: "Player 1" },
                    { value: "opponent", label: "Player 2" },
                  ]}
                  onChange={(value) => {
                    if (value === "player" || value === "opponent")
                      onChange({ ...setup, activeSide: value });
                  }}
                />
                <Text size="xs">
                  Saved in this browser. Play table starts a new session from this scene.
                </Text>
                <Button
                  variant="light"
                  onClick={() => {
                    const url = URL.createObjectURL(
                      new Blob([JSON.stringify(setup, null, 2)], { type: "application/json" }),
                    );
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "cyberpunk-scene.json";
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Download scene
                </Button>
                <Textarea
                  label="Scene JSON"
                  placeholder="Paste a saved scene"
                  value={json}
                  onChange={(e) => setJson(e.currentTarget.value)}
                  minRows={3}
                />
                <Button
                  variant="light"
                  onClick={() => {
                    try {
                      onChange(setupSchema.parse(JSON.parse(json)));
                      setSelected(null);
                      setNotice("Scene loaded.");
                    } catch {
                      setNotice("Invalid scene. Check card IDs, zones, and values.");
                    }
                  }}
                >
                  Load scene
                </Button>
                <Button
                  color="red"
                  variant="subtle"
                  onClick={() => {
                    onChange(emptySetup());
                    setSelected(null);
                  }}
                >
                  Clear scene
                </Button>
              </Stack>
            </details>
          </aside>
          <section className={classes.preview} aria-label="Live board preview">
            <div className={classes.previewHeading}>
              <div>
                <Text size="xs" c="yellow">
                  LIVE BOARD PREVIEW
                </Text>
                <Text fw={600}>{setup.name || "Untitled scene"}</Text>
              </div>
              <Text size="xs" c="dimmed">
                Bot off · editing both players
              </Text>
            </div>
            {sides.map((side) => (
              <section
                className={`${classes.seat} ${side === "opponent" ? classes.opponent : ""}`}
                key={side}
                aria-label={`${seatName(side)} board`}
              >
                <div className={classes.seatHeader}>
                  <strong>{seatName(side)}</strong>
                  <button
                    className={classes.resource}
                    onClick={() => {
                      setSide(side);
                      setTab("eddies");
                    }}
                  >
                    €$ {setup[side].eddies} <small> / {setup[side].spentEddies} spent</small>
                  </button>
                  <button
                    className={classes.resource}
                    onClick={() => {
                      setSide(side);
                      setTab("gigs");
                    }}
                  >
                    Gigs{" "}
                    {setup[side].gigArea.length
                      ? setup[side].gigArea.map((g) => `${g.dieType}: ${g.faceValue}`).join(" · ")
                      : "—"}
                  </button>
                </div>
                <div className={classes.boardZones}>
                  {(["legendArea", "field", "hand", "deck", "trash"] as const).map((zone) => (
                    <BoardZone
                      key={zone}
                      side={side}
                      zone={zone}
                      setup={setup}
                      selected={selected}
                      onPlace={(target) => place(selected, target)}
                      onSelect={(source) => {
                        setSelected(source);
                        setTab("cards");
                      }}
                    />
                  ))}
                </div>
              </section>
            ))}
            <div className={classes.previewFooter}>
              <Text size="sm" role="status" aria-live="polite">
                {notice ?? "Drag a card onto a highlighted zone to build your scene."}
              </Text>
              {error && (
                <Text c="red" role="alert">
                  {error}
                </Text>
              )}
              {(!setup.player.deck.length || !setup.opponent.deck.length) && (
                <Text size="xs" c="dimmed">
                  Empty decks can cause a loss when a player draws. Add deck cards to play more
                  turns.
                </Text>
              )}
            </div>
          </section>
        </div>
      </main>
      <DragOverlay>
        {dragging && (
          <div className={classes.dragCard}>
            <img
              src={cardById.get(dragging.id)?.imageUrl}
              alt={cardById.get(dragging.id)?.displayName}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

function EditorCard({
  source,
  selected,
  onSelect,
  target,
  entry,
}: {
  source: CardSource;
  selected: boolean;
  onSelect: () => void;
  target?: CardDestination;
  entry?: CreatorCard;
}) {
  const card = cardById.get(source.id);
  const id = source.location
    ? `placed:${source.location.side}:${source.location.zone}:${source.location.index}`
    : `catalog:${source.id}`;
  const drag = useDraggable({ id, data: { source } });
  const drop = useDroppable({ id: `host:${id}`, data: { target }, disabled: !target });
  return (
    <div ref={drop.setNodeRef} className={`${classes.cardWrap} ${drop.isOver ? classes.over : ""}`}>
      <button
        ref={drag.setNodeRef}
        {...drag.listeners}
        {...drag.attributes}
        type="button"
        className={`${classes.card} ${selected ? classes.selected : ""}`}
        aria-label={`${source.location ? "Edit" : "Select"} ${card?.displayName}`}
        aria-pressed={selected}
        onClick={onSelect}
        style={{ opacity: drag.isDragging ? 0.35 : 1 }}
      >
        <img src={card?.imageUrl} alt="" loading="lazy" draggable={false} />
        <span>{card?.displayName}</span>
        {entry && (
          <small>
            {[
              entry.spent && "Spent",
              entry.faceDown && "Face down",
              entry.gearIds.length > 0 && `+${entry.gearIds.length} gear`,
            ]
              .filter(Boolean)
              .join(" · ")}
          </small>
        )}
      </button>
      {entry?.gearIds.map((id, index) => (
        <img
          className={classes.gear}
          key={`${id}-${index}`}
          src={cardById.get(id)?.imageUrl}
          alt={`Attached ${cardById.get(id)?.displayName}`}
          title={cardById.get(id)?.displayName}
          draggable={false}
        />
      ))}
    </div>
  );
}
function BoardZone({
  side,
  zone,
  setup,
  selected,
  onPlace,
  onSelect,
}: {
  side: Side;
  zone: CreatorZone;
  setup: CreatorSetup;
  selected: CardSource | null;
  onPlace: (target: CardDestination) => void;
  onSelect: (source: CardSource) => void;
}) {
  const target = { side, zone };
  const { setNodeRef, isOver } = useDroppable({ id: `zone:${side}:${zone}`, data: { target } });
  const selectedType = selected ? cardById.get(selected.id)?.type : undefined;
  const allowed =
    !selected ||
    (zone === "field"
      ? selectedType === "unit" || selectedType === "legend"
      : zone === "legendArea"
        ? selectedType === "legend"
        : true);
  return (
    <div
      ref={setNodeRef}
      className={`${classes.zone} ${classes[zone]} ${isOver ? classes.over : ""} ${allowed && selected ? classes.available : ""}`}
    >
      <button
        className={classes.zoneTitle}
        aria-label={`Place card in ${seatName(side)} ${zoneLabels[zone]}`}
        onClick={() => onPlace(target)}
      >
        {zoneLabels[zone]} <span>{setup[side][zone].length}</span>
      </button>
      <div className={classes.zoneCards}>
        {setup[side][zone].map((entry, index) => {
          const location: CardLocation = { side, zone, index };
          const host =
            zone === "field" || zone === "legendArea" ? { ...target, hostIndex: index } : undefined;
          return (
            <EditorCard
              key={`${entry.id}-${index}`}
              source={{ id: entry.id, location }}
              entry={entry}
              target={selectedType === "gear" ? host : undefined}
              selected={
                selected?.location?.side === side &&
                selected.location.zone === zone &&
                selected.location.index === index
              }
              onSelect={() => {
                if (selectedType === "gear" && host) onPlace(host);
                else onSelect({ id: entry.id, location });
              }}
            />
          );
        })}
        {!setup[side][zone].length && (
          <button
            className={classes.emptyZone}
            aria-label={`Add card to ${seatName(side)} ${zoneLabels[zone]}`}
            onClick={() => onPlace(target)}
          >
            {zone === "field"
              ? "Drop Units here"
              : zone === "legendArea"
                ? "Drop Legends here"
                : "Drop cards here"}
          </button>
        )}
      </div>
    </div>
  );
}
