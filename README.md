# 株式会社フジノミヤパートナーズ コーポレートサイト

Readdy で作成したデザイン・構成を、**完全無料で運用できる素の HTML/Tailwind CSS** に置き換えた
レスポンシブの静的サイトです。ビルド不要。

| ファイル / フォルダ | 内容 |
|---|---|
| `index.html` | トップページ |
| `services-sales.html` / `services-risk.html` / `services-life.html` | 3事業ブランドの詳細ページ。事業紹介カードの「詳しく見る」から遷移。各ページはブランドのテーマカラー（Sales=ゴールド／Risk=ブルー／Life=ピンク）を背景・アイコンに使用。**本文は下書き**（細部は差し替え前提） |
| `plan-detail.html` | 講座詳細（プラン別の詳細解説＋Stripe決済ボタン＋LINE誘導） |
| `partners-news.html` | メールマガジン「Partners通信」ページ（配信登録フォーム＋バックナンバー一覧） |
| `privacy.html` | プライバシーポリシー（**公開中の正式版**。最終更新日 2026年8月28日） |
| `assets/` | ロゴ・写真（`index.html` と同じ場所に置いたままアップロード） |
| `apps-script/form-handler.gs` | フォーム受信をスプレッドシート台帳＋Brevo に記録する Google Apps Script |
| `docs/データ管理ガイド.md` | 問い合わせ／Partners通信の**データ管理・一括配信の手順**（まずこれを読む） |

## index.html の構成

1. ヘッダー（ロゴ／ナビ／お問い合わせボタン、スマホはハンバーガーメニュー）
2. メインビジュアル（「攻め」と「守り」で、ビジネスと人生を力強く支える。）
3. 3つの事業ブランド（Sales Partners / Risk Partners / Life Partners）
4. ニュース一覧
5. 私たちの強み（01 ワンストップ体制 / 02 攻めと守りの両輪 / 03 伴走型サポート）
6. 企業理念
7. 会社概要
8. 代表挨拶
9. お問い合わせフォーム（送信機能付き）
10. フッター（プライバシーポリシーへのリンクを含む）

## privacy.html の使い方

- ヘッダー・フッター・体裁はトップページと共通。ナビの各リンクは `index.html#...` に戻ります。
- 本文は **公開中の正式版**（最終更新日：2026年8月28日）。`<article class="doc">` 内を編集すれば
  見出し（`<h2>`/`<h3>`）・段落（`<p>`）・箇条書き（`<ul>`/`<ol>`）・表（`<table>`）は自動で整います。
- **改定したら必ず冒頭の「最終更新日」を更新**してください。

### 改定が必要になりやすいタイミングと、直す箇所

| きっかけ | 直す章 |
|---|---|
| フォームの入力項目を追加・変更した | 第3章「取得する情報」 |
| 個人情報の使いみちが増えた（新しい告知種別、分析、広告等） | 第4章「利用目的」 |
| 外部サービスを追加・変更した（Brevo→他社、Google Analytics/GA4 や広告タグ、決済 等） | 第6章「外部サービスの利用（委託）」 |
| アクセス解析・Cookie を使い始めた | 第7章「Cookie 等について」（オプトアウト方法も追記） |
| 会社情報の変更（住所を番地まで確定、代表者交代、保護管理責任者を別に設置） | 第2章「事業者情報」 |
| 問い合わせ窓口メールの変更 | 第9章「お問い合わせ窓口」 |
| 事業の大きな変更・委託先での事故・**個人情報保護法の改正** | 全体を見直し |

> このリストに当てはまる変更を入れるときは、都度ご相談ください。該当章と修正文案をご案内します。

## partners-news.html（Partners通信）の使い方

- ヘッダー・フッターはトップページと共通。ナビに「Partners通信」を追加済み（全ページ）。
  トップページのニュース下にも案内ボックスからのリンクがあります。
- **配信登録フォーム**：送信先はお問い合わせフォームと同じ **FormSubmit → info@fpartners.jp**
  （件名は「【Partners通信】配信希望」）。初回の「有効化」が済んでいれば追加設定は不要です。
  別のメルマガ配信サービスを使う場合は `<form action="...">` を差し替えてください。
- **バックナンバー**：`#backnumbers` の `<ul>` 内に見本の `<li>` が1件入っています。
  号を発行したら `<li>` をコピーして「日付（`data-date` と表示テキスト）」「タイトル」「リンク先（PDF や記事ページの URL）」を更新し、
  新しい号を上に並べてください。発行から3か月以内の号には赤い「NEW」バッジが自動で付きます。

