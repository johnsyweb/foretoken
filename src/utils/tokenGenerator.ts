export function positionToToken(position: number): string {
  if (position < 1 || !Number.isInteger(position)) {
    throw new Error("Position must be a positive integer");
  }
  return `P${position}`;
}

export function tokenToPosition(token: string): number {
  const match = token.match(/^P(\d+)$/);
  if (!match) {
    throw new Error("Invalid token format. Expected P followed by digits");
  }
  return parseInt(match[1], 10);
}

export function isValidPosition(position: number): boolean {
  return Number.isInteger(position) && position >= 1;
}
