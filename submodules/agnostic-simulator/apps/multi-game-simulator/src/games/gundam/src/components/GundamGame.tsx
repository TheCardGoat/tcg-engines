import type { ReactNode } from "react";
import type { MatchRuntime, MatchStaticResources } from "@tcg/gundam-engine";

import { GundamGameProvider } from "../game/index.ts";
import type { ViewerId } from "../game/index.ts";

interface GundamGameProps {
  readonly runtime: MatchRuntime;
  readonly staticResources: MatchStaticResources;
  readonly viewerId: ViewerId;
  readonly children: ReactNode;
}

export function GundamGame({ runtime, staticResources, viewerId, children }: GundamGameProps) {
  return (
    <GundamGameProvider runtime={runtime} staticResources={staticResources} viewerId={viewerId}>
      {children}
    </GundamGameProvider>
  );
}
