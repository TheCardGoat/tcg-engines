<script lang="ts">
    let url = $state('https://posthog.com');
    let inputUrl = $state('https://posthog.com');
    let iframeSrc = $state('https://posthog.com');

    function navigate() {
        if (!inputUrl.startsWith('http')) {
            inputUrl = 'https://' + inputUrl;
        }
        url = inputUrl;
        iframeSrc = url;
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            navigate();
        }
    }
</script>

<div class="flex flex-col h-full">
    <div class="h-10 bg-gray-100 border-b border-gray-200 flex items-center px-2 gap-2">
        <div class="flex gap-1">
            <button class="p-1 hover:bg-gray-200 rounded text-gray-600">←</button>
            <button class="p-1 hover:bg-gray-200 rounded text-gray-600">→</button>
            <button class="p-1 hover:bg-gray-200 rounded text-gray-600">↻</button>
        </div>
        <input 
            type="text" 
            bind:value={inputUrl}
            onkeydown={handleKeydown}
            class="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
    </div>
    <div class="flex-1 bg-white relative">
        <iframe 
            src={iframeSrc} 
            title="Browser"
            class="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms"
        ></iframe>
    </div>
</div>
