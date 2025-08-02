import { ref, watch } from 'vue'


const theme = ref('light')
const fontSize = ref('medium')

const initializePreference = () => {
    const storedTheme = localStorage.getItem('userTheme')
    const storedFontSize = localStorage.getItem('userFontSize')

    if (storedTheme && ['light', 'dark'].includes(storedTheme)) {
        theme.value = storedTheme
    }

    if (storedFontSize && ['small', 'medium', 'large'].includes(storedFontSize)) {
        fontSize.value = storedFontSize
    }
}


watch(
    theme,
    (newTheme) => {
        localStorage.setItem('userTheme', newTheme)
    }, { immediate: false }
)

watch(
    fontSize,
    (newFontSize) => {
        localStorage.setItem('userFontSize', newFontSize)
    }, { immediate: false }
)

initializePreference


export function useUserPreference() {
    return {
        theme,
        fontSize
    }
}