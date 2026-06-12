import type {
  BoardBlock as BoardBlockType,
  BoardSectionFlow,
  SimulatorEntity,
  SimulatorSeat,
  SimulatorTable,
} from "@tcg/simulator-contract";

import { cx } from "../class-names";
import { CardRow } from "./CardRow";
import { EmptyZone } from "./EmptyZone";
import { SeatSummary } from "./SeatSummary";
import { TokenRow } from "./TokenRow";
import { ZoneFrame } from "./ZoneFrame";

export interface BoardBlockProps {
  table: SimulatorTable;
  block: BoardBlockType;
  entityMap: Map<string, SimulatorEntity>;
  flow?: BoardSectionFlow;
  compact?: boolean;
}

export function BoardBlock({
  table,
  block,
  entityMap,
  flow = "grid",
  compact = false,
}: BoardBlockProps) {
  const zoneById = (zoneId: string | undefined) => table.zones.find((zone) => zone.id === zoneId);

  const seatById = (seatId: string | undefined): SimulatorSeat => {
    const seat = table.seats.find((candidate) => candidate.id === seatId);
    if (seat) return seat;
    const fallbackSeat = table.seats[0];
    if (!fallbackSeat) throw new Error("Board table has no seats to render.");
    return fallbackSeat;
  };

  const blockSizeClass = (
    size: BoardBlockType["size"],
    sectionFlow: BoardSectionFlow,
    compactBoard: boolean,
  ): string => {
    if (sectionFlow === "row") {
      switch (size) {
        case "compact":
          return "flex-[1_1_150px]";
        case "wide":
        case "tall":
          return "flex-[1_1_300px]";
        case "full":
          return "flex-[1_1_100%]";
        default:
          return "flex-[1_1_220px]";
      }
    }
    if (sectionFlow === "column") return "col-span-full";

    if (compactBoard) {
      switch (size) {
        case "compact":
          return "col-span-2 max-[900px]:col-span-3 max-[520px]:col-span-full";
        case "normal":
          return "col-span-4 max-[900px]:col-span-3 max-[520px]:col-span-full";
        case "wide":
          return "col-span-8 max-[900px]:col-span-3 max-[520px]:col-span-full";
        case "full":
          return "col-span-full";
        case "tall":
          return "col-span-6 max-[900px]:col-span-3 max-[520px]:col-span-full";
      }
    }

    switch (size) {
      case "compact":
        return "col-span-2 max-[900px]:col-span-3 max-[520px]:col-span-full";
      case "normal":
        return "col-span-3 max-[900px]:col-span-3 max-[520px]:col-span-full";
      case "wide":
        return "col-span-5 max-[900px]:col-span-3 max-[520px]:col-span-full";
      case "full":
        return "col-span-full";
      case "tall":
        return "col-span-4 row-span-2 max-[900px]:col-span-3 max-[520px]:col-span-full";
    }
  };

  const blockClass = (boardBlock: BoardBlockType, sectionFlow: BoardSectionFlow) =>
    cx(
      "board-block grid min-w-0 gap-2.5 rounded-lg border border-[var(--board-border)] bg-[var(--board-surface)]",
      compact ? "min-h-0 overflow-hidden p-2" : "min-h-[118px] p-3",
      blockSizeClass(boardBlock.size, sectionFlow, compact),
      boardBlock.kind === "stack" && "border-dashed",
      (boardBlock.kind === "spotlight" || boardBlock.kind === "zone") &&
        "bg-[var(--board-surface-soft)]",
    );

  const eyebrowClass =
    "eyebrow text-[12px] font-extrabold leading-tight tracking-normal text-[var(--game-accent)] uppercase";

  const blockHeadingClass =
    "mt-1 break-words text-[15px] font-black leading-tight text-[var(--board-text)]";

  const zone = zoneById(block.zoneId);
  const entityIds = block.entityIds ?? zone?.entityIds ?? [];
  const entities = entityIds
    .map((entityId) => entityMap.get(entityId))
    .filter((entity): entity is SimulatorEntity => Boolean(entity));
  const entityCount = zone?.count ?? entityIds.length;
  const note = block.note ?? zone?.hint ?? "";
  const stackValue = block.value ?? (zone?.count ?? entityIds.length).toString();
  const seat = seatById(block.seatId);
  const zoneSeat = zone?.ownerId
    ? table.seats.find((candidate) => candidate.id === zone.ownerId)
    : undefined;
  const zoneOwnerLabel =
    zoneSeat?.perspective === "bottom"
      ? "Your"
      : zoneSeat?.perspective === "top"
        ? "Opponent"
        : undefined;
  const zoneRoleLabel = zone?.role === "resource" ? "resource area" : (zone?.label ?? block.label);
  const zoneAccessibleLabel = zoneOwnerLabel
    ? `${zoneOwnerLabel} ${zoneRoleLabel}`
    : (zone?.label ?? block.label);

  return (
    <article
      className={cx(blockClass(block, flow), block.kind === "zone" && "board-zone")}
      aria-label={block.kind === "zone" ? zoneAccessibleLabel : undefined}
      data-block-id={block.id}
      data-block-kind={block.kind}
      data-block-size={block.size}
      data-zone-id={zone?.id ?? ""}
      data-zone-role={zone?.role ?? "custom"}
      role={block.kind === "zone" ? "region" : undefined}
    >
      {block.kind === "seat" ? (
        <>
          <SeatSummary table={table} seat={seat} compact />
          {block.note && (
            <p className="board-note text-xs leading-snug text-[var(--board-muted)]">
              {block.note}
            </p>
          )}
        </>
      ) : block.kind === "zone" ? (
        <ZoneFrame
          block={block}
          zone={zone}
          entities={entities}
          entityCount={entityCount}
          note={note}
          compact={compact}
          ariaLabel={zoneAccessibleLabel}
        />
      ) : block.kind === "stack" ? (
        <>
          <div className="stack-block grid min-w-0 gap-2">
            <p className={eyebrowClass}>{zone?.role ?? "stack"}</p>
            <h3 className={blockHeadingClass}>{block.label}</h3>
            <strong className="text-[32px] font-black leading-none text-[var(--board-text)]">
              {stackValue}
            </strong>
            {block.note && (
              <span className="text-xs leading-snug text-[var(--board-muted)]">{block.note}</span>
            )}
          </div>
          {entities.length > 0 && <CardRow entities={entities} emptyLabel="Empty stack" />}
        </>
      ) : block.kind === "counter" ? (
        <div className="counter-block grid min-w-0 gap-2">
          <p className={eyebrowClass}>counter</p>
          <h3 className={blockHeadingClass}>{block.label}</h3>
          <strong className="text-[32px] font-black leading-none text-[var(--board-text)]">
            {block.value ?? ""}
          </strong>
          {block.note && (
            <span className="text-xs leading-snug text-[var(--board-muted)]">{block.note}</span>
          )}
        </div>
      ) : block.kind === "token-row" ? (
        <div className="token-row-block grid min-w-0 gap-2">
          <div>
            <p className={eyebrowClass}>tokens</p>
            <h3 className={blockHeadingClass}>{block.label}</h3>
          </div>
          <TokenRow tokens={block.tokens ?? []} />
          {block.note && (
            <p className="board-note text-xs leading-snug text-[var(--board-muted)]">
              {block.note}
            </p>
          )}
        </div>
      ) : (
        <div className="spotlight-block grid min-w-0 gap-2">
          <p className={eyebrowClass}>spotlight</p>
          <h3 className={blockHeadingClass}>{block.label}</h3>
          {entities.length > 0 ? (
            <CardRow entities={entities} density="normal" emptyLabel="No spotlight card" />
          ) : (
            <EmptyZone label="No spotlight card" />
          )}
          {block.note && (
            <p className="board-note text-xs leading-snug text-[var(--board-muted)]">
              {block.note}
            </p>
          )}
        </div>
      )}
    </article>
  );
}
