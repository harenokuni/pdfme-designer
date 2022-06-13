<template>
  <input type="file" class="file-elm-hidden" :accept="props.vcFileSelectProps.option.fileAcceptList.join(',')" @change="(e)=>fileChange(e)" ref="elmFile" />
</template>

<script lang="ts" src="./vc-file-select-script.ts"></script>

<style lang="scss" scoped>
.file-elm-hidden {
  display: none;
}
</style>
