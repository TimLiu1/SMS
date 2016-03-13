"use strict";
var mongoose = require('mongoose');

function addZero(str, length){
    return new Array(length - str.length + 1).join("0") + str;
}

var branchCounterSchema = new mongoose.Schema({
	code			:	{type:String, unique: true, required: true},
	seq				:	{type:Number, default : 0}
}, { collection: 'branch_counter' });

branchCounterSchema.statics.getNextSeq = function(branchCode, level,cb){
	var branch = branchCode.replace(/\d*/g, '');
	this.findOneAndUpdate(
			{code: branch+level},
			{$inc: {seq : 1 }},
			{new : true, upsert : true},
			function(err, branchCounter){
				if (err) {
					cb(err);
				} else {
					var newSeq = branchCounter.seq;
					//console.log(newSeq);
					cb(err, addZero(newSeq.toString(), 4));
				}
			});
};

module.exports = mongoose.model('BranchCounter', branchCounterSchema);
