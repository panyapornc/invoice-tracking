<!-- MainPage.vue -->
<template>
	<div class="container">
		<h1>Test Table employee</h1>
		<table class="table table-striped">
			<thead>
				<tr>
					<td>ID</td>
					<td>name</td>
					<td>position</td>
					<td>status</td>
					<td>manage</td>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><div v-show="template.test.AppName" class="animate__animated animate__fadeInDown">
					<p class="text-muted mb-0">{{template.test.AppName}}</p>
				</div></td>
					<td>surasak noorurk</td>
					<td>dev</td>
					<td class="text-success">success</td>
					<td>
						<button type="button" class="btn btn-success" data-bs-toggle="modal"
							data-bs-target="#exampleModal">
							<font-awesome-icon icon="fa-solid fa-house" />
						</button>
						<button type="button" class="btn btn-danger">delete</button>
					</td>
				</tr>
				<tr>
					<td>99</td>
					<td>sasison makza</td>
					<td>dev</td>
					<td class="text-warning">in progress</td>
					<td>
						<button type="button" class="btn btn-success" data-bs-toggle="modal"
							data-bs-target="#exampleModal">
							submit
						</button>
						<button type="button" class="btn btn-danger">delete</button>

					</td>
				</tr>
			</tbody>
		</table>


		<!-- Modal -->
		<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						...
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
						<button type="button" class="btn btn-primary">Save changes</button>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/hover.css/2.1.0/css/hover-min.css">
 

<script>
//import API from './services/ApiService.js';

// import axios from "axios";
import { loadProgressBar } from 'x-axios-progress-bar'
import 'x-axios-progress-bar/dist/nprogress.css';

// import $ from "jquery";
// import { Modal } from "bootstrap";

// import Multiselect from "@vueform/multiselect";
// import { createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css';

import xlsx from "json-as-xlsx";

loadProgressBar();
// import API from './services/ApiService.js';
export default {
	name: 'MainPage',
	// props: ['currentUser'],
	// components: { Multiselect },
	async created() {
		console.log('created');
	},
	mounted() {
		console.log('mounted')
		// this.modalReportDetail = new Modal(document.getElementById("modal-report-detail"));
	},
	watch: {
		// 'Filters'(data) {
		// 	console.log(data)
		// },
	},

	data() {
		return {
			// Id: this.$route.params.Id,
		};
	},
	methods: {
		export_csv() {

			var data = [{}];
			data[0].sheet = "Report";
			data[0].content = this.Report;
			data[0].columns = [];

			data[0].columns.push({ label: "Order", value: "AccOrder" });
			data[0].columns.push({ label: "Description", value: "GroupName" });

			this.Header.forEach((order) => {
				data[0].columns.push({ label: order.DepartmentName, value: "Order" + order.Order });
			});

			var fileName = "Transaction-Audit-Report[" + this.get_name_report() + "][" + this.Filters.Month + "]";
			var settings = {
				fileName: fileName,
				extraLength: 3,
				writeOptions: {},
			};


			// var settings = {
			//   fileName: "Transaction-Audit-Report", // Name of the resulting spreadsheet
			//   extraLength: 3, // A bigger number means that columns will be wider
			//   writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
			// };

			xlsx(data, settings) // Will download the excel file
		},


	},
}



Array.prototype.unique = function () {
	let arr = [];
	for (let i = 0; i < this.length; i++) {
		if (!arr.includes(this[i])) {
			arr.push(this[i]);
		}
	}
	return arr;
}
</script>


<style src="@vueform/multiselect/themes/default.css">

</style>
<style scoped="">
/*Bootstrap-Icons*/
@import url("../node_modules/bootstrap-icons/font/bootstrap-icons.css");
</style>
