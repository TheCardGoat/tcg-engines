import { useCallback, type ReactNode } from "react";

import { asMoveName, useGundamGame } from "../../game/index.ts";
import { MatchSidebarRail } from "../ui/MatchSidebarRail.tsx";
import { useSubmitError } from "./submit-error-context.tsx";

export interface MatchSidebarRailContainerProps {
  readonly onOpenDrawer: () => void;
  readonly connectionIndicator?: ReactNode;
}

export function MatchSidebarRailContainer({
  onOpenDrawer,
  connectionIndicator,
}: MatchSidebarRailContainerProps) {
  const { adapter } = useGundamGame();
  const { report } = useSubmitError();

  const onConcede = useCallback(() => {
    report(adapter.submit(asMoveName("concede"), {}));
  }, [adapter, report]);

  return (
    <MatchSidebarRail
      onOpenDrawer={onOpenDrawer}
      onConcede={onConcede}
      connectionIndicator={connectionIndicator}
    />
  );
}
