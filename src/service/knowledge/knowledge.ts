import { knowledgeCategoryListApi, knowledgeDocumentListApi } from '@/common/api'
import { http } from '@/utils/http'
import {
  IKnowledgeCategoryListParams,
  IKnowledgeCategoryListResponse,
  IKnowledgeDocumentListParams,
  IKnowledgeDocumentListResponse,
} from './type'

/* 知识库类目表 */
export const postKnowledgeCategoryList = (params: IKnowledgeCategoryListParams) => {
  return http.post<IKnowledgeCategoryListResponse[]>(knowledgeCategoryListApi, params)
}

/* 知识库文件列表 */
export const postKnowledgeDocumentList = (params: IKnowledgeDocumentListParams) => {
  return http.post<IKnowledgeDocumentListResponse[]>(knowledgeDocumentListApi, params)
}
