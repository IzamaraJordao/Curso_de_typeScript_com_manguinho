import { CachePolicy } from "./../../protocols/cache/cache-policy";
import { SavePurchases, LoadPurchases } from "@/domain/usecases";
import { CacheStore } from "../../protocols/cache";

export class LocalLoadPurchases implements SavePurchases, LoadPurchases {
  constructor(
    private readonly cacheStore: CacheStore,
    private readonly currentDate: Date
  ) {}

  async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    this.cacheStore.delete("purchases");
    this.cacheStore.insert("purchases", {
      timestamp: this.currentDate,
      value: purchases,
    });
  }
  async loadAll(): Promise<Array<LoadPurchases.Result>> {
    try {
      const cache = this.cacheStore.fetch("purchases");
      if (CachePolicy.validate(cache.timestamp, this.currentDate)) {
        return cache.value;
      } else {
        return [];
      }
    } catch {
      return [];
    }
  }
  validate(): void {
    try {
      const cache = this.cacheStore.fetch("purchases");
      if (!CachePolicy.validate(cache.timestamp, this.currentDate)) {
        throw new Error();
      }
    } catch (error) {
      this.cacheStore.delete("purchases");
    }
  }
}
