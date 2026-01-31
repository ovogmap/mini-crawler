export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  // Extension 아이콘 클릭 시 side panel 열기
  browser.action.onClicked.addListener(async (tab) => {
    if (tab.windowId) {
      await browser.sidePanel.open({ windowId: tab.windowId });
    } else {
      // 현재 창을 가져와서 sidePanel 열기
      const windows = await browser.windows.getCurrent();
      if (windows.id) {
        await browser.sidePanel.open({ windowId: windows.id });
      }
    }
  });

  // 확장 프로그램 설치 시 side panel 열기 (선택사항)
  browser.runtime.onInstalled.addListener(async () => {
    // 설치 시에는 현재 활성 창에 side panel 열기
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (tab?.windowId) {
      await browser.sidePanel.open({ windowId: tab.windowId });
    }
  });
});
