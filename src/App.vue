<template>
  <div id="app">

    <nav class="navbar navbar-expand-lg navbar-light" id="navbar">
      <div class="container-fluid">
        <a class="navbar-brand">
          <img src="@/assets/icon/logo.svg" class="img-responsive" style="user-select: none;" height="25"> 
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" href="#/daily">daily</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#/monthly">monthly</a>
            </li>
            <!-- <li class="nav-item">
              <a class="nav-link" href="#/test">test</a>
            </li> -->
          </ul>
        </div>

        <span class="navbar-text text-end">
          <div style="margin-top:-14px;">
            <b class="text-name">{{currentUser.Title}}</b>
          </div>
          <div style="margin-top:-10px;margin-bottom: -15px;">
            <p class="mb-0 mt-1 text-email"  style="">{{currentUser.Email}}</p>
          </div>
        </span>
      </div>
    </nav>
    <br>
    <!-- <br> -->
    <router-view v-slot="{ Component }" >
      <component  :is="Component" :currentUser="currentUser" ref="refReloadData" />
    </router-view>
  </div>
</template>

<script>
  import API from './services/ApiService.js';

  export default {
    name: 'App',
    components: {},
    async created() {
      await this.fetchRequestDigest();
      await this.intervalDigest();
      // this.getCurrentUser();
    },
    data() {
      return {
        // site_url: "",
        items: {},
        currentUser: {},
      };
    },
    methods: {
      async fetchRequestDigest() {
       // console.log("sss")
        API.requestDigest().then((response) => {
       //   console.log("ttt",response.GetContextWebInformation.FormDigestValue)
          this.$local.set('requestDigest', response.GetContextWebInformation.FormDigestValue);
          console.log("ttt",response.GetContextWebInformation.FormDigestValue)
          this.intervalDigest();
          this.$local.requestDigest
           console.log("rrr", response.GetContextWebInformation.FormDigestValue)
        });
      },
      async intervalDigest() {
        setTimeout(() => this.fetchRequestDigest(), 300000);
      },
      // async getCurrentUser() {
      //   API.currentUser().then((response) => {
      //     // console.log("getCurrentUser")
      //     this.currentUser = response;
      //     this.$refs.refReloadData.get_Season();
      //     this.$refs.refReloadData.get_User(response.Email);
      //   });
      // },
      async get_group_admin() {
        API.group().then((response) => {
          var group_admin_name = "administrator";
          var status_admin = response.filter(function (obj) { return obj.Title == group_admin_name }).length != 0;
          this.currentUser.admin = status_admin;
        });
      },
    },
  }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');
  html, body ,table {
    font-family: 'Sarabun', sans-serif;
    /*font-size: 14px;*/
  }
  #app {
    font-family: 'Sarabun', sans-serif;
  }

  #navbar .navbar-brand {
    padding: 0px !important;
  }
  #navbar .navbar-brand img{
    margin: 0px 15px;
  }
  #navbar .navbar-brand small {
    font-size: 18px;
    color: #00bcb4;
    font-weight: 900;
  }
  #navbar {
    height: initial;
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
    background-color: #00beb5 !important;
  }

  .btn-success {
    color: #fff;
    background-color: #00bcb4;
    border-color: #00bcb4;
  }
  .btn-success:hover {
    color: #fff;
    background-color: #018e88;
    border-color: #018e88;
  }

  .nav-link {
    color: #fff !important;
    font-weight: bold;
  }

  .nav-item {
    padding: 6px 12px;
    margin-top: -8px;
    margin-bottom: -8px;
  }

  .nav-item:hover {
    background-color: #00b3ab;
  }
</style>
