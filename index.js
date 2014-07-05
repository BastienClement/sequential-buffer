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

var BIG_ENDIAN = 1;
var LITTLE_ENDIAN = 2;

function SequentialBuffer(capacity, factor) {
	if (!(this instanceof SequentialBuffer))
		return new SequentialBuffer(capacity);

	if (Buffer.isBuffer(capacity)) {
		this.buffer = capacity;
		this.capacity = capacity.length;
		this.limit = capacity.length;
	} else {
		if (!(typeof capacity === "number") || capacity < 1)
			throw new Error("Missing capacity paramater");

		this.buffer = new Buffer(capacity);
		this.capacity = capacity;
		this.limit = capacity;
	}

	this.position = 0;
	this.mark = 0;

	this.order = BIG_ENDIAN;
	this.autoGrow(factor);
}

/*
 * Byte orders
 */

SequentialBuffer.BIG_ENDIAN = BIG_ENDIAN;
SequentialBuffer.LITTLE_ENDIAN = LITTLE_ENDIAN;

/*
 * Buffer methods
 */

SequentialBuffer.prototype.seek = function(position) {
	if (position > this.limit)
		throw new Error("Position is beyond buffer limit");
	this.position = position;
	return this;
};

SequentialBuffer.prototype.tell = function(position) {
	return this.position;
};

SequentialBuffer.prototype.rewind = function() {
	this.position = 0;
	return this;
};

SequentialBuffer.prototype.rewind = function() {
	this.position = 0;
	return this;
};

SequentialBuffer.prototype.flip = function() {
	this.limit = this.position;
	this.position = 0;
	return this;
};

SequentialBuffer.prototype.clear = function() {
	this.limit = this.capacity;
	this.position = 0;
	return this;
};

SequentialBuffer.prototype.compact = function() {
	this.buffer.copy(this.buffer, 0, this.position, this.limit);
	this.position = this.limit - this.position;
	this.limit = this.capacity;
	return this;
};

SequentialBuffer.prototype.mark = function() {
	this.mark = this.position;
	return this;
};

SequentialBuffer.prototype.reset = function() {
	this.position = this.mark;
	return this;
};

SequentialBuffer.prototype.autoGrow = function(factor) {
	if (!(typeof factor === "number"))
		factor = (factor) ? 2 : 0;

	if (factor === 1)
		throw new Error("Cannot use 1 as grow factor");

	this.grow = factor;
	return this;
};

SequentialBuffer.prototype.remaining = function() {
	return this.limit - this.position;
};

SequentialBuffer.prototype.finalize = function() {
	return this.buffer.slice(0, this.position);
};

SequentialBuffer.prototype.setOrder = function(order) {
	this.order = order;
	return this;
};

SequentialBuffer.prototype.prepare = function(length, write) {
	if (this.position + length > this.limit && !write)
		throw new Error("Reading beyond buffer limit");

	var old_position = this.position;
	this.position += length;

	if (this.position > this.capacity) {
		// No grow factor given
		if (!this.grow) {
			this.position = old_position;
			throw new Error("Not enough space available in buffer");
		}

		var old = this.buffer;

		while (this.position > this.capacity) {
			this.capacity = this.capacity * this.grow;
		}

		this.buffer = new Buffer(this.capacity);
		old.copy(this.buffer);
	}

	return old_position;
};

/*
 * 8 bits
 */

SequentialBuffer.prototype.nextInt8 = function() {
	return this.buffer.readInt8(this.prepare(1));
};

SequentialBuffer.prototype.nextUInt8 = function() {
	// Array access is faster than readUInt8()
	return this.buffer[this.prepare(1)];
};

SequentialBuffer.prototype.writeInt8 = function(i) {
	var o = this.prepare(1, true);
	this.buffer.writeInt8(i, o);
	return this;
};

SequentialBuffer.prototype.writeUInt8 = function(i) {
	var o = this.prepare(1, true);
	this.buffer[o] = i;
	return this;
};

/*
 * 16 bits
 */

SequentialBuffer.prototype.nextInt16BE = function() {
	return this.buffer.readInt16BE(this.prepare(2));
};

SequentialBuffer.prototype.nextUInt16BE = function() {
	return this.buffer.readUInt16BE(this.prepare(2));
};

SequentialBuffer.prototype.nextInt16LE = function() {
	return this.buffer.readInt16LE(this.prepare(1));
};

SequentialBuffer.prototype.nextUInt16LE = function() {
	return this.buffer.readUInt16LE(this.prepare(1));
};

SequentialBuffer.prototype.writeInt16BE = function(i) {
	var o = this.prepare(2, true);
	this.buffer.writeInt16BE(i, o);
	return this;
};

SequentialBuffer.prototype.writeUInt16BE = function(i) {
	var o = this.prepare(2, true);
	this.buffer.writeUInt16BE(i, o);
	return this;
};

SequentialBuffer.prototype.writeInt16LE = function(i) {
	var o = this.prepare(2, true);
	this.buffer.writeInt16LE(i, o);
	return this;
};

SequentialBuffer.prototype.writeUInt16LE = function(i) {
	var o = this.prepare(2, true);
	this.buffer.writeUInt16LE(i, o);
	return this;
};

SequentialBuffer.prototype.nextInt16 = function() {
	return (this.order === BIG_ENDIAN)
		? this.nextInt16BE()
		: this.nextInt16LE();
};

SequentialBuffer.prototype.nextUInt16 = function() {
	return (this.order === BIG_ENDIAN)
		? this.nextUInt16BE()
		: this.nextUInt16LE();
};

