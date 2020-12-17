declare namespace Page {
  interface Item {
    _id: string;
    url: string;
    content: string;
    updateTime: number;
    endTime: number;
    createTime: number;
    title: string;
    description: string;
    keyword: string;
	}

	interface AddPageType {
		grouping: string; // 分组
		content: string;
		title: string,
  }

  interface AddCategoryType {
		'category_name': string;
	}
}
