<script setup>
import { ref } from 'vue';
const blocks = ref(20)
const addBlock = () => {
    blocks.value += 10
}
</script>

<template>
    <div class="h-screen flex flex-col">
        <header class="bg-gray-800 text-white p-4">
            <h1 class="text-2xl font-bold">
                Header
            </h1>
        </header>

        <main class="flex-1 overflow-y-auto bg-gray-100 p-4">
            <div class="max-w-4xl font-semibold text-gray-800">
                <h1 class="text-2xl font-bold">
                    Main
                </h1>
                <div class="grid gap-4">
                    <div v-for="i in blocks" :key="i" class="bg-blue-50 rounded-lg border">
                        <h3 class="font-semibold"> block {{ i }}</h3>
                        <span>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rerum, libero? Quas doloremque
                            esse repellendus animi. Hic consequuntur ab aliquid nisi, cum possimus mollitia, odit
                            nostrum tempore animi saepe. Distinctio, reiciendis?</span>
                    </div>

                </div>
                <button @click="addBlock" class="px-4 py2 bg-blue-600  text-white hover:bg-blue-700">
                    add blocks
                </button>
            </div>
        </main>

        <footer class="bg-gray-800 text-white p-4">
            <h1 class="text-2xl font-bold">
                footer
            </h1>
        </footer>
    </div>

</template>