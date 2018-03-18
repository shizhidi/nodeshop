<template>
  <div>
   <nav-header></nav-header>
    <bread-crumbs>
      <span> Carts </span>
    </bread-crumbs>
    <div class="container">
      <div class="checkout-order">
        <!-- process step -->
        <div class="check-step">
          <ul>
            <li class="cur">确认地址</li>
            <li class="cur">查看订单</li>
            <li>支付</li>
            <li>确认订单</li>
          </ul>
        </div>

        <!-- order list -->
        <div class="page-title-normal checkout-title">
          <h2><span>订单内容</span></h2>
        </div>
        <div class="item-list-wrap confirm-item-list-wrap">
          <div class="cart-item order-item">
            <div class="cart-item-head">
              <ul>
                <li>订单内容</li>
                <li>单价</li>
                <li>数量</li>
                <li>合计</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for="(cart,index) in filterChecked">
                <div class="cart-tab-1">
                  <div class="cart-item-pic">
                    <img v-lazy="'/static/'+ cart.productImage" alt="XX">
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">{{ cart.productName }}</div>

                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{ cart.salePrice }}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self">
                      <div class="select-self-area">
                        <span class="select-ipt">×{{ cart.productNum }}</span>
                      </div>
                    </div>
                    <div class="item-stock item-stock-no">有现货</div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{ cart.salePrice * cart.productNum }}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Price count -->
        <div class="price-count-wrap">
          <div class="price-count">
            <ul>
              <li>
                <span>商品总价:</span>
                <span>{{ subtotal }}</span>
              </li>
              <li>
                <span>运费:</span>
                <span>30</span>
              </li>
              <li>
                <span>折扣:</span>
                <span>100</span>
              </li>
              <li>
                <span>个税:</span>
                <span>300</span>
              </li>
              <li class="order-total-price">
                <span>订单总额:</span>
                <span>{{ orderTotal }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="order-foot-wrap">
          <div class="prev-btn-wrap">
            <router-link class="btn btn--m" to="/address">上一步</router-link>
          </div>
          <div class="next-btn-wrap">
            <button class="btn btn--m btn--red" @click="createOrder">前往支付</button>
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
      addressId: 0,
      subtotal: 0,
      orderTotal: 0,
      cartList: []
    };
  },
  computed: {
    filterChecked() {
      let tempCarts = []
      let total = 0
      this.cartList.forEach((cart) => {
        if (cart.checked) {
          tempCarts.push(cart)
          this.subtotal += (cart.salePrice * cart.productNum)
        }
      })
      this.orderTotal = this.subtotal + 30 - 100 + 300
      return tempCarts
    }
  },
  mounted() {
    debugger
    this.addressId = this.$route.query.addressId
    this.$axios
      .post("/users/cartList", {})
      .then(res => {
        const result = res.data;
        if (result.status == '0') {
          this.cartList = result.cartList;
        } else {
          console.log("获取购物车列表失败：" + result.msg);
        }
      })
      .catch(err => {
        console.log("获取购物车列表异常：" + err);
      });
  },
  methods: {
    createOrder() {
      const addressId = this.addressId
      console.log('地址'+ addressId)
      //创建订单地址,成功跳转到成功页面
      this.$axios.post('/users/addOrder',{addressId,orderTotal:this.orderTotal})
        .then((res) => {
          let result = res.data
          if (result.status) {
            this.$router.push({'path': '/orderSuccess',query: { orderId: result.orderId}})
          }else{
            console.log('添加订单错误'+ result.error);
          }
        })
        .catch((err) => {
          console.error('添加订单异常：'+ err);
        })
    }
  },
  components: {
    NavHeader,
    NavFooter,
    BreadCrumbs,
    Modal
  }
};
</script>
