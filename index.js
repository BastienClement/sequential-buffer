/*
	Copyright (c) 2014 Bastien Clément <g@ledric.me>

	Permission is hereby granted, free of charge, to any person obtaining a
	copy of this software and associated documentation files (the
	"Software"), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:

	The above copyright notice and this permission notice shall be included
	in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
	IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
	CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
	TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var DEFAULT_SIZE = 1024;
var DEFAULT_EXPAND = 2;

function SequentialBuffer(buffer, expand) {
	if (!(this instanceof SequentialBuffer))
		return new SequentialBuffer(buffer, expand);

	if (Buffer.isBuffer(buffer)) {
		this.buffer = buffer;
		this.size = buffer.length;
	} else {
		this.size = buffer || DEFAULT_SIZE;
		this.buffer = new Buffer(this.size);
	}

	this.expand = (typeof expand === "number") ? expand : DEFAULT_EXPAND;
	this.offset = 0;
}

SequentialBuffer.prototype.tell = function() {
	return this.offset;
};

SequentialBuffer.prototype.seek = function(offset, relative) {
	if (relative)
		this.offset += offset;
	else
		this.offset = offset;
};

SequentialBuffer.prototype._prepare = function(length) {
	var old_offset = this.offset;
	this.offset += length;

	if (this.offset > this.size) {
		// No expand factor given
		if (!this.expand)
			throw new Error("Not enough space available in buffer");

		var old = this.buffer;

		while (this.offset > this.size) {
			this.size = this.size * this.expand;
		}

		this.buffer = new Buffer(this.size);
		old.copy(this.buffer);
	}

	return old_offset;
};

SequentialBuffer.prototype.getBuffer = function() {
	return this.buffer.slice(0, this.offset);
}

/*
 * 8 bits
 */

SequentialBuffer.prototype.nextInt8 = function() {
	return this.buffer.readInt8(this.offset++);
};

SequentialBuffer.prototype.nextUInt8 = function() {
	// Array access is faster than readUInt8()
	return this.buffer[this.offset++];
};

SequentialBuffer.prototype.writeInt8 = function(i) {
	var o = this._prepare(1);
	this.buffer.writeInt8(i, o);
};

SequentialBuffer.prototype.writeUInt8 = function(i) {
	var o = this._prepare(1);
	this.buffer[o] = i;
};

/*
 * 16 bits
 */

SequentialBuffer.prototype.nextInt16BE = function() {
	var i = this.buffer.readInt16BE(this.offset);
	this.offset += 2;
	return i;
};

SequentialBuffer.prototype.nextUInt16BE = function() {
	var i = this.buffer.readUInt16BE(this.offset);
	this.offset += 2;
	return i;
};

SequentialBuffer.prototype.nextInt16LE = function() {
	var i = this.buffer.readInt16LE(this.offset);
	this.offset += 2;
	return i;
};

SequentialBuffer.prototype.nextUInt16LE = function() {
	var i = this.buffer.readUInt16LE(this.offset);
	this.offset += 2;
	return i;
};

SequentialBuffer.prototype.writeInt16BE = function(i) {
	var o = this._prepare(2);
	this.buffer.writeInt16BE(i, o);
};

SequentialBuffer.prototype.writeUInt16BE = function(i) {
	var o = this._prepare(2);
	this.buffer.writeUInt16BE(i, o);
};

SequentialBuffer.prototype.writeInt16LE = function(i) {
	var o = this._prepare(2);
	this.buffer.writeInt16LE(i, o);
};

SequentialBuffer.prototype.writeUInt16LE = function(i) {
	var o = this._prepare(2);
	this.buffer.writeUInt16LE(i, o);
};

/*
 * 32 bits
 */

SequentialBuffer.prototype.nextInt32BE = function() {
	var i = this.buffer.readInt32BE(this.offset);
	this.offset += 4;
	return i;
};

SequentialBuffer.prototype.nextUInt32BE = function() {
	var i = this.buffer.readUInt32BE(this.offset);
	this.offset += 4;
	return i;
};

SequentialBuffer.prototype.nextInt32LE = function() {
	var i = this.buffer.readInt32LE(this.offset);
	this.offset += 4;
	return i;
};

SequentialBuffer.prototype.nextUInt32LE = function() {
	var i = this.buffer.readUInt32LE(this.offset);
	this.offset += 4;
	return i;
};

SequentialBuffer.prototype.writeInt32BE = function(i) {
	var o = this._prepare(4);
	this.buffer.writeInt32BE(i, o);
};

SequentialBuffer.prototype.writeUInt32BE = function(i) {
	var o = this._prepare(4);
	this.buffer.writeUInt32BE(i, o);
};

SequentialBuffer.prototype.writeInt32LE = function(i) {
	var o = this._prepare(4);
	this.buffer.writeInt32LE(i, o);
};

SequentialBuffer.prototype.writeUInt32LE = function(i) {
	var o = this._prepare(4);
	this.buffer.writeUInt32LE(i, o);
};

/*
 * Float & Double
 */

SequentialBuffer.prototype.nextFloatBE = function() {
	var f = this.buffer.readFloatBE(this.offset);
	this.offset += 4;
	return f;
};

SequentialBuffer.prototype.nextDoubleBE = function() {
	var f = this.buffer.readDoubleBE(this.offset);
	this.offset += 8;
	return f;
};

SequentialBuffer.prototype.nextFloatLE = function() {
	var f = this.buffer.readFloatLE(this.offset);
	this.offset += 4;
	return f;
};

SequentialBuffer.prototype.nextDoubleLE = function() {
	var f = this.buffer.readDoubleLE(this.offset);
	this.offset += 8;
	return f;
};

SequentialBuffer.prototype.writeFloatBE = function(r) {
	var o = this._prepare(4);
	this.buffer.writeFloatBE(r, o);
};

SequentialBuffer.prototype.writeDoubleBE = function(r) {
	var o = this._prepare(8);
	this.buffer.writeDoubleBE(r, o);
};

SequentialBuffer.prototype.writeFloatLE = function(r) {
	var o = this._prepare(4);
	this.buffer.writeFloatLE(r, o);
};

SequentialBuffer.prototype.writeDoubleLE = function(r) {
	var o = this._prepare(8);
	this.buffer.writeDoubleLE(r, o);
};

/*
 * Buffer
 */

SequentialBuffer.prototype.nextBuffer = function(length) {
	var b = new Buffer(length);
	this.buffer.copy(b, 0, this.offset, this.offset + length);
	this.offset += length;
	return b;
};

SequentialBuffer.prototype.nextShadowBuffer = function() {
	var b = this.buffer.slice(this.offset, this.offset + length);
	this.offset += length;
	return b;
};

SequentialBuffer.prototype.writeBuffer = function(buffer) {
	var o = this._prepare(buffer.length);
	buffer.copy(this.buffer, o);
};

/*
 * String
 */

SequentialBuffer.prototype.nextString = function(length) {
	var s = this.buffer.toString("utf-8", this.offset, this.offset + length);
	this.offset += length;
	return s;
};

SequentialBuffer.prototype.writeString = function(string) {
	var byte_length = Buffer.byteLength(string, "utf8");
	var o = this._prepare(byte_length);
	this.buffer.write(string, o, byte_length, "utf8");
};

module.exports = SequentialBuffer;
