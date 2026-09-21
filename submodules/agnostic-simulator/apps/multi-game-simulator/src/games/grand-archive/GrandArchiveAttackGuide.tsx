import { TargetingArrow } from "@tcg/simulator-ui";
import { useEffect, useRef, useState } from "react";

interface AttackLine {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** Game-owned board anchors; shared arrows own drawing and reduced-motion behavior. */
export function GrandArchiveAttackGuide({
  sourceId,
  targetIds,
  committed,
}: {
  sourceId?: string;
  targetIds: readonly string[];
  committed: boolean;
}) {
  const overlay = useRef<SVGSVGElement>(null);
  const [lines, setLines] = useState<AttackLine[]>([]);
  const targetKey = targetIds.map(encodeURIComponent).join(",");
  useEffect(() => {
    const targetIds = targetKey ? targetKey.split(",").map(decodeURIComponent) : [];
    const board = overlay.current?.parentElement;
    if (!board || !sourceId || targetIds.length === 0) {
      setLines([]);
      return;
    }
    // Restrict anchors to actual field cards: combat summaries and previews also
    // render these identities, but must never become endpoints for the board arrow.
    const card = (id: string) =>
      board.querySelector<HTMLElement>(
        `.ga-seat-zone--field button[data-sim-entity-id=${JSON.stringify(id)}]`,
      );
    let frame = 0;
    const measure = () => {
      const source = card(sourceId)?.getBoundingClientRect();
      const bounds = board.getBoundingClientRect();
      if (!source || !source.width || !source.height) {
        setLines([]);
        return;
      }
      setLines(
        targetIds.flatMap((id) => {
          const target = card(id)?.getBoundingClientRect();
          if (!target || !target.width || !target.height) return [];
          const above = target.top < source.top;
          return [
            {
              id,
              x1: source.left + source.width / 2 - bounds.left,
              y1: (above ? source.top : source.bottom) - bounds.top,
              x2: target.left + target.width / 2 - bounds.left,
              y2: (above ? target.bottom + (committed ? 0 : 26) : target.top) - bounds.top,
            },
          ];
        }),
      );
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(board);
    for (const id of [sourceId, ...targetIds]) {
      const element = card(id);
      if (element) observer.observe(element);
    }
    schedule();
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
    };
  }, [sourceId, targetKey, committed]);
  return (
    <svg ref={overlay} className="ga-attack-guide" aria-hidden="true" data-testid="ga-attack-guide">
      {lines.map((line) => (
        <TargetingArrow
          key={line.id}
          {...line}
          curved={false}
          variant={committed ? "attack" : "candidate"}
          color="var(--ga-signal)"
          animated={committed}
        />
      ))}
    </svg>
  );
}
