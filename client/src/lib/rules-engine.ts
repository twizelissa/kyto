import { Answer } from "@shared/schema";
import { ITEMS } from "./questions-data";

interface Rule {
  cond: Answer;
  add: string[];
}

const RULES: Rule[] = [
  // 15歳未満・法定代理人
  {cond: {age: "u15"}, add: ["child_card", "notice", "parent_ID", "family_cert"]},
  // 15–17歳 本人来庁
  {cond: {age: "u18", actor: "self"}, add: ["card", "notice", "own_ID"]},
  // 任意代理更新
  {cond: {actor: "proxy", proc: "renew"}, add: ["card", "notice", "reply_form", "proxy_ID"]},
  // 紛失再発行
  {cond: {proc: "reissue", card: "lost"}, add: ["ID_set", "lost_report", "fee"]},
  // 暗証番号不明
  {cond: {pin: "ng"}, add: ["ID_set", "pin_reset_app"]},
  // 電子証明書のみ更新
  {cond: {proc: "cert"}, add: ["card", "notice", "own_ID", "pin"]},
  // 氏名・住所変更
  {cond: {proc: "change"}, add: ["card", "change_docs", "own_ID"]},
  // 破損カード
  {cond: {card: "broken"}, add: ["broken_card", "own_ID", "fee"]},
  // 法定代理人
  {cond: {actor: "legal"}, add: ["parent_ID", "family_cert", "notice"]},
  // デフォルト（カード更新・本人）
  {cond: {proc: "renew", actor: "self"}, add: ["card", "notice", "pin"]}
];

export function resolveItems(answers: Answer): string[] {
  const items = new Set<string>();
  
  // Apply rules in order - first match wins
  for (const rule of RULES) {
    const matches = Object.entries(rule.cond).every(([key, value]) => answers[key] === value);
    if (matches) {
      rule.add.forEach(item => items.add(item));
      break;
    }
  }
  
  // If no specific rule matches, use defaults
  if (items.size === 0) {
    items.add('card');
    items.add('notice');
    items.add('own_ID');
  }
  
  return Array.from(items).filter(key => ITEMS[key]);
}

export function getItemDetails(itemKey: string) {
  return ITEMS[itemKey];
}
