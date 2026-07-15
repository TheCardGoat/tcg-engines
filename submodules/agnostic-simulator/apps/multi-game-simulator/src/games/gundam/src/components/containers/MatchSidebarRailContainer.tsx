import { useCallback } from "react";

import { asMoveName, useGundamGame } from "../../game/index.ts";
import { MatchSidebarRail } from "../ui/MatchSidebarRail.tsx";
import { useSubmitError } from "./submit-error-context.tsx";

export interface MatchSidebarRailContainerProps {
  readonly onOpenDrawer: () => void;
}

export function MatchSidebarRailContainer({ onOpenDrawer }: MatchSidebarRailContainerProps) {
  const { adapter } = useGundamGame();
  const { report } = useSubmitError();

  const onConcede = useCallback(() => {
    report(adapter.submit(asMoveName("concede"), {}));
  }, [adapter, report]);

  return <MatchSidebarRail onOpenDrawer={onOpenDrawer} onConcede={onConcede} />;
}
