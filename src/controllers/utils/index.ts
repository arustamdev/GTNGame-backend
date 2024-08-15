import { randomInt } from 'crypto';

export function generateRandomNumber() {
  const number = randomInt(0, 10000);
  if (number < 1000) {
    return number.toString().padStart(4, '0');
  }
  return number.toString();
}

export function validateNumber(number: string | undefined): boolean {
  if (!number) {
    return false;
  }
  return /^\d{4}$/.test(number);
}

export function compareNumbers(n1: string, n2: string): number {
  if (n1.length !== n2.length) {
    return 0;
  }

  let sum = 0;
  for (let i = 0; i < n1.length; i++) {
    if (n1[i] === n2[i]) {
      sum++;
    }
  }
  return sum;
}
