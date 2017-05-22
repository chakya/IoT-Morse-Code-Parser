/*
Chai is a BDD / TDD assertion library
for node and the browser that can be delightfully paired with any javascript testing
framework.
*/
var chai = require('chai');
var expect = chai.expect; // Expect also allows you to include arbitrary messages to prepend to any failed assertions that might occur.
var app = require('./app');
//describe() is merely for grouping, which you can nest as deep
describe('Word Processing', function() {
 // it() is a test case
it('It must be a sequence',
function() {
var seq1="SL   "
 expect(app.processSeq(seq1)).to.equal("A");
});

it('not in dictionary',
function() {
var seq1="SSSSSSSL   "
 expect(app.processSeq(seq1)).to.equal("");
});

it('no short motion',
function() {
var seq1="LLLL   "
 expect(app.processSeq(seq1)).to.equal("");
});

it('empty',
function() {
var seq1=""
 expect(app.processSeq(seq1)).to.equal("");
});

it('Boundary',
function() {
var seq1="LLSS   "
 expect(app.processSeq(seq1)).to.equal("Z");
});
});

describe('motionType', function() {
 // it() is a test case
it('short motion',
function() {
var seq1="010"
 expect(app.processMotion(seq1)).to.equal("S");
});
it('short motion',
function() {
var seq1="01110"
 expect(app.processMotion(seq1)).to.equal("S");
});

it('long motion',
function() {
var seq2="011110"
 expect(app.processMotion(seq2)).to.equal("L");
});

it('super long motion',
function() {
var seq1="0111111110"
 expect(app.processMotion(seq1)).to.equal("L");
});

it('Not determined yet',
function() {
var seq1="01"
 expect(app.processMotion(seq1)).to.equal("");
});

it('NO Motion',
function() {
var seq1=""
 expect(app.processMotion(seq1)).to.equal("");
});
});



