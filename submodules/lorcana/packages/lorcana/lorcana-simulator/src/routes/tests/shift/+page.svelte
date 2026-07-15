<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { shiftFixture as fixture } from "@/features/simulator-devtools/fixtures/shift.js";
</script>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
