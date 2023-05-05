import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Type } from '../../../../../types';
import PickerContext, { IPickerContext } from '../../../../context/PickerContext';
import withContext from '../../../../context/withContext';
import useSelectAll from '../../../../hooks/useSelectAll';
import IconFont from '../../../../icon/IconFont';
import './index.less';
import { Checkbox } from 'antd';

interface Props {
    tabType: Type;
}

type IProps = Props & Pick<IPickerContext, 'openCrumbs' | 'breadcrumbProps' | 'expandData' | 'langConfig' | 'dispatch'>;

function Breadcrumb({ tabType }: IProps) {
    const { lang, openCrumbs, breadcrumbProps, expandData, langConfig, selectSingle, dispatch } =
        React.useContext(PickerContext);
    const [checked, setChecked] = useState(false);
    const selectAll = useSelectAll();

    const onCheckbox = useCallback(() => {
        setChecked(!checked);
        selectAll(!checked);
    }, [checked, selectAll]);

    const crumb = useMemo(() => {
        const data = breadcrumbProps?.[tabType];
        if (data && data.length > 0) {
            return data[0];
        }
        return null;
    }, [breadcrumbProps, tabType]);

    const isEN = useMemo(() => {
        return lang?.toLowerCase().indexOf('en') > -1;
    }, [lang]);

    useEffect(() => {
        if (!expandData?.length) {
            return;
        }
        const index = expandData.findIndex((item) => {
            return !item.selected;
        });
        setChecked(index < 0);
    }, [expandData]);

    if (!openCrumbs) {
        return null;
    }

    if (!crumb) {
        return null;
    }

    return (
        <div className="ee-contacts-picker__breadcrumb">
            <div className="ee-contacts-picker__breadcrumb-left">
                <div
                    className="icon-direction-left"
                    onClick={() => {
                        dispatch({ type: 'setEnabled', payload: { bool: false } });
                    }}
                >
                    <IconFont type="icon-direction-left" />
                </div>
                <div className="breadcrumb-left-name" key={crumb.id}>
                    「<span className={`g-name ${isEN ? 'en' : ''} ellipsis`}>{crumb.label}</span>」
                    <span className="g-name-ext">{langConfig.member}</span>
                </div>
            </div>
            {/** 非单选模式 才可以存在全选操作 */}
            {!selectSingle && (
                <div className="ee-contacts-picker__breadcrumb-right" onClick={onCheckbox}>
                    <Checkbox checked={checked} />
                    <div className="breadcrumb-right-selectAll">{langConfig.select_All}</div>
                </div>
            )}
        </div>
    );
}

export default withContext(
    PickerContext,
    ['openCrumbs', 'breadcrumbProps', 'expandData', 'langConfig', 'dispatch'],
    Breadcrumb,
);
