const gems = [
    { name: 'Crystal', weight: 22 },
    { name: 'Shard', weight: 19 },
    { name: 'Prism', weight: 17 },
    { name: 'Obelisk', weight: 15 },
    { name: 'Orb', weight: 12 },
    { name: 'Jewel', weight: 9 },
    { name: 'Hexa', weight: 5 },
    { name: 'Cluster', weight: 1 }
]

const typeRange = {
    Crystal: [1, 10],
    Shard: [10, 20], 
    Prism: [10, 30], 
    Obelisk: [20, 40], 
    Orb: [20, 50], 
    Jewel: [30, 60], 
    Hexa: [30, 70], 
    Cluster: [40, 100],     
}

const colorRange = {
    Red: 1.5,
    Gold: 1,
    Light_Green: 1.5,
    Turquoise: 2,
    Blue: 2.5,
    Dark_Blue: 3,
    Lilac: 3.5,
    Purple: 4
} 

const levelType = {
    Crystal: 1,
    Shard: 2, 
    Prism: 3, 
    Obelisk: 4, 
    Orb: 5, 
    Jewel: 6, 
    Hexa: 7, 
    Cluster: 8,
}

const levelColor = {
    Red: 1,
    Gold: 2,
    Light_Green: 3,
    Turquoise: 4,
    Blue: 5,
    Dark_Blue: 6,
    Lilac: 7,
    Purple: 8
}

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

export const randomNumberAdd = (name) => {
    const parts = name.split("_")
    const type = parts[0]
    const color = parts.slice(1).join("_")
    
    const [min, max] = typeRange[type]
    
    const base = getRandomNumber(min, max)
    const value = base + base * colorRange[color]
    
    return Math.floor(value)
}

export const addLevelInfo = (name) => {
    const parts = name.split("_")
    const type = parts[0]
    const color = parts.slice(1).join("_")

    return [levelType[type], levelColor[color]]
}