import { BreadcrumbProps, DataItemCommon, Type } from '../../types';
import { PickerState } from './PickerContext';

interface DispatchHandler {
    loadingStart: {};
    loadingEnd: {};
    setLoading: { loading: number };
    setEnabled: { bool: boolean };
    setVisible: { visible: boolean };
    setSearchValue: { searchValue: string };
    initData: {
        initState: any;
        loading: number;
    };
    initTabData: {
        data: any;
        loading: number;
    };

    setActiveTab: { activeTab: Type };
    updateTabData: { tabData: DataItemCommon[]; activeTab: Type; total: number };
    setSearchData: { data: Partial<Record<Type, DataItemCommon[]>>; activeTab: Type | string };
    setData: {
        data?: Record<Type, DataItemCommon[]>;
        searchData?: Record<Type, DataItemCommon[]>;
        selectedData?: DataItemCommon[];
        expandData?: DataItemCommon[];
    };
    setExpandData: { expandData?: DataItemCommon[]; breadcrumbProps?: BreadcrumbProps };
    expandDataSelected: {
        selectedData: DataItemCommon[];
        expandData: DataItemCommon[];
        data?: Partial<Record<Type, Array<DataItemCommon>>>;
    };
}

const reduceHandle: {
    [Key in keyof DispatchHandler]: (state: PickerState, payload: DispatchHandler[Key]) => PickerState;
} = {
    loadingStart: function (state: PickerState): PickerState {
        return { ...state, loading: 1 };
    },
    loadingEnd: function (state: PickerState): PickerState {
        return { ...state, loading: 0 };
    },
    setLoading: (state, payload) => {
        const { loading } = payload;
        return { ...state, loading };
    },
    initData: (state, payload) => {
        const { initState, loading } = payload;
        if (!initState) {
            return state;
        }
        return {
            ...state,
            ...initState,
            loading,
        };
    },
    initTabData: (state, payload) => {
        const { data, loading } = payload;
        if (!data) {
            return state;
        }
        return {
            ...state,
            data,
            loading,
        };
    },
    setEnabled: (state, payload) => {
        const { bool } = payload;
        const { activeTab, data } = state;
        const newState = {
            openCrumbs: bool,
        };
        if (!bool) {
            Object.assign(newState, { expandData: [] });
        }
        return {
            ...state,
            ...newState,
            breadcrumbProps: {},
        };
    },
    // 修改组件的可见状态
    setVisible: (state, payload) => {
        const { visible } = payload;
        return { ...state, visible, searchMode: false, searchValue: '' };
    },
    setSearchValue: (state, payload) => {
        const { searchValue } = payload;
        return { ...state, searchValue, searchMode: !!searchValue };
    },
    setActiveTab: (state, payload) => {
        const { activeTab } = payload;
        return {
            ...state,
            activeTab,
        };
    },
    updateTabData: (state, payload) => {
        const { tabData, activeTab, total } = payload;
        const { data } = state;
        // const originData = data[activeTab] || [];
        data[activeTab] = tabData;
        return {
            ...state,
            activeTab,
            data,
            expandData: [],
            total,
            openCrumbs: false,
        };
    },
    setSearchData: (state, payload) => {
        const { data, activeTab } = payload;
        return {
            ...state,
            searchData: data,
            activeTab,
            openCrumbs: false,
        };
    },
    setData: (state, payload) => {
        const { data, searchData, selectedData, expandData } = payload;
        const newState = { selectedData };
        if (data) {
            Object.assign(newState, { data });
        }
        if (searchData) {
            Object.assign(newState, { searchData });
        }
        if (expandData) {
            Object.assign(newState, { expandData });
        }
        return {
            ...state,
            ...newState,
        };
    },
    setExpandData: (state, payload) => {
        const { expandData, breadcrumbProps } = payload;
        const newState = {};
        if (expandData) {
            Object.assign(newState, { expandData });
        }
        if (breadcrumbProps) {
            Object.assign(newState, { breadcrumbProps });
        }
        return {
            ...state,
            ...newState,
        };
    },
    expandDataSelected: (state, payload) => {
        const { selectedData, expandData, data } = payload;

        const newState = {
            expandData: expandData,
            selectedData: selectedData,
        };
        if (data) {
            Object.assign(newState, { data });
        }
        return {
            ...state,
            ...newState,
        };
    },
};

export default reduceHandle;

export interface Action {
    type: keyof typeof reduceHandle;
    needLoading?: boolean;
    loading?: boolean;
    payload?: any;
    callback?: (error: Error | null, data: any) => void;
}

export function reducer<Key extends string & keyof DispatchHandler>(
    state: PickerState,
    action: { type: Key; payload: never },
): PickerState {
    const { payload, type } = action;
    return reduceHandle[type](state, payload);
}

export type Dispatcher = <Key extends string & keyof DispatchHandler>(opts: {
    type: Key;
    payload: DispatchHandler[Key];
}) => void;
