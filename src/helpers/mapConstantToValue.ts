export const mapConstantArrayToValue = (
  constantArray: any[],
  lookupKey: string,
  targetKey: string,
  value: string
): string => {
  const result = constantArray.find((item: any) => item[lookupKey] === value);
  if (!result) return value;

  return result[targetKey];
};
