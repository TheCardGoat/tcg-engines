import { lazy, Suspense } from "react";

const LazyChatPanel = lazy(() =>
  import("./ChatPanel").then(({ ChatPanel }) => ({
    default: ChatPanel,
  })),
);

export function DeferredChatPanel() {
  return (
    <Suspense fallback={<div role="status">Loading chat…</div>}>
      <LazyChatPanel compact layout="mobile-drawer" />
    </Suspense>
  );
}
