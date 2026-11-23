# 日常好物｜繁體中文電商教學 Demo

純 HTML / CSS / JavaScript，無建置依賴、無套件安裝、無後端。所有商品、品牌、價格與活動皆為虛構。**沒有真實交易、金流、配送或訂單系統，也不要求個人資料。**

## 1. 開始使用

1. 解壓縮 ZIP，保留資料夾內的檔案結構。
2. 在 VS Code 選「檔案 → 開啟資料夾」，開啟 `daily-good-demo-organized`。
3. 在檔案管理員雙擊 `index.html`，用現代瀏覽器開啟即可。不需要網路。
4. 修改並儲存後，重新整理瀏覽器。也可選用 VS Code 的 Live Server 擴充功能；並非必要依賴。

建議使用近期 Chrome、Edge、Firefox 或 Safari；商品圖片為 AI 生成的棚拍風格示意圖。

## 2. 檔案與修改位置

| 檔案 | 用途與練習 |
| --- | --- |
| index.html | 網站名稱、頁首頁尾、文案、GA4 插入位置 |
| assets/css/styles.css | 色票、字體、格線與手機版面；從 :root 開始改色 |
| assets/js/products.js | 12 款商品；修改名稱、分類、價格、規格、描述、圖片 |
| assets/js/app.js | 搜尋、分類、排序、詳情、輪播、購物袋、分析事件 |
| assets/images/ | 隨附本機 PNG 商品圖片與原始 SVG 練習素材，不依賴外站 |
| .nojekyll | 告知 GitHub Pages 以靜態檔案提供網站 |

新增商品：複製 assets/js/products.js 的一個物件，給它唯一數字 id，補齊欄位；分類按鈕會自動產生。物件之間要有逗號。商品價格填數字，不含貨幣符號。

換圖：把自己的圖片放到 assets/images/，image 改成 `./assets/images/my-photo.jpg`。留意英文大小寫與圖片使用權。避免以 `/assets/...` 開頭，否則 GitHub Pages 的專案子路徑可能找不到圖片。

輪播：修改 assets/js/app.js 的 BANNERS。每 5 秒切換，支援前後切換、圓點及暫停；滑鼠停留或焦點在輪播內時暫停。系統要求減少動態效果時預設暫停。促銷僅為文案示意，總額依商品單價計算，沒有額外優惠碼或折扣規則。

購物袋：支援增減數量、移除、清空與示範完成，每品項最多 99 件。以 localStorage 儲存在目前瀏覽器，不會傳送到伺服器；儲存空間不可用時仍可操作，但重新整理可能不保留。file:// 與部署網址的儲存資料不共用。示範完成只顯示提示，不產生訂單，也不清空購物袋。

## 3. 加入 GA4（選做，需要網路）

預設沒有追蹤碼，也不會向 Google 傳送資料。課堂建議使用獨立教學 GA4 資源，不混入正式營運資料。

1. 登入 Google Analytics，建立或選取 GA4 資源與「網站」資料串流；網站網址填部署後的 GitHub Pages HTTPS 網址。
2. 在該串流的 Google tag 安裝指示選擇手動安裝，取得自己的 `G-...` 評估 ID 與完整程式碼。
3. 將完整 Google tag 貼到 index.html 的 `<head>` 裡「GA4 教學插入點」註解下方。以下為範例，**兩處** ID 都要替換：

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

4. 儲存並重新部署，開啟部署網址；在 GA4「即時」報表確認。請用正式 HTTPS 網址驗證，不以 file:// 離線測試判定 GA4 是否成功。
5. 若沒看到資料，檢查 ID、是否重複安裝、瀏覽器的追蹤封鎖與網路連線；報表更新可能有延遲。必要時依官方文件啟用 debug_mode，使用 DebugView 驗證後再移除除錯設定。

內建事件鉤子：`view_item`（商品詳情）、`add_to_cart`（加入購物袋）、`search`（按搜尋或 Enter，僅輸入不送出）、`select_category`（自訂分類事件）、`demo_checkout`（自訂示範完成）。Google tag config 會自動送出 page_view；此網站只有一個 HTML 頁面，商品詳情是對話框，並非另一個頁面。數量調整與移除未追蹤，這不是完整電商量測實作。

**不送出 purchase 事件**，避免產生虛構營收。不要在搜尋欄輸入姓名、電話或其他個資；安裝 GA4 後搜尋文字可能傳送至 Google。公開教學時，依實際受眾與需求說明分析用途及處理必要同意；本專案沒有內建同意管理。

