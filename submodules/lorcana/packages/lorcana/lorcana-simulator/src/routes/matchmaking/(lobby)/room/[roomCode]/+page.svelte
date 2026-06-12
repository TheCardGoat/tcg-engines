<script lang="ts">
  import { page } from "$app/state";
  import { onMount, onDestroy } from "svelte";
  import LobbyRoomScreen from "$lib/features/matchmaking/ui/LobbyRoomScreen.svelte";
  import { getMatchmakingLobbyContext } from "$lib/features/matchmaking/ui/useMatchmakingLobbyController.svelte.js";

  const PAGE_TITLE = "Game Room - Lorcana Simulator";
  const controller = getMatchmakingLobbyContext();

  let pollingIntervalId: ReturnType<typeof setInterval> | null = null;
  let startedGameDetectionCount = 0;

  onMount(async () => {
    const roomCode = page.params.roomCode;
    if (roomCode) {
      console.log("[room-page] mounting", { roomCode });

      // Initial hydration
      await controller.hydrateRoom(roomCode);

      // Ensure WebSocket is connected (in case this page was loaded directly)
      if (controller.gateway.status === "idle" || controller.gateway.status === "disconnected") {
        console.log("[room-page] WebSocket not connected, initiating connection");
        controller.gateway.connect();
      }

      // Start polling for room updates every 5 seconds
      let pollInFlight = false;
      pollingIntervalId = setInterval(async () => {
        if (pollInFlight) return;
        pollInFlight = true;
        try {
          await controller.pollRoomStatus();
        } finally {
          pollInFlight = false;
        }

        // Detect if a game has been started but WebSocket message didn't arrive
        if (
          controller.lobby.roomCode &&
          controller.lobby.status !== "starting" &&
          controller.lobby.status !== "match_found" &&
          (controller.lobby.isCreator || controller.lobby.opponentName)
        ) {
          // We're in a valid room state, check if game was somehow started
          startedGameDetectionCount++;
          if (startedGameDetectionCount > 3) {
            // If we've polled 3 times and something looks wrong, log it
            console.warn("[room-page] game might have started but no navigation yet", {
              lobbyStatus: controller.lobby.status,
              detectionCount: startedGameDetectionCount,
            });
          }
        } else {
          startedGameDetectionCount = 0;
        }
      }, 5000);

      console.log("[room-page] polling started for room", { roomCode });
    }
  });

  onDestroy(() => {
    if (pollingIntervalId !== null) {
      clearInterval(pollingIntervalId);
      console.log("[room-page] polling stopped");
    }
  });
</script>

<svelte:head>
  <title>{PAGE_TITLE}</title>
</svelte:head>

<LobbyRoomScreen
  status={controller.lobby.status}
  roomCode={controller.lobby.roomCode}
  creatorName={controller.lobby.creatorName}
  creatorDeckName={controller.lobby.creatorDeckName}
  opponentName={controller.lobby.opponentName}
  opponentDeckName={controller.lobby.opponentDeckName}
  isCreator={controller.lobby.isCreator}
  selectedMode={controller.lobby.selectedMode}
  error={controller.lobby.error}
  onCancel={() => controller.handleCancelLobbyRoom()}
  onStart={() => controller.handleStartLobbyRoom()}
  onLeave={() => controller.handleLeaveLobbyRoom()}
  onBack={() => controller.handleBackFromLobbyRoom()}
/>
