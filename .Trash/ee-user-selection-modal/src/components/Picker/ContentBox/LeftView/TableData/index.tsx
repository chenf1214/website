import List from 'rc-virtual-list';
import React, { useMemo } from 'react';
import { DataItemCommon, LoadingEnum, Type } from '../../../../../types';
import PickerContext, { IPickerContext } from '../../../../context/PickerContext';
import withContext from '../../../../context/withContext';
import Loading from '../../../../Loading';
import Breadcrumb from '../Breadcrumb';
import TableDataItem from '../TableDataItem';
import './index.less';
import NoData from './NoData';

interface Props {
    list: Array<DataItemCommon> | [];
    tabType: Type;
    tabData: { [key: string]: string };
    onItemClick: (item: DataItemCommon) => void;
    onExpandClick?: (item: DataItemCommon) => void; // 列表项点击展开
}
type IProps = Props & Pick<IPickerContext, 'activeTab' | 'loading' | 'breadcrumbProps' | 'openCrumbs'>;

function TableData(props: IProps) {
    const { list, onItemClick, onExpandClick, tabData, tabType, activeTab, loading, breadcrumbProps, openCrumbs } =
        props;
    // 渲染项
    const RenderItem = React.useCallback(
        (item: DataItemCommon) => {
            return <TableDataItem item={item} onExpandClick={onExpandClick} onItemClick={onItemClick} key={item.id} />;
        },
        [onExpandClick, onItemClick],
    );

    const BreadcrumbNode = useMemo(() => {
        return <Breadcrumb tabType={tabType} />;
    }, [tabType]);

    // 渲染主体
    const RenderContent = useMemo(() => {
        // 空间成员
        if (activeTab === 'space') {
            return list.map((item) => {
                return RenderItem(item);
            });
        }
        // 普通滚动
        if ((list && list.length < 8 && list.length > 0) || !breadcrumbProps?.[tabType]) {
            return (
                <>
                    {BreadcrumbNode}
                    {list.map((item) => {
                        return RenderItem(item);
                    })}
                </>
            );
        }
        return (
            <>
                {BreadcrumbNode}
                <List data={list} height={openCrumbs ? 386 : 418} itemHeight={56} itemKey="id">
                    {(item) => {
                        return RenderItem(item);
                    }}
                </List>
            </>
        );
    }, [BreadcrumbNode, RenderItem, activeTab, breadcrumbProps, list, openCrumbs, tabType]);

    if (loading === LoadingEnum.Loading) {
        return <Loading />;
    }

    if (loading === LoadingEnum.Error || !list.length) {
        return (
            <div className="ee-contacts-picker__left-list-wrap">
                <NoData tabData={tabData} />
            </div>
        );
    }

    return <div className="ee-contacts-picker__left-list-wrap">{RenderContent}</div>;
}

export default withContext(PickerContext, ['activeTab', 'loading', 'breadcrumbProps', 'openCrumbs'], TableData);
