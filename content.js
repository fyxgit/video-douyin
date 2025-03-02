// content.js
console.log("content.js 已注入，开始执行");

function grabDouyinVideoPageLinks(callback) {
    const videoLinks = new Set();
    const baseUrl = "https://www.douyin.com";
    const douyinVideoPattern = /\/video\/\d+/i;

    function collectLinks() {
        console.log("正在收集链接...");
        const linkElements = document.getElementsByTagName("a");
        console.log("找到的 <a> 标签数量:", linkElements.length);
        for (let link of linkElements) {
            const href = link.getAttribute("href");
            if (href && douyinVideoPattern.test(href)) {
                let fullLink = href;
                if (fullLink.startsWith("/")) {
                    fullLink = baseUrl + fullLink;
                }
                fullLink = fullLink.split('?')[0];
                videoLinks.add(fullLink);
                console.log("发现链接:", fullLink);
            }
        }
    }

    // 初始收集
    collectLinks();

    // 滚动并收集更多链接
    let lastHeight = 0;
    let scrollCount = 0;
    const maxScrolls = 10;

    const scrollInterval = setInterval(() => {
        collectLinks();
        window.scrollTo(0, document.body.scrollHeight);
        const currentHeight = document.body.scrollHeight;
        console.log("当前页面高度:", currentHeight);

        if (currentHeight === lastHeight) {
            scrollCount++;
        } else {
            scrollCount = 0;
        }

        if (scrollCount >= 3 || scrollCount >= maxScrolls) {
            clearInterval(scrollInterval);
            console.log("抓取完成，最终链接:", [...videoLinks]);
            callback([...videoLinks]); // 调用回调返回结果
        }
        lastHeight = currentHeight;
    }, 2000);
}

// 监听 popup 消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("收到 popup 消息:", request);
    if (request.action === "grabVideos") {
        grabDouyinVideoPageLinks((videos) => {
            sendResponse({ videos: videos });
        });
        return true; // 表示异步响应
    }
});

// 调试输出
grabDouyinVideoPageLinks((videos) => {
    console.log("调试输出 - 抓到的链接:", videos);
});