<template>
  <div class="RootView">
    <ComPdfDesigner></ComPdfDesigner>
  </div>
  <teleport to="#teleport">
    <VcToast :data="storeComponent.state.toastData" />
    <VcWindowLoader :data="storeComponent.state.windowLoaderData" />
    <VcDialog :data="storeComponent.state.dialogData" />
    <VcSelectModal :data="storeComponent.state.selectBoxModalData" />
  </teleport>
</template>
<script lang="ts" src="./root-view-script.ts"></script>
<style lang="scss" scoped>
.serverType {
  position: fixed;
  bottom: 10px;
  left: 10px;
  right: 10px;
  width: calc(100% - 20px);
  cursor: pointer;
  z-index: 999;
}
</style>
