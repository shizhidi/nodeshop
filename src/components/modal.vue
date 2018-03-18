<template>
  <div>
    <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':mdShow}">
      <div class="md-modal-inner">
        <!-- <div class="md-top">
          <div class="md-title">Login in</div>
          <button class="md-close" @click="closeLogin">Close</button>
        </div> -->
        <div class="md-content">
          <div class="confirm-tips">

              <slot name="message"></slot>

          </div>
          <div class="modal-wrap">
            <slot name="model-content"></slot>
            <!-- <a href="javascript:;" class="btn-login" @click="LoginPost">登录</a> -->
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="mdShow" @click="$emit('close')"></div>
  </div>
</template>

<script>
export default {
  props: ['mdShow'],
  data() {
    return {
      attribute: "属性"
    };
  },
  computed: {},
  create() {},
  mounted() {

  },
  methods: {
  },
  components: {}
};
</script>
<style>
  .modal-wrap {
    min-height: 50px;
    _height:50px;
  }
  .modal-wrap div {
    display: -webkit-flex; /* Safari */
    display: flex;
  }

  .modal-wrap a {
    margin: 0 20px;
    flex: 1;
  }

</style>
