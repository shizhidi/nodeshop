<template>
    <div>
      <nav-header></nav-header>
      <bread-crumbs>
        <span> OrderSuccess </span>
      </bread-crumbs>
      <div class="container">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>完成</span></h2>
        </div>
        <!-- 进度条 -->
        <div class="check-step">
          <ul>
            <li class="cur">确认地址</li>
            <li class="cur">查看订单</li>
            <li class="cur">支付</li>
            <li class="cur">确认订单</li>
          </ul>
        </div>

        <div class="order-create">
          <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
          <div class="order-create-main">
            <h3>祝贺您已完成订单！</h3>
            <p>
              <span>订单编号：{{ orderId }}</span>
              <span>订单总额：{{ orderTotal }}</span>
            </p>
            <div class="order-create-btn-wrap">
              <div class="btn-l-wrap">
                <router-link class="btn btn--m" to="/cart">购物车列表</router-link>
              </div>
              <div class="btn-r-wrap">
                <router-link class="btn btn--m" to="/goods">商品列表</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <nav-footer></nav-footer>
    </div>
</template>
<script>
import NavHeader from "@/components/Header.vue";
import NavFooter from "@/components/Footer.vue";
import BreadCrumbs from "@/components/BreadCrumbs.vue";
import Modal from "@/components/modal.vue";
export default {
  data() {
    return {
      orderTotal: 0,
      orderId: 0
    };
  },
  computed: {},
  mounted() {
    debugger
    const orderId = this.orderId = this.$route.query.orderId
    this.$axios
      .post("/users/getOrderTotal", {orderId})
      .then(res => {
        debugger
        const result = res.data;
        if (result.status == '0') {
          this.orderTotal = result.orderTotal
        } else {
          console.log("获取订单总金额失败：" + result.msg);
        }
      })
      .catch(err => {
        console.log("获取订单总金额异常：" + err);
      });
  },
  methods: {},
  components: {
    NavHeader,
    NavFooter,
    BreadCrumbs,
    Modal
  }
};
</script>
