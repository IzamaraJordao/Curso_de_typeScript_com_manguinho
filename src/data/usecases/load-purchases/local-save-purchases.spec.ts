import { CacheStore } from "@/data/protocols/cache";
import { LocalLoadPurchases } from "@/data/usecases/load-purchases/local-load-purchases";
import { SavePurchases } from "@/domain/usecases/save-purcheses";
import { mockPurchases } from "@/data/test";
import { CacheStoreSpy } from "@/data/test";

type SutTypes = {
  sut: LocalLoadPurchases;
  cacheStore: CacheStoreSpy;
};
const makeSut = (timestamp = new Date() ): SutTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalLoadPurchases(cacheStore, timestamp);
  return {
    sut,
    cacheStore,
  };
};

describe("LocalSavePurchases", () => {
  test("Should not delete or insert cache on sut.init", () => {
    const { cacheStore } = makeSut();
    expect(cacheStore.message).toEqual([]);
  });

  test("Should not insert new cache if delete fails", async () => {
    const { cacheStore, sut } = makeSut();
    cacheStore.simulateDeleteError();
    const promise = sut.save(mockPurchases());
    expect(cacheStore.message).toEqual([CacheStoreSpy.Message.delete]);
    await expect(promise).rejects.toThrow();
  });
  test("Should insert new cache if delete succeds", async () => {
    const timestamp = new Date();
    const { cacheStore, sut } = makeSut(timestamp);
    const purchases = mockPurchases();
    const promise =  sut.save(purchases);
    expect(cacheStore.message).toEqual([CacheStoreSpy.Message.delete,CacheStoreSpy.Message.insert]);
    expect(cacheStore.insertKey).toBe("purchases");
    expect(cacheStore.insertValues).toEqual({
      timestamp,
      value: purchases,
    });
    await expect(promise).resolves.toBeFalsy();
  });
  test("Should thorw if insert throws", async () => {
    const { cacheStore, sut } = makeSut();
    cacheStore.simulateInsertError();
    const promise = sut.save(mockPurchases());
    expect(cacheStore.message).toEqual([CacheStoreSpy.Message.delete,CacheStoreSpy.Message.insert]);
   await expect(promise).rejects.toThrow();
  });
});
