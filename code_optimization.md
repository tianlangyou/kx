# 代码优化建议

## 1. SVG文件优化

当前的SVG文件存在以下问题需要优化：

### 1.1 重复代码问题

```xml
<!-- 重复的底部导航栏代码出现在多个SVG文件中 -->
<rect x="0" y="780" width="390" height="64" fill="#FFFFFF" stroke="#E6EAF0" stroke-width="1"/>
<circle cx="65" cy="812" r="24" fill="#F5F7FA"/>
<text x="65" y="816" font-family="Arial" font-size="10" fill="#718096" text-anchor="middle">主页</text>
<!-- ... 其他导航图标 ... -->
```

### 1.2 字体不一致问题

```xml
<!-- 所有SVG文件都使用Arial字体，不适合中文展示 -->
<text x="85" y="74" font-family="Arial" font-size="16" fill="#2D3748" font-weight="bold">城市零售有限公司</text>
```

### 1.3 颜色不统一问题

```xml
<!-- 不同SVG文件使用不同的主色调 -->
<rect width="390" height="44" fill="#1D4C7C"/> <!-- dealer_agent.svg -->
<rect width="390" height="44" fill="#0F766E"/> <!-- order_management.svg -->
```

## 2. 优化方案

### 2.1 创建SVG组件库

将常用SVG组件提取到单独的文件中，通过引用方式复用：

```html
<!-- 组件化后的导航栏使用方式 -->
<use href="#bottom-nav" x="0" y="780" />
```

组件定义:
```xml
<g id="bottom-nav">
  <rect width="390" height="64" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
  <!-- 导航图标 -->
</g>
```

### 2.2 统一颜色和字体

创建统一的变量定义：

```css
:root {
  /* 颜色系统 */
  --primary-color: #1D4C7C;
  --secondary-color: #0F766E;
  --background-color: #F8FAFC;
  --text-primary: #0F172A;
  --text-secondary: #64748B;
  
  /* 字体系统 */
  --font-family: "PingFang SC", "Noto Sans SC", sans-serif;
}
```

### 2.3 精简SVG代码

当前SVG文件可以优化的部分：

```xml
<!-- 优化前 -->
<rect x="20" y="134" width="350" height="120" rx="16" fill="#FFFFFF" stroke="#E6EAF0" stroke-width="1"/>
<circle cx="60" cy="184" r="30" fill="#1E40AF"/>
<text x="60" y="189" font-family="Arial" font-size="14" fill="#FFFFFF" text-anchor="middle">AI</text>
<!-- 更多元素... -->

<!-- 优化后 -->
<g class="chat-box">
  <rect x="20" y="134" width="350" height="120" rx="16" fill="#FFFFFF" stroke="#E6EAF0" stroke-width="1"/>
  <circle cx="60" cy="184" r="30" fill="var(--primary-color)"/>
  <text x="60" y="189" font-family="var(--font-family)" font-size="14" fill="#FFFFFF" text-anchor="middle">AI</text>
  <!-- 更多元素... -->
</g>
```

## 3. HTML/CSS优化

### 3.1 使用CSS变量替代硬编码值

```css
/* 原代码 */
.role-card.dealer { border-color: #7E3AF2; }
.role-card.dealer .role-icon { background-color: #7E3AF2; }

/* 优化后 */
:root {
  --dealer-color: #7E3AF2;
}
.role-card.dealer { border-color: var(--dealer-color); }
.role-card.dealer .role-icon { background-color: var(--dealer-color); }
```

### 3.2 优化响应式设计

```css
/* 优化前 - 不同设备需要编写多套样式 */
@media (max-width: 768px) {
    .header-title { font-size: 24px; }
}

/* 优化后 - 使用相对单位和视口单位 */
.header-title {
    font-size: clamp(1.5rem, 5vw, 2.5rem);
}
```

### 3.3 优化CSS选择器

```css
/* 优化前 - 过深的选择器嵌套 */
.role-card .role-icon .role-icon-inner span { color: #fff; }

/* 优化后 - 扁平化选择器 */
.role-icon-text { color: #fff; }
```

## 4. JavaScript优化

### 4.1 使用事件委托

```javascript
// 优化前 - 为每个卡片添加事件监听
document.querySelectorAll('.role-card').forEach(card => {
  card.addEventListener('click', handleCardClick);
});

// 优化后 - 使用事件委托
document.querySelector('.role-cards').addEventListener('click', (e) => {
  const card = e.target.closest('.role-card');
  if (card) handleCardClick(e, card);
});
```

### 4.2 实现图片懒加载

```javascript
// 添加懒加载
document.addEventListener('DOMContentLoaded', () => {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  const lazyLoad = (target) => {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          observer.disconnect();
        }
      });
    });
    io.observe(target);
  };
  
  lazyImages.forEach(lazyLoad);
});
```

### 4.3 优化动画性能

```javascript
// 优化前 - 直接操作DOM样式
function animateElement(el) {
  el.style.opacity = 0;
  setTimeout(() => { el.style.opacity = 1; }, 100);
}

// 优化后 - 使用CSS类名切换
function animateElement(el) {
  el.classList.add('fade-in');
}
```

## 5. 整体架构优化

### 5.1 模块化设计

将功能拆分为多个模块:
- 用户认证模块
- 订单管理模块
- 库存管理模块
- 客户管理模块
- 智能助手模块

### 5.2 数据处理优化

```javascript
// 优化前 - 一次性加载所有数据
function loadOrders() {
  fetch('/api/orders')
    .then(res => res.json())
    .then(data => renderOrders(data));
}

// 优化后 - 分页加载
function loadOrders(page = 1, limit = 10) {
  fetch(`/api/orders?page=${page}&limit=${limit}`)
    .then(res => res.json())
    .then(data => {
      renderOrders(data.orders);
      if (data.hasMore) {
        observeLastItem(() => loadOrders(page + 1, limit));
      }
    });
}
```

### 5.3 缓存策略

```javascript
// 添加缓存策略
function fetchWithCache(url, options = {}) {
  const cacheKey = `cache_${url}`;
  const cachedData = localStorage.getItem(cacheKey);
  
  if (cachedData && options.useCache !== false) {
    const data = JSON.parse(cachedData);
    // 检查缓存是否过期
    if (Date.now() - data.timestamp < 60 * 1000) { // 1分钟缓存
      return Promise.resolve(data.value);
    }
  }
  
  return fetch(url, options)
    .then(res => res.json())
    .then(data => {
      localStorage.setItem(cacheKey, JSON.stringify({
        value: data,
        timestamp: Date.now()
      }));
      return data;
    });
}
```