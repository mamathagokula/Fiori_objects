sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, Fragment) {
	"use strict";

	return Controller.extend("com.ui.dalmia.stoppage.zstoppageDashboard.controller.stoppageDashoard", {
		onInit: function () {

		},

		onBeforeRebindTable: function (oEvent) {
			debugger
			var filteredData = this.getView().byId("customSelect").getSelectedItem().getText();
			var oFilter = new sap.ui.model.Filter("Phase", sap.ui.model.FilterOperator.EQ, filteredData);
			oEvent.getParameter("bindingParams").filters.push(oFilter);
		},

		handle_EditPress: function () {
			debugger
			var oTable = this.getView().byId('tableID');
			var aSelectedItems = oTable.getSelectedItems();
			let that = this;
			if (aSelectedItems.length > 0) {
				var oData = aSelectedItems[0].getBindingContext().getObject();
				var sEmail = oData.Email;
				var sWerks = oData.Werks;
				var sArbpl = oData.Arbpl;
				var sTagNo = oData.TagNo;
				var sCrDate = oData.CrDate;
				var sSrno = oData.Srno;
				var sMatnr = oData.Matnr;
				var sEqunr = oData.Equnr;
				var sTplnr = oData.Tplnr
				if (oData.StoppageType === "" && oData.Phase === "Stop") {
					if (!this.oPost) {
						this.oPost = sap.ui.xmlfragment("com.ui.dalmia.stoppage.zstoppageDashboard.fragments.Post", this);
						this.getView().addDependent(this.oPost);
					}

					var oSmartForm = sap.ui.getCore().byId("sf_Item")
					oSmartForm.setBindingContext(this.getOwnerComponent().getModel().createEntry("/StoppageDashboardSheetSet", {}));
					let oModelPlant = this.getOwnerComponent().getModel();
					let sPath = oSmartForm.getBindingContext().getPath()
					oModelPlant.setProperty(sPath + "/Werks", sWerks)
					oModelPlant.setProperty(sPath + "/Ppworkcenter", sArbpl)
					oModelPlant.setProperty(sPath + "/Tplnr", this.sFunloc)
					sap.ui.getCore().byId("idPriority").setEditable(false);
					sap.ui.getCore().byId("idfunctionalloc").setMandatory(false);
					this.oPost.open();
					var sFormattedDate = "";
					if (sCrDate) {
						var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
							pattern: "yyyy-MM-dd\'T\'HH:mm:ss"
						});
						sFormattedDate = oDateFormat.format(new Date(sCrDate));
					}
					var sData = {
						Email: sEmail,
						Werks: sWerks,
						Arbpl: sArbpl,
						TagNo: sTagNo,
						CrDate: sFormattedDate,
						Srno: sSrno,
						Matnr: sMatnr,
						Equnr: sEqunr
					};
					var oModel = new sap.ui.model.json.JSONModel(sData);
					this.getOwnerComponent().setModel(oModel, "ItemModel");
				} else {
					sap.m.MessageBox.error("Cannot edit this record");
				}
			} else {
				sap.m.MessageBox.error("Please select record");
			}
		},

		onBeforeExport: function (oEvt) {
			debugger
			var mExcelSettings = oEvt.getParameter("exportSettings");
			mExcelSettings.workbook.columns.forEach(function (column) {
				if (column.property === "CrDate") {
					column.type = sap.ui.export.EdmType.Date;
				}
			});
		},

		onFunlocChange: function (oEvent) {
			var sFunloc = oEvent.getParameter("value");
			this.sFunloc = sFunloc;
		},

		fnStoppage: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			if (sValue === "UNPLANNED STOPPAGE") {
				sap.ui.getCore().byId("idPriority").setEditable(true);
				sap.ui.getCore().byId("idPriority").setMandatory(true);
			} else {
				sap.ui.getCore().byId("idPriority").setEditable(false);
				sap.ui.getCore().byId("idPriority").setMandatory(false);
			}

		},

		fnPostItem: function () {
			debugger
			var that = this;
			var oData = {
				"Email": this.getOwnerComponent().getModel("ItemModel").oData.Email,
				"Werks": this.getOwnerComponent().getModel("ItemModel").oData.Werks,
				"Arbpl": this.getOwnerComponent().getModel("ItemModel").oData.Arbpl,
				"TagNo": this.getOwnerComponent().getModel("ItemModel").oData.TagNo,
				"CrDate": this.getOwnerComponent().getModel("ItemModel").oData.CrDate,
				"Srno": this.getOwnerComponent().getModel("ItemModel").oData.Srno,
				"Matnr": this.getOwnerComponent().getModel("ItemModel").oData.Matnr,
				"StoppageType": sap.ui.getCore().byId("idStoppage").getValue(),
				"Equnr": this.getOwnerComponent().getModel("ItemModel").oData.Equnr,
				"RespArea": sap.ui.getCore().byId("idreasponsearea").getValue(),
				"Reason": sap.ui.getCore().byId("idreason").getValue(),
				"ReasonText": sap.ui.getCore().byId("idremark").getValue(),
				"Priok": sap.ui.getCore().byId("idPriority").getValue()
			}
			var oModel = this.getView().getModel();
			if (sap.ui.getCore().byId("idStoppage").getValue() === "" || sap.ui.getCore().byId("idreasponsearea").getValue() === "" || sap.ui.getCore()
				.byId("idreason").getValue() === "") {
				sap.m.MessageBox.error("Please enter mandatory fields");
				return;
			}
			sap.ui.core.BusyIndicator.show();
			oModel.create("/StoppageDashboardSheetSet", oData, {
				success: function (oData, oResponse) {
					that.oPost.close();
					that.oPost.destroy();
					that.oPost = undefined;
					var msg = oData.Message;
					sap.m.MessageBox.show(msg, {
						icon: sap.m.MessageBox.Icon.SUCCESS,
						title: "Success",
						actions: [sap.m.MessageBox.Action.OK],
						contentWidth: "400px"
					});
					// sap.m.MessageBox.success(msg, {
					// 	onClose: function (oAction) {
					// 		that.oPost.close();
					// 		that.oPost.destroy();
					// 		that.oPost = undefined;
					// 	}
					// });
					sap.ui.core.BusyIndicator.hide();
				},
				error: function (oResponse) {

				}
			})
		},
		fnCancelItem: function () {
			this.oPost.close();
			this.oPost.destroy();
			this.oPost = undefined;
		},
		onSetValueHelpOnly: function (oEvent) {
			if (oEvent.getParameters()[0] instanceof sap.m.Input && oEvent.getParameters()[0].getShowValueHelp()) {
				oEvent.getParameters()[0].setValueHelpOnly(true);
			}
		},
		onValueHelpRequest: function (oEvent) {
			debugger
		}
	});
});