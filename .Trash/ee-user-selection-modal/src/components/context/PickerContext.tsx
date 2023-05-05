import React from 'react';
import { ContactPickerProps, Type, UseSelectionResult, LoadingEnum } from '../../types';
import { Dispatcher } from './reducer';

export const langConfigObj = {
    zh_CN: {
        selectContacts: '选择联系人',
        hasSelected: '已选择',
        searchTip: '请输入搜索关键字',
        searchPlaceholder: '搜索ERP、姓名、邮箱',
        recent: '最近',
        user: '联系人',
        group: '群组',
        space: '空间成员',
        org: '部门',
        mailGroup: '邮件组',
        noResultsWith: '未搜到“%s”相关的',
        cancel: '取消',
        confirm: '确定',
        select_All: '全选',
        member: '的成员',
    },
    en_US: {
        selectContacts: 'Select contacts',
        hasSelected: 'selected',
        searchTip: 'Please enter the key words',
        searchPlaceholder: 'Search ERP, Name, Mail',
        recent: 'Recent',
        user: 'Contact',
        group: 'Group',
        space: 'Space Member',
        org: 'Organization',
        mailGroup: 'Mail',
        noResultsWith: 'No Results with "%s"',
        cancel: 'Cancel',
        confirm: 'Confirm',
        select_All: 'All',
        member: "'s Members",
    },
};

export type PickerState = Pick<
    ContactPickerProps,
    | 'lang'
    | 'canSelectedExpandKeys'
    | 'userInfo'
    | 'okText'
    | 'cancelText'
    | 'title'
    | 'placeholder'
    | 'tabKeys'
    | 'expandTabKeys'
    | 'selectedList'
    | 'disabledList'
    | 'teamId'
    | 'customTabs'
    | 'disableSearch'
    | 'selectSingle'
> &
    Pick<
        UseSelectionResult,
        'data' | 'searchData' | 'expandData' | 'breadcrumbProps' | 'selectedData' | 'activeTab'
    > & {
        loading?: LoadingEnum;
        searchValue: string;
        searchMode: boolean;
        visible: boolean;
        openCrumbs: boolean; //
        total: number;
        langConfig: Record<string, string>;
    };

export const defaultTabKey = ['recent', 'user', 'group', 'mailGroup'] as Type[];
export const defaultExpandTabKeys = ['group'] as Type[];

export const pickerState: PickerState = {
    loading: LoadingEnum.Unloading,
    searchValue: '',
    visible: false,
    searchMode: false,
    openCrumbs: false,
    userInfo: {} as any,
    lang: 'zh_CN',
    langConfig: {} as any,
    expandTabKeys: [],
    tabKeys: [],
    canSelectedExpandKeys: true,
    selectedList: [],
    disabledList: [],
    data: {
        recent: [],
        user: [],
        group: [],
        mailGroup: [],
        org: [],
        space: [],
    },
    searchData: {
        recent: [],
        user: [],
        group: [],
        mailGroup: [],
        org: [],
        space: [],
    },
    expandData: [],
    selectedData: [],
    breadcrumbProps: {} as any,
    activeTab: null,
    customTabs: [], // 自定义菜单， 默认为[]
    selectSingle: false, // 单选， 默认为false
    total: 0,
};

// export interface Action {
//     type: keyof typeof reducers;
//     needLoading?: boolean;
//     loading?: number;
//     payload?: any;
//     callback?: (error: Error | null, data: any) => void;
// }

// export function dispatchWrapper(dispatch: (action: Action) => void) {
//     return function (action: Action) {
//         if (isPromise(action.payload)) {
//             if (action.needLoading) {
//                 dispatch({ type: 'loadingStart' });
//             }
//             action.payload
//                 .then((data: any) => {
//                     const patchData: Action = { type: action.type, payload: data };
//                     if (action.needLoading) {
//                         patchData.loading = false;
//                     }
//                     dispatch(patchData);
//                     action?.callback?.(null, data);
//                 })
//                 .catch((error: Error) => {
//                     if (action.needLoading) {
//                         dispatch({ type: 'loadingEnd' });
//                     }
//                     action?.callback?.(error, null);
//                 });
//         } else {
//             dispatch(action);
//         }
//     };
// }

export interface IPickerContext extends PickerState {
    // state: PickerState;
    dispatch: Dispatcher;
}
const PickerContext = React.createContext<IPickerContext>({} as unknown as IPickerContext);
export default PickerContext;
