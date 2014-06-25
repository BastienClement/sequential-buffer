sequential-buffer
=================

Sequential read / write to buffers

```
npm install sequential-buffer
```

## API

### `SequentialBuffer#seek(offset, [relative])`

### `SequentialBuffer#tell()`

### `SequentialBuffer#next{,U}Int{8,16,32}{BE, LE}()`

### `SequentialBuffer#next{Float,Double}{BE, LE}()`

### `SequentialBuffer#nextBuffer(length)`
### `SequentialBuffer#nextShadowBuffer(length)`

### `SequentialBuffer#nextString(length)`