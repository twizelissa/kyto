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
  
  // For card issuance (pickup), generate document list based on flow
  if (answers.procedure === "card_issuance") {
    return resolveIssuanceItems(answers);
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

function resolveIssuanceItems(answers: Answer): string[] {
  const items: string[] = [];
  
  // Basic required items for all issuance
  items.push("mynumber_card_notification", "identity_document");
  
  // Add notification card requirement
  if (answers.notification_card === "yes") {
    items.push("notification_card");
  }
  
  // For new applications - additional documents
  if (answers.issuance_type === "new") {
    if (answers.basic_resident_card === "yes") {
      items.push("basic_resident_card");
    }
    if (answers.mynumber_notification === "yes") {
      items.push("mynumber_notification_card");
    }
  }
  
  // For proxy visitors - additional documents
  if (answers.visitor_type === "proxy") {
    items.push("proxy_identity", "power_of_attorney");
    
    // Additional documents for specific cases
    if (answers.applicant_age === "15_over") {
      if (answers.guardian_reason_15_over === "adult_guardian" || 
          answers.guardian_reason_15_over === "conservatee" || 
          answers.guardian_reason_15_over === "assisted_person" || 
          answers.guardian_reason_15_over === "voluntary_guardian") {
        items.push("guardianship_document");
      }
    }
    
    if (answers.applicant_age === "under_15") {
      items.push("family_register");
      if (answers.cohabitation_status === "not_cohabiting") {
        if (answers.koseki_location === "other") {
          items.push("family_register_outside_kyoto");
        }
      }
    }
  }
  
  return Array.from(new Set(items));
}

export function getItemDetails(itemKey: string) {
  return ITEMS[itemKey] || null;
}