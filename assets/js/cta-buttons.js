/**
 * 数字化转型CTA按钮交互处理
 */

// 按钮点击事件处理函数
function handleButtonClick(event, actionType) {
  event.preventDefault();
  
  if (actionType === 'demo') {
    // 处理预约演示逻辑
    console.log('用户点击了免费预约演示');
    // 使用相对路径而非绝对路径
    window.location.href = 'book-demo.html';
  } else if (actionType === 'consult') {
    // 处理咨询方案逻辑
    console.log('用户点击了咨询专属方案');
    // 使用相对路径而非绝对路径
    window.location.href = 'consult-solution.html';
  }
}

// DOM加载完成后初始化事件监听
document.addEventListener('DOMContentLoaded', function() {
  // 查找SVG按钮元素
  const demoButton = document.getElementById('demo-btn');
  const consultButton = document.getElementById('consult-btn');
  
  // 添加点击事件监听器
  if (demoButton) {
    demoButton.addEventListener('click', function(e) {
      handleButtonClick(e, 'demo');
    });
  }
  
  if (consultButton) {
    consultButton.addEventListener('click', function(e) {
      handleButtonClick(e, 'consult');
    });
  }
  
  // 为普通HTML按钮也添加相同的事件处理（如果存在）
  const htmlDemoBtn = document.querySelector('.demo-btn-html');
  const htmlConsultBtn = document.querySelector('.consult-btn-html');
  
  if (htmlDemoBtn) {
    htmlDemoBtn.addEventListener('click', function(e) {
      handleButtonClick(e, 'demo');
    });
  }
  
  if (htmlConsultBtn) {
    htmlConsultBtn.addEventListener('click', function(e) {
      handleButtonClick(e, 'consult');
    });
  }
});

// 提供全局函数，可从SVG内部直接调用
window.bookDemo = function() {
  handleButtonClick(new Event('click'), 'demo');
};

window.consultSolution = function() {
  handleButtonClick(new Event('click'), 'consult');
}; 