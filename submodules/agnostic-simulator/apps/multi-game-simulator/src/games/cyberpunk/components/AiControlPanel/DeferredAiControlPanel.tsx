import { lazy, Suspense, type ComponentProps } from "react";

import type { AiControlPanel } from "./AiControlPanel";

type DeferredAiControlPanelProps = ComponentProps<typeof AiControlPanel>;

const LazyAiControlPanel = lazy(() =>
  import("./AiControlPanel").then(({ AiControlPanel }) => ({
    default: AiControlPanel,
  })),
);

export function DeferredAiControlPanel(props: DeferredAiControlPanelProps) {
  return (
    <Suspense fallback={<div role="status">Loading bot controls…</div>}>
      <LazyAiControlPanel {...props} />
    </Suspense>
  );
}
