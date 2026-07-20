import { useEffect, useRef } from "react";

import { useLayoutMode } from "../../lib/use-layout-mode.ts";

export function GameTable({ children }: { children: React.ReactNode }) {
  const tableRef = useRef<HTMLElement>(null);
  const layoutMode = useLayoutMode();

  useEffect(() => {
    const table = tableRef.current;
    if (!table || layoutMode !== "mobile" || window.innerWidth <= 767 || window.innerHeight > 520) {
      return;
    }

    // Phone landscape cannot show six complete rows at once without making
    // cards illegible. Keep both seats full-sized in a vertical board scroller
    // and land on the viewer's seat; the opponent remains one swipe above.
    const frame = window.requestAnimationFrame(() => {
      table.scrollTop = table.scrollHeight - table.clientHeight;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [layoutMode]);

  return (
    <section
      ref={tableRef}
      className="board-bg flex h-full min-h-0 min-w-0 flex-1 flex-col relative overflow-hidden"
      data-sim-board
    >
      {children}
    </section>
  );
}
