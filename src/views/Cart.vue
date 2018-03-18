<template>
  <div>
    <nav-header></nav-header>
    <bread-crumbs>
      <span> Carts </span>
    </bread-crumbs>
    <div class="container">
      <div class="cart">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>我的购物车</span></h2>
        </div>
        <div class="item-list-wrap">
          <div class="cart-item">
            <div class="cart-item-head">
              <ul>
                <li>商品</li>
                <li>单价</li>
                <li>数量</li>
                <li>合计</li>
                <li>编辑</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for="(cart,index) in cartList">
                <div class="cart-tab-1">
                  <div class="cart-item-check">
                    <a href="javascipt:;" class="checkbox-btn item-check-btn" @click="checkedCart(cart)" :class="{'check': +cart.checked}">
                      <svg class="icon icon-ok">
                        <use xlink:href="#svg_icon-ok"></use>
                      </svg>
                    </a>
                  </div>
                  <div class="cart-item-pic">
                    <img v-lazy="'/static/'+ cart.productImage">
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
                    <div class="select-self select-self-open">
                      <div class="select-self-area">
                        <a class="input-sub" @click="updateProductNum(cart,false)">-</a>
                        <span class="select-ipt">{{ cart.productNum }}</span>
                        <a class="input-add" @click="updateProductNum(cart,true)">+</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{ cart.salePrice * cart.productNum }}</div>
                </div>
                <div class="cart-tab-5">
                  <div class="cart-item-opration">
                    <a href="javascript:;" class="item-edit-btn" @click="tootipDel(cart,index)">
                      <svg class="icon icon-del">
                        <use xlink:href="#svg_icon-del"></use>
                      </svg>
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="cart-foot-wrap">
          <div class="cart-foot-inner">
            <div class="cart-foot-l">
              <div class="item-all-check">
                <a href="javascipt:;" @click="selectAll">
                  <span class="checkbox-btn item-check-btn" :class="{'check': hasSelectAll}">
                      <svg class="icon icon-ok"><use xlink:href="#icon-ok"/></svg>
                  </span>
                  <span>全选</span>
                </a>
              </div>
            </div>
            <div class="cart-foot-r">
              <div class="item-total">
                商品总价: <span class="total-price">{{ cartsTotal }}</span>
              </div>
              <div class="btn-wrap">
                <a class="btn btn--red" :class="{'btn--dis': !cartsChecked}" @click="JumpAddress">Checkout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal :mdShow="showModal" @close="showModal = false">
        <p slot="message"> 确定删除吗? </p>
        <div slot="model-content">
          <a href="javascript:;" class="btn btn--m" @click="delCart">确定</a>
          <a href="javascript:;" class="btn btn--m" @click="showModal = false">关闭</a>
        </div>
    </Modal>
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
      showModal: false,
      productId: 0,
      productNum: 0,
      delIndex: 0,
      CheckedLen: 0,
      cartList: []
    };
  },
  computed: {
    cartsTotal() {
      let total = 0
      this.cartList.forEach(function (cart,index) {
        if (+cart.checked) {
          total += (cart.salePrice * cart.productNum)
        }
      });
      return total
    },
    cartsChecked() {
      let len = 0;
      this.cartList.forEach(function (cart,index) {
        if (+cart.checked) {
          len ++
        }
      });
      this.CheckedLen = len
      return len > 0
    },
    hasSelectAll() {
      return this.CheckedLen === this.cartList.length
    }
  },
  create() {},
  mounted() {
    //请求后端接口该用户购物车列表
    this.$axios
      .post("/users/cartList", {})
      .then(res => {
        const result = res.data;
        if (result.status) {
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
    selectAll() {
      debugger
      let all = this.CheckedLen != this.cartList.length ? 1 : 0

      this.cartList.forEach(function (cart,index) {
        if (!+cart.checked && all) {
          cart.checked = 1
        }

        if (!all) {
          cart.checked = 0
        }
      });

    },
    tootipDel(cart){
      this.showModal = true
      this.productId = cart.productId
      this.productNum = cart.productNum
    },
    delCart() {
      const productId = this.productId
      if (productId) {
        this.$axios.post('/users/delCart',{productId,productId})
          .then(res => {
            const result = res.data
            if (result.status == '0') {
              this.showModal = false
              this.cartList.splice(this.delIndex,1);
              this.$store.commit('updateCartCount',-this.productNum)
            }
          })
          .catch(err => {
            console.log('购物车商品删除异常：'+ err);
          })
      }
    },
    checkedCart(cart) {
      debugger;
      cart.checked = +cart.checked == 1 ? 0 : 1;

      this.$axios
        .post("/users/updateChecked", {
          productId: cart.productId,
          checked: cart.checked
        })
        .then(res => {
          debugger
          const result = res.data;
          if (result.status) {
            console.log("修改选中状态成功");
          } else {
            console.log("修改选中状态失败：" + result.error);
          }
        })
        .catch(err => {
          console.error("修改选中状态异常：" + err);
        });
      console.log(cart);
    },
    updateProductNum(cart,bool) {
      bool ? cart.productNum++ : cart.productNum --
      this.$axios
        .post("/goods/addGoods", { productId: cart.productId, productNum: cart.productNum })
        .then(res => {
          debugger;
          let result = res.data;
          if (result.status == '0') {

            bool ? this.$store.commit('updateCartCount',1) : this.$store.commit('updateCartCount',-1)
            console.log('更新商品数量成功'+result);
          } else {
            console.error('更新商品数量失败'+result.error);
          }
        })
        .catch(error => {
          console.log("修改商品数量异常：" + error);
        });
    },
    JumpAddress() {

      this.$router.push('/address')
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
<style>
.input-sub,
.input-add {
  min-width: 40px;
  height: 100%;
  border: 0;
  color: #605f5f;
  text-align: center;
  font-size: 16px;
  overflow: hidden;
  display: inline-block;
  background: #f0f0f0;
}
.item-quantity .select-self-area {
  background: none;
  border: 1px solid #f0f0f0;
}
.item-quantity .select-self-area .select-ipt {
  display: inline-block;
  padding: 0 3px;
  width: 30px;
  min-width: 30px;
  text-align: center;
}
</style>
