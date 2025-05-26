.PHONY build:
build:
	cargo component build --release
	wasm-tools compose -d ./../hmac/target/wasm32-wasip1/release/hmac.wasm ./target/wasm32-wasip1/release/webhook_producer.wasm -o ./composed.wasm