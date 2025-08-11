import { Answer } from "@shared/schema";
import { ITEMS } from "./questions-data";

interface Rule {
  cond: Answer;
  add: string[];
  description?: string;
}

// Simplified rules - most procedures now end with application method selection and show info instead of checklist
const RULES: Rule[] = [];

export function resolveItems(answers: Answer): string[] {
  // For most application flows, we now show information instead of document checklist
  if (answers.application_method) {
    return []; // No documents needed, just show application method info
  }
  
  // For other procedures that might need document lists
  const requiredItems: string[] = [];
  
  for (const rule of RULES) {
    const matches = Object.entries(rule.cond).every(([key, value]) => {
      return answers[key] === value;
    });
    
    if (matches) {
      requiredItems.push(...rule.add);
    }
  }
  
  return Array.from(new Set(requiredItems));
}

export function getItemDetails(itemKey: string) {
  return ITEMS[itemKey] || null;
}