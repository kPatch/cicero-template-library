/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-var */

/**
 * Execute the smart clause
 * @param {Context} context - the Accord context
 * @param {org.accordproject.construction.requestforpayment.ChangeOrderValidation} context.request
 * @param {org.accordproject.construction.requestforpayment.PaymentApplicationResponse} context.response
 * @AccordClauseLogic
 */
function changeOrderValidation(context) {
    logger.info(context);
    var req = context.request;
    var res = context.response;
    var data = context.data;

    var appSubmission = moment(req.timestamp, "MM-DD-YYYY");
    var appEndDate = moment(data.appEndDate, "MM-DD-YYYY");
    var daysBeforeEndingPeriod = data.daysBeforeEndingPeriod;
    var monthsInPaymentPeriod = data.monthsInPaymentPeriod;
    var originalContractAmount = data.originalContractAmount;
    var gmp = data.gmp;

    var netChangeOrderAmount = req.netChangeOrderAmount;
    var adjustedContractAmount = req.adjustedContractAmount;
    var totalEarnedToDate = req.totalEarnedToDate;
    var totalLessRetainage = req.totalLessRetainage;
    var lessPrevAppPayment = req.lessPrevAppPayment;
    var currBalanceDue = req.currBalanceDue;
    var unpaidContractBalance = req.unpaidContractBalance;

    res.statusMsg = '';

    if(adjustedContractAmount < gmp) {
      if(appSubmission.isAfter(appEndDate)) {
        res.appStatus = 'PENDING';
        res.statusMsg += 'Out of payment period.';
      } else if(appSubmission.isAfter(appEndDate.subtract(daysBeforeEndingPeriod, 'days'))) {
          res.appStatus = 'PENDING';
          res.statusMsg += 'Late application submission.';
      } else {
          res.appStatus = 'PREAPPROVED';
          res.statusMsg += 'Application has been preapproved.';
      }
    } else {
      res.appStatus = 'DENIED';
      res.statusMsg += 'Adjusted contract amount over guaranteed maximum price.'
    }
}

/* eslint-enable no-unused-vars */
/* eslint-enable no-undef */
