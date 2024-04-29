// Generated by `wit-bindgen` 0.24.0. DO NOT EDIT!
// Options used:
#[allow(dead_code)]
pub mod fermyon {
    #[allow(dead_code)]
    pub mod hmac {
        #[allow(dead_code, clippy::all)]
        pub mod types {
            #[used]
            #[doc(hidden)]
            #[cfg(target_arch = "wasm32")]
            static __FORCE_SECTION_REF: fn() =
                super::super::super::__link_custom_section_describing_imports;
            use super::super::super::_rt;
            pub type Error = _rt::String;
        }

        #[allow(dead_code, clippy::all)]
        pub mod sign {
            #[used]
            #[doc(hidden)]
            #[cfg(target_arch = "wasm32")]
            static __FORCE_SECTION_REF: fn() =
                super::super::super::__link_custom_section_describing_imports;
            use super::super::super::_rt;
            pub type Error = super::super::super::fermyon::hmac::types::Error;
            #[allow(unused_unsafe, clippy::all)]
            pub fn sign(data: &[u8], keyvalue: &[u8]) -> Result<_rt::Vec<u8>, Error> {
                unsafe {
                    #[repr(align(4))]
                    struct RetArea([::core::mem::MaybeUninit<u8>; 12]);
                    let mut ret_area = RetArea([::core::mem::MaybeUninit::uninit(); 12]);
                    let vec0 = data;
                    let ptr0 = vec0.as_ptr().cast::<u8>();
                    let len0 = vec0.len();
                    let vec1 = keyvalue;
                    let ptr1 = vec1.as_ptr().cast::<u8>();
                    let len1 = vec1.len();
                    let ptr2 = ret_area.0.as_mut_ptr().cast::<u8>();
                    #[cfg(target_arch = "wasm32")]
                    #[link(wasm_import_module = "fermyon:hmac/sign@0.1.0")]
                    extern "C" {
                        #[link_name = "sign"]
                        fn wit_import(_: *mut u8, _: usize, _: *mut u8, _: usize, _: *mut u8);
                    }

                    #[cfg(not(target_arch = "wasm32"))]
                    fn wit_import(_: *mut u8, _: usize, _: *mut u8, _: usize, _: *mut u8) {
                        unreachable!()
                    }
                    wit_import(ptr0.cast_mut(), len0, ptr1.cast_mut(), len1, ptr2);
                    let l3 = i32::from(*ptr2.add(0).cast::<u8>());
                    match l3 {
                        0 => {
                            let e = {
                                let l4 = *ptr2.add(4).cast::<*mut u8>();
                                let l5 = *ptr2.add(8).cast::<usize>();
                                let len6 = l5;

                                _rt::Vec::from_raw_parts(l4.cast(), len6, len6)
                            };
                            Ok(e)
                        }
                        1 => {
                            let e = {
                                let l7 = *ptr2.add(4).cast::<*mut u8>();
                                let l8 = *ptr2.add(8).cast::<usize>();
                                let len9 = l8;
                                let bytes9 = _rt::Vec::from_raw_parts(l7.cast(), len9, len9);

                                _rt::string_lift(bytes9)
                            };
                            Err(e)
                        }
                        _ => _rt::invalid_enum_discriminant(),
                    }
                }
            }
        }
    }
}
mod _rt {
    pub use alloc_crate::string::String;
    pub use alloc_crate::vec::Vec;
    pub unsafe fn string_lift(bytes: Vec<u8>) -> String {
        if cfg!(debug_assertions) {
            String::from_utf8(bytes).unwrap()
        } else {
            String::from_utf8_unchecked(bytes)
        }
    }
    pub unsafe fn invalid_enum_discriminant<T>() -> T {
        if cfg!(debug_assertions) {
            panic!("invalid enum discriminant")
        } else {
            core::hint::unreachable_unchecked()
        }
    }
    extern crate alloc as alloc_crate;
}

#[cfg(target_arch = "wasm32")]
#[link_section = "component-type:wit-bindgen:0.24.0:signing:encoded world"]
#[doc(hidden)]
pub static __WIT_BINDGEN_COMPONENT_TYPE: [u8; 317] = *b"\
\0asm\x0d\0\x01\0\0\x19\x16wit-component-encoding\x04\0\x07\xbf\x01\x01A\x02\x01\
A\x05\x01B\x02\x01s\x04\0\x05error\x03\0\0\x03\x01\x18fermyon:hmac/types@0.1.0\x05\
\0\x02\x03\0\0\x05error\x01B\x06\x02\x03\x02\x01\x01\x04\0\x05error\x03\0\0\x01p\
}\x01j\x01\x02\x01\x01\x01@\x02\x04data\x02\x08keyvalue\x02\0\x03\x04\0\x04sign\x01\
\x04\x03\x01\x17fermyon:hmac/sign@0.1.0\x05\x02\x04\x01'fermyon:webhooks-produce\
r/signing@0.1.0\x04\0\x0b\x0d\x01\0\x07signing\x03\0\0\0G\x09producers\x01\x0cpr\
ocessed-by\x02\x0dwit-component\x070.202.0\x10wit-bindgen-rust\x060.24.0";

#[inline(never)]
#[doc(hidden)]
#[cfg(target_arch = "wasm32")]
pub fn __link_custom_section_describing_imports() {
    wit_bindgen_rt::maybe_link_cabi_realloc();
}