## 営業トレーナー養成プログラム（`services-sales.html#course` → `plan-detail.html`）

> ⚠️ **現在この講座は「公開準備中」扱いです。** サイト公開時点でプログラムが未完成のため、`plan-detail.html` へのリンクを一時的にすべて外し、「近日公開／最終準備中」と表示しています。**準備が整ったら下記「公開時に戻す手順」を実施してください。**

導線（本来の設計・公開時に復活）：**`services-sales.html#course`（LINE誘導・金額なし・セールスパートナーのページ下部）→ `plan-detail.html`（プラン別の詳細＋Stripe決済）**

### いまの状態（公開準備中）

| 箇所 | いまの表示 |
|---|---|
| `index.html` ニュース | 「講座情報 ＋ 近日公開」バッジ付きの**非リンク**テキスト（`【10月期生・先行募集】実践型 営業トレーナー養成プログラム ── 詳細ページは最終準備中です。`） |
| `services-sales.html` 「お渡しするもの」末尾 | プログラム名は**非リンク**。「最終準備中／近日公開予定」の一文に変更 |
| `services-sales.html#course` カード | 見出し横に「近日公開」バッジ。右カラムの無料特典ボックス＋LINEボタン＋「講座の詳細を見る」を、**「近日公開」パネル**（お問い合わせへ誘導）に差し替え |
| `services-sales.html` 下部CTA | 「プログラムの詳細を見る」ボタンを撤去（「詳しく聞く（お問い合わせ）」のみ） |
| 全ページのフッターナビ | 「講座詳細」リンクを撤去 |
| `plan-detail.html` | 冒頭に「公開準備中」帯。`<meta name="robots">` を `noindex,nofollow` に。ファイル自体は完成状態のまま（Stripeボタンも生きている）で温存 |

### 公開時に戻す手順

1. `plan-detail.html`：冒頭の「公開準備中の告知」`<div>` を削除。`<meta name="robots">` を `content="index,follow"` に戻す。先行特典バナーの月表記（`10月期生`／`10月開講予定`）を確定内容へ。
2. `services-sales.html#course`：右カラムの「近日公開」パネルを、旧・無料特典ボックス＋緑LINEボタン（`href="#"` を友だち追加URLに）＋「講座の詳細を見る →」（`plan-detail.html`）に戻す。見出し横の「近日公開」バッジを削除。
3. `services-sales.html`：「お渡しするもの」末尾を `plan-detail.html` へのリンク文に戻す。下部CTAに「プログラムの詳細を見る」ボタンを再追加（`flex justify-center` → `flex flex-col sm:flex-row justify-center gap-4`）。
4. `index.html` ニュース：非リンクテキストを `<a href="plan-detail.html" …>` に戻し、「近日公開」バッジを削除。
5. 全ページのフッターナビに `<a href="plan-detail.html" class="hover:text-gold transition-colors">講座詳細</a>` を「会社概要」と「プライバシーポリシー」の間へ再追加（`index / services-sales / services-risk / services-life / partners-news / privacy`）。

- トップページ（`index.html`）にプログラムの紹介枠はありません（企業サイトとして整理し、`services-sales.html` の最後（お渡しするもの と CTA の間）へ移設）。
- トップページに**金額表示はありません**（旧「選べる3つの実践プラン」＝5万/30万/100万のカード比較セクションは削除済み）。価格・プラン比較・決済はすべて `plan-detail.html` に集約。
- `#course`（`services-sales.html` 下部・セールスページの淡いゴールド基調に合わせた白カード）：公式LINE誘導の紹介枠。CTA は2つのみ ── ①緑「【無料】公式LINEで無料特典を受け取る」（`href="#"` を LINE 友だち追加 URL に）／②アウトライン「講座の詳細を見る →」（`plan-detail.html`）。
- ニュースに告知記事1件（`【10月期生・先行募集】…（先行特典あり）` → `plan-detail.html`、`NEW`＋`講座情報` タグ、`data-date="2026-08-29"`）。「◯月期生」は毎月開講のうち該当月を指す表記（「1期生／0期生」のような"初回"表記は不使用）。
- `plan-detail.html`：ヘッダー／フッターはトップと共通。冒頭に**先行特典バナー**、続いてプランごとに「こんな方におすすめ／受講後の未来／カリキュラム詳細／このプランで申し込む（Stripe）」。
  上部・下部に「トップへ戻る」。アンカー `#light` `#middle` `#high`（トップのニュース／`services-sales.html#course` からは無指定でトップへ）。
  **本文は確定版**（代表の実体験：営業未経験からトップセールス／片道2時間の通勤／縁故ゼロ・新規開拓／保険など無形商品特化、を反映）。下部に LINE誘導バナー。
