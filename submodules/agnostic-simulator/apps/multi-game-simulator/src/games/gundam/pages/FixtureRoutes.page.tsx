import { useParams } from "react-router";

import { FixtureCatalog } from "../src/components/fixture-catalog/FixtureCatalog.tsx";

function useGundamRoutePath() {
  const { gameSlug } = useParams();

  return (href: string): string => (gameSlug ? `/${gameSlug}/simulator${href}` : href || "/");
}

export function GundamFixtureIndexPage() {
  const routePath = useGundamRoutePath();

  return (
    <div className="gd-dark-surface h-dvh overflow-y-auto overscroll-contain bg-hud-bg text-hud-text [color-scheme:dark]">
      <main className="mx-auto min-h-full w-full max-w-6xl p-4 sm:p-6 lg:py-8">
        <FixtureCatalog fixtureRoot={routePath("/tests")} />
      </main>
    </div>
  );
}
