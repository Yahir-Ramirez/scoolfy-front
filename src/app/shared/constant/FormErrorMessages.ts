export const FormErrorMessages = {
  LETTERS_ONLY_MESSAGE: `• Solo letras`,
  NUMBERS_ONLY_MESSAGE: `• Solo números`,
  MIN_LENGTH_MESSAGE: (requiredLength: Number) =>
    `• Mínimo ${requiredLength} caracteres`,
  MAX_LENGTH_MESSAGE: (requiredLength: Number) =>
    `• Máximo ${requiredLength} caracteres`,
  MANDATORY_MESSAGE: `• Obligatorio`,
  INVALID_EMAIL_FORMAT_MESSAGE: `• Formato no válido`,
} as const;
