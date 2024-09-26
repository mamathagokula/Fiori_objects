sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.ui.dalmia.stoppage.zstoppageDashboard.controller.create_stoppage", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.attachRoutePatternMatched(this._handleRouteMatchedPRItem, this);
		},

		_handleRouteMatchedPRItem: function (oEvent) {
			debugger
			var sFormattedDate = "";
			var sEmail = oEvent.getParameter("arguments").Email;
			var sWerks = oEvent.getParameter("arguments").Werks;
			var sArbpl = oEvent.getParameter("arguments").Arbpl;
			var sTagNo = oEvent.getParameter("arguments").TagNo;
			var sCrDate = oEvent.getParameter("arguments").CrDate;
			var sSrno = oEvent.getParameter("arguments").Srno;
			var sMatnr = oEvent.getParameter("arguments").Matnr;
			var sEqunr = oEvent.getParameter("arguments").Equnr;
			var sTplnr = oEvent.getParameter("arguments").Tplnr
			if (sCrDate) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "yyyy-MM-dd\'T\'HH:mm:ss"
				});
				sFormattedDate = oDateFormat.format(new Date(sCrDate));
			}
			var oData = {
				Email: sEmail,
				Werks: sWerks,
				Arbpl: sArbpl,
				TagNo: sTagNo,
				CrDate: sFormattedDate,
				Srno: sSrno,
				Matnr: sMatnr,
				Equnr: sEqunr
			};
			var oModel = new sap.ui.model.json.JSONModel(oData);
			this.getOwnerComponent().setModel(oModel, "ItemModel");
		},

		fnPostItem: function () {
			debugger
			var oData = {
				"Email": this.getOwnerComponent().getModel("ItemModel").oData.Email,
				"Werks": this.getOwnerComponent().getModel("ItemModel").oData.Werks,
				"Arbpl": this.getOwnerComponent().getModel("ItemModel").oData.Arbpl,
				"TagNo": this.getOwnerComponent().getModel("ItemModel").oData.TagNo,
				"CrDate": this.getOwnerComponent().getModel("ItemModel").oData.CrDate,
				"Srno": this.getOwnerComponent().getModel("ItemModel").oData.Srno,
				"Matnr": this.getOwnerComponent().getModel("ItemModel").oData.Matnr,
				"StoppageType": this.getView().byId("idStoppage").getValue(),
				"Equnr": this.getOwnerComponent().getModel("ItemModel").oData.Equnr,
				"RespArea": this.getView().byId("idreasponsearea").getValue(),
				"Reason": this.getView().byId("idreason").getValue(),
				"ReasonText": this.getView().byId("idremark").getValue(),
				"Priok": this.getView().byId("idPriority").getValue()
			}
			sap.ui.core.BusyIndicator.show();
			var oModel = this.getView().getModel();
			oModel.create("/StoppageDashboardSheetSet", oData, {
				success: function (oData, oResponse) {
					var msg = oData.Message;
					sap.m.MessageBox.success(msg);
					sap.ui.core.BusyIndicator.hide();
				},
				error: function (oResponse) {

				}
			})
		}

	});

});