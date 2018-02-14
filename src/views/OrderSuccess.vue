<template>
    <div>
      <nav-header></nav-header>
      <bread-crumbs>
        <span> OrderSuccess </span>
      </bread-crumbs>
      <div class="container">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>check out</span></h2>
        </div>
        <!-- 进度条 -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>Confirm</span> address</li>
            <li class="cur"><span>View your</span> order</li>
            <li class="cur"><span>Make</span> payment</li>
            <li class="cur"><span>Order</span> confirmation</li>
          </ul>
        </div>

        <div class="order-create">
          <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
          <div class="order-create-main">
            <h3>Congratulations! <br>Your order is under processing!</h3>
            <p>
              <span>Order ID：{{ orderId }}</span>
              <span>Order total：{{ orderTotal }}</span>
            </p>
            <div class="order-create-btn-wrap">
              <div class="btn-l-wrap">
                <router-link class="btn btn--m" to="/cart">Cart List</router-link>
              </div>
              <div class="btn-r-wrap">
                <router-link class="btn btn--m" to="/goods">Goods List</router-link>
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
