<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { File, Repl, useStore, useVueImportMap, type StoreState } from '@vue/repl'
import Monaco from '@vue/repl/monaco-editor'
import importCodeRaw from './repl-code/importCode.ts?raw'
import useCodeRaw from './repl-code/useCode.ts?raw'
import AppComponentRaw from './repl-code/App.vue?raw'
import ChangePasswordActionRaw from './repl-code/ChangePasswordAction?raw'

const {
  importMap,
  vueVersion,
} = useVueImportMap()

const importMapComputed = computed(() => {
  const importMapAll = importMap.value
  if(importMapAll.imports) {
    importMapAll.imports['@vueaction/core'] = 'https://cdn.jsdelivr.net/npm/@vueaction/core/+esm'
    importMapAll.imports['@vueaction/javascript'] = 'https://cdn.jsdelivr.net/npm/@vueaction/javascript/+esm'
    importMapAll.imports['deepmerge-ts'] = 'https://cdn.jsdelivr.net/npm/deepmerge-ts@7.0.3/dist/node/index.mjs'
  }

  return importMapAll
})

const previewOptions = {
  customCode: {
    importCode: importCodeRaw,
    useCode: useCodeRaw,
  },
}

const store = useStore(
  {
    builtinImportMap: importMapComputed,
    vueVersion,
    template: ref({
      welcomeSFC: AppComponentRaw
    })
  },
)

store.addFile(new File(
  'src/ChangePasswordAction.ts',
  ChangePasswordActionRaw,
  false
))

store.setActive('src/App.vue')
</script>

<template>
  <Repl
    :store="store"
    :editor="Monaco"
    :clear-console="false"
    :preview-options="previewOptions"
  />
</template>