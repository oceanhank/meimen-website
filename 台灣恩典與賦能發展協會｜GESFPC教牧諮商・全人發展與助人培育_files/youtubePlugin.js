"use strict";

if (typeof window.onYouTubeIframeAPIReady === "function") {
  new Error("YouTube API is already loaded");
}

window.onYouTubeIframeAPIReady = () => {
  console.log("YouTube API is ready");
  window.onYouTubeIframeAPIReady = null;
};

(function () {
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})();

class YTPlayer {
  constructor(container, options) {
    this.container = container;
    this.options = options;
    this.player = null;
    this.ratio = [];
  }
  async load() {
    await new Promise((resolve, reject) => {
      let connectTime = 0;
      let timer = setInterval(() => {
        if (connectTime > 15000) {
          reject(new Error("API connection timeout"));
          clearInterval(timer);
        }
        if (onYouTubeIframeAPIReady === null) {
          clearInterval(timer);
          resolve(true);
        }
        connectTime += 100;
      }, 100);
    }).catch((err) => {
      throw new Error(err);
    });
    if (this.options.videoId === undefined) {
      throw new Error("YouTube ID is not defined");
    }
    this.player = new YT.Player(this.container, this.options);
    return new Promise(async (resolve, reject) => {
      this.player.addEventListener("onReady", (e) => {
        // 注入比例設定功能，格式範例 '16:9', '4:3', '21:9'
        this.player.setAspectRatio = (ratio) => {
          if (!ratio) {
            throw new Error("Aspect ratio can only be a string!");
          }
          const iframe = this.player.getIframe();
          this.ratio = ratio.split(':');
          if (this.ratio.length === 2) {
            this.player.setSize(iframe.clientWidth, iframe.clientWidth / (this.ratio[0] / this.ratio[1]));
          }
        };
        window.addEventListener("resize", () => {
          if (this.ratio.length === 2) {
            const iframe = this.player.getIframe();
            this.player.setSize(iframe.clientWidth, iframe.clientWidth / (this.ratio[0] / this.ratio[1]));
          }
        });
        resolve(e.target);
      });
    }).catch((err) => {
      throw new Error(err);
    });
  }
}