- 全ページのフッターナビの「講座詳細」リンクは**公開準備中のため撤去済み**（公開時に再追加）。
- **3つの事業ブランド**：各カードに `id="brand-sales/brand-risk/brand-life"`。ボタンは2つ ── 「詳しく見る」→ `services-*.html`（ブランド詳細ページ）／「詳しく聞く」→ `#contact`（お問い合わせ）。
- `services-*.html` の本文は、いただいた事業イメージをもとにした**下書き**です。各セクション（WHY／背景・実績／こんな方へ／提供内容 ほか）を確認のうえ修正してください。ブランドカラーは各ページ冒頭 `<style>` の `--brand` / `--brand-bright` で変更できます。

### 講座申込フォームの仕組み（`plan-detail.html`）

各プランの「申し込む」は、単純なStripeリンクではなく**申込フォーム**（お名前・電話番号・メール・決済方法を入力）になっています。送信後の流れ：

1. フォーム送信 → Google Apps Script（`apps-script/form-handler.gs`）が一意の**申込ID**（`REG-202610-A8F3` 形式）を発行し、スプレッドシート「registrations」に1行追記（ステータス＝**未入金**）。
2. 申込者へ確認メールを自動送信（決済方法で内容が変わる）。担当者（`NOTIFY_EMAIL`）にも通知。
3. 画面上の表示（フォームの代わりに表示される完了パネル）：
   - **クレジットカード（Stripe）**：「申込ID」を表示し、Stripeの決済ページ（`client_reference_id` に申込IDを付与）へ自動的に新しいタブで遷移。
   - **銀行振込**：振込先口座・振込期限・「振込人名義欄に【申込ID＋お名前】を入力」の案内を、**その場でのみ**表示（口座情報はサイトのHTML・ソースには一切含まれず、Apps Scriptからの応答で動的に表示されます）。同じ内容を確認メールにも記載。

| プラン | Stripe決済リンク（`data-stripe-url` に設定） |
|---|---|
| ライト | `https://buy.stripe.com/5kQ14oaZZfrb89Mg3f4Ja00` |
| ミドル | `https://buy.stripe.com/dRm9AUaZZbaVeya3gt4Ja01` |
| ハイ（満席／次回先行予約枠） | `https://buy.stripe.com/5kQ3cwc430wh75I04h4Ja02` |

- 決済リンクを変更する場合は、各プランの `<div data-apply-block ... data-stripe-url="...">` の値を書き換える。
- **セットアップ（未設定だと申込フォームはエラー表示になります）**：`apps-script/form-handler.gs` をデプロイし、発行されたウェブアプリURLを `plan-detail.html` の `var REGISTRATION_ENDPOINT = '';` に貼り付ける（`index.html`／`partners-news.html` の `LOG_ENDPOINT` と同じURLを使い回してよい）。銀行口座・振込期限は `form-handler.gs` の `SETTINGS.BANK` / `SETTINGS.PAYMENT_DEADLINE_DAYS` で管理（現在：ドコモSMTBネット銀行 法人第一支店 普通 1166063 株式会社フジノミヤパートナーズ／申込から3日後）。
- **入金確認はいずれも手動**：Google Apps Scriptはリクエストヘッダーを読めない仕様のため、StripeのWebhook署名検証ができません。クレジットカードはStripe管理画面／通知メール、銀行振込は実際の入金（振込人名義の「申込ID＋お名前」で照合）を確認し、スプレッドシート「registrations」の「ステータス」列を手動で「未入金」→「完了」に書き換えてください。
- Stripe の決済ページでは、購入者があらためてカード情報を入力します（メールアドレスは `prefilled_email` で引き継ぎ）。
- **LINE 友だち追加 URL の差し替え箇所**：`services-sales.html#course` の緑ボタン、`plan-detail.html` 下部バナー（いずれも `href="#"`）。
- **期間・キャンペーン依存の文言**（募集終了後に必ず見直し）：ニュース＆先行特典バナーの「10月期生・先行募集」「10月開講予定」「先行募集期間中のお申し込みで早期割引＋個別戦略セッション」、ミドルプランのバッジ「人気No.1 ／ 先行募集中」、カリキュラムの「先行申込特典」、ハイプランの「満席／次回先行予約枠 受付中」「受講の開始は次回募集から」（決済ボタンは有効。次回募集の先行予約枠を確保する導線）、ニュースの「証券診断・簡易レポート」記事の「9月募集・限定3社／先着順」。
  - **開講月を変える場合**：`index.html` ニュース見出しの「10月期生」、`plan-detail.html` 先行特典バナーの「10月期生・先行募集受付中」「10月開講予定」をまとめて更新。
