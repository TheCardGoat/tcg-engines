import { lazy, Suspense } from "react";

const LazyGundamChatPanel = lazy(() =>
  import("./GundamChatPanel.tsx").then(({ GundamChatPanel }) => ({
    default: GundamChatPanel,
  })),
);

export function DeferredGundamChatPanel() {
  return (
    <Suspense
      fallback={
        <div
          className="grid min-h-24 place-items-center text-[11px] text-hud-text-muted"
          role="status"
        >
          Loading chat…
        </div>
      }
    >
      <LazyGundamChatPanel compact layout="mobile-drawer" />
    </Suspense>
  );
}
