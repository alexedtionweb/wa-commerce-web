// Browser Compatibity: IE >= 11, Edge >= 12, Firefox >= 54, Safari >= 9, Chrome >= 55, Opera >= 50
export const toLocaleCurrency = (value: number, currency: string): string => {
  try {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value / 100);
  } catch (err) {
    return value.toString();
  }
};
