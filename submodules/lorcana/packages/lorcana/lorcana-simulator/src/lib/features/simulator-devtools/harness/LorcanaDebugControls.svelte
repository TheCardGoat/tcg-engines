<script lang="ts">
    import type {
        LorcanaSimulatorView,
        SimulatorDebugAnimationRequest,
    } from "$lib";

    import LorcanaDebugBubble from "./LorcanaDebugBubble.svelte";
    import type LorcanaDebugPanelContainer from "./LorcanaDebugPanelContainer.svelte";

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
    let DebugPanelContainer = $state<typeof LorcanaDebugPanelContainer | null>(null);

    function openPanel(): void {
        if (isOpen) {
            return;
        }

        isOpen = true;
    }

    function closePanel(): void {
        isOpen = false;
    }

    $effect(() => {
        if (!isOpen || DebugPanelContainer) {
            return;
        }

        void import("./LorcanaDebugPanelContainer.svelte").then((module) => {
            DebugPanelContainer = module.default;
        });
    });
</script>

<LorcanaDebugBubble
        {isOpen}
        {wrapperElement}
        onOpenPanel={openPanel}
/>

{#if DebugPanelContainer}
    {@const PanelContainer = DebugPanelContainer}
    <PanelContainer
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
            onOpenStateChange={(open: boolean) => {
                isOpen = open;
            }}
    />
{/if}
