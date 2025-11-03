export interface WalletData {
  parkrunBarcode?: string;
  parkrunnerName?: string;
  iceName?: string;
  icePhone?: string;
}

const STORAGE_KEY = "foretoken_wallet";

export function saveWalletData(data: WalletData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save wallet data:", error);
  }
}

export function loadWalletData(): WalletData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load wallet data:", error);
  }
  return {};
}

export function clearWalletData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear wallet data:", error);
  }
}
