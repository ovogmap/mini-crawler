import { defineConfig } from 'wxt';
import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  alias: {
    '@': resolve('./src'),
  },
  manifest: {
    permissions: ['sidePanel', 'storage', 'tabs', 'activeTab', 'scripting'], // scripting 권한 추가
    host_permissions: ['<all_urls>'], // 모든 페이지에 content script 접근 허용
    action: {}, // 아이콘 클릭 시 기본 동작을 위해 비워둠
    side_panel: {
      default_path: 'entrypoints/sidepanel/index.html',
    },
  },
});
