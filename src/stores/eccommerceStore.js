// stores/ecommerceStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useEcommerceStore = defineStore('ecommerce', () => {
    const customers = ref([
        { id: 1, name: 'Ahmad', city: 'Tehran' },
        { id: 2, name: 'Mehran', city: 'Shiraz' },
        { id: 3, name: 'Ali', city: 'Esfahan' },
    ])

    const products = ref([
        { id: 101, name: 'Laptop', category: 'Electronics' },
        { id: 102, name: 'Mouse', category: 'Electronics' },
        { id: 103, name: 'Monitor', category: 'Electronics' },
        { id: 104, name: 'Coffee Maker', category: 'Home Appliances' },
        { id: 105, name: 'Blender', category: 'Home Appliances' },
        { id: 106, name: 'Headphones', category: 'Electronics' },
    ])

    const purchases = ref([
        { customerId: 1, productId: 101, date: '2025-03-01' },
        { customerId: 1, productId: 102, date: '2025-02-02' },
        { customerId: 2, productId: 103, date: '2025-02-05' },
        { customerId: 2, productId: 104, date: '2025-02-06' },
        { customerId: 3, productId: 105, date: '2025-02-07' },
        { customerId: 3, productId: 106, date: '2025-02-08' },
        { customerId: 1, productId: 104, date: '2025-02-10' },
    ])

    const cart = ref(JSON.parse(localStorage.getItem('cart') || '[]'))

    const productsByCustomer = computed(() => {
        return purchases.value.reduce((acc, purchase) => {
            if (!acc[purchase.customerId]) acc[purchase.customerId] = []
            const product = products.value.find((p) => p.id === purchase.productId)
            if (product) acc[purchase.customerId].push(product)
            return acc
        }, {})
    })

    const mostPurchasedCategoryByCustomer = computed(() => {
        const result = {}
        const customerProducts = productsByCustomer.value

        for (const customerId in customerProducts) {
            const categoryCount = {}
            customerProducts[customerId].forEach((product) => {
                categoryCount[product.category] = (categoryCount[product.category] || 0) + 1
            })

            const maxCategory = Object.keys(categoryCount).reduce((a, b) =>
                categoryCount[a] > categoryCount[b] ? a : b,
            )
            result[customerId] = maxCategory
        }
        return result
    })

    const getRecommendations = computed(() => (customerId) => {
        const customerCategory = mostPurchasedCategoryByCustomer.value[customerId]
        if (!customerCategory) return []

        const similarCustomers = Object.entries(mostPurchasedCategoryByCustomer.value)
            .filter(([id, cat]) => cat === customerCategory && id !== String(customerId))
            .map(([id]) => Number(id))

        const recommendedProductsSet = new Set()
        const customerPurchasedIds = new Set(
            purchases.value.filter((p) => p.customerId === customerId).map((p) => p.productId),
        )

        similarCustomers.forEach((similarCustomerId) => {
            const productsPurchased = productsByCustomer.value[similarCustomerId] || []
            productsPurchased.forEach((product) => {
                if (product.category === customerCategory && !customerPurchasedIds.has(product.id)) {
                    recommendedProductsSet.add(product)
                }
            })
        })

        return Array.from(recommendedProductsSet)
    })

    const getCityFilteredRecommendations = computed(() => (customerId) => {
        const customer = customers.value.find((c) => c.id === customerId)
        if (!customer) return []

        const sameCityCustomers = customers.value
            .filter((c) => c.city === customer.city && c.id !== customerId)
            .map((c) => c.id)

        const customerCategory = mostPurchasedCategoryByCustomer.value[customerId]
        if (!customerCategory) return []

        const recommendedProductsSet = new Set()
        const customerPurchasedIds = new Set(
            purchases.value.filter((p) => p.customerId === customerId).map((p) => p.productId),
        )

        sameCityCustomers.forEach((cityCustomerId) => {
            const cityCustomerCategory = mostPurchasedCategoryByCustomer.value[cityCustomerId]
            if (cityCustomerCategory === customerCategory) {
                const productsPurchased = productsByCustomer.value[cityCustomerId] || []
                productsPurchased.forEach((product) => {
                    if (product.category === customerCategory && !customerPurchasedIds.has(product.id)) {
                        recommendedProductsSet.add(product)
                    }
                })
            }
        })

        return Array.from(recommendedProductsSet)
    })

    const addToCart = (product, quantity = 1) => {
        const existingItem = cart.value.find((item) => item.id === product.id)
        if (existingItem) {
            existingItem.quantity += quantity
        } else {
            cart.value.push({...product, quantity })
        }
        localStorage.setItem('cart', JSON.stringify(cart.value))
    }

    const removeFromCart = (productId) => {
        const index = cart.value.findIndex((item) => item.id === productId)
        if (index > -1) {
            cart.value.splice(index, 1)
            localStorage.setItem('cart', JSON.stringify(cart.value))
        }
    }

    const updateCartQuantity = (productId, quantity) => {
        const item = cart.value.find((item) => item.id === productId)
        if (item) {
            item.quantity = quantity
            if (quantity <= 0) {
                removeFromCart(productId)
            } else {
                localStorage.setItem('cart', JSON.stringify(cart.value))
            }
        }
    }

    const clearCart = () => {
        cart.value = []
        localStorage.removeItem('cart')
    }

    return {
        customers,
        products,
        purchases,
        cart,
        productsByCustomer,
        mostPurchasedCategoryByCustomer,
        getRecommendations,
        getCityFilteredRecommendations,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
    }
})