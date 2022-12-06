import { LocalLoadPurchases } from "@/data/usecases/load-purchases/local-load-purchases";
import { CacheStoreSpy, getCacheExpirationDate, mockPurchases} from "@/data/test";

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

  test("Should delete cache list if load fails",() => {
    const { cacheStore,sut } = makeSut();
    cacheStore.simulateFetchError();
     sut.validate();
    expect(cacheStore.message).toEqual([CacheStoreSpy.Message.fetch,CacheStoreSpy.Message.delete]);
    expect(cacheStore.deleteKey).toBe("purchases");
    
  });
  test('Should has no side effect if load succeds ',() => {
    const currentDate = new Date();
    const timestamp = getCacheExpirationDate(currentDate);
    timestamp.setSeconds(currentDate.getSeconds() + 1);
    const { cacheStore, sut } = makeSut(currentDate);
    cacheStore.fetchResult = {
      timestamp
    };
    sut.validate();
    expect(cacheStore.message).toEqual([CacheStoreSpy.Message.fetch]);
    expect(cacheStore.fetchKey).toBe('purchases');
  });

  test('should delete cache if it is expired', () => {
    const currentDate = new Date();
    const timestamp = getCacheExpirationDate(currentDate);
    timestamp.setSeconds(currentDate.getSeconds() - 1);
    const { cacheStore, sut } = makeSut(currentDate);
    cacheStore.fetchResult = {timestamp};
    sut.validate();
    expect(cacheStore.message).toEqual([CacheStoreSpy.Message.fetch, CacheStoreSpy.Message.delete]);
    expect(cacheStore.fetchKey).toBe('purchases');
    expect(cacheStore.deleteKey).toBe('purchases');
    
   
  });

  test('should delete cache if its on expiration date' , () => {  
    const currentDate = new Date();
    const timestamp = getCacheExpirationDate(currentDate);
    const { cacheStore, sut } = makeSut(currentDate);
    cacheStore.fetchResult = {timestamp };
    sut.validate();
    expect(cacheStore.message).toEqual([CacheStoreSpy.Message.fetch, CacheStoreSpy.Message.delete]);
    expect(cacheStore.fetchKey).toBe('purchases');
    expect(cacheStore.deleteKey).toBe('purchases');
  });
});

