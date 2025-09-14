const gems = [
    { name: 'Crystal', weight: 15 },
    { name: 'Shard', weight: 15 },
    { name: 'Prism', weight: 15 },
    { name: 'Obelisk', weight: 15 },
    { name: 'Orb', weight: 15 },
    { name: 'Jewel', weight: 10 },
    { name: 'Hexa', weight: 10 },
    { name: 'Cluster', weight: 5 }
]

export const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getRandomItemByCategory = () => {
    const random = Math.random() * 100
    if (random < 30) {
        const categories = ['Weapon', 'Body', 'Shield', 'Head', 'Leg', 'Jewelry']
        const index = Math.floor(Math.random() * categories.length)
        return { category : categories[index], type: null }
    }
    else {
        const totalWeight = gems.reduce((sum, g) => sum + g.weight, 0)
        let r = Math.random() * totalWeight

        for (let gem of gems) {
            if (r < gem.weight) return { category: 'Gem', type: gem.name }
            r -= gem.weight
        }
    }
}