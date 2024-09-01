import type Employee from "~/interfaces/Employee.interface";

export function currentUnixTimestamp() {
  const currentUnixTimestamp = Math.floor(Date.now() / 1000);
  return currentUnixTimestamp;
}

export function convertTimestampToDateTime(timestamp: number) {
  const date = new Date(timestamp * 1000);

  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are 0-based
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);

  const customFormat = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

  return customFormat;
}

// Function to get the key of the enum based on the value
export function getEnumKeyByValue(enumType: any, value: number): string | undefined {
  // Get all the keys of the enum
  const keys = Object.keys(enumType).filter(key => enumType[key] === value);
  
  // Return the first matching key or undefined if not found
  return keys.length > 0 ? keys[0] : undefined;
}

// Extract value of key from complex data
export function extractUniqueValueFromKey<T>(data: T, keyPair: string): string[] {
  const uniqueValue = new Set<string>();

  function traverseData(obj: any): void {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        traverseData(obj[key] as any); // Assuming nested objects
      } else if (key === keyPair) {
        uniqueValue.add(obj[key] as string);
      }
    }
  }

  traverseData(data);

  return Array.from(uniqueValue);
}

// Get current user
export function getCurrentUser(): Employee | null {
  const userData = localStorage.getItem('QLTK_user');
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
}
