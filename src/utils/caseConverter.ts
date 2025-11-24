// Utilitário para converter entre camelCase e snake_case

export const toSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

export const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

export const convertObjectToSnakeCase = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(convertObjectToSnakeCase);
  
  const converted: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
      const snakeKey = toSnakeCase(key);
      // Só adiciona se for diferente da chave original (evita duplicatas)
      if (snakeKey !== key || !converted[snakeKey]) {
        converted[snakeKey] = obj[key];
      }
    }
  }
  return converted;
};

export const convertObjectToCamelCase = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(convertObjectToCamelCase);
  
  const converted: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelKey = toCamelCase(key);
      converted[camelKey] = obj[key];
    }
  }
  return converted;
};
