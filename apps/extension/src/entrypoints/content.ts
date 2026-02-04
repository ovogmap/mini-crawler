export default defineContentScript({
  matches: ["http://*/*", "https://*/*"],
  runAt: "document_idle",
  main() {
    let isSelectMode = false;
    let currentHighlightedElement: HTMLElement | null = null;
    let overlay: HTMLDivElement | null = null;
    let currentCardIndex: number | null = null; // 현재 활성화된 카드 인덱스

    // 오버레이 생성
    function createOverlay() {
      overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.border = "3px solid #3b82f6";
      overlay.style.backgroundColor = "rgba(59, 130, 246, 0.15)";
      overlay.style.pointerEvents = "none";
      overlay.style.zIndex = "2147483647";
      overlay.style.display = "none";
      overlay.style.transition = "all 0.1s ease";
      overlay.style.boxShadow = "0 0 0 2000px rgba(0, 0, 0, 0.3)";
      document.body.appendChild(overlay);
    }

    // 오버레이 제거
    function removeOverlay() {
      if (overlay) {
        overlay.remove();
        overlay = null;
      }
    }

    // 요소 하이라이트
    function highlightElement(element: HTMLElement) {
      if (!overlay) return;

      const rect = element.getBoundingClientRect();
      overlay.style.display = "block";
      overlay.style.top = `${rect.top}px`;
      overlay.style.left = `${rect.left}px`;
      overlay.style.width = `${rect.width}px`;
      overlay.style.height = `${rect.height}px`;
    }

    // CSS Selector 생성
    function getUniqueSelector(element: HTMLElement): string {
      // ID가 있으면 ID 사용
      if (element.id) {
        return `#${element.id}`;
      }

      // 속성 기반 selector 생성 시도
      const attributeSelector = getAttributeBasedSelector(element);
      if (attributeSelector && isUnique(attributeSelector)) {
        return attributeSelector;
      }

      // 클래스 기반 selector 생성
      const classSelector = getClassBasedSelector(element);
      if (classSelector && isUnique(classSelector)) {
        return classSelector;
      }

      // 최소 경로로 고유한 selector 생성
      return getOptimizedPathSelector(element);
    }

    // 속성 기반 selector (data-*, aria-*, role 등)
    function getAttributeBasedSelector(element: HTMLElement): string | null {
      const attributes = [
        "data-testid",
        "data-test",
        "data-id",
        "data-name",
        "data-cy",
        "data-qa",
        "aria-label",
        "role",
        "name",
        "type",
      ];

      for (const attr of attributes) {
        const value = element.getAttribute(attr);
        if (value) {
          const tag = element.tagName.toLowerCase();
          return `${tag}[${attr}="${value}"]`;
        }
      }

      return null;
    }

    // 의미있는 클래스만 사용한 selector
    function getClassBasedSelector(element: HTMLElement): string | null {
      if (!element.className || typeof element.className !== "string") {
        return null;
      }

      const classes = element.className
        .trim()
        .split(/\s+/)
        .filter((c) => {
          // 동적으로 생성된 클래스나 의미없는 클래스 필터링
          return (
            c &&
            !c.match(/^(css-|_|emotion-|MuiBox-|makeStyles-)/) && // CSS-in-JS 클래스 제외
            !c.match(/^\d/) && // 숫자로 시작하는 클래스 제외
            !c.match(/^(hover|focus|active|disabled)$/)
          ); // 상태 클래스 제외
        });

      if (classes.length === 0) return null;

      const tag = element.tagName.toLowerCase();

      // 각 클래스 조합을 테스트
      // 1개 클래스만으로 충분한지 확인
      for (const cls of classes) {
        const selector = `${tag}.${cls}`;
        if (isUnique(selector)) {
          return selector;
        }
      }

      // 2개 클래스 조합
      if (classes.length >= 2) {
        const selector = `${tag}.${classes[0]}.${classes[1]}`;
        if (isUnique(selector)) {
          return selector;
        }
      }

      // 모든 클래스 사용
      return `${tag}.${classes.join(".")}`;
    }

    // 최적화된 경로 selector (최소 길이로)
    function getOptimizedPathSelector(element: HTMLElement): string {
      const path: string[] = [];
      let current: HTMLElement | null = element;
      let reachedUniquePoint = false;

      while (current && current.nodeType === Node.ELEMENT_NODE) {
        let selector = current.tagName.toLowerCase();

        // ID가 있으면 여기서 멈춤
        if (current.id) {
          selector = `#${current.id}`;
          path.unshift(selector);
          break;
        }

        // 의미있는 클래스만 추가
        if (current.className && typeof current.className === "string") {
          const classes = current.className
            .trim()
            .split(/\s+/)
            .filter((c) => {
              return c && !c.match(/^(css-|_|emotion-|MuiBox-|makeStyles-|\d)/);
            });

          if (classes.length > 0) {
            // 첫 번째 의미있는 클래스만 사용
            selector += `.${classes[0]}`;
          }
        }

        // 속성 추가 (고유성 향상)
        const uniqueAttr = [
          "data-testid",
          "data-test",
          "role",
          "aria-label",
        ].find((attr) => current!.hasAttribute(attr));
        if (uniqueAttr) {
          const value = current.getAttribute(uniqueAttr);
          selector += `[${uniqueAttr}="${value}"]`;
        }

        // 현재까지의 경로가 고유한지 확인
        path.unshift(selector);
        const testSelector = path.join(" > ");
        if (isUnique(testSelector)) {
          reachedUniquePoint = true;
          break;
        }

        // body에 도달하거나 고유한 랜드마크 발견 시 중지
        if (
          current.tagName.toLowerCase() === "body" ||
          current.getAttribute("role") === "main" ||
          current.getAttribute("role") === "dialog"
        ) {
          break;
        }

        current = current.parentElement;
      }

      // 고유하지 않으면 nth-child 추가
      if (!reachedUniquePoint) {
        const finalSelector = addNthChildIfNeeded(element, path);
        return finalSelector;
      }

      return path.join(" > ");
    }

    // 필요한 경우에만 nth-child 추가
    function addNthChildIfNeeded(element: HTMLElement, path: string[]): string {
      let current: HTMLElement | null = element;
      const newPath: string[] = [];

      for (let i = 0; i < path.length && current; i++) {
        let selector = path[path.length - 1 - i];

        // 형제 중 같은 selector를 가진 요소가 여러 개인지 확인
        if (current.parentElement) {
          const parentSelector =
            newPath.length > 0 ? newPath.join(" > ") + " > " : "";
          const siblingsWithSameSelector = Array.from(
            current.parentElement.children
          ).filter((child) => {
            // 간단히 태그명과 첫 번째 클래스만 비교
            const childTag = child.tagName.toLowerCase();
            const currentTag = current!.tagName.toLowerCase();
            return childTag === currentTag;
          });

          if (siblingsWithSameSelector.length > 1) {
            const index =
              Array.from(current.parentElement.children).indexOf(current) + 1;
            selector += `:nth-child(${index})`;
          }
        }

        newPath.unshift(selector);
        current = current.parentElement;
      }

      return newPath.join(" > ");
    }

    // Selector가 페이지에서 고유한지 확인
    function isUnique(selector: string): boolean {
      try {
        const elements = document.querySelectorAll(selector);
        return elements.length === 1;
      } catch (e) {
        return false;
      }
    }

    // 마우스 오버 이벤트
    function handleMouseOver(e: MouseEvent) {
      if (!isSelectMode) return;

      e.preventDefault();
      e.stopPropagation();

      const target = e.target as HTMLElement;
      if (target && target !== overlay) {
        currentHighlightedElement = target;
        highlightElement(target);
      }
    }

    // 클릭 이벤트
    function handleClick(e: MouseEvent) {
      if (!isSelectMode) return;

      e.preventDefault();
      e.stopPropagation();

      if (currentHighlightedElement) {
        const selector = getUniqueSelector(currentHighlightedElement);

        // Sidepanel로 selector 전송 (카드 인덱스 포함)
        browser.runtime.sendMessage({
          type: "SELECTOR_SELECTED",
          selector: selector,
          cardIndex: currentCardIndex,
        });

        stopSelectMode();
      }
    }

    // ESC 키로 선택 모드 취소
    function handleKeyDown(e: KeyboardEvent) {
      if (!isSelectMode) return;

      if (e.key === "Escape") {
        e.preventDefault();
        stopSelectMode();
      }
    }

    // 선택 모드 시작
    function startSelectMode() {
      // 이미 활성화되어 있으면 무시
      if (isSelectMode) return;

      isSelectMode = true;
      createOverlay();

      document.body.style.cursor = "crosshair";

      document.addEventListener("mouseover", handleMouseOver, true);
      document.addEventListener("click", handleClick, true);
      document.addEventListener("keydown", handleKeyDown, true);
    }

    // 선택 모드 종료
    function stopSelectMode() {
      // 이미 비활성화되어 있으면 무시
      if (!isSelectMode) return;

      const cardIndex = currentCardIndex; // 현재 카드 인덱스 저장

      isSelectMode = false;
      currentHighlightedElement = null;
      currentCardIndex = null; // 카드 인덱스 초기화

      document.body.style.cursor = "";

      removeOverlay();

      document.removeEventListener("mouseover", handleMouseOver, true);
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleKeyDown, true);

      // Sidepanel에 상태 변경 알림 (카드 인덱스 포함)
      browser.runtime.sendMessage({
        type: "SELECTOR_MODE_CHANGED",
        isActive: false,
        cardIndex: cardIndex,
      });
    }

    // 선택 모드 토글
    function toggleSelectMode() {
      if (isSelectMode) {
        stopSelectMode();
      } else {
        startSelectMode();
      }
      return isSelectMode;
    }

    // 메시지 리스너
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "TOGGLE_SELECT_MODE") {
        // 카드 인덱스 저장
        currentCardIndex = message.cardIndex;
        const newState = toggleSelectMode();
        sendResponse({ isActive: newState });
      }
      return true;
    });
  },
});
