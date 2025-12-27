import type { Animal } from '@/domain/animal'

const ANIMALS: Record<string, Animal> = {
    '40': {
        about:
            "L'éléphant de forêt d'Afrique est une espèce qui vit dans les forêts d'Afrique centrale et de l'Ouest. C'est un animal imposant qui peut atteindre une taille de 2,5 mètres au garrot et un poids de 2 à 3 tonnes. Les éléphants de forêt sont connus pour leur intelligence et leur mémoire exceptionnelles, ainsi que pour leur comportement social complexe.",
        category: 'MAMMIFERE',
        class: 'mammifere',
        environments: ['land'],
        height: '2,5 mètres au garrot',
        longevity: "jusqu'à 70 ans",
        name: "Eléphant de forêt d'Afrique",
        rareness: 'CR',
        scientificName: 'Loxodonta cyclotis',
        weight: '2 à 3 tonnes',
    },
}

export function getMockAnimalById(id: string): Animal | null {
    return ANIMALS[id] ?? null
}
