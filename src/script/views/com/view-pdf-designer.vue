<template>
  <div class="views">
    <div>
      <div class="card mx-3 mt-3">
        <div class="card-header">
          <span>Designer ※@pdfme/ui</span>
          <VcToggleSwitch placeholder="自動リスト生成（位置調整の時以外はOFFを推奨）" leftLabel="OFF" rightLabel="ON"
            :data="state.autoSync === true ? 1 : 0"
            @valueChange="(v: number) => state.autoSync = v == 1 ? true : false" />
        </div>
        <div class="card-body bg-paper">
          <div class="card card-flat">
            <div class="card-body">
              <div class="row">
                <div class="col-3">
                  <VcFormButton class="btn-action-dark mt-1 w-100 justify-content-center" @click.stop="resetTemplate">
                    新規
                  </VcFormButton>
                </div>
                <div class="col-3">
                  <VcFormButton class="btn-action-dark mt-1 w-100 justify-content-center"
                    @click.stop="fileSelectTemplateShow">
                    Template を編集
                  </VcFormButton>
                </div>
                <div class="col-3">
                  <VcFormButton class="btn-action-dark mt-1 w-100 justify-content-center"
                    @click.stop="fileSelectBaseUrlShow">
                    BasePdf変更
                  </VcFormButton>
                </div>
                <div class="col-3">
                  <VcFormButton class="btn-action-dark mt-1 w-100 justify-content-center"
                    :disabled="!state.data.isChange" @click.stop="download">
                    ダウンロード
                  </VcFormButton>
                </div>
              </div>
            </div>
          </div>
          <input type="file" class="d-none" accept=".pdf"
            @change="(e) => state.fileSelect.baseUrl.FileChangeAndGetDataUrl(e)"
            :ref="(e) => state.fileSelect.baseUrl.SetRef(e)" />
          <input type="file" class="d-none" accept=".json"
            @change="(e) => state.fileSelect.template.FileChangeAndGetDataString(e)"
            :ref="(e) => state.fileSelect.template.SetRef(e)" />
        </div>
        <div class="card-body d-flex">
          <div class="pdf-desiner-container">
            <!-- designer -->
            <div class="pdfDesiner" :ref="(e) => setRef(e, 'pdfDesiner')"></div>
          </div>
          <div class="pdf-desiner-schemasEdit ">
            <div>リスト機能</div>
            <VcFormButton class="btn-action-dark" @click.stop="addListItem">リスト追加</VcFormButton>
            <div class="list-group my-2  border-secondary ">
              <template v-for="(row, index) in state.data.edit.list" :key="index">
                <div class="list-group-item border-secondary bg-theme2">
                  <div class="d-flex mb-1">
                    <VcValuebox placeholder="count" :min="1" :max="999" :nullable="false" v-model:data="row.count"
                      @warn="(message: string) => toast.Error(message, '入力値エラー', 2500)" @valueChange="resetSchemas()">
                    </VcValuebox>
                    <div class="updown mx-1">
                      <div class="up" @click.stop="row.count = row.count + 1; resetSchemas()"><i
                          class="fas fa-caret-up"></i></div>
                      <div class="down" @click.stop="row.count = row.count - 1; resetSchemas()"><i
                          class="fas fa-caret-down"></i></div>
                    </div>
                    <VcValuebox placeholder="span" @warn="(message: string) => toast.Error(message, '入力値エラー', 2500)"
                      :min="0" :max="50" :nullable="false" unit="mm" :digits="2" v-model:data="row.span"
                      @valueChange="resetSchemas()">
                    </VcValuebox>
                    <div class="updown ms-1">
                      <div class="up" @click.stop="row.span = row.span + 0.01; resetSchemas()"><i
                          class="fas fa-caret-up"></i></div>
                      <div class="down" @click.stop="row.span = row.span - 0.01; resetSchemas()"><i
                          class="fas fa-caret-down"></i></div>
                    </div>
                  </div>
                  <VcSelectBox class="mb-1" placeholder="リスト対象追加" :require="false" :disabled="false"
                    :config="state.control.targetList" @valueChange="(a: any, b: any) => targetListAdd(a, b, row)" />
                  <ul class="list-group" v-if="row.targetList.length > 0">
                    <div class="list-group-item d-flex justify-content-between align-items-center"
                      v-for="(targetName, index2) in row.targetList" :key="index2">
                      {{ targetName }}
                      <span class="px-2 py-1 cursor-pointer" @click="targetListItemRemove(row, targetName)"><i
                          class="fas fa-times text-danger"></i></span>
                    </div>
                  </ul>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src='./view-pdf-designer.script.ts'>
import VcValuebox from '@/script/vc-components/vc-form-control/vc-valuebox.vue';</script>
<style lang="scss" scoped>
.pdf-desiner-container {
  width: 70%;
  border: solid gray 1px;
}

.pdf-desiner-schemasEdit {
  width: 30%;
  padding-left: 20px;
}

.updown {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 2em;

  >div {
    border: solid 1px gray;
    background-color: #9cd3ff;
    color: #213a5f;
    height: 50%;
    width: 100%;
    text-align: center;
    cursor: pointer;
    border-radius: 2px;
  }
}

.file-elm-hidden {}
</style>