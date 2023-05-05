export type QueryMode =
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26
    | 27
    | 28
    | 29
    | 30
    | 31
    | 32
    | 33
    | 34
    | 35
    | 36
    | 37
    | 38
    | 39
    | 40
    | 41
    | 42
    | 43
    | 44
    | 45
    | 46
    | 47
    | 48
    | 49
    | 50
    | 51
    | 52
    | 53
    | 54
    | 55
    | 56
    | 57
    | 58
    | 59
    | 60
    | 61
    | 62
    | 63;

export interface ContactPickerQueryProps {
    teamId: string;
    folderId: string;
    pageId: string;
    scene: 'invite' | 'share';
    mode: QueryMode;
}

export type Type = 'recent' | 'user' | 'group' | 'mailGroup' | 'org' | 'space';

export interface CustomTab {
    key: string;
    tabName: string;
    opts?: Record<string, any>;
}

export interface DataItemCommon {
    type: Type;
    id: string;
    mode: QueryMode;
    title: string;
    avatarUrl: string;
    subTitle?: string;
    selected?: boolean;
    disabled?: boolean;
    valid: 0 | 1;
    isValid?: boolean;
    isUsed?: number;
    gid?: string;
    contact?: Record<string, any>;
    extend?: Record<string, any>;
}

export interface DataCustomItem extends DataItemCommon {
    // type: string;
}

export interface DataUserItem extends DataItemCommon {
    type: 'user';
    mode: 1;
    userId: string;
    tenantId: string;
    username: string;
    positionName: string;
    fullOrgName: string;
}

export interface DataGroupItem extends DataItemCommon {
    type: 'group';
    mode: 4;
    gid: string;
    name: string;
}

export interface DataMailGroupItem extends DataItemCommon {
    type: 'mailGroup';
    mode: 8;
    samAccount: string;
    name: string;
}

export interface DataOrgItem extends DataItemCommon {
    type: 'org';
    mode: 2;
    code: string;
    tenantId: string;
    name: string;
    fullName: string;
}

export interface DataRecentItem extends DataItemCommon {
    type: 'recent';
    mode: 32;
    name: string;
    tenantId: string;
    username?: string;
    positionName?: string;
    fullOrgName?: string;
    gid?: string;
}

export interface DataSpaceItem extends DataItemCommon {
    type: 'space';
    mode: 16;
    // userId: string;
    // tenantId: string;
    // username: string;
    // positionName: string;
    // fullOrgName: string;
}

// export type DataItem = DataRecentItem | DataUserItem | DataGroupItem | DataMailGroupItem | DataOrgItem | DataSpaceItem;

export type BreadcrumbProps = Partial<Record<Type, { id: string; label: string }[]>>;

// 输出类型
export interface UseSelectionResult {
    loadTabData: (
        tabKey: Type | string,
        pageParam?: { start: number; length: number },
        options?: { needLoading: boolean },
    ) => Promise<void>; // tab 点击的回调
    onExpandClick: (item: DataItemCommon) => void; // 列表项点击展开
    onItemClick: (id: string, checked: boolean, searchMode?: boolean) => Promise<void>; // 列表项点击选中、取消选中
    selectAll: (selected: boolean) => void;
    selectedData: Array<DataItemCommon>; // 选中的数据集合
    data: Partial<Record<Type, Array<DataItemCommon>>>; // 数据集合
    expandData: Array<DataItemCommon>; // 数据集合
    searchData: Partial<Record<Type, Array<DataItemCommon>>>; // 搜索数据集合
    breadcrumbProps?: BreadcrumbProps; // 可以展开数据的面包屑props
    activeTab: Type | string;
}

// 输入类型
export interface UseSelectionProps {
    /**
     * 默认支持的tab 和自定义的tab keys集合
     */
    tabKeys?: Type[] | string[];
    /**
     * 支持展开数据的key
     */
    expandTabKeys?: Type[] | string[];
    /**
     * 选中的数据项
     */
    selectedList?: DataItemCommon[]; // 选中的数据项
    /**
     * 禁用的数据项
     */
    disabledList?: Pick<DataItemCommon, 'id' | 'selected'>[]; // 禁用的数据项
    /**
     * 获取tab数据
     * @param tabKey
     * @returns
     */
    getTabData: (
        tabKey: Type | string,
        pageParam?: {
            start: number;
            length: number;
        },
        opts?: {
            searchValue?: string;
            teamId?: string;
        },
    ) => Promise<{ data: DataItemCommon[]; total: number }>;
    /**
     * 获取展开数据
     * @param item
     * @returns
     */
    getExpandData?: (item: DataItemCommon) => Promise<DataItemCommon[]>;

