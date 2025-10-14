const mongoose = require('mongoose');


const RoomSchema = new mongoose.Schema({
name: { type: String, required: true },
description: { type: String },
isPrivate: { type: Boolean, default: false },
members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });


module.exports = mongoose.model('Room', RoomSchema);