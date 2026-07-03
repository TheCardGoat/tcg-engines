import { Link } from "react-router-dom";

import { FIXTURES, PARAMETERIZED_FIXTURES, type FixtureName } from "../src/game/index.ts";

interface FixtureRoute {
  id: IndexedFixtureName;
  label: string;
  group: "Setup" | "Main phase" | "Battle" | "Effects" | "Automation";
}

type ParameterizedFixtureName = "vs-ai-match";
type IndexedFixtureName = Exclude<FixtureName, ParameterizedFixtureName>;

const FIXTURE_GROUPS: readonly FixtureRoute["group"][] = [
  "Setup",
  "Main phase",
  "Battle",
  "Effects",
  "Automation",
];

const GROUP_BY_FIXTURE: Record<IndexedFixtureName, FixtureRoute["group"]> = {
  "vs-ai-demo": "Automation",
  "bot-vs-bot": "Automation",
  "setup-default": "Setup",
  "setup-default-opponent-keeps": "Setup",
  "main-phase-demo": "Main phase",
  "deploy-base-demo": "Main phase",
  "deploy-unit-demo": "Main phase",
  "insufficient-resources-demo": "Main phase",
  "discard-limit-demo": "Main phase",
  "newly-deployed-cannot-attack-demo": "Main phase",
  "action-only-command-demo": "Main phase",
  "command-rest-demo": "Main phase",
  "command-multi-target-demo": "Main phase",
  "activate-ability-demo": "Main phase",
  "pending-effect-click-guard-demo": "Main phase",
  "battle-ready-demo": "Battle",
  "block-step-demo": "Battle",
  "first-strike-demo": "Battle",
  "high-maneuver-demo": "Battle",
  "suppression-demo": "Battle",
  "burst-shield-demo": "Battle",
  "step-interrupt-demo": "Battle",
  "multi-turn-demo": "Battle",
  "mutual-destruction-demo": "Battle",
  "pilot-pair-demo": "Effects",
  "attack-trigger-draw-demo": "Effects",
  "attack-trigger-buff-demo": "Effects",
  "when-paired-trigger-demo": "Effects",
  "when-linked-non-link-demo": "Effects",
  "link-unit-deploy-demo": "Effects",
  "support-ability-demo": "Effects",
};

const LABEL_BY_FIXTURE: Partial<Record<FixtureName, string>> = {
  "vs-ai-demo": "VS AI demo",
};

function titleizeFixtureId(id: FixtureName): string {
  return (
    LABEL_BY_FIXTURE[id] ??
    id
      .replace(/-demo$/u, "")
      .split("-")
      .map((part) => (part.length > 0 ? `${part[0]?.toUpperCase()}${part.slice(1)}` : part))
      .join(" ")
  );
}

const FIXTURE_ROUTES: readonly FixtureRoute[] = (Object.keys(FIXTURES) as FixtureName[])
  .filter((id): id is IndexedFixtureName => !PARAMETERIZED_FIXTURES.has(id))
  .map((id) => ({
    id,
    label: titleizeFixtureId(id),
    group: GROUP_BY_FIXTURE[id],
  }));

export function GundamFixtureIndexPage() {
  if (!import.meta.env.DEV) {
    return (
      <main className="min-h-screen bg-[#10151d] px-6 py-8 text-hud-text">
        <p className="font-mono text-sm text-hud-text-muted">Dev only · Gundam visual fixtures</p>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-[#10151d] px-6 py-8 text-hud-text"
      data-testid="gundam-fixture-index"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 space-y-3">
          <p className="font-mono text-hud-xs font-bold uppercase tracking-hud-label text-hud-text-faint">
            Gundam visual fixtures
          </p>
          <h1 className="font-mono text-3xl font-bold text-hud-text">Pick a board state</h1>
          <p className="max-w-3xl text-sm leading-6 text-hud-text-muted">
            These routes boot the real Gundam simulator with deterministic dev fixtures through the
            VS AI harness.
          </p>
        </header>

        <div className="grid gap-5">
          {FIXTURE_GROUPS.map((group) => {
            const fixtures = FIXTURE_ROUTES.filter((fixture) => fixture.group === group);
            if (fixtures.length === 0) {
              return null;
            }

            return (
              <section key={group} className="space-y-3">
                <h2 className="font-mono text-sm font-bold uppercase tracking-hud-label text-hud-text-muted">
                  {group}
                </h2>
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3">
                  {fixtures.map((fixture) => (
                    <li key={fixture.id}>
                      <Link
                        to={`/vs-ai?fixture=${encodeURIComponent(fixture.id)}`}
                        className="block min-h-28 rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan-300/60 hover:bg-white/[0.07]"
                      >
                        <span className="block font-mono text-sm font-bold text-hud-text">
                          {fixture.label}
                        </span>
                        <code className="mt-3 block break-all text-xs text-cyan-200">
                          /vs-ai?fixture={fixture.id}
                        </code>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
