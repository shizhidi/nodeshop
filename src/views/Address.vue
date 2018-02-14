<template>
    <div>
      <nav-header></nav-header>
      <bread-crumbs>
        <span> Address </span>
      </bread-crumbs>
      <div class="checkout-page">
        <div class="container">
          <div class="checkout-addr">
            <div class="page-title-normal">
              <h2 class="page-title-h2"><span>check out</span></h2>
            </div>
            <!-- process step -->
            <div class="check-step">
              <ul>
                <li class="cur"><span>Confirm</span> address</li>
                <li><span>View your</span> order</li>
                <li><span>Make</span> payment</li>
                <li><span>Order</span> confirmation</li>
              </ul>
            </div>

            <!-- address list -->
            <div class="page-title-normal checkout-title">
              <h2><span>Shipping address</span></h2>
            </div>
            <div class="addr-list-wrap">
              <div class="addr-list">
                <ul>
                  <li v-for="(address,index) in showThreeAddress" :class="{'check': checkIndex == index && checkIndex != defaultIndex}" @click="selectedAddress(address,index)">
                    <dl>
                      <dt>{{ address.userName }} <span class="fr">邮编：{{ address.postCode }}</span></dt>
                      <dd class="address">{{ address.streetName }}</dd>
                      <dd class="tel">{{ address.tel }}</dd>
                    </dl>
                    <div class="addr-opration addr-del">
                      <a href="javascript:;" class="addr-del-btn" @click="triggerTootip(address.addressId)">
                        <svg class="icon icon-del"><use xlink:href="#svg_icon-del"></use></svg>
                      </a>
                    </div>
                    <div class="addr-opration" :class="{'addr-set-default':true}">
                      <a href="javascript:;" class="addr-set-default-btn" @click="setDefaultAddress(address,index)"><i>Set default</i></a>
                    </div>
                    <div class="addr-opration addr-default">{{ defaultAddress(address,index) }}</div>
                  </li>
                  <li class="addr-new">
                    <div class="add-new-inner">
                      <i class="icon-add">
                        <svg class="icon icon-add"><use xlink:href="#svg_icon-add"></use></svg>
                      </i>
                      <p>Add new address</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div class="shipping-addr-more">
                <a class="addr-more-btn up-down-btn" href="javascript:;" :class="{'open': open}" @click="showMoreList">
                  more
                  <i class="i-up-down">
                    <i class="i-up-down-l"></i>
                    <i class="i-up-down-r"></i>
                  </i>
                </a>
              </div>
            </div>

            <!-- shipping method-->
            <div class="page-title-normal checkout-title">
              <h2><span>Shipping method</span></h2>
            </div>
            <div class="shipping-method-wrap">
              <div class="shipping-method">
                <ul>
                  <li class="check">
                    <div class="name">Standard shipping</div>
                    <div class="price">Free</div>
                    <div class="shipping-tips">
                      <p>Once shipped，Order should arrive in the destination in 1-7 business days</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="next-btn-wrap">
              <router-link class="btn btn--m btn--red" href="#" :to="{ path: '/orderConfirm', query: { addressId: clickCurrentAddressId}}">Next</router-link>
            </div>
          </div>
        </div>
      </div>
      <Modal :mdShow="showModal" @close="showModal = false">
          <p slot="message"> 确定删除吗? </p>
          <div slot="model-content">
            <a href="javascript:;" class="btn btn--m" @click="delAddress">确定</a>
            <a href="javascript:;" class="btn btn--m" @click="showModal = false">关闭</a>
          </div>
      </Modal>

      <Modal :mdShow="addressModal" @close="addressModal = false">
          <p slot="message"> 设置默认地址成功 </p>
      </Modal>
      <nav-footer></nav-footer>
    </div>
</template>
<style>

</style>
<script>
import NavHeader from "@/components/Header.vue";
import NavFooter from "@/components/Footer.vue";
import BreadCrumbs from "@/components/BreadCrumbs.vue";
import Modal from "@/components/modal.vue";
export default {
  data() {
    return {
      checkIndex: 0,
      defaultIndex: 0,
      open: false,
      defaultLength: 3,
      defaulAddressId: 0,
      addressModal: false,
      showModal: false,
      clickCurrentAddressId: 0,
      addressList: []
    };
  },
  computed: {
    showThreeAddress() {
      let list = this.addressList.slice(0,this.defaultLength);
      return list
    }
  },
  create() {},
  mounted() {
    this.getAddressList()
  },
  methods: {
    showMoreList() {
      if (this.defaultLength === 3) {
        this.open = true
        this.defaultLength = this.addressList.length
      }else{
        this.open = false
        this.defaultLength = 3
      }
    },
    defaultAddress(address,index) {
      let str = ''
      if (address.isDefault) {
        this.defaultIndex = index
        this.defaulAddressId = address.addressId
        str = 'Default address';
      }
      return  str
    },
    selectedAddress(address,index) {
      this.checkIndex = index
      this.clickCurrentAddressId = address.addressId
    },
    getAddressList() {
      this.$axios
      .post("/users/addressList", {})
      .then(res => {
        const result = res.data;
        if (result.status) {
          this.addressList = result.addressList;
        } else {
          console.log("获取地址列表失败：" + result.msg);
        }
      })
      .catch(err => {
        console.log("获取地址列表异常：" + err);
      });
    },
    triggerTootip(addressId) {
      this.clickCurrentAddressId = addressId
      this.showModal = true
    },
    setDefaultAddress(address,index) {
      const addressId = address.addressId
      this.$axios
        .post("/users/setAddress", {addressId:addressId})
        .then(res => {
          debugger
          const result = res.data;
          if (result.status) {
            this.getAddressList()
            this.addressModal = true
          } else {
            console.log("设置默认地址失败：" + result.msg);
          }
        })
        .catch(err => {
          console.log("设置默认地址异常：" + err);
        });
    },
    delAddress() {
      let addressId = this.clickCurrentAddressId
      this.$axios
        .post("/users/delAddress", {addressId:addressId})
        .then(res => {
          const result = res.data;
          if (result.status) {

          } else {
            console.log("删除地址失败：" + result.msg);
          }
        })
        .catch(err => {
          console.log("删除地址异常：" + err);
        });
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
