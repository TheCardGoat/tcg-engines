<script lang="ts">
    import {goto} from "$app/navigation";
    import {page} from "$app/state";
    import {LORCANA_SIMULATOR_FIXTURES} from "@/features/simulator-devtools/fixtures";
    import {
        decodeInlineFixtureParam,
        deserializeInlineFixture,
    } from "@/features/simulator-devtools/harness/browser-fixture";
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

        return candidate in LORCANA_SIMULATOR_FIXTURES
            ? candidate
            : LORCANA_HARNESS_DEFAULT_FIXTURE_ID;
    }

    const fixtureId = $derived(normalizeFixtureId(page.url.searchParams.get("fixtureId")));
    const initialView = $derived(normalizeView(page.url.searchParams.get("view")));
    const browserTransport = $derived.by(() => resolveBrowserTransportConfig(page.url));
    const fixture = $derived.by(() => {
        const encodedFixture = page.url.searchParams.get("fixture");
        const parsedFixture = decodeInlineFixtureParam(encodedFixture);
        return parsedFixture ? deserializeInlineFixture(parsedFixture) : undefined;
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

<LorcanaTabletopSimulatorStoryWrapper
        {browserTransport}
        {fixture}
        {fixtureId}
        {initialView}
        onFixtureChange={handleFixtureChange}
/>
