import { DataItemCommon } from '../types';

/**
 * 工具方法
 */
export function isPromise(obj: any) {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

/**
 * 获取用户默认头像
 * @param theme
 */
export function getDefaultAvatar() {
    return 'https://storage.jd.com/hub-static/images/default-avatar.png';
}

export const getId = (item: DataItemCommon): string => {
    if (item.type === 'user') {
        return item.id;
    }
    if (item.type === 'group') {
        return item.gid as string;
    }
    return item.id;
};
