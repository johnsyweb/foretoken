import { saveWalletData, loadWalletData, clearWalletData } from "./wallet";

describe("wallet", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("saveWalletData", () => {
    it("saves wallet data to localStorage", () => {
      const data = {
        parkrunBarcode: "A1234567",
        iceName: "Jane Doe",
        icePhone: "+61 400 000 000",
      };
      saveWalletData(data);
      expect(localStorage.getItem("foretoken_wallet")).toBe(
        JSON.stringify(data)
      );
    });

    it("saves partial data", () => {
      const data = { parkrunBarcode: "A1234567" };
      saveWalletData(data);
      expect(loadWalletData()).toEqual(data);
    });
  });

  describe("loadWalletData", () => {
    it("loads wallet data from localStorage", () => {
      const data = {
        parkrunBarcode: "A1234567",
        iceName: "Jane Doe",
        icePhone: "+61 400 000 000",
      };
      localStorage.setItem("foretoken_wallet", JSON.stringify(data));
      expect(loadWalletData()).toEqual(data);
    });

    it("returns empty object when no data exists", () => {
      expect(loadWalletData()).toEqual({});
    });
  });

  describe("clearWalletData", () => {
    it("removes wallet data from localStorage", () => {
      saveWalletData({ parkrunBarcode: "A1234567" });
      clearWalletData();
      expect(loadWalletData()).toEqual({});
    });
  });
});
