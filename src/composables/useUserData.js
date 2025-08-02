import { ref, watchEffect } from 'vue'
import axios from 'axios'

const cache = new Map()
const cacheSize = ref(0)
let currentController = null

export function useUserData() {
    const userData = ref(null)
    const loading = ref(false)
    const error = ref(null)
    const userId = ref(null)

    const fetchUserData = async(id) => {
        if (!id) return

        if (cache.has(id)) {
            console.log(`✅ Cache hit for user ${id}`)
            userData.value = cache.get(id)
            loading.value = false
            return
        }

        if (currentController) {
            console.log(`Cancelling previous request`)
            currentController.abort()
        }

        currentController = new AbortController()
        console.log(`Starting request for user ${id}`)

        loading.value = true
        error.value = null

        try {
            const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`, {
                signal: currentController.signal,
            })

            console.log(`Request completed for user ${id}`)

            cache.set(id, response.data)
            cacheSize.value = cache.size

            userData.value = response.data
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log(`Request cancelled for user ${id}`)
            } else {
                console.log(`Request failed for user ${id}:`, err.message)
                error.value = err
            }
        } finally {
            loading.value = false
            currentController = null
        }
    }

    watchEffect(() => {
        fetchUserData(userId.value)
    })

    const setUserId = (id) => {
        userId.value = id
    }

    const clearCache = () => {
        cache.clear()
        cacheSize.value = 0
        console.log('🗑️ Cache cleared')
    }

    return {
        userData,
        loading,
        error,
        userId,
        cacheSize,
        setUserId,
        clearCache,
    }
}