- PayPal は未設定（`#plans` の注記のみ）。使う場合は決済リンクを用意して該当ボタンを追加。

> ブランド名は今回の屋号変更に合わせ **Life Partners**（旧 Health & Beauty Partners）で統一しています。
> ナビは画面幅 **1280px 以上**でメニュー表示、それ未満はハンバーガーメニューになります。

---

## 0. 応募者アドレスの一括管理（重要）

お問い合わせ／Partners通信で集まるアドレスの**保存先・一括配信の設計と手順**は
**`docs/データ管理ガイド.md`** にまとめています。要点：

- 問い合わせ → Google スプレッドシート「contacts」シートに台帳化
- Partners通信 → 「newsletter」シート＋ **Brevo** の購読リスト（一括配信はここから）
- 記録用スクリプトは `apps-script/form-handler.gs`。デプロイして得た URL を
  `index.html` / `partners-news.html` の `var LOG_ENDPOINT = '';` に設定
- 未設定でもフォームのメール通知は動作します（現状はメール通知のみ）
- 問い合わせ客への告知は、フォームの任意チェック「ご案内メールを受け取る」に同意した人のみが対象

---

## 1. お問い合わせフォームの送信先（設定済み・要「有効化」）

現在の設定：**FormSubmit** 経由で **info@fpartners.jp** に届きます（登録不要・無料）。
`index.html` の `<form>` は次のようになっています。

```html
<form id="contactForm" action="https://formsubmit.co/info@fpartners.jp" method="POST" ...>
```

### 初回だけ必要な「有効化」作業

1. サイトを公開する（またはローカルの `index.html` をブラウザで開く）
2. フォームに適当な内容を入れて一度「送信する」
3. **info@fpartners.jp** に FormSubmit から確認メールが届く
4. メール内の **Activate Form**（有効化）リンクをクリック
5. 以降、送信内容がそのまま info@fpartners.jp に届くようになります

- 返信先は、送信者が入力した「メールアドレス」欄が自動でセットされます。
- 迷惑メールに入ることがあるので、確認メールが見当たらない場合は迷惑メールフォルダも確認してください。
- 送信先を変えたい場合：`action` 末尾の `info@fpartners.jp` を別アドレスに書き換え、再度「有効化」。

### 送信元アドレスを隠したい場合（任意）

上記の有効化メール内、または FormSubmit のダッシュボードで、メールアドレスの代わりに使える
**ランダムな文字列（ハッシュ）** が取得できます。取得後、`action` を
`https://formsubmit.co/xxxxxxxxxxxxxxxx` に差し替えると、HTML ソースにメールアドレスが出なくなり
スパム対策になります（挙動は同じ）。

### 動作の仕組み

- **JavaScript 有効**：`https://formsubmit.co/ajax/...` に送信し、ページ内に完了メッセージを表示（画面遷移なし）。
- **JavaScript 無効**：通常の POST 送信になり、FormSubmit の完了ページに遷移します。

> Formspree を使いたい場合は、`action` を `https://formspree.io/f/＜FormID＞` に変えるだけで
> 同じスクリプトがそのまま動作します（Formspree 側でアカウント作成とフォーム作成が必要）。

---

## 2. 無料で公開する

### 方法A：Netlify（ドラッグ&ドロップ / 最速）

1. <https://app.netlify.com/drop> を開く
2. この `fujinomiya-hp` フォルダごと画面にドラッグ&ドロップ
3. `https://ランダム名.netlify.app` で即公開。管理画面から独自ドメインも設定可

### 方法B：GitHub Pages

1. GitHub で新規リポジトリを作成（例 `fujinomiya-hp`）
2. このフォルダの中身を push
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<ユーザー名>/fujinomiya-hp.git
   git push -u origin main
   ```
3. リポジトリの **Settings → Pages** で Source = `Deploy from a branch`、Branch = `main` / `/(root)` を選択して Save
4. 数分後 `https://<ユーザー名>.github.io/fujinomiya-hp/` で公開（`.nojekyll` 同梱済み）

### 方法C：Cloudflare Pages / Vercel

