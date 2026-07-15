<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { set13CharactersSteelBoardFixture as fixture } from "@/features/simulator-devtools/fixtures/set13-characters-steel-board.js";

const browserTransport = { mode: "sync" } as const;
</script>

<LorcanaBrowserHarnessView {browserTransport} {fixture} view="playerOne" />
