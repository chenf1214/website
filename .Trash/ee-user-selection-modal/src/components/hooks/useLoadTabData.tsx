import React from 'react';
import { Type, UseSelectionProps, LoadingEnum } from '../../types';
import PickerContext from '../context/PickerContext';
import { setItemData } from './utils';
import { isUndefined } from 'lodash-es';
import useGetOpts from './useGetOpts';

export default function useLoadTabData(props: UseSelectionProps) {
    const { selectedData, disabledList, data: dataMap, dispatch } = React.useContext(PickerContext);
    // 加载tab 数据
    const { getTabData } = props;
    const { getOpts } = useGetOpts();
    const loadTabData = React.useCallback(
        async (tabKey: Type, pageParam?: { start: number; length: number }, options?: { needLoading: boolean }) => {
            const needLoading = isUndefined(options?.needLoading) ? true : options?.needLoading;

            if (needLoading) {
                dispatch({ type: 'setLoading', payload: { loading: LoadingEnum.Loading } });
            }

            const opts = getOpts(tabKey);
            let { start = 0, length = 20 } = pageParam || {};

            let { data, total } = await getTabData(tabKey, { start, length }, opts);

            if (selectedData?.length > 0 || disabledList?.length > 0) {
                data = data?.map((item) => {
                    return setItemData(item, { selectedData, disabledList });
                });
            }

            if (tabKey === 'space' && start > 0) {
                data = [...(dataMap['space'] || []), ...(data || [])];
            }

            if (needLoading) {
                dispatch({ type: 'setLoading', payload: { loading: LoadingEnum.Unloading } });
            }
            dispatch({
                type: 'updateTabData',
                payload: {
                    activeTab: tabKey,
                    tabData: data,
                    total,
                },
            });
        },
        [dataMap, disabledList, dispatch, getOpts, getTabData, selectedData],
    );

    return loadTabData;
}
