import { defineConfig } from 'wxt';
import { resolve } from 'node:path';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  alias: {
    // @ 별칭을 루트 디렉토리로 설정하여 @/assets/react.svg 같은 import가 작동하도록 함
    '@': resolve('.'),
  },
  manifest: {
    permissions: ['sidePanel', 'storage', 'tabs'], // sidePanel 권한 필수
    action: {}, // 아이콘 클릭 시 기본 동작을 위해 비워둠
    side_panel: {
      default_path: 'entrypoints/sidepanel/index.html',
    },
  },
});
