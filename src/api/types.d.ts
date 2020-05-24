export interface IArticleData {
  id: number
  status: string
  title: string
  abstractContent: string
  fullContent: string
  sourceURL: string
  imageURL: string
  timestamp: string | number
  platforms: string[]
  disableComment: boolean
  importance: number
  author: string
  reviewer: string
  type: string
  pageviews: number
}

export interface Page {
  _id: string;
  url: string;
  content: string;
  updatedTime: number;
  endTime: number;
  createdTime: number;
  title: string;
  description: string;
  keyword: string;
}
