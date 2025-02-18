/* 知识库类目表请求参数 */
export interface IKnowledgeCategoryListParams {
  parent_id: number // 目录父级ID，一级目录传0
}

/* 知识库类目表返回类型 */
export interface IKnowledgeCategoryListResponse {
  id: number // 类目ID
  parentId: number // 父级ID
  name: string // 类目名称
  logoUrl: string // 类目logo URL
  createdTime: number // 创建时间
  updatedTime: number // 更新时间
}

/* 知识库文件列表请求参数 */
export interface IKnowledgeDocumentListParams {
  category_id: number // 目录ID
  limit: number // 查询数量
  page: number // 当前页
}

/* 知识库文件列表返回类型 */
export interface IKnowledgeDocumentListResponse {
  id: number // 文档ID
  categoryId: number // 目录ID
  title: string // 文档标题
  keyword: string // 关键词
  filePath: string // 文件路径
  createdTime: number // 创建时间
  updatedTime: number // 更新时间
}
