import React from 'react';
import PickerContext, { pickerState } from '../../../../context/PickerContext';
import xss from 'xss-filters';
import { Type } from '../../../../../types';

interface Props {
    tabData: { [key: string]: string };
}

export default function NoData({ tabData }: Props) {
    const { langConfig, lang, searchValue, activeTab } = React.useContext(PickerContext);

    const userFoundHint = React.useMemo(() => {
        const ele = `<span>${searchValue}</span>`;
        if (lang === 'en_US') {
            return `${langConfig.noResultsWith?.replace('%s', ele)}`;
        }
        return `${langConfig.noResultsWith?.replace('%s', ele)}${tabData[activeTab]}`;
    }, [lang, langConfig.noResultsWith, searchValue, tabData, activeTab]);

    return (
        <div className="left-list-no-data">
            <div className="left-list-no-data-img">
                <img src="https://storage.360buyimg.com/joyday/static/selector_no_data.png" alt="" />
                <div
                    className="left-list-no-data-hint"
                    dangerouslySetInnerHTML={{
                        __html: searchValue ? xss.inHTMLComment(userFoundHint) : langConfig.searchTip,
                    }}
                />
            </div>
        </div>
    );
}