官方參考：
- [Google tag 手動安裝](https://developers.google.com/tag-platform/gtagjs)
- [GA4 事件設定](https://developers.google.com/analytics/devguides/collection/ga4/events)

## 4. 部署到 GitHub Pages

1. 登入 GitHub，建立新的公開儲存庫，例如 `daily-good-demo-organized`。
2. 選 Add file → Upload files，上傳**專案資料夾裡的內容**；不要只上傳 ZIP，也不要把整個資料夾多包一層。確認儲存庫根目錄可以直接看到 index.html、login.html、stores.html、README.md、assets/。如隱藏檔未上傳，可在 GitHub 建立空白 `.nojekyll` 檔。
3. 提交檔案到 main 分支。
4. 儲存庫 Settings → Pages → Build and deployment，Source 選 Deploy from a branch，Branch 選 main、資料夾選 / (root)，按 Save。
5. 等待部署完成，再從 Pages 顯示的連結開啟。通常格式為 `https://你的帳號.github.io/daily-good-demo/`，實際網址以 GitHub 顯示為準。
6. 後續將修改後的檔案上傳並提交；等待重新部署，再重新整理。若看到舊版，可強制重新整理。

排錯：404 時先確認 Pages 部署成功、分支與根目錄正確、檔名為小寫 index.html。圖片缺失時檢查 assets/images/ 是否上傳、路徑及大小寫。請勿上傳帳密、API secret、個資；GA4 評估 ID 本身是公開網站識別碼，不是密碼。

[GitHub Pages 官方部署說明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## 5. 建議課堂練習與驗收

- 修改品牌、三則 banner、色票與至少 3 件商品，新增一個分類。
- 搜尋「咖啡」，切換分類，再用無結果字詞確認提示；按「清除搜尋與篩選」恢復。
- 比較價格排序；打開商品詳情；加入兩件商品並增減數量，核對總額。
- 清空購物袋，確認示範完成按鈕停用；加入商品後完成示範，確認沒有付款流程。
- 用手機寬度及鍵盤 Tab 操作；對話框可按 Escape 關閉。
- 部署 Pages，再加入自己的 GA4 tag，驗證 page_view 與互動事件。

## 授權

本專案自製程式與原始 SVG 示意素材採 MIT License，可自由修改及用於課堂。PNG 圖片為本專案使用內建 imagegen 生成的示意素材，不宣稱為真實商品攝影。品牌及商品均為虛構。自行新增的素材請另確認授權。

## 新增：示範會員與分店頁面

- `login.html`：假的會員登入。點「填入示範帳密」後登入；帳號 `student`，密碼 `demo1234`。僅比對前端固定字串，不驗證真實身分，不傳送或儲存輸入的帳密。請勿輸入真實帳密。
- `assets/js/member.js`：在 sessionStorage 儲存一個 yes 登入狀態旗標；同分頁跳頁時保留，可登出。儲存空間不可用時僅保留當頁狀態。這不是安全認證，可被任意修改，不可拿來保護真實資料。
- `stores.html`：三家虛構分店。店名、地址與營業時間均為教學資料；沒有真實電話、定位或實際營業。
- 導覽連結切換三個獨立 HTML 頁面，適合練習多頁網站。若加入 GA4，需把自己的 Google tag 同時放入三個頁面的 head；新頁預設也沒有追蹤碼。會員輸入內容不會由程式傳給 GA4。
- 商品圖片由內建 imagegen 生成，模擬棚拍，不是實際商品照片。圖片隨專案保存，本機即可載入。修改商品圖片時請同步更新 assets/js/products.js。

新增驗收：登入成功、錯誤帳密提示、登出、首頁與分店頁導覽、三頁的手機版面。

## 整理後的檔案位置

HTML 頁面、README 與授權檔放在根目錄。

- assets/css/styles.css：樣式
- assets/js/products.js：商品資料
- assets/js/app.js：購物功能
- assets/js/member.js：模擬登入
- assets/images/：12 張 PNG 與原始 SVG 素材

所有引用路徑已同步更新。products.js 的圖片 src 相對於目前 HTML 頁面，使用 ./assets/images/...。若在 CSS 加入 url(...)，其路徑則相對於 CSS 檔，應使用 ../images/...。

解壓縮後用 VS Code 開啟 daily-good-demo-organized 資料夾；雙擊 index.html 即可使用，不必先部署 GitHub Pages。
