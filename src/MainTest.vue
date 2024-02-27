<template>
    <div v-if="loading" class="position-absolute top-50 start-50 translate-middle">
      <div class="spinner-grow text-lotus-green" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-lotus-green mx-2" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-lotus-green" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  
    <div v-else class="container">
      <div v-if="currentUser == null && admingroup != 'Admin_Group'" class="text-center mt-5">
        <div class="permission permission-first">Invalid</div>
        <div class="permission permission-last"><span>Permissions</span></div>
        <br />
        <b class="b-permission">การเข้าใช้งานล้มเหลว</b>
        <br />
        <p><u class="u-permission">โปรดตรวจสอบ Account ที่เข้าใช้งาน</u></p>
        <p class="p-permission animated fadeInUp">สำหรับสาขาต้องใช้ Account สาขา</p>
        <p class="p-permission animated fadeInUp">สำหรับสำนักงานใหญ่ต้องมีสิทธิ์ในการเข้าใช้งาน</p>
        <p class="p-permission animated fadeInUp">หากยังพบปัญหาติดต่อ Service Desk</p>
      </div>
      <div v-else>
        <div class="d-flex justify-content-between">
          <div>
            <h2 class="text-lotus-green">Stock Card monthly Report</h2>
            <h5 v-if="showStoreCode">พนักงานสาขา {{ StoreNo }} </h5>
            <h5 v-else>Admin</h5>
          </div>
          <div>
            <div class="text-end">
              <a class="text-lotus-green text-end" style="text-decoration: none;font-size: 25px;"
                href="https://thlotuss.sharepoint.com/sites/EArchiveDev/SitePages/Portal.aspx">
                <i class="fa-solid fa-turn-up selector"></i> Back
              </a>
            </div>
            <div v-if="loading">
              <div class="spinner-grow text-lotus-green" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
        <hr />
  
        <div class=" mb-3">
          <form>
            <div class="row">
              <div class="col-3" v-if="!showStoreCode">
                <div>
                  <label for="end-date-picker">เลขสาขา</label>
                  <input class="form-control rounded-pill" v-model="formdaily.StoreName" />
                </div>
              </div>
              <div class="col-3">
                <div class="form-group">
                  <label for="start-date-picker">วันที่<label class="text-danger">*</label></label>
                  <input v-model="formdaily.StartDate" type="month" class="form-control rounded-pill custom-month-input" />
                </div>
              </div>
              <div class="col-3">
                <div class="form-group">
                  <label for="end-date-picker">ถึงวันที่</label>
                  <input v-model="formdaily.EndDate" type="month" class="form-control rounded-pill custom-month-input" />
                </div>
              </div>
              <div class="col text-end">
                <label for="end-date-picker"></label>
                <div>
                  <button type="button" class="btn btn-success rounded-pill bg-greens" @click="postMonthly">
                    <i class="fa-solid fa-magnifying-glass"></i> ค้นหา
                  </button>
                </div>
              </div>
            </div>
          </form>
  
        </div>
  
        <div class="table-responsive">
          <table class="table table-striped border text-center" ref="example" id="table">
            <thead>
              <tr>
                <td class="text-center border"><b>หมายเลขสาขา</b></td>
                <td class="text-center border"><b>เลขที่เอกสาร</b></td>
                <td class="text-center border"><b>วันที่</b></td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in tableData" :key="index">
                <td class="border">{{ item.StoreName }}</td>
                <td class="border"> <a :href="'https://colleague.lotuss.com/earchive/api/viewfilefromid/2020/' + item.ID"
                    target="_blank">{{ getFileName(item.FileRef) }}</a></td>
                <td class="border">{{ moment(item.Created).format('MM/YYYY') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import API from './services/ApiService.js';
  
  import axios from "axios";
  
  import $ from 'jquery';
  
  import '@vuepic/vue-datepicker/dist/main.css'
  
  var moment = require('moment');
  import { createToast } from "mosha-vue-toastify";
  
  
  export default {
    async created() {
      // await this.showData();
      this.loading = false;
      this.getCurrentUser()
      this.getgroup();
      await this.fetchRequestDigest();
      await this.intervalDigest();
      this.initializeDataTable();
    },
    data() {
      return {
        loading: true,
        moment: moment,
        searchQuery: '',
        currentUser: {},
        group: {},
        usernameMe: [],
        site_url: process.env.VUE_APP_HOST + process.env.VUE_APP_SITE,
        Request: [],
        test: [],
  
        showStoreCode: false,
        loadingpost: false,
        formdaily: {
          StoreName: '',
          StartDate: '',
          EndDate: '',
        },
        tableData: [],
        responseData: null,
        StoreNo: null,
        admingroup: ''
      }
    },
  
    computed: {
  
  
    },
  
    methods: {
  
      initializeDataTable() {
        $("#table").DataTable().destroy();
        setTimeout(() => $("#table").DataTable({}), 100);
      },
  
  
      // get data in table
      async showData() {
        let vm = this;
        var headers = {
          accept: "application/json;odata=verbose",
          "content-type": "application/json;odata=verbose",
        };
  
        //  var url = this.site_url + "/_api/web/lists/GetByTitle('Lotus-Tags Table')/items?$top=5000";
        const url = "https://colleague.lotuss.com/pl-server/api/getStockCardMonthly";
  
        this.test = await axios.get(url, { headers })
          .then((response) => {
            vm.test = response.data.d.results
            vm.test.forEach(item => item.Id = parseInt(item.Id));
            vm.test.sort((a, b) => a.Id - b.Id);
            $("#table").DataTable().destroy();
            setTimeout(() => $("#table").DataTable({
              order: [[0, "desc"]] // sort by the first column (index 0) in ascending เก่า order || desc ใหม่
            }), 100);
            console.log("test", response.data.d.results);
            return vm.test;
          });
      },
  
      getFileName(stFileName) {
        const fileName = stFileName.substring(stFileName.lastIndexOf("\\") + 1);
        return fileName;
      },
  
      async postMonthly() {
        const config = {
          headers: {
            accept: "application/json;odata=verbose",
            "Content-type": "application/json;odata=verbose",
            "IF-MATCH": "*",
          },
        };
  
        const currentDate = moment().format("YYYY-MM");
        const startDate = moment(currentDate).subtract(0, "days").format("YYYY-MM");
  
        if (this.formdaily.StartDate == '') {
          this.formdaily.StartDate = startDate;
        } else {
          this.formdaily.StartDate ? moment(`${this.formdaily.StartDate}-01`).format("DD/MM/YYYY") : "";
  
        }
  
        const requestBody = {
          __metadata: {
            type: "SP.Data.LotusTags_x0020_TableListItem",
          },
          StoreName: this.formdaily.StoreName,
          StartDate: this.formdaily.StartDate ? moment(`${this.formdaily.StartDate}-01`).format("DD/MM/YYYY") : "",
          EndDate: this.formdaily.EndDate ? moment(`${this.formdaily.EndDate}-01`).format("DD/MM/YYYY") : "",
        };
  
        const url = "https://colleague.lotuss.com/pl-server/api/getStockCardMonthly";
        axios.post(url, requestBody, config,)
          .then(response => {
            console.log(response);
            if (response.status == 200 || response.status == 201 || response.status == 204) {
              // createToast("บันทึกเรียบร้อย!", { type: "success", position: "top-right", showIcon: true, timeout: 5000, });
              this.tableData = response.data;
              this.filterData();
              $("#table").DataTable().destroy();
              setTimeout(() => $("#table").DataTable({
              }), 100);
  
            }
          })
          .catch(error => {
            console.error('Error creating field:', error);
            createToast("เกิดข้อผิดพลาดที่! StockCardMonthly", { type: "danger", position: "top-right", showIcon: true, timeout: 5000, });
            this.initializeDataTable();
          });
      },
  
  
      async filterData() {
        const startDate = new Date(this.formdaily.StartDate);
        let endDate = null;
  
        if (this.formdaily.EndDate && this.formdaily.EndDate.trim() !== "") {
          endDate = new Date(this.formdaily.EndDate);
        }
  
        this.tableData = this.tableData.filter((item) => {
          const itemDate = new Date(item.Created);
          if (endDate) {
            return itemDate >= startDate && itemDate <= endDate;
          } else {
            return itemDate >= startDate;
          }
        });
      },
  
  
      async fetchRequestDigest() {
        API.requestDigest().then((response) => {
          this.intervalDigest();
          this.requestDigest = response.GetContextWebInformation.FormDigestValue;
        });
      },
      async intervalDigest() {
        setTimeout(() => this.fetchRequestDigest(), 300000);
      },
  
      async getCurrentUser() {
        try {
          const response = await API.currentUser();
          this.currentUser = response;
          console.log("response.Email", response.Email);
          const apiUrl = 'https://colleague.lotuss.com/ApiProfile/api/getStoreByEmail';
          const requestData = { Email: response.Email };
          const apiResponse = await axios.post(apiUrl, requestData);
          console.log('store:', apiResponse.data[0].StoreNo);
          this.formdaily.StoreName = apiResponse.data[0].StoreNo;
          this.StoreNo = apiResponse.data[0].StoreNo;
          if (this.admingroup != 'Admin_Group') {
            this.getgroup();
            // this.postMonthly();
            createToast("สถานะ employee!", { type: "success", position: "top-right", showIcon: true, timeout: 5000, });
          } else {
            this.formdaily.StoreName = '';
            this.formdaily.StartDate = '';
            // createToast("สถานะ Admin!", { type: "success", position: "top-right", showIcon: true, timeout: 5000, });
          }
        } catch (error) {
          console.error('Error:', error);
          // createToast("เกิดข้อผิดพลาดที่! getStoreByEmail", { type: "danger", position: "top-right", showIcon: true, timeout: 5000, });
          this.currentUser = null;
        }
      },
  
      testTest() {
        console.log("test")
      },
  
      async getgroup() {
        this.loading = true;
        return API.group().then((response) => {
          this.group = response;
          // console.log("this.group", response[0].LoginName);
          this.admingroup = response[0].LoginName;
          console.log("group", this.admingroup);
          this.postMonthly();
          if (response[0].LoginName == "Admin_Group") {
            this.showStoreCode = false;
            this.formdaily.StoreName = '';
            this.formdaily.StartDate = '';
            // this.$swal({ icon: 'success', title: 'Admin', timer: 5000 });
            createToast("สถานะ Admin!", { type: "success", position: "top-right", showIcon: true, timeout: 5000, });
          } else {
            this.showStoreCode = true;
            // this.postMonthly();
            // this.$swal({ icon: 'success', title: 'employee', timer: 5000 });
            // createToast("สถานะ employee!", { type: "success", position: "top-right", showIcon: true, timeout: 5000, });
          }
          this.loading = false;
          return response;
        });
      },
  
  
    },
  
  
    mounted() {
  
      const firstPermissionDiv = document.querySelector('.permission-first');
      if (firstPermissionDiv) {
        firstPermissionDiv.classList.add('permission-first');
      }
  
    },
  
  }
  
  
  </script>
  <!-- <script src="jquery-3.3.1.js"></script> -->
  
  <style src="@vueform/multiselect/themes/default.css"></style>
  <style scoped="">
  /*Bootstrap-Icons*/
  @import url("../node_modules/bootstrap-icons/font/bootstrap-icons.css");
  
  .text-lotus-green {
    color: #00bcb4;
  }
  
  .mr-5 {
    margin-right: 5px;
  }
  
  .btn-green {
    --bs-btn-color: #fff;
    --bs-btn-bg: #00bcb4;
    --bs-btn-border-color: #00bcb4;
    --bs-btn-hover-color: #fff;
    --bs-btn-hover-bg: #00bcb4;
    --bs-btn-hover-border-color: #00bcb4;
    --bs-btn-focus-shadow-rgb: 49, 132, 253;
    --bs-btn-active-color: #fff;
    --bs-btn-active-bg: #00bcb4;
    --bs-btn-active-border-color: #00bcb4;
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    --bs-btn-disabled-color: #fff;
    --bs-btn-disabled-bg: #00bcb4;
    --bs-btn-disabled-border-color: #00bcb4;
  }
  
  .btn-outline-green {
    --bs-btn-color: #00bcb4;
    --bs-btn-border-color: #00bcb4;
    --bs-btn-hover-color: #fff;
    --bs-btn-hover-bg: #00bcb4;
    --bs-btn-hover-border-color: #00bcb4;
    --bs-btn-focus-shadow-rgb: 25, 135, 84;
    --bs-btn-active-color: #fff;
    --bs-btn-active-bg: #00bcb4;
    --bs-btn-active-border-color: #00bcb4;
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    --bs-btn-disabled-color: #00bcb4;
    --bs-btn-disabled-bg: transparent;
    --bs-btn-disabled-border-color: #00bcb4;
    --bs-gradient: none;
  }
  
  .bg-greens {
    background-color: #00bcb4;
  }
  
  .is-valid {
    border-color: #00bcb4;
  }
  
  .iconedit {
    max-width: 20px;
    width: 100%;
  }
  
  .icondelete {
    max-width: 20px;
    width: 100%;
  }
  
  .iconpeople {
    max-width: 20px;
    width: 100%;
  }
  
  .iconupload {
    max-width: 20px;
    width: 100%;
    color: #00bcb4;
  }
  
  .shadow-1 {
    box-shadow: 0 1px 5px rgb(0 0 0 / 20%), 0 2px 2px rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%);
  }
  
  .selector {
    transform: rotate(-90deg);
  }
  
  hr {
    border-style: dashed;
    border-width: 1px;
  }
  
  /* .custom-month-input::-webkit-calendar-picker-indicator {
    display: none;
  } */
  
  div.permission-first:first-of-type {
    animation: showup 7s infinite;
  }
  
  .permission.permission-first {
    font-size: 60px;
    font-weight: 600;
    color: red;
  }
  
  div.permission {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
  }
  
  .permission.permission-last {
    font-weight: 600;
  }
  
  .permission.permission-last {
    font-size: 60px;
  }
  
  div.permission {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
  }
  
  p.p-permission {
    font-size: 20px;
  }
  
  .u-permission {
    font-size: 30px;
    margin-bottom: 14px
  }
  
  .b-permission {
    font-size: 30px;
    margin-bottom: 14px
  }
  
  
  p.p-permission {
    font-size: 28px;
    color: #838383;
    margin: 0px;
    margin-bottom: 14px;
  }
  </style>
  
  
  