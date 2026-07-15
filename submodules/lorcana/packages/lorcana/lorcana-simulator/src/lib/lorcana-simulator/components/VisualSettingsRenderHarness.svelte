<script lang="ts">
  import type { LorcanaEngineBase } from "@tcg/lorcana-engine";
  import type {LorcanaPlayerSettingsMap} from "@/features/simulator/model/player-visual-settings.js";
  import {setLorcanaGameContext} from "@/features/simulator/context/game-context.svelte.js";
  import {setLorcanaSimulatorDndContext} from "@/features/simulator/context/simulator-dnd-context.svelte.js";
  import {setSimulatorCardContext} from "@/features/simulator/context/simulator-card-context.svelte.js";
  import * as Tooltip from "$lib/design-system/primitives/tooltip/index.js";
  import HandZone from "@/features/simulator/board/HandZone.svelte";
  import DeckZone from "@/features/simulator/board/DeckZone.svelte";
  import InkwellZone from "@/features/simulator/board/InkwellZone.svelte";
  import SeatLane from "@/features/simulator/board/SeatLane.svelte";

  interface VisualSettingsRenderHarnessProps {
    engine: LorcanaEngineBase;
    playerSettings?: LorcanaPlayerSettingsMap;
  }

  let { engine, playerSettings = {} }: VisualSettingsRenderHarnessProps = $props();

  setLorcanaGameContext({
    get engine() {
      return engine;
    },
    get playerSettings() {
      return playerSettings;
    },
  });
  setLorcanaSimulatorDndContext();
  setSimulatorCardContext();
</script>

<Tooltip.Provider>
<section>
  <SeatLane
    playerSide="playerOne"
    seat="top"
    isOpponent={true}
    isTurnPlayer={true}
    hasPriority={true}
    seatPosition="top"
  />
  <SeatLane
    playerSide="playerTwo"
    seat="bottom"
    isOpponent={false}
    isTurnPlayer={false}
    hasPriority={false}
    seatPosition="bottom"
  />

  <HandZone playerSide="playerOne" seat="top" isOpponent={true} />
  <DeckZone playerSide="playerOne" seat="top" isOpponent={true} />
  <InkwellZone playerSide="playerOne" seat="top" isOpponent={true} />

  <HandZone playerSide="playerTwo" seat="bottom" isOpponent={false} />
  <DeckZone playerSide="playerTwo" seat="bottom" isOpponent={false} />
  <InkwellZone playerSide="playerTwo" seat="bottom" isOpponent={false} />
</section>
</Tooltip.Provider>
