import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * macOS 파일명은 NFC 또는 NFD가 섞여 있을 수 있음.
 * 브라우저는 NFC로 요청하므로, 실제 디스크의 파일명 바이트와
 * 일치하도록 URL을 변환함.
 */
function unicodeNormalize(): Plugin {
  let fileMap: Map<string, string> | null = null

  function buildFileMap(publicDir: string) {
    fileMap = new Map()
    function walk(dir: string) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        const rel = '/' + path.relative(publicDir, full)
        // NFC 키로 실제 경로 저장
        fileMap!.set(rel.normalize('NFC'), rel)
        if (entry.isDirectory()) walk(full)
      }
    }
    walk(publicDir)
  }

  return {
    name: 'vite-plugin-unicode-normalize',
    configureServer(server) {
      buildFileMap(server.config.publicDir)

      // 파일 변경 시 맵 갱신
      server.watcher.on('all', () => {
        buildFileMap(server.config.publicDir)
      })

      server.middlewares.use((req, _res, next) => {
        if (req.url && fileMap) {
          const decoded = decodeURIComponent(req.url).normalize('NFC')
          const actual = fileMap.get(decoded)
          if (actual && actual !== decoded) {
            req.url = encodeURI(actual)
          }
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [unicodeNormalize(), react()],
})
