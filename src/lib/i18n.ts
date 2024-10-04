import Papa from 'papaparse';
import { getCurrentLanguage } from '$lib/userData';

interface TranslationData {
  keys: string;
  en: string;
  fr: string;
  [key: string]: string; // This allows access to any key using a string
}

let translations: TranslationData[] = [];

// Load and parse the CSV
export const loadCSV = async () => {
  const response = await fetch('/localization.csv');
  const csvText = await response.text();

  // Parse the CSV
  const result = Papa.parse<TranslationData>(csvText, {
    header: true, // To use the first row as column names
    skipEmptyLines: true,
  });

  // Stores the results in the translations variable
  translations = result.data;
};

// Function to retrieve the translation
export const getTranslation = (key: string): string => {
  const translation = translations.find((t) => t.keys === key);
  if (!translation) return key; // If the key does not exist, returns the key itself
  
  return translation[getCurrentLanguage()] || key; // Returns translation or key if no translation
};
