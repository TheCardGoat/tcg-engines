<script lang="ts">
    import {goto} from "$app/navigation";
    import {page} from "$app/state";
    import {
        isKnownLorcanaFixtureId,
        loadLorcanaFixtureOrDefault,
    } from "@/features/simulator-devtools/fixtures";
    import {LORCANA_SIMULATOR_VIEWS, type LorcanaSimulatorView} from "$lib";
    import {LORCANA_HARNESS_DEFAULT_FIXTURE_ID, LORCANA_HARNESS_DEFAULT_VIEW} from "@/features/simulator-devtools/harness/browser-harness";
    import {resolveBrowserTransportConfig} from "@/features/simulator-devtools/harness/browser-route";
    import LorcanaTabletopSimulatorStoryWrapper
        from "@/features/simulator-devtools/harness/LorcanaTabletopSimulatorStoryWrapper.svelte";

    function normalizeView(value: string | null): LorcanaSimulatorView {
        return LORCANA_SIMULATOR_VIEWS.includes(value as LorcanaSimulatorView)
            ? (value as LorcanaSimulatorView)
            : LORCANA_HARNESS_DEFAULT_VIEW;
    }

    function normalizeFixtureId(value: string | null): string {
        const candidate = value?.trim();
        if (!candidate) {
            return LORCANA_HARNESS_DEFAULT_FIXTURE_ID;
        }

        return isKnownLorcanaFixtureId(candidate)
            ? candidate
            : LORCANA_HARNESS_DEFAULT_FIXTURE_ID;
    }

    const fixtureId = $derived(normalizeFixtureId(page.url.searchParams.get("fixtureId")));
    const initialView = $derived(normalizeView(page.url.searchParams.get("view")));
    const browserTransport = $derived.by(() => resolveBrowserTransportConfig(page.url));
    const fixturePromise = $derived.by(() => {
        const encodedFixture = page.url.searchParams.get("fixture");
        if (!encodedFixture) {
            return loadLorcanaFixtureOrDefault(fixtureId);
        }

        return import("@/features/simulator-devtools/harness/browser-fixture").then((module) => {
            const parsedFixture = module.decodeInlineFixtureParam(encodedFixture);
            return parsedFixture
                ? module.deserializeInlineFixture(parsedFixture)
                : loadLorcanaFixtureOrDefault(fixtureId);
        });
    });

    function handleFixtureChange(nextFixtureId: string): void {
        const normalizedFixtureId = normalizeFixtureId(nextFixtureId);
        if (normalizedFixtureId === fixtureId) {
            return;
        }

        const nextUrl = new URL(page.url);
        nextUrl.searchParams.delete("fixture");
        nextUrl.searchParams.set("fixtureId", normalizedFixtureId);

        void goto(nextUrl, {
            keepFocus: true,
            noScroll: true,
            replaceState: true,
        });
    }
</script>

{#await fixturePromise}
    <main class="flex min-h-screen items-center justify-center bg-zinc-950 text-sm text-zinc-300">
        Loading fixture...
    </main>
{:then fixture}
    <LorcanaTabletopSimulatorStoryWrapper
            {browserTransport}
            {fixture}
            {fixtureId}
            {initialView}
            onFixtureChange={handleFixtureChange}
    />
{:catch error}
    <main class="flex min-h-screen items-center justify-center bg-zinc-950 text-sm text-red-200">
        {error instanceof Error ? error.message : "Unable to load fixture."}
    </main>
{/await}
