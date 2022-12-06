import { CacheStore } from "@/data/protocols/cache";
import { LocalLoadPurchases } from "@/data/usecases/load-purchases/local-load-purchases";
import { SavePurchases } from "@/domain/usecases/save-purcheses";
import { mockPurchases } from "@/data/test";
import { CacheStoreSpy,getCacheExpirationDate } from "@/data/test";

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
  test("Should return empty list if load fails", async() => {
    const { cacheStore,sut } = makeSut();
    cacheStore.simulateFetchError();
    const purchases =await sut.loadAll();
    expect(cacheStore.message).toEqual([CacheStoreSpy.Message.fetch]);
    expect(purchases).toEqual([]);
  });
  test("Should return an empty list if cache is empty  ", async() => {
    const currentDate = new Date();
    const timestamp = getCacheExpirationDate(currentDate);
    timestamp.setSeconds(currentDate.getSeconds() + 1);
    const { cacheStore,sut } = makeSut(currentDate);
    cacheStore.fetchResult = {
      timestamp,
       value:[]};
    const purchases = await sut.loadAll();
    expect(cacheStore.message).toEqual([CacheStoreSpy.Message.fetch]);
    expect(cacheStore.fetchKey).toBe("purchases");
    expect(purchases).toEqual([]);
  });
  test("Should return a list of purchases if cache is valid ", async() => {
    const currentDate = new Date();
    const timestamp = getCacheExpirationDate(currentDate);
    timestamp.setDate(currentDate.getDate() - 3);
    timestamp.setSeconds(currentDate.getSeconds() + 1);
    const { cacheStore,sut } = makeSut(currentDate);
    cacheStore.fetchResult = {
      timestamp,
       value:mockPurchases()};
    const purchases = await sut.loadAll();
    expect(cacheStore.message).toEqual([CacheStoreSpy.Message.fetch]);
    expect(cacheStore.fetchKey).toBe("purchases");
    expect(purchases).toEqual(cacheStore.fetchResult.value);
  });
  test('should have no side effercts if cache is expired', async () => {
    const currentDate = new Date();
    const timestamp = getCacheExpirationDate(currentDate);
    timestamp.setSeconds(currentDate.getSeconds() - 1);
    const { cacheStore, sut } = makeSut(currentDate);
    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases()
    };
    const purchases = await sut.loadAll();
    expect(cacheStore.message).toEqual([CacheStoreSpy.Message.fetch]);
    expect(cacheStore.fetchKey).toBe('purchases');
    expect(purchases).toEqual([]);
  });
  test('should return an empty list cache is on expiration date', async () => {
    const currentDate = new Date();
    const timestamp = getCacheExpirationDate(currentDate);
    const { cacheStore, sut } = makeSut(currentDate);
    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases()
    };
    const purchases = await sut.loadAll();
    expect(cacheStore.message).toEqual([CacheStoreSpy.Message.fetch]);
    expect(cacheStore.fetchKey).toBe('purchases');
    expect(purchases).toEqual([]);
  });
  
});

