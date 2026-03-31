// 监听网页加载完毕
document.addEventListener('DOMContentLoaded', function() {
  // 锁定 Fluid 主题的核心文章卡片 (.board)
  const element = document.querySelector(".board");
  
  if (element) {
    VanillaTilt.init(element, {
      max: 3,                // 最大倾斜角度（保持克制，3度刚刚好）
      speed: 1000,           // 动画恢复的速度，越慢越丝滑
      glare: true,           // 开启极其高级的物理反光层
      "max-glare": 0.15,     // 反光的最大透明度，若隐若现最抓人
      scale: 1.01,           // 悬浮时极其微小的放大，增加浮力感
      transition: true       // 开启丝滑过渡
    });
  }
});