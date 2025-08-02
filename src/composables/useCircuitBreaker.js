import { ref, computed } from 'vue'

export function useCircuitBreaker() {
    const FAILURE_THRESHOLD = 3
    const TIMEOUT_DURATION = 60000

    const state = ref('CLOSED')
    const failureCount = ref(0)
    const lastFailureTime = ref(null)

    const canMakeRequest = computed(() => {
        if (state.value === 'CLOSED') return true

        if (state.value === 'OPEN') {
            const now = Date.now()
            if (now - lastFailureTime.value >= TIMEOUT_DURATION) {
                state.value = 'HALF_OPEN'
                return true
            }
            return false
        }

        if (state.value === 'HALF_OPEN') return true
        return false
    })

    const isServiceUnavailable = computed(() => {
        return state.value === 'OPEN'
    })

    const onSuccess = () => {
        failureCount.value = 0
        state.value = 'CLOSED'
        lastFailureTime.value = null
    }

    const onFailure = () => {
        failureCount.value++
            lastFailureTime.value = Date.now()

        if (state.value === 'CLOSED' && failureCount.value >= FAILURE_THRESHOLD) {
            state.value = 'OPEN'

            setTimeout(() => {
                if (state.value === 'OPEN') {
                    state.value = 'HALF_OPEN'
                }
            }, TIMEOUT_DURATION)
        } else if (state.value === 'HALF_OPEN') {
            state.value = 'OPEN'

            setTimeout(() => {
                if (state.value === 'OPEN') {
                    state.value = 'HALF_OPEN'
                }
            }, TIMEOUT_DURATION)
        }
    }

    return {
        state,
        failureCount,
        canMakeRequest,
        isServiceUnavailable,
        onSuccess,
        onFailure
    }
}