<template>
  <div class="box text-gray-50">
    <div class="box-heading d-flex align-items-center justify-content-between">
      <div class="text-13">MUD资源</div>
    </div>
    <ul>
      <li class="py-1">
        <docs-icon class="mr-1"/>
        <a class="text-gray-50" href="https://bbs.mud.ren/threads/98">MUD资源汇总</a>
      </li>
      <li class="py-1">
        <docs-icon class="mr-1"/>
        <a class="text-gray-50" href="https://wiki.mud.ren/index.php?title=Lpc:Efun" target="_blank">LPC函数WIKI</a>
      </li>
      <li class="py-1">
        <docs-icon class="mr-1"/>
        <a class="text-gray-50" href="https://www.mud.ren/lpc.html" target="_blank">LPC函数文档（旧）</a>
      </li>
      <li class="py-1">
        <docs-icon class="mr-1"/>
        <a class="text-gray-50" href="https://www.fluffos.info/" target="_blank">FluffOS官方网站</a>
      </li>
      <li class="py-1">
        <docs-icon class="mr-1"/>
        <a class="text-gray-50" href="https://github.com/fluffos/fluffos" target="_blank">FluffOS源代码</a>
      </li>
      <li class="py-1">
        <docs-icon class="mr-1"/>
        <a class="text-gray-50" href="https://github.com/mudren" target="_blank">MUDLIB下载</a>
      </li>
      <li class="py-1">
        <docs-icon class="mr-1"/>
        <a class="text-gray-50" href="https://im-mortal.cn/mudlist" target="_blank">中文MUD列表</a>
      </li>
      <li class="py-1">
        <docs-icon class="mr-1"/>
        <a class="text-gray-50" href="https://www.revivalworld.org/mud/taiwanmudlist" target="_blank">台湾MUD列表</a>
      </li>
      <li class="py-1">
        <docs-icon class="mr-1"/>
        <a class="text-gray-50" href="https://www.topmudsites.com/" target="_blank">国外MUD列表</a>
      </li>
      <li class="py-1">
        <docs-icon class="mr-1"/>
        <a class="text-gray-50" href="http://mud.ren/websocket.html" target="_blank">MUD WebSocket Test</a>
      </li>
      <li class="py-1">
        <docs-icon class="mr-1"/>
        <a class="text-gray-50" href="http://mud.ren:8080/" target="_blank">勇者斗恶龙MUD</a>
      </li>
      <li class="py-1">
        <docs-icon class="mr-1"/>
        <a class="text-gray-50" href="http://mud.ren:8888/" target="_blank">炎黄群侠传MUD</a>
      </li>
    </ul>
  </div>
</template>

<script>
import DocsIcon from "$icons/FileDocumentBoxOutline";

export default {
  name: "quick-docs",
  components: { DocsIcon }
};
</script>

<style scoped>
</style>
