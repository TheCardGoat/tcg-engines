import type { HarnessFixture } from "@tcg/simulator-contract";

interface CoreComponentMapProps {
  fixture: HarnessFixture;
}

export function CoreComponentMap({ fixture }: CoreComponentMapProps) {
  return (
    <section
      className="core-component-map mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6"
      aria-label="Core component map"
    >
      <h2 className="text-lg font-black text-[var(--text)]">Core Components</h2>
      <div className="mt-3 grid gap-2">
        {fixture.coreComponents.map((component) => (
          <div
            key={component.name}
            className="grid gap-1 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-3"
          >
            <h4 className="text-sm font-black text-[var(--text)]">{component.name}</h4>
            <p className="text-xs leading-snug text-[var(--muted)]">{component.responsibility}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