SequentialBuffer.prototype.writeInt16 = function(i) {
	return (this.order === BIG_ENDIAN)
		? this.writeInt16BE(i)
		: this.writeInt16LE(i);
};

SequentialBuffer.prototype.writeUInt16 = function(i) {
	return (this.order === BIG_ENDIAN)
		? this.writeUInt16BE(i)
		: this.writeUInt16LE(i);
};

/*
 * 32 bits
 */

SequentialBuffer.prototype.nextInt32BE = function() {
	return this.buffer.readInt32BE(this.prepare(4));
};

SequentialBuffer.prototype.nextUInt32BE = function() {
	return this.buffer.readUInt32BE(this.prepare(4));
};

SequentialBuffer.prototype.nextInt32LE = function() {
	return this.buffer.readInt32LE(this.prepare(4));
};

SequentialBuffer.prototype.nextUInt32LE = function() {
	return this.buffer.readUInt32LE(this.prepare(4));
};

SequentialBuffer.prototype.writeInt32BE = function(i) {
	var o = this.prepare(4, true);
	this.buffer.writeInt32BE(i, o);
	return this;
};

SequentialBuffer.prototype.writeUInt32BE = function(i) {
	var o = this.prepare(4, true);
	this.buffer.writeUInt32BE(i, o);
	return this;
};

SequentialBuffer.prototype.writeInt32LE = function(i) {
	var o = this.prepare(4, true);
	this.buffer.writeInt32LE(i, o);
	return this;
};

SequentialBuffer.prototype.writeUInt32LE = function(i) {
	var o = this.prepare(4, true);
	this.buffer.writeUInt32LE(i, o);
	return this;
};

SequentialBuffer.prototype.nextInt32 = function() {
	return (this.order === BIG_ENDIAN)
		? this.nextInt32BE()
		: this.nextInt32LE();
};

SequentialBuffer.prototype.nextUInt32 = function() {
	return (this.order === BIG_ENDIAN)
		? this.nextUInt32BE()
		: this.nextUInt32LE();
};

SequentialBuffer.prototype.writeInt32 = function(i) {
	return (this.order === BIG_ENDIAN)
		? this.writeInt32BE(i)
		: this.writeInt32LE(i);
};

SequentialBuffer.prototype.writeUInt32 = function(i) {
	return (this.order === BIG_ENDIAN)
		? this.writeUInt32BE(i)
		: this.writeUInt32LE(i);
};

/*
 * Float & Double
 */

SequentialBuffer.prototype.nextFloatBE = function() {
	return this.buffer.readFloatBE(this.prepare(4));
};

SequentialBuffer.prototype.nextDoubleBE = function() {
	return this.buffer.readDoubleBE(this.prepare(8));
};

SequentialBuffer.prototype.nextFloatLE = function() {
	return this.buffer.readFloatLE(this.prepare(4));
};

SequentialBuffer.prototype.nextDoubleLE = function() {
	return this.buffer.readDoubleLE(this.prepare(8));
};

SequentialBuffer.prototype.writeFloatBE = function(r) {
	var o = this.prepare(4, true);
	this.buffer.writeFloatBE(r, o);
};

SequentialBuffer.prototype.writeDoubleBE = function(r) {
	var o = this.prepare(8, true);
	this.buffer.writeDoubleBE(r, o);
	return this;
};

SequentialBuffer.prototype.writeFloatLE = function(r) {
	var o = this.prepare(4, true);
	this.buffer.writeFloatLE(r, o);
	return this;
};

SequentialBuffer.prototype.writeDoubleLE = function(r) {
	var o = this.prepare(8, true);
	this.buffer.writeDoubleLE(r, o);
	return this;
};

SequentialBuffer.prototype.nextFloat = function() {
	return (this.order === BIG_ENDIAN)
		? this.nextFloatBE()
		: this.nextFloatLE();
};

SequentialBuffer.prototype.nextDouble = function() {
	return (this.order === BIG_ENDIAN)
		? this.nextDoubleBE()
		: this.nextDoubleLE();
};

SequentialBuffer.prototype.writeFloat = function(i) {
	return (this.order === BIG_ENDIAN)
		? this.writeFloatBE(i)
		: this.writeFloatLE(i);
};

SequentialBuffer.prototype.writeDouble = function(i) {
	return (this.order === BIG_ENDIAN)
		? this.writeDoubleBE(i)
		: this.writeDoubleLE(i);
};

/*
 * Buffer
 */

SequentialBuffer.prototype.nextBuffer = function(length) {
	var b = new Buffer(length);
	this.buffer.copy(b, 0, this.prepare(length), this.position);
	return b;
};

SequentialBuffer.prototype.nextShadowBuffer = function(length) {
	return this.buffer.slice(this.prepare(length), this.position);
};

SequentialBuffer.prototype.writeBuffer = function(buffer) {
	var o = this.prepare(buffer.length, true);
	buffer.copy(this.buffer, o);
	return this;
};

SequentialBuffer.prototype.writeBytes = function(bytes) {
	var i = 0;
	var o = this.prepare(bytes.length, true);
	while (o < this.position) {
		this.buffer[o++] = bytes[i++];
	}
	return this;
};

/*
 * String
 */

SequentialBuffer.prototype.nextString = function(length) {
	return this.buffer.toString("utf-8", this.prepare(length), this.position);
};

SequentialBuffer.prototype.writeString = function(string) {
	var byte_length = Buffer.byteLength(string, "utf8");
	var o = this.prepare(byte_length, true);
	this.buffer.write(string, o, byte_length, "utf8");
	return this;
};

module.exports = SequentialBuffer;
