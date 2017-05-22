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
var seq1="LS   SL   LL   S       SS   SSS       LSLS   SSSS   SS   SL   "
 expect(app.processSeq(seq1)).to.equal("NAME IS CHIA");
});

it('The length must be 11',
function() {
var seq2="LS   SL   LL   S       SS   SSS       LSLS   SSSS   SS   SL"
 expect(app.processSeq(seq2)).to.have.lengthOf(11);
});

it('Why the PAME',
function() {
var seq1="LS   SL   LL   S       SS   SSS       LSLS   SSSS   SS   SL   "
 expect(app.processSeq(seq1)).to.equal("NAME IS CHIA");
});
});

describe('motionType', function() {
 // it() is a test case
it('Short and Long',
function() {
var seq1="0100011100011100000111111"
 expect(app.processMotion(seq1)).to.equal("SSS");
});

it('Combinations',
function() {
var seq2="11110001111110011111100011000011110011"
 expect(app.processMotion(seq2)).to.equal("LLLSL");
});

it('Empty',
function() {
var seq1="11111"
 expect(app.processMotion(seq1)).to.equal("");
});
});



