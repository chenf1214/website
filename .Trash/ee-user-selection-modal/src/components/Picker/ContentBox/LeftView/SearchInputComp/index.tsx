import { Input } from 'antd';
import { debounce } from 'lodash-es';
import React, { useCallback } from 'react';
import { ContactPickerProps, TabsTypeEnum, UseSelectionResult, LoadingEnum } from '../../../../../types';
import PickerContext, { IPickerContext } from '../../../../context/PickerContext';
import withContext from '../../../../context/withContext';
import { setItemData } from '../../../../hooks/utils';
import IconFont from '../../../../icon/IconFont';
import useGetOpts from '../../../../hooks/useGetOpts';

import './index.less';

type IProps = Pick<UseSelectionResult, 'loadTabData'> &
    Pick<ContactPickerProps, 'getSearchData'> &
    Pick<
        IPickerContext,
        'placeholder' | 'activeTab' | 'tabKeys' | 'langConfig' | 'selectedData' | 'disabledList' | 'dispatch'
    >;

function SearchInputComp(props: IProps) {
    const {
        placeholder,
        activeTab,
        tabKeys,
        langConfig,
        selectedData,
        disabledList,
        dispatch,
        loadTabData,
        getSearchData,
    } = props;

    const { getOpts } = useGetOpts();

    // 获取数据并解析
    const doSearch = useCallback(
        async (keyword: string) => {
            if (!keyword) {
                return;
            }
            let tabKey = activeTab;
            if (tabKey === TabsTypeEnum.Recent) {
                const index = tabKeys.findIndex((item) => item !== TabsTypeEnum.Recent);
                if (index < 0) {
                    return;
                }
                tabKey = tabKeys[index];
            }
            dispatch({ type: 'setLoading', payload: { loading: LoadingEnum.Loading } });
            const opts = getOpts(tabKey);

            const res = await getSearchData(keyword, tabKey, opts);

            let list = res[tabKey];
            list = list.map((item) => {
                setItemData(item, { selectedData, disabledList });
                return item;
            });
            dispatch({ type: 'setLoading', payload: { loading: LoadingEnum.Unloading } });
            dispatch({
                type: 'setSearchData',
                payload: {
                    data: { recent: [], user: [], group: [], mailGroup: [], org: [], space: [], [tabKey]: list },
                    activeTab: tabKey,
                },
            });
            return;
        },
        [activeTab, disabledList, dispatch, getOpts, getSearchData, selectedData, tabKeys],
    );

    const debounceChange = React.useMemo(() => {
        return debounce(async (value) => {
            // 暴露给调用方的input的值
            dispatch({ type: 'setSearchValue', payload: { searchValue: value } });
            if (value) {
                await doSearch(value);
            } else {
                let tabKey = activeTab;
                if (tabKey === TabsTypeEnum.Recent) {
                    const index = tabKeys.findIndex((item) => item !== TabsTypeEnum.Recent);
                    if (index < 0) {
                        return;
                    }
                    tabKey = tabKeys[index];
                }
                loadTabData(tabKey);
            }
        }, 300);
    }, [activeTab, dispatch, doSearch, loadTabData, tabKeys]);

    const onChangeHandler = React.useCallback(
        (e: any) => {
            const value = e.target.value?.trim();
            debounceChange(value);
        },
        [debounceChange],
    );

    return (
        <div className="ee-contacts-picker__search">
            <Input
                className="ee-contacts-picker__search-input"
                prefix={<IconFont type="icon-general-search" style={{ color: '#BFC1C4' }} />}
                onChange={onChangeHandler}
                allowClear
                placeholder={placeholder || langConfig.searchPlaceholder}
            />
        </div>
    );
}

export default withContext(
    PickerContext,
    ['placeholder', 'activeTab', 'tabKeys', 'langConfig', 'selectedData', 'disabledList', 'dispatch'],
    SearchInputComp,
);
