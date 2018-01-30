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

const Template = require('cicero-core').Template;
const Clause = require('cicero-core').Clause;
const Engine = require('cicero-engine').Engine;

const fs = require('fs');
const path = require('path');
const chai = require('chai');
chai.should();
chai.use(require('chai-things'));
chai.use(require('chai-as-promised'));
const moment = require('moment');

describe('Logic', () => {

    const rootDir = path.resolve(__dirname, '..');
    const clauseText = fs.readFileSync(path.resolve(rootDir, 'sample.txt'), 'utf8');

    let template;
    let clause;
    let engine;

    beforeEach( async function() {
        template = await Template.fromDirectory(rootDir);
        clause = new Clause(template);
        clause.parse(clauseText);
        engine = new Engine();
    });

    describe('#ConstructionPaymentRequestTest', async function() {

        it('should deny payment request', async function () {
            const request = {
                "$class": "org.accordproject.construction.requestforpayment.ChangeOrderValidation",
                "netChangeOrderAmount": 100000,
                "adjustedContractAmount": 6250000,
                "totalEarnedToDate": 0,
                "totalLessRetainage": 6250000,
                "lessPrevAppPayment": 6250000,
                "currBalanceDue": 25000,
                "unpaidContractBalance": 6250000,
                "transactionId":"2dbd6f6a-64b0-40d0-90c8-ffa1fc108a58",
                "timestamp":"2018-01-30T20:01:31.280Z"
            };
            const result = await engine.execute(clause, request);
            result.should.not.be.null;
            result.response.appStatus.should.equal('DENIED');
        });
    });
});
