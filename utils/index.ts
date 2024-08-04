export function currentUnixTimestamp() {
  const currentUnixTimestamp = Math.floor(Date.now() / 1000);
  return currentUnixTimestamp;
}

// Function to get the key of the enum based on the value
export function getEnumKeyByValue(enumType: any, value: number): string | undefined {
  // Get all the keys of the enum
  const keys = Object.keys(enumType).filter(key => enumType[key] === value);
  
  // Return the first matching key or undefined if not found
  return keys.length > 0 ? keys[0] : undefined;
}
