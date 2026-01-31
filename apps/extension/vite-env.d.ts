/// <reference types="vite/client" />
/// <reference path=".wxt/wxt.d.ts" />


// SVG 파일을 모듈로 import할 수 있도록 타입 선언
declare module '*.svg' {
  const content: string;
  export default content;
}

// CSS 파일을 모듈로 import할 수 있도록 타입 선언
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
