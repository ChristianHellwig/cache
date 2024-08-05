const TIMEOUT_MS = 60000;

export class Cache<T> {
  private data: Array<{ key: string; value: T; timestamp: number }> = [];
  private maxSize: number;

  // Cache with timeout functionality.
  /**
   * @param {number}  maxSize - Maximum number of items the cache can store
   */
  constructor(maxSize: number = 3) {
    this.maxSize = maxSize;
  }

  // Add or update a cache item
  /**
   * @param {string}  key - Key of the item
   * @param {T} value - Value of the item
   */
  set(key: string, value: T): void {
    const existingIndex = this.data.findIndex((item) => item.key === key);
    if (existingIndex !== -1) {
      // Update existing item
      this.data[existingIndex].value = value;
      this.data[existingIndex].timestamp = Date.now();
    } else {
      // Add new item
      if (this.data.length >= this.maxSize) {
        this.data.shift();
      }
      this.data.push({ key, value, timestamp: Date.now() });
    }

    this.cleanUp();
  }

  // Returns the item with the given key or undefined if the key does not exist
  /**
   * @param {string}  key - Key of the item
   */
  get(key: string): T | undefined {
    const item = this.data.find((item) => item.key === key);
    return item ? item.value : undefined;
  }

  // Remove outdated items
  private cleanUp(): void {
    const currentTime = Date.now();
    for (let i = 0; i < this.data.length; i++) {
      if (currentTime - this.data[i].timestamp > TIMEOUT_MS) {
        this.data.splice(i, 1);
      }
    }
  }
}
