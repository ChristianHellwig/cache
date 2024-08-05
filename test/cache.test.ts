import { Cache } from "../src/cache"


describe('Cache', () => {
    const cacheSize = 10
    let cache: Cache<number>

    beforeEach(async() => {
        cache = new Cache(cacheSize)
    })


    it('should add a single item to the cache and get it', async () => {
        cache.set('A', 10)
        expect(cache.get('A')).toBe(10)
    })

    it('should add a multiple items to the cache and get them', async () => {
        for (let i = 0; i < cacheSize; i++)
            cache.set(`Item ${i}`, i)

        for (let i = 0; i < cacheSize; i++)
            expect(cache.get(`Item ${i}`)).toBe(i)
    })


    it('should exceed cache size and drop first item', async () => {
        for (let i = 0; i < cacheSize + 1; i++)
            cache.set(`Item ${i}`, i)

        expect(cache.get(`Item 0`)).toBeUndefined()

        for (let i = 1; i < cacheSize + 1; i++)
            expect(cache.get(`Item ${i}`)).toBe(i)
    })

    it('should drop outdated items when adding a new item', async () => {
        for (let i = 0; i < cacheSize; i++)
            cache.set(`Item ${i}`, i)

        // Force the timeout
        const currentTime = Date.now();
        cache['data'][3].timestamp = currentTime - 70000;
        cache['data'][4].timestamp = currentTime - 70000;
        cache['data'][5].timestamp = currentTime - 70000;

        // Trigger cache limit and timeout cleanup
        cache.set('trigger', 100);

        // Cache limit exeeded 
        expect(cache.get(`Item 0`)).toBeUndefined()

        // Normal
        expect(cache.get(`Item 1`)).toEqual(1)
        expect(cache.get(`Item 2`)).toEqual(2)

        // Timeout
        expect(cache.get(`Item 3`)).toBeUndefined()
        expect(cache.get(`Item 4`)).toBeUndefined()
        expect(cache.get(`Item 5`)).toBeUndefined()

        // Normal
        expect(cache.get(`Item 6`)).toEqual(6)
    })
})