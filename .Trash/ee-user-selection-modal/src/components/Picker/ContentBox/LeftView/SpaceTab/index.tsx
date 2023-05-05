import { Tabs } from 'antd';
import React, { useCallback, useMemo } from 'react';
import IconFont from '../../../../icon/IconFont';
import { DataItemCommon, Type, UseSelectionResult, ContactPickerProps, LoadingEnum } from '../../../../../types';
import PickerContext, { IPickerContext } from '../../../../context/PickerContext';
import TableData from '../TableData';
import InfiniteScrollList from '../TableData/InfiniteScrollList';
import './index.less';
import { setItemData } from '../../../../hooks/utils';
import withContext from '../../../../context/withContext';
import useGetOpts from '../../../../hooks/useGetOpts';

type Props = {
    handlerItemClick: (item: DataItemCommon) => void;
} & Pick<UseSelectionResult, 'onExpandClick' | 'loadTabData'> &
    Pick<ContactPickerProps, 'getSearchData' | 'getClsTag'> &
    Pick<
        IPickerContext,
        | 'searchValue'
        | 'openCrumbs'
        | 'userInfo'
        | 'searchMode'
        | 'langConfig'
        | 'selectedData'
        | 'disabledList'
        | 'tabKeys'
        | 'data'
        | 'activeTab'
        | 'expandData'
        | 'searchData'
        | 'breadcrumbProps'
        | 'total'
        | 'dispatch'
        | 'customTabs'
    >;

function SpaceTab(props: Props) {
    const {
        onExpandClick,
        loadTabData,
        handlerItemClick,
        getSearchData,
        getClsTag,
        searchValue,
        openCrumbs,
        userInfo,
        searchMode,
        langConfig,
        selectedData,
        disabledList,
        tabKeys: sourceTabKeys,
        data,
        activeTab,
        expandData,
        searchData,
        breadcrumbProps,
        customTabs,
        total,
        dispatch,
    } = props;

    const { getOpts } = useGetOpts();

    const loadSearchData = useCallback(
        async (tabKey: Type) => {
            dispatch({ type: 'setLoading', payload: { loading: LoadingEnum.Loading } });
            // 获取请求的opts
            const opts = getOpts(tabKey);
            const res = await getSearchData(searchValue, tabKey, opts);
            let list = res[tabKey];
            list = list.map((item) => {
                setItemData(item, { selectedData, disabledList });
                return item;
            });
            dispatch({ type: 'setLoading', payload: { loading: LoadingEnum.Unloading } });
            searchData[tabKey] = list;
            dispatch({
                type: 'setSearchData',
                payload: { data: { ...searchData }, activeTab: tabKey },
            });
        },
        [disabledList, dispatch, getOpts, getSearchData, searchData, searchValue, selectedData],
    );

    // tabs 的值
    const onTabClicks = useCallback(
        async (tabKey) => {
            if (tabKey === activeTab) {
                return;
            }
            // 埋点数据
            const cslTag = getClsTag?.(tabKey);
            if (cslTag && userInfo?.account) {
                const [a, b] = cslTag.split('|');
                // @ts-ignore
                window?.log && window?.log(a, b || '', userInfo.account);
            }

            if (searchMode) {
                if (searchData[tabKey]?.length > 0) {
                    dispatch({
                        type: 'setActiveTab',
                        payload: { activeTab: tabKey },
                    });
                    return;
                }
                await loadSearchData(tabKey);
            } else {
                await loadTabData(tabKey);
            }
        },
        [activeTab, dispatch, getClsTag, loadSearchData, loadTabData, searchData, searchMode, userInfo?.account],
    );

    // tab渲染数据
    const tabData: { [key: string]: string } = useMemo(() => {
        const data = {
            recent: langConfig.recent,
            user: langConfig.user,
            group: langConfig.group,
            space: langConfig.space,
            org: langConfig.org,
            mailGroup: langConfig.mailGroup,
        };
        // 设置自定义tab
        if (customTabs?.length > 0) {
            customTabs.forEach((item) => {
                data[item.key] = item.tabName;
            });
        }
        return data;
    }, [langConfig, customTabs]);

    const getTabDataList = React.useCallback(
        (key: Type) => {
            if (expandData.length && openCrumbs) {
                return expandData;
            }
            if (searchMode) {
                return searchData[key] || [];
            }
            return data[key] || [];
        },
        [data, expandData, openCrumbs, searchData, searchMode],
    );

    const tabKeys = React.useMemo(() => {
        const keys = [...sourceTabKeys] || ['recent', 'user', 'group', 'mailGroup'];
        if (searchMode) {
            const index = keys.findIndex((item) => item === 'recent');
            if (index > -1) {
                keys.splice(index, 1);
            }
        }
        return keys;
    }, [searchMode, sourceTabKeys]);

    if (!tabKeys) {
        return null;
    }

    return (
        <Tabs
            defaultActiveKey={tabKeys[0]}
            tabPosition="top"
            style={{ flex: 1 }}
            onTabClick={onTabClicks}
            className="ee-contacts-picker__tabs"
            moreIcon={<IconFont type="icon-general-ellipsis" />}
            destroyInactiveTabPane={true}
        >
            {tabKeys.map((key: Type) => {
                if (key === 'space') {
                    return (
                        <Tabs.TabPane key={key} tab={tabData[key]}>
                            <InfiniteScrollList
                                list={getTabDataList(key)}
                                tabType={key}
                                tabData={tabData}
                                total={total}
                                onItemClick={handlerItemClick}
                                loadTabData={loadTabData}
                            />
                        </Tabs.TabPane>
                    );
                }
                return (
                    <Tabs.TabPane key={key} tab={tabData[key]}>
                        <div
                            className="ee-contacts-picker__scroll"
                            style={{
                                width: '100%',
                                height: '100%',
                                overflow: breadcrumbProps?.[key] ? 'hidden' : 'auto',
                            }}
                        >
                            <TableData
                                list={getTabDataList(key)}
                                onItemClick={handlerItemClick}
                                onExpandClick={onExpandClick}
                                tabType={key}
                                tabData={tabData}
                            />
                        </div>
                    </Tabs.TabPane>
                );
            })}
        </Tabs>
    );
}
export default withContext(
    PickerContext,
    [
        'searchValue',
        'openCrumbs',
        'userInfo',
        'searchMode',
        'langConfig',
        'selectedData',
        'disabledList',
        'tabKeys',
        'data',
        'activeTab',
        'expandData',
        'searchData',
        'breadcrumbProps',
        'total',
        'dispatch',
        'customTabs',
    ],
    SpaceTab,
);
