// popup.js
document.getElementById("grabButton").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log("发送抓取请求到 tab:", tabs[0].id);
        chrome.tabs.sendMessage(tabs[0].id, { action: "grabVideos" }, (response) => {
            console.log("收到响应:", response);
            const videoList = document.getElementById("videoList");
            const copyAllButton = document.getElementById("copyAllButton");
            videoList.innerHTML = "";

            if (response && response.videos && response.videos.length > 0) {
                // 显示“复制所有链接”按钮
                copyAllButton.style.display = "block";

                // 渲染链接和复制按钮
                response.videos.forEach((link) => {
                    const li = document.createElement("li");
                    const a = document.createElement("a");
                    const copyBtn = document.createElement("button");

                    a.href = link;
                    a.textContent = link;
                    a.target = "_blank";

                    copyBtn.textContent = "copy";
                    copyBtn.className = "copy-btn";
                    copyBtn.onclick = () => {
                        navigator.clipboard.writeText(link).then(() => {
                            copyBtn.textContent = "copyed";
                            setTimeout(() => { copyBtn.textContent = "copy"; }, 1000); // 1秒后恢复
                        }).catch((err) => {
                            console.error("copy failed:", err);
                        });
                    };

                    li.appendChild(a);
                    li.appendChild(copyBtn);
                    videoList.appendChild(li);
                });

                // “复制所有链接”功能
                copyAllButton.onclick = () => {
                    const allLinks = response.videos.join("\n"); // 用换行符分隔
                    navigator.clipboard.writeText(allLinks).then(() => {
                        copyAllButton.textContent = "all link copyed";
                        setTimeout(() => { copyAllButton.textContent = "copy all link"; }, 1000);
                    }).catch((err) => {
                        console.error("复制所有失败:", err);
                    });
                };
            } else {
                videoList.innerHTML = "<li>not found video link</li>";
                copyAllButton.style.display = "none";
            }
        });
    });
});