import { Modal } from "@mantine/core";
import { useState, type ReactNode } from "react";
import type { SimulatorEntity } from "@tcg/simulator-contract";

/** Zone counts and inspection use only cards authorized by the viewer projection. */
export function GrandArchiveZoneInspector({
  name,
  label,
  count,
  entities,
  renderCard,
}: {
  readonly name: string;
  readonly label: string;
  readonly count: number;
  readonly entities: readonly SimulatorEntity[];
  readonly renderCard: (entity: SimulatorEntity) => ReactNode;
}) {
  const [opened, setOpened] = useState(false);
  const ordered =
    name === "main-deck" || name === "material-deck"
      ? [...entities].sort((a, b) => a.title.localeCompare(b.title) || a.id.localeCompare(b.id))
      : entities;
  const concealedCount = Math.max(0, count - entities.length);
  return (
    <>
      <button
        type="button"
        className="ga-zone-inspector"
        aria-label={`${label}, ${count} cards`}
        onClick={() => setOpened(true)}
        data-empty={count === 0 || undefined}
      >
        <b>{count}</b>
        <span>{label}</span>
      </button>
      <Modal
        opened={opened}
        returnFocus={false}
        onClose={() => setOpened(false)}
        title={`${label} · ${count}`}
        closeButtonProps={{ "aria-label": `Close ${label}` }}
        centered
      >
        <div
          className="ga-zone-inspector-cards"
          onClickCapture={(event) => {
            if (event.target instanceof Element && event.target.closest("button")) setOpened(false);
          }}
        >
          {ordered.map((entity) => renderCard(entity))}
        </div>
        {name === "main-deck" || name === "material-deck" ? (
          <p className="ga-sandbox-private-note">
            Authorized reveals only. This display does not indicate deck order.
          </p>
        ) : null}
        {concealedCount ? (
          <p className="ga-sandbox-private-note">{concealedCount} concealed cards</p>
        ) : null}
        {!entities.length ? (
          <p className="ga-sandbox-private-note">
            {count ? "Card identities are private." : "This zone is empty."}
          </p>
        ) : null}
      </Modal>
    </>
  );
}