    /**
     * 获取埋点数据
     * @param type
     * @returns
     */
    getClsTag?: (type: Type) => string;
    // pageParam?: PageParam; // 分页参数
    // showSelectedItem?: boolean; // 是否显示传入的选中数据项-右侧列表
    // showDisabledItem?: boolean; // 是否显示传入的禁用数据项-右侧列表
}

export interface RightCompProps {
    selectedData?: DataItemCommon[];
    handleItemRemove: (item: DataItemCommon) => Promise<void>;
}

export interface RightCompRefProps {
    getResult: () => {
        extend?: Record<string, string>;
        listMap?: Record<string, Record<string, Record<string, string>>>;
    };
}

export interface ContactPickerProps extends UseSelectionProps {
    /**
     * 用户信息
     */
    userInfo: UserInfo;
    /**
     * 标题
     *  @title
     */
    title?: string;
    /**
     * 获取选中的回调
     *  @callback
     */
    onResult?: (result: PickerResult) => Promise<void>;
    /**
     * 不同mod 展示不同的tab,
     *  @mode
     * 1 展示联系人tab
     * 2组织机构
     * 4群组
     * 8邮件组
     * 16外部联系人
     * 32团队，团队MODE需要根据传入的team ID判断是否有效
     */
    // mode?: number;
    /**
     * app区分最近打开数据来源,默认joyspace
     *  @app
     */
    // app?: 'joySpace' | 'joyDay' | 'joyWork';
    /**
     *
     *  @scene
     */
    scene?: string;
    /**
     * joySpace空间ID
     *  @teamId
     */
    teamId?: string;
    /**
     * 确认按钮名称
     *  @okText
     */
    okText?: string;
    /**
     * 取消按钮名称
     *  @okText
     */
    cancelText?: string;
    /**
     * 选择器右侧显示组件，可自定义其他功能
     *  @rightComp
     */
    RightComp?: React.ForwardRefExoticComponent<RightCompProps & React.RefAttributes<RightCompRefProps>>;
    /**
     * 搜索框placeholder
     */
    placeholder?: string;
    /**
     * 获取搜索数据
     * @param item
     * @returns
     */
    getSearchData?: (
        keyword: string,
        tabKey: Type | string,
        opts?: Record<string, string>,
    ) => Promise<Partial<Record<Type, DataItemCommon[]>>>;
    /**
     * 可以展开的项是否可选择
     */
    canSelectedExpandKeys?: boolean;

    /**
     * 多语言
     */
    lang?: 'zh-CN' | 'en-US' | 'zh_CN' | 'en_US' | string;

    /**
     * 样式类名
     */
    className?: string;

    /**
     * 自定义tab集合
     */
    customTabs?: CustomTab[];
    /**
     * 开启单选
     */
    selectSingle?: boolean;
    /**
     * 禁用搜索功能
     */
    disableSearch?: boolean;
}

export interface UserInfo {
    teamId: string;
    userId: string;
    tenantId?: string;
    appId?: string;
    account: string;
    realName: string;
}

// 'recent' | 'user' | 'group' | 'mailGroup' | 'org' | 'space' | string;
// tab切换类型
export enum TabsTypeEnum {
    Recent = 'recent', // 最近联系人
    User = 'user', // 联系人
    Group = 'group', //  群组
    Space = 'space', // 空间成员
    Org = 'org', // 组织架构
    MailGroup = 'mailGroup', // 邮件组
}

export interface PickerResult {
    action: 'cancel' | 'confirm'; //  cancel（取消）、confirm（确认）
    data?: {
        items: DataItemCommon[];
        extend?: Record<string, string>;
    };
}

export enum LoadingEnum {
    Unloading = 0,
    Loading = 1,
    Error = 2,
}
