import { CounterBadge } from "./AlphaClashCounterIconsPreview";
import { useState } from "react";
import { Modal, SegmentedControl, Tooltip } from "@mantine/core";
import { getCard } from "@tcg/alpha-clash-cards";
import { alphaClashCardImageUrl } from "../../games/alpha-clash/components/Arena3D/card-artwork";
import { arenaAssets } from "../../games/alpha-clash/components/Arena3D/assets";
import styles from "./alpha-clash-zone-overflow.module.css";

const definitions = ["ac-ac3-106", "ac-ac2-038", "ac-ac7-162"];
type PreviewCard = {
  id: string;
  definition: string;
  engaged: boolean;
  hidden: boolean;
  counters: number;
};
function artwork(card: PreviewCard) {
  return card.hidden ? arenaAssets.back : alphaClashCardImageUrl(card.definition);
}
function label(card: PreviewCard) {
  return card.hidden ? "Face-down accessory" : getCard(card.definition).name;
}
/** Presentation-only density study. Selection does not submit game commands. */
export function AlphaClashZoneOverflowPreview() {
  const [count, setCount] = useState("16");
  const [accessoryCount, setAccessoryCount] = useState("8");
  const [zone, setZone] = useState<"resources" | "accessories" | null>(null);
  const [paying, setPaying] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [inspect, setInspect] = useState<PreviewCard | null>(null);
  const resources: PreviewCard[] = Array.from({ length: Number(count) }, (_, i) => ({
    id: `resource-${i}`,
    definition: definitions[Math.floor(i / 4) % definitions.length],
    engaged: i < Math.floor(Number(count) / 4),
    hidden: false,
    counters: 0,
  }));
  const accessories: PreviewCard[] = Array.from({ length: Number(accessoryCount) }, (_, i) => ({
    id: `accessory-${i}`,
    definition: i % 2 ? "ac-ac7-128" : "ac-st2-010",
    engaged: false,
    hidden: i === 2,
    counters: i === 1 ? 3 : 0,
  }));
  const groups = resources.reduce<PreviewCard[][]>((result, card) => {
    const group = result.find(
      ([first]) => first.definition === card.definition && first.engaged === card.engaged,
    );
    if (group) group.push(card);
    else result.push([card]);
    return result;
  }, []);
  const ready = resources.filter((card) => !card.engaged).length;
  const open = (next: "resources" | "accessories") => {
    setZone(next);
    setPaying(false);
    setSelected([]);
  };
  const close = () => {
    setZone(null);
    setPaying(false);
    setSelected([]);
  };
  return (
    <section id="zone-overflow" className={styles.preview} aria-label="Crowded zone preview">
      <header>
        <div>
          <small>ALPHA CLASH · CATALOG STUDY</small>
          <h3>Room to play</h3>
          <p>Grouped resources. Individual accessories. Expand for precise selection.</p>
        </div>
      </header>
      <div className={styles.controls}>
        <label>
          Resources{" "}
          <SegmentedControl
            value={count}
            onChange={(value) => {
              setCount(value);
              setSelected([]);
            }}
            data={["4", "8", "16", "24"]}
          />
        </label>
        <label>
          Accessories{" "}
          <SegmentedControl
            value={accessoryCount}
            onChange={setAccessoryCount}
            data={["2", "4", "8", "12"]}
          />
        </label>
        <button
          onClick={() => {
            setPaying(true);
            setSelected([]);
            setZone("resources");
          }}
        >
          Preview payment
        </button>
      </div>
      <div className={styles.table} style={{ backgroundImage: `url(${arenaAssets.surface})` }}>
        <div className={styles.rails}>
          <section className={styles.zone} aria-label="Accessories">
            <div className={styles.accessories}>
              {accessories.slice(0, 3).map((card) => (
                <Tooltip
                  key={card.id}
                  label={`Collection: ${card.counters}`}
                  disabled={!card.counters}
                  withArrow
                  events={{ hover: true, focus: true, touch: true }}
                >
                  <button
                    className={styles.card}
                    aria-label={`Inspect ${label(card)}${card.counters ? `; Collection: ${card.counters}` : ""}`}
                    onClick={() => setInspect(card)}
                  >
                    <img src={artwork(card)} alt={label(card)} />
                    {card.counters > 0 && (
                      <span className={styles.counterBadge}>
                        <CounterBadge kind="Collection" count={card.counters} embedded />
                      </span>
                    )}
                  </button>
                </Tooltip>
              ))}
              {accessories.length > 3 && (
                <Tooltip
                  label={`View all ${accessories.length} accessories`}
                  withArrow
                  events={{ hover: true, focus: true, touch: true }}
                >
                  <button
                    className={styles.more}
                    aria-label={`View all ${accessories.length} accessories`}
                    onClick={() => open("accessories")}
                  >
                    +{accessories.length - 3}
                  </button>
                </Tooltip>
              )}
            </div>
          </section>
          <section className={styles.zone}>
            <Tooltip
              label={`Resources: ${ready} ready of ${resources.length}. Expand zone`}
              withArrow
            >
              <button
                className={styles.resourceCount}
                aria-label={`Expand resources: ${ready} ready of ${resources.length}`}
                onClick={() => open("resources")}
              >
                ⚡ {ready} / {resources.length}
              </button>
            </Tooltip>
            <div className={styles.groups}>
              {groups.map((group) => (
                <Tooltip
                  key={group[0].id}
                  label={`${label(group[0])} · ${group.length} ${group[0].engaged ? "engaged" : "ready"} resources`}
                  withArrow
                  events={{ hover: true, focus: true, touch: true }}
                >
                  <button
                    className={styles.stack}
                    data-engaged={group[0].engaged || undefined}
                    onClick={() => open("resources")}
                    aria-label={`${label(group[0])}, ${group.length} ${group[0].engaged ? "engaged" : "ready"} resources`}
                  >
                    {group.length > 1 && (
                      <img className={styles.back} src={artwork(group[0])} alt="" />
                    )}
                    <img src={artwork(group[0])} alt={label(group[0])} />
                    <b>×{group.length}</b>
                  </button>
                </Tooltip>
              ))}
            </div>
          </section>
        </div>
      </div>
      <p className={styles.note}>
        Presentation preview only. Each card keeps its own identity. No live board layout or game
        state is changed.
      </p>
      <Modal
        opened={zone !== null}
        closeButtonProps={{ "aria-label": "Close zone view" }}
        onClose={close}
        title={
          paying ? `Choose resources · ${selected.length} / 4 selected` : `Your ${zone ?? "zone"}`
        }
        size="xl"
        centered
      >
        <p>
          {paying
            ? "Select four ready resources. Engaged cards cannot be selected."
            : "Inspect individual cards, including copies in the same group."}
        </p>
        <div className={styles.tray}>
          {(zone === "resources" ? resources : accessories).map((card) => (
            <button
              key={card.id}
              className={styles.choice}
              disabled={paying && card.engaged}
              aria-pressed={paying ? selected.includes(card.id) : undefined}
              aria-label={`${paying ? "Select" : "Inspect"} ${label(card)} ${card.id}`}
              onClick={() => {
                if (!paying) {
                  setInspect(card);
                  return;
                }
                setSelected((current) =>
                  current.includes(card.id)
                    ? current.filter((id) => id !== card.id)
                    : current.length < 4
                      ? [...current, card.id]
                      : current,
                );
              }}
            >
              <img src={artwork(card)} alt={label(card)} />
              <span>{label(card)}</span>
              <small>
                {card.engaged ? "Engaged" : card.counters ? `Collection ${card.counters}` : "Ready"}
                {selected.includes(card.id) ? " · Selected" : ""}
              </small>
            </button>
          ))}
        </div>
        {paying && (
          <footer className={styles.footer}>
            <span role="status">{selected.length} of 4 selected · Preview only</span>
            <button onClick={() => setSelected([])}>Clear selection</button>
            <button onClick={close}>Close preview</button>
          </footer>
        )}
      </Modal>
      <Modal
        opened={inspect !== null}
        closeButtonProps={{ "aria-label": "Close inspected card" }}
        onClose={() => setInspect(null)}
        title={inspect ? label(inspect) : "Card"}
        size="xs"
        centered
      >
        {inspect && (
          <img className={styles.inspection} src={artwork(inspect)} alt={label(inspect)} />
        )}
      </Modal>
    </section>
  );
}
