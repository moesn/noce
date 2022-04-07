export * from './schemas/schema-to-option';
export * from './constants';
export * from './pipes';
export * from './services';
export * from './core.module';

// 自定义路由组件
export let NcCustomComponents: {
  path: string;
  component: any;
}[] = [];

// 自定义弹窗组件
export let NcModalComponents: any = {};
