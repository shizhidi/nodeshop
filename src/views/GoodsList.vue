<template>
    <div>
      <nav-header></nav-header>
      <bread-crumbs>
        <span> Goods </span>
      </bread-crumbs>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">价格过滤:</span>
            <a href="javascript:void(0)" class="default cur">默认</a>
            <a href="javascript:void(0)" v-bind:class="{ 'price': true,'sort-up': sort}" @click="sortFn">{{ sort ? '从低到高' : '从高到低' }} <svg class="icon icon-arrow-short "><use xlink:href="#svg_icon-arrow-short" ></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilter">价格过滤</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div v-bind:class="{ 'filter': true, 'stopPop':true, 'filterby-show': FilterbyShow}" id="filter">
              <dl class="filter-price">
                <dt>价格:</dt>
                <dd><a href="javascript:void(0)" v-bind:class = "{'cur': PriceSelected == 'all'}" @click="PriceSelectedAll">所有</a></dd>
                <div>
                  <dd v-for="(item, index) in PriceRanges">
                    <a href="javascript:void(0)" v-bind:class = "{'cur': PriceSelected == index}" @click="PriceSelectedItem(item,index)" >{{ item.minPrice }} - {{ item.maxPrice }}</a>
                  </dd>
                </div>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul >
                  <li v-for="(product,index) in GoodsListNumbers">
                    <div class="pic">
                      <a href="#"><img v-lazy=" 'static/' + product.productImage" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{ product.productName }}</div>
                      <div class="price">{{ product.salePrice }}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addGoods(product.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div v-infinite-scroll="loadMore" class="text-center" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
                  <img v-show="loadingSpinning" class="text-center" src="static/loading-svg/loading-spinning-bubbles.svg" />
                  <!-- <span v-show="loadingSpinning">加载中。。。。</span> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal :mdShow="showModal" @close="showModal = false">
          <p slot="message"> 添加成功 </p>
          <div slot="model-content">
            <a href="javascript:;" class="btn btn--m" @click="showModal = false">继续购物</a>
            <router-link  class="btn btn--m" to="/cart">查看购物车</router-link >
          </div>
      </Modal>

      <Modal :mdShow="tootipModal" @close="tootipModal = false">
          <p slot="message"> 当前未登录,不允许添加购物车 </p>
          <div slot="model-content">
            <a href="javascript:;" class="btn btn--m" @click="tootipModal = false">关闭</a>
          </div>
      </Modal>
      <div class="md-overlay" v-show="overlay" @click="hiddenOverlay"></div>
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
      Bread: "Goods",
      PriceSelected: "?",
      FilterbyShow: false,
      overlay: false,
      page: 1,
      pageSize: 4,
      sort: true,
      busy: false,
      showModal: false,
      tootipModal: false,
      PriceRanges: [
        { minPrice: 0, maxPrice: 100 },
        { minPrice: 100, maxPrice: 500 },
        { minPrice: 500, maxPrice: 1000 },
        { minPrice: 1000, maxPrice: 2000 }
      ],
      filterMin: 0,
      filterMax: 10000000,
      GoodsList: [],
      loadingSpinning: true
    };
  },
  create() {
    let path = this.$route.path;
    //this.Bread = path.slice(1);
  },
  mounted() {
    //获取商品列表
    //this.getGoodsList();
  },
  computed: {
    GoodsListNumbers() {
      return this.GoodsList.filter(current => {
        return (
          this.filterMin < current.salePrice &&
          current.salePrice < this.filterMax
        );
      });
    }
  },
  components: {
    NavHeader,
    NavFooter,
    BreadCrumbs,
    Modal
  },
  methods: {
    showFilter() {
      this.FilterbyShow = true;
      this.overlay = true;
    },
    hiddenOverlay() {
      this.overlay = false;
      this.FilterbyShow = false;
    },
    addGoods(productId) {
      this.$axios
        .post("/goods/addGoods", { productId: productId })
        .then(res => {
          debugger;
          let result = res.data;
          if (result.status == '0') {
            this.$store.commit('updateCartCount',1)
            this.showModal = true
            //修改购物车小图标状态数字
            console.log(result)
          } else if(result.status == "10001") {
            this.tootipModal = true
          }else{
            console.error('用户添加商品失败'+ result.error)
          }
        })
        .catch(error => {
          console.log("获取商品列表失败：" + error);
        });
    },
    sortFn() {
      this.sort = !this.sort;
      this.page = 1;
      this.getGoodsList();
    },
    PriceSelectedAll() {
      this.PriceSelected = "all";
      this.filterMin = 0;
      this.filterMax = 10000000;
    },
    PriceSelectedItem(item, index) {
      this.PriceSelected = index;
      this.filterMin = +item.minPrice;
      this.filterMax = +item.maxPrice;
    },
    getGoodsList(plug) {
      var params = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sort ? 1 : -1,
        filterMin: this.filterMin,
        filterMax: this.filterMax
      };
      this.$axios
        .get("/goods/goodsList", {
          params: params
        })
        .then(res => {
          let data = res.data;
          console.log(res.data);
          if (data.status == false) {
            //获取数据失败
          } else {
            if (plug) {
              if (data.result.count != 0) {
                this.busy = false;
                this.GoodsList = this.GoodsList.concat(data.result.list);
              } else {
                this.busy = true;
              }
            } else {
              this.busy = false;
              this.GoodsList = data.result.list;
            }
          }
        })
        .catch(error => {
          console.log("获取商品列表失败：" + error);
        });
    },
    loadMore() {
      this.busy = true;
      this.loadingSpinning = true;
      setTimeout(() => {
        this.page += 1;
        this.getGoodsList(true);
        this.loadingSpinning = false;
      }, 500);
    }
  }
};
</script>
