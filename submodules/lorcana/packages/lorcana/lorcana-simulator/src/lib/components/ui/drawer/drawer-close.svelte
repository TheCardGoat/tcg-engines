<script lang="ts">
	import { Dialog } from "bits-ui";

	let { ref = $bindable(null), ...restProps }: Dialog.CloseProps = $props();
</script>

<Dialog.Close bind:ref data-slot="drawer-close" {...restProps} />
