<template>
  <div class="box text-gray-50">
    <div class="box-heading d-flex align-items-center justify-content-between">
      <div class="text-13">MUD文档</div>
    </div>
    <ul>
      <li class="py-1">
        <docs-icon class="mr-1"/>
        <a
          class="text-gray-50"
          href="https://wiki.mud.ren"
          target="_blank"
        >Mud.Wiki</a>
      </li>
      <li class="py-1">
        <docs-icon class="mr-1"/>
        <a class="text-gray-50" href="https://www.fluffos.info/" target="_blank">Fluffos 官方网站</a>
      </li>
      <li class="py-1">
        <docs-icon class="mr-1"/>
        <a
          class="text-gray-50"
          href="https://github.com/fluffos/fluffos"
          target="_blank"
        >FluffOS源代码</a>
      </li>
      <li class="py-1">
        <docs-icon class="mr-1"/>
        <a class="text-gray-50" href="https://github.com/mudren" target="_blank">MUDLIB大全</a>
      </li>
    </ul>
  </div>
</template>

<script>
import DocsIcon from '$icons/FileDocumentBoxOutline'

export default {
  name: 'quick-docs',
  components: { DocsIcon }
}
</script>

<style scoped>
</style>
