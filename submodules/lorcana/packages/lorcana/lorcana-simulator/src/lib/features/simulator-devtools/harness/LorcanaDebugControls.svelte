<script lang="ts">
    import type {
        LorcanaSimulatorView,
        SimulatorDebugAnimationRequest,
    } from "$lib";
    import * as Sidebar from "$lib/design-system/primitives/sidebar";

    import LorcanaDebugBubble from "./LorcanaDebugBubble.svelte";
    import LorcanaDebugPanel from "./LorcanaDebugPanel.svelte";

    const DEBUG_PANEL_ID = "lorcana-debug-sidebar";

    import type { SimulatorDebugAnimationPlayer } from "$lib";

    interface DebugControlsProps {
        wrapperElement: HTMLDivElement | null;
        fixtureId: string;
        view: LorcanaSimulatorView;
        stateId: number | null;
        serializedState: string;
        serializedBoardProjection: string;
        serializedInteractionPrompt: string;
        onViewChange: (view: LorcanaSimulatorView) => void;
        onFixtureChange?: (fixtureId: string) => void;
        onSwapPlayers: () => void;
        onReset: () => void;
        onRefresh: () => void;
        onRunAnimation: (animation: SimulatorDebugAnimationRequest) => boolean;
        onRunQuestAnimation?: (cardId: string, player: SimulatorDebugAnimationPlayer, loreGained: number) => boolean;
        onRunChallengeAnimation?: (attackerId: string, defenderId: string, player: SimulatorDebugAnimationPlayer, preview: { attackerDamageDealt: number; defenderDamageDealt: number; defenderKind: "character" | "location"; attackerWouldBeBanished: boolean; defenderWouldBeBanished: boolean; attackerDamageIsReduced: boolean; defenderDamageIsReduced: boolean }) => boolean;
    }

    const {
        wrapperElement,
        fixtureId,
        view,
        stateId,
        serializedState,
        serializedBoardProjection,
        serializedInteractionPrompt,
        onViewChange,
        onFixtureChange,
        onSwapPlayers,
        onReset,
        onRefresh,
        onRunAnimation,
        onRunQuestAnimation,
        onRunChallengeAnimation,
    }: DebugControlsProps = $props();

    let isOpen = $state(false);

    function openPanel(): void {
        if (isOpen) {
            return;
        }

        isOpen = true;
    }

    function closePanel(): void {
        isOpen = false;
    }
</script>

<Sidebar.Provider
        bind:open={isOpen}
        class="debug-sidebar-provider"
        style="position: absolute; inset: 0; height: 100%; min-height: 0; width: 100%; overflow: visible; pointer-events: none; z-index: 2147483646; --sidebar-width: min(920px, 74vw); --sidebar-width-icon: 0px;"
>
    <LorcanaDebugBubble
            {isOpen}
            {wrapperElement}
            onOpenPanel={openPanel}
            onSwapPlayers={onSwapPlayers}
    />

    <Sidebar.Root
            id={DEBUG_PANEL_ID}
            side="right"
            collapsible="offcanvas"
            variant="floating"
            class="debug-sidebar-root"
    >
        <LorcanaDebugPanel
                {isOpen}
                {fixtureId}
                {view}
                {stateId}
                {serializedState}
                {serializedBoardProjection}
                {serializedInteractionPrompt}
                {onViewChange}
                {onFixtureChange}
                {onReset}
                {onRefresh}
                {onRunAnimation}
                {onRunQuestAnimation}
                {onRunChallengeAnimation}
                onClose={closePanel}
                onOpenStateChange={(open) => {
                    isOpen = open;
                }}
        />
    </Sidebar.Root>
</Sidebar.Provider>

<style>
    :global(.debug-sidebar-provider) {
        position: absolute;
        inset: 0;
        pointer-events: none;
    }

    :global(.debug-sidebar-provider) :global([data-slot="sidebar-container"]) {
        pointer-events: auto;
    }

    :global(.debug-sidebar-provider) :global([data-slot="sidebar-inner"]) {
        overflow: hidden;
        background: rgba(5, 13, 25, 0.97);
        border-color: rgba(137, 179, 235, 0.25);
        box-shadow:
            0 28px 70px rgba(2, 8, 18, 0.65),
            0 10px 28px rgba(15, 74, 163, 0.22);
    }

    :global(.debug-sidebar-provider) :global(.debug-sidebar-root) {
        z-index: 2147483646;
    }
</style>
