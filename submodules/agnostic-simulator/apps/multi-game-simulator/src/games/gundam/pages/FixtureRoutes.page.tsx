import { Bot, ChevronRight, FlaskConical, Play, Server, Swords, Wrench } from "lucide-react";
import { type ComponentType } from "react";
import { Link, useParams } from "react-router-dom";

import { FIXTURES, PARAMETERIZED_FIXTURES, type FixtureName } from "../src/game/index.ts";

interface FixtureRoute {
  id: IndexedFixtureName;
  label: string;
  group: "Setup" | "Main phase" | "Battle" | "Effects" | "Automation";
}
interface HubRoute {
  href: string;
  label: string;
  eyebrow: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  devOnly?: boolean;
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
  "command-auto-resolve-demo": "Main phase",
  "command-rest-demo": "Main phase",
  "command-multi-target-demo": "Main phase",
  "activate-ability-demo": "Main phase",
  "pending-effect-click-guard-demo": "Main phase",
  "striker-pack-choice-demo": "Effects",
  "optional-prompt-demo": "Effects",
  "deck-look-prompt-demo": "Effects",
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
  "return-to-hand-demo": "Effects",
  "return-to-deck-demo": "Effects",
  "urgent-timer-demo": "Battle",
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

const HUB_ROUTES: readonly HubRoute[] = [
  {
    href: "/vs-ai",
    label: "VS AI",
    eyebrow: "local match",
    description: "Deck picker, strategy choice, fixture boot, and browser-owned play.",
    icon: Play,
  },
  {
    href: "/practice",
    label: "Server practice",
    eyebrow: "runtime match",
    description: "Server-authoritative quick match from default or imported practice payloads.",
    icon: Server,
  },
  {
    href: "/bot-vs-bot",
    label: "Bot vs bot",
    eyebrow: "automation",
    description: "Spectator board with automated strategies playing both seats.",
    icon: Swords,
  },
  {
    href: "/bot-bench-ui",
    label: "Bot bench",
    eyebrow: "bench",
    description: "Deterministic board for bot policy review and UI automation.",
    icon: Bot,
  },
  {
    href: "/tests",
    label: "Dev fixtures",
    eyebrow: "fixtures",
    description: "Fixture-only index for visual, prompt, and interaction checks.",
    icon: FlaskConical,
    devOnly: true,
  },
];

interface GundamFixtureIndexPageProps {
  variant?: "home" | "dev";
}

function useGundamRoutePath() {
  const { gameSlug } = useParams();

  return (href: string): string => (gameSlug ? `/${gameSlug}/simulator${href}` : href);
}

export function GundamFixtureIndexPage({ variant = "dev" }: GundamFixtureIndexPageProps) {
  const routePath = useGundamRoutePath();
  const isHome = variant === "home";
  const canShowDevFixtures = import.meta.env.DEV;
  const hubRoutes = HUB_ROUTES.filter((route) => canShowDevFixtures || !route.devOnly);

  if (!isHome && !import.meta.env.DEV) {
    return (
      <main className="min-h-screen bg-[oklch(0.18_0.018_72)] px-6 py-8 text-hud-text">
        <p className="font-mono text-sm text-hud-text-muted">Dev only · Gundam visual fixtures</p>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-[oklch(0.18_0.018_72)] px-4 py-5 text-hud-text sm:px-6 lg:px-8"
      data-testid="gundam-fixture-index"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 border-b border-[oklch(0.38_0.025_82)] pb-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="font-mono text-hud-xs font-bold uppercase tracking-hud-label text-[oklch(0.73_0.095_84)]">
                {isHome ? "Gundam simulator workbench" : "Gundam fixture bench"}
              </p>
              <h1 className="mt-2 font-mono text-3xl font-bold leading-tight text-[oklch(0.96_0.018_90)] sm:text-4xl">
                {isHome ? "Route hub for implementation work" : "Deterministic board states"}
              </h1>
              <p className="mt-3 max-w-[72ch] text-sm leading-6 text-[oklch(0.78_0.02_86)]">
                {isHome
                  ? "Entry points for local simulator work, server practice, automation, and reproducible UI states."
                  : "Named states for visual checks, prompt work, targeting, bot behavior, and interaction regressions."}
              </p>
            </div>
            <div className="grid min-w-0 grid-cols-3 gap-px overflow-hidden rounded-lg border border-[oklch(0.38_0.025_82)] bg-[oklch(0.38_0.025_82)] sm:min-w-[340px]">
              <Metric label="routes" value={String(hubRoutes.length)} />
              {canShowDevFixtures ? (
                <>
                  <Metric label="states" value={String(FIXTURE_ROUTES.length)} />
                  <Metric label="groups" value={String(FIXTURE_GROUPS.length)} />
                </>
              ) : (
                <>
                  <Metric label="server" value="on" />
                  <Metric label="bots" value="2" />
                </>
              )}
            </div>
          </div>
        </header>

        <div className="grid gap-7">
          {isHome ? (
            <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="overflow-hidden rounded-lg border border-[oklch(0.38_0.025_82)] bg-[oklch(0.22_0.018_72)]">
                <div className="flex items-center justify-between gap-4 border-b border-[oklch(0.38_0.025_82)] px-4 py-3">
                  <h2 className="font-mono text-sm font-bold uppercase tracking-hud-label text-[oklch(0.86_0.022_90)]">
                    Primary routes
                  </h2>
                  <span className="rounded-full border border-[oklch(0.48_0.055_84)] px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-hud-label text-[oklch(0.79_0.105_84)]">
                    mounted paths
                  </span>
                </div>
                <ul className="divide-y divide-[oklch(0.34_0.022_78)]">
                  {hubRoutes.map((route) => {
                    const Icon = route.icon;
                    return (
                      <li key={route.href}>
                        <Link
                          to={routePath(route.href)}
                          className="group grid min-h-[92px] grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 transition hover:bg-[oklch(0.27_0.024_76)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[oklch(0.73_0.12_84)]"
                        >
                          <span className="grid size-10 place-items-center rounded-md border border-[oklch(0.43_0.034_82)] bg-[oklch(0.29_0.026_78)] text-[oklch(0.8_0.12_84)]">
                            <Icon className="size-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block font-mono text-[11px] font-bold uppercase tracking-hud-label text-[oklch(0.64_0.06_156)]">
                              {route.eyebrow}
                            </span>
                            <span className="mt-1 block text-base font-bold leading-5 text-[oklch(0.96_0.018_90)]">
                              {route.label}
                            </span>
                            <span className="mt-1 block max-w-[68ch] text-sm leading-5 text-[oklch(0.72_0.018_86)]">
                              {route.description}
                            </span>
                          </span>
                          <span className="flex items-center gap-2">
                            <code className="hidden rounded-md bg-[oklch(0.16_0.015_72)] px-2 py-1 font-mono text-xs text-[oklch(0.78_0.095_204)] sm:block">
                              {route.href}
                            </code>
                            <ChevronRight className="size-4 text-[oklch(0.65_0.045_86)] transition group-hover:translate-x-0.5 group-hover:text-[oklch(0.86_0.11_84)]" />
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <aside className="rounded-lg border border-[oklch(0.38_0.025_82)] bg-[oklch(0.24_0.019_72)] p-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-md bg-[oklch(0.32_0.055_84)] text-[oklch(0.86_0.12_84)]">
                    <Wrench className="size-4" />
                  </span>
                  <div>
                    <h2 className="text-sm font-bold text-[oklch(0.96_0.018_90)]">
                      Implementation map
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-[oklch(0.7_0.017_86)]">
                      Stable links for simulator work across setup, runtime, bots, and fixtures.
                    </p>
                  </div>
                </div>
                <dl className="mt-5 grid gap-3 text-sm">
                  <Definition label="Need a playable local match" value="/vs-ai" />
                  <Definition label="Need server runtime behavior" value="/practice" />
                  {canShowDevFixtures ? (
                    <Definition
                      label="Need deterministic UI proof"
                      value="/tests or fixture links"
                    />
                  ) : null}
                  <Definition
                    label="Need bot policy surface"
                    value="/bot-vs-bot or /bot-bench-ui"
                  />
                </dl>
              </aside>
            </section>
          ) : null}
          {canShowDevFixtures ? (
            <section className="overflow-hidden rounded-lg border border-[oklch(0.38_0.025_82)] bg-[oklch(0.21_0.017_72)]">
              <div className="flex flex-col gap-2 border-b border-[oklch(0.38_0.025_82)] px-4 py-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-mono text-sm font-bold uppercase tracking-hud-label text-[oklch(0.86_0.022_90)]">
                    Deterministic states
                  </h2>
                  <p className="mt-1 text-sm text-[oklch(0.7_0.017_86)]">
                    Fixture routes open through VS AI with a fixed board condition.
                  </p>
                </div>
                <code className="w-fit rounded-md bg-[oklch(0.16_0.015_72)] px-2.5 py-1.5 font-mono text-xs text-[oklch(0.78_0.095_204)]">
                  /vs-ai?fixture=:id
                </code>
              </div>
              <div className="divide-y divide-[oklch(0.34_0.022_78)]">
                {FIXTURE_GROUPS.map((group) => {
                  const fixtures = FIXTURE_ROUTES.filter((fixture) => fixture.group === group);
                  if (fixtures.length === 0) {
                    return null;
                  }

                  return (
                    <section key={group} className="grid gap-0 lg:grid-cols-[180px_minmax(0,1fr)]">
                      <div className="border-b border-[oklch(0.34_0.022_78)] bg-[oklch(0.24_0.019_72)] px-4 py-3 lg:border-b-0 lg:border-r">
                        <h3 className="font-mono text-xs font-bold uppercase tracking-hud-label text-[oklch(0.78_0.095_84)]">
                          {group}
                        </h3>
                        <p className="mt-1 text-xs text-[oklch(0.68_0.016_86)]">
                          {fixtures.length} states
                        </p>
                      </div>
                      <ul className="grid min-w-0 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                        {fixtures.map((fixture) => (
                          <li
                            key={fixture.id}
                            className="min-w-0 border-b border-r border-[oklch(0.31_0.02_76)] last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 xl:[&:nth-last-child(-n+3)]:border-b-0"
                          >
                            <Link
                              to={routePath(`/vs-ai?fixture=${encodeURIComponent(fixture.id)}`)}
                              className="group block min-h-[92px] px-4 py-3 transition hover:bg-[oklch(0.27_0.024_76)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[oklch(0.73_0.12_84)]"
                            >
                              <span className="block text-sm font-bold leading-5 text-[oklch(0.93_0.018_90)]">
                                {fixture.label}
                              </span>
                              <code className="mt-2 block break-all font-mono text-xs leading-5 text-[oklch(0.72_0.085_204)]">
                                {fixture.id}
                              </code>
                              <span className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-hud-label text-[oklch(0.64_0.06_156)]">
                                Open state
                                <ChevronRight className="size-3 transition group-hover:translate-x-0.5" />
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[oklch(0.24_0.019_72)] px-3 py-3">
      <span className="block font-mono text-lg font-bold leading-none text-[oklch(0.96_0.018_90)]">
        {value}
      </span>
      <span className="mt-1 block font-mono text-[10px] font-bold uppercase tracking-hud-label text-[oklch(0.66_0.05_86)]">
        {label}
      </span>
    </div>
  );
}

function Definition({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-t border-[oklch(0.35_0.024_78)] pt-3">
      <dt className="text-xs font-semibold text-[oklch(0.68_0.016_86)]">{label}</dt>
      <dd className="font-mono text-xs text-[oklch(0.82_0.1_84)]">{value}</dd>
    </div>
  );
}

export function GundamHomePage() {
  return <GundamFixtureIndexPage variant="home" />;
}
