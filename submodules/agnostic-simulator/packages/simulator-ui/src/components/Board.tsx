import type {
  BoardLayout,
  BoardSection,
  BoardSectionFlow,
  BoardSectionLabelPlacement,
  BoardSectionSpan,
  SimulatorEntity,
  SimulatorTable,
} from "@tcg/simulator-contract";

import { cx } from "../class-names";
import { BoardBlock } from "./BoardBlock";

export interface BoardProps {
  table: SimulatorTable;
  entities: SimulatorEntity[];
  layout: BoardLayout;
  label?: string;
}

export function Board({ table, entities, layout, label }: BoardProps) {
  const entityMap = new Map(entities.map((entity) => [entity.id, entity]));

  const labelPlacementFor = (section: BoardSection): BoardSectionLabelPlacement =>
    section.layout?.labelPlacement ?? layout.appearance?.labelPlacement ?? "rail";

  const columnsFor = (section: BoardSection): string => (section.layout?.columns ?? 12).toString();
  const flowFor = (section: BoardSection): BoardSectionFlow => section.layout?.flow ?? "grid";
  const spanFor = (section: BoardSection): BoardSectionSpan => section.layout?.span ?? "auto";

  const variant = layout.appearance?.variant ?? "lanes";
  const density = layout.appearance?.density ?? "normal";
  const viewportFit = layout.appearance?.fit === "viewport";
  const boardLabel = label ?? layout.title;

  const boardClass = cx(
    "board board-mat grid [container-type:inline-size] [background:linear-gradient(90deg,rgb(255_255_255_/_55%)_1px,transparent_1px),linear-gradient(180deg,rgb(255_255_255_/_52%)_1px,transparent_1px),var(--board-mat-bg)] [background-size:28px_28px]",
    viewportFit
      ? "h-svh max-h-svh grid-cols-1 grid-rows-[minmax(0,1fr)_auto_minmax(0,1fr)] overflow-hidden"
      : variant === "dashboard" || variant === "theater"
        ? "grid-cols-2 max-[900px]:grid-cols-1"
        : "grid-cols-1",
    density === "compact" && "gap-2.5 p-3",
    density === "normal" && "gap-3 p-4 max-[520px]:p-3",
    density === "spacious" && "gap-4 p-5 max-[520px]:p-3",
  );

  const sectionClass = (section: BoardSection, labelPlacement: BoardSectionLabelPlacement) =>
    cx(
      "board-section grid min-w-0 gap-2.5",
      labelPlacement === "rail"
        ? "grid-cols-[30px_minmax(0,1fr)] max-[900px]:grid-cols-1"
        : "grid-cols-1",
      viewportFit &&
        (section.role === "player" || section.role === "opponent") &&
        "min-h-0 overflow-hidden",
      viewportFit && section.role === "shared" && "min-h-0",
      spanFor(section) === "full" && "col-span-full",
    );

  const sectionGridClass = (section: BoardSection) => {
    const flow = flowFor(section);
    const fitSection = viewportFit && (section.role === "player" || section.role === "opponent");
    if (flow === "row") {
      return cx(
        "board-section-grid flex min-w-0 flex-wrap items-start gap-2.5",
        fitSection && "h-full min-h-0 overflow-hidden",
      );
    }
    if (flow === "column") {
      return cx(
        "board-section-grid grid min-w-0 grid-cols-1 items-start gap-2.5",
        fitSection && "h-full min-h-0 overflow-hidden",
      );
    }

    const cols = columnsFor(section);
    const fitClass = fitSection && "h-full min-h-0 auto-rows-fr overflow-hidden";
    switch (cols) {
      case "4":
        return cx(
          "board-section-grid grid min-w-0 grid-cols-4 items-stretch gap-2.5 max-[900px]:grid-cols-6 max-[520px]:grid-cols-1",
          fitClass,
        );
      case "6":
        return cx(
          "board-section-grid grid min-w-0 grid-cols-6 items-stretch gap-2.5 max-[520px]:grid-cols-1",
          fitClass,
        );
      case "8":
        return cx(
          "board-section-grid grid min-w-0 grid-cols-8 items-stretch gap-2.5 max-[900px]:grid-cols-6 max-[520px]:grid-cols-1",
          fitClass,
        );
      case "10":
        return cx(
          "board-section-grid grid min-w-0 grid-cols-10 items-stretch gap-2.5 max-[900px]:grid-cols-6 max-[520px]:grid-cols-1",
          fitClass,
        );
      default:
        return cx(
          "board-section-grid grid min-w-0 grid-cols-12 items-stretch gap-2.5 max-[900px]:grid-cols-6 max-[520px]:grid-cols-1",
          fitClass,
        );
    }
  };

  const sectionLabelClass = (section: BoardSection) =>
    cx(
      "rounded-md px-2 py-2 text-center text-[11px] font-black uppercase tracking-normal text-[var(--board-label-text)]",
      section.role === "player" && "bg-[var(--board-player-label-bg)]",
      section.role === "opponent" && "bg-[var(--board-opponent-label-bg)]",
      section.role === "shared" && "bg-[var(--board-shared-label-bg)]",
      section.role === "side" && "bg-[var(--board-label-bg)]",
    );

  return (
    <div
      className={boardClass}
      data-board-variant={variant}
      data-board-density={density}
      data-board-fit={layout.appearance?.fit ?? "content"}
      aria-label={boardLabel}
      role="group"
    >
      {layout.sections.map((section) => {
        const placement = labelPlacementFor(section);
        return (
          <section
            key={section.id}
            className={sectionClass(section, placement)}
            data-section-role={section.role}
            data-section-flow={flowFor(section)}
            data-section-label-placement={placement}
            data-section-span={spanFor(section)}
          >
            {placement !== "hidden" && (
              <div className="board-section-label flex items-stretch justify-center">
                <span
                  className={cx(
                    sectionLabelClass(section),
                    placement === "rail"
                      ? "[writing-mode:vertical-rl] rotate-180 max-[900px]:w-full max-[900px]:rotate-0 max-[900px]:[writing-mode:horizontal-tb]"
                      : "w-full",
                  )}
                >
                  {section.label}
                </span>
              </div>
            )}
            <div className={sectionGridClass(section)} data-section-columns={columnsFor(section)}>
              {section.blocks.map((block) => (
                <BoardBlock
                  key={block.id}
                  table={table}
                  block={block}
                  entityMap={entityMap}
                  flow={flowFor(section)}
                  compact={viewportFit}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