「静的サイト・ビルドコマンドなし・出力ディレクトリ = ルート」でそのまま公開できます。

---

## 3. 公開前に確認・差し替える項目

`index.html` を開いて以下を確認してください：

| 箇所 | 現在の記載 | 対応 |
|---|---|---|
| フォーム送信先 | FormSubmit → `info@fpartners.jp` | 上記1.の「有効化」を実施（必須） |
| Facebook リンク | 設定済み：`https://www.facebook.com/fujinomiyapartners`（全ページのフッター） | URL が変わったら3ファイルとも修正 |
| Partners通信 バックナンバー | 見本1件（`partners-news.html`） | 号を発行したら差し替え・追加（上記参照） |
| 会社概要・所在地 | `静岡県富士宮市`（市までのみ・意図的） | 番地を出す方針に変えるときのみ追記 |
| 会社概要・営業時間 | `10:00〜18:00` | 実際の時間・定休日等を確認 |
| 会社概要・代表者 | `富士宮　一光（Fujinomiya Kazuteru）` | 表記が正しいか確認 |
| ニュースの日付・本文 | すべて `2026.08` | 実際の内容に更新（下記参照） |
| `<meta name="description">` / OGP | 汎用文 | 必要に応じて調整 |

### ニュースの更新方法

各 `<li>` に `data-date="YYYY-MM-DD"` を付けてあります。

- 表示中の日付テキスト（`2026.08`）と `data-date` の両方を書き換えてください。
- **公開日から3か月以内**の項目には、赤い「NEW」バッジが自動で表示されます（3か月を過ぎると自動で消えます）。
- 項目を増やす場合は `<li>` ブロックをコピーして日付・本文・`data-date` を変更。新しいものを上に並べてください。
- **画像をポップアップ表示したいとき**：`<a href="assets/xxx.jpg" data-lightbox data-alt="説明" target="_blank" rel="noopener">…</a>` と書けば、クリックで拡大ポップアップ（ライトボックス）が開きます（JS 無効時は別タブで画像を表示）。仕組みは `index.html` 末尾の `#lightbox` とスクリプトです。

### 同梱アセット（`assets/`）

| ファイル | 内容 |
|---|---|
| `logo-mark.png` | ヘッダー／フッターの会社名横のシンボルマーク。`400dpiLogo.jpg` の星の部分のみ切り出し、白背景を透過処理（文字なし） |
| `brand_sales.png` / `brand_risk.png` / `brand_life.png` | 3事業ブランドのロゴ。`新ロゴ2026.png`（案1）の中段ロゴを切り出したもの。事業紹介カードの 01/02/03 パネルに使用 |
| `president.jpg` | 代表挨拶の写真。`代表画像.PNG` の「背景あり」側を 4:5 で切り出したもの |
| `securities-analysis-flyer.jpg` | 「証券診断・簡易レポートサービス」のチラシ（`証券分析サービスチラシ.pdf` 全2ページを左右に並べて見開き合成／幅1800px・約200KB）。トップのニュース記事の「チラシを見る（見開き）」リンクから**ライトボックス（ポップアップ）**で拡大表示。差し替える場合は元PDFを 1ページ＝1画像に書き出し（例：`pdf-to-img` などのツール）、左右に連結して同名で上書き |

- **ロゴの差し替え**：同じファイル名で上書き（白背景・横長を推奨）。
- **代表写真の差し替え**：`president.jpg` を上書き。縦長 4:5、幅600px以上を推奨。表示サイズは `index.html` の「代表挨拶」セクションの `w-44 / sm:w-48 / lg:w-52` で調整できます。

---

## 4. カスタマイズのヒント

- **色**：`<script>tailwind.config</script>` の `navy` / `gold` を変更すると全体のトーンが変わります。
  - `gold.bright`（#f0b429）＝ヒーローのボタン・ハイライト、`gold`（#c99a3f）＝見出し上の英字ラベル・下線。
- **フォント**：見出し＝Shippori Mincho（明朝）、本文＝Noto Sans JP。`<link>` と `fontFamily` で変更可。
- **ブランドロゴの差し替え**：`assets/brand_sales.png` などを同名で上書き。表示サイズは `index.html` の `max-h-16` で調整可。
- **アセットはまとめて**：`assets/` フォルダは `index.html` と同じ場所に置いたままアップロードしてください。
- Tailwind CDN は本番でも利用可ですが、表示速度を詰めたい場合は
  [Tailwind CLI](https://tailwindcss.com/docs/installation) でビルドした CSS に差し替えるとより軽くなります（任意）。
