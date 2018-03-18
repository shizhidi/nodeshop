<template>
  <header class="header">
    <div class="navbar">
      <div class="navbar-left-container">
        <a href="/">
          <img class="navbar-brand-logo" src="static/logo.png">
        </a>
      </div>
      <div class="navbar-right-container" style="display: flex;">
        <div class="navbar-menu-container">
          <!--<a href="/" class="navbar-link">我的账户</a>-->
          <span class="navbar-link">{{ nickName ? nickName : '' }}</span>
          <a href="javascript:void(0)" v-if="nickName" class="navbar-link" @click="userLogout">登出</a>
          <a href="javascript:void(0)" v-if="!nickName" class="navbar-link" @click="userLogin">登录</a>

          <div class="navbar-cart-container">
            <span class="navbar-cart-count">{{ cartCount ? cartCount : '' }}</span>
            <router-link class="navbar-link navbar-cart-link" to="/cart">
              <svg class="navbar-cart-logo">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg_icon-cart"></use>
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 登陆模态框 -->
    <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':LoginStatus}">
      <div class="md-modal-inner">
        <div class="md-top">
          <div class="md-title">Login in</div>
          <button class="md-close" @click="closeLogin">Close</button>
        </div>
        <div class="md-content">
          <div class="confirm-tips">
            <div class="error-wrap">
              <span class="error" v-bind:class="{'error-show':errShow}">用户名或者密码错误</span>
            </div>
            <ul>
              <li class="regi_form_input">
                <i class="icon IconPeoper"></i>
                <input type="text" tabindex="1" v-model="username" name="loginname" class="regi_login_input">
              </li>
              <li class="regi_form_input noMargin">
                <i class="icon IconPwd"></i>
                <input type="password" tabindex="2" v-model="password" @keyup.enter="LoginPost" name="password" class="regi_login_input">
              </li>
            </ul>
          </div>
          <div class="login-wrap">
            <a href="javascript:;" class="btn-login" @click="LoginPost">登录</a>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overlay" @click="closeLogin"></div>
  </header>
</template>
<script>
export default {
  data() {
    return {
      ifLogin: false,
      overlay: false,
      LoginStatus: false,
      errShow: false,
      username: '',
      password: ''
    };
  },
  computed: {
    nickName () {
      return this.$store.state.nickName
    },
    cartCount() {
      return this.$store.state.cartCount
    }
  },
  mounted () {
    /*
    this.$axios.post('/users/getUserName')
      .then(res => {
        debugger
        const result = res.data
        if (result.status == '0') {
          this.username = result.result
        }else{
          console.error('获取用户失败：'+ result.error)
        }
      })
      .catch(error => {
        console.error('获取用户异常：'+ error)
      })
       */
  },
  methods: {
    userLogin() {
      this.LoginStatus = true
      this.overlay = true
    },
    userLogout() {
      this.$axios.post('/users/logout',{})
        .then(res => {
          debugger
          const result = res.data
          if (result.status) {
            this.$store.commit('updateUserInfo', '')
            this.$store.commit('initCartCount')
          }
        })
        .catch(error => {
          console.log('删除cookie失败：'+ error)
        })
    },
    closeLogin() {
      this.LoginStatus = false
      this.overlay = false
    },
    LoginPost() {
      this.$axios.post('/users/login',{
          userName: this.username,
          userPwd: this.password
        })
        .then(res => {
          debugger
          const result = res.data
          if (result.status == '0') {
            this.$store.commit('updateUserInfo',result.userName)
            this.$store.commit('updateCartCount',result.cartCount)
            this.closeLogin()
          }else{
            console.log(result.msg)
          }
        })
        .catch(error => {
          console.log('用户登陆失败：'+ error)
        })
    }
  }
};
</script>
