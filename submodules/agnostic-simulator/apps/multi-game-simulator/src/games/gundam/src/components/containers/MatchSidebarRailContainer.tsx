import { useCallback } from "react";

import { asMoveName, useGundamGame } from "../../game/index.ts";
import { MatchSidebarRail } from "../ui/MatchSidebarRail.tsx";
import { useSubmitError } from "./submit-error-context.tsx";

export interface MatchSidebarRailContainerProps {
  readonly onOpenDrawer: () => void;
}

/**
 * Wires the v2 collapsed sidebar rail. The full match panel (logs,
 * meta, vs-AI controls) opens inline via `onOpenDrawer`; this container
 * only handles the inline shortcut actions.
 */
export function MatchSidebarRailContainer({ onOpenDrawer }: MatchSidebarRailContainerProps) {
  const { adapter } = useGundamGame();
  const { report } = useSubmitError();

  const onConcede = useCallback(() => {
    report(adapter.submit(asMoveName("concede"), {}));
  }, [adapter, report]);

  return <MatchSidebarRail onOpenDrawer={onOpenDrawer} onConcede={onConcede} />;
}
