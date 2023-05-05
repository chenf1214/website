import { Spin } from 'antd';
import { debounce } from 'lodash-es';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import TableData from '.';
import { DataItemCommon, LoadingEnum, Type, UseSelectionResult } from '../../../../../types';
import PickerContext, { IPickerContext } from '../../../../context/PickerContext';
import withContext from '../../../../context/withContext';
import Loading from '../../../../Loading';
import './index.less';

type Props = {
    onItemClick: (item: DataItemCommon) => void;
    tabType: Type;
    tabData: { [key: string]: string };
    list: Array<DataItemCommon> | [];
    total: number;
} & Pick<UseSelectionResult, 'loadTabData'> &
    Pick<IPickerContext, 'activeTab' | 'loading' | 'searchMode'>;

function InfiniteScrollList(props: Props) {
    const {
        tabType,
        tabData,
        list,
        searchMode,
        loadTabData,
        onItemClick,
        total,
        activeTab,
        loading: globalLoading,
    } = props;

    const [pageState, setPageState] = React.useState({ start: 0, length: 20 });
    const [loading, setLoading] = React.useState(false);
    const [ref, setRef] = React.useState(null);

    const handleInfiniteOnLoad = React.useMemo(() => {
        return debounce(async () => {
            const { start, length } = pageState;
            try {
                setLoading(true);
                const pageStart = start + length;
                await loadTabData(tabType, { start: pageStart, length: 20 }, { needLoading: false });
                setLoading(false);
                setPageState({ start: pageStart, length: 20 });
            } catch (e) {
                setLoading(false);
            }
        }, 300);
    }, [loadTabData, pageState, tabType]);

    const hasMore = React.useMemo(() => {
        return total > pageState.length + pageState.start;
    }, [pageState.length, pageState.start, total]);

    if (globalLoading === LoadingEnum.Loading) {
        return <Loading />;
    }

    if (activeTab !== tabType) {
        return null;
    }

    return (
        <div
            className="ee-contacts-picker__scroll"
            style={{ width: '100%', height: '100%', overflow: 'auto' }}
            ref={(ref) => {
                setRef(ref);
            }}
        >
            <InfiniteScroll
                key={tabData[tabType]}
                initialLoad={false}
                loadMore={() => {
                    if (searchMode) {
                        return;
                    }
                    handleInfiniteOnLoad();
                }}
                hasMore={hasMore || !loading}
                useWindow={false}
                threshold={20}
                getScrollParent={() => ref}
                loader={
                    loading ? (
                        <div className="ee-contacts-picker__infinite-loader" key={0}>
                            <Spin />
                        </div>
                    ) : null
                }
            >
                <TableData list={list} onItemClick={onItemClick} tabType={tabType} tabData={tabData} />
            </InfiniteScroll>
        </div>
    );
}

export default withContext(PickerContext, ['activeTab', 'loading', 'searchMode'], InfiniteScrollList);
