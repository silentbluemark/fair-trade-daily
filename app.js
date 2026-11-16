/**
 * 公平交易法日報 - 前端互動邏輯 (app.js)
 * 功能說明：
 * 1. 載入 data/issues.json 期數清單並建立下拉選單
 * 2. 載入最新一期 (或指定期數) 之新聞 JSON 檔案
 * 3. 支援依照「議題分類」即時篩選本日頭條與重點快訊
 * 4. 支援切換歷史期數即時更新版面內容
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM 節點快取
  const issueSelect = document.getElementById('issue-select');
  const currentDateText = document.getElementById('current-date-text');
  const categoryFilters = document.getElementById('category-filters');
  const headlineContainer = document.getElementById('headline-container');
  const briefsContainer = document.getElementById('briefs-container');
  const briefsList = document.getElementById('briefs-list');
  const emptyState = document.getElementById('empty-state');

  // 頭條元素快取
  const headlineCard = document.getElementById('headline-card');
  const headlineCategory = document.getElementById('headline-category');
  const headlineLaw = document.getElementById('headline-law');
  const headlineDate = document.getElementById('headline-date');
  const headlineTitle = document.getElementById('headline-title');
  const headlineSummary = document.getElementById('headline-summary');
  const headlineLink = document.getElementById('headline-link');

  // 狀態管理
  let currentIssueData = null;
  let currentCategory = 'all';

  /**
   * 初始化入口
   */
  async function init() {
    bindEvents();
    await loadIssuesList();
  }

  /**
   * 綁定使用者操作事件
   */
  function bindEvents() {
    // 歷史期數下拉選單切換
    issueSelect.addEventListener('change', (e) => {
      const selectedDate = e.target.value;
      if (selectedDate) {
        loadIssueDetail(selectedDate);
      }
    });

    // 議題分類按鈕點擊篩選
    categoryFilters.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      // 切換按鈕樣式
      const allButtons = categoryFilters.querySelectorAll('.filter-btn');
      allButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // 更新篩選類別並重繪視圖
      currentCategory = btn.getAttribute('data-category');
      renderArticles();
    });
  }

  /**
   * 載入歷史期數清單 (data/issues.json)
   */
  async function loadIssuesList() {
    try {
      const response = await fetch('data/issues.json');
      if (!response.ok) {
        throw new Error(`無法讀取期數清單 (${response.status})`);
      }
      const issues = await response.json();

      if (!issues || issues.length === 0) {
        issueSelect.innerHTML = '<option value="">尚無期數資料</option>';
        return;
      }

      // 產生下拉選單選項
      issueSelect.innerHTML = issues
        .map((issue) => `<option value="${issue.date}">${issue.title || issue.date}</option>`)
        .join('');

      // 預設載入最新一期（清單第 1 筆）
      const latestDate = issues[0].date;
      await loadIssueDetail(latestDate);
    } catch (error) {
      console.error('載入期數清單失敗：', error);
      showDataLoadError('無法載入期數清單。若直接點擊 HTML 檔案開啟，請使用 Live Server 或簡易本機伺服器瀏覽。');
    }
  }

  /**
   * 載入指定日期的日報資料 (data/[date].json)
   * @param {string} date - 日期字串，如 '2026-11-16'
   */
  async function loadIssueDetail(date) {
    try {
      briefsList.innerHTML = '<p class="loading-hint">新聞資料載入中...</p>';
      currentDateText.textContent = `載入中 (${date})...`;

      const response = await fetch(`data/${date}.json`);
      if (!response.ok) {
        throw new Error(`無法讀取該期日報資料 (${response.status})`);
      }
      currentIssueData = await response.json();

      // 更新報頭顯示日期
      currentDateText.textContent = formatDateDisplay(currentIssueData.date || date);

      // 依當前分類渲染版面
      renderArticles();
    } catch (error) {
      console.error(`載入 ${date} 日報資料失敗：`, error);
      showDataLoadError(`無法載入 ${date} 的新聞資料，請檢查 data/${date}.json 檔案是否存在。`);
    }
  }

  /**
   * 根據目前選擇的類別渲染「頭條」與「快訊」
   */
  function renderArticles() {
    if (!currentIssueData) return;

    let hasVisibleContent = false;

    // 1. 處理本日頭條 (Headline)
    const headline = currentIssueData.headline;
    const isHeadlineMatch =
      headline &&
      (currentCategory === 'all' || headline.category === currentCategory);

    if (isHeadlineMatch) {
      headlineContainer.style.display = 'block';
      headlineCategory.textContent = headline.category || '焦點';
      headlineLaw.textContent = headline.lawTag || '公平交易法';
      headlineDate.textContent = headline.date || currentIssueData.date || '';
      headlineTitle.textContent = headline.title || '無標題';
      headlineSummary.textContent = headline.summary || '';
      headlineLink.href = headline.sourceUrl || '#';
      hasVisibleContent = true;
    } else {
      headlineContainer.style.display = 'none';
    }

    // 2. 處理重點快訊 (Briefs)
    const newsList = currentIssueData.news || [];
    const filteredNews = newsList.filter((item) => {
      return currentCategory === 'all' || item.category === currentCategory;
    });

    if (filteredNews.length > 0) {
      briefsContainer.style.display = 'block';
      briefsList.innerHTML = filteredNews.map(createBriefCardHTML).join('');
      hasVisibleContent = true;
    } else {
      briefsList.innerHTML = '';
      briefsContainer.style.display = 'none';
    }

    // 3. 處理無符合結果提示
    if (!hasVisibleContent) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
    }
  }

  /**
   * 產生單則快訊卡片的 HTML 字串
   * @param {Object} item - 新聞物件
   */
  function createBriefCardHTML(item) {
    const title = escapeHTML(item.title || '');
    const category = escapeHTML(item.category || '快訊');
    const lawTag = escapeHTML(item.lawTag || '公平交易法');
    const date = escapeHTML(item.date || '');
    const summary = escapeHTML(item.summary || '');
    const sourceUrl = item.sourceUrl || '#';

    return `
      <article class="brief-card">
        <div class="article-meta">
          <span class="badge badge-category">${category}</span>
          <span class="badge badge-law">${lawTag}</span>
          <span class="article-date">${date}</span>
        </div>
        <h4 class="brief-title">${title}</h4>
        <p class="brief-summary">${summary}</p>
        <div class="brief-footer">
          <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer" class="read-more-link">
            查看詳情 &rarr;
          </a>
        </div>
      </article>
    `;
  }

  /**
   * 格式化日期文字為中文報刊風格（例：2026 年 11 月 16 日 星期一）
   * @param {string} dateString - 格式 'YYYY-MM-DD'
   */
  function formatDateDisplay(dateString) {
    try {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const year = parts[0];
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        const dateObj = new Date(year, month - 1, day);
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const weekday = weekdays[dateObj.getDay()] || '';
        return `${year} 年 ${month} 月 ${day} 日 · ${weekday}`;
      }
    } catch (e) {
      // 容錯回傳原始字串
    }
    return dateString;
  }

  /**
   * 顯示資料載入失敗之友善提示
   */
  function showDataLoadError(message) {
    currentDateText.textContent = '資料載入異常';
    headlineTitle.textContent = '無法取得新聞資料';
    headlineSummary.textContent = message;
    headlineCategory.textContent = '系統提示';
    headlineLaw.textContent = '注意';
    headlineLink.style.display = 'none';
    briefsList.innerHTML = `<div class="empty-state"><p>${escapeHTML(message)}</p></div>`;
  }

  /**
   * 簡易 HTML 特殊符號轉義，預防 XSS
   */
  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // 執行初始化
  init();
});
