import axios from "axios";
import moment from 'moment';

import { createLocal } from 'the-storages'
const mirror = createLocal() // create localStorage; createSession is sessionStorage
const $local = mirror._prx;

import { loadProgressBar } from 'x-axios-progress-bar'
import 'x-axios-progress-bar/dist/nprogress.css';
loadProgressBar();

import { createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css';

// axios.defaults.withCredentials = true;

const site_url =  process.env.VUE_APP_HOST + process.env.VUE_APP_SITE + "/";

export default {
	async requestDigest() {
		var url = site_url + "_api/contextinfo";
		var headers = { accept: "application/json;odata=verbose", "content-type": "application/json;odata=verbose", };
		return axios.post(url, {}, { headers }).then((response) => {
			return response.data.d;
		});
	},

	async currentUser() {
		var url = site_url + "_api/web/CurrentUser";
		var headers = { accept: "application/json;odata=verbose" };
		return axios.get(url, { headers }).then((response) => {
			return response.data.d;
		});
	},

	async group() {
		var url = site_url + "_api/web/currentuser/groups";
		var headers = { accept: "application/json;odata=verbose" };
		return axios.get(url, { headers }).then((response) => {
			return response.data.d.results;
		});
	},

	async ListItemEntityTypeFullName(ListName) {
		var headers = { accept: "application/json;odata=verbose" };
		var url = site_url + "_api/web/lists/GetByTitle('" + ListName + "')?$select=ListItemEntityTypeFullName";
		return await axios.get(url, { headers }).then((response) => {
			return response.data.d;
		}).catch(err => { 
			createToast('error!', { type: 'danger', position: 'top-right', showIcon: true, timeout: 3000 });
			console.log(err.response);
			// return false;
			return "SP.Data." + capitalize(ListName) + "ListItem"
		});
	},

	async url(url) {
		// var headers = { accept: "application/json;odata=verbose" };
		var headers = { accept: "application/json;odata=verbose", "content-type": "application/json;odata=verbose", };
		if (!url) { return "No url link!"; }
		return axios.get(url, { headers }).then((response) => {
			return (this.empty(response.data.d.results) && response.data.d.results == undefined ? response.data.d : response.data.d.results)
		}).catch(err => { 
			createToast('error!', { type: 'danger', position: 'top-right', showIcon: true, timeout: 3000 });
			console.log(err.response);
			return false;
		});
	},

	async get_url(url) {
		var headers = { accept: "application/json;odata=verbose", "content-type": "application/json;odata=verbose", };
		if (!url) { return "No url link!"; }
		return axios.get(url, { headers }).then((response) => {
			return response;
		}).catch(err => { 
			createToast('error!', { type: 'danger', position: 'top-right', showIcon: true, timeout: 3000 });
			console.log(err.response);
			return false;
		});
	},

	async multiUrl(array) {
		var all_request = [];
		array.forEach((data) => {
			var headers = { accept: "application/json;odata=verbose", "content-type": "application/json;odata=verbose", };
			all_request.push(axios.get(data.url, { headers }));
		});

		return axios.all(all_request).then(axios.spread((...responses) => {
			return responses;
		})).catch(errors => {
			createToast('error!', { type: 'danger', position: 'top-right', showIcon: true, timeout: 3000 });
			console.log(errors);
			return false;
		});
	},

	async get(ListName ,url = null) {
		var headers = { accept: "application/json;odata=verbose" };
		if (!url) { url = site_url + "_api/web/lists/GetByTitle('" + ListName + "')/items?$top=5000"; }
		return axios.get(url, { headers }).then((response) => {
			return response.data;
		}).catch(err => { 
			createToast('error!', { type: 'danger', position: 'top-right', showIcon: true, timeout: 3000 });
			console.log(err.response);
			return false;
		});
	},

	async insert(ListName ,data) {
		return this.ListItemEntityTypeFullName(ListName).then((type) => {
			data.__metadata = { type: type.ListItemEntityTypeFullName,};
			var json = JSON.stringify(data);
			var headers = { accept: "application/json;odata=verbose", "Content-type": "application/json;odata=verbose", "X-RequestDigest": $local.requestDigest, };
			var url = site_url + "_api/web/lists/GetByTitle('" + ListName + "')/items";
			return axios.post(url, json, { headers }).then((response) => {
				return response.data.d;
			}).catch(err => { 
				createToast('error!', { type: 'danger', position: 'top-right', showIcon: true, timeout: 3000 });
				console.log(err.response);
				return false;
			});
		});
	},

	async update(ListName ,data) {
		console.log(data);
		return this.ListItemEntityTypeFullName(ListName).then((type) => {
			data.__metadata = { type: type.ListItemEntityTypeFullName,};
			var Id = data.Id;
			var json = JSON.stringify(data);
			var headers = { "X-HTTP-Method": "MERGE" ,accept: "application/json;odata=verbose", "Content-type": "application/json;odata=verbose", "IF-MATCH": "*" ,"X-RequestDigest": $local.requestDigest, };
			var url = site_url + "_api/web/lists/GetByTitle('" + ListName + "')/items(" + Id + ")";
			return axios.post(url, json, { headers }).then((response) => {
				return response;
			}).catch(err => { 
				createToast('error!', { type: 'danger', position: 'top-right', showIcon: true, timeout: 3000 });
				console.log(err.response);
				return false;
			});
		});
	},

	async delete(ListName ,Id) {
		var headers = { "Accept": "application/json;odata=verbose", "Content-Type": "application/json;odata=verbose", "IF-MATCH": "*", "X-HTTP-Method": "DELETE", "X-RequestDigest": $local.requestDigest};
		var url = site_url + "_api/web/lists/GetByTitle('" + ListName + "')/items(" + Id + ")";

		return axios.post(url, {}, { headers }).then((response) => {
			// console.log(response);
			return response;
		}).catch(err => { 
			createToast('error!', { type: 'danger', position: 'top-right', showIcon: true, timeout: 3000 });
			console.log(err.response);
			return false;
		});
	},

	async count(ListName) {
		var headers = { accept: "application/json;odata=verbose" };
		var url = site_url + "_api/web/lists/GetByTitle('" + ListName + "')/ItemCount";
		return axios.get(url, { headers }).then((response) => {
			return response.d.ItemCount;
		}).catch(err => { 
			createToast('error!', { type: 'danger', position: 'top-right', showIcon: true, timeout: 3000 });
			console.log(err.response);
			return false;
		});
	},

	async multiple(ListName ,data_all) {
		var all_request = [];
		var headers = {};
		var url = "";
		return this.ListItemEntityTypeFullName(ListName).then((type) => {
			data_all.forEach((data) => {
				data.__metadata = { type: type.ListItemEntityTypeFullName,};
				var json = JSON.stringify(data);
				if (this.empty(data.Id)) {
					// @ Insert
					headers = { accept: "application/json;odata=verbose", "Content-type": "application/json;odata=verbose", "X-RequestDigest": $local.requestDigest, };
					url = site_url + "_api/web/lists/GetByTitle('" + ListName + "')/items";

				}else {
					// @ Update
					var Id = data.Id;
					headers = { "X-HTTP-Method": "MERGE" ,accept: "application/json;odata=verbose", "Content-type": "application/json;odata=verbose", "IF-MATCH": "*" ,"X-RequestDigest": $local.requestDigest, };
					url = site_url + "_api/web/lists/GetByTitle('" + ListName + "')/items(" + Id + ")";
				}
				all_request.push(axios.post(url, json, { headers }));
			});

			return axios.all(all_request).then(axios.spread((...responses) => {
				return responses;
			})).catch(errors => {
				createToast('error!', { type: 'danger', position: 'top-right', showIcon: true, timeout: 3000 });
				console.log(errors);
				return false;
			});
		});
	},

	async uploadFileToFolderMulti(all_data) {
		// Ex. data => ['Path': "AA/BB" ,Files: [...]]
		var all_request = [];
		all_data.forEach((data) => {
			var headers = { "accept": "application/json;odata=verbose", "X-RequestDigest": $local.requestDigest, "Content-Type": undefined };
			data.Files.forEach((file) => {
				var url = site_url + "_api/web/GetFolderByServerRelativeUrl('" + encodeURIComponent(data.Path) + "')/files/add(overwrite=true, url='" + encodeURIComponent(file.name) + "')";
				// let formData = new FormData();
				// formData.append(file.name, file);
				all_request.push(axios.post(url, file, { headers }));
			});
		});

		return axios.all(all_request).then(axios.spread((...responses) => {
			// console.log(responses);
			return responses;
		})).catch(errors => {
			createToast('error!', { type: 'danger', position: 'top-right', showIcon: true, timeout: 3000 });
			console.log(errors);
			return false;
		});
	},


	async createFolder(docLibrary ,folderName) {
		var headers = { accept: "application/json;odata=verbose", "Content-type": "application/json;odata=verbose", "X-RequestDigest": $local.requestDigest, };
		var url = site_url + "_api/Web/Folders/add('" + docLibrary + "/" + folderName + "')";
		return axios.post(url, {}, { headers }).then((response) => {
			// console.log(response);
			return response;
		}).catch(err => { 
			createToast('error!', { type: 'danger', position: 'top-right', showIcon: true, timeout: 3000 });
			console.log(err.response);
			return false;
		});
	},

	async createFolderMulti(path) {
		var headers = { accept: "application/json;odata=verbose", "Content-type": "application/json;odata=verbose", "X-RequestDigest": $local.requestDigest, };
		var all_request = [];
		for (var i = 0; i < path.length; i++) {
			var url = site_url + "_api/Web/Folders/add('" + path[i] + "')";
			all_request.push(await axios.post(url, {}, { headers }));
		}
		return axios.all(all_request).then(axios.spread((...responses) => {
			// console.log(responses);
			return responses;
		})).catch(errors => {
			createToast('error!', { type: 'danger', position: 'top-right', showIcon: true, timeout: 3000 });
			console.log(errors);
			return false;
		});
	},

	async uploadFileToFolder(docLibrary ,folderName ,files) {
		console.log(files);
		var all_request = [];
		var url = "";
		var headers = { "accept": "application/json;odata=verbose", "X-RequestDigest": $local.requestDigest, "Content-Type": undefined };
		files.forEach((file) => {
			url = site_url + "_api/web/lists/GetByTitle('" + docLibrary + "')/RootFolder/folders('" + folderName + "')/files/Add(url='" + encodeURIComponent(file.name) + "',overwrite='true')";
			// let formData = new FormData();
			// formData.append(file.name, file);
			all_request.push(axios.post(url, file, { headers }));
		});

		return axios.all(all_request).then(axios.spread((...responses) => {
			// console.log(responses);
			return responses;
		})).catch(errors => {
			createToast('error!', { type: 'danger', position: 'top-right', showIcon: true, timeout: 3000 });
			console.log(errors);
			return false;
		});
	},


	//////////////////////////////////////
	////////////// SET API ///////////////
	//////////////////////////////////////
	set_request(all_request) {
		var array = [];
		for (var i = 0; i < all_request.length; i++) {
			array.push(all_request[i])
		}
		return array;
	},
	set_get(ListName ,url = null) {
		var headers = { accept: "application/json;odata=verbose" };
		if (!url) { url = site_url + "_api/web/lists/GetByTitle('" + ListName + "')/items?$top=5000"; }
		// return all_request.push(await axios.get(url, { headers }));
		var request = {method: 'get' ,url: url ,header: { headers }};
		// return all_request.push(request);
		return request;

	},
	set_insert(ListName ,data ,ListItemEntityTypeFullName) {
		// return this.ListItemEntityTypeFullName(ListName).then((type) => {
			// data.__metadata = { type: type.ListItemEntityTypeFullName,};
			data.__metadata = { type: ListItemEntityTypeFullName};
			var json = JSON.stringify(data);
			var headers = { accept: "application/json;odata=verbose", "Content-type": "application/json;odata=verbose", "X-RequestDigest": $local.requestDigest, };
			var url = site_url + "_api/web/lists/GetByTitle('" + ListName + "')/items";
			// return all_request.push(axios.post(url, json, { headers }));
			var request = {method: 'post' ,url: url ,data: json ,header: { headers }};
			// return all_request.push(request);
			return request;
		// });
	},
	set_update(ListName ,data ,ListItemEntityTypeFullName) {
		// return this.ListItemEntityTypeFullName(ListName).then((type) => {
			data.__metadata = { type: ListItemEntityTypeFullName};
			var Id = data.Id;
			var json = JSON.stringify(data);
			var headers = { "X-HTTP-Method": "MERGE" ,accept: "application/json;odata=verbose", "Content-type": "application/json;odata=verbose", "IF-MATCH": "*" ,"X-RequestDigest": $local.requestDigest, };
			var url = site_url + "_api/web/lists/GetByTitle('" + ListName + "')/items(" + Id + ")";
			// return all_request.push(axios.post(url, json, { headers }));
			var request = {method: 'post' ,url: url ,data: json ,header: { headers }};
			// return all_request.push(request);
			return request;
		// });
	},
	set_delete(ListName ,Id) {
		var headers = { "Accept": "application/json;odata=verbose", "Content-Type": "application/json;odata=verbose", "IF-MATCH": "*", "X-HTTP-Method": "DELETE", "X-RequestDigest": $local.requestDigest};
		var url = site_url + "_api/web/lists/GetByTitle('" + ListName + "')/items(" + Id + ")";
		// return all_request.push(await axios.post(url, {}, { headers }));
		var request = {method: 'post' ,url: url ,data: {} ,header: { headers }};
		// return all_request.push(request);
		return request;
	},

	set_upload_file(path ,file) {
		var headers = { "accept": "application/json;odata=verbose", "X-RequestDigest": $local.requestDigest, "Content-Type": "multipart/form-data" };
		var url = site_url + "_api/web/GetFolderByServerRelativeUrl('" + encodeURIComponent(path) + "')/files/add(overwrite=true, url='" + encodeURIComponent(file.name) + "')";
		// let formData = new FormData();
		// formData.append('file', file);
		// return all_request.push(await axios.post(url, formData, { headers }));
		var request = {method: 'post' ,url: url ,data: file ,header: { headers }};
		// return all_request.push(request);
		return request;
	},

	set_delete_file(path) {
		var headers = { 
			"Accept": "application/json;odata=verbose",
			"Content-Type": "application/json;odata=verbose",
			"IF-MATCH": "*", "X-HTTP-Method": "DELETE",
			"X-RequestDigest": $local.requestDigest
		};
		var url = site_url + "_api/web/GetFileByServerRelativeUrl('" + path +"')";
		// return all_request.push(await axios.post(url, {}, { headers }));
		var request = {method: 'post' ,url: url ,data: {} ,header: { headers }};
		// return all_request.push(request);
		return request;
	},

	async loading_all(all_request) {
		var set_request = [];
		for (var i = all_request.length - 1; i >= 0; i--) {
			var request = all_request[i]
			request.method == "get" ? set_request.push(await axios.get(request.url, request.header)) : 0;
			request.method == "post" ? set_request.push(await axios.post(request.url, request.data, request.header)) : 0;
		}

		return await axios.all(set_request).then(axios.spread((...responses) => {
			return responses;
		})).catch(errors => {
			createToast('error!', { type: 'danger', position: 'top-right', showIcon: true, timeout: 3000 });
			console.log(errors);
			return false;
		});
	},


	// function support
	format_date_time(value){
		if (value) {
			return moment(String(value)).format('DD/MM/YYYY hh:mm')
		}
		return "-";
		
	},
	format_date(value){
		if (value) {
			return moment(String(value)).format('DD/MM/YYYY')
		}
		return "-";
	},
	array_index(data ,key) {
		return data.map(obj => {
			return obj[key];
		});
	},
	get_index(data ,key ,text) {
		return Object.keys(data).filter((index) => data[index][key] == text);
	},
	empty(data) {
		if(typeof(data) == 'number' || typeof(data) == 'boolean') { 
			return false; 
		}
		if(typeof(data) == 'undefined' || data === null) {
			return true; 
		}
		if(typeof(data.length) != 'undefined') {
			return data.length == 0;
		}
		if(data instanceof Date) {
			return false;
		}
		var count = 0;
		for(var i in data) {
			if (Object.prototype.hasOwnProperty.call(data, i)) {
				count ++;
			}
		}
		return count == 0;
	},
	bytesToSize(bytes) {
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
		if (bytes === 0) return 'n/a'
			const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
		if (i === 0) return `${bytes} ${sizes[i]}`
			return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
	},
	encodeJson(data) {
		return encodeURIComponent(JSON.stringify(data));
	},
	decodeJson(data) {
		return JSON.parse(decodeURIComponent(data));
	},
};

const capitalize = (s) => {
	if (typeof s !== 'string') return ''
		return s.charAt(0).toUpperCase() + s.slice(1)
};

