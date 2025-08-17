# マイナンバーカードアプリケーション パターン分析

## 1. カードの申請・更新 (card_application)

質問フロー:
1. procedure: card_application
2. application_type: 4選択肢 (new, renewal, lost_reissue, other_reissue)
3. lost_procedures: 紛失手続きありの場合のみ（条件付き）
4. application_method: 6選択肢 (online, photo_booth, mail, center, mobile_service, office_support)
5. mail_type: mailの場合のみ 2選択肢 (notification_form, handwritten_form)
6. mobile_service_type: mobile_serviceの場合のみ 2選択肢 (mobile_window, mobile_support)

パターン計算:
- new/renewal/other_reissue: 各6つの申請方法
  - mail選択時: 2つのサブオプション = 2パターン
  - mobile_service選択時: 2つのサブオプション = 2パターン
  - その他4つの申請方法: 各1パターン
  - 小計: 3種類 × (2+2+4) = 3 × 8 = 24パターン

- lost_reissue: 6つの申請方法（紛失手続き確認後）
  - 同様に: 8パターン
  
総計: 24 + 8 = 32パターン

## 2. カードの交付（受け取り） (card_issuance)

質問フロー:
1. procedure: card_issuance
2. issuance_type: 4選択肢 (new, renewal, lost_reissue, other_reissue)
3. notification_card: 2選択肢 (yes, no)
4. return_documents: new + notification_cardありの場合のみ (2つの複数選択)
5. visitor_type: 2選択肢 (self, proxy)
6. applicant_age: proxyの場合のみ 2選択肢 (under_15, 15_over)
7. guardian_reason: under_15 + proxyの場合 (1選択肢固定)
8. guardian_reason_15_over: 15_over + proxyの場合 5選択肢
9. inquiry_response_check: 条件付き表示
10. specific_reason: 条件付き 9選択肢
11. cohabitation_status: under_15の場合のみ 2選択肢
12. koseki_location: not_cohabitingの場合のみ 2選択肢

複雑すぎるため概算:
- 基本: 4 × 2 = 8 （issuance_type × notification_card）
- visitor_type: 2選択肢で分岐
- proxy分岐の複雑な条件: 大幅に増加

概算: 約50-80パターン

## 3. 電子証明書の発行・更新 (digital_cert)

質問フロー:
1. procedure: digital_cert
2. cert_type: 2選択肢 (issuance, renewal)
3. cert_visitor_type: 2選択肢 (self, proxy)
4. cert_proxy_reason: proxyの場合 7選択肢
5. cert_cohabitation_status: under_15の場合のみ 2選択肢
6. cert_koseki_location: not_cohabitingの場合のみ 2選択肢

パターン計算:
- self: 2パターン (issuance, renewal)
- proxy: 2 × 7 = 14パターン (基本)
- under_15サブフロー: 2 × 2 = 4パターン追加

総計: 2 + 14 + 4 = 20パターン

## 4. 暗証番号の変更・初期化 (pin_change)

質問フロー:
1. procedure: pin_change
2. pin_type: 2選択肢 (change, reset)
3. pin_visitor_type: 2選択肢 (self, proxy)
4. pin_proxy_reason: proxyの場合 6選択肢
5. pin_cohabitation_status: under_15の場合のみ 2選択肢
6. pin_koseki_location: not_cohabitingの場合のみ 2選択肢

パターン計算:
- self: 2パターン (change, reset)
- proxy: 2 × 6 = 12パターン (基本)
- under_15サブフロー: 2 × 2 = 4パターン追加

総計: 2 + 12 + 4 = 18パターン

## 5. 住所・氏名等の変更 (info_change)

質問フロー:
1. procedure: info_change
2. info_visitor_type: 2選択肢 (self, proxy)
3. info_proxy_reason: proxyの場合 7選択肢
4. info_cohabitation_status: under_15の場合のみ 2選択肢
5. info_koseki_location: not_cohabitingの場合のみ 2選択肢

パターン計算:
- self: 1パターン
- proxy: 7パターン (基本)
- under_15サブフロー: 2 × 2 = 4パターン追加

総計: 1 + 7 + 4 = 12パターン

## 6. カードの紛失・発見 (card_lost)

質問フロー:
1. procedure: card_lost
2. lost_situation: 2選択肢 (lost, found)

総計: 2パターン

## 7. カードの返納 (card_return)

質問フロー:
1. procedure: card_return

総計: 1パターン

## 合計パターン数

1. カードの申請・更新: 32パターン
2. カードの交付（受け取り）: 約60-80パターン
3. 電子証明書の発行・更新: 20パターン
4. 暗証番号の変更・初期化: 18パターン
5. 住所・氏名等の変更: 12パターン
6. カードの紛失・発見: 2パターン
7. カードの返納: 1パターン

推定総計: 約145-165パターン