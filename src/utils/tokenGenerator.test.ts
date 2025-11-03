import {
  positionToToken,
  tokenToPosition,
  isValidPosition,
} from "./tokenGenerator";

describe("positionToToken", () => {
  it("converts position 1 to P0001", () => {
    expect(positionToToken(1)).toBe("P0001");
  });

  it("converts position 308 to P0308", () => {
    expect(positionToToken(308)).toBe("P0308");
  });

  it("converts position 9999 to P9999", () => {
    expect(positionToToken(9999)).toBe("P9999");
  });

  it("pads single digit positions with zeros", () => {
    expect(positionToToken(5)).toBe("P0005");
  });

  it("pads positions up to 4 digits, then no padding", () => {
    expect(positionToToken(12345)).toBe("P12345");
    expect(positionToToken(99999)).toBe("P99999");
    expect(positionToToken(100000)).toBe("P100000");
  });

  it("throws error for position less than 1", () => {
    expect(() => positionToToken(0)).toThrow();
    expect(() => positionToToken(-1)).toThrow();
  });

  it("throws error for non-integer positions", () => {
    expect(() => positionToToken(1.5)).toThrow();
  });
});

describe("tokenToPosition", () => {
  it("converts P0001 to position 1", () => {
    expect(tokenToPosition("P0001")).toBe(1);
  });

  it("converts P0308 to position 308", () => {
    expect(tokenToPosition("P0308")).toBe(308);
  });

  it("converts P9999 to position 9999", () => {
    expect(tokenToPosition("P9999")).toBe(9999);
  });

  it("converts large tokens", () => {
    expect(tokenToPosition("P12345")).toBe(12345);
    expect(tokenToPosition("P99999")).toBe(99999);
    expect(tokenToPosition("P100000")).toBe(100000);
  });

  it("throws error for invalid format", () => {
    expect(() => tokenToPosition("A1")).toThrow();
    expect(() => tokenToPosition("p1")).toThrow();
    expect(() => tokenToPosition("P")).toThrow();
    expect(() => tokenToPosition("P1A")).toThrow();
  });
});

describe("isValidPosition", () => {
  it("returns true for valid positions", () => {
    expect(isValidPosition(1)).toBe(true);
    expect(isValidPosition(308)).toBe(true);
    expect(isValidPosition(9999)).toBe(true);
    expect(isValidPosition(12345)).toBe(true);
    expect(isValidPosition(99999)).toBe(true);
    expect(isValidPosition(100000)).toBe(true);
  });

  it("returns false for invalid positions", () => {
    expect(isValidPosition(0)).toBe(false);
    expect(isValidPosition(-1)).toBe(false);
    expect(isValidPosition(1.5)).toBe(false);
  });
});
