// src/services/animalService.ts
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage'
import { app } from '@/firebase'
import type { Animal } from '@/domain/animal'
import { getMockAnimalById } from '@/mocks/animals.mock'

export const USE_MOCK = true

export async function fetchAnimalForToken(_tokenId: string): Promise<{ animal: Animal; animalKey: string } | null> {
    if (USE_MOCK) {
        const animalKey = '1'
        const mockAnimalId = '40'
        const animal = getMockAnimalById(mockAnimalId)
        return animal ? { animal, animalKey } : null
    }

    // later: firebase token->animalId, etc
    return null
}

export async function fetchAnimalImageUrl(animalKey: string): Promise<string | null> {
    try {
        const storage = getStorage(app)
        const path = `Animax/${animalKey}/main.webp`
        return await getDownloadURL(storageRef(storage, path))
    } catch {
        return null
    }
}
