// eslint-disable-next-line spaced-comment
// <reference types="react-scripts" />

export {};

declare global {
  // define new props on window
  interface Window {
    __MF_ENV: any;
    System:any;
  }
  namespace React {
    interface DOMAttributes<T> {
      clstag?: string;
    }
  }
  namespace JSX {
    interface IntrinsicAttributes {
      clstag?: string;
    }
  }
}

declare module 'md5.js' {
  export default class MD5 {
    update(data?: unknown): MD5;
    digest(): string;
  }
}

